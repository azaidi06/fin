import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { colors, companyColor } from "../theme/tokens";
import { formatCurrency, formatPercent } from "../utils/formatters";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
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
      <p style={{ fontSize: 13, fontWeight: 600, color: colors.text, margin: "0 0 4px" }}>{label}</p>
      <p className="num" style={{ fontSize: 12, color: d.color, margin: 0 }}>
        {formatCurrency(d.value, { unit: "B", digits: 2 })}
      </p>
    </div>
  );
}

export default function CompanyDetail({ data }) {
  const [selected, setSelected] = useState(data.companies[0]?.ticker || "MSFT");

  const company = useMemo(
    () => data.companies.find((c) => c.ticker === selected),
    [data, selected]
  );

  const quarterlyData = useMemo(() => {
    if (!company) return [];
    return company.quarterly.map((q) => ({
      period: q.period,
      label: `${q.calendarYear} Q${q.calendarQuarter}`,
      value: q.valueBillions,
    }));
  }, [company]);

  const color = companyColor(selected);

  if (!company) return null;

  return (
    <div className="card-enter card-enter-0">
      <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: 8 }}>
        Company Details
      </h2>
      <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 24 }}>
        Quarterly and annual capital expenditure breakdown.
      </p>

      {/* Phase 2D: pill-row company picker (replaces native <select>) */}
      <div
        role="tablist"
        aria-label="Select company"
        style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}
      >
        {data.companies.map((c) => {
          const isActive = c.ticker === selected;
          const tickerColor = companyColor(c.ticker);
          return (
            <button
              key={c.ticker}
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelected(c.ticker)}
              className={`ticker-pill${isActive ? " is-active" : ""}`}
              style={isActive ? { color: tickerColor, borderColor: `${tickerColor}66`, boxShadow: `0 0 12px ${tickerColor}22` } : undefined}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: tickerColor,
                    display: "inline-block",
                    opacity: isActive ? 1 : 0.7,
                  }}
                />
                {c.ticker}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quarterly line chart */}
      <div
        className="glass-card"
        style={{ padding: 20, marginBottom: 24, "--card-glow": `linear-gradient(135deg, ${color}4D, transparent 60%)` }}
      >
        <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 16 }}>
          Quarterly Capex — {company.name}
        </h3>
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={quarterlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="label"
              tick={{ fill: colors.textMuted, fontSize: 10 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
              interval="preserveStartEnd"
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fill: colors.textMuted, fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
              tickFormatter={(v) => `$${v}B`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: "#0F172A", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Annual data table */}
      <div
        className="glass-card"
        style={{ padding: 0, overflow: "hidden", "--card-glow": `linear-gradient(135deg, ${color}4D, transparent 60%)` }}
      >
        <div style={{ padding: "16px 20px 8px", fontSize: 14, fontWeight: 600, color: colors.text }}>
          Annual Capex — {company.name}
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="num" style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <th style={{ padding: "10px 16px", textAlign: "left", color: colors.textFaint, fontWeight: 600 }}>Year</th>
                <th style={{ padding: "10px 16px", textAlign: "right", color: colors.textFaint, fontWeight: 600 }}>Capex ($B)</th>
                <th style={{ padding: "10px 16px", textAlign: "right", color: colors.textFaint, fontWeight: 600 }}>YoY Growth</th>
              </tr>
            </thead>
            <tbody>
              {[...company.annual].reverse().map((a) => {
                const g = a.yoyGrowthPct;
                return (
                  <tr key={a.calendarYear} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "10px 16px", fontWeight: 600, color: colors.text }}>
                      {a.calendarYear}
                    </td>
                    <td
                      style={{
                        padding: "10px 16px",
                        textAlign: "right",
                        color,
                        fontWeight: 600,
                      }}
                    >
                      {formatCurrency(a.valueBillions, { unit: "B", digits: 2 })}
                    </td>
                    <td
                      style={{
                        padding: "10px 16px",
                        textAlign: "right",
                        fontWeight: 500,
                        color: g == null ? colors.textGhost : g >= 0 ? colors.success : colors.danger,
                      }}
                    >
                      {g != null ? formatPercent(g, { digits: 1 }) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
