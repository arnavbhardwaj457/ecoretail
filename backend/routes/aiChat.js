const express = require('express');
const router = express.Router();

// Simple mock AI logic
function getAIReply(message) {
  const lower = message.toLowerCase();
  if (lower.includes('freshness')) return 'Our AI-powered system predicts produce freshness using harvest date, temperature, and more!';
  if (lower.includes('waste')) return 'Reducing waste is key! Try moving items to clearance or using them for prepared foods.';
  if (lower.includes('sustainability')) return 'Sustainability means optimizing supply chains, reducing waste, and sourcing responsibly.';
  if (lower.includes('hello') || lower.includes('hi')) return 'Hello! How can I help you with sustainability or inventory today?';
  return 'I am your AI assistant. Ask me about produce freshness, waste reduction, or sustainability!';
}

// POST /api/ai-chat
router.post('/', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });
  const reply = getAIReply(message);
  res.json({ reply });
});

module.exports = router; 