import { useNavigate } from "react-router-dom";

function PlantCard({ plant }) {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/plant/${plant.id}`)}>
      <img src={plant.default_image?.medium_url} alt={plant.common_name} />
      <h2>{plant.common_name}</h2>
      <p>
        <em>{plant.scientific_name}</em>
      </p>
      <p>Watering: {plant.watering}</p>
      <p>Sunlight: {plant.sunlight?.join(", ")}</p>
      <p>Cycle: {plant.cycle}</p>
    </div>
  );
}

export default PlantCard;
