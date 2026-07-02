import { NavLink } from "react-router-dom";
import { useGarden } from "../context/GardenContext";

function NavBar() {
  const { garden } = useGarden();

  return (
    <nav className="main-nav">
      <NavLink to="/">Search</NavLink>
      <NavLink to="/garden">
        My Garden
        {garden.length > 0 && <span className="nav-count">{garden.length}</span>}
      </NavLink>
    </nav>
  );
}

export default NavBar;
