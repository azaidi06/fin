// ══════════════════════════════════════════════════════════════
// IRAN WAR (2026) — INTEGRATED (short-horizon only)
// ══════════════════════════════════════════════════════════════
// Status: data through April 15, 2026. Shooting war began Feb 28,
// ceasefire agreed Apr 8 (Pakistan-mediated, two-week term, expires
// Apr 21). Markets fully recovered to new ATHs by Apr 15 despite
// ongoing US naval blockade of the Strait of Hormuz (effective Apr 13).
//
// Integration scope: reaction, buildup, and global-markets arrays
// in warData.js. Long-horizon series (CPI, debt/GDP, fiscal summary,
// cost of living, wealth) are intentionally NOT wired up — the data
// is too young to be meaningful on those horizons.
// ══════════════════════════════════════════════════════════════

// ── S&P 500 REACTION ─────────────────────────────────────────
// Pre-war close: Feb 27, 2026 = 6,878.88
// Trough close:   Mar 30, 2026 = 6,316.91 (−8.17%)
// New ATH:        Apr 15, 2026 = 7,022.95
// Sources: Yahoo Finance ^GSPC, CNBC, NBC News, Motley Fool
export const iranSp500 = {
  conflict: "Iran",
  label: "Iran War (2026)",
  date: "Feb 28, 2026",
  decline: 8.2,
  daysToBottom: 21,     // trading days Feb 27 close → Mar 30 close
  daysToRecover: 32,    // trading days to return above pre-war close (~Apr 14)
  preClose: 6878.88,
  bottomClose: 6316.91,
};

// ── NASDAQ REACTION ──────────────────────────────────────────
// Mar 30, 2026 close: 20,948.36 (-2.2% on the day, 5th weekly decline)
// Pre-war close estimated from −3% YTD through Feb 27 context
// Sources: Yahoo Finance ^IXIC, CNBC
export const iranNasdaq = {
  conflict: "Iran",
  label: "Iran War (2026)",
  date: "Feb 28, 2026",
  decline: 8.1,         // approx peak-to-trough from Feb 27 close
  daysToBottom: 21,
  daysToRecover: 32,
  preClose: 22800,      // estimated
  bottomClose: 20948.36,
};

// ── PRE-WAR BUILDUP ──────────────────────────────────────────
// Window: Jan 28 (Trump "armada" announcement) → Feb 27 (pre-strike close)
// S&P path: roughly flat (+0.7% YTD through Feb 27) despite heavy
// sector rotation. Energy +22% YTD, defense rallying, tech −3% YTD.
export const iranPreWar = {
  conflict: "Iran",
  label: "Iran War (2026)",
  period: "Jan 28 – Feb 27, 2026",
  days: 22,
  spChange: 0.7,
  nqChange: -3.0,
  surprise: false,
  spStart: null,
  spEnd: 6878.88,
  nqStart: null,
  nqEnd: null,
  catalyst: "Trump 'armada' (Jan 28) → IRGC Hormuz incident (Feb 3) → strike warnings (Feb 19) → US/Israel strikes (Feb 28)",
  narrative: "The Iran buildup was the most publicly telegraphed of any conflict in this dataset. Trump announced naval deployments a month in advance and issued explicit deadlines. The S&P's ~flat buildup masked violent internal rotation: energy surged 22% YTD while tech fell 3%. Oil climbed from $65 to $72/bbl and gold hit $5,594 on Jan 29 — a record. When the strikes came, the broad index dropped only 0.43% on the day, but the conflict then dragged the S&P down another ~8% over four weeks as Iran blockaded the Strait of Hormuz and oil surged past $128.",
};

