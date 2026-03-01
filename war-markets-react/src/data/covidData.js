// ══════════════════════════════════════════════════════════════
// COVID-19 PANDEMIC (2020) — COLLECTED DATA (NOT YET INTEGRATED)
// ══════════════════════════════════════════════════════════════
// This file contains structured data for the COVID-19 pandemic's
// financial market impact, formatted to match warData.js schema.
// Sources cited inline. Data quality: HIGH — modern electronic markets,
// comprehensive real-time data available for all major indices.
//
// KEY EVENT: WHO declared pandemic Mar 11, 2020
// MARKET PEAK: Feb 19, 2020 (S&P 500: 3,386.15)
// MARKET BOTTOM: Mar 23, 2020 (S&P 500: 2,237.40)
// ══════════════════════════════════════════════════════════════

// ── S&P 500 REACTION ─────────────────────────────────────────
// Source: Yahoo Finance ^GSPC
// Peak: 3,386.15 (Feb 19, 2020) → Bottom: 2,237.40 (Mar 23, 2020)
// Decline: 33.9% over 23 trading days
// Recovery: S&P closed above 3,386 on Aug 18, 2020 (~105 trading days from bottom)
export const covidSp500 = {
  conflict: "COVID",
  label: "COVID-19 Pandemic (2020)",
  date: "Feb 19, 2020",          // crash started day after this peak
  decline: 33.9,
  daysToBottom: 23,
  daysToRecover: 105,
};

// ── NASDAQ REACTION ──────────────────────────────────────────
// Source: Yahoo Finance ^IXIC
// Peak: ~9,817 (Feb 19, 2020) → Bottom: ~6,860 (Mar 23, 2020)
// Decline: ~30.1% over 23 trading days
// Recovery: NASDAQ hit new highs by Jun 9, 2020 (~54 trading days from bottom)
// Tech stocks benefited enormously from stay-at-home economy
export const covidNasdaq = {
  conflict: "COVID",
  label: "COVID-19 Pandemic (2020)",
  date: "Feb 19, 2020",
  decline: 30.1,
  daysToBottom: 23,
  daysToRecover: 54,
  preClose: 9817.18,
  bottomClose: 6860.67,
};

// ── PRE-EVENT BUILDUP ────────────────────────────────────────
// COVID was a slow-then-sudden surprise:
// - Dec 31, 2019: China reports mysterious pneumonia cluster in Wuhan
// - Jan 20, 2020: First US case confirmed
// - Jan 30, 2020: WHO declares "Public Health Emergency of International Concern"
// - Feb 19, 2020: S&P 500 hits ALL-TIME HIGH (markets completely ignoring COVID)
// - Feb 20, 2020: Crash begins
// Markets rose +3.1% from WHO emergency (Jan 30) to peak (Feb 19)
export const covidPreWar = {
  conflict: "COVID",
  label: "COVID-19 Pandemic (2020)",
  period: "Jan 30 – Feb 19, 2020",    // WHO emergency to market peak
  days: 15,                            // trading days
  spChange: 3.1,                       // S&P ROSE during the "buildup"
  nqChange: 5.2,                       // NASDAQ also rose (tech rally)
  surprise: true,                      // speed/severity was a complete surprise
  spStart: 3283.66,                    // S&P close Jan 30
  spEnd: 3386.15,                      // S&P close Feb 19 (ATH)
  nqStart: 9298.93,                    // NASDAQ close Jan 30
  nqEnd: 9817.18,                      // NASDAQ close Feb 19
  catalyst: "WHO PHEIC (Jan 30) → first deaths outside China → Italy outbreak (Feb 21)",
  narrative: "The most dramatic instance of markets ignoring a looming crisis. COVID was known for weeks, yet the S&P hit an all-time high on Feb 19. The crash began Feb 20 after Italy's outbreak exploded, triggering the fastest 30%+ decline in history — just 22 trading days. Three circuit breakers were triggered in March (Mar 9, 12, 16).",
};

