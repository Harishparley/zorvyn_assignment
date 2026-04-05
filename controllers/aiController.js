const { GoogleGenerativeAI } = require("@google/generative-ai");
const Record = require('../models/Record');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getAiAdvice = async (req, res) => {
  try {
    // 1. Get the same aggregation data we used for the dashboard
    const totals = await Record.aggregate([
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);

    const categoryTotals = await Record.aggregate([
      { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]);

    // 2. Format data for the AI
    const dataSummary = `Income: ${JSON.stringify(totals)}, Categories: ${JSON.stringify(categoryTotals)}`;

    // 3. Setup Gemini Model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a professional financial advisor. Based on this user data: ${dataSummary}, give 2-3 short, actionable bullet points of financial advice. Keep it under 60 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      ai_advice: text
    });
  } catch (error) {
    res.status(500).json({ message: "AI Advisor is currently sleeping: " + error.message });
  }
};

module.exports = { getAiAdvice };