// Purely decorative drifting leaves. Each leaf gets its own column, size, and
// timing so they don't move in lockstep. Negative delays mean some are already
// mid-drift on first paint, so the screen isn't empty for the first few seconds.
const LEAVES = [
  { left: "4%", size: 20, duration: 16, delay: -2 },
  { left: "15%", size: 28, duration: 22, delay: -9 },
  { left: "27%", size: 18, duration: 19, delay: -5 },
  { left: "40%", size: 24, duration: 25, delay: -14 },
  { left: "53%", size: 16, duration: 18, delay: -1 },
  { left: "66%", size: 26, duration: 23, delay: -11 },
  { left: "78%", size: 20, duration: 20, delay: -6 },
  { left: "90%", size: 22, duration: 17, delay: -3 },
];

// Extra leaves for the empty gutters beside the content column. They live in
// their own fixed-width, clipped containers (see .leaf-side in the CSS), so they
// fill the blank space on wide screens without ever drifting over the content.
const SIDE_LEFT = [
  { left: "20%", size: 22, duration: 21, delay: -3 },
  { left: "62%", size: 16, duration: 26, delay: -12 },
  { left: "38%", size: 26, duration: 19, delay: -7 },
  { left: "72%", size: 18, duration: 24, delay: -1 },
  { left: "10%", size: 20, duration: 23, delay: -15 },
];

const SIDE_RIGHT = [
  { left: "30%", size: 18, duration: 20, delay: -6 },
  { left: "68%", size: 24, duration: 25, delay: -2 },
  { left: "15%", size: 22, duration: 22, delay: -11 },
  { left: "55%", size: 16, duration: 27, delay: -14 },
  { left: "80%", size: 20, duration: 18, delay: -4 },
];

function leafStyle(leaf) {
  return {
    left: leaf.left,
    fontSize: `${leaf.size}px`,
    animationDuration: `${leaf.duration}s`,
    animationDelay: `${leaf.delay}s`,
  };
}

function LeafBackground() {
  return (
    <>
      {/* leaves spread across the whole page (subtle, behind everything) */}
      <div className="leaf-bg" aria-hidden="true">
        {LEAVES.map((leaf, i) => (
          <span key={i} className="leaf" style={leafStyle(leaf)}>
            🍃
          </span>
        ))}
      </div>

      {/* denser leaves tucked into the empty side gutters */}
      <div className="leaf-side left" aria-hidden="true">
        {SIDE_LEFT.map((leaf, i) => (
          <span key={i} className="leaf" style={leafStyle(leaf)}>
            🍃
          </span>
        ))}
      </div>
      <div className="leaf-side right" aria-hidden="true">
        {SIDE_RIGHT.map((leaf, i) => (
          <span key={i} className="leaf" style={leafStyle(leaf)}>
            🍃
          </span>
        ))}
      </div>
    </>
  );
}

export default LeafBackground;