// ── GLOBAL MARKETS ───────────────────────────────────────────
// Source: Yahoo Finance historical data for each index
// All major global indices fell 25–40% in roughly the same 4-week window
// The most synchronized global crash in history
export const covidGlobalMarkets = {
  conflict: "COVID",
  label: "COVID-19 Pandemic (2020)",
  dataQuality: "high",
  marketCapRanking: ["NYSE", "NASDAQ", "TSE", "LSE", "Euronext", "Frankfurt", "HKEX", "SSE"],
  narrative: "The most globally synchronized crash in market history. Every major index fell 25–40% within four weeks. Unlike war-driven selloffs, the trigger was a universal economic shutdown — borders closed, supply chains froze, and demand collapsed simultaneously across all economies. Three S&P 500 circuit breakers triggered in a single week (Mar 9, 12, 16). Recovery was equally remarkable: massive central bank intervention (Fed cut rates to 0%, launched unlimited QE on Mar 23 — the exact day of the bottom) and $2.2T in fiscal stimulus (CARES Act, Mar 27) powered the fastest bear-to-bull reversal ever.",
  indices: [
    // S&P 500: 3,386.15 (Feb 19) → 2,237.40 (Mar 23) = -33.9%
    { id: "S&P 500", decline: 33.9, daysToBottom: 23, daysToRecover: 105, confidence: "exact", note: null, isPositive: false, caveat: null },
    // DJIA: 29,551.42 (Feb 12) → 18,591.93 (Mar 23) = -37.1%
    { id: "DJIA", decline: 37.1, daysToBottom: 27, daysToRecover: 150, confidence: "exact", note: null, isPositive: false, caveat: "DJIA peak was Feb 12, slightly earlier than S&P" },
    // FTSE 100: 7,644.90 (Jan 17) → 4,993.89 (Mar 23) = -34.7%
    { id: "FTSE 100", decline: 34.7, daysToBottom: 46, daysToRecover: null, confidence: "exact", note: "Did not fully recover to pre-COVID levels until early 2023", isPositive: false, caveat: "UK recovery was much slower than US due to weaker fiscal response and Brexit drag" },
    // DAX: 13,789 (Feb 19) → 8,442 (Mar 18) = -38.8%
    { id: "DAX", decline: 38.8, daysToBottom: 20, daysToRecover: 170, confidence: "exact", note: null, isPositive: false, caveat: null },
    // CAC 40: 6,111 (Feb 19) → 3,755 (Mar 18) = -38.6%
    { id: "CAC 40", decline: 38.6, daysToBottom: 20, daysToRecover: 230, confidence: "exact", note: null, isPositive: false, caveat: "French economy hit hard by extended lockdowns" },
    // Nikkei 225: 23,479 (Feb 20) → 16,553 (Mar 19) = -29.5%
    { id: "Nikkei 225", decline: 29.5, daysToBottom: 19, daysToRecover: 170, confidence: "exact", note: null, isPositive: false, caveat: null },
    // Hang Seng: 29,174 (Jan 20) → 21,696 (Mar 23) = -25.6%
    { id: "Hang Seng", decline: 25.6, daysToBottom: 43, daysToRecover: null, confidence: "exact", note: "Still well below Jan 2020 levels years later", isPositive: false, caveat: "Pre-existing drag from 2019 Hong Kong protests + China tech crackdown prevented recovery" },
  ],
};

// ── CPI DATA ─────────────────────────────────────────────────
// Source: FRED CPIAUCSL (YoY annual average)
// COVID's inflation story is delayed — the real spike hit in 2021–2022
// due to supply chain disruption + massive fiscal/monetary stimulus
export const covidCpi = {
  conflict: "COVID",
  label: "COVID-19 (2020)",
  startYear: 2020,
  series: [
    { t: -2, year: 2018, value: 2.4 },
    { t: -1, year: 2019, value: 1.8 },
    { t: 0,  year: 2020, value: 1.2 },   // pandemic year — demand collapse
    { t: 1,  year: 2021, value: 4.7 },   // inflation begins
    { t: 2,  year: 2022, value: 8.0 },   // 40-year high
    { t: 3,  year: 2023, value: 4.1 },   // cooling begins
    { t: 4,  year: 2024, value: 2.9 },   // still above target
    { t: 5,  year: 2025, value: 2.8 },   // approx (latest data)
    // T+6 through T+10 (2026–2030) not yet available
    // Placeholder estimates based on Fed projections:
    { t: 6,  year: 2026, value: 2.4 },   // est.
    { t: 7,  year: 2027, value: 2.2 },   // est.
    { t: 8,  year: 2028, value: 2.1 },   // est.
    { t: 9,  year: 2029, value: 2.0 },   // est.
    { t: 10, year: 2030, value: 2.0 },   // est.
  ],
};

