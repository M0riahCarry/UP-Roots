import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import { adaptPerenualSpecies } from "./adapters/perenual.js";
import { getWikipediaInfo } from "./adapters/wikipedia.js";
import { createCache } from "./cache.js";
import { searchSeeds, getSeedById } from "./data/seedPlants.js";

// The Perenual key now lives here on the server, read from server/.env, so it
// never ships to the browser. The frontend only ever talks to this API.
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.PERENUAL_API_KEY;
const BASE_URL = "https://perenual.com/api/v2";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cache Perenual responses (plant data barely changes) so repeat requests don't
// spend the small daily quota. Persisted to disk, so data we've fetched once
// survives restarts — the app gradually builds its own local dataset.
const ONE_DAY = 24 * 60 * 60 * 1000;
const searchCache = createCache(ONE_DAY, path.join(__dirname, "data", "search-cache.json"));
const detailCache = createCache(7 * ONE_DAY, path.join(__dirname, "data", "detail-cache.json"));

const LIMIT_MESSAGE =
  "We've hit today's plant-data limit. Plants you've already viewed, the built-in library, and My Garden still work — full search resets tomorrow.";
const NO_KEY_MESSAGE =
  "Running on the built-in plant library only (no PERENUAL_API_KEY configured on the server).";

// Search cards only need an image, so we only look a plant up when it has none.
async function fillImage(plant) {
  if (plant.image) return plant;
  const wiki = await getWikipediaInfo(plant.scientificName);
  return { ...plant, image: wiki.image };
}

// The detail page also shows a description, so fill both gaps there.
async function fillGaps(plant) {
  if (plant.image && plant.description) return plant;
  const wiki = await getWikipediaInfo(plant.scientificName);
  return {
    ...plant,
    image: plant.image ?? wiki.image,
    description: plant.description ?? wiki.description,
  };
}

// Run an async fn over items with a cap on how many run at once, so a big search
// doesn't hit Wikipedia with one huge burst (which made some lookups time out).
async function mapWithLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }
  const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

// Ask Perenual for search results. Returns { plants } on success, or
// { failure: "no-key" | "limit" | "unreachable" } so callers can fall back.
async function perenualSearch(q) {
  if (!API_KEY) return { failure: "no-key" };
  try {
    const url = `${BASE_URL}/species-list?key=${API_KEY}&q=${encodeURIComponent(q)}`;
    const upstream = await fetch(url);
    if (upstream.status === 429) return { failure: "limit" };
    if (!upstream.ok) return { failure: "unreachable" };
    const data = await upstream.json();
    return { plants: (data.data ?? []).map(adaptPerenualSpecies) };
  } catch {
    return { failure: "unreachable" };
  }
}

function failureMessage(reason) {
  if (reason === "limit") return LIMIT_MESSAGE;
  if (reason === "no-key") return NO_KEY_MESSAGE;
  return "Could not reach the plant data source.";
}

const app = express();
app.use(cors());

// liveness check — handy for confirming the server is running
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// GET /api/plants?q=rose  ->  normalized Plant[]
app.get("/api/plants", async (req, res) => {
  const q = (req.query.q ?? "").toString().trim().slice(0, 80);
  if (!q) return res.status(400).json({ error: "Add a ?q= search term." });

  let plants = searchCache.get(q);
  if (!plants) {
    const result = await perenualSearch(q);
    if (result.plants) {
      plants = result.plants;
      searchCache.set(q, plants);
    } else {
      // Perenual is unavailable (rate limit, no key, outage) — fall back to the
      // built-in library so the app keeps working instead of erroring out.
      plants = searchSeeds(q);
      if (plants.length === 0) {
        return res.status(503).json({ error: failureMessage(result.failure) });
      }
    }
  }

  //fill missing images from Wikipedia, a few at a time
  const enriched = await mapWithLimit(plants, 6, fillImage);
  res.json(enriched);
});

// GET /api/plants/:id  ->  a single normalized Plant
app.get("/api/plants/:id", async (req, res) => {
  const id = req.params.id;

  //built-in library plants never need the external API at all
  if (id.startsWith("seed-")) {
    const seedPlant = getSeedById(id);
    if (!seedPlant) return res.status(404).json({ error: "Plant not found." });
    return res.json(await fillGaps(seedPlant));
  }

  let plant = detailCache.get(id);
  if (!plant) {
    if (!API_KEY) return res.status(503).json({ error: NO_KEY_MESSAGE });
    try {
      const url = `${BASE_URL}/species/details/${encodeURIComponent(id)}?key=${API_KEY}`;
      const upstream = await fetch(url);
      if (upstream.status === 429) {
        return res.status(503).json({ error: LIMIT_MESSAGE });
      }
      if (!upstream.ok) {
        return res
          .status(upstream.status)
          .json({ error: `Could not load plant (status ${upstream.status})` });
      }
      const data = await upstream.json();
      plant = adaptPerenualSpecies(data);
      detailCache.set(id, plant);
    } catch {
      return res.status(502).json({ error: "Could not reach the plant data source." });
    }
  }

  res.json(await fillGaps(plant));
});

// In production the same server also serves the built frontend (from /dist),
// so the whole app deploys as one unit and /api is same-origin (no CORS, no
// dev proxy needed). The catch-all returns index.html for any non-API path so
// React Router deep links like /plant/425 work on refresh.
const distDir = path.join(__dirname, "..", "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`UP Roots API running on http://localhost:${PORT}`);
});
