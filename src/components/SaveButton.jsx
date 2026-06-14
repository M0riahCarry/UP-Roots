import { useGarden } from "../context/GardenContext";

function SaveButton({ plant }) {
  const { isSaved, addPlant, removePlant } = useGarden();
  const saved = isSaved(plant.id);

  function toggle() {
    if (saved) {
      removePlant(plant.id);
    } else {
      // plant is already our normalized Plant shape, so we can store it as-is;
      // the garden page renders it from localStorage without re-calling the API.
      addPlant(plant);
    }
  }

  return (
    <button
      type="button"
      className={`save-button ${saved ? "saved" : ""}`}
      onClick={toggle}
    >
      {saved ? "✓ In your garden" : "+ Save to garden"}
    </button>
  );
}

export default SaveButton;
