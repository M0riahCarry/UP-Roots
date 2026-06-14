import { Link } from "react-router-dom";
import { useGarden } from "../context/GardenContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import PlantCard from "../components/PlantCard";

function Garden() {
  const { garden, removePlant } = useGarden();
  //reuse the same saved zone so the survival badges match the rest of the app
  const [zone] = useLocalStorage("uproots-zone", 4);

  return (
    <div className="home">
      <h1>My Garden</h1>

      {garden.length === 0 ? (
        <p className="status">
          You haven&apos;t saved any plants yet.{" "}
          <Link to="/">Search for some</Link> and tap &ldquo;Save to garden&rdquo;.
        </p>
      ) : (
        <div className="plant-grid">
          {garden.map((plant) => (
            <div key={plant.id} className="garden-item">
              <PlantCard plant={plant} userZone={zone} />
              <button
                type="button"
                className="remove-button"
                onClick={() => removePlant(plant.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Garden;
