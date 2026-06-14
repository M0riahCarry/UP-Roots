// Fills gaps in Perenual's data using Wikipedia's free REST summary API
// (no key needed). We use it for an image and a description when Perenual
// doesn't supply them.

const SUMMARY_URL = "https://en.wikipedia.org/api/rest_v1/page/summary";

// Wikipedia matches better on the binomial (genus + species) than on a full
// cultivar string like "Monarda didyma 'Pink Lace'". This also means many
// cultivars of one species share a single lookup (and one cache entry).
function toBinomial(scientificName) {
  return (scientificName || "").trim().split(/\s+/).slice(0, 2).join(" ");
}

// Cache the in-flight promise (not just the result), so several plants asking
// for the same species at once share one request instead of stampeding.
const cache = new Map();

async function fetchSummary(title) {
  try {
    const response = await fetch(`${SUMMARY_URL}/${encodeURIComponent(title)}`, {
      headers: { "User-Agent": "UP-Roots/1.0 (educational portfolio project)" },
      //don't let a slow Wikipedia hold up the whole response
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return { image: null, description: null };

    const data = await response.json();
    //disambiguation pages aren't a real description — skip them
    if (data.type === "disambiguation") return { image: null, description: null };

    const thumb = data.thumbnail?.source ?? null;
    const full = data.originalimage?.source ?? thumb;
    return {
      image: thumb ? { thumb, full } : null,
      description: data.extract ?? null,
    };
  } catch {
    //network/timeout/parse issues just mean "no extra info" — never throw
    return { image: null, description: null };
  }
}

/**
 * @param {string} scientificName
 * @returns {Promise<{image: {thumb: string, full: string}|null, description: string|null}>}
 */
export function getWikipediaInfo(scientificName) {
  const title = toBinomial(scientificName);
  if (!title) return Promise.resolve({ image: null, description: null });

  if (!cache.has(title)) {
    cache.set(title, fetchSummary(title));
  }
  return cache.get(title);
}
