// ══════════════════════════════════════════════════════════════
// IRAN WAR (2026) — COLLECTED DATA (NOT YET INTEGRATED)
// ══════════════════════════════════════════════════════════════
// This file contains structured data for the US-Iran conflict,
// formatted to match warData.js schema.
// Data quality: VERY LOW — conflict literally began TODAY (Feb 28, 2026).
// Most fields are preliminary day-1 reactions or TBD.
//
// KEY EVENT: US & Israel launch strikes on Iran (Feb 28, 2026)
// STATUS: ACTIVE / DEVELOPING — all data subject to change
// ══════════════════════════════════════════════════════════════

// ── S&P 500 REACTION ─────────────────────────────────────────
// Source: Yahoo Finance ^GSPC, CNBC (Feb 28, 2026)
// Day-1 reaction only — final decline/recovery TBD
// S&P 500 fell 0.43% on the day of strikes
// Futures down an additional 622 pts (Dow) after close
export const iranSp500 = {
  conflict: "Iran",
  label: "Iran War (2026)",
  date: "Feb 28, 2026",
  decline: null,            // TBD — only day-1 data available
  daysToBottom: null,       // TBD
  daysToRecover: null,      // TBD
  // Day-1 snapshot:
  _day1SpChange: -0.43,     // S&P 500 intraday decline
  _day1DjiaChange: -1.3,    // DJIA dropped 521 pts
  _day1NasdaqChange: -0.92, // NASDAQ decline
};

// ── NASDAQ REACTION ──────────────────────────────────────────
// Source: Yahoo Finance ^IXIC, CNBC
// NASDAQ was already down 3% YTD before strikes
export const iranNasdaq = {
  conflict: "Iran",
  label: "Iran War (2026)",
  date: "Feb 28, 2026",
  decline: null,             // TBD
  daysToBottom: null,        // TBD
  daysToRecover: null,       // TBD
  preClose: null,            // TBD — need pre-strike close
  bottomClose: null,         // TBD
  _day1Change: -0.92,
};

// ── PRE-WAR BUILDUP ──────────────────────────────────────────
// The Iran buildup is well-documented with a clear escalation timeline:
//
// TIMELINE:
// Late Dec 2025: Massive nationwide protests erupt in Iran (largest since 1979)
// Jan 25, 2026:  USS Abraham Lincoln carrier group deployed to Gulf
// Jan 28, 2026:  Trump declares "massive Armada heading to Iran"
// Feb 3, 2026:   IRGC gunboats attempt to seize US tanker in Strait of Hormuz
// Feb 19, 2026:  Reports: US could launch strikes "within days"
// Feb 21, 2026:  Warships, tankers, submarines positioned for potential strikes
// Feb 28, 2026:  US & Israel conduct strikes on Iranian targets in Tehran
//
// Market behavior during buildup:
// - S&P 500 YTD through Feb 27: +0.7% (remarkably flat)
// - NASDAQ YTD through Feb 27: -3.0% (tech underperforming)
// - Energy sector: +22% YTD (massive outperformance on oil fears)
// - Defense stocks (LMT, BA, RTX): rallying on elevated budgets
//
// Source: CNBC, Seeking Alpha, Wespath market summary (Feb 20, 2026)
export const iranPreWar = {
  conflict: "Iran",
  label: "Iran War (2026)",
  period: "Jan 28 – Feb 27, 2026",    // Trump "armada" to day before strikes
  days: 22,                            // ~22 trading days
  spChange: 0.7,                       // S&P roughly flat during buildup (YTD proxy)
  nqChange: -3.0,                      // NASDAQ down (tech rotation)
  surprise: false,                     // buildup was highly telegraphed
  spStart: null,                       // exact level TBD
  spEnd: null,                         // exact level TBD
  nqStart: null,
  nqEnd: null,
  catalyst: "Trump 'armada' announcement (Jan 28) → IRGC Hormuz incident (Feb 3) → strike warnings (Feb 19)",
  narrative: "Unlike most conflicts in this dataset, the Iran buildup was heavily telegraphed. Trump publicly announced naval deployments, issued ultimatums, and set deadlines. Markets showed a dramatic sector rotation rather than a broad decline — energy stocks surged 22% YTD while tech fell 3%. The S&P's flat performance masked violent internal rotation between war-beneficiary and war-casualty sectors. Oil prices rose above $72/bbl and gold hit record levels near $5,000/oz.",
};

