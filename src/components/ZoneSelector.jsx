// UP Roots focuses on cold climates (the Upper Peninsula is zones 3-5),
// but the selector covers a wider range so the app works anywhere.
const ZONES = [2, 3, 4, 5, 6, 7, 8, 9];

function ZoneSelector({ zone, onChange }) {
  return (
    <label className="zone-selector">
      Your hardiness zone:{" "}
      <select value={zone} onChange={(e) => onChange(Number(e.target.value))}>
        {ZONES.map((z) => (
          <option key={z} value={z}>
            Zone {z}
          </option>
        ))}
      </select>
    </label>
  );
}

export default ZoneSelector;
