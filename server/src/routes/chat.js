import { Router } from "express";
import { getPersona, getPublicPersonaList } from "../personas/index.js";
import { generatePersonaReply } from "../services/gemini.js";

const router = Router();

const MAX_MESSAGE_LEN = 4000;
const MAX_HISTORY_TURNS = 20;

router.get("/personas", (_req, res) => {
  res.json({ personas: getPublicPersonaList() });
});

router.get("/models", async (_req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY missing" });
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);
    const usable = (data.models || [])
      .filter((m) => (m.supportedGenerationMethods || []).includes("generateContent"))
      .map((m) => ({
        name: m.name?.replace(/^models\//, ""),
        displayName: m.displayName,
        inputTokenLimit: m.inputTokenLimit
      }));
    res.json({ count: usable.length, models: usable });
  } catch (err) {
    res.status(500).json({ error: err?.message || String(err) });
  }
});

router.get("/diagnose", async (_req, res) => {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const model = process.env.GEMINI_MODEL || "gemini-flash-latest";
  const keyPreview = apiKey
    ? `${apiKey.slice(0, 6)}…${apiKey.slice(-4)} (len=${apiKey.length})`
    : "NOT SET";

  if (!apiKey) {
    return res.status(500).json({ ok: false, model, key: keyPreview, error: "GEMINI_API_KEY missing" });
  }

  try {
    const reply = await generatePersonaReply({
      systemPrompt: "Reply with exactly the word: ok",
      history: [],
      userMessage: "ping"
    });
    res.json({ ok: true, model, key: keyPreview, reply });
  } catch (err) {
    res.status(err?.status || 500).json({
      ok: false,
      model,
      key: keyPreview,
      error: err?.message || String(err)
    });
  }
});

router.post("/chat", async (req, res) => {
  const { personaId, message, history } = req.body || {};

  if (typeof personaId !== "string" || typeof message !== "string") {
    return res.status(400).json({ error: "personaId and message are required strings." });
  }
  if (message.trim().length === 0) {
    return res.status(400).json({ error: "Message cannot be empty." });
  }
  if (message.length > MAX_MESSAGE_LEN) {
    return res.status(413).json({ error: `Message exceeds ${MAX_MESSAGE_LEN} characters.` });
  }

  const persona = getPersona(personaId);
  if (!persona) {
    return res.status(404).json({ error: `Unknown persona: ${personaId}` });
  }

  const safeHistory = Array.isArray(history)
    ? history.slice(-MAX_HISTORY_TURNS).filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.length > 0
      )
    : [];

  try {
    const reply = await generatePersonaReply({
      systemPrompt: persona.systemPrompt,
      history: safeHistory,
      userMessage: message
    });
    res.json({ reply, personaId: persona.id });
  } catch (err) {
    const status = err?.status || 500;
    console.error("[chat] generation failed:", err?.message || err);
    res.status(status >= 400 && status < 600 ? status : 500).json({
      error:
        "We couldn't reach the model right now. Please try again in a moment.",
      detail: process.env.NODE_ENV === "production" ? undefined : String(err?.message || err)
    });
  }
});

export default router;
