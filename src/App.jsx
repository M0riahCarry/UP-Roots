import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import PlantDetail from "./pages/PlantDetail";
import Garden from "./pages/Garden";
import { GardenProvider } from "./context/GardenProvider";
import "./styles/App.css";

function App() {
  return (
    //GardenProvider wraps everything so any page can read/update the saved garden
    <GardenProvider>
      {/* BrowserRouter gives the whole app access to routing */}
      <BrowserRouter>
        <nav className="main-nav">
          <NavLink to="/">Search</NavLink>
          <NavLink to="/garden">My Garden</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plant/:id" element={<PlantDetail />} />
          <Route path="/garden" element={<Garden />} />
        </Routes>
      </BrowserRouter>
    </GardenProvider>
  );
}

export default App;
