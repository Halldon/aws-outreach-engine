import { chromium } from 'playwright';

const routes = [
  'dashboard',
  'messages',
  'messages/inbox',
  'messages/scheduled',
  'messages/approved',
  'campaigns',
  'campaigns/create',
  'prospects',
  'prospects/warm-lists',
  'templates',
  'studio',
  'studio/create',
  'settings',
  'settings/integrations',
  'analytics',
  'approvals',
  'web-visitors',
  'connect-apify',
];

const DEMO_EMAIL = 'demo@awsoutreach.engine';
const DEMO_PASSWORD = 'AWSOutreachDemo123!';

const APP_URL = process.env.APP_URL || 'http://127.0.0.1:4173';
const forbiddenBrand = new RegExp(['v', 'a', 'l', 'l', 'e', 'y'].join(''), 'i');

const errors = [];
const pageOutputs = [];
const getCampaignCount = async (page) => {
  const directRows = await page.locator('main table tbody tr').count();
  if (directRows) return directRows;
  const fallbackRows = await page.locator('main .panel table tbody tr').count();
  return fallbackRows;
};
const assertNoForbiddenBrand = async (page, context) => {
  const renderedText = await page
    .evaluate(() => {
      const attrs = Array.from(document.querySelectorAll('[aria-label], [alt], [placeholder], [title]')).flatMap(
        (node) => ['aria-label', 'alt', 'placeholder', 'title'].map((name) => node.getAttribute(name)).filter(Boolean)
      );
      return [document.title, document.body?.innerText || '', ...attrs].join('\n');
    })
    .catch(() => '');
  if (forbiddenBrand.test(renderedText)) {
    errors.push({ type: 'brand', message: `Forbidden legacy brand text rendered on ${context}.` });
  }
};
const getVisibleMessageRowCount = async (page) =>
  page.evaluate(
    () =>
      Array.from(document.querySelectorAll('.message-row[data-search]')).filter((row) => {
        const style = window.getComputedStyle(row);
        return style.display !== 'none' && style.visibility !== 'hidden';
      }).length
  );
