const API_KEY = import.meta.env.VITE_PERENUAL_API_KEY;
const BASE_URL = "https://perenual.com/api";

export async function searchPlants(query) {
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
  return response.json();
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
