const express = require("express"); 
const fs = require("fs");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Key aus Render Environment Variables
const API_KEY = process.env.API_KEY;

/* ===== MONEY ENDPOINTS ===== */
app.post("/money", (req, res) => {
  const { key, user, amount } = req.body;
  if (key !== API_KEY) return res.status(403).json({ error: "Unauthorized" });

  fs.writeFileSync("money.json", JSON.stringify({ user, amount }, null, 2));
  res.json({ success: true });
});

app.get("/money", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync("money.json"));
    res.json(data);
  } catch (err) {
    res.json({ user: null, amount: 0 });
  }
});

/* ===== GEMINI IMAGE ENDPOINT ===== */
app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt fehlt" });

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: { sampleCount: 1 },
        }),
      }
    );

    const data = await r.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Gemini Fehler:", err);
    res.status(500).json({ error: "Fehler bei Gemini API" });
  }
});

app.listen(PORT, () => console.log(`✅ Backend läuft auf Port ${PORT}`));
