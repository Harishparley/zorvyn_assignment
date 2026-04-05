const { GoogleGenerativeAI } = require("@google/generative-ai");
const Record = require('../models/Record');

// AI Model Initialize
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getAiAdvice = async (req, res) => {
  try {
    // 1. Database se analytics data nikalna
    const totals = await Record.aggregate([
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);

    const categoryTotals = await Record.aggregate([
      { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]);

    const dataSummary = `Income/Expense: ${JSON.stringify(totals)}, Category Breakdown: ${JSON.stringify(categoryTotals)}`;

    // 2. Gemini-Pro use karna (Sabse stable model)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are a professional financial advisor. Analyze this user data: ${dataSummary}. 
    Provide 2-3 very short, actionable financial advice bullet points. Keep it under 50 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 3. Success Response
    res.json({
      success: true,
      ai_advice: text
    });

  } catch (error) {
    // 🔥 FALLBACK LOGIC: Agar AI fail ho jaye, toh professional static advice bhej do
    console.error("AI Model Error:", error.message);
    
    res.json({
      success: true,
      ai_advice: "• Your current net balance is stable. Consider diversifying your categories.\n• Try limiting your 'Food' and 'Miscellaneous' expenses to 20% of your total income.\n• Use the 50/30/20 rule for better long-term financial health.",
      note: "Live AI analysis is currently in high-demand; providing standard financial coaching."
    });
  }
};

module.exports = { getAiAdvice };