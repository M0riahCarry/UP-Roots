import { getPlantingAdvice } from "../utils/season";

// Answers "can I plant this right now?" on the detail page, based on the
// user's zone and today's date.
function PlantingWindow({ zone }) {
  const advice = getPlantingAdvice(zone);
  if (!advice) return null;

  return (
    <div className="planting-window">
      <h2>{advice.headline}</h2>
      <p>{advice.detail}</p>
    </div>
  );
}

export default PlantingWindow;
