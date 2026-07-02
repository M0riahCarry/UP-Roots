// Built-in library of common cold-climate plants, curated by hand so the app
// keeps working when the external API is rate-limited or no key is configured.
// Entries use the same internal Plant shape the frontend expects. Images and
// richer descriptions are filled in from Wikipedia at request time, so we only
// need identity + care + hardiness here.
//
// Hardiness ranges are the commonly published USDA ranges for each species.
// IDs are prefixed "seed-" so they can never collide with Perenual's numeric ids.

function seed(id, commonName, scientificName, hardiness, sunlight, watering, cycle, careLevel, description) {
  return {
    id: `seed-${id}`,
    commonName,
    scientificName,
    image: null,
    watering,
    sunlight,
    cycle,
    careLevel,
    description,
    hardiness,
    source: "curated",
  };
}

export const seedPlants = [
  seed(1, "Common Milkweed", "Asclepias syriaca", { min: 3, max: 9 }, ["full sun"], "Average", "Perennial", "Low",
    "The essential monarch butterfly host plant. Tough, fragrant, and spreads readily in sunny spots."),
  seed(2, "Butterfly Weed", "Asclepias tuberosa", { min: 3, max: 9 }, ["full sun"], "Minimum", "Perennial", "Low",
    "Bright orange milkweed that thrives in poor, dry soil and feeds monarchs and native bees."),
  seed(3, "Wild Bergamot", "Monarda fistulosa", { min: 3, max: 9 }, ["full sun", "part shade"], "Average", "Perennial", "Low",
    "Lavender-pink native bee balm. A pollinator magnet that handles cold winters with ease."),
  seed(4, "Scarlet Bee Balm", "Monarda didyma", { min: 4, max: 9 }, ["full sun", "part shade"], "Average", "Perennial", "Medium",
    "Brilliant red bee balm loved by hummingbirds. Likes moist soil and good air flow."),
  seed(5, "Purple Coneflower", "Echinacea purpurea", { min: 3, max: 8 }, ["full sun"], "Average", "Perennial", "Low",
    "Classic prairie perennial with long-blooming purple flowers; seed heads feed winter birds."),
  seed(6, "Black-eyed Susan", "Rudbeckia hirta", { min: 3, max: 9 }, ["full sun"], "Average", "Perennial", "Low",
    "Cheerful gold daisies that bloom all summer and tolerate drought once established."),
  seed(7, "Hosta", "Hosta sieboldiana", { min: 3, max: 9 }, ["part shade", "full shade"], "Average", "Perennial", "Low",
    "The dependable shade workhorse. Grown for bold foliage; very cold hardy."),
  seed(8, "Daylily", "Hemerocallis fulva", { min: 3, max: 9 }, ["full sun", "part shade"], "Average", "Perennial", "Low",
    "Nearly indestructible perennial with trumpet flowers; each bloom lasts one day."),
  seed(9, "Garden Peony", "Paeonia lactiflora", { min: 3, max: 8 }, ["full sun"], "Average", "Perennial", "Low",
    "Long-lived cold-climate classic — peonies actually need winter chill to bloom well."),
  seed(10, "Siberian Iris", "Iris sibirica", { min: 3, max: 8 }, ["full sun", "part shade"], "Average", "Perennial", "Low",
    "Elegant, disease-resistant iris with grassy foliage; unfazed by hard winters."),
  seed(11, "Wild Lupine", "Lupinus perennis", { min: 3, max: 8 }, ["full sun"], "Minimum", "Perennial", "Medium",
    "Blue-spired native legume of sandy northern soils; host plant of the Karner blue butterfly."),
  seed(12, "Wild Columbine", "Aquilegia canadensis", { min: 3, max: 8 }, ["part shade"], "Average", "Perennial", "Low",
    "Red-and-yellow nodding flowers in spring; a favorite of returning hummingbirds."),
  seed(13, "Bleeding Heart", "Lamprocapnos spectabilis", { min: 3, max: 9 }, ["part shade"], "Average", "Perennial", "Low",
    "Arching stems of heart-shaped spring flowers for cool, shady beds."),
  seed(14, "Astilbe", "Astilbe arendsii", { min: 4, max: 8 }, ["part shade"], "Frequent", "Perennial", "Medium",
    "Feathery flower plumes that brighten damp shade; keep the soil consistently moist."),
  seed(15, "Autumn Stonecrop", "Hylotelephium telephium", { min: 3, max: 9 }, ["full sun"], "Minimum", "Perennial", "Low",
    "Succulent perennial with late-season flowers that feed migrating pollinators."),
  seed(16, "Common Yarrow", "Achillea millefolium", { min: 3, max: 9 }, ["full sun"], "Minimum", "Perennial", "Low",
    "Ferny-leaved toughie that shrugs off drought, cold, and poor soil."),
  seed(17, "Catmint", "Nepeta faassenii", { min: 4, max: 8 }, ["full sun"], "Minimum", "Perennial", "Low",
    "Months of soft blue bloom; deer and rabbits leave it alone."),
  seed(18, "Coral Bells", "Heuchera sanguinea", { min: 4, max: 9 }, ["part shade"], "Average", "Perennial", "Low",
    "Colorful evergreen foliage in shade; airy flower wands attract hummingbirds."),
  seed(19, "Common Lilac", "Syringa vulgaris", { min: 3, max: 7 }, ["full sun"], "Average", "Perennial", "Low",
    "The beloved cold-climate shrub — fragrant spring flowers that actually need cold winters."),
  seed(20, "Common Ninebark", "Physocarpus opulifolius", { min: 2, max: 8 }, ["full sun", "part shade"], "Average", "Perennial", "Low",
    "Extremely hardy native shrub with peeling bark and pollinator-friendly spring flowers."),
  seed(21, "Red-osier Dogwood", "Cornus sericea", { min: 2, max: 7 }, ["full sun", "part shade"], "Average", "Perennial", "Low",
    "Native shrub famous for blazing red winter stems; thrives in wet, cold ground."),
  seed(22, "Saskatoon Serviceberry", "Amelanchier alnifolia", { min: 2, max: 7 }, ["full sun", "part shade"], "Average", "Perennial", "Low",
    "Northern native with spring blossoms and sweet, blueberry-like summer fruit."),
  seed(23, "Paper Birch", "Betula papyrifera", { min: 2, max: 7 }, ["full sun"], "Average", "Perennial", "Medium",
    "Iconic white-barked birch of the north woods; happiest in cool climates."),
  seed(24, "Sugar Maple", "Acer saccharum", { min: 3, max: 8 }, ["full sun", "part shade"], "Average", "Perennial", "Low",
    "The syrup tree, with unbeatable fall color; a signature of northern hardwood forests."),
  seed(25, "Red Maple", "Acer rubrum", { min: 3, max: 9 }, ["full sun", "part shade"], "Average", "Perennial", "Low",
    "Adaptable native shade tree with red flowers, stems, and famous autumn foliage."),
  seed(26, "Eastern White Pine", "Pinus strobus", { min: 3, max: 8 }, ["full sun"], "Average", "Perennial", "Low",
    "Michigan's state tree — a fast-growing, soft-needled giant of the north."),
  seed(27, "Balsam Fir", "Abies balsamea", { min: 3, max: 6 }, ["full sun", "part shade"], "Average", "Perennial", "Medium",
    "The classic fragrant Christmas fir; a true cold-climate specialist."),
  seed(28, "White Spruce", "Picea glauca", { min: 2, max: 6 }, ["full sun"], "Average", "Perennial", "Low",
    "Boreal evergreen that laughs at zone 2 winters; excellent windbreak tree."),
  seed(29, "Northern White Cedar", "Thuja occidentalis", { min: 2, max: 7 }, ["full sun", "part shade"], "Average", "Perennial", "Low",
    "Native arborvitae of northern swamps and shorelines; a hardy hedge favorite."),
  seed(30, "Tamarack", "Larix laricina", { min: 2, max: 5 }, ["full sun"], "Frequent", "Perennial", "Medium",
    "A conifer that drops its needles — glowing gold each fall in northern bogs."),
  seed(31, "Quaking Aspen", "Populus tremuloides", { min: 2, max: 6 }, ["full sun"], "Average", "Perennial", "Low",
    "Fluttering leaves and white bark; one of the hardiest trees in North America."),
  seed(32, "Nannyberry", "Viburnum lentago", { min: 2, max: 8 }, ["full sun", "part shade"], "Average", "Perennial", "Low",
    "Big native viburnum with spring flowers, edible black fruit, and wine-red fall color."),
  seed(33, "Winterberry", "Ilex verticillata", { min: 3, max: 9 }, ["full sun", "part shade"], "Frequent", "Perennial", "Medium",
    "Deciduous holly whose bright red berries light up the winter landscape."),
  seed(34, "Highbush Blueberry", "Vaccinium corymbosum", { min: 4, max: 7 }, ["full sun"], "Frequent", "Perennial", "Medium",
    "Homegrown blueberries for acidic northern soils, plus scarlet fall foliage."),
  seed(35, "Red Raspberry", "Rubus idaeus", { min: 3, max: 8 }, ["full sun"], "Average", "Perennial", "Low",
    "Reliable cold-climate berry patch staple; bears heavily with little fuss."),
  seed(36, "Rhubarb", "Rheum rhabarbarum", { min: 3, max: 8 }, ["full sun"], "Average", "Perennial", "Low",
    "The north's favorite pie plant — a perennial vegetable that needs cold winters."),
  seed(37, "Chives", "Allium schoenoprasum", { min: 3, max: 9 }, ["full sun", "part shade"], "Average", "Perennial", "Low",
    "First herb up in spring; edible purple blooms and effortless cold hardiness."),
];

// Simple name search over the library — used when the external API can't be.
export function searchSeeds(query) {
  const q = query.toLowerCase();
  return seedPlants.filter(
    (p) =>
      p.commonName.toLowerCase().includes(q) ||
      p.scientificName.toLowerCase().includes(q),
  );
}

export function getSeedById(id) {
  return seedPlants.find((p) => p.id === id) ?? null;
}
