import { createServer } from 'node:http';
import { createServer as createHttpsServer } from 'node:https';
import { readFile, stat } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || '0.0.0.0';
const USE_HTTPS = process.env.HTTPS === '1';
const SSL_CERT_FILE = process.env.SSL_CERT_FILE || '';
const SSL_KEY_FILE = process.env.SSL_KEY_FILE || '';
const REMOTE_FALLBACK_ORIGIN = process.env.REMOTE_FALLBACK_ORIGIN || 'https://aws-outreach-engine.local';
const APIFY_ALLOWED_ACTORS = new Set(['apify/website-content-crawler', 'apify/google-search-scraper']);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const DYNAMIC_WORKSPACE_ID = 'demo-workspace';
const DYNAMIC_ITEM_ID = 'demo-id';

async function fileExists(filePath) {
  try {
    const fileStat = await stat(filePath);
    return fileStat.isFile();
  } catch {
    return false;
  }
}

function sanitizePath(urlPath) {
  let decoded = '';
  try {
    decoded = decodeURIComponent(urlPath.split('?')[0]);
  } catch {
    return null;
  }
  const normalized = path.posix.normalize(decoded);
  if (normalized.includes('..')) return null;
  return normalized;
}

async function resolveStaticFile(urlPath) {
  const cleanPath = sanitizePath(urlPath);
  if (!cleanPath) return null;

  const candidates = [];
  if (cleanPath.endsWith('/')) {
    candidates.push(`${cleanPath}index.html`);
  } else {
    candidates.push(cleanPath);
    candidates.push(`${cleanPath}/index.html`);
  }

  for (const candidate of candidates) {
    const abs = path.join(ROOT, candidate.replace(/^\/+/, ''));
    if (await fileExists(abs)) return abs;
  }

  const parts = cleanPath.split('/').filter(Boolean);
  if (parts[0] === 'workspace' && parts.length >= 2) {
    const suffix = parts.slice(2);

    if (suffix[0] === 'campaigns' && suffix[1] && suffix[1] !== 'create') {
      suffix[1] = DYNAMIC_ITEM_ID;
    }

    if (suffix[0] === 'prospects' && suffix[1] === 'warm-lists' && suffix[2] && suffix[2] !== 'setup') {
      suffix[2] = DYNAMIC_ITEM_ID;
    }

    const rewrittenBase = `/workspace/${DYNAMIC_WORKSPACE_ID}${suffix.length ? `/${suffix.join('/')}` : ''}`;
    const rewrittenCandidates = [
      rewrittenBase,
      `${rewrittenBase}/index.html`,
      `${rewrittenBase.replace(/\/+$/, '')}/index.html`,
    ];

    for (const candidate of rewrittenCandidates) {
      const abs = path.join(ROOT, candidate.replace(/^\/+/, ''));
      if (await fileExists(abs)) return abs;
    }
  }

  const appRoutes = new Set([
    'login',
    'signup',
    'reset-password',
    'setup-account',
    'connect-hubspot',
    'connect-slack',
    'connect-apify',
    'auth',
    'workspace',
    'welcome',
    'test',
  ]);
  if (appRoutes.has(parts[0])) {
    const indexPath = path.join(ROOT, 'index.html');
    if (await fileExists(indexPath)) return indexPath;
  }

  return null;
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function writeJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error('Request body is too large.'));
      }
    });
    req.on('error', reject);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        reject(new Error('Request body must be valid JSON.'));
      }
    });
  });
}

function normalizeActorInput(actorId, input = {}) {
  if (actorId !== 'apify/website-content-crawler') return input;

  const rawStartUrl = input.startUrls?.[0]?.url || input.url || 'https://apify.com/store';
  const startUrl = String(rawStartUrl).trim();
  let parsed;
  try {
    parsed = new URL(startUrl);
  } catch {
    throw new Error('Website crawler input must include a valid http(s) URL.');
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Website crawler input must include a valid http(s) URL.');
  }

  const maxCrawlPages = Math.min(5, Math.max(1, Number(input.maxCrawlPages || 2)));
  return {
    ...input,
    startUrls: [{ url: parsed.toString() }],
    maxCrawlPages,
  };
}

