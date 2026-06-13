// Pure, deterministic logic — no API, no LLM, just comparing zone numbers.
// USDA hardiness zones run cold (1) to warm (13). A plant's hardiness.min is
// the COLDEST zone it survives; hardiness.max is the warmest it tolerates.
// So a plant survives your winter when your zone number is >= its min.

export function getSurvival(userZone, hardiness) {
  // No hardiness data from the API means we can't judge — show nothing.
  if (!hardiness || hardiness.min == null) return null;

  const zone = Number(userZone);
  const min = Number(hardiness.min);
  const max = Number(hardiness.max);
  if (Number.isNaN(zone) || Number.isNaN(min)) return null;

  if (zone >= min && zone <= max) {
    return {
      status: "thrives",
      emoji: "🟢",
      label: "Thrives in your zone",
    };
  }

  // One zone off in either direction = borderline, survivable with effort.
  if (zone === min - 1 || zone === max + 1) {
    return {
      status: "risky",
      emoji: "🟡",
      label: "Risky — needs winter protection",
    };
  }

  if (zone < min) {
    return {
      status: "no",
      emoji: "🔴",
      label: "Too cold to survive winter",
    };
  }

  return {
    status: "no",
    emoji: "🔴",
    label: "Too warm to thrive",
  };
}
