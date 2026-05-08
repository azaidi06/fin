#!/usr/bin/env node
/**
 * Fetch tech-spend data (CapEx + OpEx) from SEC EDGAR → public/tech-spend-data.json
 * Zero dependencies — Node.js built-ins only.
 *
 * Source: SEC EDGAR XBRL CompanyFacts API (free, no key required)
 *
 * Metrics:
 *   - capex: PaymentsToAcquirePropertyPlantAndEquipment (or PaymentsToAcquireProductiveAssets)
 *   - rd:    ResearchAndDevelopmentExpense
 *   - sga:   SellingGeneralAndAdministrativeExpense (or sum of split S&M + G&A)
 *
 * Total OpEx = rd + sga. Total tech spend = capex + opex.
 *
 * Usage:
 *   node scripts/fetch_tech_spend_data.mjs
 */

import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, "..", "public", "tech-spend-data.json");

// ── Metrics ──────────────────────────────────────────────

const METRICS = {
  capex: {
    primary: ["PaymentsToAcquirePropertyPlantAndEquipment"],
    fallbacks: ["PaymentsToAcquireProductiveAssets"],
  },
  rd: {
    primary: ["ResearchAndDevelopmentExpense"],
    fallbacks: [],
  },
  sga: {
    primary: ["SellingGeneralAndAdministrativeExpense"],
    fallbacks: ["SellingAndMarketingExpense+GeneralAndAdministrativeExpense"],
  },
};

// ── Companies ────────────────────────────────────────────

const COMPANIES = [
  { ticker: "MSFT",  name: "Microsoft", cik: "0000789019", fiscalYearEnd: "June" },
  { ticker: "GOOGL", name: "Alphabet",  cik: "0001652044", fiscalYearEnd: "Dec" },
  { ticker: "AMZN",  name: "Amazon",    cik: "0001018724", fiscalYearEnd: "Dec",
    capexTags: ["PaymentsToAcquireProductiveAssets", "PaymentsToAcquirePropertyPlantAndEquipment"],
    // Amazon reports R&D as Technology & Content/Infrastructure (custom tag)
    rdTags: ["TechnologyAndContentExpense", "TechnologyAndInfrastructureExpense"],
    // Amazon splits S&M and G&A; sum them for SG&A-equivalent
    sgaFallbacks: ["MarketingExpense+GeneralAndAdministrativeExpense"] },
  { ticker: "META",  name: "Meta",      cik: "0001326801", fiscalYearEnd: "Dec" },
  { ticker: "AAPL",  name: "Apple",     cik: "0000320193", fiscalYearEnd: "Sep" },
  { ticker: "NVDA",  name: "NVIDIA",    cik: "0001045810", fiscalYearEnd: "Jan",
    capexTags: ["PaymentsToAcquireProductiveAssets", "PaymentsToAcquirePropertyPlantAndEquipment"] },
  { ticker: "ORCL",  name: "Oracle",    cik: "0001341439", fiscalYearEnd: "May" },
  { ticker: "TSLA",  name: "Tesla",     cik: "0001318605", fiscalYearEnd: "Dec" },
];

// ── HTTP helper ──────────────────────────────────────────

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const opts = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      headers: {
        "User-Agent": "TechSpendTracker/1.0 (tech-spend-fetcher; contact@example.com)",
        Accept: "application/json",
      },
    };

    https.get(opts, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => resolve({ status: res.statusCode, body }));
    }).on("error", reject);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── SEC EDGAR fetch ──────────────────────────────────────

async function fetchCompanyFacts(cik) {
  const url = `https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`;
  const res = await httpsGet(url);
  if (res.status !== 200) throw new Error(`HTTP ${res.status} for CIK ${cik}`);
  return JSON.parse(res.body);
}

// ── Generic tag extraction ───────────────────────────────