// ── GLOBAL MARKETS ───────────────────────────────────────────
// Source: CNBC, Seeking Alpha (Feb 28, 2026)
// Only day-1 reactions available — all indices TBD
// Analysts expected 1-2%+ global decline on Monday (Mar 2) open
export const iranGlobalMarkets = {
  conflict: "Iran",
  label: "Iran War (2026)",
  dataQuality: "minimal",   // literally day 1
  marketCapRanking: ["NYSE", "NASDAQ", "TSE", "LSE", "Euronext", "Frankfurt", "HKEX"],
  narrative: "The conflict began on a Friday (Feb 28), limiting initial market reaction to the final trading hours. S&P fell 0.43%, DJIA dropped 521 pts (-1.3%), and NASDAQ slid 0.92%. Futures indicated further selling (Dow futures -622 pts after close). Analysts broadly expected 'rough and risk-off' opens across global markets on Monday. Asian markets (especially those reliant on Middle Eastern oil via Strait of Hormuz) expected to be hardest hit. Iran retaliated with missile strikes across the region (Israel, Bahrain, Saudi Arabia, Qatar, UAE, Iraq), dramatically expanding the conflict's scope.",
  indices: [
    // All preliminary day-1 data only
    { id: "S&P 500", decline: 0.43, daysToBottom: null, daysToRecover: null, confidence: "exact", note: "Day-1 only; futures indicate further decline Mon", isPositive: false, caveat: "Incomplete — conflict just began" },
    { id: "DJIA", decline: 1.3, daysToBottom: null, daysToRecover: null, confidence: "exact", note: "Dropped 521 pts; futures down additional 622 pts", isPositive: false, caveat: "Incomplete — conflict just began" },
    // Other indices did not yet have a trading session after strikes
    // Monday Mar 2 data will be critical
  ],
};

// ── COMMODITY & SAFE HAVEN DATA ──────────────────────────────
// This is unique to the Iran conflict — oil/gold are central to the story
// Source: CNN Business, Seeking Alpha, CNBC
export const iranCommodities = {
  oil: {
    priceBeforeStrikes: 72,          // WTI crude $/barrel (approx)
    direction: "surging",
    straitOfHormuzRisk: "high",      // Iran controls chokepoint for 20% of global oil
    narrative: "Iran is the 4th-largest OPEC producer. The Strait of Hormuz handles ~20% of global oil trade. Iran retaliated with strikes across the Gulf region, raising fears of supply disruption. Oil could spike above $100 if Hormuz is disrupted.",
  },
  gold: {
    februaryGain: 11,               // +11% in February alone
    level: "approaching $5,000/oz", // near all-time record
    narrative: "Classic risk-off safe haven buying. Gold surged 11% in February as tensions escalated, approaching $5,000/oz.",
  },
  sectors: {
    winners: ["Energy (+22% YTD)", "Defense/Aerospace (LMT, BA, RTX)", "Gold miners"],
    losers: ["Tech (-3% YTD)", "Airlines", "Consumer discretionary"],
  },
};

// ── CPI DATA ─────────────────────────────────────────────────
// Source: FRED CPIAUCSL, BLS
// Very limited — only T-2 through T=0 available, and T=0 is barely started
export const iranCpi = {
  conflict: "Iran",
  label: "Iran War (2026)",
  startYear: 2026,
  series: [
    { t: -2, year: 2024, value: 2.9 },
    { t: -1, year: 2025, value: 2.8 },   // approx (latest available)
    { t: 0,  year: 2026, value: 2.4 },   // Jan 2026 reading (only 1 month)
    // T+1 through T+10 (2027–2036): not available
    // If oil spikes significantly, expect CPI to rise
    // Analyst estimates suggest 3.5–5.0% if conflict is prolonged
  ],
};

