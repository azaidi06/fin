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

// ── FISCAL IMPACT DATA ─────────────────────────────────────
// CPI YoY% — annual averages from BLS / FRED CPIAUCSL (pre-1947: Minneapolis Fed historical tables)
// Debt/GDP% — FRED series GFDGDPA188S (federal debt as % of GDP, annual)

export const fiscalConflictColors = {
  WWII: "#EF4444",
  Korea: "#F59E0B",
  Vietnam: "#10B981",
  "Gulf War": "#6366F1",
  "9/11": "#EC4899",
  Iraq: "#3B82F6",
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
];

// Flattened for Recharts — one row per time point, column per conflict
const conflicts = ["WWII", "Korea", "Vietnam", "Gulf War", "9/11", "Iraq"];
const tValues = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const tLabels = ["T-2", "T-1", "T=0", "T+1", "T+2", "T+3", "T+4", "T+5", "T+6", "T+7", "T+8", "T+9", "T+10"];

export const cpiChartData = tValues.map((t, i) => {
  const row = { t, tLabel: tLabels[i] };
  conflicts.forEach(c => {
    const cd = cpiData.find(d => d.conflict === c);
    const pt = cd.series.find(s => s.t === t);
    row[c] = pt ? pt.value : null;
  });
  return row;
});

export const debtGdpChartData = tValues.map((t, i) => {
  const row = { t, tLabel: tLabels[i] };
  conflicts.forEach(c => {
    const dd = debtGdpData.find(d => d.conflict === c);
    const pt = dd.series.find(s => s.t === t);
    row[c] = pt ? pt.value : null;
  });
  return row;
});

export const fiscalSummary = [
  { conflict: "WWII", peakCpi: 14.4, debtGdpDelta: 76.1,
    narrative: "Debt peaked at 118% of GDP at T+5, then fell rapidly as postwar GDP boomed. The real inflation shock came after controls were lifted — CPI hit 14.4% in 1947 (T+6), the highest wartime-era reading." },
  { conflict: "Korea", peakCpi: 7.9, debtGdpDelta: -34.6,
    narrative: "Triggered an inflation spike to 7.9% in 1951, but rapid GDP growth from war mobilization cut debt-to-GDP nearly in half over a decade — from 80% to 46%." },
  { conflict: "Vietnam", peakCpi: 11.0, debtGdpDelta: -14.7,
    narrative: "The slow burn becomes clear at T+10: inflation crept to 5.5% by 1969, then exploded to 11.0% by 1974 as the oil crisis compounded war-era overheating. Debt/GDP fell steadily on strong nominal GDP growth." },
  { conflict: "Gulf War", peakCpi: 5.4, debtGdpDelta: 0.5,
    narrative: "Inflation peaked at the war's start then steadily declined. Debt/GDP rose through T+3 but the Clinton-era surpluses reversed it — by T+10 it was back to the pre-war level." },
  { conflict: "9/11", peakCpi: 3.8, debtGdpDelta: 41.0,
    narrative: "Moderate inflation masked a fiscal time bomb. Debt/GDP barely moved for 6 years, then the 2008 financial crisis sent it from 62% to 96% in just 4 years — the sharpest peacetime surge in U.S. history." },
  { conflict: "Iraq", peakCpi: 3.8, debtGdpDelta: 40.6,
    narrative: "War costs and the financial crisis combined to push debt from 60% to 100% of GDP in a decade. CPI briefly went negative in 2009 (-0.4%) before stabilizing — the only deflationary year since WWII." },
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
