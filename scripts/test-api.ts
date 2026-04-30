import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function list() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Aucune clé trouvée");
    return;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    // There isn't a direct listModels in the high level GoogleGenerativeAI class in the same way,
    // but we can try to access the generativeLanguage context.
    // However, a simpler way to test "any" model is to try gemini-pro.
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Coucou");
    console.log("Gemini-pro OK:", result.response.text());
  } catch (e) {
    console.log("Gemini-pro FAILED:", e);
  }
}

list();
