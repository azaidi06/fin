#!/usr/bin/env node
/**
 * Fetch current market data → public/market-data.json
 * Zero dependencies — Node.js built-ins only.
 *
 * Sources (in priority order):
 *   1. Yahoo Finance (stocks + indices) — proper 5-day change, needs cookie+crumb
 *   2. Google Finance (fallback) — current price + daily change
 *   3. CoinGecko (crypto) — current price + 7-day change
 *
 * Usage:
 *   node scripts/fetch_market_data.mjs
 *
 * Cron (every 15 min):
 *   0,15,30,45 * * * * cd /path/to/war-markets-react && node scripts/fetch_market_data.mjs >> /tmp/market-fetch.log 2>&1
 */

import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, "..", "public", "market-data.json");

// ── Config ────────────────────────────────────────────────

const STOCK_TICKERS = [
  { yahoo: "^GSPC",  google: ".INX:INDEXSP",       symbol: "S&P",  name: "S&P 500" },
  { yahoo: "^IXIC",  google: ".IXIC:INDEXNASDAQ",  symbol: "NDX",  name: "NASDAQ" },
  { yahoo: "^DJI",   google: ".DJI:INDEXDJX",      symbol: "DJI",  name: "DOW 30" },
  { yahoo: "GC=F",   google: "GLD:NYSEARCA",        symbol: "GOLD", name: "Gold (GLD)" },
  { yahoo: "NVDA",   google: "NVDA:NASDAQ",         symbol: "NVDA", name: "NVIDIA" },
  { yahoo: "AAPL",   google: "AAPL:NASDAQ",         symbol: "AAPL", name: "Apple" },
  { yahoo: "MSFT",   google: "MSFT:NASDAQ",         symbol: "MSFT", name: "Microsoft" },
  { yahoo: "AMZN",   google: "AMZN:NASDAQ",         symbol: "AMZN", name: "Amazon" },
];

const CRYPTO_TICKERS = [
  { id: "bitcoin",  symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "solana",   symbol: "SOL", name: "Solana" },
];

// ── HTTP helper ───────────────────────────────────────────

function httpsGet(urlOrOpts, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const parsed = typeof urlOrOpts === "string" ? new URL(urlOrOpts) : null;
    const opts = parsed
      ? { hostname: parsed.hostname, path: parsed.pathname + parsed.search, headers: {} }
      : urlOrOpts;

    opts.headers = {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "Accept": "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      ...extraHeaders,
      ...(opts.headers || {}),
    };

    https.get(opts, (res) => {
      const cookies = (res.headers["set-cookie"] || []).map((c) => c.split(";")[0]).join("; ");
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => resolve({ status: res.statusCode, body, cookies }));
    }).on("error", reject);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Yahoo Finance ─────────────────────────────────────────

async function tryYahoo() {
  const assets = [];

  // Auth: cookie + crumb
  let cookies, crumb;
  try {
    console.log("  [Yahoo] Authenticating...");
    const c1 = await httpsGet("https://fc.yahoo.com/");
    cookies = c1.cookies;
    const c2 = await httpsGet("https://query2.finance.yahoo.com/v1/test/getcrumb", { Cookie: cookies });
    if (c2.status !== 200) throw new Error(`crumb ${c2.status}`);
    crumb = c2.body.trim();
    console.log(`  [Yahoo] Got crumb`);
  } catch (e) {
    console.log(`  [Yahoo] Auth failed: ${e.message}`);
    return null; // signal to use fallback
  }

  for (const t of STOCK_TICKERS) {
    try {
      await sleep(300);
      const encoded = encodeURIComponent(t.yahoo);
      const res = await httpsGet(
        `https://query2.finance.yahoo.com/v8/finance/chart/${encoded}?range=5d&interval=1d&crumb=${encodeURIComponent(crumb)}`,
        { Cookie: cookies }
      );
      if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
      const data = JSON.parse(res.body);
      const result = data.chart.result[0];
      const closes = (result.indicators.quote[0].close || []).filter((c) => c != null);
      const price = result.meta.regularMarketPrice || closes[closes.length - 1];
      const weekStart = closes[0];
      const change7d = ((price - weekStart) / weekStart) * 100;
      const prevClose = closes.length >= 2 ? closes[closes.length - 2] : weekStart;
      const change1d = ((price - prevClose) / prevClose) * 100;
      assets.push({
        symbol: t.symbol, name: t.name,
        price: Math.round(price * 100) / 100,
        change1d: Math.round(change1d * 100) / 100,
        change7d: Math.round(change7d * 100) / 100,
      });
      log(t.symbol, price, change7d, "5d");
    } catch (e) {
      console.log(`  [Yahoo] ${t.symbol} failed: ${e.message}`);
    }
  }

  return assets.length > 0 ? assets : null;
}

