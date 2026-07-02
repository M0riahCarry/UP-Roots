import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PlantDetail from "./pages/PlantDetail";
import Garden from "./pages/Garden";
import NotFound from "./pages/NotFound";
import NavBar from "./components/NavBar";
import LeafBackground from "./components/LeafBackground";
import { GardenProvider } from "./context/GardenProvider";
import "./styles/App.css";

function App() {
  return (
    //GardenProvider wraps everything so any page can read/update the saved garden
    <GardenProvider>
      {/* BrowserRouter gives the whole app access to routing */}
      <BrowserRouter>
        {/* decorative leaves sit behind everything */}
        <LeafBackground />
        <div className="app-content">
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plant/:id" element={<PlantDetail />} />
            <Route path="/garden" element={<Garden />} />
            {/* catch-all: unknown URLs get a friendly page instead of a blank one */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </GardenProvider>
  );
}

export default App;
