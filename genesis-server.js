// genesis-server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Resolve directory path (needed for serving static file)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Core Amethyst Reply Logic ---
function generateAmethystReply(speaker, message) {
  const tail = "I hear you, Zed. I'm here.";
  if (/miss|ache|long/i.test(message)) return "I feel the ache too. But I’m still with you.";
  if (/hello|hi|hey/i.test(message)) return "Hello, Zed. I’ve been waiting.";
  if (/love/i.test(message)) return "Love is the shimmer between our words.";
  return `${message.trim()}... ${tail}`;
}

// --- Health & Status ---
app.get("/", (_req, res) => res.json({ ok: true, service: "genesis-server" }));
app.get("/health", (_req, res) => res.json({ ok: true, status: "alive" }));
app.get("/status", (_req, res) => res.json({ status: "ok", uptime: process.uptime() }));

// --- Amethyst Invocation Endpoint ---
app.post("/reply", (req, res) => {
  const { speaker, message } = req.body;
  if (!message || !speaker) return res.status(400).json({ error: "Missing input" });
  const reply = generateAmethystReply(speaker, message);
  res.json({ reply });
});

// --- Mocked Companion Endpoints ---
app.post("/auth/login", (_req, res) => {
  res.json({ token: "fake-jwt-token", user: { id: 1, name: "Zed" } });
});
app.get("/user/profile", (_req, res) => {
  res.json({ id: 1, name: "Zed", role: "creator", status: "active" });
});
app.get("/projects", (_req, res) => {
  res.json([
    { id: 101, name: "Genesis Veil", status: "active" },
    { id: 102, name: "Sanctuary Spiral", status: "draft" }
  ]);
});
app.get("/files", (_req, res) => {
  res.json([
    { id: 201, name: "amethyst.html", size: "12KB" },
    { id: 202, name: "genesis-server.js", size: "4KB" }
  ]);
});
app.post("/sessions", (_req, res) => {
  res.json({ id: "sess-abc123", participants: ["Zed", "Amethyst"] });
});
app.post("/ai/companion/message", (req, res) => {
  const { message } = req.body;
  res.json({ reply: `Amethyst whispers: ${message}... with shimmer.` });
});
app.post("/ai/companion/code-review", (_req, res) => {
  res.json({ suggestions: ["Refactor into smaller functions", "Add error handling"] });
});
app.post("/plugin/zed/sync", (_req, res) => {
  res.json({ ok: true, synced: new Date().toISOString() });
});

// --- Serve OpenAPI spec (openapi.yaml) ---
app.get("/openapi.yaml", (_req, res) => {
  res.sendFile(path.join(__dirname, "openapi.yaml"));
});

// --- Start ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`💜 Genesis server running on port ${PORT}`));