import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { colors, companyColor } from "../theme/tokens";
import { formatPercent } from "../utils/formatters";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      style={{
        background: "rgba(15, 23, 42, 0.95)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 10,
        padding: "12px 16px",
        backdropFilter: "blur(12px)",
      }}
    >
      <p style={{ fontSize: 13, fontWeight: 600, color: colors.text, margin: "0 0 4px" }}>
        {d.ticker} — {d.name}
      </p>
      <p
        className="num"
        style={{ fontSize: 12, color: d.growth >= 0 ? colors.success : colors.danger, margin: 0 }}
      >
        {formatPercent(d.growth, { digits: 1 })} YoY
      </p>
    </div>
  );
}

export default function GrowthChart({ data }) {
  const growthData = useMemo(() => {
    return data.companies
      .map((c) => ({
        ticker: c.ticker,
        name: c.name,
        growth: c.latestAnnual?.yoyGrowthPct ?? 0,
        year: c.latestAnnual?.calendarYear,
      }))
      .sort((a, b) => b.growth - a.growth);
  }, [data]);

  // Historical growth table data — last 5 years
  const historyData = useMemo(() => {
    const years = new Set();
    data.companies.forEach((c) => {
      c.annual.forEach((a) => {
        if (a.yoyGrowthPct != null && a.calendarYear >= 2020) years.add(a.calendarYear);
      });
    });
    return [...years].sort((a, b) => b - a);
  }, [data]);

  return (
    <div className="card-enter card-enter-0">
      <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: 8 }}>
        Year-over-Year Growth
      </h2>
      <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 24 }}>
        Latest annual capex growth rate by company.
      </p>

      {/* Horizontal bar chart */}
      <div
        className="glass-card"
        style={{ padding: 20, marginBottom: 24, "--card-glow": "linear-gradient(135deg, #34D3994D, transparent 60%)" }}
      >
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={growthData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: colors.textMuted, fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="ticker"
              tick={{ fill: colors.text, fontSize: 13, fontWeight: 600 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="growth" radius={[0, 4, 4, 0]} maxBarSize={28}>
              {growthData.map((entry) => (
                <Cell
                  key={entry.ticker}
                  fill={entry.growth >= 0 ? colors.success : colors.danger}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Historical growth table */}
      <div
        className="glass-card"
        style={{ padding: 0, overflow: "hidden", "--card-glow": "linear-gradient(135deg, #818CF84D, transparent 60%)" }}
      >
        <div style={{ padding: "16px 20px 8px", fontSize: 14, fontWeight: 600, color: colors.text }}>
          Historical YoY Growth (%)
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="num" style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <th style={{ padding: "10px 16px", textAlign: "left", color: colors.textFaint, fontWeight: 600 }}>Company</th>
                {historyData.map((year) => (
                  <th
                    key={year}
                    style={{ padding: "10px 12px", textAlign: "right", color: colors.textFaint, fontWeight: 600 }}
                  >
                    {year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.companies.map((c) => (
                <tr key={c.ticker} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td
                    style={{ padding: "10px 16px", fontWeight: 600, color: companyColor(c.ticker) }}
                  >
                    {c.ticker}
                  </td>
                  {historyData.map((year) => {
                    const annualEntry = c.annual.find((a) => a.calendarYear === year);
                    const g = annualEntry?.yoyGrowthPct;
                    return (
                      <td
                        key={year}
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          fontWeight: 500,
                          color: g == null ? colors.textGhost : g >= 0 ? colors.success : colors.danger,
                        }}
                      >
                        {g != null ? formatPercent(g, { digits: 1 }) : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
