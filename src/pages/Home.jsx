import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchPlants } from "../services/plants";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { getSurvival } from "../utils/hardiness";
import PlantCard from "../components/PlantCard";
import SkeletonCard from "../components/SkeletonCard";
import ZoneSelector from "../components/ZoneSelector";
import SeasonBanner from "../components/SeasonBanner";

//first-visit shortcuts; all of these exist in the built-in library, so they
//work even when the external API is rate-limited
const SUGGESTIONS = ["milkweed", "lilac", "sugar maple", "coneflower", "blueberry"];

//order results by how well they fit the user's zone: thrives, then risky,
//then unknown, with won't-survive last
function survivalRank(plant, zone) {
  const result = getSurvival(zone, plant.hardiness);
  if (!result) return 2;
  return { thrives: 0, risky: 1, no: 3 }[result.status];
}

function Home() {
  // The active search lives in the URL (?q=...). That way the results survive
  // navigating to a plant and back, and the page is shareable / refresh-safe.
  const [searchParams, setSearchParams] = useSearchParams();
  const activeQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(activeQuery); // what's typed in the box
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  //the user's hardiness zone, remembered across refreshes. Defaults to 4 (the UP).
  const [zone, setZone] = useLocalStorage("uproots-zone", 4);
  //filter preference, remembered like the zone is
  const [hideNonHardy, setHideNonHardy] = useLocalStorage("uproots-hide-nonhardy", false);

  // Re-run the search whenever the URL's query changes. This covers both typing
  // a new search and coming *back* to these results from a plant's detail page.
  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!activeQuery) {
        setResults([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const plants = await searchPlants(activeQuery);
        if (!cancelled) setResults(plants);
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setResults([]); //don't leave a previous search's results under the error
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [activeQuery]);

  function handleSubmit(e) {
    //stop the form from doing a full page reload on submit
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    //updating the URL triggers the effect above, which does the actual fetch
    setSearchParams({ q: trimmed });
  }

  function searchFor(term) {
    setQuery(term);
    setSearchParams({ q: term });
  }

  const visible = (
    hideNonHardy
      ? results.filter((p) => survivalRank(p, zone) < 3)
      : results
  )
    .slice()
    .sort((a, b) => survivalRank(a, zone) - survivalRank(b, zone));

  const hiddenCount = results.length - visible.length;

  return (
    <div className="home">
      <h1>UP Roots</h1>

      <ZoneSelector zone={zone} onChange={setZone} />
      <SeasonBanner zone={zone} />

      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search plants..."
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {!activeQuery && !loading && (
        <div className="suggestions">
          <span>Try:</span>
          {SUGGESTIONS.map((term) => (
            <button key={term} type="button" onClick={() => searchFor(term)}>
              {term}
            </button>
          ))}
        </div>
      )}

      {results.length > 0 && (
        <label className="filter-row">
          <input
            type="checkbox"
            checked={hideNonHardy}
            onChange={(e) => setHideNonHardy(e.target.checked)}
          />
          Hide plants that won&apos;t survive zone {zone}
          {hideNonHardy && hiddenCount > 0 && (
            <span className="filter-note">({hiddenCount} hidden)</span>
          )}
        </label>
      )}

      {error && (
        <p className="status error" role="alert">
          {error}
        </p>
      )}

      {activeQuery && !loading && !error && results.length === 0 && (
        <p className="status" role="status">
          No plants found. Try another search.
        </p>
      )}

      <div className="plant-grid">
        {loading
          ? Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)
          : visible.map((plant) => (
              <PlantCard key={plant.id} plant={plant} userZone={zone} />
            ))}
      </div>
    </div>
  );
}

export default Home;
