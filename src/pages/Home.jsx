import { useState } from "react";
import { searchPlants } from "../services/perenual";
import { useLocalStorage } from "../hooks/useLocalStorage";
import PlantCard from "../components/PlantCard";
import ZoneSelector from "../components/ZoneSelector";

function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  //tracks whether a search has run yet, so "no results" only shows after one
  const [hasSearched, setHasSearched] = useState(false);
  //the user's hardiness zone, remembered across refreshes. Defaults to 4 (the UP).
  const [zone, setZone] = useLocalStorage("uproots-zone", 4);

  async function handleSearch(e) {
    //stop the form from doing a full page reload on submit
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await searchPlants(query);
      setResults(data.data ?? []);
      setHasSearched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="home">
      <h1>UP Roots</h1>

      <ZoneSelector zone={zone} onChange={setZone} />

      <form className="search-form" onSubmit={handleSearch}>
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

      {hasSearched && !loading && !error && results.length === 0 && (
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
