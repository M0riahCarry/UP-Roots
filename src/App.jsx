import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PlantDetail from "./pages/PlantDetail";
import "./styles/App.css";

function App() {
  return (
    //gives the whole app access to router feature
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plant/:id" element={<PlantDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
