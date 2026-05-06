const APIFY_ALLOWED_ACTORS = new Set(["apify/website-content-crawler", "apify/google-search-scraper"]);

function writeJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function getBody(req) {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) return Promise.resolve(req.body);
  if (typeof req.body === "string") return Promise.resolve(JSON.parse(req.body || "{}"));
  if (Buffer.isBuffer(req.body)) return Promise.resolve(JSON.parse(req.body.toString("utf8") || "{}"));

  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Request body is too large."));
      }
    });
    req.on("error", reject);
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Request body must be valid JSON."));
      }
    });
  });
}

function normalizeActorInput(actorId, input = {}) {
  if (actorId !== "apify/website-content-crawler") return input;

  const rawStartUrl = input.startUrls?.[0]?.url || input.url || "https://apify.com/store";
  const startUrl = String(rawStartUrl).trim();
  let parsed;
  try {
    parsed = new URL(startUrl);
  } catch {
    throw new Error("Website crawler input must include a valid http(s) URL.");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Website crawler input must include a valid http(s) URL.");
  }

  const maxCrawlPages = Math.min(5, Math.max(1, Number(input.maxCrawlPages || 2)));
  return {
    ...input,
    startUrls: [{ url: parsed.toString() }],
    maxCrawlPages,
  };
}

async function runActorWithApify(actorId, input, token) {
  const normalizedInput = normalizeActorInput(actorId, input || {});
  const encodedActorId = actorId.replace("/", "~");
  const response = await fetch(
    `https://api.apify.com/v2/acts/${encodeURIComponent(encodedActorId)}/run-sync-get-dataset-items?timeout=60`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(normalizedInput),
    }
  );
  const text = await response.text();
  if (!response.ok) throw new Error(`Apify API returned ${response.status}: ${text.slice(0, 240)}`);

  try {
    const items = JSON.parse(text);
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

module.exports = {
  APIFY_ALLOWED_ACTORS,
  getBody,
  runActorWithApify,
  writeJson,
};
