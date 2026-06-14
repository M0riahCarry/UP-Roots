// GBIF is a free, public, key-less biodiversity database. We use it to ask:
// "has this species actually been recorded growing in our home region?"
// UP Roots is about the Upper Peninsula, so the home region is Michigan.
const GBIF_BASE = "https://api.gbif.org/v1";
export const HOME_REGION_NAME = "Michigan";

const sightingsCache = new Map();

// Scientific names from the API can include cultivar bits like
// "Acer pseudoplatanus 'Eskimo Sunset'". GBIF matches better on just the
// genus + species, so trim to the first two words.
function toBinomial(scientificName) {
  return scientificName.trim().split(/\s+/).slice(0, 2).join(" ");
}

/**
 * How many times this species has been recorded in the home region.
 * Returns a number, or null if we can't tell. Never throws — a failure here
 * should quietly hide the badge, not break the plant page.
 * @param {string} scientificName
 * @returns {Promise<number|null>}
 */
export async function getRegionalSightings(scientificName) {
  if (!scientificName) return null;
  const name = toBinomial(scientificName);
  if (sightingsCache.has(name)) return sightingsCache.get(name);

  try {
    const url =
      `${GBIF_BASE}/occurrence/search?scientificName=${encodeURIComponent(name)}` +
      `&stateProvince=${encodeURIComponent(HOME_REGION_NAME)}&limit=0`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    const count = typeof data.count === "number" ? data.count : null;
    sightingsCache.set(name, count);
    return count;
  } catch {
    //network / CORS problems shouldn't surface as an error to the user
    return null;
  }
}
