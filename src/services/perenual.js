const API_KEY = import.meta.env.VITE_PERENUAL_API_KEY;
const BASE_URL = "https://perenual.com/api";

export async function searchPlants(query) {
  const response = await fetch(
    `${BASE_URL}/species-list?key=${API_KEY}&q=${query}&zone=4`,
  );
  const data = await response.json();
  return data;
}
