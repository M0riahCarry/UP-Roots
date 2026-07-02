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
      {plant.image?.thumb && (
        //lazy: off-screen card images load only as the user scrolls to them
        <img src={plant.image.thumb} alt={plant.commonName} loading="lazy" />
      )}
      <h2>{plant.commonName}</h2>
      {plant.scientificName && (
        <p className="card-sci">
          <em>{plant.scientificName}</em>
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
