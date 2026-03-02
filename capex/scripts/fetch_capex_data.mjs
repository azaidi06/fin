#!/usr/bin/env node
/**
 * Fetch AI company capital expenditure data from SEC EDGAR → public/capex-data.json
 * Zero dependencies — Node.js built-ins only.
 *
 * Source: SEC EDGAR XBRL CompanyFacts API (free, no key required)
 *
 * Usage:
 *   node scripts/fetch_capex_data.mjs
 */

import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, "..", "public", "capex-data.json");

// ── Companies ────────────────────────────────────────────

const COMPANIES = [
  {
    ticker: "MSFT", name: "Microsoft", cik: "0000789019", fiscalYearEnd: "June",
    tags: ["PaymentsToAcquirePropertyPlantAndEquipment"],
  },
  {
    ticker: "GOOGL", name: "Alphabet", cik: "0001652044", fiscalYearEnd: "Dec",
    tags: ["PaymentsToAcquirePropertyPlantAndEquipment"],
  },
  {
    ticker: "AMZN", name: "Amazon", cik: "0001018724", fiscalYearEnd: "Dec",
    tags: ["PaymentsToAcquireProductiveAssets", "PaymentsToAcquirePropertyPlantAndEquipment"],
  },
  {
    ticker: "META", name: "Meta", cik: "0001326801", fiscalYearEnd: "Dec",
    tags: ["PaymentsToAcquirePropertyPlantAndEquipment"],
  },
  {
    ticker: "AAPL", name: "Apple", cik: "0000320193", fiscalYearEnd: "Sep",
    tags: ["PaymentsToAcquirePropertyPlantAndEquipment"],
  },
  {
    ticker: "NVDA", name: "NVIDIA", cik: "0001045810", fiscalYearEnd: "Jan",
    tags: ["PaymentsToAcquireProductiveAssets", "PaymentsToAcquirePropertyPlantAndEquipment"],
  },
  {
    ticker: "ORCL", name: "Oracle", cik: "0001341439", fiscalYearEnd: "May",
    tags: ["PaymentsToAcquirePropertyPlantAndEquipment"],
  },
  {
    ticker: "TSLA", name: "Tesla", cik: "0001318605", fiscalYearEnd: "Dec",
    tags: ["PaymentsToAcquirePropertyPlantAndEquipment"],
  },
];

