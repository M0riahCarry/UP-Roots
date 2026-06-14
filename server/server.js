import "dotenv/config";
import express from "express";
import cors from "cors";
import { adaptPerenualSpecies } from "./adapters/perenual.js";
import { getWikipediaInfo } from "./adapters/wikipedia.js";
import { createCache } from "./cache.js";

// The Perenual key now lives here on the server, read from server/.env, so it
// never ships to the browser. The frontend only ever talks to this API.
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.PERENUAL_API_KEY;
const BASE_URL = "https://perenual.com/api/v2";

// Cache the Perenual responses (plant data barely changes) so repeat requests
// don't spend the small daily quota. Wikipedia enrichment still runs per request
// off its own cache, so a blank image can fill in on a later try.
const ONE_DAY = 24 * 60 * 60 * 1000;
const searchCache = createCache(ONE_DAY);
const detailCache = createCache(ONE_DAY);

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
    // only call Perenual when we haven't seen this search recently
    let plants = searchCache.get(q);
    if (!plants) {
      const url = `${BASE_URL}/species-list?key=${API_KEY}&q=${encodeURIComponent(q)}`;
      const upstream = await fetch(url);
      if (!upstream.ok) {
        return res
          .status(upstream.status)
          .json({ error: `Search failed (status ${upstream.status})` });
      }
      const data = await upstream.json();
      plants = (data.data ?? []).map(adaptPerenualSpecies);
      searchCache.set(q, plants);
    }

    //fill missing images from Wikipedia, a few at a time
    const enriched = await mapWithLimit(plants, 6, fillImage);
    res.json(enriched);
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
    const id = req.params.id;
    let plant = detailCache.get(id);
    if (!plant) {
      const url = `${BASE_URL}/species/details/${encodeURIComponent(id)}?key=${API_KEY}`;
      const upstream = await fetch(url);
      if (!upstream.ok) {
        return res
          .status(upstream.status)
          .json({ error: `Could not load plant (status ${upstream.status})` });
      }
      const data = await upstream.json();
      plant = adaptPerenualSpecies(data);
      detailCache.set(id, plant);
    }

    const enriched = await fillGaps(plant);
    res.json(enriched);
  } catch {
    res.status(502).json({ error: "Could not reach the plant data source." });
  }
});

app.listen(PORT, () => {
  console.log(`UP Roots API running on http://localhost:${PORT}`);
});
