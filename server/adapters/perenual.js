// Translates one raw Perenual species object (from either the list or the
// details endpoint) into the internal Plant shape the frontend expects.
// Endpoints that omit a field (e.g. the list endpoint has no description)
// simply map to null.
//
// Note: this lives on the server now. When we add more sources (GBIF, etc.),
// each gets its own adapter here and the results are merged before being sent.

export function adaptPerenualSpecies(raw) {
  return {
    id: raw.id,
    commonName: raw.common_name ?? "Unknown plant",
    //Perenual gives scientific_name as an array; join it for display
    scientificName: raw.scientific_name?.join(", ") ?? "",
    image: raw.default_image
      ? {
          thumb: raw.default_image.medium_url ?? raw.default_image.thumbnail,
          full: raw.default_image.regular_url ?? raw.default_image.medium_url,
        }
      : null,
    watering: raw.watering ?? null,
    sunlight: raw.sunlight?.length ? raw.sunlight : null,
    cycle: raw.cycle ?? null,
    careLevel: raw.care_level ?? null,
    description: raw.description ?? null,
    hardiness: raw.hardiness?.min
      ? { min: Number(raw.hardiness.min), max: Number(raw.hardiness.max) }
      : null,
    source: "perenual",
  };
}