// ── GLOBAL MARKETS ───────────────────────────────────────────
// Data through Apr 15, 2026. Declines shown are peak-to-trough
// estimates from pre-war close; daysToRecover marked null where
// index has not yet clearly recrossed pre-war level.
// Sources: CNBC, Al Jazeera, Fortune, NPR
export const iranGlobalMarkets = {
  conflict: "Iran",
  label: "Iran War (2026)",
  dataQuality: "medium",
  marketCapRanking: ["NYSE", "NASDAQ", "TSE", "LSE", "Euronext", "Frankfurt", "HKEX"],
  narrative: "The conflict that nearly shut down the Strait of Hormuz produced a surprisingly orderly global selloff. Asian markets were hit hardest — the Nikkei plunged more than 7% intraday on the first post-strike session (closing −5.2%) on oil-import fears; Korea's KOSPI had the worst regional decline. European indices fell less (FTSE 100 −1.9%, DAX −2.6% on initial reaction) as UK energy majors benefited from the oil spike. By mid-April, Brent had retreated from its Apr 2 peak of $128 toward $94, and US indices had recouped all war losses — the S&P 500 and NASDAQ hit new all-time highs on Apr 15 despite an active US naval blockade of Iranian ports.",
  indices: [
    { id: "S&P 500", decline: 8.2, daysToBottom: 21, daysToRecover: 32, confidence: "exact", note: "6878.88 → 6316.91 → 7022.95 ATH (Apr 15)", isPositive: false, caveat: null },
    { id: "DJIA", decline: 8.0, daysToBottom: 21, daysToRecover: 33, confidence: "approx", note: "Dropped 521 pts on Feb 28; full recovery by mid-April", isPositive: false, caveat: null },
    { id: "Nikkei 225", decline: 10.0, daysToBottom: 18, daysToRecover: null, confidence: "approx", note: "Intraday -7% on Mar 9; closed -5.2% at 52,728 — worst regional reaction due to oil import dependence", isPositive: false, caveat: "Closing-basis estimate; partial recovery by Apr 15" },
    { id: "FTSE 100", decline: 5.0, daysToBottom: 15, daysToRecover: 28, confidence: "approx", note: "Shallower decline — UK energy majors (Shell, BP) cushioned the index", isPositive: false, caveat: null },
    { id: "DAX", decline: 7.0, daysToBottom: 18, daysToRecover: null, confidence: "approx", note: "Germany exposed via industrial energy costs; reached 22,983 on worst day", isPositive: false, caveat: null },
    { id: "CAC 40", decline: 7.0, daysToBottom: 18, daysToRecover: null, confidence: "approx", note: null, isPositive: false, caveat: null },
    { id: "Hang Seng", decline: 8.0, daysToBottom: 20, daysToRecover: null, confidence: "approx", note: "Fell 4%+ on Mar 23 Trump ultimatum; closed 24,382 on worst day", isPositive: false, caveat: "Pre-existing China tech/property drag" },
  ],
};

// ── COMMODITY & SAFE HAVEN DATA ──────────────────────────────
// Confirmed data through Apr 15, 2026
// Sources: CNBC, Bloomberg, EIA STEO, Finance Magnates, Trading Economics
export const iranCommodities = {
  oil: {
    priceBeforeStrikes: 72,           // Brent, Feb 27
    peakPrice: 128,                   // Apr 2 daily Brent
    currentPrice: 94,                 // Apr 14–15 range
    direction: "retreating from peak",
    straitOfHormuzRisk: "active blockade",
    narrative: "Brent surged from $72 pre-strikes to peak near $128/bbl on Apr 2 after Iran closed the Strait of Hormuz on Mar 4 and began charging >$1M per transit. The April 8 ceasefire triggered a selloff, but Apr 12 ceasefire-talks collapse and Apr 13 US naval blockade kept prices elevated. Current Brent ~$94 — still 30% above pre-war. EIA projects $115 peak in Q2 2026, falling to $88 by Q4.",
  },
  gold: {
    preWarPrice: 5594,                // Jan 29 ATH
    currentPrice: 4730,               // Apr 14
    marchDecline: -11.5,              // counter-intuitive — gold FELL during the war
    narrative: "Gold's behavior was the biggest surprise. After hitting an all-time high of $5,594.82 on Jan 29, gold FELL 11.5% during March as the war escalated — driven by portfolio liquidation to cover margin calls during the broader market turmoil. By April it had stabilized in the $4,700–4,800 range, well below its pre-war peak. Central banks were net sellers, reversing years of accumulation.",
  },
  sectors: {
    winners: ["Energy (+22% YTD)", "Defense/Aerospace (LMT, BA, RTX)", "Shipping & insurance"],
    losers: ["Airlines", "Consumer discretionary", "Asian export-sensitive tech"],
  },
  timeline: [
    { date: "2026-02-28", event: "US/Israel strikes on Iranian targets" },
    { date: "2026-03-04", event: "Iran closes Strait of Hormuz; oil tops $100" },
    { date: "2026-03-09", event: "Asian markets plunge; Nikkei -5.2% close" },
    { date: "2026-03-23", event: "Trump ultimatum — Asian markets tumble again" },
    { date: "2026-03-30", event: "S&P 500 2026 low (6,316.91)" },
    { date: "2026-04-02", event: "Brent crude peaks ~$128/bbl" },
    { date: "2026-04-08", event: "Two-week ceasefire (Pakistan-mediated)" },
    { date: "2026-04-12", event: "Vance announces talks collapse in Islamabad" },
    { date: "2026-04-13", event: "US Navy imposes blockade of Iranian ports" },
    { date: "2026-04-15", event: "S&P 500 & NASDAQ hit new all-time highs" },
  ],
};

// ── CONFLICT MARKER ──────────────────────────────────────────
export const iranMarker = { year: 2026, label: "Iran" };

// ── NOTES ON LONG-HORIZON DATA ───────────────────────────────
// CPI, debt/GDP, fiscal summary, cost of living, and wealth
// distribution are intentionally NOT included here. Per user
// direction (2026-04-16), Iran is wired only into short-horizon
// panels — reaction, buildup, and global markets. The long-
// horizon effects of this conflict won't be readable until 2027+.
