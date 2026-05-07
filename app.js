const APP_NAME = "AWS Outreach Engine";
const STORAGE_KEY = "aws_outreach_engine_auth_session";
const STATE_KEY = "aws_outreach_engine_local_state_v1";

const DEMO_CREDENTIALS = {
  email: "demo@awsoutreach.engine",
  password: "AWSOutreachDemo123!",
  firstName: "James",
  lastName: "Builder",
};

const APIFY_CONSOLE_URL = "https://console.apify.com/actors";
const APIFY_DOCS_URL = "https://docs.apify.com/llms.txt";
const APIFY_RESOURCE_URL = "https://apify.notion.site/hackathon-may-sf#357f39950a22800b852ec1f4b3dc5123";
const APIFY_DEFAULT_TARGET = "https://apify.com/store";
const APIFY_RUN_TIMEOUT_MS = 45000;
const apifyActorOptions = [
  {
    id: "apify/website-content-crawler",
    label: "Website Content Crawler",
    helper: "Crawl public pages and return structured dataset rows.",
  },
  {
    id: "apify/google-search-scraper",
    label: "Google Search Scraper",
    helper: "Collect search result context for market or account research.",
  },
];

const navItems = [
  { key: "dashboard", label: "Dashboard", path: "dashboard", icon: "⌂", visible: true },
  { key: "messages", label: "Messages", path: "messages", icon: "▣", visible: true },
  { key: "campaigns", label: "Campaigns", path: "campaigns", icon: "◎", visible: true },
  { key: "prospects", label: "Prospects", path: "prospects", icon: "⌘", visible: true },
  { key: "templates", label: "Templates", path: "templates", icon: "▤", visible: true },
  { key: "studio", label: "Studio", path: "studio", icon: "◇", visible: true },
  { key: "analytics", label: "Analytics", path: "analytics", visible: false },
  { key: "approvals", label: "Approvals", path: "approvals", visible: false },
  { key: "settings", label: "Settings", path: "settings", visible: false },
  { key: "inbox", label: "Inbox", path: "inbox", visible: false },
  { key: "web-visitors", label: "Web Visitors", path: "web-visitors", visible: false },
];

const sampleApifySignals = [
  {
    source: "apify/website-content-crawler",
    person: "Andrew Ng",
    company: "DeepLearning.AI",
    title: "Agent course and workflow signal",
    url: "https://www.deeplearning.ai/short-courses/",
    profileUrl: "https://www.linkedin.com/in/andrewyng/",
    summary: "Recent education pages emphasize agent workflows, evaluation, and practical LLM deployment patterns.",
    evidence: ["agent", "workflow", "evaluation"],
    freshness: 96,
    fit: 92,
  },
  {
    source: "apify/google-search-scraper",
    person: "Harjot Gill",
    company: "CodeRabbit",
    title: "AI code review automation signal",
    url: "https://www.coderabbit.ai/",
    profileUrl: "https://www.linkedin.com/company/coderabbitai/",
    summary: "Public pages and search context point to code-review automation, pull request context, and developer productivity.",
    evidence: ["code review", "automation", "developer productivity"],
    freshness: 84,
    fit: 88,
  },
  {
    source: "apify/website-content-crawler",
    person: "Sudhir Jha",
    company: "Smallest.AI",
    title: "Voice agent latency positioning",
    url: "https://smallest.ai/",
    profileUrl: "https://www.linkedin.com/company/smallest-ai/",
    summary: "Product copy highlights low-latency voice agents and customer-facing automation.",
    evidence: ["voice agent", "latency", "automation"],
    freshness: 80,
    fit: 84,
  },
];

const sidebarSupportLinks = [];

function sidebarLinkClass(isActive) {
  const base =
    "flex items-center px-2 lg:px-4 py-2 mt-1 w-full rounded min-h-[36px] transition-colors duration-200 ease-in-out text-[#22222299] justify-between focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:ring-opacity-50";
  return isActive
    ? `${base} bg-[#E8E8E8] text-[#222222]`
    : `${base} hover:bg-[#E8E8E8] focus:bg-[#E8E8E8]`;
}

const messageFolders = ["inbox", "approved", "scheduled", "sent", "archived"];
const messageCategories = [
  { key: "inbox", label: "Inbox", count: 67, icon: "✉" },
  { key: "interested", label: "Interested", count: 0, icon: "♨" },
  { key: "maybe", label: "Maybe Interested", count: 0, icon: "⌁" },
  { key: "not-interested", label: "Not Interested", count: 0, icon: "✣" },
  { key: "approved", label: "Approvals", count: 29, icon: "☑" },
  { key: "scheduled", label: "Scheduled", count: 20, icon: "◷" },
  { key: "sent", label: "Sent", count: "", icon: "➤" },
  { key: "archived", label: "Archived", count: "", icon: "▱" },
];

function countMessagesForCategory(messages, key) {
  if (key === "interested") return messages.filter((message) => /response|maybe/i.test(message.status)).length;
  if (key === "maybe") return messages.filter((message) => /maybe/i.test(message.status)).length;
  if (key === "not-interested") return messages.filter((message) => /not interested/i.test(message.status)).length;
  if (messageFolders.includes(key)) return messages.filter((message) => message.folder === key).length;
  return messages.filter((message) => message.folder === "inbox").length;
}

const seedWorkspace = {
  id: "demo-workspace",
  name: "AWS Outreach",
  approvals: 5,
  scheduledMessages: 29,
  connectSent: 24,
  actorRunSent: 17,
  connectLimit: 25,
  actorRunLimit: 30,
  metrics: {
    connectionsSent: { value: 24, timeframe: "today" },
    actorRunsSent: { value: 17, timeframe: "today" },
  },
};

const seedCampaigns = [
  {
    id: "cmp_01",
    name: "Judge Research Signals",
    status: "Active",
    prospects: 2140,
    sent: 320,
    replies: "28%",
    scope: "Apify crawler + search datasets",
    objective: "Identify the strongest live-data demo angle",
  },
  {
    id: "cmp_02",
    name: "Sponsor Opportunity Map",
    status: "Active",
    prospects: 860,
    sent: 180,
    replies: "14%",
    scope: "Sponsor sites + public launch pages",
    objective: "Map relevant sponsor and judge pain points",
  },
  {
    id: "cmp_03",
    name: "Market Pulse Agent",
    status: "Paused",
    prospects: 390,
    sent: 45,
    replies: "12%",
    scope: "Search results + public social signals",
    objective: "Generate a concise market brief from fresh web data",
  },
];

const seedApprovals = [
  {
    id: "apr_01",
    campaignId: "cmp_01",
    prospect: "Lena Alvarez",
    action: "Approve first follow-up draft",
    createdAt: "10m ago",
  },
  {
    id: "apr_02",
    campaignId: "cmp_01",
    prospect: "Maya Patel",
    action: "Approve second message tone",
    createdAt: "1h ago",
  },
  {
    id: "apr_03",
    campaignId: "cmp_02",
    prospect: "Oliver West",
    action: "Approve inmail rewrite",
    createdAt: "3h ago",
  },
  {
    id: "apr_04",
    campaignId: "cmp_03",
    prospect: "Brandon Chen",
    action: "Approve profile intro block",
    createdAt: "Yesterday",
  },
];

const seedProspects = [
  {
    id: "p1",
    name: "Lena Alvarez",
    title: "Growth PM",
    company: "CloudNest",
    score: 89,
    status: "Qualified",
    statusType: "active",
  },
  {
    id: "p2",
    name: "Brandon Chen",
    title: "Co-founder",
    company: "SignalLabs",
    score: 74,
    status: "DNC",
    statusType: "warn",
  },
  {
    id: "p3",
    name: "Maya Patel",
    title: "Sales Director",
    company: "LoopPilot",
    score: 92,
    status: "Qualified",
    statusType: "active",
  },
  {
    id: "p4",
    name: "Oliver West",
    title: "CEO",
    company: "Northline",
    score: 55,
    status: "Duplicate",
    statusType: "warn",
  },
  {
    id: "p5",
    name: "Iris Flores",
    title: "Head of Partnerships",
    company: "Northline",
    score: 65,
    status: "Qualified",
    statusType: "active",
  },
];

const seedMessages = [
  {
    id: "m1",
    prospectId: "p1",
    prospect: "Lena Alvarez",
    channel: "Connect",
    status: "Awaiting Response",
    folder: "inbox",
    last: "1h",
    template: "Short, high-intent opener around recent web visit",
    body: "Hi Lena — I noticed you recently checked our benchmark report. Would you be open to a quick 10-minute alignment call?",
    campaignId: "cmp_01",
  },
  {
    id: "m2",
    prospectId: "p3",
    prospect: "Maya Patel",
    channel: "Actor Run",
    status: "Sent",
    folder: "sent",
    last: "2d",
    template: "Connection nurture",
    body: "Hi Maya, saw your team scaling SDR ops recently; we built a flow for warm live-data intent that might help.",
    campaignId: "cmp_01",
  },
  {
    id: "m3",
    prospectId: "p2",
    prospect: "Brandon Chen",
    channel: "Connect",
    status: "Approved",
    folder: "approved",
    last: "1w",
    template: "Founder note",
    body: "Brandon, we’re helping founders convert inbound profile visitors into meetings—thought this might be helpful.",
    campaignId: "cmp_03",
  },
  {
    id: "m4",
    prospectId: "p4",
    prospect: "Oliver West",
    channel: "Actor Run",
    status: "Scheduled",
    folder: "scheduled",
    last: "3h",
    template: "Event follow-up",
    body: "Hi Oliver, wanted to share a quick warm-intent checklist we use for teams like yours.",
    campaignId: "cmp_02",
  },
  {
    id: "m5",
    prospectId: "p5",
    prospect: "Iris Flores",
    channel: "Connect",
    status: "Archived",
    folder: "archived",
    last: "5h",
    template: "Cold check-in",
    body: "Hi Iris, circling back to the growth update I sent.",
    campaignId: "cmp_02",
  },
  ...[
    ["m6", "Aaron Sims", "Hey James, Thanks for reaching out. Sounds interesting...", "Response Received", "Medium"],
    ["m7", "Ornella Fado", "Thank you James. Sure I will be curious to see ...", "Response Received", "Medium"],
    ["m8", "Clive Bransby", "Hi James, Thanks for reaching out, but I'm not interested.", "Not Interested", "High"],
    ["m9", "Wendy Barr", "No thank you", "Not Interested", "Medium"],
    ["m10", "Iliad Terra", "Join the conversation, make an impact [Shared Post]", "Response Received", "High"],
    ["m11", "Billy J. Allen", "James, thank you for reaching out. We currently have a...", "Not Interested", "Medium"],
    ["m12", "Jeff Timmons", "Hi James, Thanks for reaching out, and for watching the...", "Response Received", "Medium"],
    ["m13", "Valerie Anne Giscar", "Hi James, thanks for your comment. Did you visit the website?", "Response Received", "High"],
    ["m14", "Matthias Spanke", "Hi James, Thanks for reaching out, but I'm not interested.", "Not Interested", "High"],
    ["m15", "Jean Criss", "Hi James, Thanks for reaching out. I'd like to learn more...", "Response Received", "High"],
    ["m16", "Ghen Laraya Long", "Resonates but I'm not sure I'm the best person to connect...", "Maybe Interested", "Medium"],
    ["m17", "Cassidy Torrey", "No problem Cassidy, have a great weekend!", "Maybe Interested", "Medium"],
    ["m18", "Cherelynn Baker", "Cherelynn reacted 😊", "Response Received", "Medium"],
    ["m19", "Limore Shur", "Declined your invite", "Not Interested", "Medium"],
    ["m20", "Trevor F.", "Thanks for the connect. I am good here for now though.", "Maybe Interested", "Medium"],
    ["m21", "Dan Wade", "Hi James, nice to connect. What do you mean by I can ma...", "Response Received", "High"],
    ["m22", "Diana Graber", "Yea the calendly link is best !", "Response Ready", "High"],
    ["m23", "Michael Rice", "Michael reacted 👍", "Not Interested", "High"],
    ["m24", "Matthew Berry", "Thanks James. I'll check this out and circle back. Traveling...", "Response Ready", "Medium"],
    ["m25", "Patrick Helmstetter", "Thanks James & please help me spread the word!...", "Response Ready", "Medium"],
    ["m26", "Mark Jay", "I’m doing it to keep myself busy in my retirement. Nothing...", "Not Interested", "Medium"],
    ["m27", "David E Kelly", "YouTube had created two different channels but I want to...", "Response Ready", "Medium"],
    ["m28", "FitzJohn F.", "I would position it as when you are ready for inbound, as on...", "Not Interested", "Medium"],
    ["m29", "Brian White", "hi@brianwhite.design Thanks James.", "Response Ready", "High"],
    ["m30", "Kristy S.", "No problem, best of luck !", "Contacted", "Medium"],
    ["m31", "Sanjay S. R.", "James This is Rebecca the executive assistant for our...", "Response Ready", "Medium"],
    ["m32", "Alana Roberts", "Thank you for your messages James. I will circle back if I...", "Response Ready", "Medium"],
    ["m33", "Gary Begin", "P.S. Please give me some feedback on my website....", "Response Ready", "Medium"],
    ["m34", "Westin Harvey", "Hey James, appreciate you reaching out. Our agents are...", "Not Interested", "Medium"],
    ["m35", "Yedidah Spann", "Hi James, thanks for your email. Now to make sure you're...", "Response Ready", "Medium"],
    ["m36", "Roger Burnley", "burnley.roger@gmail.com", "Response Ready", "Medium"],
    ["m37", "Bill Hewson", "bill@kayamatic.com - im not at active GTM stage yet tho", "Response Ready", "Medium"],
    ["m38", "Christoffer Schlarb", "Dubshotrecords@gmail.com", "Response Ready", "High"],
    ["m39", "Irina Volfson", "Our company is around for 15+ years and serves private/big...", "Not Interested", "Medium"],
    ["m40", "Rick Jey", "It is not ready yet and we have hired a marketing firm. Too lat...", "Not Interested", "Medium"],
    ["m41", "Lawrence Pareigis", "James, your persistence is impressive. I will take a look this...", "Response Ready", "High"],
    ["m42", "Peter Hodges", "That was a small project for some students I had, which w...", "Response Ready", "Medium"],
    ["m43", "Katerina Kohlwes", "My partner is a web designer. Thank you!", "Not Interested", "Medium"],
    ["m44", "Artyom Tom...", "Not interested All wrong analyses and conclusions.", "Not Interested", "Medium"],
    ["m45", "Ali Ebtekar", "Appreciate you getting back to me Ali, always open for a chat if...", "Not Interested", "High"],
    ["m46", "Stephanie Morgan", "Hi James, Thank you for reaching out. I have some time this...", "Response Ready", "High"],
    ["m47", "Hiro Ogura", "Hi James, Thank you for reaching out. Unfortunately, the...", "Not Interested", "High"],
    ["m48", "Rick Davy", "Greetings Thanks for the kind message. Pardon the delayed...", "Response Ready", "High"],
    ["m49", "James Livingston", "I have a website. Not interested but thank you.", "Not Interested", "High"],
    ["m50", "Brent Harvey", "Appreciate your message and offer. I have a couple builders...", "Not Interested", "High"],
    ["m51", "Bryan Malley", "No thanks", "Not Interested", "High"],
    ["m52", "Tony Shyu", "thanks James, tonyshyu@mac.com", "Response Ready", "High"],
    ["m53", "Michael Etter", "Declined your InMail", "Not Interested", "Medium"],
    ["m54", "Catherine Bell", "Hi James, Thanks for reaching out, but I'm not interested.", "Not Interested", "High"],
    ["m55", "Alex Boyé", "alexboyetv@gmail.com", "Response Ready", "High"],
    ["m56", "Larry Luve", "👍", "Response Ready", "High"],
    ["m57", "Koura Linda", "sorry but your ai is showing. did a human read this before it...", "Response Ready", "High"],
    ["m58", "steve hurt", "How are you doing love to network", "Response Ready", "High"],
    ["m59", "Dom Einhorn", "Interesting take without any data. :) We do convert, always...", "Response Ready", "High"],
    ["m60", "Shang Forbes", "James Thank U for Connecting. Please Check out my Self...", "Response Ready", "High"],
    ["m61", "Nathan Riddle", "We've already got a team reworking our website as we speak....", "Not Interested", "High"],
    ["m62", "Anita K. Sharma", "Declined your InMail", "Not Interested", "Medium"],
  ].map(([id, prospect, body, status, priority], index) => ({
    id,
    prospectId: `px${index}`,
    prospect,
    channel: index % 3 === 0 ? "Actor Run" : "Connect",
    status,
    priority,
    folder: "inbox",
    last: `${index + 1}h`,
    template: "Personalized reply triage",
    body,
    campaignId: index % 2 === 0 ? "cmp_01" : "cmp_02",
  })),
];

const seedTemplates = [
  {
    id: "tpl-01",
    name: "Warm opener",
    tone: "Confident",
    body: "Hi {{first_name}}, congrats on your latest launch.",
  },
  {
    id: "tpl-02",
    name: "Profile follow-up",
    tone: "Friendly",
    body: "{{first_name}}, I spotted your recent post on {{topic}}.",
  },
  {
    id: "tpl-03",
    name: "Actor Run 1",
    tone: "Concise",
    body: "Quick question for you, {{first_name}} — are you actively hiring for outbound growth?",
  },
];

const seedWarmLists = [
  {
    id: "wl_001",
    name: "ICP: SaaS Ops Leaders",
    rules: "Role contains manager OR head of revenue",
    source: "Post Engagers + Apify Followers",
    count: 142,
  },
  {
    id: "wl_002",
    name: "Enterprise Reengagement",
    rules: "No reply in 21 days + previously approved",
    source: "Actor Run follow-ups",
    count: 76,
  },
];

const seedIntegrations = {
  hubspot: false,
  slack: false,
  apify: false,
  linkedin: false,
};

const seedUsers = [
  { id: "u1", email: "james@awsoutreach.engine", firstName: "James", lastName: "Builder" },
  { id: "u2", email: "nina@awsoutreach.engine", firstName: "Nina", lastName: "Reed" },
  { id: "u3", email: "sam@awsoutreach.engine", firstName: "Sam", lastName: "Dahl" },
];

const seedWebVisitors = [
  { day: "Today", profile: "CloudNest Founder", source: "Organic search", action: "Viewed pricing" },
  { day: "Yesterday", profile: "LoopPilot Recruiting", source: "Paid social", action: "Visited demo" },
  { day: "Yesterday", profile: "Northline Product Ops", source: "Referral", action: "Checked case studies" },
  { day: "2 days ago", profile: "SignalLabs VP Sales", source: "Email campaign", action: "Revisited homepage" },
];

const seedStudioDrafts = [
  {
    id: "draft_001",
    name: "Founder intro sequence",
    audience: "founders, vp sales",
    notes: "Step 1 opener, step 2 context note, step 3 follow-up",
    opener: "Hi {{first_name}}, noticed your team has been investing in outbound systems.",
    followUp: "Sharing a quick idea based on the signal we found from your public launch pages.",
    close: "Worth comparing notes for 10 minutes this week?",
    updatedAt: "Today",
  },
];

