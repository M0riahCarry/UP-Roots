import { describe, it, expect } from "vitest";
import { adaptPerenualSpecies } from "./perenual.js";

describe("adaptPerenualSpecies", () => {
  it("maps a full Perenual species into the internal Plant shape", () => {
    const raw = {
      id: 425,
      common_name: "sugar maple",
      scientific_name: ["Acer saccharum"],
      default_image: {
        thumbnail: "thumb.jpg",
        medium_url: "medium.jpg",
        regular_url: "regular.jpg",
      },
      watering: "Average",
      sunlight: ["full sun", "part shade"],
      cycle: "Perennial",
      care_level: "Low",
      description: "A maple.",
      hardiness: { min: "3", max: "8" },
    };

    expect(adaptPerenualSpecies(raw)).toEqual({
      id: 425,
      commonName: "sugar maple",
      scientificName: "Acer saccharum",
      image: { thumb: "medium.jpg", full: "regular.jpg" },
      watering: "Average",
      sunlight: ["full sun", "part shade"],
      cycle: "Perennial",
      careLevel: "Low",
      description: "A maple.",
      hardiness: { min: 3, max: 8 },
      source: "perenual",
    });
  });

  it("maps missing fields to safe defaults instead of undefined", () => {
    const plant = adaptPerenualSpecies({ id: 1 });
    expect(plant.commonName).toBe("Unknown plant");
    expect(plant.scientificName).toBe("");
    expect(plant.image).toBeNull();
    expect(plant.watering).toBeNull();
    expect(plant.sunlight).toBeNull();
    expect(plant.description).toBeNull();
    expect(plant.hardiness).toBeNull();
  });

  it("joins multiple scientific names for display", () => {
    const plant = adaptPerenualSpecies({
      id: 2,
      scientific_name: ["Monarda didyma", "Monarda fistulosa"],
    });
    expect(plant.scientificName).toBe("Monarda didyma, Monarda fistulosa");
  });

  it("falls back through image urls when some sizes are missing", () => {
    const plant = adaptPerenualSpecies({
      id: 3,
      default_image: { thumbnail: "thumb.jpg" },
    });
    expect(plant.image).toEqual({ thumb: "thumb.jpg", full: "thumb.jpg" });
  });

  it("treats an empty sunlight array as no data", () => {
    expect(adaptPerenualSpecies({ id: 4, sunlight: [] }).sunlight).toBeNull();
  });
});
