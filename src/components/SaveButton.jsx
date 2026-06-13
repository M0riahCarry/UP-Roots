import { useGarden } from "../context/GardenContext";

function SaveButton({ plant }) {
  const { isSaved, addPlant, removePlant } = useGarden();
  const saved = isSaved(plant.id);

  function toggle() {
    if (saved) {
      removePlant(plant.id);
    } else {
      // Save just the fields the cards need, so the garden page can render
      // from localStorage without re-calling the (rate-limited) API.
      addPlant({
        id: plant.id,
        common_name: plant.common_name,
        scientific_name: plant.scientific_name,
        default_image: plant.default_image,
        watering: plant.watering,
        sunlight: plant.sunlight,
        cycle: plant.cycle,
        hardiness: plant.hardiness,
      });
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