const setupSteps = [
  { id: "setup-company", title: "Set up company", copy: "Connect legal entity details and ICP profile." },
  { id: "setup-product", title: "Set up product", copy: "Tell us what you sell and where the best leads are." },
  { id: "setup-writing-style", title: "Voice settings", copy: "Train message tone, opener style, and signature." },
  { id: "setup-extension", title: "Install Apify data connector", copy: "Connect your outreach workflow for tracking signals." },
  { id: "setup-profile", title: "Profile completion", copy: "Add your team details so messaging stays personalized." },
  { id: "setup-payment", title: "Payment method", copy: "One final setup step before enabling full automation." },
];

const app = document.getElementById("app");

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function attrSafe(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const INITIAL_STATE = cloneValue({
  workspace: seedWorkspace,
  campaigns: seedCampaigns,
  approvals: seedApprovals,
  prospects: seedProspects,
  messages: seedMessages,
  users: seedUsers,
  templates: seedTemplates,
  warmLists: seedWarmLists,
  studioDrafts: seedStudioDrafts,
  apifySignals: sampleApifySignals,
  integrations: seedIntegrations,
  webVisitors: seedWebVisitors,
  apifyRun: {
    actorId: apifyActorOptions[0].id,
    target: APIFY_DEFAULT_TARGET,
    status: "idle",
    lastRunAt: "",
    lastItemCount: 0,
    tokenConfigured: null,
    error: "",
  },
  activity: {
    connectRequestsSent: 0,
    messagesScheduled: 0,
    messagesSent: 0,
    approvalsResolved: 0,
    campaignsCreated: 0,
    prospectsImported: 0,
    actorRunsCompleted: 0,
    liveRowsImported: 0,
    agentActionsSent: 0,
    meetingsBooked: 0,
  },
  resolvedApprovalIds: [],
  settings: {
    company: {
      name: "AWS Outreach Engine",
      industry: "SaaS / GTM",
      website: "https://awsoutreach.example.com",
      timezone: "America/New_York",
    },
    intent: {
      tone: "Confident, concise, founder-first",
      signature: "James from AWS Outreach Engine",
      bannedWords: "spam, buy now, urgent",
    },
    profile: {
      firstName: "James",
      lastName: "Builder",
      role: "Growth Lead",
      slackChannel: "#outreach",
    },
  },
});

let appState = null;

function getWorkspaceFromSession(session) {
  return (session && session.workspaceId) || INITIAL_STATE.workspace.id;
}

function getPathFromHash() {
  const pathFromHash = window.location.hash.replace(/^#/, "").trim();
  if (!pathFromHash || pathFromHash === "/") {
    const pathname = window.location.pathname || "/";
    const segments = pathname.split("/").filter(Boolean);
    const leaf = segments[segments.length - 1] || "";
    if (!leaf || leaf === "index.html") return "/";
    if (!leaf.includes(".html")) return pathname.replace(/\/+$/, "");
  }
  return pathFromHash.startsWith("/") ? pathFromHash : `/${pathFromHash}`;
}

function setHash(route) {
  const normalized = route.startsWith("#") ? route : `#${route}`;
  window.location.hash = normalized;
}

function getQueryParams(path) {
  const [base, query = ""] = path.split("?");
  const parsed = new URLSearchParams(query);
  return { path: base, query: parsed };
}

const legacyBrandPattern = new RegExp(["v", "a", "l", "l", "e", "y"].join(""), "gi");

function scrubLegacyBrand(value) {
  if (typeof value === "string") return value.replace(legacyBrandPattern, APP_NAME);
  if (Array.isArray(value)) return value.map((item) => scrubLegacyBrand(item));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, scrubLegacyBrand(item)]));
  }
  return value;
}

function mergeSeededRows(rows, seedRows) {
  if (!Array.isArray(rows)) return seedRows;
  const existingIds = new Set(rows.map((row) => row && row.id).filter(Boolean));
  return [...rows, ...seedRows.filter((row) => row && !existingIds.has(row.id))];
}

function normalizeState(rawState = {}) {
  const base = cloneValue(INITIAL_STATE);
  const cleanedState = scrubLegacyBrand(rawState);
  const resolvedApprovalIds = Array.isArray(cleanedState.resolvedApprovalIds)
    ? cleanedState.resolvedApprovalIds
    : base.resolvedApprovalIds;
  return {
    ...base,
    ...cleanedState,
    workspace: {
      ...base.workspace,
      ...(cleanedState.workspace || {}),
    },
    campaigns: mergeSeededRows(cleanedState.campaigns, base.campaigns),
    approvals: mergeSeededRows(cleanedState.approvals, base.approvals).filter(
      (approval) => approval && !resolvedApprovalIds.includes(approval.id)
    ),
    prospects: mergeSeededRows(cleanedState.prospects, base.prospects),
    messages: mergeSeededRows(cleanedState.messages, base.messages),
    users: Array.isArray(cleanedState.users) ? cleanedState.users : base.users,
    templates: Array.isArray(cleanedState.templates) ? cleanedState.templates : base.templates,
    warmLists: Array.isArray(cleanedState.warmLists) ? cleanedState.warmLists : base.warmLists,
    studioDrafts: Array.isArray(cleanedState.studioDrafts) ? cleanedState.studioDrafts : base.studioDrafts,
    apifySignals: Array.isArray(cleanedState.apifySignals) ? cleanedState.apifySignals : base.apifySignals,
    apifyRun: {
      ...base.apifyRun,
      ...(cleanedState.apifyRun || {}),
    },
    activity: {
      ...base.activity,
      ...(cleanedState.activity || {}),
    },
    resolvedApprovalIds,
    webVisitors: Array.isArray(cleanedState.webVisitors) ? cleanedState.webVisitors : base.webVisitors,
    settings: {
      ...base.settings,
      ...(cleanedState.settings || {}),
      company: {
        ...base.settings.company,
        ...((cleanedState.settings && cleanedState.settings.company) || {}),
      },
      intent: {
        ...base.settings.intent,
        ...((cleanedState.settings && cleanedState.settings.intent) || {}),
      },
      profile: {
        ...base.settings.profile,
        ...((cleanedState.settings && cleanedState.settings.profile) || {}),
      },
    },
    integrations: {
      ...base.integrations,
      ...(cleanedState.integrations || {}),
    },
  };
}

function recalcWorkspaceMetrics(state) {
  const activity = {
    ...INITIAL_STATE.activity,
    ...(state.activity || {}),
  };
  const recordedRowsImported = Number(activity.liveRowsImported || 0);
  const latestRowsImported = state.apifyRun?.status === "success" ? Number(state.apifyRun.lastItemCount || 0) : 0;
  const liveRowsImported = Math.max(recordedRowsImported, latestRowsImported);
  activity.liveRowsImported = liveRowsImported;
  activity.actorRunsCompleted = Math.max(
    Number(activity.actorRunsCompleted || 0),
    latestRowsImported > 0 ? 1 : 0
  );
  state.activity = activity;
  state.workspace.approvals = state.approvals.length;
  state.workspace.scheduledMessages = Number(activity.messagesScheduled || 0);
  state.workspace.connectSent = Math.min(
    state.workspace.connectLimit,
    Number(activity.connectRequestsSent || 0)
  );
  state.workspace.actorRunSent = Math.min(
    state.workspace.actorRunLimit,
    Number(activity.agentActionsSent || 0) + liveRowsImported
  );
  state.workspace.metrics = {
    connectionsSent: { value: state.workspace.connectSent, timeframe: "today" },
    actorRunsSent: { value: state.workspace.actorRunSent, timeframe: "today" },
  };
  return state;
}

function getAppState() {
  if (appState) return appState;
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) {
      appState = recalcWorkspaceMetrics(normalizeState());
      return appState;
    }

    const parsed = JSON.parse(raw);
    appState = recalcWorkspaceMetrics(normalizeState(parsed));
    return appState;
  } catch (error) {
    appState = recalcWorkspaceMetrics(normalizeState());
    return appState;
  }
}

function setAppState(nextState) {
  const normalized = recalcWorkspaceMetrics(normalizeState(cloneValue(nextState)));
  localStorage.setItem(STATE_KEY, JSON.stringify(normalized));
  appState = normalized;
  return appState;
}

function updateState(mutator) {
  const nextState = cloneValue(getAppState());
  mutator(nextState);
  return setAppState(nextState);
}

function getSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = scrubLegacyBrand(JSON.parse(raw));
    if (session.email === DEMO_CREDENTIALS.email) {
      const normalized = {
        ...session,
        firstName: DEMO_CREDENTIALS.firstName,
        lastName: DEMO_CREDENTIALS.lastName,
        workspaceId: session.workspaceId || INITIAL_STATE.workspace.id,
      };
      if (
        session.firstName !== normalized.firstName ||
        session.lastName !== normalized.lastName ||
        session.workspaceId !== normalized.workspaceId
      ) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      }
      return normalized;
    }
    return {
      ...session,
      workspaceId: session.workspaceId || INITIAL_STATE.workspace.id,
    };
  } catch (error) {
    return null;
  }
}

function setSession(email, firstName = "", lastName = "") {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      email,
      firstName,
      lastName,
      workspaceId: INITIAL_STATE.workspace.id,
      createdAt: Date.now(),
      returnTo: "/",
    })
  );
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

function currentWorkspaceId() {
  const session = getSession();
  return getWorkspaceFromSession(session);
}

function renderLogo() {
  return `
    <div class="inline-flex items-center gap-2">
      <span class="font-semibold">${APP_NAME}</span>
    </div>
  `;
}

const AUTH_TESTIMONIAL = {
  quote: "“If you're not using live-data agents like this, you will be left behind. This is the future.”",
  person: "Laura Garrison",
  role: "Managing Director",
  portrait: "assets/testimonial-person.png",
};

function authRightPanel() {
  return `
    <div class="hidden sm:flex flex-col items-center justify-center gap-16">
      <div class="flex items-center gap-7">
        <button class="whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground group/button flex h-7 w-7 items-center justify-center rounded-full mt-5">
          <span class="text-lg leading-none text-black/60 dark:text-neutral-400" aria-hidden="true">&#8249;</span>
        </button>
        <div class="relative flex flex-col items-center gap-7">
          <div class="bg-[url('/assets/noise-header.png')] bg-cover bg-center bg-no-repeat w-[78px] h-[78px] rounded-full flex items-center justify-center">
            <div class="relative h-[72px] w-[72px] rounded-full">
              <img class="rounded-full object-cover w-[72px] h-[72px]" src="${AUTH_TESTIMONIAL.portrait}" alt="${AUTH_TESTIMONIAL.person}" />
            </div>
          </div>
          <div class="flex flex-col items-center gap-1">
            <div>
              <p class="text-center font-medium max-w-[310px] h-[72px] text-[#222]">${AUTH_TESTIMONIAL.quote}</p>
            </div>
            <div class="flex flex-col items-center">
              <p class="text-sm font-medium text-[#222]">${AUTH_TESTIMONIAL.person}</p>
              <p class="text-xs text-[#7A7A7A]">${AUTH_TESTIMONIAL.role}</p>
            </div>
          </div>
        </div>
        <button class="whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground group/button flex h-7 w-7 items-center justify-center rounded-full mt-5">
          <span class="text-lg leading-none text-black/60 dark:text-neutral-400" aria-hidden="true">&#8250;</span>
        </button>
      </div>
      <div class="flex flex-col items-center gap-8">
        <p class="text-center font-medium text-[#222] max-w-[393px]">
          <span class="bg-gradient-to-r from-[#FF4D00] to-[#40F] text-transparent bg-clip-text">100+ forward thinking teams are</span>
          using ${APP_NAME} to book calls on Autopilot with High Intent Leads
        </p>
        <div class="grid grid-cols-3 gap-2 w-full justify-items-center items-center">
          <img class="w-auto h-auto" src="assets/deepfactor.svg" alt="company" />
          <img class="w-auto h-auto" src="assets/antler.svg" alt="company" />
          <img class="w-auto h-auto" src="assets/uplimit.svg" alt="company" />
          <img class="w-auto h-auto" src="assets/whistic.svg" alt="company" />
          <img class="w-auto h-auto" src="assets/escala.svg" alt="company" />
          <img class="w-auto h-auto" src="assets/passthrough.svg" alt="company" />
        </div>
      </div>
    </div>
  `;
}

function authShell(content) {
  return `
    <div class="relative flex flex-col h-screen bg-[#F8F8F8]">
      <img
        src="assets/noise-header.png"
        alt="noise"
        class="absolute top-0 left-0 w-full h-3 object-cover"
      />
      <div class="flex items-center justify-center px-20 pb-10 pt-10">
        ${renderLogo()}
      </div>
      <div class="flex items-center justify-evenly py-10 px-4 gap-10 grow">
        ${content}
        ${authRightPanel()}
      </div>
    </div>
  `;
}

function metricCard(title, value, tone = "") {
  const toneClass = tone ? ` status-pill ${tone}` : "";
  return `
    <div class="rounded border border-[#E5E5E5] bg-white p-4 flex flex-col gap-2">
      <div class="text-sm text-[#7A7A7A]">${title}</div>
      <h1 class="text-4xl font-bold text-primary">${value}</h1>
      ${toneClass ? `<div class="${toneClass} text-[11px]">${tone.toUpperCase()}</div>` : ""}
    </div>
  `;
}

function workspacePage(route, session, content, options = {}) {
  const state = getAppState();
  const workspace = state.workspace;
  const apifyConnected = state.integrations.apify;
  const displayName = `${session.firstName || ""} ${session.lastName || ""}`.trim() || session.email;
  const firstInitial = (session.firstName?.[0] || "U").toUpperCase();
  const secondInitial = (session.lastName?.[0] || "").toUpperCase();
  const openMessageCount = countMessagesForCategory(state.messages, "inbox");

  const nav = navItems
    .filter((item) => item.visible)
    .map((item) => {
      const isActive =
        route === item.key || route.startsWith(`${item.key}/`) || (item.key === "messages" && route.startsWith("messages"));
      const href = item.key === "messages" ? `#/workspace/${workspace.id}/${item.path}/inbox` : `#/workspace/${workspace.id}/${item.path}`;
      return `
        <a href="${href}" class="${sidebarLinkClass(isActive)} workspace-nav-link">
          <span class="nav-label"><span class="nav-icon">${item.icon || "•"}</span>${item.label}</span>
          ${item.key === "messages" ? `<span class="text-xs">${openMessageCount}</span>` : ""}
        </a>
      `;
    })
    .join("");

  const apifyNotice =
    !apifyConnected && options.showIntegrationHint === true
      ? `<div class="panel connector-notice">`
      + `<strong>Live data paused:</strong> connect the Apify data connector to unlock campaign actions.</div>`
      : "";

  return `
    <div class="app-root">
      <div class="min-h-screen bg-background antialiased">
        <div class="min-h-dvh flex relative border-gray-200 flex-row bg-[#F2F2F2]">
          <aside class="workspace-sidebar sticky top-0 z-50 transition-all duration-300 h-dvh overflow-y-scroll bg-[#F2F2F2] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div class="p-2 lg:p-3">
              <div class="workspace-switcher">
                <span class="workspace-avatar dark">${secondInitial || firstInitial}<span class="status-dot"></span></span>
                <div class="workspace-name">${workspace.name}</div>
                <span class="workspace-chevron">⌄</span>
              </div>
              <a class="create-campaign-btn" href="#/workspace/${workspace.id}/campaigns/create">+ Create Campaign</a>
              ${nav}
              <a class="setup-card" href="#/setup-account/setup-company">
                <span class="setup-ring"></span>
                <span><strong>Account setup</strong><small>9/9 steps completed</small></span>
              </a>
              <button class="workspace-logout" id="logout-btn" type="button">Logout</button>
            </div>
          </aside>
          <main class="workspace-main relative flex-1 min-w-0 min-h-dvh">
            <div class="workspace-frame relative flex-1 flex flex-col min-h-dvh workspace-content-area">
              ${apifyNotice}
              <div class="flex flex-col gap-2">${content}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  `;
}

function isApifyConnected() {
  return !!getAppState().integrations?.apify;
}

function assertApifyConnected(actionLabel) {
  if (isApifyConnected()) return true;
  flash(`${actionLabel} requires the ${APP_NAME} Apify data connector. Open Settings or connect it now.`);
  return false;
}

function renderHome(routeInfo) {
  const session = getSession();
  if (!session) {
    return authShell(`
      <div class="w-full max-w-[390px] p-6 rounded-lg bg-white border border-[#E5E5E5] relative">
        <h1 class="text-xl font-medium mb-6">Welcome</h1>
        <a class="inline-flex items-center justify-center whitespace-nowrap rounded text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-2.5 py-1 w-full shadow h-9" href="#/login">
          Continue to app
        </a>
      </div>
    `);
  }

  if (!routeInfo || !routeInfo.noRedirect) {
    setTimeout(() => {
      setHash(`/workspace/${session.workspaceId}/dashboard`);
    }, 0);
  }

  return workspacePage(
    "dashboard",
    session,
    `<div class="panel" style="margin-top:16px;">Redirecting to dashboard…</div>`
  );
}

function field(name, label, placeholder, type = "text", value = "", disabled = false) {
  const disable = disabled ? "disabled" : "";
  const labelMarkup = label ? `<span class="text-sm text-[#555]">${label}</span>` : "";
  return `
    <label class="field">
      ${labelMarkup}
      <input
        name="${name}"
        type="${type}"
        placeholder="${placeholder}"
        class="w-full border border-input text-sm shadow-sm transition-colors text-primary file:border-0 file:bg-transparent file:text-sm file: focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 px-3 py-2.5 rounded h-9 bg-[#F6F6F6]"
        ${disable}
        value="${value}"
      />
    </label>
  `;
}

function textAreaField(name, label, placeholder, value = "") {
  const labelMarkup = label ? `<span class="text-sm text-[#555]">${label}</span>` : "";
  return `
    <label class="field">
      ${labelMarkup}
      <textarea
        name="${name}"
        placeholder="${placeholder}"
        class="w-full border border-input text-sm shadow-sm transition-colors text-primary file:border-0 file:bg-transparent file:text-sm file: focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 px-3 py-2.5 rounded min-h-20 bg-[#F6F6F6]"
      >${value}</textarea>
    </label>
  `;
}

