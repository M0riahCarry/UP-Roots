// Placeholder card shown while search results load, so the page keeps its
// shape instead of jumping when results arrive.
function SkeletonCard() {
  return (
    <div className="plant-card skeleton" aria-hidden="true">
      <div className="sk-img" />
      <div className="sk-line wide" />
      <div className="sk-line" />
      <div className="sk-line narrow" />
    </div>
  );
}

export default SkeletonCard;
