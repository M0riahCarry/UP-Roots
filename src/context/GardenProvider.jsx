import { GardenContext } from "./GardenContext";
import { useLocalStorage } from "../hooks/useLocalStorage";

// Wraps the app and supplies the saved-garden state to every component below it,
// so the save button (on a plant page) and the list (on the garden page) share
// the same data without passing props down through every level.
export function GardenProvider({ children }) {
  //the saved plants, persisted in the browser so the garden survives refreshes
  const [garden, setGarden] = useLocalStorage("uproots-garden", []);

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
