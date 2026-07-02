import { GardenContext } from "./GardenContext";
import { useLocalStorage } from "../hooks/useLocalStorage";

// Plants saved before the internal Plant-shape refactor used the raw API field
// names (common_name, default_image...). localStorage outlives code changes, so
// upgrade those old entries at load time instead of rendering them broken.
function normalizeEntry(p) {
  if (!p || typeof p !== "object" || p.id == null) return null;
  //already the current shape
  if (p.commonName) return p;
  //old shape -> current shape
  if (p.common_name) {
    return {
      id: p.id,
      commonName: p.common_name,
      scientificName: Array.isArray(p.scientific_name)
        ? p.scientific_name.join(", ")
        : "",
      image: p.default_image
        ? {
            thumb: p.default_image.medium_url ?? p.default_image.thumbnail,
            full: p.default_image.regular_url ?? p.default_image.medium_url,
          }
        : null,
      watering: p.watering ?? null,
      sunlight: p.sunlight?.length ? p.sunlight : null,
      cycle: p.cycle ?? null,
      careLevel: null,
      description: null,
      hardiness: p.hardiness?.min
        ? { min: Number(p.hardiness.min), max: Number(p.hardiness.max) }
        : null,
      source: "perenual",
    };
  }
  //unrecognizable entry — drop it rather than crash or render blank
  return null;
}

function migrateGarden(stored) {
  if (!Array.isArray(stored)) return [];
  return stored.map(normalizeEntry).filter(Boolean);
}

// Wraps the app and supplies the saved-garden state to every component below it,
// so the save button (on a plant page) and the list (on the garden page) share
// the same data without passing props down through every level.
export function GardenProvider({ children }) {
  //the saved plants, persisted in the browser so the garden survives refreshes
  const [garden, setGarden] = useLocalStorage("uproots-garden", [], migrateGarden);

  function addPlant(plant) {
    //functional update + a dedupe check so saving twice can't create duplicates
    setGarden((current) =>
      current.some((p) => p.id === plant.id) ? current : [...current, plant],
    );
  }

  function removePlant(id) {
    setGarden((current) => current.filter((p) => p.id !== id));
  }

  function isSaved(id) {
    return garden.some((p) => p.id === id);
  }

  return (
    <GardenContext.Provider value={{ garden, addPlant, removePlant, isSaved }}>
      {children}
    </GardenContext.Provider>
  );
}
