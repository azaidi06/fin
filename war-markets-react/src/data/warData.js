export const sp500Data = [
  { conflict: "WWII", label: "WWII (Pearl Harbor)", date: "Dec 7, 1941", decline: 20.3, daysToBottom: 143, daysToRecover: 917 },
  { conflict: "Korea", label: "Korean War", date: "Jun 25, 1950", decline: 12.0, daysToBottom: 18, daysToRecover: 60 },
  { conflict: "Vietnam", label: "Vietnam (Gulf of Tonkin)", date: "Aug 7, 1964", decline: 5.0, daysToBottom: 26, daysToRecover: 50 },
  { conflict: "Gulf War", label: "Gulf War (Kuwait)", date: "Aug 2, 1990", decline: 16.9, daysToBottom: 71, daysToRecover: 189 },
  { conflict: "9/11", label: "9/11 / Afghanistan", date: "Sep 11, 2001", decline: 11.6, daysToBottom: 10, daysToRecover: 31 },
  { conflict: "Iraq", label: "Iraq War", date: "Mar 19, 2003", decline: 5.3, daysToBottom: 10, daysToRecover: 16 },
];

export const nasdaqData = [
  { conflict: "Gulf War", label: "Gulf War (Kuwait)", date: "Aug 2, 1990", decline: 24.1, daysToBottom: 75, daysToRecover: 187, preClose: 428.90, bottomClose: 325.40 },
  { conflict: "9/11", label: "9/11 / Afghanistan", date: "Sep 11, 2001", decline: 16.1, daysToBottom: 11, daysToRecover: 31, preClose: 1695.38, bottomClose: 1423.19 },
  { conflict: "Iraq", label: "Iraq War", date: "Mar 19, 2003", decline: 4.0, daysToBottom: 12, daysToRecover: 29, preClose: 1397.07, bottomClose: 1341.17 },
];

// Pre-war buildup data — market performance in the lead-up to each conflict
// change: negative = market fell, positive = market rose during buildup
export const preWarData = [
  {
    conflict: "WWII", label: "WWII (Pearl Harbor)",
    period: "Jul 25 – Dec 5, 1941", days: 91,
    spChange: -9.9, nqChange: null,
    surprise: false,
    spStart: 10.34, spEnd: 9.32,
    nqStart: null, nqEnd: null,
    catalyst: "US freezes Japanese assets, oil embargo (Jul 26)",
    narrative: "Gradual decline as US-Japan tensions escalated after the asset freeze cut off 80% of Japan's oil. Pearl Harbor itself was a surprise, but the collision course was visible.",
  },
  {
    conflict: "Korea", label: "Korean War",
    period: "None (surprise invasion)", days: null,
    spChange: 11.0, nqChange: null,
    surprise: true,
    spStart: 17.24, spEnd: 19.14,
    nqStart: null, nqEnd: null,
    catalyst: "North Korea invaded with no warning (Jun 25, 1950)",
    narrative: "Complete surprise. Markets were at 52-week highs, up +11% in the prior 3 months. The S&P fell 5.4% on the first trading day after the invasion.",
  },
  {
    conflict: "Vietnam", label: "Vietnam (Gulf of Tonkin)",
    period: "Feb 3 – Aug 7, 1964", days: 131,
    spChange: 6.4, nqChange: null,
    surprise: false,
    spStart: 76.97, spEnd: 81.86,
    nqStart: null, nqEnd: null,
    catalyst: "Gulf of Tonkin incident (Aug 2–4)",
    narrative: "Markets showed zero concern about Vietnam in 1964. The S&P rose steadily and barely flinched at Tonkin (< 1% dip). War's economic impact wouldn't hit until 1966.",
  },
  {
    conflict: "Gulf War", label: "Gulf War (Kuwait)",
    period: "Jul 16 – Aug 1, 1990", days: 13,
    spChange: -3.6, nqChange: -7.2,
    surprise: false,
    spStart: 368.95, spEnd: 355.52,
    nqStart: 469.60, nqEnd: 435.90,
    catalyst: "Saddam threatens Kuwait (Jul 17), troops mass on border",
    narrative: "S&P peaked the day before Saddam's threatening speech. Brief 2-week selloff before the actual invasion. NASDAQ fell harder (-7.2%) as tech was more sensitive to oil shock fears.",
  },
  {
    conflict: "9/11", label: "9/11 / Afghanistan",
    period: "None (surprise attack)", days: null,
    spChange: -20.5, nqChange: -21.9,
    surprise: true,
    spStart: 1373.73, spEnd: 1092.54,
    nqStart: 2170.78, nqEnd: 1695.38,
    catalyst: "Terrorist attacks — completely unexpected",
    narrative: "No pre-war buildup. Both indices were already in severe decline from the dot-com bust. The S&P was down 28.5% from its 2000 peak; NASDAQ down 66% from its March 2000 high.",
  },
  {
    conflict: "Iraq", label: "Iraq War",
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
