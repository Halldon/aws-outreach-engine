const { APIFY_ALLOWED_ACTORS, getBody, runActorWithApify, writeJson } = require("./_shared");

async function handler(req, res) {
  if ((req.method || "GET").toUpperCase() !== "POST") {
    writeJson(res, 405, { error: "Method Not Allowed" });
    return;
  }

  try {
    const payload = await getBody(req);
    const token = process.env.APIFY_TOKEN;
    const actorId = String(payload.actorId || "apify/website-content-crawler");

    if (!APIFY_ALLOWED_ACTORS.has(actorId)) throw new Error("Actor is not allowed for this demo.");
    if (!token) throw new Error("Missing APIFY_TOKEN. Add it to the deployment environment for live Actor runs.");

    const items = await runActorWithApify(actorId, payload.input || {}, token);
    writeJson(res, 200, {
      actorId,
      fetchedAt: new Date().toISOString(),
      itemCount: items.length,
      items,
    });
  } catch (error) {
    writeJson(res, 400, { error: error.message });
  }
}

module.exports = handler;
module.exports.config = {
  maxDuration: 60,
};