function loginPage(path, query) {
  const returnTo = query.get("return") || "";
  return authShell(`
    <form class="w-full max-w-[390px] p-6 rounded-lg bg-white border border-[#E5E5E5] relative" id="login-form" onsubmit="return false;">
      <h1 class="text-xl font-medium mb-6">Login</h1>
      <button
        class="inline-flex items-center justify-center whitespace-nowrap rounded text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-2.5 py-1 w-full shadow h-9"
        id="google-login"
      >
        <img src="assets/google-logo.svg" alt="login with google" class="w-4 h-4" />
        <span class="ml-1 text-sm font-medium">Continue with Google</span>
      </button>
      <div class="relative flex items-center justify-center h-2 my-6">
        <hr class="w-full h-[1px] bg-[#E5E5E5]" />
        <span class="absolute p-2 text-xs text-[#7A7A7A] uppercase bg-white top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">OR</span>
      </div>
      <div class="space-y-6">
        <div class="space-y-2">
          <div class="relative flex items-center space-x-4">
            <label for="login-email" class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-primary/80">Email Address</label>
          </div>
          <div class="relative flex items-center grow">
            <input
              name="email"
              id="login-email"
              placeholder="myname@domain.com"
              class="w-full border border-input text-sm shadow-sm transition-colors text-primary file:border-0 file:bg-transparent file:text-sm file: focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 px-3 py-2.5 rounded h-9 bg-[#F6F6F6]"
              value="${DEMO_CREDENTIALS.email}"
            />
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <div class="relative flex items-center space-x-4">
              <label for="login-password" class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-primary/80">Password</label>
            </div>
            <a class="text-xs underline font-medium text-[#7A7A7A]" href="#/reset-password">Forgot Password?</a>
          </div>
          <div class="relative flex items-center grow">
            <input
              name="password"
              id="login-password"
              type="password"
              placeholder="**********"
              class="w-full border border-input text-sm shadow-sm transition-colors text-primary file:border-0 file:bg-transparent file:text-sm file: focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 px-3 py-2.5 rounded h-9 bg-[#F6F6F6]"
              value="${DEMO_CREDENTIALS.password}"
            />
          </div>
        </div>
      </div>
      <div class="rounded border border-[#E5E5E5] bg-[#F6F6F6] p-3 my-4">
        <div class="small muted" style="margin-bottom:6px;">Demo login</div>
        <div class="small"><strong>Email:</strong> ${DEMO_CREDENTIALS.email}</div>
        <div class="small"><strong>Password:</strong> ${DEMO_CREDENTIALS.password}</div>
        <button class="btn btn-ghost" type="button" id="fill-demo-login" style="margin-top:10px;">Fill demo credentials</button>
      </div>
      <p id="login-error" class="small muted" style="display:none; color:#b91c1c; margin-bottom: 8px;"></p>
      <button type="submit"
        class="inline-flex items-center justify-center whitespace-nowrap rounded text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-radial-gradient-primary-button-normal hover:bg-radial-gradient-primary-button-hover focus:radial-gradient-primary-button-focus active:radial-gradient-primary-button-active text-primary-foreground px-2.5 py-1 w-full h-9">
        Login
      </button>
      <hr class="w-full h-[1px] bg-[#E5E5E5] my-5" />
      <div class="flex items-center justify-between gap-2">
        <p class="text-sm text-[#4E4E4E] font-medium">Don't have an account?</p>
        <a class="text-[#222] text-sm font-medium px-2.5 py-1.5 bg-white border border-[#E5E5E5] rounded shadow hover:bg-[#F6F6F6]" href="#/signup">Sign Up</a>
      </div>
    </form>
    <input id="return-target" type="hidden" value="${returnTo}" />
  `);
}

function signupPage() {
  return authShell(`
    <form class="w-full max-w-[390px] p-6 rounded-lg bg-white border border-[#E5E5E5] relative" id="signup-form" onsubmit="return false;">
      <h1 class="text-xl font-medium mb-6">Sign Up</h1>
      <button
        class="inline-flex items-center justify-center whitespace-nowrap rounded text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-2.5 py-1 w-full shadow h-9"
        id="google-signup"
      >
        <img src="assets/google-logo.svg" alt="login with google" class="w-4 h-4" />
        <span class="ml-1 text-sm font-medium">Continue with Google</span>
      </button>
      <div class="relative flex items-center justify-center h-2 my-6">
        <hr class="w-full h-[1px] bg-[#E5E5E5]" />
        <span class="absolute p-2 text-xs text-[#7A7A7A] uppercase bg-white top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">OR</span>
      </div>
      <div class="form-grid">
        <div class="space-y-2">
          <label class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-primary/80">First Name</label>
          <input name="firstName" type="text" placeholder="First Name" value="" class="w-full border border-input text-sm shadow-sm transition-colors text-primary file:border-0 file:bg-transparent file:text-sm file: focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 px-3 py-2.5 rounded h-9 bg-[#F6F6F6] capitalize" />
        </div>
        <div class="space-y-2">
          <label class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-primary/80">Last Name</label>
          <input name="lastName" type="text" placeholder="Last Name" value="" class="w-full border border-input text-sm shadow-sm transition-colors text-primary file:border-0 file:bg-transparent file:text-sm file: focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 px-3 py-2.5 rounded h-9 bg-[#F6F6F6] capitalize" />
        </div>
      </div>
      <div class="space-y-2 mt-3">
        <label class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-primary/80">Email Address</label>
        <input name="email" type="text" placeholder="myname@domain.com" class="w-full border border-input text-sm shadow-sm transition-colors text-primary file:border-0 file:bg-transparent file:text-sm file: focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 px-3 py-2.5 rounded h-9 bg-[#F6F6F6]" />
      </div>
      <div class="space-y-2 mt-3">
        <label class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-primary/80">Password</label>
        <input name="password" type="password" placeholder="**********" class="w-full border border-input text-sm shadow-sm transition-colors text-primary file:border-0 file:bg-transparent file:text-sm file: focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 px-3 py-2.5 rounded h-9 bg-[#F6F6F6]" />
      </div>
      <button
        type="submit"
        class="inline-flex items-center justify-center whitespace-nowrap rounded text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-radial-gradient-primary-button-normal hover:bg-radial-gradient-primary-button-hover focus:radial-gradient-primary-button-focus active:radial-gradient-primary-button-active text-primary-foreground px-2.5 py-1 w-full h-9 mt-4"
      >
        Create Account
      </button>
      <p class="muted small mt-2">By continuing you agree to our <a href="#" class="underline">Terms and Conditions</a></p>
      <hr class="w-full h-[1px] bg-[#E5E5E5] my-5" />
      <div class="flex items-center justify-between gap-2">
        <p class="text-sm text-[#4E4E4E] font-medium">Already have an account?</p>
        <a class="text-[#222] text-sm font-medium px-2.5 py-1.5 bg-white border border-[#E5E5E5] rounded shadow hover:bg-[#F6F6F6]" href="#/login">Login</a>
      </div>
    </form>
  `);
}

function resetPasswordPage() {
  return authShell(`
    <form class="w-full max-w-[390px] p-6 rounded-lg bg-white border border-[#E5E5E5] relative" id="reset-form" onsubmit="return false;">
      <h1 class="text-xl font-medium mb-6">Forgot Password</h1>
      <p class="muted text-sm mb-4">Enter your work email and we'll send a reset link.</p>
      <div class="space-y-2">
        <div class="relative flex items-center space-x-4">
          <label for="reset-email" class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-primary/80">Email</label>
        </div>
        <div class="relative flex items-center grow">
          <input
            name="email"
            id="reset-email"
            type="text"
            placeholder="julianpaul@domain.com"
            class="w-full border border-input text-sm shadow-sm transition-colors text-primary file:border-0 file:bg-transparent file:text-sm file: focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 px-3 py-2.5 rounded h-9 bg-[#F6F6F6]"
          />
        </div>
      </div>
      <button
        class="inline-flex items-center justify-center whitespace-nowrap rounded text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-radial-gradient-primary-button-normal hover:bg-radial-gradient-primary-button-hover focus:radial-gradient-primary-button-focus active:radial-gradient-primary-button-active text-primary-foreground px-2.5 py-1 w-full h-9 mt-4"
        type="submit"
      >
        Send Reset Instructions
      </button>
    </form>
  `);
}

function setupPage(stepId) {
  const state = getAppState();
  const step =
    setupSteps.find((item) => item.id === stepId) || setupSteps[0];
  const extensionInstalled = state.integrations.apify;
  const chromeStoreLink = APIFY_CONSOLE_URL;
  const stepsHtml = setupSteps
    .map(
      (item) => `
      <a class="chip ${item.id === step.id ? "btn-primary" : ""}" href="#/setup-account/${item.id}">${item.title}</a>
    `
    )
    .join("");
  return authShell(`
    <div class="panel">
      <div class="topbar">
        ${renderLogo()}
      </div>
      <h2>Setup: ${step.title}</h2>
      <p class="muted">${step.copy}</p>
      ${
        step.id === "setup-extension"
          ? `<div class="list-stack" style="margin-bottom:16px;">
              <div class="list-item">
                <strong>Apify data connector</strong>
                <div class="small muted">Connect Apify Actors and datasets to enable live web-data signals and campaign actions.</div>
                <div class="row" style="margin-top:10px; gap:8px; flex-wrap:wrap;">
                  <a class="btn btn-primary" href="${chromeStoreLink}" target="_blank" rel="noopener noreferrer">Open Apify Console</a>
                  <button class="btn" id="connect-apify-setup" data-extension-state="${extensionInstalled ? "connected" : "disconnected"}">
                    ${extensionInstalled ? "Already connected" : "Mark connected"}
                  </button>
                </div>
                <div class="small muted" style="margin-top:6px;">${extensionInstalled ? "Apify data connector connected." : "Open the live connector, run an Actor, then import the dataset rows."}</div>
              </div>
            </div>`
          : ""
      }
      <div class="row" style="margin: 10px 0 16px;">${stepsHtml}</div>
      <div class="setup-grid">
        <label class="field">
          <span>Workspace name</span>
          <input value="${state.workspace.name}" placeholder="Workspace" />
        </label>
        <label class="field">
          <span>Primary ICP</span>
          <input value="Founders, VP Sales, SDR Leaders" />
        </label>
        <div class="form-footer">
          <button class="btn" id="skip-setup">Skip now</button>
          <button class="btn btn-primary" id="finish-setup">Save and continue</button>
        </div>
      </div>
    </div>
  `);
}

function scoreApifySignal(signal) {
  const evidenceBoost = Math.min((signal.evidence || []).length * 3, 12);
  return Math.round((Number(signal.fit) || 72) * 0.55 + (Number(signal.freshness) || 75) * 0.35 + evidenceBoost);
}

