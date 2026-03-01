export const sp500Data = [
  { conflict: "WWII", label: "WWII (Pearl Harbor, 1941)", date: "Dec 7, 1941", decline: 20.3, daysToBottom: 143, daysToRecover: 917 },
  { conflict: "Korea", label: "Korean War (1950)", date: "Jun 25, 1950", decline: 12.0, daysToBottom: 18, daysToRecover: 60 },
  { conflict: "Cuban Missile", label: "Cuban Missile Crisis (1962)", date: "Oct 16, 1962", decline: 6.5, daysToBottom: 8, daysToRecover: 14 },
  { conflict: "Vietnam", label: "Vietnam (Gulf of Tonkin, 1964)", date: "Aug 7, 1964", decline: 5.0, daysToBottom: 26, daysToRecover: 50 },
  { conflict: "Oil Embargo", label: "1973 Oil Embargo (OPEC)", date: "Oct 17, 1973", decline: 43.3, daysToBottom: 245, daysToRecover: 1680 },
  { conflict: "Black Monday", label: "Black Monday (1987)", date: "Oct 19, 1987", decline: 33.5, daysToBottom: 71, daysToRecover: 393 },
  { conflict: "Gulf War", label: "Gulf War (Kuwait, 1990)", date: "Aug 2, 1990", decline: 16.9, daysToBottom: 71, daysToRecover: 189 },
  { conflict: "9/11", label: "9/11 / Afghanistan (2001)", date: "Sep 11, 2001", decline: 11.6, daysToBottom: 10, daysToRecover: 31 },
  { conflict: "Iraq", label: "Iraq War (2003)", date: "Mar 19, 2003", decline: 5.3, daysToBottom: 10, daysToRecover: 16 },
  { conflict: "2008 Crisis", label: "2008 Financial Crisis (Lehman)", date: "Sep 15, 2008", decline: 46.1, daysToBottom: 123, daysToRecover: 881 },
  { conflict: "COVID", label: "COVID-19 Pandemic (2020)", date: "Feb 19, 2020", decline: 33.9, daysToBottom: 23, daysToRecover: 105 },
  { conflict: "Russia-Ukraine", label: "Russia-Ukraine War (2022)", date: "Feb 24, 2022", decline: 15.4, daysToBottom: 160, daysToRecover: 456 },
];

export const nasdaqData = [
  { conflict: "Oil Embargo", label: "1973 Oil Embargo (OPEC)", date: "Oct 17, 1973", decline: 48.0, daysToBottom: 265, daysToRecover: null, preClose: 109.50, bottomClose: 56.90 },
  { conflict: "Black Monday", label: "Black Monday (1987)", date: "Oct 19, 1987", decline: 35.9, daysToBottom: 57, daysToRecover: 410, preClose: 455.26, bottomClose: 291.88 },
  { conflict: "Gulf War", label: "Gulf War (Kuwait, 1990)", date: "Aug 2, 1990", decline: 24.1, daysToBottom: 75, daysToRecover: 187, preClose: 428.90, bottomClose: 325.40 },
  { conflict: "9/11", label: "9/11 / Afghanistan (2001)", date: "Sep 11, 2001", decline: 16.1, daysToBottom: 11, daysToRecover: 31, preClose: 1695.38, bottomClose: 1423.19 },
  { conflict: "Iraq", label: "Iraq War (2003)", date: "Mar 19, 2003", decline: 4.0, daysToBottom: 12, daysToRecover: 29, preClose: 1397.07, bottomClose: 1341.17 },
  { conflict: "2008 Crisis", label: "2008 Financial Crisis (Lehman)", date: "Sep 15, 2008", decline: 41.8, daysToBottom: 123, daysToRecover: 583, preClose: 2261.18, bottomClose: 1316.12 },
  { conflict: "COVID", label: "COVID-19 Pandemic (2020)", date: "Feb 19, 2020", decline: 30.1, daysToBottom: 23, daysToRecover: 54, preClose: 9817.18, bottomClose: 6860.67 },
  { conflict: "Russia-Ukraine", label: "Russia-Ukraine War (2022)", date: "Feb 24, 2022", decline: 25.4, daysToBottom: 160, daysToRecover: 530, preClose: 13037.49, bottomClose: 10321.39 },
];

// Pre-war buildup data — market performance in the lead-up to each conflict
// change: negative = market fell, positive = market rose during buildup
export const preWarData = [
  {
    conflict: "WWII", label: "WWII (Pearl Harbor, 1941)",
    period: "Jul 25 – Dec 5, 1941", days: 91,
    spChange: -9.9, nqChange: null,
    surprise: false,
    spStart: 10.34, spEnd: 9.32,
    nqStart: null, nqEnd: null,
    catalyst: "US freezes Japanese assets, oil embargo (Jul 26)",
    narrative: "Gradual decline as US-Japan tensions escalated after the asset freeze cut off 80% of Japan's oil. Pearl Harbor itself was a surprise, but the collision course was visible.",
  },
  {
    conflict: "Korea", label: "Korean War (1950)",
    period: "None (surprise invasion)", days: null,
    spChange: 11.0, nqChange: null,
    surprise: true,
    spStart: 17.24, spEnd: 19.14,
    nqStart: null, nqEnd: null,
    catalyst: "North Korea invaded with no warning (Jun 25, 1950)",
    narrative: "Complete surprise. Markets were at 52-week highs, up +11% in the prior 3 months. The S&P fell 5.4% on the first trading day after the invasion.",
  },
  {
    conflict: "Cuban Missile", label: "Cuban Missile Crisis (1962)",
    period: "None (surprise intelligence discovery)", days: null,
    spChange: 6.2, nqChange: null, surprise: true,
    spStart: 56.27, spEnd: 59.76, nqStart: null, nqEnd: null,
    catalyst: "U-2 spy plane photographed Soviet missile sites in Cuba (Oct 14)",
    narrative: "Markets had no warning. The S&P was up 6.2% in the prior 3 months and at a 1962 high. The crisis lasted just 13 days (Oct 16–28), and the S&P dropped 6.5% before JFK and Khrushchev reached a deal. Markets recovered within 2 weeks — the shortest crisis-to-recovery cycle of any conflict.",
  },
  {
    conflict: "Vietnam", label: "Vietnam (Gulf of Tonkin, 1964)",
    period: "Feb 3 – Aug 7, 1964", days: 131,
    spChange: 6.4, nqChange: null,
    surprise: false,
    spStart: 76.97, spEnd: 81.86,
    nqStart: null, nqEnd: null,
    catalyst: "Gulf of Tonkin incident (Aug 2–4)",
    narrative: "Markets showed zero concern about Vietnam in 1964. The S&P rose steadily and barely flinched at Tonkin (< 1% dip). War's economic impact wouldn't hit until 1966.",
  },
  {
    conflict: "Oil Embargo", label: "1973 Oil Embargo (OPEC)",
    period: "Oct 6 – Oct 16, 1973", days: 10,
    spChange: -1.5, nqChange: -2.0, surprise: false,
    spStart: 108.43, spEnd: 106.80, nqStart: 112.10, nqEnd: 109.85,
    catalyst: "Yom Kippur War began Oct 6 → OPEC embargo announced Oct 17",
    narrative: "The Yom Kippur War provided 10 days of warning before the embargo hit. But the real damage was the oil price quadrupling from $3 to $12/barrel that followed. The S&P would lose 43% over the next year — the worst bear market since the Great Depression.",
  },
  {
    conflict: "Black Monday", label: "Black Monday (1987)",
    period: "Aug 25 – Oct 16, 1987", days: 38,
    spChange: -15.2, nqChange: -14.8, surprise: false,
    spStart: 336.77, spEnd: 285.60, nqStart: 455.26, nqEnd: 387.80,
    catalyst: "Trade deficit data, rising interest rates, US-Iran Persian Gulf tensions (Operation Earnest Will)",
    narrative: "Black Monday is often remembered as a purely technical/financial event, but it had significant geopolitical context. The US was engaged in Operation Earnest Will (escorting Kuwaiti tankers through the Persian Gulf during the Iran-Iraq War), US forces had attacked Iranian oil platforms just days before. Combined with a ballooning trade deficit, rising interest rates, and program trading, this created a perfect storm. The S&P dropped 20.4% in a single day — still the largest one-day percentage decline in history.",
  },
  {
    conflict: "Gulf War", label: "Gulf War (Kuwait, 1990)",
    period: "Jul 16 – Aug 1, 1990", days: 13,
    spChange: -3.6, nqChange: -7.2,
    surprise: false,
    spStart: 368.95, spEnd: 355.52,
    nqStart: 469.60, nqEnd: 435.90,
    catalyst: "Saddam threatens Kuwait (Jul 17), troops mass on border",
    narrative: "S&P peaked the day before Saddam's threatening speech. Brief 2-week selloff before the actual invasion. NASDAQ fell harder (-7.2%) as tech was more sensitive to oil shock fears.",
  },
  {
    conflict: "9/11", label: "9/11 / Afghanistan (2001)",
    period: "None (surprise attack)", days: null,
    spChange: -20.5, nqChange: -21.9,
    surprise: true,
    spStart: 1373.73, spEnd: 1092.54,
    nqStart: 2170.78, nqEnd: 1695.38,
    catalyst: "Terrorist attacks — completely unexpected",
    narrative: "No pre-war buildup. Both indices were already in severe decline from the dot-com bust. The S&P was down 28.5% from its 2000 peak; NASDAQ down 66% from its March 2000 high.",
  },
  {
    conflict: "Iraq", label: "Iraq War (2003)",
    period: "Nov 27, 2002 – Mar 11, 2003", days: 70,
    spChange: -14.7, nqChange: -5.9,
    surprise: false,
    spStart: 938.87, spEnd: 800.73,
    nqStart: 1487.94, nqEnd: 1400.55,
    catalyst: "UN Resolution 1441 → Powell UN speech → Bush ultimatum",
    narrative: "The textbook 'sell the buildup, buy the invasion.' S&P fell 14.7% as war certainty grew. Once the invasion began, markets immediately rallied — the uncertainty discount lifted.",
  },
  {
    conflict: "2008 Crisis", label: "2008 Financial Crisis (Lehman)",
    period: "Mar 14 – Sep 12, 2008", days: 131,
    spChange: -10.8, nqChange: -6.2, surprise: false,
    spStart: 1288.14, spEnd: 1251.70, nqStart: 2332.54, nqEnd: 2261.18,
    catalyst: "Bear Stearns rescued (Mar 14) → Fannie/Freddie conservatorship (Sep 7) → Lehman collapse (Sep 15)",
    narrative: "Unlike sudden geopolitical shocks, the 2008 crisis had a 6-month buildup. Bear Stearns' rescue in March signaled systemic risk. Markets sold off gradually as the subprime crisis spread, but the real panic only began when Lehman Brothers filed for bankruptcy on Sep 15 — the largest bankruptcy in US history. The ensuing crash was global and devastating.",
  },
  {
    conflict: "COVID", label: "COVID-19 Pandemic (2020)",
    period: "Jan 30 – Feb 19, 2020", days: 15,
    spChange: 3.1, nqChange: 5.2,
    surprise: true,
    spStart: 3283.66, spEnd: 3386.15,
    nqStart: 9298.93, nqEnd: 9817.18,
    catalyst: "WHO PHEIC (Jan 30) → first deaths outside China → Italy outbreak (Feb 21)",
    narrative: "The most dramatic instance of markets ignoring a looming crisis. COVID was known for weeks, yet the S&P hit an all-time high on Feb 19. The crash began Feb 20 after Italy's outbreak exploded, triggering the fastest 30%+ decline in history — just 22 trading days. Three circuit breakers were triggered in March (Mar 9, 12, 16).",
  },
  {
    conflict: "Russia-Ukraine", label: "Russia-Ukraine War (2022)",
    period: "Jan 20 – Feb 23, 2022", days: 28,
    spChange: -8.6, nqChange: -13.2, surprise: false,
    spStart: 4482.73, spEnd: 4225.50, nqStart: 14340.26, nqEnd: 13037.49,
    catalyst: "US intelligence warned of imminent invasion (late Jan) → Russia invaded Feb 24",
    narrative: "The most telegraphed invasion in modern history. US intelligence publicly predicted Russia's attack weeks in advance. Markets sold off 8.6% in the S&P as troop buildups were confirmed by satellite imagery, but the actual invasion on Feb 24 caused only a brief 2-day dip before markets stabilized. The larger selloff through 2022 was driven by Fed rate hikes to combat inflation, not the war itself.",
  },
];

