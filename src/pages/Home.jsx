import { useState } from "react";
import { searchPlants } from "../services/perenual";
import PlantCard from "../components/PlantCard";

function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);
    const data = await searchPlants(query);
    console.log(data.data[0]);
    setResults(data.data);
    setLoading(false);
  }

  return (
    <div>
      <h1>UP Roots</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search plants..."
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <p>Loading...</p>}

      <div>
        {results.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>
    </div>
  );
}

export default Home;
