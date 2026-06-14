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

function LeafBackground() {
  return (
    <div className="leaf-bg" aria-hidden="true">
      {LEAVES.map((leaf, i) => (
        <span
          key={i}
          className="leaf"
          style={{
            left: leaf.left,
            fontSize: `${leaf.size}px`,
            animationDuration: `${leaf.duration}s`,
            animationDelay: `${leaf.delay}s`,
          }}
        >
          🍃
        </span>
      ))}
    </div>
  );
}

export default LeafBackground;
