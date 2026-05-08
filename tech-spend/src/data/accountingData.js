/*
 * Curated data on AI capex accounting concerns.
 *
 * Sources:
 *   - SEC 10-K filings (MSFT, GOOGL, AMZN, META, ORCL)
 *   - Sequoia Capital "AI's $600B Question" (Sep 2024)
 *   - Michael Burry / Scion Asset Management (2025)
 *   - Morgan Stanley, Pivotal Research, Barclays analyst notes
 *   - CNBC, Yahoo Finance, SiliconANGLE reporting
 *   - Independent analysts, Substack researchers, academics (see annotations)
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
// Organized by theme for grouped display

export const commentaryThemes = [
  {
    theme: "Accounting & Depreciation",
    color: "#EF4444",
    entries: [
      {
        author: "Michael Burry",
        role: "Scion Asset Management",
        quote: "Understating depreciation by extending useful life of assets artificially boosts earnings — one of the more common frauds of the modern era.",
        metric: "$176B understated depreciation (2026–2028 est.)",
        source: "https://thedeepdive.ca/burry-warns-tech-depreciation-changes/",
      },
      {
        author: "Olga Usvyatsky",
        role: "Fmr. VP Research, Audit Analytics",
        quote: "A small change of several months in depreciation policies can change earnings in a given quarter by billions.",
        metric: "$298M quarterly hit from Amazon's reversal alone",
        source: "https://deepquarry.substack.com/p/depreciation-of-gpus-between-useful",
      },
      {
        author: "Stephen Clapham",
        role: "Behind the Balance Sheet (Substack)",
        quote: "Capex understates the true level of investment, free cash flow overstates the underlying economics, and valuations assume returns on AI-driven spending will be in line with historical levels.",
        metric: "$88B off-balance-sheet gap · $1.5T gross fixed assets",
        source: "https://behindthebalancesheet.substack.com/p/the-hyperscaler-capex-illusion-375",
      },
      {
        author: "Oscar Mackereth",
        role: "Cerno Capital",
        quote: "Extending depreciation from 3 to 6 years reduces collective data-center depreciation from ~$39B to ~$21B — a 46% reduction. GPUs represent 60–80% of data center total cost of ownership.",
        metric: "46% depreciation reduction industry-wide",
        source: "https://cernocapital.com/accounting-for-ai-financial-accounting-issues-and-capital-deployment-in-the-hyperscaler-landscape",
      },
      {
        author: "Ernst & Young",
        role: "Meta's Auditor",
        quote: "Raised concerns regarding the accounting treatment of massive data center investments, questioning whether billions in infrastructure spending should remain off-balance sheet.",
        metric: "Off-balance-sheet dispute",
        source: "https://www.asianfin.com/news/259713",
      },
      {
        author: "Amazon",
        role: "Q4 2024 10-K Filing",
        quote: "Reduced server useful life from 6 back to 5 years, explicitly citing the rapid pace of AI and machine-learning innovation — the opposite direction of every peer.",
        metric: "6yr → 5yr reversal",
        source: "https://www.levelheadedinvesting.com/p/are-ai-chips-useful-lives-creating-useless-earnings",
      },
    ],
  },
  {
    theme: "The Revenue Gap",
    color: "#F59E0B",
    entries: [
      {
        author: "David Cahn",
        role: "Sequoia Capital",
        quote: "AI's $600B question — the gap between the revenue needed to justify infrastructure investment and what the industry actually generates.",
        metric: "$600B+ annual revenue gap",
        source: "https://sequoiacap.com/article/ais-600b-question/",
      },
      {
        author: "Harris Kupperman",
        role: "Praetorian Capital (hedge fund)",
        quote: "There just isn't enough revenue and there never can be enough revenue. The world just doesn't have the ability to pay for this much AI. Current gross margins on AI data center operations: -1900%.",
        metric: "-1900% gross margins · $480B revenue needed for 20% ROIC",
        source: "https://pracap.com/global-crossing-reborn/",
      },
      {
        author: "Ed Zitron",
        role: "Where's Your Ed At (newsletter)",
        quote: "Everybody is losing money on AI. Every single startup, every single hyperscaler. Of Microsoft's 440M 365 subscribers, only 8 million have paid Copilot licenses — a 1.8% adoption rate.",
        metric: "1.8% Copilot adoption · $5B OpenAI annual burn",
        source: "https://www.wheresyoured.at/big-tech-2tr/",
      },
      {
        author: "Coastal Journal",
        role: "Independent research (Substack)",
        quote: "When supply compounds materially faster than demand — even in a revolutionary technology — pricing breaks. Infrastructure usually survives; equity holders are the ones who eat the gap.",
        metric: "$610B+ capex vs stalled usage growth",
        source: "https://coastaljournal.substack.com/p/ais-dark-compute-moment-efficiency",
      },
    ],
  },
  {
    theme: "Circular Financing & Stranded Assets",
    color: "#8B5CF6",
    entries: [
      {
        author: "Tony Grayson",
        role: "Fmr. SVP Meta (30+ data centers)",
        quote: "CoreWeave's $18.8B debt load isn't evidence of demand — it's evidence of the gap between demand and the economics of serving it. Facilities built for 6–10kW racks are stranded assets today.",
        metric: "$18.8B CoreWeave debt · 600kW racks by 2027",
        source: "https://www.tonygrayson.ai/post/nvidia-vendor-financing-infrastructure-risks",
      },
      {
        author: "Dave Friedman",
        role: "Buy the Rumor; Sell the News (Substack)",
        quote: "We're watching the financialization of AI infrastructure collide with the commoditization of AI compute. Meta's $27B Hyperion data center JV is risk laundering — leverage repackaged through SPV structures.",
        metric: "$27B off-balance-sheet via SPVs",
        source: "https://davefriedman.substack.com/p/ai-capex-built-on-options-priced",
      },
      {
        author: "Lance Roberts",
        role: "Real Investment Advice",
        quote: "If you subtract AI-related capex from GDP, U.S. economic growth is significantly weaker than advertised. AI capex is capital-intensive but not labor-intensive, and does not produce broad-based economic benefits.",
        metric: "AI capex = ~1.2% of GDP",
        source: "https://realinvestmentadvice.com/resources/blog/capex-spending-on-ai-is-masking-economic-weakness/",
      },
    ],
  },
  {
    theme: "Bubble Parallels & Academic Research",
    color: "#06B6D4",
    entries: [
      {
        author: "Kai Wu",
        role: "Sparkline Capital (quant firm)",
        quote: "Companies aggressively growing their balance sheets underperformed conservative peers by 8.4% annually from 1963 to 2025. AI capex has surged from 4% of revenue in 2012 to 15% today — surpassing even the railroad buildout as a share of GDP.",
        metric: "8.4% annual underperformance for asset-heavy firms",
        source: "https://www.sparklinecapital.com/post/surviving-the-ai-capex-boom",
      },
      {
        author: "Justin Kollar",
        role: "MIT PhD, Technostatecraft",
        quote: "Cisco's market cap peaked at ~$500B (4% of GDP). Nvidia's sits at $4T (14% of GDP). Unlike fiber, which retained some value after the crash, GPUs depreciate quickly as new generations displace old ones.",
        metric: "Cisco fell 88% peak-to-trough",
        source: "https://www.technostatecraft.com/p/cisco-nvidia-and-the-economics-of",
      },
      {
        author: "Basele, Phillips & Shi",
        role: "Yale Cowles Foundation",
        quote: "Statistically significant speculative bubbles identified in all Magnificent Seven stocks during the AI boom. The surges cannot be fully explained by fundamentals or industry trends.",
        metric: "Bubbles persist in 6 of 7 Mag-7 stocks",
        source: "https://cowles.yale.edu/research/cfdp-2430-speculative-bubbles-recent-ai-boom-nasdaq-and-magnificent-seven",
      },
      {
        author: "Sonnenfeld & Henriques",
        role: "Yale School of Management",
        quote: "AI-related stocks accounted for 75% of S&P 500 returns, 80% of earnings growth, and 90% of capital spending growth. An MIT study found 95% of organizations achieved zero ROI from GenAI.",
        metric: "95% zero ROI from GenAI (MIT study)",
        source: "https://insights.som.yale.edu/insights/this-is-how-the-ai-bubble-bursts",
      },
      {
        author: "Alap Shah & James van Geelen",
        role: "Citrini Research (ex-Viking, ex-Citadel)",
        quote: "AI creates a Human Intelligence Displacement Spiral — automation reduces payrolls, weakens consumer demand, prompts further cost-cutting. This isn't traditional infrastructure investment, it's OpEx substitution.",
        metric: "Projects 10.2% unemployment in crisis scenario",
        source: "https://www.citriniresearch.com/p/2028gic",
      },
    ],
  },
];

// Flat list for backward compat
export const annotations = commentaryThemes.flatMap((t) => t.entries);
