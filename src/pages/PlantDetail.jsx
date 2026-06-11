import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPlantById } from "../services/perenual";

function PlantDetail() {
  //pulls the :id segment out of the url, e.g. /plant/425 -> "425"
  const { id } = useParams();

  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPlant() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPlantById(id);
        if (!cancelled) setPlant(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPlant();

    //cleanup: if the user leaves mid-fetch, the stale response won't update state
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className="status">Loading plant...</p>;
  }

  if (error) {
    return (
      <div className="plant-detail">
        <p className="status error">{error}</p>
        <Link to="/">&larr; Back to search</Link>
      </div>
    );
  }

  return (
    <div className="plant-detail">
      <Link to="/">&larr; Back to search</Link>

      <h1>{plant.common_name}</h1>
      <p className="scientific-name">
        <em>{plant.scientific_name?.join(", ")}</em>
      </p>

      {plant.default_image?.regular_url && (
        <img
          className="detail-image"
          src={plant.default_image.regular_url}
          alt={plant.common_name}
        />
      )}

      {plant.description && <p className="description">{plant.description}</p>}

      <dl className="care-facts">
        <dt>Watering</dt>
        <dd>{plant.watering || "Unknown"}</dd>

        <dt>Sunlight</dt>
        <dd>{plant.sunlight?.join(", ") || "Unknown"}</dd>

        <dt>Cycle</dt>
        <dd>{plant.cycle || "Unknown"}</dd>

        <dt>Care level</dt>
        <dd>{plant.care_level || "Unknown"}</dd>

        <dt>Indoor friendly</dt>
        <dd>{plant.indoor ? "Yes" : "No"}</dd>

        {plant.hardiness?.min && (
          <>
            <dt>Hardiness zones</dt>
            <dd>
              {plant.hardiness.min}
              {plant.hardiness.max !== plant.hardiness.min &&
                ` - ${plant.hardiness.max}`}
            </dd>
          </>
        )}
      </dl>
    </div>
  );
}

export default PlantDetail;