function getUsdEntries(facts, tag) {
  // Search all namespaces (us-gaap, dei, plus company-specific like 'amzn').
  const namespaces = facts?.facts ? Object.keys(facts.facts) : [];
  for (const ns of namespaces) {
    const concept = facts.facts[ns]?.[tag];
    if (!concept) continue;
    const entries = concept.units?.USD;
    if (entries && entries.length > 0) return entries;
  }
  return null;
}

function pickBestTag(facts, tags) {
  let best = null;
  let bestEnd = "";
  for (const tag of tags) {
    const entries = getUsdEntries(facts, tag);
    if (!entries) continue;
    const maxEnd = entries.reduce((m, e) => (e.end > m ? e.end : m), "");
    if (maxEnd > bestEnd) {
      bestEnd = maxEnd;
      best = { tag, entries };
    }
  }
  return best;
}

// Sum two or more concepts entry-by-entry on matching frame+end keys
function sumEntriesAcrossTags(facts, tags) {
  const sources = tags.map((t) => getUsdEntries(facts, t)).filter(Boolean);
  if (sources.length !== tags.length) return [];

  const grouped = sources.map((entries) => {
    const m = new Map();
    for (const e of entries) {
      if (!e.frame) continue;
      const key = `${e.frame}|${e.end}`;
      const existing = m.get(key);
      if (!existing || e.filed > existing.filed) m.set(key, e);
    }
    return m;
  });

  const keys = [...grouped[0].keys()].filter((k) =>
    grouped.every((m) => m.has(k))
  );

  return keys.map((k) => {
    const first = grouped[0].get(k);
    const sumVal = grouped.reduce((s, m) => s + m.get(k).val, 0);
    return { ...first, val: sumVal };
  });
}

// ── Build quarterly data ─────────────────────────────────

function buildQuarterlyData(entries) {
  const quarterlyMap = new Map();

  for (const e of entries) {
    if (!e.frame) continue;
    const qMatch = e.frame.match(/^CY(\d{4})Q([1-4])I?$/);
    if (!qMatch) continue;

    const year = parseInt(qMatch[1]);
    const quarter = parseInt(qMatch[2]);
    const key = `CY${year}Q${quarter}`;

    const existing = quarterlyMap.get(key);
    if (!existing || e.filed > existing.filed) {
      quarterlyMap.set(key, {
        period: key,
        calendarYear: year,
        calendarQuarter: quarter,
        value: e.val,
        valueBillions: Math.round((e.val / 1e9) * 100) / 100,
        endDate: e.end,
      });
    }
  }

  const ytdByYear = new Map();
  for (const e of entries) {
    if (!e.frame) continue;
    const ytdMatch = e.frame.match(/^CY(\d{4})Q([1-4])$/);
    if (!ytdMatch) continue;

    const year = parseInt(ytdMatch[1]);
    const quarter = parseInt(ytdMatch[2]);
    const key = `${year}-Q${quarter}`;

    const existing = ytdByYear.get(key);
    if (!existing || e.filed > existing.filed) {
      ytdByYear.set(key, { year, quarter, val: e.val, end: e.end });
    }
  }

  for (const [, ytd] of ytdByYear) {
    const key = `CY${ytd.year}Q${ytd.quarter}`;
    if (quarterlyMap.has(key)) continue;

    if (ytd.quarter === 1) {
      quarterlyMap.set(key, {
        period: key,
        calendarYear: ytd.year,
        calendarQuarter: ytd.quarter,
        value: ytd.val,
        valueBillions: Math.round((ytd.val / 1e9) * 100) / 100,
        endDate: ytd.end,
      });
    } else {
      const prevKey = `${ytd.year}-Q${ytd.quarter - 1}`;
      const prevYtd = ytdByYear.get(prevKey);
      if (prevYtd) {
        const val = ytd.val - prevYtd.val;
        if (val > 0) {
          quarterlyMap.set(key, {
            period: key,
            calendarYear: ytd.year,
            calendarQuarter: ytd.quarter,
            value: val,
            valueBillions: Math.round((val / 1e9) * 100) / 100,
            endDate: ytd.end,
          });
        }
      }
    }
  }

  return Array.from(quarterlyMap.values()).sort((a, b) => {
    if (a.calendarYear !== b.calendarYear) return a.calendarYear - b.calendarYear;
    return a.calendarQuarter - b.calendarQuarter;
  });
}