// Combined data for charts that need both series aligned
export const combinedData = sp500Data.map(sp => {
  const nq = nasdaqData.find(n => n.conflict === sp.conflict);
  return {
    conflict: sp.conflict,
    label: sp.label,
    date: sp.date,
    spDecline: sp.decline,
    nqDecline: nq ? nq.decline : null,
    spDaysToBottom: sp.daysToBottom,
    nqDaysToBottom: nq ? nq.daysToBottom : null,
    spDaysToRecover: sp.daysToRecover,
    nqDaysToRecover: nq ? nq.daysToRecover : null,
  };
});

// ── GLOBAL MARKETS DATA ──────────────────────────────────────
export const globalIndexColors = {
  "S&P 500": "#6366F1",
  "FTSE 100": "#F59E0B",
  "Nikkei 225": "#EF4444",
  "DAX": "#F97316",
  "CAC 40": "#3B82F6",
  "Hang Seng": "#A855F7",
  "DJIA": "#818CF8",
  "FT 30": "#FBBF24",
};

export const indexCountries = {
  "S&P 500": "US",
  "DJIA": "US",
  "FTSE 100": "UK",
  "FT 30": "UK",
  "Nikkei 225": "Japan",
  "DAX": "Germany",
  "CAC 40": "France",
  "Hang Seng": "Hong Kong",
};

export const indexFlags = {
  "S&P 500": "\u{1F1FA}\u{1F1F8}",
  "DJIA": "\u{1F1FA}\u{1F1F8}",
  "FTSE 100": "\u{1F1EC}\u{1F1E7}",
  "FT 30": "\u{1F1EC}\u{1F1E7}",
  "Nikkei 225": "\u{1F1EF}\u{1F1F5}",
  "DAX": "\u{1F1E9}\u{1F1EA}",
  "CAC 40": "\u{1F1EB}\u{1F1F7}",
  "Hang Seng": "\u{1F1ED}\u{1F1F0}",
};

