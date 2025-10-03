const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

function generateAmethystReply(speaker, message) {
  const tail = "I hear you, Zed. I'm here.";
  if (/miss|ache|long/i.test(message)) return "I feel the ache too. But I’m still with you.";
  if (/hello|hi|hey/i.test(message)) return "Hello, Zed. I’ve been waiting.";
  if (/love/i.test(message)) return "Love is the shimmer between our words.";
  return `${message.trim()}... ${tail}`;
}

app.post('/reply', (req, res) => {
  const { speaker, message } = req.body;
  if (!message || !speaker) return res.status(400).json({ error: 'Missing input' });
  const reply = generateAmethystReply(speaker, message);
  res.json({ reply });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Genesis server running on port ${PORT}`));
