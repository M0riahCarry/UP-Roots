import { useState } from "react";
import { getZoneForZip } from "../services/hardinessZone";

// UP Roots focuses on cold climates (the Upper Peninsula is zones 3-5), but the
// range is wide so the app works anywhere, including zones a ZIP lookup returns.
const ZONES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

function ZoneSelector({ zone, onChange }) {
  const [zip, setZip] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [status, setStatus] = useState(null); // { type: "ok" | "error", message }

  async function handleDetect(e) {
    //it's a form, so stop the default page reload
    e.preventDefault();
    if (!/^\d{5}$/.test(zip)) {
      setStatus({ type: "error", message: "Enter a 5-digit ZIP code." });
      return;
    }
    setDetecting(true);
    setStatus(null);
    try {
      const detected = await getZoneForZip(zip);
      onChange(detected);
      setStatus({ type: "ok", message: `Set to zone ${detected}.` });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setDetecting(false);
    }
  }

  return (
    <div className="zone-selector">
      <label>
        Your hardiness zone:{" "}
        <select value={zone} onChange={(e) => onChange(Number(e.target.value))}>
          {ZONES.map((z) => (
            <option key={z} value={z}>
              Zone {z}
            </option>
          ))}
        </select>
      </label>

      <form className="zip-form" onSubmit={handleDetect}>
        <span>or find it by ZIP:</span>
        <input
          type="text"
          inputMode="numeric"
          maxLength={5}
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder="e.g. 49855"
        />
        <button type="submit" disabled={detecting}>
          {detecting ? "Finding..." : "Find"}
        </button>
      </form>

      {status && (
        <p className={`zone-status ${status.type === "error" ? "error" : ""}`}>
          {status.message}
        </p>
      )}
    </div>
  );
}

export default ZoneSelector;
