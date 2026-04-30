import 'dotenv/config';

async function check() {
  const key = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("RESPONSE STATUS:", res.status);
    if (data.models) {
      console.log("MODELS FOUND:", data.models.map((m: any) => m.name).join(', '));
    } else {
      console.log("NO MODELS OR ERROR:", JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.error("FETCH ERROR:", e);
  }
}

check();