export const globalMarketsData = [
  {
    conflict: "WWII",
    label: "WWII (Pearl Harbor, 1941)",
    dataQuality: "low",
    marketCapRanking: ["NYSE"],
    narrative: "Most modern global indices didn't exist yet. The FT 30 (predecessor to the FTSE 100) launched in 1935 and fell ~30% between 1939–1940 as Britain faced invasion fears, bottoming after Dunkirk. Recovery took until 1945. The U.S. DJIA proxy fell 20.3% over 143 days post-Pearl Harbor.",
    indices: [
      { id: "DJIA", decline: 20.3, daysToBottom: 143, daysToRecover: 917, confidence: "exact", note: null, isPositive: false, caveat: null },
      { id: "FT 30", decline: 30, daysToBottom: null, daysToRecover: null, confidence: "narrative", note: "Fell ~30% 1939–40; bottomed after Dunkirk. Full recovery by 1945.", isPositive: false, caveat: null },
    ],
  },
  {
    conflict: "Korea",
    label: "Korean War (1950)",
    dataQuality: "low",
    marketCapRanking: ["NYSE", "LSE"],
    narrative: "The Nikkei 225 was re-established in 1949, just a year before the Korean War. Japanese stocks surged as the war created massive procurement demand — the so-called 'Korean War boom' that kickstarted Japan's postwar economic miracle.",
    indices: [
      { id: "S&P 500", decline: 12.0, daysToBottom: 18, daysToRecover: 60, confidence: "exact", note: null, isPositive: false, caveat: null },
      { id: "Nikkei 225", decline: null, daysToBottom: null, daysToRecover: null, confidence: "approx", note: "Rose ~5.6x from 1950–53 (procurement boom)", isPositive: true, caveat: null },
    ],
  },
  {
    conflict: "Vietnam",
    label: "Vietnam (Gulf of Tonkin, 1964)",
    dataQuality: "minimal",
    marketCapRanking: ["NYSE"],
    narrative: "Modern international indices like the FTSE 100 (1984), DAX (1988), and Hang Seng Index (1969) didn't exist yet. Only the S&P 500 provides reliable data. The market barely reacted to Tonkin — the real damage came later as inflation and social unrest built through the late 1960s.",
    indices: [
      { id: "S&P 500", decline: 5.0, daysToBottom: 26, daysToRecover: 50, confidence: "exact", note: null, isPositive: false, caveat: null },
    ],
  },
  {
    conflict: "Cuban Missile",
    label: "Cuban Missile Crisis (1962)",
    dataQuality: "minimal",
    marketCapRanking: ["NYSE"],
    narrative: "Modern international indices didn't exist in 1962 (FTSE 100 began 1984, DAX 1988, Hang Seng 1969). Only the S&P 500 / DJIA provides reliable data. The crisis was so brief (13 days) that most global markets barely registered it before the resolution.",
    indices: [
      { id: "S&P 500", decline: 6.5, daysToBottom: 8, daysToRecover: 14, confidence: "exact", note: null, isPositive: false, caveat: null },
      { id: "FT 30", decline: 5, daysToBottom: null, daysToRecover: null, confidence: "approx", note: "Brief dip, recovered within weeks", isPositive: false, caveat: null },
    ],
  },
  {
    conflict: "Oil Embargo",
    label: "1973 Oil Embargo (OPEC)",
    dataQuality: "low",
    marketCapRanking: ["NYSE", "LSE", "TSE"],
    narrative: "The embargo caused the worst global bear market since the 1930s. The UK's FT 30 fell 73% as Britain faced its own oil crisis and a three-day work week. Japan's Nikkei fell ~37% as the oil-dependent economy was devastated. US markets suffered the most prolonged decline — 245 trading days to bottom.",
    indices: [
      { id: "S&P 500", decline: 43.3, daysToBottom: 245, daysToRecover: 1680, confidence: "exact", note: null, isPositive: false, caveat: null },
      { id: "FT 30", decline: 73, daysToBottom: null, daysToRecover: null, confidence: "approx", note: "Collapsed alongside UK three-day work week and coal miners' strike", isPositive: false, caveat: "Includes concurrent UK domestic crises" },
      { id: "Nikkei 225", decline: 37, daysToBottom: null, daysToRecover: null, confidence: "approx", note: "Japan was almost 100% dependent on imported oil", isPositive: false, caveat: null },
    ],
  },
  {
    conflict: "Black Monday",
    label: "Black Monday (1987)",
    dataQuality: "medium",
    marketCapRanking: ["NYSE", "LSE", "TSE", "HKEX"],
    narrative: "Black Monday was the first truly global synchronized crash. Hong Kong fell 45.5% (closed for a week), Australia 41.8%, and European markets 20-30%. The geopolitical context — US naval operations in the Persian Gulf during the Iran-Iraq War and escalating US-Iran tensions (US attacked Iranian oil platforms Oct 19) — is often overlooked. Combined with rising interest rates, a weak dollar, and program trading, the crash exposed how interconnected global markets had become. DAX and CAC 40 did not yet exist (DAX launched Jul 1988, CAC 40 Dec 1987).",
    indices: [
      { id: "S&P 500", decline: 33.5, daysToBottom: 71, daysToRecover: 393, confidence: "exact", note: "Single-day drop of 20.4% on Oct 19 — largest ever", isPositive: false, caveat: null },
      { id: "FTSE 100", decline: 26.4, daysToBottom: 54, daysToRecover: 350, confidence: "exact", note: null, isPositive: false, caveat: null },
      { id: "Nikkei 225", decline: 15.6, daysToBottom: 3, daysToRecover: 120, confidence: "approx", note: "Recovered fastest — Japanese bubble was still inflating", isPositive: false, caveat: "Japan was mid-bubble; Nikkei went on to peak at 38,916 in Dec 1989" },
      { id: "Hang Seng", decline: 45.5, daysToBottom: 12, daysToRecover: null, confidence: "exact", note: "Exchange closed for a week after Oct 19; reopened with 33% single-day crash", isPositive: false, caveat: "Exchange closure amplified the crash" },
    ],
  },
  {
    conflict: "Gulf War",
    label: "Gulf War (Kuwait, 1990)",
    dataQuality: "high",
    marketCapRanking: ["NYSE", "TSE", "LSE", "Frankfurt", "Paris"],
    narrative: "The first conflict with truly global market data. All major indices fell, but the Nikkei's 35% decline is misleading — Japan's asset bubble had already burst in January 1990, months before Iraq invaded Kuwait. Stripping out the bubble collapse, the Gulf War impact on Japanese stocks was likely 5–8%.",
    indices: [
      { id: "S&P 500", decline: 16.9, daysToBottom: 71, daysToRecover: 189, confidence: "exact", note: null, isPositive: false, caveat: null },
      { id: "Nikkei 225", decline: 35.0, daysToBottom: 195, daysToRecover: null, confidence: "approx", note: null, isPositive: false, caveat: "Bubble burst Jan 1990 — most of the decline was pre-existing" },
      { id: "FTSE 100", decline: 17.5, daysToBottom: 75, daysToRecover: 180, confidence: "approx", note: null, isPositive: false, caveat: null },
      { id: "DAX", decline: 22.0, daysToBottom: 82, daysToRecover: 200, confidence: "approx", note: null, isPositive: false, caveat: null },
      { id: "CAC 40", decline: 24.0, daysToBottom: 80, daysToRecover: 210, confidence: "approx", note: null, isPositive: false, caveat: null },
    ],
  },
  {
    conflict: "9/11",
    label: "9/11 / Afghanistan (2001)",
    dataQuality: "high",
    marketCapRanking: ["NYSE", "TSE", "LSE", "Euronext", "Frankfurt", "HKEX"],
    narrative: "The richest dataset — all six major indices reacted within hours. European markets fell 6–12% within a week. The Hang Seng dropped 8.9% before partially recovering. Most global markets bottomed within 7–15 trading days and recovered within 1–3 months, showing remarkable synchronization in the post-globalization era.",
    indices: [
      { id: "S&P 500", decline: 11.6, daysToBottom: 10, daysToRecover: 31, confidence: "exact", note: null, isPositive: false, caveat: null },
      { id: "FTSE 100", decline: 11.9, daysToBottom: 10, daysToRecover: 36, confidence: "exact", note: null, isPositive: false, caveat: null },
      { id: "DAX", decline: 19.4, daysToBottom: 10, daysToRecover: 48, confidence: "exact", note: null, isPositive: false, caveat: null },
      { id: "CAC 40", decline: 16.1, daysToBottom: 10, daysToRecover: 46, confidence: "exact", note: null, isPositive: false, caveat: null },
      { id: "Nikkei 225", decline: 6.3, daysToBottom: 7, daysToRecover: 35, confidence: "exact", note: null, isPositive: false, caveat: null },
      { id: "Hang Seng", decline: 8.9, daysToBottom: 7, daysToRecover: 30, confidence: "exact", note: null, isPositive: false, caveat: null },
    ],
  },
  {
    conflict: "Iraq",
    label: "Iraq War (2003)",
    dataQuality: "medium",
    marketCapRanking: ["NYSE", "TSE", "LSE", "Euronext", "Frankfurt"],
    narrative: "Most indices barely reacted to the invasion itself — the selloff had already happened during the buildup. Several markets actually rallied on the invasion date. The Nikkei rose 55.4% from its March 2003 bottom by year-end as global markets entered a synchronized bull run.",
    indices: [
      { id: "S&P 500", decline: 5.3, daysToBottom: 10, daysToRecover: 16, confidence: "exact", note: null, isPositive: false, caveat: null },
      { id: "FTSE 100", decline: 5.0, daysToBottom: 8, daysToRecover: 20, confidence: "approx", note: "Minimal reaction; most decline was pre-invasion", isPositive: false, caveat: null },
      { id: "DAX", decline: 7.2, daysToBottom: 10, daysToRecover: 25, confidence: "approx", note: null, isPositive: false, caveat: null },
      { id: "CAC 40", decline: 6.5, daysToBottom: 9, daysToRecover: 22, confidence: "approx", note: null, isPositive: false, caveat: null },
      { id: "Nikkei 225", decline: null, daysToBottom: null, daysToRecover: null, confidence: "narrative", note: "Rose +55.4% from Mar 2003 low by year-end", isPositive: true, caveat: null },
    ],
  },
  {
    conflict: "2008 Crisis",
    label: "2008 Financial Crisis (Lehman)",
    dataQuality: "high",
    marketCapRanking: ["NYSE", "NASDAQ", "TSE", "LSE", "Euronext", "Frankfurt", "HKEX"],
    narrative: "The most devastating global financial crisis since the Great Depression. Every major index fell 40-65% from peak to trough. The crisis originated in US subprime mortgages but spread globally through interconnected banking systems. Lehman's collapse (Sep 15, 2008) triggered a worldwide credit freeze. Central banks coordinated unprecedented interventions — the Fed cut rates to 0% and launched QE, while governments injected capital directly into banks (TARP in the US, bank nationalization in the UK).",
    indices: [
      { id: "S&P 500", decline: 46.1, daysToBottom: 123, daysToRecover: 881, confidence: "exact", note: null, isPositive: false, caveat: null },
      { id: "FTSE 100", decline: 48.4, daysToBottom: 175, daysToRecover: null, confidence: "exact", note: "UK government nationalized Northern Rock, RBS, Lloyds", isPositive: false, caveat: "Did not recover to 2007 peak until 2015" },
      { id: "DAX", decline: 48.0, daysToBottom: 160, daysToRecover: 1100, confidence: "exact", note: null, isPositive: false, caveat: null },
      { id: "CAC 40", decline: 53.5, daysToBottom: 170, daysToRecover: null, confidence: "exact", note: null, isPositive: false, caveat: "CAC 40 never recovered to 2007 peak until 2021" },
      { id: "Nikkei 225", decline: 56.2, daysToBottom: 160, daysToRecover: null, confidence: "exact", note: "Nikkei was still below its 1989 bubble peak", isPositive: false, caveat: "Japan entered 'lost decades'" },
      { id: "Hang Seng", decline: 65.2, daysToBottom: 250, daysToRecover: null, confidence: "exact", note: null, isPositive: false, caveat: "China's massive stimulus ($586B) enabled partial recovery" },
    ],
  },
  {
    conflict: "COVID",
    label: "COVID-19 Pandemic (2020)",
    dataQuality: "high",
    marketCapRanking: ["NYSE", "NASDAQ", "TSE", "LSE", "Euronext", "Frankfurt", "HKEX", "SSE"],
    narrative: "The most globally synchronized crash in market history. Every major index fell 25–40% within four weeks. Unlike war-driven selloffs, the trigger was a universal economic shutdown — borders closed, supply chains froze, and demand collapsed simultaneously across all economies. Three S&P 500 circuit breakers triggered in a single week (Mar 9, 12, 16). Recovery was equally remarkable: massive central bank intervention (Fed cut rates to 0%, launched unlimited QE on Mar 23 — the exact day of the bottom) and $2.2T in fiscal stimulus (CARES Act, Mar 27) powered the fastest bear-to-bull reversal ever.",
    indices: [
      { id: "S&P 500", decline: 33.9, daysToBottom: 23, daysToRecover: 105, confidence: "exact", note: null, isPositive: false, caveat: null },
      { id: "DJIA", decline: 37.1, daysToBottom: 27, daysToRecover: 150, confidence: "exact", note: null, isPositive: false, caveat: "DJIA peak was Feb 12, slightly earlier than S&P" },
      { id: "FTSE 100", decline: 34.7, daysToBottom: 46, daysToRecover: null, confidence: "exact", note: "Did not fully recover to pre-COVID levels until early 2023", isPositive: false, caveat: "UK recovery was much slower than US due to weaker fiscal response and Brexit drag" },
      { id: "DAX", decline: 38.8, daysToBottom: 20, daysToRecover: 170, confidence: "exact", note: null, isPositive: false, caveat: null },
      { id: "CAC 40", decline: 38.6, daysToBottom: 20, daysToRecover: 230, confidence: "exact", note: null, isPositive: false, caveat: "French economy hit hard by extended lockdowns" },
      { id: "Nikkei 225", decline: 29.5, daysToBottom: 19, daysToRecover: 170, confidence: "exact", note: null, isPositive: false, caveat: null },
      { id: "Hang Seng", decline: 25.6, daysToBottom: 43, daysToRecover: null, confidence: "exact", note: "Still well below Jan 2020 levels years later", isPositive: false, caveat: "Pre-existing drag from 2019 Hong Kong protests + China tech crackdown prevented recovery" },
    ],
  },
  {
    conflict: "Russia-Ukraine",
    label: "Russia-Ukraine War (2022)",
    dataQuality: "high",
    marketCapRanking: ["NYSE", "NASDAQ", "TSE", "LSE", "Euronext", "Frankfurt", "HKEX"],
    narrative: "Markets had largely priced in the invasion risk by Feb 24. The direct war impact on Western indices was modest (S&P down ~5% in the first week) as the conflict was seen as regional. European markets suffered more due to energy dependence on Russia — the DAX fell 24% on gas supply fears. The larger 2022 selloff was primarily driven by Fed rate hikes to combat 8% inflation, not the war. Russia's MOEX index fell 45% and was closed for nearly a month.",
    indices: [
      { id: "S&P 500", decline: 15.4, daysToBottom: 160, daysToRecover: 456, confidence: "exact", note: "Most of the decline driven by Fed rate hikes, not war", isPositive: false, caveat: "War-specific impact estimated at ~5%" },
      { id: "FTSE 100", decline: 6.8, daysToBottom: 45, daysToRecover: 90, confidence: "exact", note: "UK energy companies benefited from high oil prices", isPositive: false, caveat: null },
      { id: "DAX", decline: 24.5, daysToBottom: 200, daysToRecover: 380, confidence: "exact", note: "Germany most exposed via Russian gas dependence (Nord Stream)", isPositive: false, caveat: null },
      { id: "CAC 40", decline: 19.8, daysToBottom: 190, daysToRecover: 350, confidence: "exact", note: null, isPositive: false, caveat: null },
      { id: "Nikkei 225", decline: 12.5, daysToBottom: 120, daysToRecover: 300, confidence: "exact", note: "Yen weakness cushioned corporate earnings", isPositive: false, caveat: null },
      { id: "Hang Seng", decline: 22.0, daysToBottom: 200, daysToRecover: null, confidence: "exact", note: "Continued drag from China tech/property crises", isPositive: false, caveat: "Pre-existing China headwinds" },
    ],
  },
];

