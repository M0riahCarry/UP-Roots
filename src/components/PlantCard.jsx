import { Link } from "react-router-dom";
import SurvivalBadge from "./SurvivalBadge";

function PlantCard({ plant, userZone }) {
  // Only show care lines the API actually returned, so cards don't fill up
  // with "Unknown" when the free tier withholds a plant's details.
  const facts = [
    plant.watering && `Watering: ${plant.watering}`,
    plant.sunlight?.length && `Sunlight: ${plant.sunlight.join(", ")}`,
    plant.cycle && `Cycle: ${plant.cycle}`,
  ].filter(Boolean);

  return (
    //a real link (instead of a clickable div) works with keyboards,
    //screen readers, and open-in-new-tab for free
    <Link to={`/plant/${plant.id}`} className="plant-card">
      {plant.default_image?.medium_url && (
        <img src={plant.default_image.medium_url} alt={plant.common_name} />
      )}
      <h2>{plant.common_name}</h2>
      {plant.scientific_name?.length > 0 && (
        <p className="card-sci">
          <em>{plant.scientific_name.join(", ")}</em>
        </p>
      )}
      <SurvivalBadge userZone={userZone} hardiness={plant.hardiness} />
      {facts.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </Link>
  );
}

export default PlantCard;
