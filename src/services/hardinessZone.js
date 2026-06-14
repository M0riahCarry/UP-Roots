// phzmapi.org is a free, key-less service that maps a US ZIP code to its USDA
// hardiness zone. We use it so people can find their zone without already
// knowing it. Returns the numeric zone (e.g. "5a" -> 5); throws a friendly
// error the UI can show, while the manual dropdown stays as a fallback.

/**
 * @param {string} zip - 5-digit US ZIP code
 * @returns {Promise<number>} the numeric USDA hardiness zone
 */
export async function getZoneForZip(zip) {
  let response;
  try {
    response = await fetch(`https://phzmapi.org/${zip}.json`);
  } catch {
    throw new Error("Couldn't reach the zone lookup. Pick your zone manually.");
  }
  if (!response.ok) {
    throw new Error("No zone found for that ZIP code.");
  }

  const data = await response.json();
  //the API returns a zone like "5a" or "6b" — take the leading number
  const numeric = parseInt(data.zone, 10);
  if (Number.isNaN(numeric)) {
    throw new Error("Unexpected response from the zone lookup.");
  }
  return numeric;
}
