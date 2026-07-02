import { describe, it, expect } from "vitest";
import { getSurvival } from "./hardiness";

// The survival badge is the app's core logic, so pin down every branch:
// thrives (in range), risky (one zone off either side), too cold, too warm,
// and "can't judge" (missing data).
describe("getSurvival", () => {
  it("returns null when there is no hardiness data", () => {
    expect(getSurvival(4, null)).toBeNull();
    expect(getSurvival(4, undefined)).toBeNull();
    expect(getSurvival(4, {})).toBeNull();
  });

  it("returns null when the zone is not a number", () => {
    expect(getSurvival("oops", { min: 3, max: 7 })).toBeNull();
  });

  it("thrives when the zone is inside the plant's range", () => {
    expect(getSurvival(4, { min: 3, max: 7 }).status).toBe("thrives");
    //boundaries count as inside
    expect(getSurvival(3, { min: 3, max: 7 }).status).toBe("thrives");
    expect(getSurvival(7, { min: 3, max: 7 }).status).toBe("thrives");
  });

  it("is risky (cold side) when the zone is exactly one below the plant's minimum", () => {
    const result = getSurvival(4, { min: 5, max: 9 });
    expect(result.status).toBe("risky");
    expect(result.label).toMatch(/winter/i);
  });

  it("is risky (warm side) when the zone is exactly one above the plant's maximum", () => {
    const result = getSurvival(8, { min: 3, max: 7 });
    expect(result.status).toBe("risky");
    expect(result.label).toMatch(/heat/i);
  });

  it("won't survive when the zone is far below the minimum", () => {
    const result = getSurvival(3, { min: 6, max: 9 });
    expect(result.status).toBe("no");
    expect(result.label).toMatch(/cold/i);
  });

  it("won't thrive when the zone is far above the maximum", () => {
    const result = getSurvival(10, { min: 3, max: 7 });
    expect(result.status).toBe("no");
    expect(result.label).toMatch(/warm/i);
  });

  it("handles a range with only a minimum", () => {
    //no max means we can't be in range; far below min is still too cold
    expect(getSurvival(4, { min: 6 }).status).toBe("no");
  });

  it("accepts string zone numbers (hardiness data often arrives as strings)", () => {
    expect(getSurvival("4", { min: 3, max: 7 }).status).toBe("thrives");
  });
});
