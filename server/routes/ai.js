// routes/ai.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// ✅ Use Gemini 2.5 Flash — confirmed available for your API key
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';

// Helper function: Build marketing prompt
function buildPrompt(data) {
  const { productName, category, targetMarket, objective, keywords } = data;

  return `
You are a professional marketing strategist AI.
Generate:
1. 2–3 audience personas (each with: name, ageRange, occupation, interests, painPoints, messagingHooks)
2. A short audience summary
3. A tone or platform recommendation.

Return a valid JSON object like this:
{
  "personas": [],
  "summary": "",
  "toneRecommendation": ""
}

Input details:
- Product: ${productName}
- Category: ${category}
- Target Market: ${targetMarket}
- Objective: ${objective}
- Keywords: ${keywords ? keywords.join(", ") : "None"}
`;
}

// POST /api/ai/generate
router.post('/generate', async (req, res) => {
  try {
    const prompt = buildPrompt(req.body);
    console.log("⚙️ Sending request to Gemini 2.5 Flash...");

    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
      }
    );

    const output =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No output from Gemini";

    let parsed;
    try {
    const cleanOutput = output
        .replace(/```json/i, "")
        .replace(/```/g, "")
        .trim();
    parsed = JSON.parse(cleanOutput);
    } catch (err) {
    parsed = { rawText: output };
    }


    res.json({ status: "ok", data: parsed });
  } catch (err) {
    console.error("❌ Gemini API error:", err.response?.data || err.message);
    res.status(500).json({
      status: "error",
      message: err.response?.data?.error?.message || err.message,
    });
  }
});

module.exports = router;
