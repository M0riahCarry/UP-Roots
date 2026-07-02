import { getPlantingAdvice } from "../utils/season";

// Compact seasonal status for the home page: what the growing season looks
// like in the user's zone and whether now is planting time. Gives the app a
// "today" dimension — a reason to come back as the seasons change.
function SeasonBanner({ zone }) {
  const advice = getPlantingAdvice(zone);
  if (!advice) return null;

  return (
    <p className="season-banner" role="status">
      {advice.seasonLabel && (
        <span className="season-range">
          Zone {zone} growing season: {advice.seasonLabel}
        </span>
      )}
      <span className="season-headline">{advice.headline}</span>
    </p>
  );
}

export default SeasonBanner;
