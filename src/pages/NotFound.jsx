import { Link } from "react-router-dom";

// Catch-all for unknown URLs (typos, stale links) so visitors get a way home
// instead of a blank page.
function NotFound() {
  return (
    <div className="home">
      <h1>Page not found</h1>
      <p className="status">
        That page doesn&apos;t exist. <Link to="/">Back to search</Link>
      </p>
    </div>
  );
}

export default NotFound;
