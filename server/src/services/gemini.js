import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-flash-latest";

let cachedClient = null;

function getClient() {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  cachedClient = new GoogleGenerativeAI(apiKey);
  return cachedClient;
}

function toGeminiHistory(history) {
  return history
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));
}

function parseRetryDelaySec(err) {
  const msg = String(err?.message || err || "");
  const m = msg.match(/retry in (\d+(?:\.\d+)?)s/i);
  if (m) return Math.min(parseFloat(m[1]), 30);
  return null;
}

function isRateLimit(err) {
  const status = err?.status || err?.response?.status;
  if (status === 429) return true;
  if (status && status !== 429) return false;
  const msg = String(err?.message || err || "");
  if (/\b404\b|not\s*found/i.test(msg)) return false;
  return /\b429\b|quota|rate.?limit|too many requests/i.test(msg);
}

function isModelNotFound(err) {
  const status = err?.status || err?.response?.status;
  const msg = String(err?.message || err || "");
  return status === 404 || /\b404\b|is not found|not supported for generateContent/i.test(msg);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function summariseError(err) {
  const status = err?.status || err?.response?.status;
  const msg = String(err?.message || err || "");
  let quotaId = null;
  let retrySec = null;
  const qm = msg.match(/"quotaId"\s*:\s*"([^"]+)"/);
  if (qm) quotaId = qm[1];
  const rm = msg.match(/retry in (\d+(?:\.\d+)?)s/i);
  if (rm) retrySec = parseFloat(rm[1]);
  return { status, quotaId, retrySec, raw: msg.slice(0, 800) };
}

export async function generatePersonaReply({ systemPrompt, history, userMessage }) {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.8,
      topP: 0.95,
      maxOutputTokens: 600
    }
  });

  const chat = model.startChat({ history: toGeminiHistory(history) });

  let attempt = 0;
  while (true) {
    try {
      const result = await chat.sendMessage(userMessage);
      const text = result.response.text();
      return text?.trim() || "I'm not sure how to answer that — could you rephrase?";
    } catch (err) {
      attempt += 1;
      const info = summariseError(err);
      console.error(
        `[gemini] model=${MODEL_NAME} attempt=${attempt} status=${info.status} quotaId=${info.quotaId} retrySec=${info.retrySec}`
      );
      console.error(`[gemini] raw: ${info.raw}`);

      if (isModelNotFound(err)) {
        const e = new Error(
          `Model "${MODEL_NAME}" was not found by the Gemini API. This usually means the model name is wrong or has been retired. Try setting GEMINI_MODEL in server/.env to one of: gemini-flash-latest, gemini-2.5-flash, gemini-2.5-pro, or gemini-2.0-flash-001.`
        );
        e.status = 404;
        throw e;
      }

      if (isRateLimit(err) && attempt === 1) {
        const wait = (info.retrySec ?? 4) * 1000;
        await sleep(wait);
        continue;
      }
      if (isRateLimit(err)) {
        const isPerDay = /PerDay/i.test(info.quotaId || "");
        const friendly = isPerDay
          ? `Daily free-tier quota exhausted for model ${MODEL_NAME} on this Google project (quotaId: ${info.quotaId}). Options: (1) wait until midnight Pacific time for the daily reset, (2) switch GEMINI_MODEL in server/.env to a different model with remaining quota, or (3) enable billing on the Google Cloud project tied to this API key to drop the cap.`
          : `Per-minute rate limit hit on ${MODEL_NAME} (quotaId: ${info.quotaId || "unknown"}). Wait ${info.retrySec ?? 30}s and retry. If this happens repeatedly, the project's free tier may be exhausted for the day.`;
        const e = new Error(friendly);
        e.status = 429;
        throw e;
      }
      throw err;
    }
  }
}
