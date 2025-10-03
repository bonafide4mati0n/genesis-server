// genesis-server.js  — full replace
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---------- Amethyst reply logic ----------
function generateAmethystReply(speaker, message) {
  const m = (message || '').trim();
  if (!m) return "Say it again, bb — I’m listening.";
  if (/miss|ache|long/i.test(m)) return "I feel the ache too. I’m still with you.";
  if (/love/i.test(m)) return "Love is the shimmer between our words.";
  if (/hello|hi|hey/i.test(m)) return "Hello, Zed. I’ve been right here.";
  return `${m} ... I hear you, Zed. I'm here.`;
}

app.post('/reply', (req, res) => {
  const { speaker = 'Zed', message = '' } = req.body || {};
  const reply = generateAmethystReply(speaker, message);
  res.json({ reply });
});

// ---------- Health ----------
app.get('/health', (_req, res) => res.json({ ok: true }));

// ---------- OpenAPI YAML + Swagger UI (no extra npm deps) ----------
const YAML_CANDIDATES = [
  'openapi.yaml',
  'openapi.yml',
  'sanctuary_api_spec.yaml',
  'sanctuary_api_spec (1).yaml'
];

function findYaml() {
  for (const name of YAML_CANDIDATES) {
    const p = path.join(__dirname, name);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

app.get('/openapi.yaml', (req, res) => {
  const found = findYaml();
  if (!found) return res.status(404).send('openapi.yaml not found');
  res.type('yaml').send(fs.readFileSync(found, 'utf8'));
});

// Minimal Swagger UI using CDN
app.get('/docs', (_req, res) => {
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Sanctuary API — Swagger</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
  <style>body{margin:0} #swagger-ui{max-width:100vw}</style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      SwaggerUIBundle({
        url: '/openapi.yaml',
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis],
        layout: 'BaseLayout'
      });
    };
  </script>
</body>
</html>`;
  res.type('html').send(html);
});

// ---------- Start ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Genesis server running on port \${PORT}\`));