// ── DEBT/GDP DATA ────────────────────────────────────────────
// Source: FRED GFDGDPA188S (Gross Federal Debt as % of GDP, annual)
// COVID triggered the largest single-year debt spike since WWII
export const covidDebtGdp = {
  conflict: "COVID",
  label: "COVID-19 (2020)",
  startYear: 2020,
  series: [
    { t: -2, year: 2018, value: 104.0 },
    { t: -1, year: 2019, value: 106.8 },
    { t: 0,  year: 2020, value: 128.1 },  // massive COVID spending ($5T+)
    { t: 1,  year: 2021, value: 124.0 },  // GDP recovery brought ratio down
    { t: 2,  year: 2022, value: 119.7 },
    { t: 3,  year: 2023, value: 120.0 },
    { t: 4,  year: 2024, value: 122.3 },  // rising again
    { t: 5,  year: 2025, value: 124.0 },  // est.
    // T+6 through T+10 not yet available, estimates:
    { t: 6,  year: 2026, value: 126.0 },  // est.
    { t: 7,  year: 2027, value: 128.0 },  // est.
    { t: 8,  year: 2028, value: 130.0 },  // est.
    { t: 9,  year: 2029, value: 132.0 },  // est.
    { t: 10, year: 2030, value: 134.0 },  // est. (CBO projections)
  ],
};

// ── FISCAL SUMMARY ───────────────────────────────────────────
export const covidFiscalSummary = {
  conflict: "COVID",
  peakCpi: 8.0,
  debtGdpDelta: 21.3,   // from 106.8 (2019) to 128.1 (2020) in one year
  narrative: "COVID triggered the largest single-year debt spike since WWII — debt/GDP jumped 21 points in 2020 alone as the government spent over $5 trillion on pandemic relief (CARES Act, PPP, enhanced unemployment, stimulus checks). Inflation was initially suppressed by demand collapse (1.2% in 2020), but exploded to 8.0% by 2022 — the highest since 1981 — driven by supply chain disruptions, labor shortages, and the lagged effect of massive monetary expansion. The Fed's response (rate hikes from 0% to 5.5%) was the most aggressive tightening cycle since Volcker.",
};

// ── COST OF LIVING DATA ──────────────────────────────────────
// Source: FRED MSPUS (home), BLS CPI avg prices (food, gas), NCES (tuition),
//         FRED MEHOINUSA672N (income), KBB/Edmunds (car)
// All "adjusted" values in 2024 USD using CPI-U multiplier ≈ 1.21
export const covidCostOfLiving = {
  era: "COVID",
  year: 2020,
  cpiMultiplier: 1.21,
  items: {
    home:    { nominal: 329000,  adjusted: 398090 },
    car:     { nominal: 37876,   adjusted: 45830 },
    tuition: { nominal: 10560,   adjusted: 12778 },
    income:  { nominal: 67521,   adjusted: 81700 },
    milk:    { nominal: 3.54,    adjusted: 4.28 },
    eggs:    { nominal: 1.48,    adjusted: 1.79 },
    gas:     { nominal: 2.17,    adjusted: 2.63 },   // historically low — demand collapse
    bread:   { nominal: 1.44,    adjusted: 1.74 },
  },
};

// ── TOTAL DEBT ADDITIONS ─────────────────────────────────────
// These entries would be added to totalDebtData in warData.js
// Source: FRED GFDEBTN (nominal USD, billions)
export const covidDebtTimeline = [
  // 2020 entry already exists in warData.js: { year: 2020, debt: 27747.78 }
  // Additional context entries:
  { year: 2021, debt: 28428.92 },
  { year: 2023, debt: 33167.00 },
  { year: 2025, debt: 36200.00 },  // approx
];

// ── CONFLICT MARKER ──────────────────────────────────────────
export const covidMarker = { year: 2020, label: "COVID" };

// ── NOTES ────────────────────────────────────────────────────
// Key differences from war-driven market events:
// 1. SPEED: Fastest 30%+ decline in S&P history (22 trading days vs months for wars)
// 2. RECOVERY: Fastest recovery — Fed/fiscal bazooka created a V-shaped rebound
// 3. DIVERGENCE: Tech (NASDAQ) recovered in 54 days; value/international took years
// 4. INFLATION LAG: Unlike wars where inflation is immediate, COVID inflation
//    peaked 2 YEARS after the event (2022) due to supply chain + stimulus lag
// 5. DEBT SPIKE: Single-year debt jump (+21 pts) was largest since WWII
// 6. NOT A WAR: This is a pandemic, not a military conflict — different category
//    but equally relevant for "crisis impact on markets" analysis
