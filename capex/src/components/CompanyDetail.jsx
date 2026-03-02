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

const COMPANY_COLORS = {
  MSFT: "#00A4EF",
  GOOGL: "#4285F4",
  AMZN: "#FF9900",
  META: "#0668E1",
  AAPL: "#A2AAAD",
  NVDA: "#76B900",
  ORCL: "#F80000",
  TSLA: "#CC0000",
};

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
      <p style={{ fontSize: 13, fontWeight: 600, color: "#F8FAFC", margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontSize: 12, color: d.color, margin: 0 }}>
        ${d.value.toFixed(2)}B
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

  const color = COMPANY_COLORS[selected] || "#818CF8";

  if (!company) return null;

  return (
    <div className="card-enter card-enter-0">
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC", marginBottom: 8 }}>
        Company Details
      </h2>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>
        Quarterly and annual capital expenditure breakdown.
      </p>

      {/* Company selector */}
      <div style={{ marginBottom: 24 }}>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          style={{
            background: "rgba(30, 41, 59, 0.6)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            padding: "10px 16px",
            color: "#F8FAFC",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: "pointer",
            outline: "none",
            minWidth: 200,
          }}
        >
          {data.companies.map((c) => (
            <option key={c.ticker} value={c.ticker} style={{ background: "#1E293B" }}>
              {c.ticker} — {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Quarterly line chart */}
      <div
        className="glass-card"
        style={{ padding: 20, marginBottom: 24, "--card-glow": `linear-gradient(135deg, ${color}4D, transparent 60%)` }}
      >
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#F8FAFC", marginBottom: 16 }}>
          Quarterly Capex — {company.name}
        </h3>
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={quarterlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="label"
              tick={{ fill: "#94A3B8", fontSize: 10 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
              interval="preserveStartEnd"
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fill: "#94A3B8", fontSize: 12 }}
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
        <div style={{ padding: "16px 20px 8px", fontSize: 14, fontWeight: 600, color: "#F8FAFC" }}>
          Annual Capex — {company.name}
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#64748B", fontWeight: 600 }}>Year</th>
                <th style={{ padding: "10px 16px", textAlign: "right", color: "#64748B", fontWeight: 600 }}>Capex ($B)</th>
                <th style={{ padding: "10px 16px", textAlign: "right", color: "#64748B", fontWeight: 600 }}>YoY Growth</th>
              </tr>
            </thead>
            <tbody>
              {[...company.annual].reverse().map((a) => {
                const g = a.yoyGrowthPct;
                return (
                  <tr key={a.calendarYear} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "10px 16px", fontWeight: 600, color: "#F8FAFC" }}>
                      {a.calendarYear}
                    </td>
                    <td
                      style={{
                        padding: "10px 16px",
                        textAlign: "right",
                        color: color,
                        fontWeight: 600,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      ${a.valueBillions.toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "10px 16px",
                        textAlign: "right",
                        fontWeight: 500,
                        fontVariantNumeric: "tabular-nums",
                        color: g == null ? "#475569" : g >= 0 ? "#34D399" : "#EF4444",
                      }}
                    >
                      {g != null ? `${g >= 0 ? "+" : ""}${g.toFixed(1)}%` : "—"}
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