// ── DEBT/GDP DATA ────────────────────────────────────────────
// Source: FRED GFDGDPA188S
// Only pre-conflict baseline available
export const iranDebtGdp = {
  conflict: "Iran",
  label: "Iran War (2026)",
  startYear: 2026,
  series: [
    { t: -2, year: 2024, value: 122.3 },
    { t: -1, year: 2025, value: 124.0 },  // est.
    { t: 0,  year: 2026, value: null },    // TBD — war spending not yet budgeted
    // If conflict is sustained, expect significant increase
    // Iraq/Afghanistan cost ~$8T total over 20 years
  ],
};

// ── FISCAL SUMMARY ───────────────────────────────────────────
export const iranFiscalSummary = {
  conflict: "Iran",
  peakCpi: null,           // TBD
  debtGdpDelta: null,      // TBD
  narrative: "Too early to assess. The fiscal impact will depend entirely on conflict duration and scope. Key variables: (1) oil price trajectory — if Strait of Hormuz is disrupted, energy-driven inflation could push CPI to 4–5%+; (2) defense spending escalation; (3) whether the conflict triggers a recession. For context, the Iraq/Afghanistan wars cost an estimated $8 trillion over two decades. The US enters this conflict with debt/GDP already at ~124%, far higher than the 55% at the start of the Iraq War.",
};

// ── COST OF LIVING DATA ──────────────────────────────────────
// Source: BLS CPI avg prices, FRED MSPUS, NCES, KBB
// 2026 prices (pre-conflict baseline, early 2026)
// CPI multiplier: ~0.95 (to convert 2026 → 2024 dollars)
export const iranCostOfLiving = {
  era: "Iran",
  year: 2026,
  cpiMultiplier: 0.95,
  items: {
    home:    { nominal: 430000,  adjusted: 408500 },
    car:     { nominal: 49500,   adjusted: 47025 },
    tuition: { nominal: 11800,   adjusted: 11210 },
    income:  { nominal: 87000,   adjusted: 82650 },
    milk:    { nominal: 4.40,    adjusted: 4.18 },
    eggs:    { nominal: 4.50,    adjusted: 4.28 },   // egg prices remain elevated
    gas:     { nominal: 3.40,    adjusted: 3.23 },   // pre-conflict; expect spike
    bread:   { nominal: 2.15,    adjusted: 2.04 },
  },
};

// ── TOTAL DEBT ADDITIONS ─────────────────────────────────────
// Source: FRED GFDEBTN (nominal USD, billions)
export const iranDebtTimeline = [
  { year: 2025, debt: 36200.00 },   // approx
  { year: 2026, debt: 37500.00 },   // est. — will rise if war spending materializes
];

// ── CONFLICT MARKER ──────────────────────────────────────────
export const iranMarker = { year: 2026, label: "Iran" };

// ── KEY UNKNOWNS & DATA GAPS ─────────────────────────────────
// As of Feb 28, 2026 (day 1 of conflict):
//
// 1. SCOPE: Is this a limited strike campaign or a full-scale war?
//    Iran has already retaliated with strikes across the Gulf region.
//
// 2. STRAIT OF HORMUZ: If disrupted, oil could spike to $100+/bbl,
//    triggering global recession fears. This is the single biggest
//    market risk variable.
//
// 3. MARKET DATA: We only have Friday afternoon's reaction.
//    Monday Mar 2 will be the first full global trading day.
//    Asian markets (Japan, Hong Kong, South Korea) especially
//    vulnerable due to oil import dependence.
//
// 4. DURATION: Every data field (decline, daysToBottom, daysToRecover)
//    is TBD until the conflict arc becomes clear.
//
// 5. FISCAL: War costs, CPI impact, and debt trajectory all depend
//    on duration and escalation level.
//
// RECOMMENDATION: Revisit and update this file weekly as data emerges.
// The first meaningful update should be after Mar 2 (Monday) trading.
