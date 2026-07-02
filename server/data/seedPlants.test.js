import { describe, it, expect } from "vitest";
import { seedPlants, searchSeeds, getSeedById } from "./seedPlants.js";

// Guardrails on the curated dataset itself, so a hand-editing mistake
// (duplicate id, backwards zone range, missing field) fails CI instead of
// shipping broken cards.
describe("seed plant library", () => {
  it("every entry has the fields the frontend renders", () => {
    for (const p of seedPlants) {
      expect(p.id, p.commonName).toMatch(/^seed-/);
      expect(p.commonName).toBeTruthy();
      expect(p.scientificName).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(Array.isArray(p.sunlight)).toBe(true);
      expect(["Average", "Frequent", "Minimum"]).toContain(p.watering);
      expect(p.source).toBe("curated");
    }
  });

  it("ids are unique", () => {
    const ids = seedPlants.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("hardiness ranges are valid USDA zones with min <= max", () => {
    for (const p of seedPlants) {
      expect(p.hardiness.min, p.commonName).toBeGreaterThanOrEqual(1);
      expect(p.hardiness.max, p.commonName).toBeLessThanOrEqual(13);
      expect(p.hardiness.min, p.commonName).toBeLessThanOrEqual(p.hardiness.max);
    }
  });

  it("searchSeeds matches common and scientific names, case-insensitively", () => {
    expect(searchSeeds("milkweed").length).toBeGreaterThanOrEqual(1);
    //two Asclepias species prove scientific-name matching works
    expect(searchSeeds("asclepias").length).toBeGreaterThanOrEqual(2);
    //two maples prove case-insensitivity ("ACER" vs "Acer")
    expect(searchSeeds("ACER").length).toBeGreaterThanOrEqual(2);
    expect(searchSeeds("zzzznotaplant")).toEqual([]);
  });

  it("getSeedById finds library plants and rejects unknown ids", () => {
    const first = seedPlants[0];
    expect(getSeedById(first.id)).toEqual(first);
    expect(getSeedById("seed-99999")).toBeNull();
  });
});
