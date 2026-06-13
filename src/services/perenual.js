const API_KEY = import.meta.env.VITE_PERENUAL_API_KEY;
// v2 is Perenual's current API. The old /api (v1) path is being retired and
// now returns 404, so both calls below go through /api/v2.
const BASE_URL = "https://perenual.com/api/v2";

// Remembers results for each query during the session, so coming back to a
// previous search is instant and doesn't burn another (rate-limited) API call.
const searchCache = new Map();

export async function searchPlants(query) {
  // A missing key is the other common cause of failures — catch it early with
  // a clear message instead of a confusing status code from the API.
  if (!API_KEY) {
    throw new Error(
      "Missing API key. Add VITE_PERENUAL_API_KEY to a .env file, then restart the dev server.",
    );
  }

  if (searchCache.has(query)) {
    return searchCache.get(query);
  }

  // Note: we deliberately don't filter by zone here. Zone is used client-side
  // to *evaluate* each result (the survival badge), so the user still sees
  // plants that won't survive — and learns why — instead of them being hidden.
  //encodeURIComponent keeps special characters (spaces, &, etc.) from breaking the url
  const response = await fetch(
    `${BASE_URL}/species-list?key=${API_KEY}&q=${encodeURIComponent(query)}`,
  );
  if (!response.ok) {
    //fetch only rejects on network failure, so bad status codes need a manual throw
    throw new Error(`Search failed (status ${response.status})`);
  }
  const data = await response.json();
  searchCache.set(query, data);
  return data;
}

export async function getPlantById(id) {
  const response = await fetch(
    `${BASE_URL}/species/details/${id}?key=${API_KEY}`,
  );
  if (!response.ok) {
    throw new Error(`Could not load plant (status ${response.status})`);
  }
  return response.json();
}
