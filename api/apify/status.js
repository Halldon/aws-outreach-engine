const { APIFY_ALLOWED_ACTORS, writeJson } = require("./_shared");

function handler(req, res) {
  if ((req.method || "GET").toUpperCase() !== "GET") {
    writeJson(res, 405, { error: "Method Not Allowed" });
    return;
  }

  writeJson(res, 200, {
    configured: Boolean(process.env.APIFY_TOKEN),
    actors: Array.from(APIFY_ALLOWED_ACTORS),
    docs: "https://docs.apify.com/llms.txt",
    runEndpoint: "/api/apify/run",
  });
}

module.exports = handler;
