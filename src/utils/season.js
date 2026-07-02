// Turns a hardiness zone + today's date into planting advice. Frost dates vary
// by microclimate, so these are the commonly published *approximate* averages
// per zone — good enough to answer "is there still time to plant this?"
// All functions are pure (date injected) so they're easy to test.

// [month, day] of the average last spring frost and first fall frost.
export const ZONE_SEASONS = {
  2: { lastFrost: [6, 5], firstFrost: [9, 1] },
  3: { lastFrost: [5, 30], firstFrost: [9, 10] },
  4: { lastFrost: [5, 20], firstFrost: [9, 25] },
  5: { lastFrost: [5, 10], firstFrost: [10, 5] },
  6: { lastFrost: [4, 25], firstFrost: [10, 15] },
  7: { lastFrost: [4, 10], firstFrost: [10, 25] },
  8: { lastFrost: [3, 25], firstFrost: [11, 10] },
  9: { lastFrost: [2, 25], firstFrost: [11, 25] },
  //zones 10+ are essentially frost-free
  10: null,
  11: null,
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function label([month, day]) {
  return `${MONTHS[month - 1]} ${day}`;
}

function toDate(year, [month, day]) {
  return new Date(year, month - 1, day);
}

const WEEK = 7 * 24 * 60 * 60 * 1000;
//"late in the season" = within ~6 weeks of the first fall frost
const LATE_WINDOW = 6 * WEEK;

/**
 * @param {number} zone - USDA hardiness zone
 * @param {Date} [today]
 * @returns {null | {status: string, headline: string, detail: string, seasonLabel: string|null}}
 */
export function getPlantingAdvice(zone, today = new Date()) {
  const season = ZONE_SEASONS[zone];
  if (season === undefined) return null;

  if (season === null) {
    return {
      status: "frost-free",
      headline: "☀️ Year-round growing",
      detail: `Zone ${zone} is essentially frost-free — you can plant almost any time.`,
      seasonLabel: null,
    };
  }

  const year = today.getFullYear();
  const lastFrost = toDate(year, season.lastFrost);
  const firstFrost = toDate(year, season.firstFrost);
  const seasonLabel = `≈ ${label(season.lastFrost)} – ${label(season.firstFrost)}`;

  if (today < lastFrost) {
    return {
      status: "wait",
      headline: "❄️ Hold off — frost still likely",
      detail: `In zone ${zone}, the last spring frost usually passes around ${label(
        season.lastFrost,
      )}. Start seeds indoors now and plant outside after that.`,
      seasonLabel,
    };
  }

  if (today.getTime() < firstFrost.getTime() - LATE_WINDOW) {
    const weeksLeft = Math.round((firstFrost.getTime() - today.getTime()) / WEEK);
    return {
      status: "plant",
      headline: "🌱 Good time to plant",
      detail: `About ${weeksLeft} weeks of growing season left in zone ${zone} (first fall frost ≈ ${label(
        season.firstFrost,
      )}).`,
      seasonLabel,
    };
  }

  if (today < firstFrost) {
    return {
      status: "late",
      headline: "⏳ Season's wrapping up",
      detail: `First frost in zone ${zone} usually arrives around ${label(
        season.firstFrost,
      )}. Hardy perennials and shrubs can still go in — protect young plants.`,
      seasonLabel,
    };
  }

  return {
    status: "done",
    headline: "🌙 The growing season is over",
    detail: `Frost has typically arrived in zone ${zone} (≈ ${label(
      season.firstFrost,
    )}). Plan your beds now and plant after ${label(season.lastFrost)} next spring.`,
    seasonLabel,
  };
}
