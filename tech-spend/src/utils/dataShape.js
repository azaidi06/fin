/**
 * Helpers for the new tech-spend data shape.
 *
 * Each company has `metrics: { capex, rd, sga }` and each metric (or null) has
 * `{ annual, quarterly, latestAnnual, trailingTwelveMonths, source }`.
 *
 * AMZN's R&D is null because Amazon doesn't tag R&D under us-gaap.
 * All helpers tolerate null metrics gracefully.
 */

export const getCapex = (c) => c?.metrics?.capex || null;
export const getRd = (c) => c?.metrics?.rd || null;
export const getSga = (c) => c?.metrics?.sga || null;

/**
 * Find the annual entry for a given calendar year on a metric (or null).
 */
export function annualEntry(metric, year) {
  if (!metric || !metric.annual) return null;
  return metric.annual.find((a) => a.calendarYear === year) || null;
}

/**
 * Total OpEx (R&D + SG&A) for a company in a given year.
 * Returns { value, partial } where `partial` is true when one of the two
 * metrics is missing (still summed, treating missing as 0).
 */
export function getOpexAnnual(company, year) {
  const rd = annualEntry(getRd(company), year);
  const sga = annualEntry(getSga(company), year);
  const rdVal = rd?.valueBillions ?? null;
  const sgaVal = sga?.valueBillions ?? null;
  if (rdVal == null && sgaVal == null) return { value: null, partial: false };
  const value = (rdVal ?? 0) + (sgaVal ?? 0);
  const partial = rdVal == null || sgaVal == null;
  return { value, partial };
}

/**
 * Latest-annual OpEx for a company. Uses each metric's `latestAnnual` directly
 * (R&D and SG&A may end on different fiscal years for some companies but for
 * the big 8 they line up).
 */
export function getLatestOpex(company) {
  const rd = getRd(company)?.latestAnnual;
  const sga = getSga(company)?.latestAnnual;
  const rdVal = rd?.valueBillions ?? null;
  const sgaVal = sga?.valueBillions ?? null;
  if (rdVal == null && sgaVal == null) return { value: null, partial: false, year: null };
  const value = (rdVal ?? 0) + (sgaVal ?? 0);
  const partial = rdVal == null || sgaVal == null;
  // Prefer the rd year, fall back to sga's
  const year = rd?.calendarYear ?? sga?.calendarYear ?? null;
  return { value, partial, year };
}

/**
 * Total tech spend (CapEx + R&D + SG&A) for a company in a given year.
 */
export function getTotalTechSpendAnnual(company, year) {
  const capex = annualEntry(getCapex(company), year);
  const opex = getOpexAnnual(company, year);
  const cx = capex?.valueBillions ?? null;
  if (cx == null && opex.value == null) return { value: null, partial: false };
  const value = (cx ?? 0) + (opex.value ?? 0);
  const partial = cx == null || opex.partial || opex.value == null;
  return { value, partial };
}

/**
 * Latest-annual tech spend for a company.
 */
export function getLatestTechSpend(company) {
  const capex = getCapex(company)?.latestAnnual;
  const opex = getLatestOpex(company);
  const cx = capex?.valueBillions ?? null;
  if (cx == null && opex.value == null) return { value: null, partial: false, year: null };
  const value = (cx ?? 0) + (opex.value ?? 0);
  const partial = cx == null || opex.partial || opex.value == null;
  const year = capex?.calendarYear ?? opex.year ?? null;
  return { value, partial, year };
}

/**
 * Sorted list of all calendar years that appear on any (capex/rd/sga) annual
 * series across the given companies, optionally filtered by min year.
 */
export function unionYears(companies, { metric = "any", minYear = null } = {}) {
  const set = new Set();
  for (const c of companies) {
    const metrics = metric === "any"
      ? [getCapex(c), getRd(c), getSga(c)]
      : [c?.metrics?.[metric]];
    for (const m of metrics) {
      if (!m) continue;
      for (const a of m.annual || []) {
        if (minYear != null && a.calendarYear < minYear) continue;
        set.add(a.calendarYear);
      }
    }
  }
  return [...set].sort((a, b) => a - b);
}

/**
 * Sparkline values for a company across last N years for a given metric mode.
 * mode: 'capex' | 'opex' | 'total'
 * Returns an array of { year, capex, opex } objects (capex/opex in billions, 0
 * if missing) for use in stacked sparklines.
 */
export function getStackedSparkline(company, n = 5) {
  const capexMetric = getCapex(company);
  const years = (capexMetric?.annual || []).slice(-n).map((a) => a.calendarYear);
  return years.map((year) => {
    const cx = annualEntry(capexMetric, year)?.valueBillions ?? 0;
    const opex = getOpexAnnual(company, year);
    return {
      year,
      capex: cx,
      opex: opex.value ?? 0,
    };
  });
}