async function proxyToRemote(req, res) {
  const targetUrl = `${REMOTE_FALLBACK_ORIGIN}${req.url || '/'}`;
  const headers = {};
  for (const [key, value] of Object.entries(req.headers || {})) {
    if (key.toLowerCase() === 'host') continue;
    if (value === undefined) continue;
    headers[key] = value;
  }

  const response = await fetch(targetUrl, {
    method: req.method || 'GET',
    headers,
  });

  const outHeaders = {};
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'content-encoding') return;
    outHeaders[key] = value;
  });
  outHeaders['x-aws-outreach-engine-proxy'] = '1';

  res.writeHead(response.status, outHeaders);
  const buffer = Buffer.from(await response.arrayBuffer());
  res.end(buffer);
}

const requestHandler = async (req, res) => {
  const method = (req.method || 'GET').toUpperCase();
  if (method === 'GET' && (req.url || '').startsWith('/api/apify/status')) {
    writeJson(res, 200, {
      configured: Boolean(process.env.APIFY_TOKEN),
      actors: Array.from(APIFY_ALLOWED_ACTORS),
      docs: 'https://docs.apify.com/llms.txt',
      runEndpoint: '/api/apify/run',
    });
    return;
  }

  if (method === 'POST' && (req.url || '').startsWith('/api/apify/run')) {
    try {
      const payload = await readJsonBody(req);
      const token = process.env.APIFY_TOKEN;
      const requestedActor = String(payload.actorId || 'apify/website-content-crawler');
      if (!APIFY_ALLOWED_ACTORS.has(requestedActor)) throw new Error('Actor is not allowed for this demo.');
      if (!token) throw new Error('Missing APIFY_TOKEN. Start with APIFY_TOKEN=your_token npm start for live Actor runs.');

      const actorId = requestedActor.replace('/', '~');
      const input = normalizeActorInput(requestedActor, payload.input || {});
      const response = await fetch(
        `https://api.apify.com/v2/acts/${encodeURIComponent(actorId)}/run-sync-get-dataset-items?timeout=120`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(input),
        }
      );
      const text = await response.text();
      if (!response.ok) throw new Error(`Apify API returned ${response.status}: ${text.slice(0, 240)}`);

      let items = [];
      try {
        items = JSON.parse(text);
      } catch {
        items = [];
      }

      writeJson(res, 200, {
        actorId: requestedActor,
        fetchedAt: new Date().toISOString(),
        itemCount: Array.isArray(items) ? items.length : 0,
        items: Array.isArray(items) ? items : [],
      });
    } catch (error) {
      writeJson(res, 400, { error: error.message });
    }
    return;
  }

  if (method !== 'GET' && method !== 'HEAD') {
    try {
      await proxyToRemote(req, res);
    } catch {
      res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Method Not Allowed');
    }
    return;
  }

  const requestPath = req.url || '/';
  const filePath = await resolveStaticFile(requestPath);

  if (!filePath) {
    try {
      await proxyToRemote(req, res);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
    }
    return;
  }

  try {
    const body = method === 'HEAD' ? null : await readFile(filePath);
    const headers = {
      'Content-Type': contentTypeFor(filePath),
      'Cache-Control': filePath.includes('/_next/static/') ? 'public, max-age=31536000, immutable' : 'no-cache',
    };
    res.writeHead(200, headers);
    res.end(body);
  } catch {
    try {
      await proxyToRemote(req, res);
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Internal Server Error');
    }
  }
};

const server = USE_HTTPS
  ? createHttpsServer(
      {
        cert: readFileSync(SSL_CERT_FILE),
        key: readFileSync(SSL_KEY_FILE),
      },
      requestHandler
    )
  : createServer(requestHandler);

server.listen(PORT, HOST, () => {
  const protocol = USE_HTTPS ? 'https' : 'http';
  console.log(`AWS Outreach Engine running at ${protocol}://${HOST}:${PORT}`);
});