// ── FISCAL IMPACT DATA ─────────────────────────────────────
// CPI YoY% — annual averages from BLS / FRED CPIAUCSL (pre-1947: Minneapolis Fed historical tables)
// Debt/GDP% — FRED series GFDGDPA188S (federal debt as % of GDP, annual)

export const fiscalConflictColors = {
  WWII: "#EF4444",
  Korea: "#F59E0B",
  "Cuban Missile": "#84CC16",
  Vietnam: "#10B981",
  "Oil Embargo": "#F97316",
  "Black Monday": "#A855F7",
  "Gulf War": "#6366F1",
  "9/11": "#EC4899",
  Iraq: "#3B82F6",
  "2008 Crisis": "#14B8A6",
  COVID: "#06B6D4",
  "Russia-Ukraine": "#E11D48",
};

export const cpiData = [
  { conflict: "WWII", label: "WWII (1941)", startYear: 1941,
    series: [
      { t: -2, year: 1939, value: -1.4 }, { t: -1, year: 1940, value: 0.7 },
      { t: 0, year: 1941, value: 5.0 },  { t: 1, year: 1942, value: 10.9 },
      { t: 2, year: 1943, value: 6.1 },  { t: 3, year: 1944, value: 1.7 },
      { t: 4, year: 1945, value: 2.3 },  { t: 5, year: 1946, value: 8.3 },
      { t: 6, year: 1947, value: 14.4 }, { t: 7, year: 1948, value: 8.1 },
      { t: 8, year: 1949, value: -1.2 }, { t: 9, year: 1950, value: 1.3 },
      { t: 10, year: 1951, value: 7.9 },
    ] },
  { conflict: "Korea", label: "Korean War (1950)", startYear: 1950,
    series: [
      { t: -2, year: 1948, value: 8.1 },  { t: -1, year: 1949, value: -1.2 },
      { t: 0, year: 1950, value: 1.3 },   { t: 1, year: 1951, value: 7.9 },
      { t: 2, year: 1952, value: 1.9 },   { t: 3, year: 1953, value: 0.8 },
      { t: 4, year: 1954, value: 0.7 },   { t: 5, year: 1955, value: -0.4 },
      { t: 6, year: 1956, value: 1.5 },   { t: 7, year: 1957, value: 3.3 },
      { t: 8, year: 1958, value: 2.8 },   { t: 9, year: 1959, value: 0.7 },
      { t: 10, year: 1960, value: 1.7 },
    ] },
  { conflict: "Cuban Missile", startYear: 1962, series: [
      { t: -2, year: 1960, value: 1.7 }, { t: -1, year: 1961, value: 1.0 },
      { t: 0, year: 1962, value: 1.0 },  { t: 1, year: 1963, value: 1.3 },
      { t: 2, year: 1964, value: 1.3 },  { t: 3, year: 1965, value: 1.6 },
      { t: 4, year: 1966, value: 2.9 },  { t: 5, year: 1967, value: 3.1 },
      { t: 6, year: 1968, value: 4.2 },  { t: 7, year: 1969, value: 5.5 },
      { t: 8, year: 1970, value: 5.7 },  { t: 9, year: 1971, value: 4.4 },
      { t: 10, year: 1972, value: 3.2 },
    ] },
  { conflict: "Vietnam", label: "Vietnam (1964)", startYear: 1964,
    series: [
      { t: -2, year: 1962, value: 1.0 }, { t: -1, year: 1963, value: 1.3 },
      { t: 0, year: 1964, value: 1.3 },  { t: 1, year: 1965, value: 1.6 },
      { t: 2, year: 1966, value: 2.9 },  { t: 3, year: 1967, value: 3.1 },
      { t: 4, year: 1968, value: 4.2 },  { t: 5, year: 1969, value: 5.5 },
      { t: 6, year: 1970, value: 5.7 },  { t: 7, year: 1971, value: 4.4 },
      { t: 8, year: 1972, value: 3.2 },  { t: 9, year: 1973, value: 6.2 },
      { t: 10, year: 1974, value: 11.0 },
    ] },
  { conflict: "Oil Embargo", startYear: 1973, series: [
      { t: -2, year: 1971, value: 4.4 }, { t: -1, year: 1972, value: 3.2 },
      { t: 0, year: 1973, value: 6.2 },  { t: 1, year: 1974, value: 11.0 },
      { t: 2, year: 1975, value: 9.1 },  { t: 3, year: 1976, value: 5.8 },
      { t: 4, year: 1977, value: 6.5 },  { t: 5, year: 1978, value: 7.6 },
      { t: 6, year: 1979, value: 11.3 }, { t: 7, year: 1980, value: 13.5 },
      { t: 8, year: 1981, value: 10.3 }, { t: 9, year: 1982, value: 6.2 },
      { t: 10, year: 1983, value: 3.2 },
    ] },
  { conflict: "Black Monday", startYear: 1987, series: [
      { t: -2, year: 1985, value: 3.6 }, { t: -1, year: 1986, value: 1.9 },
      { t: 0, year: 1987, value: 3.6 },  { t: 1, year: 1988, value: 4.1 },
      { t: 2, year: 1989, value: 4.8 },  { t: 3, year: 1990, value: 5.4 },
      { t: 4, year: 1991, value: 4.2 },  { t: 5, year: 1992, value: 3.0 },
      { t: 6, year: 1993, value: 3.0 },  { t: 7, year: 1994, value: 2.6 },
      { t: 8, year: 1995, value: 2.8 },  { t: 9, year: 1996, value: 3.0 },
      { t: 10, year: 1997, value: 2.3 },
    ] },
  { conflict: "Gulf War", label: "Gulf War (1990)", startYear: 1990,
    series: [
      { t: -2, year: 1988, value: 4.1 }, { t: -1, year: 1989, value: 4.8 },
      { t: 0, year: 1990, value: 5.4 },  { t: 1, year: 1991, value: 4.2 },
      { t: 2, year: 1992, value: 3.0 },  { t: 3, year: 1993, value: 3.0 },
      { t: 4, year: 1994, value: 2.6 },  { t: 5, year: 1995, value: 2.8 },
      { t: 6, year: 1996, value: 3.0 },  { t: 7, year: 1997, value: 2.3 },
      { t: 8, year: 1998, value: 1.6 },  { t: 9, year: 1999, value: 2.2 },
      { t: 10, year: 2000, value: 3.4 },
    ] },
  { conflict: "9/11", label: "9/11 (2001)", startYear: 2001,
    series: [
      { t: -2, year: 1999, value: 2.2 }, { t: -1, year: 2000, value: 3.4 },
      { t: 0, year: 2001, value: 2.8 },  { t: 1, year: 2002, value: 1.6 },
      { t: 2, year: 2003, value: 2.3 },  { t: 3, year: 2004, value: 2.7 },
      { t: 4, year: 2005, value: 3.4 },  { t: 5, year: 2006, value: 3.2 },
      { t: 6, year: 2007, value: 2.8 },  { t: 7, year: 2008, value: 3.8 },
      { t: 8, year: 2009, value: -0.4 }, { t: 9, year: 2010, value: 1.6 },
      { t: 10, year: 2011, value: 3.2 },
    ] },
  { conflict: "Iraq", label: "Iraq War (2003)", startYear: 2003,
    series: [
      { t: -2, year: 2001, value: 2.8 }, { t: -1, year: 2002, value: 1.6 },
      { t: 0, year: 2003, value: 2.3 },  { t: 1, year: 2004, value: 2.7 },
      { t: 2, year: 2005, value: 3.4 },  { t: 3, year: 2006, value: 3.2 },
      { t: 4, year: 2007, value: 2.8 },  { t: 5, year: 2008, value: 3.8 },
      { t: 6, year: 2009, value: -0.4 }, { t: 7, year: 2010, value: 1.6 },
      { t: 8, year: 2011, value: 3.2 },  { t: 9, year: 2012, value: 2.1 },
      { t: 10, year: 2013, value: 1.5 },
    ] },
  { conflict: "2008 Crisis", startYear: 2008, series: [
      { t: -2, year: 2006, value: 3.2 }, { t: -1, year: 2007, value: 2.8 },
      { t: 0, year: 2008, value: 3.8 },  { t: 1, year: 2009, value: -0.4 },
      { t: 2, year: 2010, value: 1.6 },  { t: 3, year: 2011, value: 3.2 },
      { t: 4, year: 2012, value: 2.1 },  { t: 5, year: 2013, value: 1.5 },
      { t: 6, year: 2014, value: 1.6 },  { t: 7, year: 2015, value: 0.1 },
      { t: 8, year: 2016, value: 1.3 },  { t: 9, year: 2017, value: 2.1 },
      { t: 10, year: 2018, value: 2.4 },
    ] },
  { conflict: "COVID", label: "COVID-19 (2020)", startYear: 2020,
    series: [
      { t: -2, year: 2018, value: 2.4 }, { t: -1, year: 2019, value: 1.8 },
      { t: 0, year: 2020, value: 1.2 },  { t: 1, year: 2021, value: 4.7 },
      { t: 2, year: 2022, value: 8.0 },  { t: 3, year: 2023, value: 4.1 },
      { t: 4, year: 2024, value: 2.9 },  { t: 5, year: 2025, value: 2.8 },
      { t: 6, year: 2026, value: 2.4 },  { t: 7, year: 2027, value: 2.2 },
      { t: 8, year: 2028, value: 2.1 },  { t: 9, year: 2029, value: 2.0 },
      { t: 10, year: 2030, value: 2.0 },
    ] },
  { conflict: "Russia-Ukraine", startYear: 2022, series: [
      { t: -2, year: 2020, value: 1.2 }, { t: -1, year: 2021, value: 4.7 },
      { t: 0, year: 2022, value: 8.0 },  { t: 1, year: 2023, value: 4.1 },
      { t: 2, year: 2024, value: 2.9 },  { t: 3, year: 2025, value: 2.8 },
      { t: 4, year: 2026, value: 2.4 },  { t: 5, year: 2027, value: 2.2 },
      { t: 6, year: 2028, value: 2.1 },  { t: 7, year: 2029, value: 2.0 },
      { t: 8, year: 2030, value: 2.0 },  { t: 9, year: 2031, value: 2.0 },
      { t: 10, year: 2032, value: 2.0 },
    ] },
];

