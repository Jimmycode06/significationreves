import 'dotenv/config';

async function check() {
  const key = process.env.GEMINI_API_KEY;
  const model = "models/gemini-flash-latest";
  const url = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${key}`;
  
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Bonjour" }] }]
      })
    });
    const data = await res.json();
    console.log("GENERATION TEST STATUS:", res.status);
    console.log("DATA:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("FETCH ERROR:", e);
  }
}

check();
