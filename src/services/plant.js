// The internal shape every part of the UI speaks. No matter which external API
// a plant came from (Perenual today, maybe GBIF/Wikipedia later), an adapter
// converts that source's raw response into THIS shape — so components never
// depend on any one API's field names.
//
// Written as a JSDoc typedef: it documents the contract and gives editors
// autocomplete, without adding TypeScript to the project yet.

/**
 * @typedef {Object} PlantImage
 * @property {string} [thumb] - smaller image for cards
 * @property {string} [full]  - larger image for the detail page
 */

/**
 * @typedef {Object} Hardiness
 * @property {number} min - coldest USDA zone the plant tolerates
 * @property {number} max - warmest USDA zone the plant tolerates
 */

/**
 * @typedef {Object} Plant
 * @property {number|string} id
 * @property {string} commonName
 * @property {string} scientificName       - already joined for display
 * @property {PlantImage|null} image
 * @property {string|null} watering
 * @property {string[]|null} sunlight
 * @property {string|null} cycle
 * @property {string|null} careLevel
 * @property {string|null} description
 * @property {Hardiness|null} hardiness
 * @property {string} source               - where the data came from, e.g. "perenual"
 */

export {};
