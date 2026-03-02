/*
 * Curated data on AI capex accounting concerns.
 *
 * Sources:
 *   - SEC 10-K filings (MSFT, GOOGL, AMZN, META, ORCL)
 *   - Sequoia Capital "AI's $600B Question" (Sep 2024)
 *   - Michael Burry / Scion Asset Management (2025)
 *   - Morgan Stanley, Pivotal Research, Barclays analyst notes
 *   - CNBC, Yahoo Finance, SiliconANGLE reporting
 */

// ── Depreciation useful-life timeline ──
// Each entry = { year, company, from, to, note? }
// "from"/"to" = useful life in years for servers / network equipment
export const depreciationTimeline = [
  { year: 2020, ticker: "META", from: 3.0, to: 3.0, note: "Baseline" },
  { year: 2021, ticker: "META", from: 3.0, to: 4.0, note: "Extended" },
  { year: 2021, ticker: "GOOGL", from: 3.0, to: 4.0, note: "Extended" },
  { year: 2021, ticker: "MSFT", from: 3.0, to: 4.0, note: "Extended" },
  { year: 2022, ticker: "META", from: 4.0, to: 4.5, note: "Extended" },
  { year: 2022, ticker: "MSFT", from: 4.0, to: 6.0, note: "Extended" },
  { year: 2022, ticker: "AMZN", from: 4.0, to: 5.0, note: "Servers 4→5, network 5→6" },
  { year: 2023, ticker: "GOOGL", from: 4.0, to: 6.0, note: "Servers 4→6, network 5→6" },
  { year: 2023, ticker: "META", from: 4.5, to: 5.0, note: "Extended" },
  { year: 2023, ticker: "AMZN", from: 5.0, to: 6.0, note: "Servers 5→6" },
  { year: 2023, ticker: "ORCL", from: 4.0, to: 5.0, note: "Extended" },
  { year: 2024, ticker: "ORCL", from: 5.0, to: 6.0, note: "Extended" },
  { year: 2025, ticker: "META", from: 5.0, to: 5.5, note: "Extended again" },
  { year: 2025, ticker: "AMZN", from: 6.0, to: 5.0, note: "Reversed — cited AI obsolescence" },
];

// ── Per-company useful-life over time (for step chart) ──
// Derived from the timeline above, one row per company per year
export const usefulLifeByYear = {
  MSFT:  [{ year: 2020, life: 3 }, { year: 2021, life: 4 }, { year: 2022, life: 6 }, { year: 2023, life: 6 }, { year: 2024, life: 6 }, { year: 2025, life: 6 }],
  GOOGL: [{ year: 2020, life: 3 }, { year: 2021, life: 4 }, { year: 2022, life: 4 }, { year: 2023, life: 6 }, { year: 2024, life: 6 }, { year: 2025, life: 6 }],
  AMZN:  [{ year: 2020, life: 4 }, { year: 2021, life: 4 }, { year: 2022, life: 5 }, { year: 2023, life: 6 }, { year: 2024, life: 6 }, { year: 2025, life: 5 }],
  META:  [{ year: 2020, life: 3 }, { year: 2021, life: 4 }, { year: 2022, life: 4.5 }, { year: 2023, life: 5 }, { year: 2024, life: 5 }, { year: 2025, life: 5.5 }],
  ORCL:  [{ year: 2020, life: 4 }, { year: 2021, life: 4 }, { year: 2022, life: 4 }, { year: 2023, life: 5 }, { year: 2024, life: 6 }, { year: 2025, life: 6 }],
};

// ── Earnings boost from depreciation changes ($B) ──
export const depreciationSavings = [
  { ticker: "GOOGL", year: 2023, savingsBillions: 3.9, earningsBoostBillions: 3.0, note: "Servers 4→6yr" },
  { ticker: "MSFT",  year: 2023, savingsBillions: 3.7, earningsBoostBillions: 3.7, note: "Servers 4→6yr" },
  { ticker: "AMZN",  year: 2022, savingsBillions: 3.6, earningsBoostBillions: 3.6, note: "Servers 4→5yr" },
  { ticker: "AMZN",  year: 2024, savingsBillions: 3.1, earningsBoostBillions: 3.1, note: "Servers 5→6yr" },
  { ticker: "META",  year: 2025, savingsBillions: 2.9, earningsBoostBillions: 2.9, note: "Servers → 5.5yr" },
];