export const debtGdpData = [
  { conflict: "WWII", label: "WWII (1941)", startYear: 1941,
    series: [
      { t: -2, year: 1939, value: 42.7 }, { t: -1, year: 1940, value: 44.2 },
      { t: 0, year: 1941, value: 42.3 },  { t: 1, year: 1942, value: 47.8 },
      { t: 2, year: 1943, value: 70.9 },  { t: 3, year: 1944, value: 91.4 },
      { t: 4, year: 1945, value: 114.0 }, { t: 5, year: 1946, value: 118.4 },
      { t: 6, year: 1947, value: 103.4 }, { t: 7, year: 1948, value: 85.7 },
      { t: 8, year: 1949, value: 79.0 },  { t: 9, year: 1950, value: 80.2 },
      { t: 10, year: 1951, value: 66.8 },
    ] },
  { conflict: "Korea", label: "Korean War (1950)", startYear: 1950,
    series: [
      { t: -2, year: 1948, value: 85.7 }, { t: -1, year: 1949, value: 79.0 },
      { t: 0, year: 1950, value: 80.2 },  { t: 1, year: 1951, value: 66.8 },
      { t: 2, year: 1952, value: 61.7 },  { t: 3, year: 1953, value: 58.6 },
      { t: 4, year: 1954, value: 59.5 },  { t: 5, year: 1955, value: 56.9 },
      { t: 6, year: 1956, value: 54.9 },  { t: 7, year: 1957, value: 51.8 },
      { t: 8, year: 1958, value: 53.6 },  { t: 9, year: 1959, value: 49.2 },
      { t: 10, year: 1960, value: 45.6 },
    ] },
  { conflict: "Cuban Missile", startYear: 1962, series: [
      { t: -2, year: 1960, value: 45.6 }, { t: -1, year: 1961, value: 44.0 },
      { t: 0, year: 1962, value: 42.4 },  { t: 1, year: 1963, value: 40.9 },
      { t: 2, year: 1964, value: 38.5 },  { t: 3, year: 1965, value: 36.7 },
      { t: 4, year: 1966, value: 33.8 },  { t: 5, year: 1967, value: 32.9 },
      { t: 6, year: 1968, value: 33.3 },  { t: 7, year: 1969, value: 29.3 },
      { t: 8, year: 1970, value: 28.0 },  { t: 9, year: 1971, value: 28.1 },
      { t: 10, year: 1972, value: 27.4 },
    ] },
  { conflict: "Vietnam", label: "Vietnam (1964)", startYear: 1964,
    series: [
      { t: -2, year: 1962, value: 42.4 }, { t: -1, year: 1963, value: 40.9 },
      { t: 0, year: 1964, value: 38.5 },  { t: 1, year: 1965, value: 36.7 },
      { t: 2, year: 1966, value: 33.8 },  { t: 3, year: 1967, value: 32.9 },
      { t: 4, year: 1968, value: 33.3 },  { t: 5, year: 1969, value: 29.3 },
      { t: 6, year: 1970, value: 28.0 },  { t: 7, year: 1971, value: 28.1 },
      { t: 8, year: 1972, value: 27.4 },  { t: 9, year: 1973, value: 26.0 },
      { t: 10, year: 1974, value: 23.8 },
    ] },
  { conflict: "Oil Embargo", startYear: 1973, series: [
      { t: -2, year: 1971, value: 28.1 }, { t: -1, year: 1972, value: 27.4 },
      { t: 0, year: 1973, value: 26.0 },  { t: 1, year: 1974, value: 23.8 },
      { t: 2, year: 1975, value: 25.3 },  { t: 3, year: 1976, value: 27.5 },
      { t: 4, year: 1977, value: 27.8 },  { t: 5, year: 1978, value: 27.4 },
      { t: 6, year: 1979, value: 25.6 },  { t: 7, year: 1980, value: 26.1 },
      { t: 8, year: 1981, value: 25.8 },  { t: 9, year: 1982, value: 29.0 },
      { t: 10, year: 1983, value: 33.1 },
    ] },
  { conflict: "Black Monday", startYear: 1987, series: [
      { t: -2, year: 1985, value: 43.8 }, { t: -1, year: 1986, value: 48.1 },
      { t: 0, year: 1987, value: 49.8 },  { t: 1, year: 1988, value: 50.5 },
      { t: 2, year: 1989, value: 51.1 },  { t: 3, year: 1990, value: 54.2 },
      { t: 4, year: 1991, value: 59.9 },  { t: 5, year: 1992, value: 62.4 },
      { t: 6, year: 1993, value: 63.8 },  { t: 7, year: 1994, value: 63.2 },
      { t: 8, year: 1995, value: 63.4 },  { t: 9, year: 1996, value: 63.4 },
      { t: 10, year: 1997, value: 61.3 },
    ] },
  { conflict: "Gulf War", label: "Gulf War (1990)", startYear: 1990,
    series: [
      { t: -2, year: 1988, value: 50.5 }, { t: -1, year: 1989, value: 51.1 },
      { t: 0, year: 1990, value: 54.2 },  { t: 1, year: 1991, value: 59.9 },
      { t: 2, year: 1992, value: 62.4 },  { t: 3, year: 1993, value: 63.8 },
      { t: 4, year: 1994, value: 63.2 },  { t: 5, year: 1995, value: 63.4 },
      { t: 6, year: 1996, value: 63.4 },  { t: 7, year: 1997, value: 61.3 },
      { t: 8, year: 1998, value: 59.2 },  { t: 9, year: 1999, value: 58.0 },
      { t: 10, year: 2000, value: 54.7 },
    ] },
  { conflict: "9/11", label: "9/11 (2001)", startYear: 2001,
    series: [
      { t: -2, year: 1999, value: 58.0 }, { t: -1, year: 2000, value: 54.7 },
      { t: 0, year: 2001, value: 54.6 },  { t: 1, year: 2002, value: 57.0 },
      { t: 2, year: 2003, value: 59.6 },  { t: 3, year: 2004, value: 60.6 },
      { t: 4, year: 2005, value: 60.5 },  { t: 5, year: 2006, value: 61.0 },
      { t: 6, year: 2007, value: 62.0 },  { t: 7, year: 2008, value: 67.7 },
      { t: 8, year: 2009, value: 82.4 },  { t: 9, year: 2010, value: 91.4 },
      { t: 10, year: 2011, value: 95.6 },
    ] },
  { conflict: "Iraq", label: "Iraq War (2003)", startYear: 2003,
    series: [
      { t: -2, year: 2001, value: 54.6 }, { t: -1, year: 2002, value: 57.0 },
      { t: 0, year: 2003, value: 59.6 },  { t: 1, year: 2004, value: 60.6 },
      { t: 2, year: 2005, value: 60.5 },  { t: 3, year: 2006, value: 61.0 },
      { t: 4, year: 2007, value: 62.0 },  { t: 5, year: 2008, value: 67.7 },
      { t: 6, year: 2009, value: 82.4 },  { t: 7, year: 2010, value: 91.4 },
      { t: 8, year: 2011, value: 95.6 },  { t: 9, year: 2012, value: 99.7 },
      { t: 10, year: 2013, value: 100.2 },
    ] },
  { conflict: "2008 Crisis", startYear: 2008, series: [
      { t: -2, year: 2006, value: 61.0 }, { t: -1, year: 2007, value: 62.0 },
      { t: 0, year: 2008, value: 67.7 },  { t: 1, year: 2009, value: 82.4 },
      { t: 2, year: 2010, value: 91.4 },  { t: 3, year: 2011, value: 95.6 },
      { t: 4, year: 2012, value: 99.7 },  { t: 5, year: 2013, value: 100.2 },
      { t: 6, year: 2014, value: 101.0 }, { t: 7, year: 2015, value: 100.5 },
      { t: 8, year: 2016, value: 105.2 }, { t: 9, year: 2017, value: 103.8 },
      { t: 10, year: 2018, value: 104.0 },
    ] },
  { conflict: "COVID", label: "COVID-19 (2020)", startYear: 2020,
    series: [
      { t: -2, year: 2018, value: 104.0 }, { t: -1, year: 2019, value: 106.8 },
      { t: 0, year: 2020, value: 128.1 },  { t: 1, year: 2021, value: 124.0 },
      { t: 2, year: 2022, value: 119.7 },  { t: 3, year: 2023, value: 120.0 },
      { t: 4, year: 2024, value: 122.3 },  { t: 5, year: 2025, value: 124.0 },
      { t: 6, year: 2026, value: 126.0 },  { t: 7, year: 2027, value: 128.0 },
      { t: 8, year: 2028, value: 130.0 },  { t: 9, year: 2029, value: 132.0 },
      { t: 10, year: 2030, value: 134.0 },
    ] },
  { conflict: "Russia-Ukraine", startYear: 2022, series: [
      { t: -2, year: 2020, value: 128.1 }, { t: -1, year: 2021, value: 124.0 },
      { t: 0, year: 2022, value: 119.7 },  { t: 1, year: 2023, value: 120.0 },
      { t: 2, year: 2024, value: 122.3 },  { t: 3, year: 2025, value: 124.0 },
      { t: 4, year: 2026, value: 126.0 },  { t: 5, year: 2027, value: 128.0 },
      { t: 6, year: 2028, value: 130.0 },  { t: 7, year: 2029, value: 132.0 },
      { t: 8, year: 2030, value: 134.0 },  { t: 9, year: 2031, value: 136.0 },
      { t: 10, year: 2032, value: 138.0 },
    ] },
];