const assertWorkspaceRecovery = async (page, workspaceId, route, heading, backHrefPart) => {
  await page.goto(`${APP_URL}/#/workspace/${workspaceId}/${route}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(250);
  await assertNoForbiddenBrand(page, route);
  const bodyText = (await page.textContent('body')) || '';
  const recoveryHeading = ((await page.locator('main h3').first().textContent().catch(() => '')) || '').trim();
  const backLinkCount = await page.locator(`main a[href*="${backHrefPart}"]`).count();

  if (recoveryHeading !== heading || !bodyText.includes(heading) || backLinkCount === 0) {
    errors.push({
      type: 'routing',
      message: `Missing ${route} should render ${heading} recovery page with workspace navigation. Found heading "${recoveryHeading || '(none)'}" and ${backLinkCount} matching back link(s).`,
    });
  }
};

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1900 } });

  page.on('pageerror', (error) => errors.push({ type: 'pageerror', message: error.message }));
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push({ type: 'console', message: msg.text() });
    }
  });

  await page.goto(`${APP_URL}/#/login`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.goto(`${APP_URL}/login`, { waitUntil: 'domcontentloaded' });
  const directLoginHeading = await page.locator('h1').first().textContent().catch(() => '');
  if ((directLoginHeading || '').trim() !== 'Login') {
    errors.push({ type: 'routing', message: 'Direct /login route should render login page.' });
  }
  await assertNoForbiddenBrand(page, 'direct login');
  await page.goto(`${APP_URL}/#/login`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[name="email"]', { timeout: 30000 });
  await assertNoForbiddenBrand(page, 'hash login');

  const googleText = await page.locator('button#google-login').textContent().catch(() => null);
  if (!googleText || !googleText.includes('Continue with Google')) {
    errors.push({ type: 'logic', message: 'Login page missing Continue with Google CTA.' });
  }

  await page.fill('input[name="email"]', 'bad@example.com');
  await page.fill('input[name="password"]', 'wrong-pass');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(250);
  const badError = await page.locator('#login-error').isVisible().catch(() => false);
  if (!badError) {
    errors.push({ type: 'logic', message: 'Invalid login should show an error message.' });
  }

  await page.goto(`${APP_URL}/#/workspace/demo-workspace/dashboard`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(250);
  const redirectedToLogin = page.url().includes('/#/login');
  if (!redirectedToLogin) {
    errors.push({ type: 'logic', message: 'Unauthenticated workspace access should redirect to login.' });
  }

  await page.goto(`${APP_URL}/#/signup`, { waitUntil: 'domcontentloaded' });
  const signupHeading = await page.locator('h1').first().textContent().catch(() => '');
  if ((signupHeading || '').trim() !== 'Sign Up') {
    errors.push({ type: 'logic', message: 'Signup page should render with Sign Up heading.' });
  }
  await assertNoForbiddenBrand(page, 'signup');

  await page.goto(`${APP_URL}/#/reset-password`, { waitUntil: 'domcontentloaded' });
  const resetHeading = await page.locator('h1').first().textContent().catch(() => '');
  if ((resetHeading || '').trim() !== 'Forgot Password') {
    errors.push({ type: 'logic', message: 'Reset page should render with Forgot Password heading.' });
  }
  await assertNoForbiddenBrand(page, 'reset password');

  await page.goto(`${APP_URL}/#/login`, { waitUntil: 'domcontentloaded' });
  await page.fill('input[name="email"]', DEMO_EMAIL);
  await page.fill('input[name="password"]', DEMO_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/workspace/**/dashboard', { timeout: 120000 });

  const workspaceId = await page.evaluate(() => {
    const hash = window.location.hash.replace(/^#\//, '');
    const segments = hash.split('/');
    return segments[1];
  });

  await page.goto(`${APP_URL}/workspace/${workspaceId}/dashboard`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(250);
  const directDashboardText = (await page.textContent('body')) || '';
  if (!directDashboardText.includes('Welcome James')) {
    errors.push({ type: 'routing', message: 'Direct workspace dashboard route should render the dashboard.' });
  }
  await assertNoForbiddenBrand(page, 'direct dashboard');

  await page.goto(`${APP_URL}/#/workspace/${workspaceId}/dashboard`, { waitUntil: 'domcontentloaded' });
  const autopilotHref = await page.locator('main a[href*="/approvals"]').filter({ hasText: 'View Autopilot' }).getAttribute('href').catch(() => null);
  if (!autopilotHref) {
    errors.push({ type: 'logic', message: 'Dashboard should expose the reference-style View Autopilot approval queue link.' });
  }
  await page.goto(`${APP_URL}/#/workspace/${workspaceId}/approvals/apr_01`, { waitUntil: 'domcontentloaded' });
  const approvalDetailText = (await page.textContent('body')) || '';
  if (!approvalDetailText.includes('Open message') || !page.url().includes('/approvals/')) {
    errors.push({ type: 'routing', message: 'Approval detail route should render a review surface.' });
  }
  await assertNoForbiddenBrand(page, 'approval detail direct route');

  await page.goto(`${APP_URL}/#/workspace/${workspaceId}/messages/inbox`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(250);
  const messageRowsBefore = await getVisibleMessageRowCount(page);
  await page.fill('#message-search', 'Lena');
  await page.waitForTimeout(100);
  const messageRowsAfterSearch = await getVisibleMessageRowCount(page);
  if (!(messageRowsBefore > messageRowsAfterSearch && messageRowsAfterSearch > 0)) {
    errors.push({ type: 'logic', message: 'Message search should narrow visible rows without emptying a known match.' });
  }
  await page.click('[data-message-filter="clear"]');
  await page.waitForTimeout(100);
  await page.click('[data-message-filter="priority"]');
  await page.waitForTimeout(100);
  const messageRowsAfterFilter = await getVisibleMessageRowCount(page);
  if (!(messageRowsBefore > messageRowsAfterFilter && messageRowsAfterFilter > 0)) {
    errors.push({ type: 'logic', message: 'Message priority filter should narrow visible rows without emptying known matches.' });
  }
  await assertNoForbiddenBrand(page, 'message search and filter');

  for (const route of routes) {
    const target = `${APP_URL}/#/workspace/${workspaceId}/${route}`;
    await page.goto(target, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(350);

    const text = (await page.textContent('body')) || '';
    const h1Count = await page.locator('h1').count();
    pageOutputs.push({ route, hasText: !!text.trim(), h1Count });
    await assertNoForbiddenBrand(page, route);

    if (route === 'messages') {
      const link = page.locator('a[href*="/messages/m"]').first();
      const href = await link.getAttribute('href').catch(() => null);
      if (href) {
        const detailUrl = href.startsWith('#') ? `${APP_URL}/${href}` : `${APP_URL}/#${href}`;
        await page.goto(detailUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(250);
        const disabledApprove = await page
          .locator('button[data-action="message-action"][data-decision="approve"]')
          .first()
          .isDisabled()
          .catch(() => false);
        if (!disabledApprove) {
          errors.push({
            type: 'logic',
            message: 'Message approve action should be disabled before connecting Apify data connector',
          });
        }
        await assertNoForbiddenBrand(page, 'message detail before Apify connection');
      }
    }

    if (route === 'campaigns/create') {
      await page.goto(`${APP_URL}/#/workspace/${workspaceId}/campaigns`, { waitUntil: 'domcontentloaded' });
      const countBefore = await getCampaignCount(page);
      await page.goto(`${APP_URL}/#/workspace/${workspaceId}/campaigns/create`, { waitUntil: 'domcontentloaded' });
      await page.fill('input[name="name"]', 'Test campaign');
      await page.fill('input[name="audience"]', 'integration-check');
      await page.fill('input[name="message"]', 'Test opener');
      await page.fill('input[name="goal"]', '15%');
      await page.click('button[type="submit"]');
      await page.waitForURL(/#\/workspace\/[^/]+\/campaigns\/cmp_[^/]+$/, { timeout: 8000 }).catch(() => {
        errors.push({ type: 'routing', message: 'Campaign creation should redirect to the new detail route before Apify data import.' });
      });
      const draftText = (await page.textContent('body')) || '';
      if (!draftText.includes('Test campaign') || !draftText.includes('Run Apify Actor')) {
        errors.push({ type: 'logic', message: 'Created campaign should render a clear Run Apify Actor next step.' });
      }
      await page.goto(`${APP_URL}/#/workspace/${workspaceId}/campaigns`, { waitUntil: 'domcontentloaded' });
      const countAfter = await getCampaignCount(page);
      if (!(countAfter > countBefore)) {
        errors.push({ type: 'logic', message: 'Campaign should create before Apify data import so the demo flow can continue.' });
      }
      await page.goto(`${APP_URL}/#/workspace/${workspaceId}/campaigns/create`, { waitUntil: 'domcontentloaded' });
    }

  }

  // Verify actions can run after enabling Apify integration
  await page.goto(`${APP_URL}/#/connect-apify`, { waitUntil: 'domcontentloaded' });
  const apifyFormReady = (await page.locator('#apify-run-form').count()) === 1;
  const actorSelectReady = (await page.locator('select[name="actorId"]').count()) === 1;
  const liveRunButtonReady = (await page.locator('#run-apify-crawl').count()) === 1;
  if (!apifyFormReady || !actorSelectReady || !liveRunButtonReady) {
    errors.push({ type: 'logic', message: 'Apify connector page should expose Actor selection and live run controls.' });
  }
  const apifyStatus = await page
    .evaluate(async () => {
      const response = await fetch('/api/apify/status');
      return response.json();
    })
    .catch(() => null);
  if (!apifyStatus || !Array.isArray(apifyStatus.actors) || !apifyStatus.actors.includes('apify/website-content-crawler')) {
    errors.push({ type: 'api', message: 'Apify status endpoint should advertise the Website Content Crawler actor.' });
  }
  const connectButton = page.locator('button[data-action="toggle-integration"][data-provider="apify"]');
  if ((await connectButton.count()) > 0) {
    await connectButton.click();
    await page.waitForTimeout(250);
  }

  await page.goto(`${APP_URL}/#/workspace/${workspaceId}/campaigns/create`, { waitUntil: 'domcontentloaded' });
  await page.fill('input[name="name"]', 'Post-connect campaign');
  await page.fill('input[name="audience"]', 'integration-check');
  await page.fill('input[name="message"]', 'Test opener');
  await page.fill('input[name="goal"]', '15%');
  await page.click('button[type="submit"]');
  await page.waitForURL(/#\/workspace\/[^/]+\/campaigns\/cmp_[^/]+$/, { timeout: 8000 }).catch(() => {
    errors.push({ type: 'routing', message: 'Campaign creation after Apify connection should redirect to the new detail route.' });
  });
  const createdCampaignText = (await page.textContent('body')) || '';
  if (!page.url().includes('/campaigns/cmp_') || !createdCampaignText.includes('Post-connect campaign')) {
    errors.push({ type: 'logic', message: 'Created campaign detail page should render the new campaign draft.' });
  }
  await assertNoForbiddenBrand(page, 'created campaign detail');

  await page.goto(`${APP_URL}/#/workspace/${workspaceId}/messages`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(250);
  const anyMessageApprove = await page.locator('a[href*="/messages/m"]').first().getAttribute('href').catch(() => null);
  if (anyMessageApprove) {
    const detailUrl = anyMessageApprove.startsWith('#') ? `${APP_URL}/${anyMessageApprove}` : `${APP_URL}/#${anyMessageApprove}`;
    await page.goto(detailUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(250);
    const canApprove = await page
      .locator('button[data-action="message-action"][data-decision="approve"]')
      .first()
      .isDisabled()
      .catch(() => false);
    if (canApprove) {
      errors.push({ type: 'logic', message: 'Message approve still disabled after connecting Apify data connector' });
    }
    await assertNoForbiddenBrand(page, 'message detail after Apify connection');
  }

  await page.goto(`${APP_URL}/#/workspace/${workspaceId}/campaigns`, { waitUntil: 'domcontentloaded' });
  const finalCampaignCount = await getCampaignCount(page);
  if (finalCampaignCount < 4) {
    errors.push({ type: 'logic', message: 'Expected at least one campaign create path after connecting Apify data connector' });
  }

  const draftName = `Smoke studio draft ${Date.now()}`;
  await page.goto(`${APP_URL}/#/workspace/${workspaceId}/studio/create`, { waitUntil: 'domcontentloaded' });
  await page.fill('input[name="name"]', draftName);
  await page.fill('input[name="audience"]', 'smoke-test-audience');
  await page.fill('textarea[name="notes"]', 'Smoke draft notes should persist.');
  await page.click('#studio-form button[type="submit"]');
  await page.waitForURL(/#\/workspace\/[^/]+\/studio$/, { timeout: 5000 }).catch(() => {
    errors.push({ type: 'routing', message: 'Studio draft create should redirect back to studio.' });
  });
  let studioText = (await page.textContent('body')) || '';
  if (!studioText.includes(draftName)) {
    errors.push({ type: 'logic', message: 'Studio create should render the saved draft on the studio page.' });
  }
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(250);
  studioText = (await page.textContent('body')) || '';
  if (!studioText.includes(draftName)) {
    errors.push({ type: 'logic', message: 'Studio draft should persist after reloading local workspace state.' });
  }
  await assertNoForbiddenBrand(page, 'studio draft persistence');

  await assertWorkspaceRecovery(page, workspaceId, 'campaigns/cmp_missing_smoke', 'Campaign not found', '/campaigns');
  await assertWorkspaceRecovery(page, workspaceId, 'messages/m_missing_smoke', 'Message not found', '/messages/inbox');
  await assertWorkspaceRecovery(page, workspaceId, 'prospects/p_missing_smoke', 'Prospect not found', '/prospects');

  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['dashboard', 'messages/inbox']) {
    await page.goto(`${APP_URL}/#/workspace/${workspaceId}/${route}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(250);
    await assertNoForbiddenBrand(page, `mobile ${route}`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    if (overflow) {
      errors.push({ type: 'responsive', message: `${route} should not horizontally overflow on mobile.` });
    }
  }

  await browser.close();

  console.log('ROUTE_REPORT', JSON.stringify(pageOutputs, null, 2));
  if (errors.length) {
    console.log('SMOKE_FAIL', JSON.stringify(errors, null, 2));
    process.exitCode = 1;
    return;
  }
  console.log('SMOKE_PASS');
})();