// ── Build annual data ────────────────────────────────────

function buildAnnualData(entries) {
  const annualMap = new Map();

  for (const e of entries) {
    if (!e.frame) continue;
    const aMatch = e.frame.match(/^CY(\d{4})$/);
    if (!aMatch) continue;

    const year = parseInt(aMatch[1]);
    const key = `CY${year}`;

    const existing = annualMap.get(key);
    if (!existing || e.filed > existing.filed) {
      annualMap.set(key, {
        period: key,
        calendarYear: year,
        value: e.val,
        valueBillions: Math.round((e.val / 1e9) * 100) / 100,
        endDate: e.end,
      });
    }
  }

  const sorted = Array.from(annualMap.values()).sort((a, b) => a.calendarYear - b.calendarYear);

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1].value;
    if (prev > 0) {
      sorted[i].yoyGrowthPct = Math.round(((sorted[i].value - prev) / prev) * 10000) / 100;
    }
  }

  return sorted;
}

// ── Compute TTM ──────────────────────────────────────────

function computeTTM(quarterly) {
  if (quarterly.length < 4) return null;
  const last4 = quarterly.slice(-4);
  for (let i = 1; i < last4.length; i++) {
    const prev = last4[i - 1];
    const curr = last4[i];
    const expY = prev.calendarQuarter === 4 ? prev.calendarYear + 1 : prev.calendarYear;
    const expQ = prev.calendarQuarter === 4 ? 1 : prev.calendarQuarter + 1;
    if (curr.calendarYear !== expY || curr.calendarQuarter !== expQ) return null;
  }
  const value = last4.reduce((s, q) => s + q.value, 0);
  return {
    value,
    valueBillions: Math.round((value / 1e9) * 100) / 100,
    quarters: last4.map((q) => q.period),
  };
}

// ── Build per-metric series for a company ─────────────────

function buildSeries(facts, metric, company) {
  let spec = METRICS[metric];
  if (metric === "capex" && company.capexTags) {
    spec = { primary: company.capexTags, fallbacks: [] };
  } else if (metric === "rd" && company.rdTags) {
    spec = { primary: company.rdTags, fallbacks: [] };
  } else if (metric === "sga" && company.sgaFallbacks) {
    spec = { primary: spec.primary, fallbacks: company.sgaFallbacks };
  }

  const primary = pickBestTag(facts, spec.primary);
  let extracted = primary
    ? { entries: primary.entries, source: primary.tag }
    : null;

  if (!extracted) {
    for (const fallback of spec.fallbacks) {
      if (fallback.includes("+")) {
        const tags = fallback.split("+");
        const summed = sumEntriesAcrossTags(facts, tags);
        if (summed.length > 0) {
          extracted = { entries: summed, source: tags.join(" + ") };
          break;
        }
      } else {
        const single = pickBestTag(facts, [fallback]);
        if (single) {
          extracted = { entries: single.entries, source: single.tag };
          break;
        }
      }
    }
  }

  if (!extracted) return null;

  const quarterly = buildQuarterlyData(extracted.entries);
  const annual = buildAnnualData(extracted.entries);
  const ttm = computeTTM(quarterly);

  return {
    source: extracted.source,
    quarterly,
    annual,
    latestQuarter: quarterly.length > 0 ? quarterly[quarterly.length - 1] : null,
    latestAnnual: annual.length > 0 ? annual[annual.length - 1] : null,
    trailingTwelveMonths: ttm,
  };
}

// ── Main ─────────────────────────────────────────────────

