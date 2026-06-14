import "dotenv/config";
import express from "express";
import cors from "cors";
import { adaptPerenualSpecies } from "./adapters/perenual.js";

// The Perenual key now lives here on the server, read from server/.env, so it
// never ships to the browser. The frontend only ever talks to this API.
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.PERENUAL_API_KEY;
const BASE_URL = "https://perenual.com/api/v2";

const app = express();
app.use(cors());

// liveness check — handy for confirming the server is running
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// GET /api/plants?q=rose  ->  normalized Plant[]
app.get("/api/plants", async (req, res) => {
  const q = (req.query.q ?? "").toString().trim();
  if (!q) return res.status(400).json({ error: "Add a ?q= search term." });
  if (!API_KEY) {
    return res.status(500).json({ error: "Server is missing PERENUAL_API_KEY." });
  }

  try {
    const url = `${BASE_URL}/species-list?key=${API_KEY}&q=${encodeURIComponent(q)}`;
    const upstream = await fetch(url);
    if (!upstream.ok) {
      return res
        .status(upstream.status)
        .json({ error: `Search failed (status ${upstream.status})` });
    }
    const data = await upstream.json();
    //normalize into our Plant shape here, so the frontend gets clean data
    const plants = (data.data ?? []).map(adaptPerenualSpecies);
    res.json(plants);
  } catch {
    res.status(502).json({ error: "Could not reach the plant data source." });
  }
});

// GET /api/plants/:id  ->  a single normalized Plant
app.get("/api/plants/:id", async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: "Server is missing PERENUAL_API_KEY." });
  }

  try {
    const url = `${BASE_URL}/species/details/${encodeURIComponent(
      req.params.id,
    )}?key=${API_KEY}`;
    const upstream = await fetch(url);
    if (!upstream.ok) {
      return res
        .status(upstream.status)
        .json({ error: `Could not load plant (status ${upstream.status})` });
    }
    const data = await upstream.json();
    res.json(adaptPerenualSpecies(data));
  } catch {
    res.status(502).json({ error: "Could not reach the plant data source." });
  }
});

app.listen(PORT, () => {
  console.log(`UP Roots API running on http://localhost:${PORT}`);
});
