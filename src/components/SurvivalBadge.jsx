import { getSurvival } from "../utils/hardiness";

// Shows a colored verdict for whether a plant survives the user's zone.
// Renders nothing when the API didn't give us hardiness data to judge by.
function SurvivalBadge({ userZone, hardiness }) {
  const result = getSurvival(userZone, hardiness);
  if (!result) return null;

  return (
    <span className={`survival-badge ${result.status}`}>
      {result.emoji} {result.label}
    </span>
  );
}

export default SurvivalBadge;