async function main() {
  const ts = new Date().toLocaleString();
  console.log(`\n[${ts}] Fetching tech-spend data from SEC EDGAR...\n`);

  const results = [];

  for (const company of COMPANIES) {
    console.log(`  [${company.ticker}] Fetching ${company.name} (CIK ${company.cik})...`);
    try {
      const facts = await fetchCompanyFacts(company.cik);
      const metrics = {};
      for (const key of ["capex", "rd", "sga"]) {
        const series = buildSeries(facts, key, company);
        if (series) {
          metrics[key] = series;
          const latestB = series.latestAnnual ? `$${series.latestAnnual.valueBillions}B` : "—";
          console.log(`    ${key.padEnd(5)} ${series.source.padEnd(60)} latest=${latestB}`);
        } else {
          console.log(`    ${key.padEnd(5)} (no data)`);
        }
      }

      results.push({
        ticker: company.ticker,
        name: company.name,
        cik: company.cik,
        fiscalYearEnd: company.fiscalYearEnd,
        metrics,
      });
      console.log("");
    } catch (e) {
      console.log(`    FAILED: ${e.message}\n`);
    }
    await sleep(150);
  }

  // ── Summary ──
  const withCapex = results.filter((r) => r.metrics.capex?.latestAnnual);
  const totalCapex = withCapex.reduce((s, r) => s + r.metrics.capex.latestAnnual.value, 0);

  const withRd = results.filter((r) => r.metrics.rd?.latestAnnual);
  const totalRd = withRd.reduce((s, r) => s + r.metrics.rd.latestAnnual.value, 0);

  const withSga = results.filter((r) => r.metrics.sga?.latestAnnual);
  const totalSga = withSga.reduce((s, r) => s + r.metrics.sga.latestAnnual.value, 0);

  const totalOpex = totalRd + totalSga;
  const totalTechSpend = totalCapex + totalOpex;

  const topCapexSpender = withCapex.length > 0
    ? withCapex.reduce((m, r) => (r.metrics.capex.latestAnnual.value > m.metrics.capex.latestAnnual.value ? r : m)).ticker
    : null;

  const withCapexGrowth = withCapex.filter((r) => r.metrics.capex.latestAnnual.yoyGrowthPct !== undefined);
  const fastestCapexGrower = withCapexGrowth.length > 0
    ? withCapexGrowth.reduce((m, r) => (r.metrics.capex.latestAnnual.yoyGrowthPct > m.metrics.capex.latestAnnual.yoyGrowthPct ? r : m)).ticker
    : null;

  const techSpendByTicker = results.map((r) => {
    const c = r.metrics.capex?.latestAnnual?.value || 0;
    const rd = r.metrics.rd?.latestAnnual?.value || 0;
    const sga = r.metrics.sga?.latestAnnual?.value || 0;
    return { ticker: r.ticker, total: c + rd + sga };
  }).filter((x) => x.total > 0);

  const topTechSpender = techSpendByTicker.length > 0
    ? techSpendByTicker.reduce((m, r) => (r.total > m.total ? r : m)).ticker
    : null;

  const payload = {
    updatedAt: new Date().toISOString(),
    source: "SEC-EDGAR",
    companies: results,
    summary: {
      totalLatestAnnualCapexBillions: Math.round((totalCapex / 1e9) * 100) / 100,
      totalLatestAnnualRdBillions: Math.round((totalRd / 1e9) * 100) / 100,
      totalLatestAnnualSgaBillions: Math.round((totalSga / 1e9) * 100) / 100,
      totalLatestAnnualOpexBillions: Math.round((totalOpex / 1e9) * 100) / 100,
      totalLatestAnnualTechSpendBillions: Math.round((totalTechSpend / 1e9) * 100) / 100,
      topCapexSpender,
      topTechSpender,
      fastestCapexGrower,
    },
  };

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2) + "\n");
  console.log(`\nGot ${results.length}/${COMPANIES.length} companies`);
  console.log(`Wrote ${OUT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