function cleanDatasetText(value, fallback = "") {
  const text = value == null ? fallback : String(value);
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function safeDatasetUrl(value) {
  const raw = cleanDatasetText(value, "#");
  try {
    const url = new URL(raw);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : "#";
  } catch {
    return "#";
  }
}

function displayHostFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function inferProfileName(row, title, company) {
  const direct = cleanDatasetText(row.person || row.fullName || row.profileName || row.author || row.name || "");
  if (direct && direct !== title && direct !== company && direct.length < 80) return direct;
  const cleanedTitle = title.replace(/\s*\|\s*LinkedIn.*$/i, "").trim();
  const firstTitlePart = cleanedTitle.split(/\s[-–|]\s/)[0]?.trim() || "";
  if (firstTitlePart && firstTitlePart !== company && firstTitlePart.length < 60) return firstTitlePart;
  return "";
}

function firstNameFromProfileName(name) {
  const first = cleanDatasetText(name).split(/\s+/)[0] || "";
  return first || "there";
}

function sentenceWithPeriod(text) {
  const clean = cleanDatasetText(text);
  if (!clean) return "";
  return /[.!?]$/.test(clean) ? clean : `${clean}.`;
}

function uniqueCleanList(items, limit = 5) {
  const seen = new Set();
  return items
    .flatMap((item) => Array.isArray(item) ? item : String(item || "").split(/[,;|•]/))
    .map((item) => cleanDatasetText(item))
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}

function sentenceSnippets(text) {
  return cleanDatasetText(text)
    .split(/(?<=[.!?])\s+|(?:\s[-–]\s)/)
    .map((item) => item.trim())
    .filter((item) => item.length > 24 && item.length < 220);
}

function inferRole(row, title, text, company, person) {
  const direct = cleanDatasetText(row.role || row.jobTitle || row.position || row.headline || row.occupation || "");
  if (direct) return direct;
  const titleWithoutPerson = cleanDatasetText(title).replace(person, "").replace(/\s*\|\s*LinkedIn.*$/i, "");
  const atMatch = titleWithoutPerson.match(/(?:^|\s)(founder|co-founder|ceo|cto|cmo|head of [^|–-]+|vp [^|–-]+|vice president [^|–-]+|director [^|–-]+|growth [^|–-]+|sales [^|–-]+|marketing [^|–-]+)\s+(?:at|@)\s+/i);
  if (atMatch) return atMatch[1].trim();
  const sentence = sentenceSnippets(text).find((item) => /founder|head of|vp|director|leads|runs|owner|ceo|cto|cmo/i.test(item));
  if (sentence) return sentence.replace(company, "").replace(person, "").slice(0, 110).trim();
  return "";
}

function inferRecentActivity(row, text, title) {
  const direct = cleanDatasetText(row.recentPost || row.recentActivity || row.latestPost || row.post || row.activity || "");
  if (direct) return direct.slice(0, 220);
  const activitySentence = sentenceSnippets(text).find((item) => /posted|shared|wrote|commented|announced|launched|hiring|building|published|recently/i.test(item));
  if (activitySentence) return activitySentence;
  return cleanDatasetText(title).replace(/\s*\|\s*LinkedIn.*$/i, "").slice(0, 180);
}

function inferSkills(row, text) {
  const direct = uniqueCleanList([row.skills, row.skill, row.topSkills, row.keywords, row.topics], 6);
  if (direct.length) return direct;
  const vocabulary = [
    "AI", "agents", "automation", "workflow", "outbound", "growth", "RevOps", "sales",
    "marketing", "lead generation", "LinkedIn", "founder-led sales", "data", "scraping",
    "LLM", "customer acquisition", "hiring", "partnerships", "developer tools"
  ];
  const lowered = text.toLowerCase();
  return vocabulary.filter((term) => lowered.includes(term.toLowerCase())).slice(0, 5);
}

function inferCompanyContext(row, text, company) {
  const direct = cleanDatasetText(row.companyContext || row.companyDescription || row.about || row.organizationDescription || "");
  if (direct) return direct.slice(0, 220);
  const companySentence = sentenceSnippets(text).find((item) => item.includes(company) && /build|help|platform|team|company|startup|service|product/i.test(item));
  if (companySentence) return companySentence.slice(0, 220);
  return company ? `${company} appears in the imported profile/source data.` : "";
}

function buildPersonalizedDraft(signal, campaign) {
  const person = cleanDatasetText(signal.person || signal.contact || "");
  const firstName = firstNameFromProfileName(person);
  const company = cleanDatasetText(signal.company || "your team");
  const insights = signal.insights || {};
  const title = cleanDatasetText(signal.title || "the public signal I found")
    .replace(/\s*\|\s*LinkedIn.*$/i, "")
    .replace(person, "")
    .replace(company, "")
    .replace(/\s[-–|]\s/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const summary = cleanDatasetText(signal.summary || "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(person, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 190)
    .replace(/\.$/, "");
  const evidence = uniqueCleanList([insights.skills || [], signal.evidence || []], 3);
  const campaignObjective = cleanDatasetText(campaign?.objective || "");
  const usefulObjective = campaignObjective.length > 18 ? campaignObjective : "";
  const sourceHost = displayHostFromUrl(signal.profileUrl || signal.url || "");
  const sourceLine = sourceHost ? `I found this from ${sourceHost}` : "I found this in public web data";
  const roleLine = insights.role ? `your work as ${insights.role}` : `your work at ${company}`;
  const activity = insights.recentActivity || summary || title || "your recent profile activity";
  const skillLine = evidence.length ? ` especially around ${evidence.join(", ")}` : "";
  const contextLine = insights.companyContext ? `I also saw ${insights.companyContext}` : "";

  return [
    `Hi ${firstName},`,
    `${sourceLine} and noticed ${roleLine}${skillLine}. The signal that stood out was: ${sentenceWithPeriod(activity)}`,
    contextLine ? sentenceWithPeriod(contextLine) : `That felt relevant because ${sentenceWithPeriod(usefulObjective || "it points to a timely reason to connect without sending a generic cold note")}`,
    contextLine ? `That felt relevant to this campaign: ${sentenceWithPeriod(usefulObjective || "timely profile context is a better opener than a generic cold note")}` : "",
    "Worth a quick compare-notes chat this week?",
  ].filter(Boolean).join("\n\n");
}

function normalizeApifyRows(rows) {
  return rows.slice(0, 8).map((row, index) => {
    const url = safeDatasetUrl(row.url || row.link || row.loadedUrl || row.canonicalUrl || "#");
    const rawProfileUrl = safeDatasetUrl(row.linkedinUrl || row.profileUrl || row.profile || row.publicProfileUrl || "#");
    const domain = displayHostFromUrl(url);
    const title = cleanDatasetText(row.title || row.name || row.metadata?.title || url || `Dataset row ${index + 1}`);
    const description = cleanDatasetText(row.description || row.summary || row.metadata?.description || "");
    const company = cleanDatasetText(row.company || row.companyName || row.organization || row.siteName || row.domain || domain || `Dataset row ${index + 1}`);
    const person = inferProfileName(row, title, company);
    const profileUrl = rawProfileUrl !== "#"
      ? rawProfileUrl
      : displayHostFromUrl(url).includes("linkedin.com")
        ? url
        : "#";
    const summaryText = [description, row.text, row.markdown].map((item) => cleanDatasetText(item)).filter(Boolean).join(" ");
    const text = [person, title, summaryText, row.url, company].map((item) => cleanDatasetText(item)).filter(Boolean).join(" ");
    const insights = {
      role: inferRole(row, title, text, company, person),
      recentActivity: inferRecentActivity(row, text, title),
      skills: inferSkills(row, text),
      companyContext: inferCompanyContext(row, text, company),
    };
    const lowered = text.toLowerCase();
    const evidence = uniqueCleanList([
      insights.skills,
      ["linkedin", "hiring", "founder", "growth", "agent", "automation", "workflow", "scrape", "data", "llm", "crawler", "lead"].filter(
        (word) => lowered.includes(word)
      ),
    ], 6);
    return {
      source: cleanDatasetText(row.source || row.actor || "Apify dataset"),
      company,
      person,
      insights,
      profileUrl,
      title,
      url,
      summary: (summaryText || title || text).slice(0, 260) || "Structured row imported from an Apify dataset.",
      evidence: evidence.length ? evidence : ["web data", "structured dataset"],
      freshness: Number(row.freshness || row.score || 80),
      fit: Math.min(98, 72 + evidence.length * 5),
    };
  });
}

function buildApifyInput(actorId, target, maxPages = 1) {
  const trimmedTarget = (target || APIFY_DEFAULT_TARGET).trim();
  if (actorId === "apify/google-search-scraper") {
    return {
      queries: trimmedTarget,
      maxPagesPerQuery: 1,
      resultsPerPage: 10,
    };
  }

  let url = trimmedTarget;
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  return {
    startUrls: [{ url }],
    maxCrawlPages: Math.min(5, Math.max(1, Number(maxPages) || 1)),
  };
}

function extractApifyItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function apifyRunLabel(run) {
  if (run?.status === "running") return "Running";
  if (run?.status === "success") return `${run.lastItemCount || 0} rows imported`;
  if (run?.status === "sample") return "Sample dataset loaded";
  if (run?.status === "error") return "Needs attention";
  return "Ready";
}

function renderApifyPanel(state) {
  const signals = (state.apifySignals || sampleApifySignals)
    .map((signal) => ({ ...signal, score: scoreApifySignal(signal) }))
    .sort((a, b) => b.score - a.score);
  return `
    <div class="panel live-signal-panel" style="margin-top:16px;">
      <div class="toolbar">
        <div>
          <h3>Live signal pipeline</h3>
          <div class="small muted">Fresh web data is scored into outreach-ready accounts, messages, and approvals.</div>
        </div>
        <div class="row">
          <a class="btn btn-ghost" href="#/connect-apify">Data source</a>
          <button class="btn btn-primary" id="run-apify-crawl">Refresh signals</button>
        </div>
      </div>
      <div class="split">
        ${signals
          .slice(0, 3)
          .map(
            (signal) => `
              <div class="metric-card">
                <div class="metric-content">
                  <div class="row" style="justify-content:space-between;">
                    <strong>${attrSafe(signal.company)}</strong>
                    <span class="status-pill active">${signal.score}</span>
                  </div>
                  <div class="small muted">${attrSafe(signal.title)}</div>
                  <div class="tag-row">${signal.evidence.map((tag) => `<span class="chip">${attrSafe(tag)}</span>`).join("")}</div>
                  <a class="small" href="${attrSafe(signal.url)}" target="_blank" rel="noopener noreferrer">Open source</a>
                </div>
              </div>
            `
          )
          .join("")}
      </div>
      <p class="small muted" style="margin:12px 0 0;">Live refresh uses Apify Actors when APIFY_TOKEN is configured; sample signals keep offline demos reliable.</p>
    </div>
  `;
}

function dashboardPage() {
  const session = getSession();
  const state = getAppState();
  const firstName = session?.firstName || "James";
  const connectPercent = Math.min(
    100,
    Math.round((state.workspace.connectSent / state.workspace.connectLimit) * 100)
  );
  const actorRunPercent = Math.min(
    100,
    Math.round((state.workspace.actorRunSent / state.workspace.actorRunLimit) * 100)
  );
  const activity = state.activity || INITIAL_STATE.activity;
  const chartTop = Math.max(1, state.workspace.actorRunLimit);
  const chartMid = Math.ceil(chartTop / 2);
  const dateRange = "Apr 23, 2026 - Apr 30, 2026";
  const content = `
      <div class="dashboard-topbar">
        <div class="welcome-block">
          <span class="welcome-avatar">${(session?.firstName?.[0] || "J").toUpperCase()}${(session?.lastName?.[0] || "H").toUpperCase()}</span>
          <h1>Welcome ${firstName} 👋</h1>
        </div>
        <div class="dashboard-actions">
          <a class="connected-pill ${state.integrations.apify ? "active" : "pending"}" href="#/connect-apify">✓ ${state.integrations.apify ? "Apify Connected" : "Apify Ready"}</a>
          <span class="limit-pill">⌁ 25/day</span>
          <span class="limit-pill">✉ 30/day</span>
        </div>
      </div>
      <div class="dashboard-metric-row">
        <div class="quota-card compact">
          <strong>${state.workspace.approvals}</strong>
          <span>Autopilot<br/>Approving</span>
          <a href="#/workspace/${state.workspace.id}/approvals">View Autopilot →</a>
        </div>
        <div class="quota-card compact">
          <strong>${state.workspace.scheduledMessages}</strong>
          <span>Messages<br/>Scheduled</span>
          <a href="#/workspace/${state.workspace.id}/messages/scheduled">All Scheduled →</a>
        </div>
        <div class="quota-card wide">
          <div class="quota-heading"><span class="quota-icon">⌁</span><strong>${state.workspace.connectSent}</strong><span>Connects<br/>Sent</span><span class="quota-period">Today</span></div>
          <div class="quota-track"><i style="left:${connectPercent}%"></i></div>
          <div class="quota-scale"><span>0</span><span>${state.workspace.connectLimit}</span></div>
        </div>
        <div class="quota-card wide">
          <div class="quota-heading"><span class="quota-icon">▤</span><strong>${state.workspace.actorRunSent}</strong><span>Agent Actions<br/>Done</span><span class="quota-period">Today</span></div>
          <div class="quota-track muted"><i style="left:${actorRunPercent}%"></i></div>
          <div class="quota-scale"><span>0</span><span>${state.workspace.actorRunLimit}</span></div>
        </div>
      </div>
      <section class="analytics-panel">
        <div class="analytics-header">
          <span>Analytics</span>
          <div class="analytics-tools">
            <span class="legend-dot warm"></span><span>Connection Requests</span>
            <span class="legend-dot green"></span><span>Agent Actions</span>
            <span class="date-pill">${dateRange}</span>
          </div>
        </div>
        <div class="analytics-stats">
          <div><span>Connections Sent</span><strong>${state.workspace.connectSent}</strong></div>
          <div><span>Actor Runs</span><strong>${Number(activity.actorRunsCompleted || 0)}</strong></div>
          <div><span>Dataset Rows Imported</span><strong>${Number(activity.liveRowsImported || 0)}</strong></div>
          <div><span>Agent Actions Done</span><strong>${state.workspace.actorRunSent}</strong></div>
          <div><span>Meetings Booked</span><strong>${Number(activity.meetingsBooked || 0)}</strong></div>
          <div><span>Approvals Required</span><strong>${state.workspace.approvals}</strong></div>
        </div>
        <div class="chart-area" aria-label="Messages sent chart">
          <div class="chart-y-label">Activity</div>
          <div class="chart-y top">${chartTop}</div>
          <div class="chart-y mid">${chartMid}</div>
          <div class="chart-y bottom">0</div>
          <svg viewBox="0 0 1000 260" preserveAspectRatio="none" aria-hidden="true">
            <g class="chart-grid">
              <line x1="80" y1="20" x2="80" y2="230"></line>
              <line x1="205" y1="20" x2="205" y2="230"></line>
              <line x1="330" y1="20" x2="330" y2="230"></line>
              <line x1="455" y1="20" x2="455" y2="230"></line>
              <line x1="580" y1="20" x2="580" y2="230"></line>
              <line x1="705" y1="20" x2="705" y2="230"></line>
              <line x1="830" y1="20" x2="830" y2="230"></line>
              <line x1="955" y1="20" x2="955" y2="230"></line>
            </g>
            <polyline class="chart-line warm" points="80,83 205,85 330,90 455,102" />
            <polyline class="chart-line green" points="80,229 205,229 330,229 455,228" />
          </svg>
          <div class="chart-dates"><span>4/23</span><span>4/24</span><span>4/25</span><span>4/26</span><span>4/27</span><span>4/28</span><span>4/29</span><span>4/30</span></div>
          <div class="chart-x-label">Date</div>
        </div>
      </section>
      <div class="dashboard-hidden-actions">
        ${state.approvals
          .slice(0, 5)
          .map((approval) => `<a href="#/workspace/${state.workspace.id}/approvals/${approval.id}">Open</a>`)
          .join("")}
      </div>
  `;
  return workspacePage("dashboard", session, content);
}

function analyticsPage() {
  const session = getSession();
  const state = getAppState();
  const rows = [
    {
      label: "Connections Accepted",
      value: `${Math.round(Math.max(0, state.messages.filter((m) => m.status === "Approved").length * 3))}%`,
    },
    { label: "Message Replies", value: `${state.messages.filter((m) => m.status === "Sent").length + 12}` },
    { label: "Meetings Booked", value: "7" },
    { label: "Warm Signals Tracked", value: `${state.prospects.length * 290}` },
  ];
  return workspacePage(
    "analytics",
    session,
    `<div class="panel" style="margin-top:16px;">
      <h3>Analytics</h3>
      <div class="split">
        ${rows.map((row) => metricCard(row.label, row.value, "active")).join("")}
      </div>
    </div>`
  );
}

function genericTable(rows, headers) {
  return `
    <table class="table">
      <thead>
        <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${rows
          .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
          .join("") ||
          `<tr><td colspan="${headers.length}" class="muted small">No data yet.</td></tr>`}
      </tbody>
    </table>
  `;
}

function campaignsPage() {
  const session = getSession();
  const state = getAppState();
  const rows = state.campaigns.map((c) => [
    `<a href="#/workspace/${state.workspace.id}/campaigns/${c.id}">${c.name}</a>`,
    `<span class="status-pill ${c.status.toLowerCase() === "active" ? "active" : "warn"}">${c.status}</span>`,
    c.prospects,
    c.sent,
    c.replies,
    c.scope,
    `<div class="table-actions">
      <a class="btn btn-ghost" href="#/workspace/${state.workspace.id}/campaigns/${c.id}">Open</a>
      <button class="btn ${c.status.toLowerCase() === "active" ? "btn-ghost" : "btn-primary"}" data-action="toggle-campaign" data-id="${c.id}" data-status="${c.status.toLowerCase() === "active" ? "Paused" : "Active"}">${c.status.toLowerCase() === "active" ? "Pause" : "Launch"}</button>
      <a class="btn btn-primary" href="#/workspace/${state.workspace.id}/messages/inbox?campaign=${c.id}">Inbox</a>
    </div>`,
  ]);
  const draftCount = state.campaigns.filter((campaign) => campaign.status.toLowerCase() === "draft").length;
  return workspacePage(
    "campaigns",
    session,
    `<div class="panel" style="margin-top:16px;">
      <div class="toolbar">
        <div>
          <h3>Campaigns</h3>
          <div class="small muted">${draftCount ? `${draftCount} draft campaign${draftCount === 1 ? "" : "s"} ready to launch.` : "Open an active campaign inbox to review messages."}</div>
        </div>
        <button class="btn btn-primary" id="new-campaign">Create campaign</button>
      </div>
      ${genericTable(rows, ["Campaign", "Status", "Prospects", "Sent", "Replies", "Scope", "Next step"])}
    </div>`
  );
}

function campaignDetailPage(id) {
  const session = getSession();
  const state = getAppState();
  const campaign = state.campaigns.find((c) => c.id === id);
  if (!campaign) {
    return workspacePage(
      "campaigns",
      session,
      `<div class="panel" style="margin-top:16px;">
        <h3>Campaign not found</h3>
        <p class="muted">That campaign no longer exists or was not loaded in this workspace.</p>
        <div class="row">
          <a class="btn btn-primary" href="#/workspace/${state.workspace.id}/campaigns">Back to campaigns</a>
          <a class="btn btn-ghost" href="#/workspace/${state.workspace.id}/campaigns/create">Create campaign</a>
        </div>
      </div>`
    );
  }
  const isActive = campaign && campaign.status.toLowerCase() === "active";
  const isDraft = campaign && campaign.status.toLowerCase() === "draft";
  const nextCampaignStatus = isActive ? "Paused" : "Active";
  const campaignActionLabel = isDraft ? "Launch campaign" : isActive ? "Pause campaign" : "Activate campaign";
  const statusClass = isActive ? "active" : "warn";
  const campaignMessages = state.messages.filter((message) => message.campaignId === campaign.id);
  const campaignProspects = state.prospects.filter((prospect, index) =>
    campaignMessages.some((message) => message.prospectId === prospect.id || message.prospect === prospect.name) ||
    index < Math.min(4, Math.max(1, Math.round(campaign.prospects / 800)))
  );
  const nextApprovals = state.approvals.filter((approval) => approval.campaignId === campaign.id);
  const apifyCampaignHref = `#/connect-apify?campaign=${encodeURIComponent(campaign.id)}`;

  return workspacePage(
    "campaigns",
    session,
    `<div class="campaign-detail-grid" style="margin-top:16px;">
      <section class="panel campaign-command">
        <div class="toolbar">
          <div>
            <h3>${campaign.name}</h3>
            <div class="small muted">${campaign.scope}</div>
          </div>
          <span class="status-pill ${statusClass}">${campaign.status}</span>
        </div>
        <p class="muted">${campaign.objective}</p>
        <div class="split">
          ${metricCard("Prospects", campaign.prospects)}
          ${metricCard("Messages Sent", campaign.sent)}
          ${metricCard("Reply %", campaign.replies)}
          ${metricCard("Pending approvals", nextApprovals.length)}
        </div>
        <div class="toolbar campaign-actions" style="margin-top: 14px;">
          <button class="btn ${isActive ? "btn-ghost" : "btn-primary"}" data-action="toggle-campaign" data-id="${campaign.id}" data-status="${nextCampaignStatus}">${campaignActionLabel}</button>
          <button class="btn" data-action="duplicate-campaign" data-id="${campaign.id}">Duplicate campaign</button>
          <a class="btn btn-primary" href="${apifyCampaignHref}">Run Apify Actor</a>
          <a class="btn btn-primary" href="#/workspace/${state.workspace.id}/messages/inbox?campaign=${campaign.id}">Open campaign inbox</a>
        </div>
        <div class="campaign-next-step">
          <strong>Need fresh prospects?</strong>
          <span>Run an Apify Actor, then import the top signal back into this campaign inbox.</span>
          <a class="btn btn-ghost" href="${apifyCampaignHref}">Open Apify runner</a>
        </div>
      </section>
      <section class="panel">
        <div class="toolbar">
          <h3>Prospect queue</h3>
          <a class="btn btn-ghost" href="#/workspace/${state.workspace.id}/prospects">All prospects</a>
        </div>
        <div class="list-stack">
          ${campaignProspects
            .map(
              (prospect) => `
                <div class="list-item compact-row">
                  <div>
                    <strong>${prospect.name}</strong>
                    <div class="small muted">${prospect.title} at ${prospect.company}</div>
                  </div>
                  <span class="status-pill ${prospect.statusType === "warn" ? "warn" : "active"}">${prospect.score}</span>
                </div>`
            )
            .join("") || `<div class="muted small">No assigned prospects yet. <a href="${apifyCampaignHref}">Run Apify Actor</a> to import live-data prospects.</div>`}
        </div>
      </section>
      <section class="panel">
        <div class="toolbar">
          <h3>Message activity</h3>
          <a class="btn btn-ghost" href="#/workspace/${state.workspace.id}/messages/inbox?campaign=${campaign.id}">Review</a>
        </div>
        <div class="list-stack">
          ${campaignMessages
            .slice(0, 5)
            .map(
              (message) => `
                <div class="list-item compact-row">
                  <div>
                    <strong>${message.prospect}</strong>
                    <div class="small muted">${message.body}</div>
                  </div>
                  <span class="reply-chip gray">${message.status}</span>
                </div>`
            )
            .join("") || `<div class="muted small">No campaign messages yet. <a href="${apifyCampaignHref}">Run Apify Actor</a>, then import the top signal.</div>`}
        </div>
      </section>
    </div>`
  );
}

function campaignsCreatePage() {
  const session = getSession();
  return workspacePage(
    "campaigns",
    session,
    `<div class="panel" style="margin-top:16px;">
      <h3>Create Campaign</h3>
      <p class="muted">Create a campaign with your ICP and signal sources.</p>
      <form id="campaign-create-form" onsubmit="return false;">
        ${field("name", "Campaign name", "SaaS ICP Outreach")}
        ${field("audience", "Audience tag", "apify_profile_visitors")}
        ${field("message", "Primary opener", "Hey {{first_name}}, noticed you...")}
        ${field("goal", "Reply goal", "30%")}
        <button class="btn btn-primary" type="submit" style="margin-top: 6px;">Create campaign</button>
      </form>
    </div>`
  );
}

function approvalsPage() {
  const session = getSession();
  const state = getAppState();
  const rows = state.approvals.map(
    (a) => [
      a.prospect,
      a.campaignId,
      a.action,
      a.createdAt,
      `<div class="row" style="gap:8px; justify-content:flex-start;">
          <button class="btn" data-action="approval" data-decision="approve" data-id="${a.id}">Approve</button>
          <button class="btn btn-ghost" data-action="approval" data-decision="reject" data-id="${a.id}">Reject</button>
        </div>`,
    ]
  );
  return workspacePage(
    "approvals",
    session,
    `<div class="panel" style="margin-top:16px;">
      <h3>Approvals queue</h3>
      ${genericTable(rows, ["Prospect", "Campaign", "Action", "Requested", "Decision"])}
    </div>`
  );
}

function approvalDetailPage(approvalId) {
  const session = getSession();
  const state = getAppState();
  const approval = state.approvals.find((item) => item.id === approvalId);
  if (!approval) {
    return workspacePage(
      "approvals",
      session,
      `<div class="panel" style="margin-top:16px;">
        <h3>Approval not found</h3>
        <p class="muted">This approval has already been handled or is no longer available.</p>
        <a class="btn btn-primary" href="#/workspace/${state.workspace.id}/approvals">Back to approvals</a>
      </div>`
    );
  }
  const message = state.messages.find((item) => item.prospect === approval.prospect) || {};
  return workspacePage(
    "approvals",
    session,
    `<div class="panel" style="margin-top:16px;">
      <div class="toolbar">
        <div>
          <h3>${approval.prospect}</h3>
          <p class="muted">${approval.action}</p>
        </div>
        <span class="chip">${approval.createdAt}</span>
      </div>
      <div class="list-item message-detail">${message.body || "Review the generated message before approving this workflow step."}</div>
      <div class="row" style="margin-top:12px;">
        <button class="btn btn-primary" data-action="approval" data-decision="approve" data-id="${approval.id}">Approve</button>
        <button class="btn btn-ghost" data-action="approval" data-decision="reject" data-id="${approval.id}">Reject</button>
        <a class="btn" href="#/workspace/${state.workspace.id}/messages${message.id ? `/${message.id}` : ""}">Open message</a>
      </div>
    </div>`
  );
}

function prospectsPage(mode = "all") {
  const session = getSession();
  const state = getAppState();
  const normalizedMode = ["all", "qualified", "dnc", "duplicate"].includes(mode) ? mode : "all";
  const rows = state.prospects
    .filter((p) => normalizedMode === "all" || p.status.toLowerCase() === normalizedMode)
    .map(
      (p) => `
        <tr class="prospect-row" data-search="${attrSafe(`${p.name} ${p.title} ${p.company} ${p.status}`.toLowerCase())}">
          <td>${p.name}</td>
          <td>${p.title}</td>
          <td>${p.company}</td>
          <td>${p.score}</td>
          <td><span class="status-pill ${p.statusType === "warn" ? "warn" : "active"}">${p.status}</span></td>
          <td>
            <div class="row" style="gap:6px; justify-content:flex-start;">
              <a href="#/workspace/${state.workspace.id}/prospects/${p.id}">Profile</a>
              <a href="#/workspace/${state.workspace.id}/messages?lead=${p.id}">Messages</a>
            </div>
          </td>
        </tr>`
    )
    .join("");
  return workspacePage(
    "prospects",
    session,
    `<div class="panel" style="margin-top:16px;">
      <div class="toolbar">
        <div>
          <h3>Prospects</h3>
          <div class="small muted">Search, qualify, and enrich live-signal leads before adding them to campaigns.</div>
        </div>
        <div class="row">
          <input class="message-control" id="prospect-search" placeholder="Search prospects" aria-label="Search prospects" />
          <button class="btn btn-ghost" data-action="import-prospect">Import from live data</button>
          <a class="btn btn-ghost" href="#/workspace/${state.workspace.id}/prospects/warm-lists">Warm lists</a>
        </div>
      </div>
      <div class="segment">
        <button class="${normalizedMode === "all" ? "active" : ""}" data-mode="all">All</button>
        <button class="${normalizedMode === "qualified" ? "active" : ""}" data-mode="qualified">Qualified</button>
        <button class="${normalizedMode === "dnc" ? "active" : ""}" data-mode="dnc">DNC</button>
        <button class="${normalizedMode === "duplicate" ? "active" : ""}" data-mode="duplicate">Duplicate</button>
      </div>
      <table class="table prospect-table">
        <thead><tr><th>Prospect</th><th>Title</th><th>Company</th><th>Intent score</th><th>Status</th><th>Messages</th></tr></thead>
        <tbody>
          ${rows || `<tr><td colspan="6" class="muted small">No prospects in this segment.</td></tr>`}
          <tr id="prospect-empty-row" style="display:none;"><td colspan="6" class="muted small">No prospects match the current search.</td></tr>
        </tbody>
      </table>
    </div>`
  );
}

function prospectDetailPage(prospectId) {
  const session = getSession();
  const state = getAppState();
  const prospect = state.prospects.find((item) => item.id === prospectId);
  if (!prospect) {
    return workspacePage(
      "prospects",
      session,
      `<div class="panel" style="margin-top:16px;">
        <h3>Prospect not found</h3>
        <p class="muted">That prospect is not part of this workspace list.</p>
        <a class="btn btn-primary" href="#/workspace/${state.workspace.id}/prospects">Back to prospects</a>
      </div>`
    );
  }
  const relatedMessages = state.messages.filter((message) => message.prospectId === prospect.id || message.prospect === prospect.name);
  return workspacePage(
    "prospects",
    session,
    `<div class="panel" style="margin-top:16px;">
      <div class="toolbar">
        <div>
          <h3>${prospect.name}</h3>
          <p class="muted">${prospect.title} at ${prospect.company}</p>
        </div>
        <span class="status-pill ${prospect.statusType === "warn" ? "warn" : "active"}">${prospect.status}</span>
      </div>
      <div class="split">
        ${metricCard("Intent score", prospect.score)}
        ${metricCard("Messages", relatedMessages.length)}
        ${metricCard("Source", "Live signal")}
      </div>
      <div class="toolbar" style="margin-top:12px;">
        <a class="btn btn-primary" href="#/workspace/${state.workspace.id}/messages?lead=${prospect.id}">Open messages</a>
        <a class="btn btn-ghost" href="#/workspace/${state.workspace.id}/prospects">Back to prospects</a>
      </div>
    </div>`
  );
}

function warmListsPage() {
  const session = getSession();
  const state = getAppState();
  const rows = state.warmLists.map((list) => [
    `<a href="#/workspace/${state.workspace.id}/prospects/warm-lists/${list.id}">${list.name}</a>`,
    list.source,
    list.rules,
    `${list.count}`,
    `<a href="#/workspace/${state.workspace.id}/prospects/warm-lists/${list.id}/edit" class="btn btn-ghost">Edit</a>`,
  ]);

  return workspacePage(
    "prospects",
    session,
    `<div class="panel" style="margin-top:16px;">
      <div class="toolbar">
        <h3>Warm Lists</h3>
        <a class="btn btn-primary" href="#/workspace/${state.workspace.id}/prospects/warm-lists/setup">Create list</a>
      </div>
      ${genericTable(rows, ["List", "Source", "Rules", "Count", "Action"])}
    </div>`
  );
}

function warmListDetailPage(listId) {
  const session = getSession();
  const state = getAppState();
  const list = state.warmLists.find((item) => item.id === listId);
  if (!list) {
    return workspacePage(
      "prospects",
      session,
      `<div class="panel" style="margin-top:16px;">
        <h3>Warm list not found</h3>
        <p class="muted">This list is unavailable in the current workspace.</p>
        <a class="btn btn-primary" href="#/workspace/${state.workspace.id}/prospects/warm-lists">Back to warm lists</a>
      </div>`
    );
  }
  const members = state.prospects.slice(0, Math.min(4, state.prospects.length)).map((prospect) => [
    `<a href="#/workspace/${state.workspace.id}/prospects/${prospect.id}">${prospect.name}</a>`,
    prospect.title,
    prospect.company,
    `${prospect.score}`,
    `<span class="status-pill ${prospect.statusType === "warn" ? "warn" : "active"}">${prospect.status}</span>`,
  ]);

  return workspacePage(
    "prospects",
    session,
    `<div class="panel" style="margin-top:16px;">
      <div class="toolbar">
        <h3>${list.name}</h3>
        <a class="btn" href="#/workspace/${state.workspace.id}/prospects/warm-lists/${list.id}/edit">Edit list</a>
      </div>
      <div class="list-stack">
        <div class="list-item">
          <strong>Source</strong>
          <div class="muted">${list.source}</div>
        </div>
        <div class="list-item">
          <strong>Rules</strong>
          <div class="muted">${list.rules}</div>
        </div>
        <div class="list-item">
          <strong>Estimated list size</strong>
          <div class="muted">${list.count} prospects</div>
        </div>
      </div>
      <div style="margin-top:14px;">
        <h3>List members</h3>
        ${genericTable(members, ["Prospect", "Title", "Company", "Score", "Status"])}
      </div>
    </div>`
  );
}

function warmListSetupPage(editId = null) {
  const session = getSession();
  const state = getAppState();
  const list = editId ? state.warmLists.find((item) => item.id === editId) : null;
  return workspacePage(
    "prospects",
    session,
    `<div class="panel" style="margin-top:16px;">
      <h3>${list ? "Edit" : "Create"} warm list</h3>
      <form id="warm-list-form" onsubmit="return false;">
        <input type="hidden" name="id" value="${list ? list.id : ""}" />
        ${field("name", "List name", "ICP: SaaS Marketing Leaders", list?.name || "")}
        ${field("source", "Source", "Post Engagers + Apify Followers", list?.source || "")}
        <label class="field">
          <span>Rules</span>
          <textarea name="rules" placeholder="Role contains manager OR head of revenue">${list ? list.rules : ""}</textarea>
        </label>
        <button class="btn btn-primary" type="submit">${list ? "Save list" : "Create list"}</button>
      </form>
    </div>`
  );
}

function messagesPage(folder = "inbox", opts = {}) {
  const session = getSession();
  const state = getAppState();
  const validView = messageCategories.some((item) => item.key === folder) || messageFolders.includes(folder);
  const normalizedFolder = validView ? folder : "inbox";
  const leadId = opts.lead;
  const campaignId = opts.campaign;
  const linkedInConnected = state.integrations?.apify;
  const visibleMessages = state.messages
    .filter((message) => {
      if (normalizedFolder === "interested") return /response|maybe/i.test(message.status);
      if (normalizedFolder === "maybe") return /maybe/i.test(message.status);
      if (normalizedFolder === "not-interested") return /not interested/i.test(message.status);
      if (messageFolders.includes(normalizedFolder)) return message.folder === normalizedFolder;
      return message.folder === "inbox";
    })
    .filter((message) => {
      if (!leadId) return true;
      return message.prospectId === leadId || message.prospect.toLowerCase() === leadId.toLowerCase();
    })
    .filter((message) => {
      if (!campaignId) return true;
      return message.campaignId === campaignId;
    });

  const categoryRail = messageCategories
    .map((category) => {
      const count = category.count === "" ? "" : countMessagesForCategory(state.messages, category.key);
      return `
        <button class="message-category ${normalizedFolder === category.key ? "active" : ""}" data-folder="${category.key}">
          <span><span class="category-icon">${category.icon}</span>${category.label}</span>
          <span>${count}</span>
          <b>›</b>
        </button>
      `;
    })
    .join("");

  const rows = visibleMessages
    .map((m, index) => {
      const initials = m.prospect
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
      const priority = m.priority || (index % 3 === 0 ? "High" : "Medium");
      const statusTone = /not/i.test(m.status) ? "neutral" : /response|maybe/i.test(m.status) ? "orange" : "gray";
      const searchText = `${m.prospect} ${m.body} ${m.status} ${m.channel} ${m.template}`.toLowerCase();
      const dates = ["04/30/26", "04/29/26", "04/28/26", "04/27/26", "04/26/26", "04/25/26", "04/24/26", "04/23/26", "04/22/26", "04/21/26"];
      const date = dates[Math.min(index, dates.length - 1)];
      return `
        <tr class="message-row" data-href="#/workspace/${state.workspace.id}/messages/${m.id}" data-search="${attrSafe(searchText)}" data-status="${attrSafe(m.status.toLowerCase())}" data-priority="${attrSafe(priority.toLowerCase())}" data-campaign="${attrSafe(m.campaignId || "")}" data-last="${attrSafe(m.last || "")}">
          <td class="select-cell"><input class="message-select" type="checkbox" data-id="${m.id}" aria-label="Select ${m.prospect}" /></td>
          <td class="signal-cell"><span class="orange-dot"></span></td>
          <td class="person-cell">
            <span class="avatar-badge">${initials}</span>
            <span class="source-badge">${m.channel === "Actor Run" ? "↯" : "✽"}</span>
            <a href="#/workspace/${state.workspace.id}/messages/${m.id}">${m.prospect}</a>
          </td>
          <td class="snippet-cell">${m.body}</td>
          <td><span class="status-pill dashed">${priority}</span></td>
          <td><span class="reply-chip ${statusTone}">${m.status}</span></td>
          <td class="date-cell">${date}</td>
        </tr>
      `;
    })
    .join("");

  return workspacePage(
    "messages",
    session,
    `<div class="messages-workspace">
      <aside class="message-rail">${categoryRail}</aside>
      <section class="message-inbox">
        <div class="message-toolbar">
          <input class="message-search" id="message-search" placeholder="Search messages..." aria-label="Search messages" />
          <select class="message-control" id="message-campaign-filter" aria-label="Filter by campaign">
            <option value="">All campaigns</option>
            ${state.campaigns
              .map((campaign) => `<option value="${campaign.id}" ${campaign.id === campaignId ? "selected" : ""}>${campaign.name}</option>`)
              .join("")}
          </select>
          <select class="message-control" id="message-status-filter" aria-label="Filter by status">
            <option value="">All statuses</option>
            <option value="response">Responses</option>
            <option value="maybe">Maybe interested</option>
            <option value="not interested">Not interested</option>
            <option value="scheduled">Scheduled</option>
          </select>
          <button class="filter-btn" data-message-filter="campaign">◎ Campaign⌄</button>
          <button class="filter-btn" data-message-filter="status">♙ Status⌄</button>
          <button class="filter-btn" data-message-filter="date">◷ Date⌄</button>
          <button class="filter-btn" data-message-filter="priority">⌘ ICP-Fit⌄</button>
          <button class="filter-icon" data-message-filter="clear">♧</button>
          <span class="toolbar-divider"></span>
          <button class="filter-icon">☷</button>
          <button class="filter-icon">◎</button>
          <div class="bulk-actions" id="message-bulk-actions">
            <span><strong id="message-selected-count">0</strong> selected</span>
            <button class="btn btn-ghost" data-bulk-message-action="approve" ${linkedInConnected ? "" : "disabled"}>Approve</button>
            <button class="btn btn-ghost" data-bulk-message-action="schedule" ${linkedInConnected ? "" : "disabled"}>Schedule</button>
            <button class="btn btn-ghost" data-bulk-message-action="archive">Archive</button>
          </div>
        </div>
        ${
          linkedInConnected
            ? ""
            : `<div class="inline-warning">Connect the ${APP_NAME} Apify data connector to enable approve, schedule, and send actions.</div>`
        }
        <div class="message-table-wrap">
          <table class="message-table">
            <tbody>
              ${rows || `<tr><td class="muted small" colspan="7">No messages in this view.</td></tr>`}
              <tr id="message-empty-row" style="display:none;"><td class="muted small" colspan="7">No messages match the current filters.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>`,
    { showIntegrationHint: false }
  );
}

function messageDetailPage(messageId) {
  const session = getSession();
  const state = getAppState();
  const message = state.messages.find((m) => m.id === messageId);
  const apifyConnected = state.integrations?.apify;
  const linkedInConnected = !!state.integrations?.linkedin;

  if (!message) {
    return workspacePage(
      "messages",
      session,
      `<div class="panel" style="margin-top:16px;">
        <h3>Message not found</h3>
        <p class="muted">This message was archived, deleted, or is not present in the local workspace data.</p>
        <div class="row">
          <a class="btn btn-primary" href="#/workspace/${state.workspace.id}/messages/inbox">Back to inbox</a>
          <a class="btn btn-ghost" href="#/workspace/${state.workspace.id}/prospects">Search prospects</a>
        </div>
      </div>`
    );
  }

  const actions = [];
  if (message.folder !== "approved") {
    actions.push(
      `<button class="btn" data-action="message-action" data-id="${message.id}" data-decision="approve" ${apifyConnected ? "" : "disabled"} title="${apifyConnected ? "" : "Run Apify first to generate a reviewable draft"}">Approve draft</button>`
    );
  }
  if (message.folder !== "scheduled") {
    actions.push(
      `<button class="btn" data-action="message-action" data-id="${message.id}" data-decision="schedule" ${apifyConnected ? "" : "disabled"} title="${apifyConnected ? "" : "Run Apify first to generate a reviewable draft"}">Schedule review</button>`
    );
  }
  if (message.folder !== "sent") {
    actions.push(
      `<button class="btn" data-action="message-action" data-id="${message.id}" data-decision="send" ${apifyConnected ? "" : "disabled"} title="${linkedInConnected ? "Send through connected LinkedIn" : "LinkedIn is not connected; this marks the reviewed draft as manually sent"}">${linkedInConnected ? "Send on LinkedIn" : "Mark sent"}</button>`
    );
  }
  if (message.folder !== "archived") {
    actions.push(
      `<button class="btn btn-ghost" data-action="message-action" data-id="${message.id}" data-decision="archive">Archive</button>`
    );
  }

  const evidence = message.personalization?.evidence || [];
  const insights = message.personalization?.insights || {};
  const profileUrl = message.profileUrl && message.profileUrl !== "#" ? message.profileUrl : "";
  const sourceUrl = message.sourceUrl && message.sourceUrl !== "#" ? message.sourceUrl : "";
  const insightRows = [
    ["Role", insights.role],
    ["Recent post/activity", insights.recentActivity],
    ["Skills/topics", Array.isArray(insights.skills) ? insights.skills.join(", ") : insights.skills],
    ["Company context", insights.companyContext],
  ].filter(([, value]) => cleanDatasetText(value));

  return workspacePage(
    "messages",
    session,
    `<div class="panel" style="margin-top:16px;">
      <div class="toolbar">
        <h3>Message for ${message.prospect}</h3>
        <span class="chip">${message.channel}</span>
        <span class="status-pill ${message.folder === "inbox" ? "warn" : "active"}">${message.status}</span>
      </div>
      <div class="connector-notice">
        <strong>LinkedIn ${linkedInConnected ? "connected" : "not connected"}.</strong>
        ${linkedInConnected ? "Send actions can use the connected account." : "This workspace can draft and review from Apify data, but final LinkedIn sending is currently a manual/mark-sent step."}
      </div>
      <p class="muted">Template: ${message.template}</p>
      <div class="list-item message-detail">${message.body}</div>
      ${
        message.personalization
          ? `<div class="message-evidence">
              <strong>Personalization basis</strong>
              <span>${attrSafe(message.personalization.signal || "Imported public profile signal")}</span>
              <p>${attrSafe(message.personalization.summary || "Draft generated from the imported Apify dataset row.")}</p>
              ${
                insightRows.length
                  ? `<div class="insight-grid">
                      ${insightRows.map(([label, value]) => `<div><span>${label}</span><strong>${attrSafe(value)}</strong></div>`).join("")}
                    </div>`
                  : ""
              }
              <div class="tag-row">${evidence.map((tag) => `<span class="chip">${attrSafe(tag)}</span>`).join("")}</div>
              <div class="row">
                ${profileUrl ? `<a class="btn btn-ghost" href="${attrSafe(profileUrl)}" target="_blank" rel="noopener noreferrer">Open LinkedIn/source profile</a>` : ""}
                ${sourceUrl && sourceUrl !== profileUrl ? `<a class="btn btn-ghost" href="${attrSafe(sourceUrl)}" target="_blank" rel="noopener noreferrer">Open source</a>` : ""}
              </div>
            </div>`
          : ""
      }
      <div class="form-footer" style="margin-top:12px;">${actions.join("")}</div>
      <div class="small muted" style="margin-top:8px;"><a href="#/workspace/${state.workspace.id}/messages">Back to inbox</a></div>
      ${
        apifyConnected
          ? ""
          : `<p class="small muted" style="margin-top:10px;">Actions are disabled until Apify data connector is connected.</p>`
      }
    </div>`
  );
}

function templatesPage(options = new URLSearchParams()) {
  const session = getSession();
  const state = getAppState();
  const editId = options.get("edit");
  const template = editId ? state.templates.find((tpl) => tpl.id === editId) : null;

  const rows = state.templates
    .map(
      (tpl) => `
        <tr>
          <td>${tpl.name}</td>
          <td>${tpl.tone}</td>
          <td>${tpl.body}</td>
          <td>
            <a href="#/workspace/${state.workspace.id}/templates?edit=${tpl.id}" class="chip">Edit</a>
            <button class="btn btn-ghost" data-action="template-delete" data-id="${tpl.id}">Delete</button>
          </td>
        </tr>
      `
    )
    .join("");

  return workspacePage(
    "templates",
    session,
    `<div class="split" style="margin-top:16px;">
      <div class="panel" style="grid-column:span 2;">
        <h3>Saved Templates</h3>
        <table class="table">
          <thead>
            <tr><th>Name</th><th>Tone</th><th>Body</th><th>Actions</th></tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    <div class="panel">
        <h3>${template ? "Edit" : "New"} template</h3>
        <form id="template-form" onsubmit="return false;">
          <input type="hidden" name="template-id" value="${template ? template.id : ""}" />
          ${field("name", "Template name", "Founder opener", "text", template ? template.name : "Founder opener")}
          ${field("tone", "Tone", "Confident", "text", template ? template.tone : "Confident")}
          ${textAreaField("body", "Message body", "Hi {{first_name}}, great to connect...", template?.body || "")}
          <button class="btn btn-primary" type="submit">Save template</button>
        </form>
      </div>
    </div>`
  );
}

function studioPage() {
  const session = getSession();
  const state = getAppState();
  const productOffers = [
    "Decision-maker and business owner with full buying authority at a small-to-mid-size firm in a qualifying service industry.",
    "In-house marketing decision-maker at a qualifying service-industry firm responsible for lead generation performance, campaign execution, and conversion optimization.",
    "Artists, Creative Businesses, and Web3 Enterprises",
    "Private Dental, Practice Owner, and Aesthetic Clinic | AI-Assisted Web and Inquiry Automation | 10-500 Employees | US",
  ];
  return workspacePage(
    "studio",
    session,
    `<div class="studio-product-shell">
      <aside class="studio-product-nav">
        <div class="studio-nav-header"><button class="studio-tab active">⌘ Products</button><a class="square-btn" href="#/workspace/${state.workspace.id}/studio/create">+</a></div>
        <div class="product-tree">
          <div class="product-node active">⌘ <span>AWS Outreach Engine</span></div>
          ${productOffers
            .map((offer) => `<div class="product-node child"><span>⌘</span><p>${offer}</p><b>◉</b></div>`)
            .join("")}
          ${(state.studioDrafts || [])
            .map(
              (draft) => `
                <a class="product-node child compact studio-draft-node" href="#/workspace/${state.workspace.id}/studio/create?draft=${attrSafe(draft.id)}">
                  <span>◇</span><p>${attrSafe(draft.name)}</p><b>✎</b>
                </a>`
            )
            .join("")}
        </div>
        <div class="studio-hidden-drafts">${(state.studioDrafts || []).map((draft) => draft.name).join(" ")}</div>
        <div class="studio-nav-header lower"><button class="studio-tab">♨ Writing Styles</button><a class="square-btn" href="#/workspace/${state.workspace.id}/studio/create">+</a></div>
        <div class="product-tree">
          <div class="product-node child compact"><span>♨</span><p>My First Writing Style</p><b>◉</b></div>
        </div>
      </aside>
      <section class="studio-editor">
        <div class="studio-editor-header">
          <div><strong>AWS Outreach Engine</strong><button class="icon-button">✎</button></div>
          <div class="row">
            <button class="btn btn-ghost">◉ Share</button>
            <button class="btn btn-primary">Save</button>
            <button class="icon-button">⋮</button>
          </div>
        </div>
        <div class="studio-form-grid">
          <div class="studio-section-copy">
            <strong>Overview Information</strong>
            <span>Provide key company facts for accurate and grounded content creation.</span>
          </div>
          <div class="studio-fields">
            ${field("companyUrl", "Company URL", "URL of your company website.", "text", "www.awsoutreach.example/")}
            ${field("bookingLink", "Booking Link *", "URL for prospects to book a meeting with you.", "text", "https://www.awsoutreach.example/")}
            ${field("productUrl", "Product URL", "URL of your company product.", "text", "www.awsoutreach.example/")}
            ${textAreaField(
              "brief",
              "Brief Description *",
              "Describe your offer in a few words.",
              "AWS Outreach Engine is a live-data outreach workspace that turns Apify Actor runs, public web signals, and agent research into prioritized prospects, campaign-ready copy, and approval workflows."
            )}
            ${textAreaField(
              "icp",
              "Ideal Customer Profile",
              "Describe your ideal customer profile.",
              "Job Titles/Roles: Artists, creative professionals, business owners, entrepreneurs, Web3 founders, NFT creators, and digital enterprise leaders. Company Characteristics: Small to medium-sized businesses, independent artists and creators, Web3/blockchain startups, and emerging digital enterprises."
            )}
          </div>
          <div class="studio-divider"></div>
          <div class="studio-section-copy">
            <strong>Product Specifics</strong>
            <span>Provide key product information for accurate pitch creation.</span>
          </div>
          <div class="studio-fields">
            ${textAreaField("competitors", "Competitors", "List your main competitors.", "Not mentioned on website")}
            <label class="field repeat-field"><span>Value Propositions *</span>
              ${["Tailored digital solutions specifically designed for artists and businesses", "Comprehensive service offering combining website design, advertising, and strategic consulting", "Personalized boutique agency approach with dedicated attention to each client"].map((item) => `<div class="inline-input"><input value="${item}" /><button type="button">×</button></div>`).join("")}
            </label>
            <label class="field repeat-field"><span>Painpoints *</span>
              ${["Artists and creators struggling to build professional online presence", "Businesses lacking effective digital advertising strategies", "Small businesses without in-house resources for web conversion"].map((item) => `<div class="inline-input"><input value="${item}" /><button type="button">×</button></div>`).join("")}
            </label>
          </div>
        </div>
      </section>
    </div>`
  );
}

function studioCreatePage(options = new URLSearchParams()) {
  const session = getSession();
  const state = getAppState();
  const draft = state.studioDrafts.find((item) => item.id === options.get("draft"));
  const opener = draft?.opener || "Hi {{first_name}}, noticed {{company}} is investing in {{signal}}.";
  const followUp = draft?.followUp || "Sharing a quick idea that turns that signal into a warmer outbound motion.";
  const close = draft?.close || "Worth a short conversation this week?";
  return workspacePage(
    "studio",
    session,
    `<div class="studio-compose-grid" style="margin-top:16px;">
      <section class="panel">
        <div class="toolbar">
          <div>
            <h3>${draft ? "Edit" : "Create"} studio sequence</h3>
            <p class="muted">Compose each touch with variables, source context, and a human approval preview.</p>
          </div>
          <a class="btn btn-ghost" href="#/workspace/${state.workspace.id}/studio">Back</a>
        </div>
        <form id="studio-form" class="studio-form" onsubmit="return false;">
          <input type="hidden" name="draft-id" value="${draft ? draft.id : ""}" />
          ${field("name", "Sequence name", "Founder intro sequence", "text", draft?.name || "")}
          ${field("audience", "Audience", "vp_sales, founders", "text", draft?.audience || "")}
          ${textAreaField("opener", "Step 1 opener", "Personalized opener", opener)}
          ${textAreaField("follow-up", "Step 2 context", "Context note", followUp)}
          ${textAreaField("close", "Step 3 follow-up", "Final follow-up", close)}
          ${textAreaField(
            "notes",
            "Approval notes",
            "What should a reviewer know before approving?",
            draft?.notes || ""
          )}
          <button class="btn btn-primary" type="submit">Save draft</button>
        </form>
      </section>
      <aside class="panel sequence-preview">
        <div class="toolbar">
          <h3>Preview</h3>
          <span class="chip">3 touches</span>
        </div>
        <div class="sequence-step">
          <span>Step 1</span>
          <p>${opener}</p>
        </div>
        <div class="sequence-step">
          <span>Step 2</span>
          <p>${followUp}</p>
        </div>
        <div class="sequence-step">
          <span>Step 3</span>
          <p>${close}</p>
        </div>
      </aside>
    </div>`
  );
}

function studioV2Page() {
  const session = getSession();
  const state = getAppState();
  return studioPage(session, state);
}

function webVisitorsPage() {
  const session = getSession();
  const state = getAppState();
  const rows = state.webVisitors.map((visitor) => [visitor.day, visitor.profile, visitor.source, visitor.action]);
  return workspacePage(
    "web-visitors",
    session,
    `<div class="panel" style="margin-top:16px;">
      <h3>Web Visitors</h3>
      ${genericTable(rows, ["Observed", "Profile", "Source", "Latest action"])}
    </div>`
  );
}

function settingsPage(section = "company") {
  const session = getSession();
  const state = getAppState();
  const sections = ["company", "integrations", "intent", "profile", "seats"];
  const resolvedSection = sections.includes(section) ? section : "company";

  const options = sections
    .map(
      (item) =>
        `<a class="chip ${item === resolvedSection ? "active" : ""}" href="#/workspace/${state.workspace.id}/settings/${item}">${item
          .charAt(0)
          .toUpperCase() + item.slice(1)}</a>`
    )
    .join("");

  let sectionBody = "";
  if (resolvedSection === "company") {
    sectionBody = `
      <form id="settings-company-form" onsubmit="return false;">
        ${field("companyName", "Company name", "Company name", "text", state.settings.company.name)}
        ${field("industry", "Industry", "Industry", "text", state.settings.company.industry)}
        ${field("website", "Website", "https://your-company.com", "text", state.settings.company.website)}
        ${field("timezone", "Time zone", "America/New_York", "text", state.settings.company.timezone)}
        <button class="btn btn-primary" type="submit">Save</button>
      </form>
    `;
  }

  if (resolvedSection === "integrations") {
    sectionBody = `
      <div class="list-stack">
        <div class="list-item">
          <div class="toolbar">
            <strong>Apify Data Connector</strong>
            <span class="chip">${state.integrations.apify ? "Connected" : "Disconnected"}</span>
          </div>
          <p class="muted">Run Actors, import dataset rows, and convert fresh web data into campaign signals.</p>
          <div style="margin-top:6px; display:flex; gap:8px; flex-wrap:wrap;">
            <button class="btn" data-action="toggle-integration" data-provider="apify">
              ${state.integrations.apify ? "Disconnect" : "Connect"} Apify data connector
            </button>
            <a class="btn btn-primary" href="#/connect-apify">
              Open live connector
            </a>
            <a class="btn btn-ghost" href="${APIFY_CONSOLE_URL}" target="_blank" rel="noopener noreferrer">
              Open Apify Console
            </a>
          </div>
        </div>
        <div class="list-item">
          <div class="toolbar">
            <strong>LinkedIn sending</strong>
            <span class="chip">${state.integrations.linkedin ? "Connected" : "Not connected"}</span>
          </div>
          <p class="muted">Drafts are generated from Apify profile/source data. Actual LinkedIn sending requires a connected LinkedIn account; otherwise use Mark sent after manual review.</p>
          <div style="margin-top:6px;">
            <button class="btn" data-action="toggle-integration" data-provider="linkedin">
              ${state.integrations.linkedin ? "Disconnect" : "Mark LinkedIn connected"}
            </button>
          </div>
        </div>
        <div class="list-item">
          <div class="toolbar">
            <strong>HubSpot</strong>
            <span class="chip">${state.integrations.hubspot ? "Connected" : "Disconnected"}</span>
          </div>
          <p class="muted">Sync lead status and sequence metadata to HubSpot.</p>
          <div style="margin-top:6px;">
            <button class="btn" data-action="toggle-integration" data-provider="hubspot">
              ${state.integrations.hubspot ? "Disconnect" : "Connect"} HubSpot
            </button>
          </div>
        </div>
        <div class="list-item">
          <div class="toolbar">
            <strong>Slack</strong>
            <span class="chip">${state.integrations.slack ? "Connected" : "Disconnected"}</span>
          </div>
          <p class="muted">Push approvals and daily snapshots to Slack channels.</p>
          <div style="margin-top:6px;">
            <button class="btn" data-action="toggle-integration" data-provider="slack">
              ${state.integrations.slack ? "Disconnect" : "Connect"} Slack
            </button>
          </div>
        </div>
      </div>
    `;
  }

  if (resolvedSection === "intent") {
    sectionBody = `
      <form id="settings-intent-form" onsubmit="return false;">
        ${textAreaField("tone", "Primary tone", "Confident, concise, founder-first", state.settings.intent.tone)}
        ${textAreaField("signature", "Signature", "Company signature", state.settings.intent.signature)}
        ${field("bannedWords", "Restricted words", "spam, buy now", state.settings.intent.bannedWords)}
        <button class="btn btn-primary" type="submit">Save tone</button>
      </form>
    `;
  }

  if (resolvedSection === "profile") {
    sectionBody = `
      <form id="settings-profile-form" onsubmit="return false;">
        ${field("firstName", "First name", "First", "text", state.settings.profile.firstName)}
        ${field("lastName", "Last name", "Last", "text", state.settings.profile.lastName)}
        ${field("role", "Role", "Role", "text", state.settings.profile.role)}
        ${field("slackChannel", "Slack channel", "#outreach", "text", state.settings.profile.slackChannel)}
        <button class="btn btn-primary" type="submit">Save profile</button>
      </form>
    `;
  }

  if (resolvedSection === "seats") {
    const users = state.users
      .map(
        (u) => `
          <div class="list-item" style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
            <div>
              <strong>${u.firstName} ${u.lastName}</strong>
              <div class="muted small">${u.email}</div>
            </div>
            <button class="btn btn-ghost" data-action="remove-seat" data-id="${u.id}">Remove</button>
          </div>
        `
      )
      .join("");

    sectionBody = `
      <div class="list-stack">${users}</div>
      <div class="panel" style="margin-top:10px;">
        <h4>Invite teammate</h4>
        <form id="settings-seats-form" onsubmit="return false;" class="form-grid" style="grid-template-columns: 1fr 1fr;">
          ${field("email", "Email", "teammate@company.com")}
          ${field("firstName", "First Name", "First")}
          ${field("lastName", "Last Name", "Last")}
          <button class="btn btn-primary" type="submit">Add seat</button>
        </form>
      </div>
    `;
  }

  return workspacePage(
    "settings",
    session,
    `<div class="panel" style="margin-top:16px;">
      <h3>Settings</h3>
      <div class="row" style="margin-bottom: 12px;">${options}</div>
      <div class="small muted" style="margin-bottom:14px;">${resolvedSection.charAt(0).toUpperCase() + resolvedSection.slice(1)} settings for ${state.workspace.name}</div>
      ${sectionBody}
    </div>`
  );
}

function renderApifySignalCards(state) {
  const signals = (state.apifySignals || sampleApifySignals)
    .map((signal) => ({ ...signal, score: scoreApifySignal(signal) }))
    .sort((a, b) => b.score - a.score);

  return signals
    .slice(0, 6)
    .map(
      (signal) => `
        <div class="apify-signal-card">
          <div class="toolbar">
            <strong>${attrSafe(signal.company)}</strong>
            <span class="status-pill active">${signal.score}</span>
          </div>
          <div class="small muted">${attrSafe(signal.title)}</div>
          <p>${attrSafe(signal.summary || "Structured row imported from an Apify dataset.")}</p>
          <div class="tag-row">${(signal.evidence || []).map((tag) => `<span class="chip">${attrSafe(tag)}</span>`).join("")}</div>
          <div class="toolbar apify-card-footer">
            <span class="small muted">${attrSafe(signal.source || "Apify dataset")}</span>
            ${signal.url && signal.url !== "#" ? `<a class="small" href="${attrSafe(signal.url)}" target="_blank" rel="noopener noreferrer">Open source</a>` : ""}
          </div>
        </div>
      `
    )
    .join("");
}

function connectApifyPage(query = new URLSearchParams()) {
  const session = getSession();
  const state = getAppState();
  const connected = !!state.integrations.apify;
  const run = state.apifyRun || {};
  const campaignId = query?.get("campaign") || "";
  const campaign = campaignId ? state.campaigns.find((item) => item.id === campaignId) : null;
  const selectedActor = run.actorId || apifyActorOptions[0].id;
  const selectedActorConfig = apifyActorOptions.find((actor) => actor.id === selectedActor) || apifyActorOptions[0];
  const target = run.target || APIFY_DEFAULT_TARGET;
  const tokenLabel =
    run.tokenConfigured === true ? "API token ready" : run.tokenConfigured === false ? "API token missing" : "Checking token";
  const actorOptionsHtml = apifyActorOptions
    .map(
      (actor) =>
        `<option value="${actor.id}" ${actor.id === selectedActor ? "selected" : ""}>${actor.label}</option>`
    )
    .join("");

  return workspacePage(
    campaign ? "campaigns" : "settings",
    session,
    `<div class="apify-workspace-grid">
      <section class="panel apify-run-panel">
        <div class="toolbar">
          <div>
            <span class="eyebrow">Apify live web data</span>
            <h3>Data source</h3>
            <div class="small muted">${campaign ? `Staged for ${attrSafe(campaign.name)}` : "Pull public profile/source data into the workspace."}</div>
          </div>
          <div class="apify-status-stack compact">
            <span class="chip ${connected ? "active" : ""}">${connected ? "Connected" : "Disconnected"}</span>
            <span class="chip" id="apify-token-status">${tokenLabel}</span>
            <span class="chip">${apifyRunLabel(run)}</span>
          </div>
        </div>
        <p class="muted apify-workspace-copy">Run an Apify Actor, normalize the dataset rows, and create reviewable LinkedIn-style draft messages from the best signal.${campaign ? " Imported rows return directly to this campaign inbox." : ""}</p>

        <form id="apify-run-form" class="apify-run-form" onsubmit="return false;">
          <label class="field">
            <span>Actor</span>
            <select name="actorId" id="apify-actor-select">${actorOptionsHtml}</select>
          </label>
          <label class="field apify-target-field">
            <span>LinkedIn profile URL or search query</span>
            <input name="target" id="apify-target" value="${attrSafe(target)}" placeholder="linkedin.com/in/person or site:linkedin.com/in founder AWS credits" />
          </label>
          <label class="field apify-pages-field">
            <span>Pages</span>
            <input name="maxPages" type="number" min="1" max="5" value="${Math.min(5, Math.max(1, Number(run.maxPages || 1)))}" />
          </label>
          <button class="btn btn-primary" id="run-apify-crawl" type="submit">Run Apify Actor</button>
        </form>

        <div class="apify-link-row">
          <a class="btn btn-ghost" href="${campaign ? `#/workspace/${state.workspace.id}/campaigns/${campaign.id}` : `#/workspace/${state.workspace.id}/dashboard`}">Back to ${campaign ? "campaign" : "dashboard"}</a>
          <a class="btn btn-ghost" href="${APIFY_CONSOLE_URL}" target="_blank" rel="noopener noreferrer">Open Apify Console</a>
          <button class="btn" data-action="toggle-integration" data-provider="apify">${connected ? "Disconnect" : "Connect demo mode"}</button>
        </div>

        ${
          run.error
            ? `<div class="connector-notice"><strong>Last run:</strong> ${attrSafe(run.error)}</div>`
            : ""
        }
      </section>

      <aside class="panel apify-workflow-panel">
        <div class="toolbar">
          <h3>How it works</h3>
          <span class="chip">${Number(run.lastItemCount || 0)} rows</span>
        </div>
        <div class="apify-flow-grid">
          <div class="apify-flow-step">
            <span>1</span>
            <strong>Profile lookup</strong>
            <p>${attrSafe(selectedActorConfig.helper)} Paste a LinkedIn profile URL or search query when you want a person-level draft.</p>
          </div>
          <div class="apify-flow-step">
            <span>2</span>
            <strong>Dataset</strong>
            <p>Rows are scored for ICP fit, freshness, and evidence quality before import.</p>
          </div>
          <div class="apify-flow-step">
            <span>3</span>
            <strong>Draft for review</strong>
            <p>Imported rows become LinkedIn draft messages with source evidence for review.</p>
          </div>
        </div>
      </aside>

      <section class="panel apify-results-panel">
        <div class="toolbar apify-results-head">
          <div>
            <h3>Dataset signals</h3>
            <div class="small muted">${run.lastRunAt ? `Last live run ${attrSafe(run.lastRunAt)}` : "Run the Actor to replace these seeded examples with live Apify rows."}</div>
          </div>
          <button class="btn btn-ghost" data-action="import-prospect" data-campaign-id="${attrSafe(campaignId)}">Import top signal${campaign ? " to campaign" : ""}</button>
        </div>
        <div class="apify-signal-grid">
          ${renderApifySignalCards(state)}
        </div>
      </section>
    </div>`,
    { showIntegrationHint: false }
  );
}

function connectServicePage(provider = "hubspot", query = new URLSearchParams()) {
  if (provider === "apify") return connectApifyPage(query);

  const state = getAppState();
  const providers = {
    hubspot: {
      label: "HubSpot",
      external: false,
      description: "This is a local simulation; no external credentials are exchanged.",
    },
    slack: {
      label: "Slack",
      external: false,
      description: "This is a local simulation; no external credentials are exchanged.",
    },
    apify: {
      label: "Apify data connector",
      external: true,
      description:
        "Use the Apify Console to choose an Actor, then return here to mark the connector active in this local copy.",
    },
    linkedin: {
      label: "LinkedIn sending",
      external: false,
      description:
        "This demo can generate reviewable LinkedIn drafts from Apify profile/source data. Real LinkedIn sending is not connected unless you provide a compliant LinkedIn auth/session integration.",
    },
  };
  const providerKey = providers[provider] ? provider : "hubspot";
  const config = providers[providerKey];
  const connected = !!state.integrations[providerKey];

  return `
    <div class="app-root">
      <div class="panel hero" style="max-width: 520px; margin-top: 36px;">
        <div class="topbar">
          ${renderLogo()}
        </div>
        <h2>${config.label} connection</h2>
        <p class="muted">Current status: <strong>${connected ? "Connected" : "Disconnected"}</strong></p>
        <p class="small muted">${config.description}</p>
        <div class="row" style="margin-top: 10px;">
          ${
            config.external
              ? `<a class="btn btn-ghost" href="${APIFY_CONSOLE_URL}" target="_blank" rel="noopener noreferrer">Open Apify Console</a>`
              : ""
          }
          <button class="btn btn-primary" data-action="toggle-integration" data-provider="${providerKey}">
            ${connected ? "Disconnect" : "Connect"}
          </button>
          <a class="btn" href="#/workspace/${state.workspace.id}/settings/integrations">Open integrations settings</a>
        </div>
      </div>
    </div>
  `;
}

function authPage(provider, action = "start") {
  return `
    <div class="app-root">
      <div class="panel hero" style="max-width: 560px; margin-top: 36px;">
        <div class="topbar">
          ${renderLogo()}
        </div>
        <h2>${provider?.toUpperCase() || "Auth"} callback stub</h2>
        <p class="muted">This route simulates a provider callback flow. Current action: ${action}</p>
        <a class="btn btn-primary" href="#/workspace/${currentWorkspaceId()}/dashboard">Back to dashboard</a>
      </div>
    </div>
  `;
}

function testPage() {
  const state = getAppState();
  return `
    <div class="app-root">
      <div class="panel hero">
        <h2>Test / QA page</h2>
        <p class="muted">Local environment is up and seeded with ${state.prospects.length} prospects and ${state.campaigns.length} campaigns.</p>
        <div class="small muted">Use this surface to verify route rendering and page transitions.</div>
        <a class="btn btn-primary" href="#/workspace/${state.workspace.id}/dashboard">Go to dashboard</a>
      </div>
    </div>
  `;
}

function notFoundPage(route) {
  return `
    <div class="app-root">
      <div class="panel">
        <div class="topbar">${renderLogo()}</div>
        <h2>Route not found</h2>
        <p class="muted">No matching page for <strong>${route}</strong>.</p>
        <a class="btn" href="#/">Go home</a>
      </div>
    </div>
  `;
}

function renderWorkspaceSection(section, query) {
  const session = getSession();
  const state = getAppState();

  if (!session) {
    setHash("/login?return=" + encodeURIComponent(`/workspace/${state.workspace.id}/${section || "dashboard"}`));
    return;
  }

  const normalizedSection = (section || "").replace(/^\/+|\/+$/g, "") || "dashboard";
  const segments = normalizedSection.split("/").filter(Boolean);
  const top = segments[0];
  const rest = segments.slice(1);

  if (top === "dashboard") return dashboardPage();
  if (top === "analytics") return analyticsPage();
  if (top === "approvals") {
    if (rest[0]) return approvalDetailPage(rest[0]);
    return approvalsPage();
  }
  if (top === "inbox") return messagesPage("inbox", { lead: query.get("lead"), campaign: query.get("campaign") });

  if (top === "campaigns") {
    if (!rest[0]) return campaignsPage();
    if (rest[0] === "create") return campaignsCreatePage();
    return campaignDetailPage(rest[0]);
  }

  if (top === "messages") {
    if (!rest[0]) return messagesPage("inbox", { lead: query.get("lead"), campaign: query.get("campaign") });
    const folderOrId = rest[0];
    if (messageFolders.includes(folderOrId) || messageCategories.some((item) => item.key === folderOrId)) {
      return messagesPage(folderOrId, { lead: query.get("lead"), campaign: query.get("campaign") });
    }
    return messageDetailPage(folderOrId);
  }

  if (top === "prospects") {
    if (!rest[0]) return prospectsPage("all");
    if (rest[0] === "warm-lists") {
      if (!rest[1]) return warmListsPage();
      if (rest[1] === "setup") return warmListSetupPage();
      if (rest[2] === "edit") return warmListSetupPage(rest[1]);
      return warmListDetailPage(rest[1]);
    }
    if (state.prospects.some((item) => item.id === rest[0])) return prospectDetailPage(rest[0]);
    if (["all", "qualified", "dnc", "duplicate"].includes(rest[0])) return prospectsPage(rest[0]);
    return prospectDetailPage(rest[0]);
  }

  if (top === "studio") {
    if (!rest[0]) return studioPage();
    if (rest[0] === "create") return studioCreatePage(query);
    if (rest[0] === "studio-v2") return studioV2Page();
    return studioPage();
  }

  if (top === "templates") {
    if (rest[0] === "edit" && rest[1]) return templatesPage(new URLSearchParams({ edit: rest[1] }));
    return templatesPage(query);
  }

  if (top === "web-visitors") return webVisitorsPage();

  if (top === "settings") return settingsPage(rest[0] || "company");
  if (top === "connect-apify") return connectApifyPage();

  return notFoundPage(`/workspace/${state.workspace.id}/${section}`);
}

function protectedPath(route) {
  return (
    route === "/workspace" ||
    route === "/workspace/" ||
    route.startsWith("/workspace/") ||
    route.startsWith("/setup-account/") ||
    route.startsWith("/connect-") ||
    route.startsWith("/auth") ||
    route.startsWith("/welcome")
  );
}

function routeParser(route) {
  const { path } = getQueryParams(route);
  const cleanRoute = path || "/";
  const parts = cleanRoute.split("/").filter(Boolean);
  const first = parts[0] || "";

  if (cleanRoute === "/") return { page: "home" };
  if (first === "login") {
    const { query } = getQueryParams(route);
    return { page: "login", query };
  }
  if (first === "signup") return { page: "signup" };
  if (first === "reset-password") return { page: "reset-password" };
  if (first === "setup-account" && parts[1]) return { page: "setup", step: parts[1] };
  if (first === "setup-account" && !parts[1]) return { page: "setup", step: setupSteps[0].id };
  if (first === "welcome") return { page: "welcome" };

  if (first === "connect-hubspot") return { page: "connect-service", provider: "hubspot" };
  if (first === "connect-slack") return { page: "connect-service", provider: "slack" };
  if (first === "connect-linkedin") return { page: "connect-service", provider: "linkedin" };
  if (first === "connect-apify") return { page: "connect-service", provider: "apify" };
  if (first === "test") return { page: "test" };
  if (first === "auth" && parts[1]) return { page: "auth", provider: parts[1], action: parts[2] || "callback" };

  if (first === "workspace") {
    const workspaceId = parts[1] || currentWorkspaceId();
    return { page: "workspace", workspaceId, section: parts.slice(2).join("/") || "dashboard" };
  }

  return { page: "not-found", route };
}

function render() {
  const rawRoute = getPathFromHash();
  const routeData = routeParser(rawRoute);
  const { query } = getQueryParams(rawRoute);
  let content;

  getAppState();

  if (protectedPath(rawRoute) && !getSession()) {
    setHash(`/login?return=` + encodeURIComponent(rawRoute));
    return;
  }

  switch (routeData.page) {
    case "home":
      content = renderHome(routeData);
      break;
    case "login":
      content = loginPage(rawRoute, query);
      break;
    case "signup":
      content = signupPage();
      break;
    case "reset-password":
      content = resetPasswordPage();
      break;
    case "setup":
      content = setupPage(routeData.step);
      break;
    case "workspace":
      content = renderWorkspaceSection(routeData.section, query);
      break;
    case "connect-service":
      content = connectServicePage(routeData.provider, query);
      break;
    case "auth":
      content = authPage(routeData.provider, routeData.action);
      break;
    case "test":
      content = testPage();
      break;
    case "welcome":
      content = `
        <div class="app-root">
          <div class="panel hero">
            <h1>Welcome to ${APP_NAME}</h1>
            <p class="muted">Workspace setup is complete. You can start building campaigns now.</p>
            <a href="#/workspace/${currentWorkspaceId()}/dashboard" class="btn btn-primary">Go to dashboard</a>
          </div>
        </div>
      `;
      break;
    default:
      content = notFoundPage(rawRoute);
  }

  app.innerHTML = content;

  bindActions();

  if (routeData.page === "workspace") {
    const activeSection = (routeData.section || "dashboard").split("/")[0];
    const selected = app.querySelector(`[href*="/workspace/${routeData.workspaceId}/${activeSection}"]`);
    if (selected) {
      selected.classList.add("active");
    }
  }
}

function flash(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1600);
}

function handleApprovalDecision(id, decision) {
  const normalized = decision === "approve" ? "approve" : "reject";
  const state = getAppState();
  const idx = state.approvals.findIndex((approval) => approval.id === id);
  if (idx === -1) return;

  const [approval] = state.approvals.splice(idx, 1);
  state.resolvedApprovalIds = Array.from(new Set([...(state.resolvedApprovalIds || []), approval.id]));
  if (normalized === "approve") {
    const currentMessage = state.messages.find(
      (message) => message.prospect === approval.prospect && message.status === "Awaiting Response"
    );
    if (currentMessage) {
      currentMessage.status = "Approved";
      currentMessage.folder = "approved";
      currentMessage.last = "just now";
    } else {
      state.messages.unshift({
        id: `m_${Date.now()}`,
        prospectId: "",
        prospect: approval.prospect,
        channel: "Connect",
        status: "Approved",
        folder: "approved",
        last: "just now",
        template: approval.action,
        body: `Campaign ${approval.campaignId} approval cleared, message is now editable in the studio.`,
        campaignId: approval.campaignId,
      });
    }
    state.activity = {
      ...INITIAL_STATE.activity,
      ...(state.activity || {}),
      approvalsResolved: Number(state.activity?.approvalsResolved || 0) + 1,
      agentActionsSent: Number(state.activity?.agentActionsSent || 0) + 1,
    };
    flash(`${approval.prospect}: approval accepted`);
  } else {
    flash(`${approval.prospect}: approval rejected`);
  }

  setAppState(state);
  render();
}

function handleCampaignToggle(campaignId, nextStatus) {
  updateState((draft) => {
    const campaign = draft.campaigns.find((item) => item.id === campaignId);
    if (!campaign) return;
    campaign.status = nextStatus || (campaign.status === "Active" ? "Paused" : "Active");
  });
  flash("Campaign status updated");
  render();
}

function handleCampaignDuplicate(campaignId) {
  if (!assertApifyConnected("Campaign duplication")) return;

  updateState((draft) => {
    const original = draft.campaigns.find((item) => item.id === campaignId);
    if (!original) return;
    const next = cloneValue(original);
    next.id = `cmp_${Date.now()}`;
    next.name = `${original.name} (copy)`;
    next.status = "Draft";
    draft.campaigns.unshift(next);
  });
  flash("Campaign duplicated");
  render();
}

function handleMessageAction(messageId, action) {
  const state = getAppState();
  const message = state.messages.find((item) => item.id === messageId);
  if (!message) return;

  if (action === "approve" || action === "schedule" || action === "send") {
    if (!assertApifyConnected("Message actions")) return;
  }

  if (action === "approve") {
    message.status = "Approved";
    message.folder = "approved";
    message.last = "just now";
  }
  if (action === "schedule") {
    message.status = "Scheduled";
    message.folder = "scheduled";
    message.last = "just now";
  }
  if (action === "send") {
    message.status = "Sent";
    message.folder = "sent";
    message.last = "just now";
  }
  if (action === "archive") {
    message.status = "Archived";
    message.folder = "archived";
    message.last = "just now";
  }

  state.activity = {
    ...INITIAL_STATE.activity,
    ...(state.activity || {}),
  };
  if (action === "approve") {
    state.activity.approvalsResolved = Number(state.activity.approvalsResolved || 0) + 1;
    state.activity.agentActionsSent = Number(state.activity.agentActionsSent || 0) + 1;
  }
  if (action === "schedule") {
    state.activity.messagesScheduled = Number(state.activity.messagesScheduled || 0) + 1;
    state.activity.agentActionsSent = Number(state.activity.agentActionsSent || 0) + 1;
  }
  if (action === "send") {
    state.activity.messagesSent = Number(state.activity.messagesSent || 0) + 1;
    state.activity.agentActionsSent = Number(state.activity.agentActionsSent || 0) + 1;
    if (message.channel === "Connect") {
      state.activity.connectRequestsSent = Number(state.activity.connectRequestsSent || 0) + 1;
    }
  }

  setAppState(state);
  flash(`Message ${action} applied`);
  render();
}

function handleTemplateSubmit(form) {
  const idInput = form.querySelector("[name='template-id']");
  const name = form.querySelector("[name='name']").value.trim() || `Template ${Date.now()}`;
  const tone = form.querySelector("[name='tone']").value.trim() || "Neutral";
  const body = form.querySelector("[name='body']").value.trim() || "";
  const existingTemplateId = idInput.value;

  updateState((draft) => {
    if (existingTemplateId) {
      const template = draft.templates.find((item) => item.id === existingTemplateId);
      if (template) {
        template.name = name;
        template.tone = tone;
        template.body = body;
      }
      return;
    }

    draft.templates.push({
      id: `tpl_${Date.now()}`,
      name,
      tone,
      body,
    });
  });

  flash("Template saved");
  render();
  setTimeout(() => {
    setHash(`/workspace/${currentWorkspaceId()}/templates`);
  }, 220);
}

function handleTemplateDelete(templateId) {
  updateState((draft) => {
    const idx = draft.templates.findIndex((tpl) => tpl.id === templateId);
    if (idx === -1) return;
    draft.templates.splice(idx, 1);
  });
  flash("Template deleted");
  render();
}

function handleWarmListSubmit(form) {
  const id = form.querySelector("[name='id']").value || "";
  const name = form.querySelector("[name='name']").value.trim() || "Warm list";
  const source = form.querySelector("[name='source']").value.trim() || "Manual upload";
  const rules = form.querySelector("[name='rules']").value.trim() || "No rule";

  updateState((draft) => {
    if (id) {
      const list = draft.warmLists.find((item) => item.id === id);
      if (list) {
        list.name = name;
        list.source = source;
        list.rules = rules;
      }
      return;
    }

    draft.warmLists.push({
      id: `wl_${Date.now()}`,
      name,
      source,
      rules,
      count: Math.floor(Math.random() * 190) + 12,
    });
  });

  flash(`Warm list ${id ? "updated" : "created"}`);
  setHash(`/workspace/${currentWorkspaceId()}/prospects/warm-lists`);
}

function handleProspectImport(campaignId = "") {
  let campaignName = "";
  updateState((draft) => {
    const signal = (draft.apifySignals || sampleApifySignals)[0] || sampleApifySignals[0];
    const id = `p_${Date.now()}`;
    const targetCampaign =
      draft.campaigns.find((campaign) => campaign.id === campaignId) ||
      draft.campaigns[0] ||
      null;
    campaignName = targetCampaign?.name || "";
    const person = cleanDatasetText(signal.person || "");
    const company = cleanDatasetText(signal.company || "Unknown company");
    const name = person || `${company} Signal`;
    const personalizedDraft = buildPersonalizedDraft(signal, targetCampaign);
    const profileUrl = signal.profileUrl && signal.profileUrl !== "#" ? signal.profileUrl : signal.url;
    draft.integrations.apify = true;
    draft.prospects.unshift({
      id,
      name,
      title: person ? "LinkedIn-sourced prospect" : "Live-data prospect",
      company,
      score: Math.min(99, scoreApifySignal(signal)),
      status: "Qualified",
      statusType: "active",
      profileUrl,
    });
    draft.messages.unshift({
      id: `m_${Date.now()}`,
      prospectId: id,
      prospect: name,
      channel: "LinkedIn Draft",
      status: "Draft for Review",
      priority: "High",
      folder: "inbox",
      last: "just now",
      template: "Personalized LinkedIn opener",
      body: personalizedDraft,
      campaignId: targetCampaign?.id || "cmp_01",
      sourceUrl: signal.url,
      profileUrl,
      personalization: {
        signal: signal.title,
        summary: signal.summary,
        evidence: signal.evidence || [],
        insights: signal.insights || {},
        source: signal.source || "Apify dataset",
      },
    });
    if (targetCampaign) {
      targetCampaign.prospects = Number(targetCampaign.prospects || 0) + 1;
    }
    draft.activity = {
      ...INITIAL_STATE.activity,
      ...(draft.activity || {}),
      prospectsImported: Number(draft.activity?.prospectsImported || 0) + 1,
      agentActionsSent: Number(draft.activity?.agentActionsSent || 0) + 1,
    };
  });
  flash(`Live-data prospect imported${campaignName ? ` to ${campaignName}` : ""}`);
  if (campaignId) {
    setHash(`/workspace/${currentWorkspaceId()}/messages/inbox?campaign=${encodeURIComponent(campaignId)}`);
    return;
  }
  render();
}

function handleIntegrationToggle(provider) {
  const normalized =
    provider === "hubspot" ? "hubspot" :
    provider === "slack" ? "slack" :
    provider === "apify" ? "apify" :
    provider === "linkedin" ? "linkedin" :
    "hubspot";
  updateState((draft) => {
    draft.integrations[normalized] = !draft.integrations[normalized];
    if (normalized === "apify") {
      draft.apifyRun = {
        ...(draft.apifyRun || INITIAL_STATE.apifyRun),
        status: draft.integrations[normalized] ? draft.apifyRun?.status || "sample" : "idle",
        error: "",
      };
    }
  });
  const labels = { apify: "Apify data connector", hubspot: "HubSpot", slack: "Slack", linkedin: "LinkedIn sending" };
  flash(`${labels[normalized]} ${getAppState().integrations[normalized] ? "connected" : "disconnected"}`);
  render();
}

async function refreshApifyStatus(statusNode) {
  if (!statusNode) return;
  try {
    const response = await fetch("/api/apify/status", { headers: { Accept: "application/json" } });
    const payload = await response.json();
    statusNode.textContent = payload.configured ? "API token ready" : "API token missing";
    statusNode.classList.toggle("active", !!payload.configured);
    const state = getAppState();
    state.apifyRun = {
      ...(state.apifyRun || INITIAL_STATE.apifyRun),
      tokenConfigured: !!payload.configured,
    };
    setAppState(state);
  } catch {
    statusNode.textContent = "Status unavailable";
  }
}

async function runApifyActor(form, button) {
  let actorId = form?.querySelector("[name='actorId']")?.value || apifyActorOptions[0].id;
  const target = form?.querySelector("[name='target']")?.value.trim() || APIFY_DEFAULT_TARGET;
  const maxPages = form?.querySelector("[name='maxPages']")?.value || 1;
  const previousText = button?.textContent || "Run Apify Actor";
  if (actorId === "apify/website-content-crawler" && /linkedin\.com\/in|site:linkedin\.com\/in/i.test(target)) {
    actorId = "apify/google-search-scraper";
  }

  if (button) {
    button.disabled = true;
    button.textContent = "Running...";
  }

  updateState((draft) => {
    draft.apifyRun = {
      ...(draft.apifyRun || INITIAL_STATE.apifyRun),
      actorId,
      target,
      status: "running",
      error: "",
    };
  });

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), APIFY_RUN_TIMEOUT_MS);

  try {
    const response = await fetch("/api/apify/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        actorId,
        input: buildApifyInput(actorId, target, maxPages),
      }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Apify run failed.");

    const rows = extractApifyItems(payload);
    const normalizedRows = normalizeApifyRows(rows.length ? rows : sampleApifySignals);
    updateState((draft) => {
      draft.apifySignals = normalizedRows;
      draft.integrations.apify = true;
      draft.apifySampleLoaded = false;
      draft.apifyRun = {
        ...(draft.apifyRun || INITIAL_STATE.apifyRun),
        actorId,
        target,
        maxPages: Math.min(5, Math.max(1, Number(maxPages) || 1)),
        status: "success",
        lastRunAt: new Date().toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
        lastItemCount: normalizedRows.length,
        tokenConfigured: true,
        error: "",
      };
      draft.activity = {
        ...INITIAL_STATE.activity,
        ...(draft.activity || {}),
        actorRunsCompleted: Number(draft.activity?.actorRunsCompleted || 0) + 1,
        liveRowsImported: Number(draft.activity?.liveRowsImported || 0) + normalizedRows.length,
      };
    });
    flash(`Apify Actor returned ${normalizedRows.length} dataset rows.`);
    render();
  } catch (error) {
    const message =
      error.name === "AbortError"
        ? "Apify Actor run took longer than 45 seconds."
        : error.message;
    updateState((draft) => {
      draft.apifySignals = sampleApifySignals;
      draft.apifySampleLoaded = true;
      draft.integrations.apify = true;
      draft.apifyRun = {
        ...(draft.apifyRun || INITIAL_STATE.apifyRun),
        actorId,
        target,
        maxPages: Math.min(5, Math.max(1, Number(maxPages) || 1)),
        status: "sample",
        lastItemCount: sampleApifySignals.length,
        tokenConfigured: message.includes("Missing APIFY_TOKEN") ? false : draft.apifyRun?.tokenConfigured ?? null,
        error: `${message} Sample dataset is loaded so the demo can continue.`,
      };
    });
    flash(`${message} Sample dataset loaded.`);
    render();
  } finally {
    window.clearTimeout(timeoutId);
    if (button) {
      button.disabled = false;
      button.textContent = previousText;
    }
  }
}

function handleSettingsSave(section, form) {
  if (section === "company") {
    const companyName = form.querySelector("[name='companyName']").value;
    const industry = form.querySelector("[name='industry']").value;
    const website = form.querySelector("[name='website']").value;
    const timezone = form.querySelector("[name='timezone']").value;

    updateState((draft) => {
      draft.settings.company = {
        ...draft.settings.company,
        name: companyName,
        industry,
        website,
        timezone,
      };
      draft.workspace.name = companyName;
    });
    flash("Company settings saved");
    return;
  }

  if (section === "intent") {
    const tone = form.querySelector("[name='tone']").value;
    const signature = form.querySelector("[name='signature']").value;
    const bannedWords = form.querySelector("[name='bannedWords']").value;

    updateState((draft) => {
      draft.settings.intent = {
        ...draft.settings.intent,
        tone,
        signature,
        bannedWords,
      };
    });
    flash("Intent settings saved");
    return;
  }

  if (section === "profile") {
    const firstName = form.querySelector("[name='firstName']").value;
    const lastName = form.querySelector("[name='lastName']").value;
    const role = form.querySelector("[name='role']").value;
    const slackChannel = form.querySelector("[name='slackChannel']").value;

    updateState((draft) => {
      draft.settings.profile = {
        ...draft.settings.profile,
        firstName,
        lastName,
        role,
        slackChannel,
      };
    });

    const session = getSession();
    if (session) {
      setSession(session.email, firstName, lastName);
    }

    flash("Profile settings saved");
  }
}

function handleSeatSubmit(form) {
  const firstName = form.querySelector("[name='firstName']").value.trim() || "Team";
  const lastName = form.querySelector("[name='lastName']").value.trim() || "Member";
  const email = form.querySelector("[name='email']").value.trim() || `user_${Date.now()}@company.com`;

  updateState((draft) => {
    if (draft.users.find((u) => u.email.toLowerCase() === email.toLowerCase())) return;
    draft.users.push({
      id: `u_${Date.now()}`,
      email,
      firstName,
      lastName,
    });
  });
  flash("Team member added");
  render();
}

function handleSeatRemove(id) {
  updateState((draft) => {
    const idx = draft.users.findIndex((u) => u.id === id);
    if (idx === -1) return;
    draft.users.splice(idx, 1);
  });
  flash("Team member removed");
  render();
}

function handleCampaignCreate(form) {
  const name = form.querySelector("[name='name']").value.trim() || "Untitled Campaign";
  const audience = form.querySelector("[name='audience']").value.trim() || "Manual";
  const message = form.querySelector("[name='message']").value.trim() || "Hello";
  const goal = form.querySelector("[name='goal']").value.trim() || "15%";

  const id = `cmp_${Date.now()}`;
  updateState((draft) => {
    draft.campaigns.unshift({
      id,
      name,
      status: "Draft",
      prospects: 0,
      sent: 0,
      replies: "0%",
      scope: audience,
      objective: message,
      goal,
    });
    draft.activity = {
      ...INITIAL_STATE.activity,
      ...(draft.activity || {}),
      campaignsCreated: Number(draft.activity?.campaignsCreated || 0) + 1,
    };
  });

  flash("Campaign draft created");
  setTimeout(() => {
    setHash(`/workspace/${currentWorkspaceId()}/campaigns/${id}`);
  }, 500);
}

function handleStudioSubmit(form) {
  const id = form.querySelector("[name='draft-id']")?.value || `draft_${Date.now()}`;
  const name = form.querySelector("[name='name']").value.trim() || "Untitled sequence";
  const audience = form.querySelector("[name='audience']").value.trim() || "Manual audience";
  const notes = form.querySelector("[name='notes']").value.trim() || "No notes yet.";
  const opener = form.querySelector("[name='opener']")?.value.trim() || "Personalized opener";
  const followUp = form.querySelector("[name='follow-up']")?.value.trim() || "Context follow-up";
  const close = form.querySelector("[name='close']")?.value.trim() || "Short closing message";

  updateState((draft) => {
    const existing = draft.studioDrafts.find((item) => item.id === id);
    if (existing) {
      existing.name = name;
      existing.audience = audience;
      existing.notes = notes;
      existing.opener = opener;
      existing.followUp = followUp;
      existing.close = close;
      existing.updatedAt = "just now";
      return;
    }
    draft.studioDrafts.unshift({ id, name, audience, notes, opener, followUp, close, updatedAt: "just now" });
  });
  flash("Studio draft saved");
  setHash(`/workspace/${currentWorkspaceId()}/studio`);
  render();
}

function bindActions() {
  const session = getSession();
  const workspaceId = currentWorkspaceId();
  const logoutBtn = document.getElementById("logout-btn") || document.getElementById("logout-btn-aux");
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      clearSession();
      setHash("/login");
    };
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
      loginForm.onsubmit = (event) => {
        event.preventDefault();
      const emailInput = loginForm.querySelector("input[name='email']");
      const passwordInput = loginForm.querySelector("input[name='password']");
      const email = emailInput ? emailInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value : "";
      const loginError = document.getElementById("login-error");

      if (email !== DEMO_CREDENTIALS.email || password !== DEMO_CREDENTIALS.password) {
        if (loginError) {
          loginError.textContent = "Invalid credentials. Use the demo login shown below.";
          loginError.style.display = "block";
        }
        return;
      }

      const returnTo = document.getElementById("return-target")?.value || "";
      setSession(email, DEMO_CREDENTIALS.firstName, DEMO_CREDENTIALS.lastName);
      if (loginError) loginError.style.display = "none";
      setHash(returnTo || `/workspace/${workspaceId}/dashboard`);
    };
  }

  const fillDemoLogin = document.getElementById("fill-demo-login");
  if (fillDemoLogin) {
    fillDemoLogin.onclick = () => {
      const emailInput = document.getElementById("login-email");
      const passwordInput = document.getElementById("login-password");
      if (emailInput) emailInput.value = DEMO_CREDENTIALS.email;
      if (passwordInput) passwordInput.value = DEMO_CREDENTIALS.password;
    };
  }

  const googleLogin = document.getElementById("google-login");
  if (googleLogin) {
    googleLogin.onclick = () => {
      const email = "user@awsoutreach.engine";
      setSession(email, "Google", "Demo");
      const returnTo = document.getElementById("return-target")?.value || "";
      setHash(returnTo || `/workspace/${workspaceId}/dashboard`);
    };
  }

  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.onsubmit = (event) => {
      event.preventDefault();
      const email = signupForm.querySelector("input[name='email']").value.trim() || "new@awsoutreach.engine";
      const firstName = signupForm.querySelector("input[name='firstName']").value.trim() || "New";
      const lastName = signupForm.querySelector("input[name='lastName']").value.trim() || "User";
      setSession(email, capitalize(firstName), lastName);
      setHash(`/setup-account/${setupSteps[0].id}`);
    };
  }

  const googleSignup = document.getElementById("google-signup");
  if (googleSignup) {
    googleSignup.onclick = () => {
      setSession("new@awsoutreach.engine", "Google", "User");
      setHash(`/setup-account/${setupSteps[0].id}`);
    };
  }

  const resetForm = document.getElementById("reset-form");
  if (resetForm) {
    resetForm.onsubmit = (event) => {
      event.preventDefault();
      const email = resetForm.querySelector("input").value || "user@awsoutreach.engine";
      flash(`Reset link sent to ${email}`);
    };
  }

  const skipSetup = document.getElementById("skip-setup");
  if (skipSetup) {
    skipSetup.onclick = () => setHash("/welcome");
  }

  const finishSetup = document.getElementById("finish-setup");
  if (finishSetup) {
    finishSetup.onclick = () => setHash("/welcome");
  }

  const connectApifySetup = document.getElementById("connect-apify-setup");
  if (connectApifySetup) {
    connectApifySetup.onclick = () => {
      if (connectApifySetup.dataset.extensionState !== "connected") {
        setHash("/connect-apify");
        return;
      }
      flash("Apify data connector is already linked.");
    };
  }

  const newCampaign = document.getElementById("new-campaign");
  if (newCampaign) {
    newCampaign.onclick = () => {
      setHash(`/workspace/${workspaceId}/campaigns/create`);
    };
  }

  const campaignCreate = document.getElementById("campaign-create-form");
  if (campaignCreate) {
    campaignCreate.onsubmit = (event) => {
      event.preventDefault();
      handleCampaignCreate(campaignCreate);
    };
  }

  const apifyStatus = document.getElementById("apify-token-status");
  if (apifyStatus) refreshApifyStatus(apifyStatus);

  const apifyRunForm = document.getElementById("apify-run-form");
  if (apifyRunForm) {
    apifyRunForm.onsubmit = (event) => {
      event.preventDefault();
      runApifyActor(apifyRunForm, document.getElementById("run-apify-crawl"));
    };
  }

  const runApifyCrawl = document.getElementById("run-apify-crawl");
  if (runApifyCrawl && !runApifyCrawl.closest("form")) {
    runApifyCrawl.onclick = async () => {
      const fallbackForm = {
        querySelector: (selector) => {
          const values = {
            "[name='actorId']": { value: apifyActorOptions[0].id },
            "[name='target']": { value: APIFY_DEFAULT_TARGET },
            "[name='maxPages']": { value: 1 },
          };
          return values[selector] || null;
        },
      };
      await runApifyActor(fallbackForm, runApifyCrawl);
    };
  }

  const studioForm = document.getElementById("studio-form");
  if (studioForm) {
    studioForm.onsubmit = (event) => {
      event.preventDefault();
      handleStudioSubmit(studioForm);
    };
  }

  const templateForm = document.getElementById("template-form");
  if (templateForm) {
    templateForm.onsubmit = (event) => {
      event.preventDefault();
      handleTemplateSubmit(templateForm);
    };
  }

  const warmListForm = document.getElementById("warm-list-form");
  if (warmListForm) {
    warmListForm.onsubmit = (event) => {
      event.preventDefault();
      handleWarmListSubmit(warmListForm);
    };
  }

  const companyForm = document.getElementById("settings-company-form");
  if (companyForm) {
    companyForm.onsubmit = (event) => {
      event.preventDefault();
      handleSettingsSave("company", companyForm);
      render();
    };
  }

  const intentForm = document.getElementById("settings-intent-form");
  if (intentForm) {
    intentForm.onsubmit = (event) => {
      event.preventDefault();
      handleSettingsSave("intent", intentForm);
      render();
    };
  }

  const profileForm = document.getElementById("settings-profile-form");
  if (profileForm) {
    profileForm.onsubmit = (event) => {
      event.preventDefault();
      handleSettingsSave("profile", profileForm);
      render();
    };
  }

  const seatsForm = document.getElementById("settings-seats-form");
  if (seatsForm) {
    seatsForm.onsubmit = (event) => {
      event.preventDefault();
      handleSeatSubmit(seatsForm);
    };
  }

  document.querySelectorAll("[data-folder]").forEach((btn) => {
    btn.onclick = () => {
      const folder = btn.getAttribute("data-folder");
      setHash(`/workspace/${workspaceId}/messages/${folder}`);
    };
  });

  document.querySelectorAll(".message-row[data-href]").forEach((row) => {
    row.onclick = (event) => {
      if (event.target && event.target.closest && event.target.closest("a,button,input")) return;
      setHash(row.getAttribute("data-href").replace(/^#/, ""));
    };
  });

  const messageSearch = document.getElementById("message-search");
  const messageCampaignFilter = document.getElementById("message-campaign-filter");
  const messageStatusFilter = document.getElementById("message-status-filter");
  const applyMessageFilter = (mode = "") => {
    const query = (messageSearch?.value || "").trim().toLowerCase();
    const selectedCampaign = messageCampaignFilter?.value || "";
    const selectedStatus = messageStatusFilter?.value || "";
    document.querySelectorAll(".message-row[data-search]").forEach((row) => {
      const text = row.getAttribute("data-search") || "";
      const status = row.getAttribute("data-status") || "";
      const priority = row.getAttribute("data-priority") || "";
      const campaign = row.getAttribute("data-campaign") || "";
      const last = row.getAttribute("data-last") || "";
      const queryMatch = !query || text.includes(query);
      const campaignMatch = !selectedCampaign || campaign === selectedCampaign;
      const statusMatch = !selectedStatus || status.includes(selectedStatus);
      const modeMatch =
        !mode ||
        mode === "clear" ||
        (mode === "status" && /response|maybe/.test(status)) ||
        (mode === "priority" && priority === "high") ||
        (mode === "campaign" && campaign === (selectedCampaign || "cmp_01")) ||
        (mode === "date" && /m|h/.test(last));
      row.style.display = queryMatch && campaignMatch && statusMatch && modeMatch ? "" : "none";
    });
    const visible = Array.from(document.querySelectorAll(".message-row[data-search]")).filter((row) => row.style.display !== "none").length;
    const emptyRow = document.getElementById("message-empty-row");
    if (emptyRow) emptyRow.style.display = visible ? "none" : "";
    document.querySelectorAll("[data-message-filter]").forEach((btn) => {
      btn.classList.toggle("active", mode && mode !== "clear" && btn.getAttribute("data-message-filter") === mode);
    });
  };
  if (messageSearch) {
    messageSearch.oninput = () => applyMessageFilter(document.querySelector("[data-message-filter].active")?.getAttribute("data-message-filter") || "");
  }
  if (messageCampaignFilter) {
    messageCampaignFilter.onchange = () => applyMessageFilter(document.querySelector("[data-message-filter].active")?.getAttribute("data-message-filter") || "");
  }
  if (messageStatusFilter) {
    messageStatusFilter.onchange = () => applyMessageFilter(document.querySelector("[data-message-filter].active")?.getAttribute("data-message-filter") || "");
  }
  document.querySelectorAll("[data-message-filter]").forEach((btn) => {
    btn.onclick = () => {
      const mode = btn.getAttribute("data-message-filter") || "";
      if (mode === "clear") {
        if (messageSearch) messageSearch.value = "";
        if (messageCampaignFilter) messageCampaignFilter.value = "";
        if (messageStatusFilter) messageStatusFilter.value = "";
        applyMessageFilter("clear");
        return;
      }
      const nextMode = btn.classList.contains("active") ? "" : mode;
      applyMessageFilter(nextMode);
    };
  });

  const updateBulkActions = () => {
    const selected = Array.from(document.querySelectorAll(".message-select:checked"));
    const count = document.getElementById("message-selected-count");
    const bulkBar = document.getElementById("message-bulk-actions");
    if (count) count.textContent = String(selected.length);
    if (bulkBar) bulkBar.classList.toggle("active", selected.length > 0);
  };
  document.querySelectorAll(".message-select").forEach((input) => {
    input.onchange = updateBulkActions;
  });
  document.querySelectorAll("[data-bulk-message-action]").forEach((btn) => {
    btn.onclick = () => {
      const action = btn.getAttribute("data-bulk-message-action");
      const selectedIds = Array.from(document.querySelectorAll(".message-select:checked"))
        .map((input) => input.getAttribute("data-id"))
        .filter(Boolean);
      if (!selectedIds.length) return;
      if (btn.disabled) {
        flash("Connect the Apify data connector before approving or scheduling selected messages.");
        return;
      }
      selectedIds.forEach((id) => handleMessageAction(id, action));
    };
  });

  document.querySelectorAll("[data-mode]").forEach((btn) => {
    btn.onclick = () => {
      const mode = btn.getAttribute("data-mode");
      if (mode === "all") {
        setHash(`/workspace/${workspaceId}/prospects`);
      } else {
        setHash(`/workspace/${workspaceId}/prospects/${mode}`);
      }
    };
  });

  const prospectSearch = document.getElementById("prospect-search");
  if (prospectSearch) {
    prospectSearch.oninput = () => {
      const query = prospectSearch.value.trim().toLowerCase();
      document.querySelectorAll(".prospect-row[data-search]").forEach((row) => {
        const text = row.getAttribute("data-search") || "";
        row.style.display = !query || text.includes(query) ? "" : "none";
      });
      const visible = Array.from(document.querySelectorAll(".prospect-row[data-search]")).filter((row) => row.style.display !== "none").length;
      const emptyRow = document.getElementById("prospect-empty-row");
      if (emptyRow) emptyRow.style.display = visible ? "none" : "";
    };
  }

  document.querySelectorAll("[data-action]").forEach((btn) => {
    btn.onclick = () => {
      const action = btn.getAttribute("data-action");
      const id = btn.getAttribute("data-id");
      const decision = btn.getAttribute("data-decision");
      const provider = btn.getAttribute("data-provider");

      if (action === "approval") {
        if (decision) handleApprovalDecision(id, decision);
        return;
      }

      if (action === "toggle-campaign") {
        const target = btn.getAttribute("data-status");
        handleCampaignToggle(id, target);
        return;
      }

      if (action === "duplicate-campaign") {
        handleCampaignDuplicate(id);
        return;
      }

      if (action === "message-action") {
        handleMessageAction(id, decision);
        return;
      }

      if (action === "toggle-integration") {
        handleIntegrationToggle(provider);
        return;
      }

      if (action === "template-delete") {
        handleTemplateDelete(id);
        return;
      }

      if (action === "remove-seat") {
        handleSeatRemove(id);
        return;
      }

      if (action === "import-prospect") {
        handleProspectImport(btn.getAttribute("data-campaign-id") || "");
        return;
      }
    };
  });
}

function capitalize(input) {
  if (!input) return "";
  return input.charAt(0).toUpperCase() + input.slice(1);
}

window.addEventListener("hashchange", render);
window.addEventListener("load", render);
