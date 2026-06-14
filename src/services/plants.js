// Thin client for our own backend API. The backend holds the Perenual key and
// returns plants already normalized into our Plant shape, so this file just
// fetches and caches — no third-party API keys live in the browser anymore.

const searchCache = new Map();
const detailCache = new Map();

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    //our backend replies with { error: "..." }; fall back to a status code
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (status ${response.status})`);
  }
  return response.json();
}

export async function searchPlants(query) {
  if (searchCache.has(query)) return searchCache.get(query);
  const plants = await getJson(`/api/plants?q=${encodeURIComponent(query)}`);
  searchCache.set(query, plants);
  return plants;
}

export async function getPlantById(id) {
  if (detailCache.has(id)) return detailCache.get(id);
  const plant = await getJson(`/api/plants/${id}`);
  detailCache.set(id, plant);
  return plant;
}
