import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return;
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    // @ts-ignore
    const result = await genAI.listModels();
    console.log("Liste des modèles :");
    // @ts-ignore
    result.models.forEach(m => console.log(m.name));
  } catch (e) {
    console.error(e);
  }
}
listModels();
