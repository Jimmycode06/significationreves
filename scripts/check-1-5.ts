import 'dotenv/config';

async function check() {
  const key = process.env.GEMINI_API_KEY;
  const model = "models/gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/${model}?key=${key}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("MODEL 1.5 FLASH STATUS:", res.status);
    console.log("DATA:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("FETCH ERROR:", e);
  }
}

check();