// ── Free cash flow projections ($B) ──
// Actual 2024/2025, analyst estimates for 2026
export const freeCashFlow = [
  { ticker: "AMZN",  fcf2024: 38.2, fcf2025: 25.9,  fcf2026: -17.0, capex2026: 200, source: "Morgan Stanley" },
  { ticker: "GOOGL", fcf2024: 72.8, fcf2025: 73.3,  fcf2026: 8.2,   capex2026: 175, source: "Pivotal Research" },
  { ticker: "MSFT",  fcf2024: 74.1, fcf2025: 70.0,  fcf2026: 50.4,  capex2026: 120, source: "Barclays" },
  { ticker: "META",  fcf2024: 52.1, fcf2025: 42.0,  fcf2026: 15.0,  capex2026: 125, source: "Analyst consensus" },
  { ticker: "ORCL",  fcf2024: 11.3, fcf2025: 8.5,   fcf2026: 3.0,   capex2026: 50,  source: "Analyst consensus" },
];

// ── Capex as % of operating cash flow (aggregate of big 5) ──
export const capexVsCashFlow = [
  { year: 2019, capexPctOCF: 48 },
  { year: 2020, capexPctOCF: 52 },
  { year: 2021, capexPctOCF: 54 },
  { year: 2022, capexPctOCF: 62 },
  { year: 2023, capexPctOCF: 68 },
  { year: 2024, capexPctOCF: 76 },
  { year: 2025, capexPctOCF: 94 },
  { year: 2026, capexPctOCF: 108, note: "Projected — exceeds cash flow" },
];

// ── Revenue gap (Sequoia framing) ──
// AI infrastructure spend vs AI revenue generated ($B)
export const revenueGap = [
  { year: 2023, aiInfraSpend: 50,  aiRevenue: 15,  gap: 35 },
  { year: 2024, aiInfraSpend: 150, aiRevenue: 40,  gap: 110 },
  { year: 2025, aiInfraSpend: 400, aiRevenue: 100, gap: 300 },
  { year: 2026, aiInfraSpend: 690, aiRevenue: 180, gap: 510, note: "Projected" },
];

// ── Key quotes / annotations for commentary ──
export const annotations = [
  {
    id: "burry",
    author: "Michael Burry",
    role: "Scion Asset Management",
    quote: "Understating depreciation by extending useful life of assets artificially boosts earnings — one of the more common frauds of the modern era.",
    metric: "$176B understated depreciation (2026–2028 est.)",
    source: "https://thedeepdive.ca/burry-warns-tech-depreciation-changes/",
  },
  {
    id: "sequoia",
    author: "David Cahn",
    role: "Sequoia Capital",
    quote: "AI's $600B question — the gap between the revenue needed to justify infrastructure investment and what the industry actually generates.",
    metric: "$600B+ revenue gap",
    source: "https://sequoiacap.com/article/ais-600b-question/",
  },
  {
    id: "meta-ey",
    author: "Ernst & Young",
    role: "Meta's Auditor",
    quote: "Raised concerns regarding the accounting treatment of massive data center investments, questioning whether billions in infrastructure spending should remain off-balance sheet.",
    metric: "Off-balance-sheet dispute",
    source: "https://www.asianfin.com/news/259713",
  },
  {
    id: "amazon-reversal",
    author: "Amazon",
    role: "Q4 2024 10-K Filing",
    quote: "Reduced server useful life from 6 back to 5 years, explicitly citing the rapid pace of AI and machine-learning innovation — the opposite direction of every peer.",
    metric: "6yr → 5yr reversal",
    source: "https://www.levelheadedinvesting.com/p/are-ai-chips-useful-lives-creating-useless-earnings",
  },
];
