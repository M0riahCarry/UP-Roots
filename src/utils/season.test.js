import { describe, it, expect } from "vitest";
import { getPlantingAdvice, ZONE_SEASONS } from "./season";

// Dates are injected, so every seasonal state is testable regardless of when
// the tests actually run.
describe("getPlantingAdvice", () => {
  it("says to wait before the last spring frost", () => {
    const advice = getPlantingAdvice(4, new Date(2026, 0, 15)); //Jan 15
    expect(advice.status).toBe("wait");
    expect(advice.detail).toMatch(/May 20/);
  });

  it("says it's a good time to plant mid-season, with weeks remaining", () => {
    const advice = getPlantingAdvice(4, new Date(2026, 5, 14)); //Jun 14
    expect(advice.status).toBe("plant");
    expect(advice.detail).toMatch(/\d+ weeks/);
  });

  it("warns the season is wrapping up within ~6 weeks of first frost", () => {
    const advice = getPlantingAdvice(4, new Date(2026, 8, 1)); //Sep 1
    expect(advice.status).toBe("late");
  });

  it("says the season is over after the first fall frost", () => {
    const advice = getPlantingAdvice(4, new Date(2026, 10, 1)); //Nov 1
    expect(advice.status).toBe("done");
  });

  it("treats zones 10+ as frost-free", () => {
    expect(getPlantingAdvice(10, new Date(2026, 0, 1)).status).toBe("frost-free");
  });

  it("returns null for zones it has no data for", () => {
    expect(getPlantingAdvice(99)).toBeNull();
  });

  it("season table is sane: last frost always before first frost", () => {
    for (const [zone, season] of Object.entries(ZONE_SEASONS)) {
      if (!season) continue;
      const last = season.lastFrost[0] * 100 + season.lastFrost[1];
      const first = season.firstFrost[0] * 100 + season.firstFrost[1];
      expect(last, `zone ${zone}`).toBeLessThan(first);
    }
  });
});
