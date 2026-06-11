import { Link } from "react-router-dom";

function PlantCard({ plant }) {
  return (
    //a real link (instead of a clickable div) works with keyboards,
    //screen readers, and open-in-new-tab for free
    <Link to={`/plant/${plant.id}`} className="plant-card">
      {plant.default_image?.medium_url && (
        <img src={plant.default_image.medium_url} alt={plant.common_name} />
      )}
      <h2>{plant.common_name}</h2>
      <p>
        <em>{plant.scientific_name?.join(", ")}</em>
      </p>
      <p>Watering: {plant.watering || "Unknown"}</p>
      <p>Sunlight: {plant.sunlight?.join(", ") || "Unknown"}</p>
      <p>Cycle: {plant.cycle || "Unknown"}</p>
    </Link>
  );
}

export default PlantCard;