// ── Google Finance (fallback) ─────────────────────────────

async function tryGoogle() {
  console.log("  [Google] Fetching stock prices...");
  const assets = [];

  for (const t of STOCK_TICKERS) {
    try {
      await sleep(200);
      const res = await httpsGet(`https://www.google.com/finance/quote/${t.google}`);
      if (res.status !== 200) throw new Error(`HTTP ${res.status}`);

      const price = parseFloat(res.body.match(/data-last-price="([^"]+)"/)?.[1]);
      if (!price || isNaN(price)) throw new Error("no price found");

      // Extract daily percent change (shown near the price)
      const pctMatch = res.body.match(/data-last-price[^>]*>[\s\S]{0,2000}?([-+]?[\d.]+)%/);
      const dailyPct = pctMatch ? parseFloat(pctMatch[1]) : 0;
      // Check if negative by looking for context
      const signCtx = res.body.match(/data-last-price[\s\S]{0,3000}?(?:Down|down|decrease)[\s\S]{0,200}?([\d.]+)%/);
      const change = signCtx ? -Math.abs(dailyPct) : dailyPct;

      assets.push({
        symbol: t.symbol, name: t.name,
        price: Math.round(price * 100) / 100,
        change1d: Math.round(change * 100) / 100,
        change7d: Math.round(change * 100) / 100,
      });
      log(t.symbol, price, change, "1d");
    } catch (e) {
      console.log(`  [Google] ${t.symbol} failed: ${e.message}`);
    }
  }

  return assets;
}

// ── CoinGecko ─────────────────────────────────────────────

async function fetchCrypto() {
  console.log("  [CoinGecko] Fetching crypto...");
  try {
    const ids = CRYPTO_TICKERS.map((c) => c.id).join(",");
    const res = await httpsGet(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h,7d&sparkline=false`,
      { "User-Agent": "war-markets-app/1.0" }
    );
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);

    const coins = JSON.parse(res.body);
    const idMap = Object.fromEntries(CRYPTO_TICKERS.map((c) => [c.id, c]));

    return coins.map((c) => {
      const meta = idMap[c.id];
      const change1d = c.price_change_percentage_24h_in_currency || c.price_change_percentage_24h || 0;
      const change7d = c.price_change_percentage_7d_in_currency || 0;
      log(meta.symbol, c.current_price, change7d, "7d");
      return {
        symbol: meta.symbol, name: meta.name,
        price: Math.round(c.current_price * 100) / 100,
        change1d: Math.round(change1d * 100) / 100,
        change7d: Math.round(change7d * 100) / 100,
      };
    });
  } catch (e) {
    console.log(`  [CoinGecko] Failed: ${e.message}`);
    return [];
  }
}

// ── Helpers ───────────────────────────────────────────────

function log(sym, price, change, period) {
  const sign = change >= 0 ? "+" : "";
  const priceStr = price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  console.log(`  OK  ${sym.padStart(5)}  $${priceStr.padStart(12)}  ${sign}${change.toFixed(2)}% (${period})`);
}

// ── Main ──────────────────────────────────────────────────

async function main() {
  const ts = new Date().toLocaleString();
  console.log(`\n[${ts}] Fetching market data...`);

  // Try Yahoo first (best data), fall back to Google
  let stocks = await tryYahoo();
  let source = "yahoo";
  if (!stocks) {
    stocks = await tryGoogle();
    source = "google";
  }

  const crypto = await fetchCrypto();
  const assets = [...stocks, ...crypto];

  console.log(`\nGot ${assets.length}/${STOCK_TICKERS.length + CRYPTO_TICKERS.length} tickers (stocks via ${source})`);

  const payload = {
    updatedAt: new Date().toISOString(),
    source,
    assets,
  };

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2) + "\n");
  console.log(`Wrote ${OUT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