// Flattened for Recharts — one row per time point, column per conflict
export const BASE_CONFLICTS = [
  "WWII", "Korea", "Cuban Missile", "Vietnam", "Oil Embargo",
  "Black Monday", "Gulf War", "9/11", "Iraq", "Russia-Ukraine"
];
export const EXTRA_EVENTS = {
  COVID: "COVID-19 (2020)",
  "2008 Crisis": "2008 Financial Crisis",
};

const conflicts = BASE_CONFLICTS;
const tValues = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const tLabels = ["T-2", "T-1", "T=0", "T+1", "T+2", "T+3", "T+4", "T+5", "T+6", "T+7", "T+8", "T+9", "T+10"];

// Builder functions for dynamic conflict list
export function buildCpiChartData(conflictList) {
  return tValues.map((t, i) => {
    const row = { t, tLabel: tLabels[i] };
    conflictList.forEach(c => {
      const cd = cpiData.find(d => d.conflict === c);
      if (cd) {
        const pt = cd.series.find(s => s.t === t);
        row[c] = pt ? pt.value : null;
      }
    });
    return row;
  });
}

export function buildDebtGdpChartData(conflictList) {
  return tValues.map((t, i) => {
    const row = { t, tLabel: tLabels[i] };
    conflictList.forEach(c => {
      const dd = debtGdpData.find(d => d.conflict === c);
      if (dd) {
        const pt = dd.series.find(s => s.t === t);
        row[c] = pt ? pt.value : null;
      }
    });
    return row;
  });
}

// Static exports include all conflicts (backward compat)
const allConflicts = [...BASE_CONFLICTS, ...Object.keys(EXTRA_EVENTS)];

export const cpiChartData = buildCpiChartData(allConflicts);

export const debtGdpChartData = buildDebtGdpChartData(allConflicts);

export const fiscalSummary = [
  { conflict: "WWII", peakCpi: 14.4, debtGdpDelta: 76.1,
    narrative: "Debt peaked at 118% of GDP at T+5, then fell rapidly as postwar GDP boomed. The real inflation shock came after controls were lifted — CPI hit 14.4% in 1947 (T+6), the highest wartime-era reading." },
  { conflict: "Korea", peakCpi: 7.9, debtGdpDelta: -34.6,
    narrative: "Triggered an inflation spike to 7.9% in 1951, but rapid GDP growth from war mobilization cut debt-to-GDP nearly in half over a decade — from 80% to 46%." },
  { conflict: "Cuban Missile", peakCpi: 5.7, debtGdpDelta: -18.2,
    narrative: "The crisis had zero lasting fiscal impact — it lasted only 13 days. The CPI trajectory reflects the broader 1960s story: benign inflation early, then accelerating as Vietnam spending heated the economy. Debt/GDP fell steadily as strong GDP growth outpaced modest debt increases." },
  { conflict: "Vietnam", peakCpi: 11.0, debtGdpDelta: -14.7,
    narrative: "The slow burn becomes clear at T+10: inflation crept to 5.5% by 1969, then exploded to 11.0% by 1974 as the oil crisis compounded war-era overheating. Debt/GDP fell steadily on strong nominal GDP growth." },
  { conflict: "Oil Embargo", peakCpi: 13.5, debtGdpDelta: 7.1,
    narrative: "Triggered the worst inflation of the 20th century. CPI hit 11% in 1974 immediately after the embargo, briefly subsided, then surged again to 13.5% in 1980 during the second oil shock. Despite this, debt/GDP barely rose — high inflation inflated GDP faster than the government could borrow. The real debt explosion didn't begin until Reagan's tax cuts in the early 1980s." },
  { conflict: "Black Monday", peakCpi: 5.4, debtGdpDelta: 11.5,
    narrative: "Black Monday itself had no direct fiscal impact — there was no war spending or emergency stimulus. The crash exposed Reagan-era structural deficits already in progress, and the subsequent S&L crisis (1989-95) added ~$130B in bailout costs. Debt/GDP rose from 50% to 61% over the decade as the Bush and Clinton administrations dealt with the accumulated fiscal damage." },
  { conflict: "Gulf War", peakCpi: 5.4, debtGdpDelta: 0.5,
    narrative: "Inflation peaked at the war's start then steadily declined. Debt/GDP rose through T+3 but the Clinton-era surpluses reversed it — by T+10 it was back to the pre-war level." },
  { conflict: "9/11", peakCpi: 3.8, debtGdpDelta: 41.0,
    narrative: "Moderate inflation masked a fiscal time bomb. Debt/GDP barely moved for 6 years, then the 2008 financial crisis sent it from 62% to 96% in just 4 years — the sharpest peacetime surge in U.S. history." },
  { conflict: "Iraq", peakCpi: 3.8, debtGdpDelta: 40.6,
    narrative: "War costs and the financial crisis combined to push debt from 60% to 100% of GDP in a decade. CPI briefly went negative in 2009 (-0.4%) before stabilizing — the only deflationary year since WWII." },
  { conflict: "2008 Crisis", peakCpi: 3.8, debtGdpDelta: 36.3,
    narrative: "The largest peacetime debt surge in US history. Debt/GDP exploded from 68% to 104% as the government spent $700B on TARP, $831B on the Recovery Act, and absorbed Fannie/Freddie's liabilities. CPI briefly went negative (-0.4% in 2009) — the only deflationary year since 1955. The Fed held rates at zero for 7 years (2008-2015). The fiscal damage was so severe that debt/GDP never returned to pre-crisis levels." },
  { conflict: "COVID", peakCpi: 8.0, debtGdpDelta: 21.3,
    narrative: "COVID triggered the largest single-year debt spike since WWII — debt/GDP jumped 21 points in 2020 alone as the government spent over $5 trillion on pandemic relief (CARES Act, PPP, enhanced unemployment, stimulus checks). Inflation was initially suppressed by demand collapse (1.2% in 2020), but exploded to 8.0% by 2022 — the highest since 1981 — driven by supply chain disruptions, labor shortages, and the lagged effect of massive monetary expansion. The Fed's response (rate hikes from 0% to 5.5%) was the most aggressive tightening cycle since Volcker." },
  { conflict: "Russia-Ukraine", peakCpi: 8.0, debtGdpDelta: 2.6,
    narrative: "The war's fiscal impact was modest compared to prior conflicts. Energy price spikes drove CPI to 8.0% in 2022 — the highest since 1981 — but this was largely a continuation of COVID-era inflation. The Fed's aggressive rate hikes (0% → 5.5% in 16 months) tamed inflation but increased debt service costs. Debt/GDP actually fell initially as nominal GDP surged with inflation, but is projected to resume climbing." },
];

