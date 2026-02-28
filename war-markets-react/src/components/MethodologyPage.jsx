const card = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 24 };
const sectionTitle = { fontSize: 17, fontWeight: 600, color: "#F8FAFC", marginBottom: 12 };
const formula = {
  background: "#0F172A", border: "1px solid #334155", borderRadius: 8,
  padding: "14px 18px", fontFamily: "monospace", fontSize: 13,
  color: "#818CF8", marginBottom: 12, overflowX: "auto",
};
const example = {
  background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8,
  padding: "12px 16px", fontSize: 12, color: "#94A3B8", marginBottom: 12, lineHeight: 1.6,
};
const prose = { fontSize: 13, color: "#CBD5E1", lineHeight: 1.7, marginBottom: 12 };
const label = { fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 };

export default function MethodologyPage({ onClose }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", marginBottom: 4 }}>Our Methodology</h2>
          <p style={{ fontSize: 14, color: "#94A3B8" }}>How every number on this site is determined</p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "#334155", border: "1px solid #475569", borderRadius: 8,
            color: "#F8FAFC", padding: "8px 16px", fontSize: 13, cursor: "pointer",
            fontWeight: 500, transition: "all 0.15s",
          }}
        >
          Back to Dashboard
        </button>
      </div>

      {/* ── DRAWDOWN ── */}
      <section style={card}>
        <h3 style={sectionTitle}>Maximum Drawdown (Post-Conflict Reaction)</h3>
        <p style={prose}>
          The <strong>maximum drawdown</strong> measures the peak-to-trough decline from the last trading close
          before each conflict's start event. We use the closing price on the day immediately preceding the event
          as our reference point.
        </p>
        <p style={label}>Formula</p>
        <div style={formula}>
          Drawdown % = ((Pre-war Close - Bottom Close) / Pre-war Close) × 100
        </div>
        <p style={label}>Example — NASDAQ, Gulf War</p>
        <div style={example}>
          Pre-war close (Aug 1, 1990): <strong style={{ color: "#F8FAFC" }}>$428.90</strong><br />
          Bottom close (Oct 16, 1990): <strong style={{ color: "#F8FAFC" }}>$325.40</strong><br />
          Drawdown = ((428.90 - 325.40) / 428.90) × 100 = <strong style={{ color: "#10B981" }}>24.1%</strong>
        </div>
        <p style={prose}>
          <strong>Days to Bottom</strong> counts trading days (weekdays minus market holidays) from the
          conflict start date to the lowest close. <strong>Days to Recover</strong> counts trading
          days from that bottom until the index first closes at or above the pre-war close.
        </p>
        <p style={prose}>
          For conflicts before 1957, we use the Dow Jones Industrial Average (DJIA) as a proxy for the
          S&P 500, since the modern S&P 500 index was not launched until March 4, 1957. The DJIA and
          S&P 500 have historically shown 0.95+ correlation over multi-week windows.
        </p>
      </section>

      {/* ── PRE-WAR BUILDUP ── */}
      <section style={card}>
        <h3 style={sectionTitle}>Pre-War Market Buildup</h3>
        <p style={prose}>
          This measures how markets performed during the identifiable run-up to each conflict. The
          <strong> buildup window</strong> starts at the first clear escalation signal (e.g., troop
          movements, diplomatic ultimatums) and ends at the close before the actual conflict start.
        </p>
        <p style={label}>Formula</p>
        <div style={formula}>
          Change % = ((End Close - Start Close) / Start Close) × 100
        </div>
        <p style={label}>Example — S&P 500, Iraq War buildup</p>
        <div style={example}>
          Start close (Nov 27, 2002): <strong style={{ color: "#F8FAFC" }}>$938.87</strong><br />
          End close (Mar 11, 2003): <strong style={{ color: "#F8FAFC" }}>$800.73</strong><br />
          Change = ((800.73 - 938.87) / 938.87) × 100 = <strong style={{ color: "#EF4444" }}>-14.7%</strong>
        </div>
        <p style={prose}>
          <strong>Surprise events</strong> (marked with faded bars) had no identifiable buildup period.
          For these conflicts — the Korean invasion and 9/11 — we show the market's prior 3-month
          trajectory for context, but label them clearly since no anticipatory selloff was possible.
          Positive values indicate the market was rising before the surprise.
        </p>
      </section>

      {/* ── NASDAQ/S&P RATIO ── */}
      <section style={card}>
        <h3 style={sectionTitle}>NASDAQ / S&P 500 Ratio</h3>
        <p style={prose}>
          For the three conflicts where both indices have data (Gulf War, 9/11, Iraq War), we compute
          the ratio of NASDAQ's maximum drawdown to the S&P 500's maximum drawdown. This indicates
          whether tech-heavy stocks (NASDAQ) over- or under-reacted relative to the broader market.
        </p>
        <p style={label}>Formula</p>
        <div style={formula}>
          Ratio = NASDAQ Drawdown % / S&P 500 Drawdown %
        </div>
        <p style={label}>Example — Gulf War</p>
        <div style={example}>
          NASDAQ drawdown: <strong style={{ color: "#34D399" }}>24.1%</strong><br />
          S&P 500 drawdown: <strong style={{ color: "#818CF8" }}>16.9%</strong><br />
          Ratio = 24.1 / 16.9 = <strong style={{ color: "#F8FAFC" }}>1.43x</strong> — NASDAQ fell 43% harder
        </div>
        <p style={prose}>
          A ratio above 1.0 means NASDAQ fell more than the S&P; below 1.0 means it was more resilient.
        </p>
      </section>

      {/* ── GLOBAL MARKETS ── */}
      <section style={card}>
        <h3 style={sectionTitle}>Global Markets & Data Quality</h3>
        <p style={prose}>
          Global index data is sourced from each exchange's historical records. We assign a
          <strong> data quality</strong> rating to each conflict based on how many indices existed and
          how reliable the data is:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 16px", marginBottom: 12, fontSize: 13 }}>
          <span style={{ color: "#34D399", fontWeight: 600 }}>High</span>
          <span style={{ color: "#CBD5E1" }}>3+ indices with exact daily data (Gulf War, 9/11)</span>
          <span style={{ color: "#FBBF24", fontWeight: 600 }}>Medium</span>
          <span style={{ color: "#CBD5E1" }}>Multiple indices but some approximate (Iraq War)</span>
          <span style={{ color: "#FB923C", fontWeight: 600 }}>Low</span>
          <span style={{ color: "#CBD5E1" }}>1-2 indices, partial records (WWII, Korea)</span>
          <span style={{ color: "#94A3B8", fontWeight: 600 }}>Minimal</span>
          <span style={{ color: "#CBD5E1" }}>Only S&P 500 / DJIA available (Vietnam)</span>
        </div>
        <p style={prose}>
          Values marked with <strong>~</strong> (tilde) are approximate — reconstructed from weekly/monthly
          data or secondary sources rather than exact daily closes. Caveats (e.g., Nikkei's bubble burst
          overlapping the Gulf War) are noted inline.
        </p>
        <p style={prose}>
          Key index launch dates: FTSE 100 (1984), DAX (1988), Hang Seng (1969), Nikkei 225
          (re-established 1949). The FT 30 (predecessor to FTSE 100) launched in 1935 and provides
          our only UK data for WWII.
        </p>
      </section>

      {/* ── CPI / INFLATION ── */}
      <section style={card}>
        <h3 style={sectionTitle}>CPI Inflation Trajectory</h3>
        <p style={prose}>
          We plot the Consumer Price Index year-over-year percentage change for each conflict, aligned
          on a relative timeline where <strong>T=0</strong> is the year the conflict began. This allows
          direct comparison of inflation patterns across eras.
        </p>
        <p style={label}>Data source</p>
        <div style={example}>
          <strong style={{ color: "#F8FAFC" }}>Post-1947:</strong> BLS / FRED series CPIAUCSL (CPI for All Urban
          Consumers, seasonally adjusted, annual averages)<br />
          <strong style={{ color: "#F8FAFC" }}>Pre-1947:</strong> Minneapolis Fed Historical Consumer Price Index tables
        </div>
        <p style={prose}>
          <strong>Peak CPI</strong> shown in the summary cards is the single highest annual CPI YoY%
          reading in the T=0 through T+10 window.
        </p>
      </section>

      {/* ── DEBT / GDP ── */}
      <section style={card}>
        <h3 style={sectionTitle}>Federal Debt / GDP</h3>
        <p style={prose}>
          Federal debt as a percentage of GDP is plotted on the same T-relative timeline as CPI. This
          uses gross federal debt (not just publicly held debt).
        </p>
        <p style={label}>Data source</p>
        <div style={example}>
          FRED series <strong style={{ color: "#F8FAFC" }}>GFDGDPA188S</strong> — Federal Debt: Total Public Debt
          as Percent of Gross Domestic Product (annual, fiscal year)
        </div>
        <p style={label}>Debt/GDP Delta (Δ) formula</p>
        <div style={formula}>
          Δ = Debt/GDP at T+10 − Debt/GDP at T=0
        </div>
        <p style={label}>Example — WWII</p>
        <div style={example}>
          Debt/GDP at T=0 (1941): <strong style={{ color: "#F8FAFC" }}>42.3%</strong><br />
          Peak Debt/GDP at T+5 (1946): <strong style={{ color: "#F8FAFC" }}>118.4%</strong><br />
          Debt/GDP at T+10 (1951): <strong style={{ color: "#F8FAFC" }}>66.8%</strong><br />
          Δ = 118.4 - 42.3 = <strong style={{ color: "#EF4444" }}>+76.1 percentage points</strong>
          <br /><em style={{ color: "#64748B" }}>(Note: Δ uses peak value for WWII since the rapid postwar GDP boom compressed the ratio by T+10)</em>
        </div>
        <p style={prose}>
          Negative deltas (e.g., Korea: -34.6 pp) indicate that rapid GDP growth outpaced any increase in
          nominal debt, causing the ratio to fall over the decade.
        </p>
      </section>

      {/* ── COST OF LIVING / CPI ADJUSTMENT ── */}
      <section style={card}>
        <h3 style={sectionTitle}>Cost of Living — CPI Adjustment</h3>
        <p style={prose}>
          All prices are displayed in <strong>2024 USD</strong> to enable fair cross-era comparison.
          Nominal prices are the actual prices paid in each era's dollars. We convert them using CPI-U
          annual average multipliers from the Bureau of Labor Statistics.
        </p>
        <p style={label}>Formula</p>
        <div style={formula}>
          Adjusted Price (2024 USD) = Nominal Price × CPI Multiplier
          {"\n"}
          CPI Multiplier = CPI-U (2024 annual avg) / CPI-U (era year annual avg)
        </div>
        <p style={label}>Multipliers used</p>
        <div style={{ overflowX: "auto", marginBottom: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Era", "Year", "CPI Multiplier", "Meaning"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "6px 12px", color: "#64748B", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #334155" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["WWII", "1941", "21.29×", "$1 in 1941 = $21.29 in 2024"],
                ["Korea", "1950", "12.99×", "$1 in 1950 = $12.99 in 2024"],
                ["Vietnam", "1964", "10.10×", "$1 in 1964 = $10.10 in 2024"],
                ["Gulf War", "1990", "2.39×", "$1 in 1990 = $2.39 in 2024"],
                ["9/11", "2001", "1.77×", "$1 in 2001 = $1.77 in 2024"],
                ["Iraq", "2003", "1.70×", "$1 in 2003 = $1.70 in 2024"],
                ["Today", "2024", "1.00×", "No adjustment needed"],
              ].map(([era, year, mult, meaning]) => (
                <tr key={era}>
                  <td style={{ padding: "6px 12px", color: "#F8FAFC", fontWeight: 500, borderBottom: "1px solid #1E293B" }}>{era}</td>
                  <td style={{ padding: "6px 12px", color: "#CBD5E1", borderBottom: "1px solid #1E293B" }}>{year}</td>
                  <td style={{ padding: "6px 12px", color: "#818CF8", fontWeight: 600, fontFamily: "monospace", borderBottom: "1px solid #1E293B" }}>{mult}</td>
                  <td style={{ padding: "6px 12px", color: "#94A3B8", fontSize: 12, borderBottom: "1px solid #1E293B" }}>{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={label}>Example — Median home price, WWII era</p>
        <div style={example}>
          Nominal price (1941): <strong style={{ color: "#F8FAFC" }}>$2,938</strong><br />
          CPI multiplier: <strong style={{ color: "#818CF8" }}>21.29×</strong><br />
          Adjusted = $2,938 × 21.29 = <strong style={{ color: "#10B981" }}>$62,550</strong> in 2024 dollars
        </div>
        <p style={prose}>
          Nominal prices are sourced from the Census Bureau (housing), EIA (gasoline), USDA (food prices),
          NCES (college tuition), and BLS (income data). These are national averages or medians as reported
          by each agency for the respective year.
        </p>
      </section>

      {/* ── DATA SOURCES ── */}
      <section style={card}>
        <h3 style={sectionTitle}>Complete Data Sources</h3>

        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <p style={{ ...label, color: "#818CF8" }}>Market Data</p>
            <ul style={{ ...prose, paddingLeft: 20, margin: 0 }}>
              <li><strong>Yahoo Finance (via yfinance)</strong> — Daily closing prices for S&P 500, NASDAQ Composite, DJIA</li>
              <li><strong>iSectors</strong> — Historical drawdown verification and recovery timelines</li>
              <li><strong>Hennion & Walsh / The Motley Fool</strong> — Cross-reference for pre-war market levels and event dates</li>
              <li><strong>CFA Institute / Invesco</strong> — Research papers on conflict-era market behavior</li>
            </ul>
          </div>

          <div>
            <p style={{ ...label, color: "#10B981" }}>Global Indices</p>
            <ul style={{ ...prose, paddingLeft: 20, margin: 0 }}>
              <li><strong>FTSE Group</strong> — FTSE 100 and FT 30 historical data</li>
              <li><strong>Japan Exchange Group</strong> — Nikkei 225 historical data</li>
              <li><strong>Deutsche Börse</strong> — DAX performance index history</li>
              <li><strong>Euronext</strong> — CAC 40 historical data</li>
              <li><strong>HKEX</strong> — Hang Seng Index historical data</li>
            </ul>
          </div>

          <div>
            <p style={{ ...label, color: "#FBBF24" }}>Economic & Fiscal Data</p>
            <ul style={{ ...prose, paddingLeft: 20, margin: 0 }}>
              <li><strong>FRED / BLS</strong> — CPIAUCSL (CPI-U) for inflation data; CPI-U annual averages for price adjustments</li>
              <li><strong>FRED</strong> — GFDGDPA188S for federal debt as % of GDP</li>
              <li><strong>Minneapolis Fed</strong> — Historical CPI tables for pre-1947 data</li>
            </ul>
          </div>

          <div>
            <p style={{ ...label, color: "#F59E0B" }}>Cost of Living</p>
            <ul style={{ ...prose, paddingLeft: 20, margin: 0 }}>
              <li><strong>Census Bureau</strong> — Median home prices (annual)</li>
              <li><strong>EIA (Energy Information Administration)</strong> — Retail gasoline prices</li>
              <li><strong>USDA</strong> — Food prices (milk, eggs, bread)</li>
              <li><strong>NCES (National Center for Education Statistics)</strong> — Average college tuition</li>
              <li><strong>BLS</strong> — Median annual income</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── LIMITATIONS ── */}
      <section style={card}>
        <h3 style={sectionTitle}>Limitations & Caveats</h3>
        <ul style={{ ...prose, paddingLeft: 20, margin: 0 }}>
          <li style={{ marginBottom: 8 }}>
            <strong>Correlation ≠ Causation:</strong> Market declines during conflicts were often compounded by
            other factors (dot-com bust during 9/11, Japanese bubble during the Gulf War). We note these
            overlaps but cannot fully isolate war-specific effects.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>Pre-1957 S&P data:</strong> The S&P 500 began in 1957. For WWII, Korea, and Vietnam,
            we use the DJIA as a proxy. While highly correlated, the DJIA's 30-stock composition differs
            from the S&P 500's broader 500-stock universe.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>Approximate values:</strong> Some global index data (especially pre-1990) is reconstructed
            from weekly or monthly closing data, not exact daily closes. These are marked with ~.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>CPI multipliers:</strong> We use annual average CPI-U values, not month-specific adjustments.
            Intra-year price volatility is smoothed out.
          </li>
          <li>
            <strong>Cost of living:</strong> Prices represent national averages/medians. Regional variation
            was significant in every era and is not captured here.
          </li>
        </ul>
      </section>
    </div>
  );
}
