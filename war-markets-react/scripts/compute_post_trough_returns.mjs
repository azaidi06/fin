#!/usr/bin/env node
/**
 * Compute S&P 500 post-trough weekly returns for every conflict in the dataset.
 *
 * Fetches daily closes via Yahoo Finance's chart API (using an external curl
 * binary, which bypasses the UA filtering that blocks node:https), locates the
 * true trough close within a ±10-day window of each conflict's approximate
 * trough date, then computes % return from trough at 1/2/3/4/6/8/13/26 weeks.
 *
 * Outputs a JS object ready to paste into src/data/warData.js.
 *
 * Usage:  node scripts/compute_post_trough_returns.mjs
 *
 * Requires: curl on PATH.
 */

import { execFileSync } from "node:child_process";

const CONFLICTS = [
  { key: "WWII",           approxTrough: "1942-04-28" },
  { key: "Korea",          approxTrough: "1950-07-17" },
  { key: "Cuban Missile",  approxTrough: "1962-10-23" },
  { key: "Vietnam",        approxTrough: "1964-09-11" },
  { key: "Oil Embargo",    approxTrough: "1974-10-03" },
  { key: "Black Monday",   approxTrough: "1987-12-04" },
  { key: "Gulf War",       approxTrough: "1990-10-11" },
  { key: "9/11",           approxTrough: "2001-09-21" },
  { key: "Iraq",           approxTrough: "2003-03-31" },
  { key: "2008 Crisis",    approxTrough: "2009-03-09" },
  { key: "COVID",          approxTrough: "2020-03-23" },
  { key: "Russia-Ukraine", approxTrough: "2022-10-12" },
  { key: "Iran",           approxTrough: "2026-03-30" },
];

const WEEKS = [2, 4, 6, 8, 10, 12, 16, 26];

function curlJson(url) {
  const out = execFileSync("curl", ["-sS", "-H", "User-Agent: Mozilla/5.0", url], {
    maxBuffer: 20 * 1024 * 1024,
  });
  return JSON.parse(out.toString());
}

function toTs(dateStr) {
  return Math.floor(new Date(dateStr + "T00:00:00Z").getTime() / 1000);
}

function addDays(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function fetchCloses(centerDate) {
  const startStr = addDays(centerDate, -10);
  const endStr = addDays(centerDate, 200);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC?period1=${toTs(startStr)}&period2=${toTs(endStr)}&interval=1d`;
  const json = curlJson(url);
  const result = json?.chart?.result?.[0];
  if (!result) return [];
  const timestamps = result.timestamp || [];
  const closes = result.indicators?.quote?.[0]?.close || [];
  return timestamps.map((t, i) => ({
    date: new Date(t * 1000).toISOString().slice(0, 10),
    close: closes[i],
  })).filter(r => r.close != null);
}

function findTroughIdx(rows, centerDate, windowDays = 10) {
  const center = new Date(centerDate + "T00:00:00Z").getTime();
  const ms = windowDays * 24 * 3600 * 1000;
  let minIdx = -1, minVal = Infinity;
  rows.forEach((r, i) => {
    const t = new Date(r.date + "T00:00:00Z").getTime();
    if (Math.abs(t - center) <= ms && r.close < minVal) {
      minVal = r.close;
      minIdx = i;
    }
  });
  return minIdx;
}

const round = (v, n) => Math.round(v * 10 ** n) / 10 ** n;

const results = [];
for (const c of CONFLICTS) {
  try {
    const rows = fetchCloses(c.approxTrough);
    if (rows.length === 0) throw new Error("no rows");
    const tIdx = findTroughIdx(rows, c.approxTrough, 10);
    if (tIdx < 0) throw new Error("trough not found");
    const trough = rows[tIdx];
    const weekly = {};
    for (const w of WEEKS) {
      const target = tIdx + w * 5;
      weekly[`w${w}`] = target < rows.length
        ? round(((rows[target].close / trough.close) - 1) * 100, 1)
        : null;
    }
    results.push({ key: c.key, troughDate: trough.date, troughClose: round(trough.close, 2), weekly });
    console.error(`[ok] ${c.key.padEnd(16)} trough ${trough.date} @ ${round(trough.close, 2)}`);
  } catch (e) {
    console.error(`[err] ${c.key}: ${e.message}`);
    results.push({ key: c.key, error: e.message });
  }
}

console.log("\n// Paste into src/data/warData.js");
console.log(`export const postTroughWeeks = [${WEEKS.join(", ")}];`);
console.log("export const postTroughReturns = {");
for (const r of results) {
  if (r.error) { console.log(`  // ${r.key}: ERROR ${r.error}`); continue; }
  const parts = WEEKS.map(w => `w${w}: ${r.weekly[`w${w}`] == null ? "null" : r.weekly[`w${w}`]}`).join(", ");
  console.log(`  ${JSON.stringify(r.key)}: { troughDate: ${JSON.stringify(r.troughDate)}, troughClose: ${r.troughClose}, ${parts} },`);
}
console.log("};");