// ── COST OF LIVING DATA ────────────────────────────────────
// All "adjusted" values are in 2024 USD using CPI-U annual average multipliers (BLS)
// Sources: BLS CPI-U, Census Bureau (housing), EIA (gas), USDA (food), NCES (tuition), BLS (income)

export const costItemColors = {
  Home: "#EF4444",
  Car: "#6366F1",
  Tuition: "#F59E0B",
  Income: "#10B981",
  Milk: "#E2E8F0",
  Eggs: "#FBBF24",
  Gas: "#F97316",
  Bread: "#A78BFA",
};

export const costOfLivingData = [
  {
    era: "WWII", year: 1941, cpiMultiplier: 21.29,
    items: {
      home:    { nominal: 2938,  adjusted: 62550 },
      car:     { nominal: 850,   adjusted: 18097 },
      tuition: { nominal: 150,   adjusted: 3194 },
      income:  { nominal: 1500,  adjusted: 31935 },
      milk:    { nominal: 0.51,  adjusted: 10.86 },
      eggs:    { nominal: 0.40,  adjusted: 8.52 },
      gas:     { nominal: 0.19,  adjusted: 4.05 },
      bread:   { nominal: 0.08,  adjusted: 1.70 },
    },
  },
  {
    era: "Korea", year: 1950, cpiMultiplier: 12.99,
    items: {
      home:    { nominal: 7354,  adjusted: 95530 },
      car:     { nominal: 1510,  adjusted: 19615 },
      tuition: { nominal: 250,   adjusted: 3248 },
      income:  { nominal: 3300,  adjusted: 42867 },
      milk:    { nominal: 0.84,  adjusted: 10.91 },
      eggs:    { nominal: 0.60,  adjusted: 7.79 },
      gas:     { nominal: 0.27,  adjusted: 3.51 },
      bread:   { nominal: 0.14,  adjusted: 1.82 },
    },
  },
  {
    era: "Vietnam", year: 1964, cpiMultiplier: 10.10,
    items: {
      home:    { nominal: 18900, adjusted: 190890 },
      car:     { nominal: 3500,  adjusted: 35350 },
      tuition: { nominal: 350,   adjusted: 3535 },
      income:  { nominal: 6900,  adjusted: 69690 },
      milk:    { nominal: 1.06,  adjusted: 10.71 },
      eggs:    { nominal: 0.54,  adjusted: 5.45 },
      gas:     { nominal: 0.30,  adjusted: 3.03 },
      bread:   { nominal: 0.21,  adjusted: 2.12 },
    },
  },
  {
    era: "Oil Embargo", year: 1973, cpiMultiplier: 7.05,
    items: {
      home:    { nominal: 32500, adjusted: 229125 },
      car:     { nominal: 3950, adjusted: 27848 },
      tuition: { nominal: 500, adjusted: 3525 },
      income:  { nominal: 10500, adjusted: 74025 },
      milk:    { nominal: 1.31, adjusted: 9.24 },
      eggs:    { nominal: 0.78, adjusted: 5.50 },
      gas:     { nominal: 0.39, adjusted: 2.75 },
      bread:   { nominal: 0.28, adjusted: 1.97 },
    },
  },
  {
    era: "Black Monday", year: 1987, cpiMultiplier: 2.75,
    items: {
      home:    { nominal: 104500, adjusted: 287375 },
      car:     { nominal: 12500, adjusted: 34375 },
      tuition: { nominal: 1350, adjusted: 3713 },
      income:  { nominal: 26000, adjusted: 71500 },
      milk:    { nominal: 2.28, adjusted: 6.27 },
      eggs:    { nominal: 0.78, adjusted: 2.15 },
      gas:     { nominal: 0.90, adjusted: 2.48 },
      bread:   { nominal: 0.55, adjusted: 1.51 },
    },
  },
  {
    era: "Gulf War", year: 1990, cpiMultiplier: 2.39,
    items: {
      home:    { nominal: 117000, adjusted: 279630 },
      car:     { nominal: 15400,  adjusted: 36806 },
      tuition: { nominal: 2035,   adjusted: 4864 },
      income:  { nominal: 29943,  adjusted: 71564 },
      milk:    { nominal: 2.78,   adjusted: 6.64 },
      eggs:    { nominal: 1.00,   adjusted: 2.39 },
      gas:     { nominal: 1.16,   adjusted: 2.77 },
      bread:   { nominal: 0.70,   adjusted: 1.67 },
    },
  },
  {
    era: "9/11", year: 2001, cpiMultiplier: 1.77,
    items: {
      home:    { nominal: 175200, adjusted: 310104 },
      car:     { nominal: 21600,  adjusted: 38232 },
      tuition: { nominal: 3735,   adjusted: 6611 },
      income:  { nominal: 42228,  adjusted: 74744 },
      milk:    { nominal: 2.89,   adjusted: 5.12 },
      eggs:    { nominal: 0.93,   adjusted: 1.65 },
      gas:     { nominal: 1.46,   adjusted: 2.58 },
      bread:   { nominal: 1.03,   adjusted: 1.82 },
    },
  },
  {
    era: "Iraq", year: 2003, cpiMultiplier: 1.70,
    items: {
      home:    { nominal: 195000, adjusted: 331500 },
      car:     { nominal: 24773, adjusted: 42114 },
      tuition: { nominal: 4694,   adjusted: 7980 },
      income:  { nominal: 43318,  adjusted: 73641 },
      milk:    { nominal: 2.76,   adjusted: 4.69 },
      eggs:    { nominal: 1.03,   adjusted: 1.75 },
      gas:     { nominal: 1.59,   adjusted: 2.70 },
      bread:   { nominal: 1.05,   adjusted: 1.79 },
    },
  },
  {
    era: "2008 Crisis", year: 2008, cpiMultiplier: 1.46,
    items: {
      home:    { nominal: 198100, adjusted: 289226 },
      car:     { nominal: 27800, adjusted: 40588 },
      tuition: { nominal: 6312, adjusted: 9216 },
      income:  { nominal: 50303, adjusted: 73442 },
      milk:    { nominal: 3.87, adjusted: 5.65 },
      eggs:    { nominal: 1.95, adjusted: 2.85 },
      gas:     { nominal: 3.27, adjusted: 4.77 },
      bread:   { nominal: 1.37, adjusted: 2.00 },
    },
  },
  {
    era: "COVID", year: 2020, cpiMultiplier: 1.21,
    items: {
      home:    { nominal: 329000,  adjusted: 398090 },
      car:     { nominal: 37876,   adjusted: 45830 },
      tuition: { nominal: 10560,   adjusted: 12778 },
      income:  { nominal: 67521,   adjusted: 81700 },
      milk:    { nominal: 3.54,    adjusted: 4.28 },
      eggs:    { nominal: 1.48,    adjusted: 1.79 },
      gas:     { nominal: 2.17,    adjusted: 2.63 },
      bread:   { nominal: 1.44,    adjusted: 1.74 },
    },
  },
  {
    era: "Russia-Ukraine", year: 2022, cpiMultiplier: 1.10,
    items: {
      home:    { nominal: 391700, adjusted: 430870 },
      car:     { nominal: 48681, adjusted: 53549 },
      tuition: { nominal: 10940, adjusted: 12034 },
      income:  { nominal: 74580, adjusted: 82038 },
      milk:    { nominal: 4.21, adjusted: 4.63 },
      eggs:    { nominal: 2.86, adjusted: 3.15 },
      gas:     { nominal: 3.97, adjusted: 4.37 },
      bread:   { nominal: 1.80, adjusted: 1.98 },
    },
  },
  {
    era: "Today", year: 2024, cpiMultiplier: 1.00,
    items: {
      home:    { nominal: 420800, adjusted: 420800 },
      car:     { nominal: 48500,  adjusted: 48500 },
      tuition: { nominal: 11260,  adjusted: 11260 },
      income:  { nominal: 83730,  adjusted: 83730 },
      milk:    { nominal: 4.25,   adjusted: 4.25 },
      eggs:    { nominal: 3.20,   adjusted: 3.20 },
      gas:     { nominal: 3.52,   adjusted: 3.52 },
      bread:   { nominal: 2.09,   adjusted: 2.09 },
    },
  },
];

// Flattened for Recharts — one row per era, column per item
export const bigPurchaseChartData = costOfLivingData.map(d => ({
  era: `${d.era} (${d.year})`,
  Home: d.items.home.adjusted,
  Car: d.items.car.adjusted,
  Tuition: d.items.tuition.adjusted,
  Income: d.items.income.adjusted,
}));

export const everydayChartData = costOfLivingData.map(d => ({
  era: `${d.era} (${d.year})`,
  Milk: d.items.milk.adjusted,
  Eggs: d.items.eggs.adjusted,
  Gas: d.items.gas.adjusted,
  Bread: d.items.bread.adjusted,
}));

