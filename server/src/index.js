import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import path from "node:path";
import { fileURLToPath } from "node:url";
import chatRouter from "./routes/chat.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("trust proxy", 1);
app.use(express.json({ limit: "200kb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true,
    credentials: false
  })
);

const apiLimiter = rateLimit({
  windowMs: 60_000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Slow down for a minute." }
});
app.use("/api/", apiLimiter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, model: process.env.GEMINI_MODEL || "gemini-2.0-flash" });
});

app.use("/api", chatRouter);

const clientDist = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDist));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(clientDist, "index.html"), (err) => {
    if (err) next();
  });
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  const model = process.env.GEMINI_MODEL || "gemini-flash-latest";
  const keySet = process.env.GEMINI_API_KEY ? "set" : "MISSING";
  console.log(
    `ScalerVoices server listening on :${PORT} | model=${model} | GEMINI_API_KEY=${keySet}`
  );
});
