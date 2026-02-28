export const sp500Data = [
  { conflict: "WWII", label: "WWII (Pearl Harbor, 1941)", date: "Dec 7, 1941", decline: 20.3, daysToBottom: 143, daysToRecover: 917 },
  { conflict: "Korea", label: "Korean War (1950)", date: "Jun 25, 1950", decline: 12.0, daysToBottom: 18, daysToRecover: 60 },
  { conflict: "Vietnam", label: "Vietnam (Gulf of Tonkin, 1964)", date: "Aug 7, 1964", decline: 5.0, daysToBottom: 26, daysToRecover: 50 },
  { conflict: "Gulf War", label: "Gulf War (Kuwait, 1990)", date: "Aug 2, 1990", decline: 16.9, daysToBottom: 71, daysToRecover: 189 },
  { conflict: "9/11", label: "9/11 / Afghanistan (2001)", date: "Sep 11, 2001", decline: 11.6, daysToBottom: 10, daysToRecover: 31 },
  { conflict: "Iraq", label: "Iraq War (2003)", date: "Mar 19, 2003", decline: 5.3, daysToBottom: 10, daysToRecover: 16 },
];

export const nasdaqData = [
  { conflict: "Gulf War", label: "Gulf War (Kuwait, 1990)", date: "Aug 2, 1990", decline: 24.1, daysToBottom: 75, daysToRecover: 187, preClose: 428.90, bottomClose: 325.40 },
  { conflict: "9/11", label: "9/11 / Afghanistan (2001)", date: "Sep 11, 2001", decline: 16.1, daysToBottom: 11, daysToRecover: 31, preClose: 1695.38, bottomClose: 1423.19 },
  { conflict: "Iraq", label: "Iraq War (2003)", date: "Mar 19, 2003", decline: 4.0, daysToBottom: 12, daysToRecover: 29, preClose: 1397.07, bottomClose: 1341.17 },
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
];

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
