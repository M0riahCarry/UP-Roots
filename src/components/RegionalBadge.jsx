import { useEffect, useState } from "react";
import { getRegionalSightings, HOME_REGION_NAME } from "../services/gbif";

// Self-contained: it fetches its own supplementary data from GBIF and renders
// nothing unless there's something positive to show. That isolation means a
// GBIF outage can never break the surrounding plant page.
function RegionalBadge({ scientificName }) {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getRegionalSightings(scientificName).then((c) => {
      if (!cancelled) setCount(c);
    });
    return () => {
      cancelled = true;
    };
  }, [scientificName]);

  //null (couldn't tell) or 0 (never recorded here) → show nothing
  if (!count) return null;

  return (
    <span className="regional-badge">
      🌎 Recorded growing in {HOME_REGION_NAME} ({count.toLocaleString()}{" "}
      sightings)
    </span>
  );
}

export default RegionalBadge;