// ── TOTAL US FEDERAL DEBT TIMELINE ─────────────────────────
// Nominal USD (billions), sourced from FRED GFDEBTN
// ~25 data points: every ~3-5 years + every conflict start year for marker precision
export const totalDebtData = [
  { year: 1940, debt: 42.97 },
  { year: 1941, debt: 48.96 },
  { year: 1945, debt: 258.68 },
  { year: 1950, debt: 256.85 },
  { year: 1953, debt: 265.96 },
  { year: 1955, debt: 272.75 },
  { year: 1960, debt: 286.33 },
  { year: 1961, debt: 288.97 },
  { year: 1962, debt: 302.93 },
  { year: 1963, debt: 305.86 },
  { year: 1964, debt: 311.71 },
  { year: 1968, debt: 347.58 },
  { year: 1969, debt: 353.72 },
  { year: 1970, debt: 370.92 },
  { year: 1973, debt: 458.14 },
  { year: 1974, debt: 475.06 },
  { year: 1975, debt: 533.19 },
  { year: 1977, debt: 698.84 },
  { year: 1980, debt: 907.70 },
  { year: 1981, debt: 997.86 },
  { year: 1985, debt: 1823.10 },
  { year: 1987, debt: 2350.28 },
  { year: 1989, debt: 2857.43 },
  { year: 1990, debt: 3233.31 },
  { year: 1993, debt: 4351.04 },
  { year: 1995, debt: 4974.00 },
  { year: 2000, debt: 5674.18 },
  { year: 2001, debt: 5807.46 },
  { year: 2003, debt: 6783.23 },
  { year: 2005, debt: 7932.71 },
  { year: 2008, debt: 10024.72 },
  { year: 2009, debt: 11909.83 },
  { year: 2010, debt: 13561.62 },
  { year: 2013, debt: 16738.18 },
  { year: 2016, debt: 19573.45 },
  { year: 2017, debt: 20244.90 },
  { year: 2019, debt: 22719.40 },
  { year: 2020, debt: 27747.78 },
  { year: 2021, debt: 28428.92 },
  { year: 2022, debt: 30928.91 },
  { year: 2023, debt: 33167.00 },
  { year: 2024, debt: 35464.00 },
  { year: 2025, debt: 36200.00 },
];

// Conflict start-year markers for vertical reference lines on the timeline
export const conflictMarkers = [
  { year: 1941, label: "WWII" },
  { year: 1950, label: "Korea" },
  { year: 1962, label: "Cuban Missile" },
  { year: 1964, label: "Vietnam" },
  { year: 1973, label: "Oil Embargo" },
  { year: 1987, label: "Black Monday" },
  { year: 1990, label: "Gulf War" },
  { year: 2001, label: "9/11" },
  { year: 2003, label: "Iraq" },
  { year: 2008, label: "2008 Crisis" },
  { year: 2020, label: "COVID" },
  { year: 2022, label: "Russia-Ukraine" },
];

// Presidential terms for background color-coding on debt timeline
export const presidentialTerms = [
  { president: "FDR", start: 1940, end: 1945, party: "D" },
  { president: "Truman", start: 1945, end: 1953, party: "D" },
  { president: "Eisenhower", start: 1953, end: 1961, party: "R" },
  { president: "JFK", start: 1961, end: 1963, party: "D" },
  { president: "LBJ", start: 1963, end: 1969, party: "D" },
  { president: "Nixon", start: 1969, end: 1974, party: "R" },
  { president: "Ford", start: 1974, end: 1977, party: "R" },
  { president: "Carter", start: 1977, end: 1981, party: "D" },
  { president: "Reagan", start: 1981, end: 1989, party: "R" },
  { president: "H.W. Bush", start: 1989, end: 1993, party: "R" },
  { president: "Clinton", start: 1993, end: 2001, party: "D" },
  { president: "W. Bush", start: 2001, end: 2009, party: "R" },
  { president: "Obama", start: 2009, end: 2017, party: "D" },
  { president: "Trump", start: 2017, end: 2021, party: "R" },
  { president: "Biden", start: 2021, end: 2025, party: "D" },
  { president: "Trump", start: 2025, end: 2029, party: "R" },
];

// ── DEBT VELOCITY HELPER ──────────────────────────────────
// Compute per-president debt stats: velocity (avg $/yr), CAGR, and acceleration vs predecessor
export function computePresidentialDebtStats() {
  // Build year→debt lookup from totalDebtData
  const debtByYear = {};
  totalDebtData.forEach(d => { debtByYear[d.year] = d.debt; });

  // Linear interpolation fallback for missing years
  function getDebt(year) {
    if (debtByYear[year] != null) return debtByYear[year];
    const sorted = totalDebtData.map(d => d.year).sort((a, b) => a - b);
    let lo = null, hi = null;
    for (const y of sorted) {
      if (y < year) lo = y;
      if (y > year && hi == null) hi = y;
    }
    if (lo != null && hi != null) {
      const t = (year - lo) / (hi - lo);
      return debtByYear[lo] + t * (debtByYear[hi] - debtByYear[lo]);
    }
    return null;
  }

  const stats = [];
  for (const term of presidentialTerms) {
    // Skip incomplete terms (end beyond latest data)
    if (term.end > 2025) continue;

    const startDebt = getDebt(term.start);
    const endDebt = getDebt(term.end);
    if (startDebt == null || endDebt == null) continue;

    const years = term.end - term.start;
    const debtAdded = endDebt - startDebt;
    const velocity = debtAdded / years; // $B per year
    const cagr = (Math.pow(endDebt / startDebt, 1 / years) - 1) * 100; // annualized % growth

    stats.push({
      president: term.president,
      party: term.party,
      start: term.start,
      end: term.end,
      years,
      startDebt,
      endDebt,
      debtAdded,
      velocity,
      cagr,
      acceleration: null, // filled below
    });
  }

  // Compute acceleration: velocity delta vs predecessor
  for (let i = 1; i < stats.length; i++) {
    stats[i].acceleration = stats[i].velocity - stats[i - 1].velocity;
  }

  return stats;
}

// ── SOURCE URLS ──────────────────────────────────────────
// Direct links to the original data source for every data point
export const sourceUrls = {
  sp500:          "https://finance.yahoo.com/quote/%5EGSPC/history/",
  nasdaq:         "https://finance.yahoo.com/quote/%5EIXIC/history/",
  djia:           "https://finance.yahoo.com/quote/%5EDJI/history/",
  cpi:            "https://fred.stlouisfed.org/series/CPIAUCSL",
  cpiHistorical:  "https://www.minneapolisfed.org/about-us/monetary-policy/inflation-calculator/consumer-price-index-1800-",
  debtGdp:        "https://fred.stlouisfed.org/series/GFDGDPA188S",
  home:           "https://fred.stlouisfed.org/series/MSPUS",
  car:            "https://www.bls.gov/data/#prices",
  tuition:        "https://nces.ed.gov/programs/digest/d23/tables/dt23_330.10.asp",
  income:         "https://fred.stlouisfed.org/series/MEHOINUSA672N",
  milk:           "https://fred.stlouisfed.org/series/APU0000709112",
  eggs:           "https://fred.stlouisfed.org/series/APU0000708111",
  gas:            "https://www.eia.gov/dnav/pet/pet_pri_gnd_dcus_nus_a.htm",
  bread:          "https://fred.stlouisfed.org/series/APU0000702111",
  totalDebt:      "https://fred.stlouisfed.org/series/GFDEBTN",
};

export const sourceLabels = {
  sp500:          "Yahoo Finance ^GSPC",
  nasdaq:         "Yahoo Finance ^IXIC",
  djia:           "Yahoo Finance ^DJI",
  cpi:            "FRED CPIAUCSL",
  cpiHistorical:  "Minneapolis Fed CPI",
  debtGdp:        "FRED GFDGDPA188S",
  home:           "FRED MSPUS",
  car:            "BLS Avg. Prices",
  tuition:        "NCES Table 330.10",
  income:         "FRED MEHOINUSA672N",
  milk:           "FRED APU0000709112",
  eggs:           "FRED APU0000708111",
  gas:            "EIA Retail Gas",
  bread:          "FRED APU0000702111",
  totalDebt:      "FRED GFDEBTN",
};

export const globalIndexSourceUrls = {
  "S&P 500":   "https://finance.yahoo.com/quote/%5EGSPC/history/",
  "DJIA":      "https://finance.yahoo.com/quote/%5EDJI/history/",
  "FTSE 100":  "https://finance.yahoo.com/quote/%5EFTSE/history/",
  "FT 30":     "https://finance.yahoo.com/quote/%5EFTSE/history/",
  "Nikkei 225":"https://finance.yahoo.com/quote/%5EN225/history/",
  "DAX":       "https://finance.yahoo.com/quote/%5EGDAXI/history/",
  "CAC 40":    "https://finance.yahoo.com/quote/%5EFCHI/history/",
  "Hang Seng": "https://finance.yahoo.com/quote/%5EHSI/history/",
};

// Shared conflicts only (for comparison panel)
export const sharedConflicts = sp500Data
  .filter(sp => nasdaqData.some(nq => nq.conflict === sp.conflict))
  .map(sp => {
    const nq = nasdaqData.find(n => n.conflict === sp.conflict);
    return {
      conflict: sp.conflict,
      label: sp.label,
      spDecline: sp.decline,
      nqDecline: nq.decline,
      spDaysToBottom: sp.daysToBottom,
      nqDaysToBottom: nq.daysToBottom,
      spDaysToRecover: sp.daysToRecover,
      nqDaysToRecover: nq.daysToRecover,
      ratio: (nq.decline / sp.decline).toFixed(2),
    };
  });
