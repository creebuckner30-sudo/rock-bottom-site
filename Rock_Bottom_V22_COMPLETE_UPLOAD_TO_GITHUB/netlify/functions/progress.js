const { getStore } = require("@netlify/blobs");

const DEFAULT_AMOUNT = 50;
const DEFAULT_GOAL = 4500;

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-pin",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };

  const store = getStore("rock-bottom-progress");

  if (event.httpMethod === "GET") {
    let data = await store.get("progress", { type: "json" });
    if (!data) {
      data = { amount: DEFAULT_AMOUNT, goal: DEFAULT_GOAL, updatedAt: new Date().toISOString() };
      await store.setJSON("progress", data);
    }
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  }

  if (event.httpMethod === "POST") {
    let body = {};
    try { body = JSON.parse(event.body || "{}"); }
    catch { return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON." }) }; }

    const expectedPin = process.env.ADMIN_PIN || "rockbottom";
    const suppliedPin = event.headers["x-admin-pin"] || body.pin || "";
    if (suppliedPin !== expectedPin) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: "Incorrect admin PIN." }) };
    }

    const amount = Number(body.amount);
    const goal = Number(body.goal || DEFAULT_GOAL);
    if (!Number.isFinite(amount) || amount < 0) return { statusCode: 400, headers, body: JSON.stringify({ error: "Amount must be a valid number." }) };
    if (!Number.isFinite(goal) || goal <= 0) return { statusCode: 400, headers, body: JSON.stringify({ error: "Goal must be greater than 0." }) };

    const data = { amount: Math.round(amount * 100) / 100, goal: Math.round(goal * 100) / 100, updatedAt: new Date().toISOString() };
    await store.setJSON("progress", data);
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed." }) };
};