// ── HTTP helper ──────────────────────────────────────────

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const opts = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      headers: {
        "User-Agent": "CapexTracker/1.0 (capex-data-fetcher; contact@example.com)",
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

// ── Extract capex entries ────────────────────────────────

function extractCapexEntries(facts, tags) {
  const usGaap = facts?.facts?.["us-gaap"];
  if (!usGaap) throw new Error("No us-gaap facts found");

  // Try tags in order, pick the one with the most recent USD data
  let bestTag = null;
  let bestEntries = [];
  let bestMaxEnd = "";

  for (const tag of tags) {
    const concept = usGaap[tag];
    if (!concept) continue;

    const usdEntries = concept.units?.USD;
    if (!usdEntries || usdEntries.length === 0) continue;

    const maxEnd = usdEntries.reduce((max, e) => (e.end > max ? e.end : max), "");
    if (maxEnd > bestMaxEnd) {
      bestMaxEnd = maxEnd;
      bestTag = tag;
      bestEntries = usdEntries;
    }
  }

  if (!bestTag) throw new Error(`No capex data found for tags: ${tags.join(", ")}`);
  console.log(`    Using tag: ${bestTag} (${bestEntries.length} entries, latest: ${bestMaxEnd})`);
  return bestEntries;
}

// ── Build quarterly data ─────────────────────────────────

function buildQuarterlyData(entries) {
  // Direct quarterly entries: frame = CY{year}Q{quarter}I
  // (the "I" suffix means instantaneous/quarterly, not cumulative)
  const quarterlyMap = new Map();

  // First pass: collect direct quarterly entries
  for (const e of entries) {
    if (!e.frame) continue;
    const qMatch = e.frame.match(/^CY(\d{4})Q([1-4])I?$/);
    if (!qMatch) continue;

    const year = parseInt(qMatch[1]);
    const quarter = parseInt(qMatch[2]);
    const key = `CY${year}Q${quarter}`;

    // Keep the entry with the latest filing date (most accurate)
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

  // Second pass: derive quarterly from YTD (cumulative) entries where missing
  // YTD entries have frames like CY{year}Q{quarter} without the "I" suffix
  // and span from start of fiscal year to end of quarter
  const ytdByYear = new Map();
  for (const e of entries) {
    if (!e.frame) continue;
    // Match cumulative entries (no "I" suffix)
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

  // Derive missing quarters from YTD subtraction
  for (const [, ytd] of ytdByYear) {
    const key = `CY${ytd.year}Q${ytd.quarter}`;
    if (quarterlyMap.has(key)) continue; // already have direct data

    if (ytd.quarter === 1) {
      // Q1 YTD = Q1
      quarterlyMap.set(key, {
        period: key,
        calendarYear: ytd.year,
        calendarQuarter: ytd.quarter,
        value: ytd.val,
        valueBillions: Math.round((ytd.val / 1e9) * 100) / 100,
        endDate: ytd.end,
      });
    } else {
      // Q{n} = YTD(Q{n}) - YTD(Q{n-1})
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

  // Sort by period
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

  // Compute YoY growth
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

  // Verify the 4 quarters are consecutive
  for (let i = 1; i < last4.length; i++) {
    const prev = last4[i - 1];
    const curr = last4[i];
    const expectedYear = prev.calendarQuarter === 4 ? prev.calendarYear + 1 : prev.calendarYear;
    const expectedQ = prev.calendarQuarter === 4 ? 1 : prev.calendarQuarter + 1;
    if (curr.calendarYear !== expectedYear || curr.calendarQuarter !== expectedQ) {
      return null; // non-consecutive quarters, TTM would be misleading
    }
  }

  const value = last4.reduce((sum, q) => sum + q.value, 0);

  return {
    value,
    valueBillions: Math.round((value / 1e9) * 100) / 100,
    quarters: last4.map((q) => q.period),
  };
}

// ── Main ─────────────────────────────────────────────────

async function main() {
  const ts = new Date().toLocaleString();
  console.log(`\n[${ts}] Fetching capex data from SEC EDGAR...\n`);

  const results = [];

  for (const company of COMPANIES) {
    console.log(`  [${company.ticker}] Fetching ${company.name} (CIK ${company.cik})...`);
    try {
      const facts = await fetchCompanyFacts(company.cik);
      const entries = extractCapexEntries(facts, company.tags);
      const quarterly = buildQuarterlyData(entries);
      const annual = buildAnnualData(entries);
      const ttm = computeTTM(quarterly);

      const latestQuarter = quarterly.length > 0 ? quarterly[quarterly.length - 1] : null;
      const latestAnnual = annual.length > 0 ? annual[annual.length - 1] : null;

      results.push({
        ticker: company.ticker,
        name: company.name,
        cik: company.cik,
        fiscalYearEnd: company.fiscalYearEnd,
        quarterly,
        annual,
        latestQuarter,
        latestAnnual,
        trailingTwelveMonths: ttm,
      });

      const qCount = quarterly.length;
      const aCount = annual.length;
      const ttmStr = ttm ? `$${ttm.valueBillions}B` : "N/A";
      console.log(`    OK: ${qCount} quarters, ${aCount} annual periods, TTM=${ttmStr}\n`);
    } catch (e) {
      console.log(`    FAILED: ${e.message}\n`);
    }

    // Respect SEC rate limits (10 requests/sec)
    await sleep(150);
  }

  // Build summary
  const withAnnual = results.filter((r) => r.latestAnnual);
  const totalLatestAnnual = withAnnual.reduce((sum, r) => sum + r.latestAnnual.value, 0);

  const topSpender = withAnnual.length > 0
    ? withAnnual.reduce((max, r) => (r.latestAnnual.value > max.latestAnnual.value ? r : max)).ticker
    : null;

  const withGrowth = withAnnual.filter((r) => r.latestAnnual.yoyGrowthPct !== undefined);
  const fastestGrower = withGrowth.length > 0
    ? withGrowth.reduce((max, r) => (r.latestAnnual.yoyGrowthPct > max.latestAnnual.yoyGrowthPct ? r : max)).ticker
    : null;

  const payload = {
    updatedAt: new Date().toISOString(),
    source: "SEC-EDGAR",
    companies: results,
    summary: {
      totalLatestAnnualCapexBillions: Math.round((totalLatestAnnual / 1e9) * 100) / 100,
      topSpender,
      fastestGrower,
    },
  };

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2) + "\n");
  console.log(`Got ${results.length}/${COMPANIES.length} companies`);
  console.log(`Wrote ${OUT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
