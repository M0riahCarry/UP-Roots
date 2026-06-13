import { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlantById } from "../services/perenual";
import { useLocalStorage } from "../hooks/useLocalStorage";
import SurvivalBadge from "../components/SurvivalBadge";
import SaveButton from "../components/SaveButton";

function PlantDetail() {
  //pulls the :id segment out of the url, e.g. /plant/425 -> "425"
  const { id } = useParams();
  const navigate = useNavigate();

  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //read (don't change) the zone the user picked on the Home page
  const [zone] = useLocalStorage("uproots-zone", 4);

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

  //go back to wherever the user came from (their results) rather than a fresh search
  function goBack() {
    navigate(-1);
  }

  if (loading) {
    return <p className="status">Loading plant...</p>;
  }

  if (error) {
    return (
      <div className="plant-detail">
        <button className="back-link" onClick={goBack}>
          &larr; Back to results
        </button>
        <p className="status error">{error}</p>
      </div>
    );
  }

  // Build the care facts, then keep only the ones the API actually filled in.
  const facts = [
    { label: "Watering", value: plant.watering },
    {
      label: "Sunlight",
      value: plant.sunlight?.length ? plant.sunlight.join(", ") : null,
    },
    { label: "Cycle", value: plant.cycle },
    { label: "Care level", value: plant.care_level },
  ];
  if (plant.hardiness?.min) {
    const { min, max } = plant.hardiness;
    facts.push({
      label: "Hardiness zones",
      value: max && max !== min ? `${min} - ${max}` : `${min}`,
    });
  }
  const knownFacts = facts.filter((f) => f.value);

  return (
    <div className="plant-detail">
      <button className="back-link" onClick={goBack}>
        &larr; Back to results
      </button>

      <h1>{plant.common_name}</h1>
      <SurvivalBadge userZone={zone} hardiness={plant.hardiness} />
      {plant.scientific_name?.length > 0 && (
        <p className="scientific-name">
          <em>{plant.scientific_name.join(", ")}</em>
        </p>
      )}

      <SaveButton plant={plant} />

      {plant.default_image?.regular_url && (
        <img
          className="detail-image"
          src={plant.default_image.regular_url}
          alt={plant.common_name}
        />
      )}

      {plant.description && <p className="description">{plant.description}</p>}

      {knownFacts.length > 0 ? (
        <dl className="care-facts">
          {knownFacts.map((f) => (
            <Fragment key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </Fragment>
          ))}
        </dl>
      ) : (
        <p className="no-data">
          Detailed care info isn&apos;t available for this plant on Perenual&apos;s
          free data plan.
        </p>
      )}
    </div>
  );
}

export default PlantDetail;
