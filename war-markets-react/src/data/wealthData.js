// ── WEALTH DISTRIBUTION DATA ─────────────────────────────
// Source: Saez-Zucman (2016, updated), World Inequality Database (WID)
// Top wealth shares for the United States, 1913–2024

// Time series: ~25 data points covering key inflection years
// top01 = Top 0.1% wealth share (%), top1 = Top 1%, top10 = Top 10%, bottom50 = Bottom 50%
export const wealthTimeSeries = [
  { year: 1913, top01: 19.0, top1: 40.0, top10: 77.0, bottom50: 1.0 },
  { year: 1917, top01: 18.0, top1: 38.0, top10: 75.0, bottom50: 1.2 },
  { year: 1920, top01: 15.0, top1: 35.0, top10: 72.0, bottom50: 1.5 },
  { year: 1925, top01: 22.0, top1: 42.0, top10: 78.0, bottom50: 0.9 },
  { year: 1929, top01: 25.0, top1: 44.5, top10: 82.0, bottom50: 0.7 },
  { year: 1933, top01: 20.0, top1: 38.0, top10: 76.0, bottom50: 1.0 },
  { year: 1938, top01: 17.0, top1: 35.0, top10: 73.0, bottom50: 1.3 },
  { year: 1941, top01: 15.5, top1: 33.0, top10: 71.0, bottom50: 1.5 },
  { year: 1945, top01: 11.0, top1: 28.0, top10: 65.0, bottom50: 2.5 },
  { year: 1950, top01: 10.0, top1: 27.0, top10: 63.0, bottom50: 2.8 },
  { year: 1955, top01: 9.5, top1: 26.0, top10: 62.0, bottom50: 3.0 },
  { year: 1960, top01: 9.0, top1: 25.5, top10: 61.5, bottom50: 3.2 },
  { year: 1965, top01: 8.5, top1: 25.0, top10: 61.0, bottom50: 3.5 },
  { year: 1970, top01: 7.5, top1: 22.0, top10: 58.0, bottom50: 4.0 },
  { year: 1975, top01: 7.0, top1: 20.5, top10: 56.0, bottom50: 4.2 },
  { year: 1978, top01: 7.0, top1: 20.0, top10: 55.0, bottom50: 4.5 },
  { year: 1985, top01: 9.0, top1: 24.0, top10: 60.0, bottom50: 3.5 },
  { year: 1990, top01: 10.5, top1: 27.0, top10: 63.0, bottom50: 3.0 },
  { year: 1995, top01: 12.0, top1: 29.5, top10: 66.0, bottom50: 2.5 },
  { year: 2000, top01: 15.0, top1: 33.0, top10: 69.5, bottom50: 2.0 },
  { year: 2005, top01: 16.5, top1: 34.0, top10: 70.0, bottom50: 1.8 },
  { year: 2010, top01: 17.5, top1: 35.5, top10: 72.0, bottom50: 1.5 },
  { year: 2015, top01: 19.5, top1: 37.0, top10: 73.0, bottom50: 1.2 },
  { year: 2020, top01: 18.0, top1: 35.0, top10: 71.0, bottom50: 1.5 },
  { year: 2022, top01: 19.0, top1: 36.5, top10: 72.5, bottom50: 1.3 },
  { year: 2024, top01: 20.0, top1: 38.0, top10: 74.0, bottom50: 1.1 },
];

// Stacked area chart data: decompose top 10% into sub-groups
export const wealthStackedData = wealthTimeSeries.map(d => ({
  year: d.year,
  "Top 0.1%": d.top01,
  "Next 0.9%": +(d.top1 - d.top01).toFixed(1),
  "Next 9%": +(d.top10 - d.top1).toFixed(1),
  "Bottom 90%": +(100 - d.top10).toFixed(1),
}));

// Divergence chart data: Top 1% vs Bottom 50%
export const wealthDivergenceData = wealthTimeSeries.map(d => ({
  year: d.year,
  "Top 1%": d.top1,
  "Bottom 50%": d.bottom50,
}));

