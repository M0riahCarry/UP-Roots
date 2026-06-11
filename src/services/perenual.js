const API_KEY = import.meta.env.VITE_PERENUAL_API_KEY;
const BASE_URL = "https://perenual.com/api";

export async function searchPlants(query) {
  //encodeURIComponent keeps special characters (spaces, &, etc.) from breaking the url
  const response = await fetch(
    `${BASE_URL}/species-list?key=${API_KEY}&q=${encodeURIComponent(query)}&zone=4`,
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
