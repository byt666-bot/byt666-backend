const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Key aus Umgebungsvariablen (Render → Environment Variables)
const API_KEY = process.env.API_KEY;

// Money speichern
app.post("/money", (req, res) => {
  const { key, user, amount } = req.body;
  if (key !== API_KEY) return res.status(403).json({ error: "Unauthorized" });

  fs.writeFileSync("money.json", JSON.stringify({ user, amount }, null, 2));
  res.json({ success: true });
});

// Money abholen
app.get("/money", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync("money.json"));
    res.json(data);
  } catch (err) {
    res.json({ user: null, amount: 0 });
  }
});

app.listen(PORT, () => console.log(`✅ Backend läuft auf Port ${PORT}`));