// War period bands for reference areas
export const warPeriodBands = [
  { conflict: "WWI", startYear: 1914, endYear: 1918, color: "#EF4444" },
  { conflict: "WWII", startYear: 1941, endYear: 1945, color: "#EF4444" },
  { conflict: "Korea", startYear: 1950, endYear: 1953, color: "#F59E0B" },
  { conflict: "Vietnam", startYear: 1964, endYear: 1975, color: "#10B981" },
  { conflict: "Gulf War", startYear: 1990, endYear: 1991, color: "#6366F1" },
  { conflict: "War on Terror", startYear: 2001, endYear: 2021, color: "#3B82F6" },
];

// Key milestones for annotation
export const wealthMilestones = [
  { year: 1929, label: "Peak (pre-crash)", note: "Top 0.1% hit 25% — Gilded Age peak" },
  { year: 1978, label: "Great Compression nadir", note: "Top 0.1% bottomed at 7% after decades of redistribution" },
  { year: 2024, label: "New Gilded Age", note: "Top 0.1% back to 20% — approaching 1929 levels" },
];

// Narrative cards per conflict era
export const wealthNarratives = [
  {
    era: "WWI Era (1913–1920)",
    conflict: "WWI",
    topShareBefore: "19.0%",
    topShareAfter: "15.0%",
    direction: "down",
    delta: -4.0,
    narrative: "The first modern total war initiated wealth compression. The top 0.1% share fell from 19% to 15% as wartime taxation (top income tax rate rose from 7% to 77%), Liberty Bond drives, and capital destruction in Europe eroded concentrated fortunes.",
  },
  {
    era: "Roaring '20s → Crash (1920–1933)",
    conflict: "Interwar",
    topShareBefore: "15.0%",
    topShareAfter: "20.0%",
    direction: "up",
    delta: 5.0,
    narrative: "Tax cuts under Coolidge and Mellon, financial deregulation, and the stock market boom reversed wartime compression. The top 0.1% surged to 25% by 1929 — then the Great Depression destroyed paper wealth, dropping their share back to 20%.",
  },
  {
    era: "WWII & Aftermath (1938–1955)",
    conflict: "WWII",
    topShareBefore: "17.0%",
    topShareAfter: "9.5%",
    direction: "down",
    delta: -7.5,
    narrative: "The defining wealth compression event. Top marginal tax rates hit 94%, capital was destroyed globally, unions gained power through the NLRA, and the GI Bill created the middle class. The top 0.1% share was cut nearly in half — from 17% to under 10%.",
  },
  {
    era: "The Great Compression (1955–1978)",
    conflict: "Korea/Vietnam",
    topShareBefore: "9.5%",
    topShareAfter: "7.0%",
    direction: "down",
    delta: -2.5,
    narrative: "High marginal tax rates (70–91%), strong unions, regulated finance, and broad-based wage growth maintained the compressed distribution. The top 0.1% bottomed at 7% in 1978 — the most equal the U.S. has ever been.",
  },
  {
    era: "Reagan Revolution → Today (1978–2024)",
    conflict: "War on Terror",
    topShareBefore: "7.0%",
    topShareAfter: "20.0%",
    direction: "up",
    delta: 13.0,
    narrative: "Tax cuts (top rate from 70% to 28%), financialization, globalization, and tech wealth concentration reversed decades of compression. The War on Terror — fought with debt, not taxes — did nothing to compress wealth. By 2024, the top 0.1% share returned to 1920s levels.",
  },
];

// Summary insight for the U-curve
export const uCurveInsight = {
  title: "The Great U-Curve of Wealth Inequality",
  description: "Total wars compress wealth through taxation and destruction. Limited wars and \"wars on terror\" funded by debt leave inequality untouched — or accelerate it.",
  keyPoints: [
    "1929: Top 0.1% owned 25% of all wealth — peak of the Gilded Age",
    "1978: Top 0.1% owned just 7% — lowest point after 50 years of progressive policy",
    "2024: Top 0.1% back to ~20% — approaching pre-Depression levels",
    "Only total wars (WWI, WWII) produced lasting wealth compression",
  ],
};

// Source URLs for SourceLink system
export const wealthSourceUrls = {
  wid: "https://wid.world/country/usa/",
  saezZucman: "https://gabriel-zucman.eu/uswealth/",
};

export const wealthSourceLabels = {
  wid: "World Inequality Database",
  saezZucman: "Saez-Zucman (2016, updated)",
};
