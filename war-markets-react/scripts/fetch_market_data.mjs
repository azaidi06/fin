#!/usr/bin/env node
/**
 * Fetch current market data → public/market-data.json
 * Zero dependencies — Node.js built-ins only.
 *
 * Sources (by asset type):
 *   1. Alpha Vantage (stocks + gold) — TIME_SERIES_DAILY for 1d + 7d changes
 *   2. Google Finance (indices) — scrapes price + previous close for 1d change
 *   3. Yahoo Finance (fallback for anything AV/Google miss)
 *   4. CoinGecko (crypto) — 24h + 7d changes
 *
 * Requires: ALPHAVANTAGE_API_KEY environment variable (premium key)
 *
 * Usage:
 *   node scripts/fetch_market_data.mjs
 */

import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, "..", "public", "market-data.json");

const AV_KEY = process.env.ALPHAVANTAGE_API_KEY;
if (!AV_KEY) console.warn("  WARN: ALPHAVANTAGE_API_KEY not set — stocks will fall back to Yahoo/Google");

// ── Config ────────────────────────────────────────────────

// av: Alpha Vantage symbol (null = not supported, use Google/Yahoo)
const STOCK_TICKERS = [
  { av: null,   yahoo: "^GSPC", google: ".INX:INDEXSP",      symbol: "S&P",  name: "S&P 500" },
  { av: null,   yahoo: "^IXIC", google: ".IXIC:INDEXNASDAQ", symbol: "NDX",  name: "NASDAQ" },
  { av: null,   yahoo: "^DJI",  google: ".DJI:INDEXDJX",     symbol: "DJI",  name: "DOW 30" },
  { av: "GLD",  yahoo: "GC=F",  google: "GLD:NYSEARCA",      symbol: "GOLD", name: "Gold (GLD)" },
  { av: "NVDA", yahoo: "NVDA",  google: "NVDA:NASDAQ",       symbol: "NVDA", name: "NVIDIA" },
  { av: "AAPL", yahoo: "AAPL",  google: "AAPL:NASDAQ",       symbol: "AAPL", name: "Apple" },
  { av: "MSFT", yahoo: "MSFT",  google: "MSFT:NASDAQ",       symbol: "MSFT", name: "Microsoft" },
  { av: "AMZN", yahoo: "AMZN",  google: "AMZN:NASDAQ",       symbol: "AMZN", name: "Amazon" },
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

// ── Alpha Vantage ─────────────────────────────────────────

async function fetchAlphaVantage(tickers) {
  const avTickers = tickers.filter((t) => t.av);
  if (avTickers.length === 0 || !AV_KEY) return [];

  console.log(`  [AlphaVantage] Fetching ${avTickers.length} stocks...`);
  const assets = [];

  for (const t of avTickers) {
    try {
      await sleep(850); // ~70 req/min, well under premium 75/min
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${t.av}&outputsize=compact&apikey=${AV_KEY}`;
      const res = await httpsGet(url);
      if (res.status !== 200) throw new Error(`HTTP ${res.status}`);

      const data = JSON.parse(res.body);

      // Check for API errors
      if (data["Error Message"]) throw new Error(data["Error Message"]);
      if (data["Note"]) throw new Error("Rate limited");
      if (data["Information"]) throw new Error(data["Information"]);

      const series = data["Time Series (Daily)"];
      if (!series) throw new Error("No time series data");

      // Get sorted dates (most recent first)
      const dates = Object.keys(series).sort().reverse();
      if (dates.length < 2) throw new Error("Not enough data points");

      const latest = series[dates[0]];
      const prev = series[dates[1]];
      const price = parseFloat(latest["4. close"]);
      const prevClose = parseFloat(prev["4. close"]);
      const change1d = ((price - prevClose) / prevClose) * 100;

      // 7-day change: ~5 trading days back
      const weekIdx = Math.min(5, dates.length - 1);
      const weekClose = parseFloat(series[dates[weekIdx]]["4. close"]);
      const change7d = ((price - weekClose) / weekClose) * 100;

      assets.push({
        symbol: t.symbol, name: t.name,
        price: Math.round(price * 100) / 100,
        change1d: Math.round(change1d * 100) / 100,
        change7d: Math.round(change7d * 100) / 100,
      });
      log(t.symbol, price, change1d, "1d", change7d, "7d");
    } catch (e) {
      console.log(`  [AlphaVantage] ${t.symbol} failed: ${e.message}`);
    }
  }

  return assets;
}

// ── Google Finance (indices) ──────────────────────────────

async function fetchGoogleIndices(tickers) {
  const indexTickers = tickers.filter((t) => !t.av);
  if (indexTickers.length === 0) return [];

  console.log(`  [Google] Fetching ${indexTickers.length} indices...`);
  const assets = [];

  for (const t of indexTickers) {
    try {
      await sleep(200);
      const res = await httpsGet(`https://www.google.com/finance/quote/${t.google}`);
      if (res.status !== 200) throw new Error(`HTTP ${res.status}`);

      const price = parseFloat(res.body.match(/data-last-price="([^"]+)"/)?.[1]);
      if (!price || isNaN(price)) throw new Error("no price found");

      // Extract "Previous close" from the details table
      const prevMatch = res.body.match(/Previous close[\s\S]*?P6K39c[^>]*>([\d,]+\.?\d*)/);
      const prevClose = prevMatch ? parseFloat(prevMatch[1].replace(/,/g, "")) : null;
      const change1d = prevClose ? ((price - prevClose) / prevClose) * 100 : 0;

      assets.push({
        symbol: t.symbol, name: t.name,
        price: Math.round(price * 100) / 100,
        change1d: Math.round(change1d * 100) / 100,
        change7d: 0, // Google doesn't provide weekly change for indices
      });
      log(t.symbol, price, change1d, "1d");
    } catch (e) {
      console.log(`  [Google] ${t.symbol} failed: ${e.message}`);
    }
  }

  return assets;
}

// ── Yahoo Finance (fallback) ──────────────────────────────

async function fetchYahooFallback(tickers) {
  if (tickers.length === 0) return [];

  let cookies, crumb;
  try {
    console.log(`  [Yahoo] Authenticating for ${tickers.length} missing ticker(s)...`);
    const c1 = await httpsGet("https://fc.yahoo.com/");
    cookies = c1.cookies;
    const c2 = await httpsGet("https://query2.finance.yahoo.com/v1/test/getcrumb", { Cookie: cookies });
    if (c2.status !== 200) throw new Error(`crumb ${c2.status}`);
    crumb = c2.body.trim();
  } catch (e) {
    console.log(`  [Yahoo] Auth failed: ${e.message}`);
    return [];
  }

  const assets = [];
  for (const t of tickers) {
    try {
      await sleep(300);
      const encoded = encodeURIComponent(t.yahoo);
      const res = await httpsGet(
        `https://query2.finance.yahoo.com/v8/finance/chart/${encoded}?range=1mo&interval=1d&crumb=${encodeURIComponent(crumb)}`,
        { Cookie: cookies }
      );
      if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
      const data = JSON.parse(res.body);
      const result = data.chart.result[0];
      const closes = (result.indicators.quote[0].close || []).filter((c) => c != null);
      const price = result.meta.regularMarketPrice || closes[closes.length - 1];
      const prevClose = closes.length >= 2 ? closes[closes.length - 2] : price;
      const change1d = ((price - prevClose) / prevClose) * 100;
      const weekIdx = Math.max(0, closes.length - 6);
      const weekClose = closes[weekIdx];
      const change7d = ((price - weekClose) / weekClose) * 100;
      assets.push({
        symbol: t.symbol, name: t.name,
        price: Math.round(price * 100) / 100,
        change1d: Math.round(change1d * 100) / 100,
        change7d: Math.round(change7d * 100) / 100,
      });
      log(t.symbol, price, change1d, "1d", change7d, "7d");
    } catch (e) {
      console.log(`  [Yahoo] ${t.symbol} failed: ${e.message}`);
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
      log(meta.symbol, c.current_price, change1d, "1d", change7d, "7d");
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

function log(sym, price, change1, label1, change2, label2) {
  const fmt = (v) => `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
  const priceStr = price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  let info = `${fmt(change1)} (${label1})`;
  if (change2 !== undefined) info += `  ${fmt(change2)} (${label2})`;
  console.log(`  OK  ${sym.padStart(5)}  $${priceStr.padStart(12)}  ${info}`);
}

// ── Main ──────────────────────────────────────────────────

async function main() {
  const ts = new Date().toLocaleString();
  console.log(`\n[${ts}] Fetching market data...`);

  // 1. Alpha Vantage for stocks (NVDA, AAPL, MSFT, AMZN, GLD)
  // 2. Google Finance for indices (S&P, NASDAQ, DOW)
  // 3. Both run conceptually in parallel categories
  const [avAssets, googleAssets] = await Promise.all([
    fetchAlphaVantage(STOCK_TICKERS),
    fetchGoogleIndices(STOCK_TICKERS),
  ]);

  // Collect which symbols we got
  const gotSymbols = new Set([...avAssets, ...googleAssets].map((a) => a.symbol));

  // 4. Yahoo fallback for any tickers that failed above
  const missing = STOCK_TICKERS.filter((t) => !gotSymbols.has(t.symbol));
  const yahooAssets = await fetchYahooFallback(missing);

  // 5. CoinGecko for crypto
  const cryptoAssets = await fetchCrypto();

  // Merge in display order (indices → stocks → crypto)
  const allStocks = [...googleAssets, ...avAssets, ...yahooAssets];
  // Sort to match original STOCK_TICKERS order
  const symbolOrder = STOCK_TICKERS.map((t) => t.symbol);
  allStocks.sort((a, b) => symbolOrder.indexOf(a.symbol) - symbolOrder.indexOf(b.symbol));

  const assets = [...allStocks, ...cryptoAssets];
  const sources = [];
  if (avAssets.length > 0) sources.push(`AV:${avAssets.length}`);
  if (googleAssets.length > 0) sources.push(`Google:${googleAssets.length}`);
  if (yahooAssets.length > 0) sources.push(`Yahoo:${yahooAssets.length}`);
  if (cryptoAssets.length > 0) sources.push(`CoinGecko:${cryptoAssets.length}`);

  console.log(`\nGot ${assets.length}/${STOCK_TICKERS.length + CRYPTO_TICKERS.length} tickers (${sources.join(", ")})`);

  const payload = {
    updatedAt: new Date().toISOString(),
    source: sources.join("+"),
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
