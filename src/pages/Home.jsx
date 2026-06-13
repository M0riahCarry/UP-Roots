import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchPlants } from "../services/perenual";
import { useLocalStorage } from "../hooks/useLocalStorage";
import PlantCard from "../components/PlantCard";
import ZoneSelector from "../components/ZoneSelector";

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
        const data = await searchPlants(activeQuery);
        if (!cancelled) setResults(data.data ?? []);
      } catch (err) {
        if (!cancelled) setError(err.message);
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

  return (
    <div className="home">
      <h1>UP Roots</h1>

      <ZoneSelector zone={zone} onChange={setZone} />

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

      {error && <p className="status error">{error}</p>}

      {activeQuery && !loading && !error && results.length === 0 && (
        <p className="status">No plants found. Try another search.</p>
      )}

      <div className="plant-grid">
        {results.map((plant) => (
          <PlantCard key={plant.id} plant={plant} userZone={zone} />
        ))}
      </div>
    </div>
  );
}

export default Home;
