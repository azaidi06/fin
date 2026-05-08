import { useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { colors, companyColor } from "../theme/tokens";
import { formatCurrency } from "../utils/formatters";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  // Separate the cumulative total line from the per-company bars
  const totalEntry = payload.find((p) => p.dataKey === "__total");
  const barEntries = payload
    .filter((p) => p.dataKey !== "__total" && p.value > 0)
    .sort((a, b) => b.value - a.value);
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
      <p style={{ fontSize: 13, fontWeight: 600, color: colors.text, margin: "0 0 8px" }}>{label}</p>
      {totalEntry && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
            paddingBottom: 8,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ width: 12, height: 2, background: colors.indigo, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: colors.textSubtle, minWidth: 70 }}>Combined</span>
          <span className="num" style={{ fontSize: 12, fontWeight: 700, color: colors.text }}>
            {formatCurrency(totalEntry.value, { unit: "B" })}
          </span>
        </div>
      )}
      {barEntries.map((p) => (
        <div key={p.dataKey} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: p.fill, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: colors.textSubtle, minWidth: 44 }}>{p.dataKey}</span>
          <span className="num" style={{ fontSize: 12, fontWeight: 600, color: colors.text }}>
            {formatCurrency(p.value, { unit: "B" })}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AnnualChart({ data }) {
  const { chartData, tickers } = useMemo(() => {
    const yearMap = {};
    const tickerSet = new Set();

    data.companies.forEach((company) => {
      tickerSet.add(company.ticker);
      company.annual.forEach((a) => {
        if (a.calendarYear < 2018) return;
        if (!yearMap[a.calendarYear]) yearMap[a.calendarYear] = { year: a.calendarYear };
        yearMap[a.calendarYear][company.ticker] = a.valueBillions;
      });
    });

    // Compute combined total per year for the trend line
    const sorted = Object.values(yearMap)
      .sort((a, b) => a.year - b.year)
      .map((row) => {
        const total = Object.entries(row)
          .filter(([k]) => k !== "year")
          .reduce((sum, [, v]) => sum + (v || 0), 0);
        return { ...row, __total: total };
      });

    return { chartData: sorted, tickers: [...tickerSet] };
  }, [data]);

  return (
    <div className="card-enter card-enter-0">
      <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: 8 }}>
        Annual Capital Expenditure
      </h2>
      <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 24 }}>
        Billions USD, 2018 to present. Indigo line shows combined total across all 8 companies. Source: SEC EDGAR.
      </p>

      <div
        className="glass-card"
        style={{ padding: 20, "--card-glow": "linear-gradient(135deg, #6366F14D, transparent 60%)" }}
      >
        <ResponsiveContainer width="100%" height={440}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="year"
              tick={{ fill: colors.textMuted, fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: colors.textMuted, fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
              tickFormatter={(v) => `$${v}B`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Legend
              wrapperStyle={{ fontSize: 11, color: colors.textMuted }}
              iconType="square"
              iconSize={8}
              formatter={(value) => (value === "__total" ? "Combined Total" : value)}
            />
            {tickers.map((ticker) => (
              <Bar
                key={ticker}
                dataKey={ticker}
                fill={companyColor(ticker)}
                radius={[2, 2, 0, 0]}
                maxBarSize={16}
              />
            ))}
            <Line
              type="monotone"
              dataKey="__total"
              name="__total"
              stroke={colors.indigo}
              strokeWidth={3}
              dot={{ r: 4, fill: colors.indigo, stroke: "#0F172A", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: colors.indigoSoft, stroke: "#0F172A", strokeWidth: 2 }}
              isAnimationActive={true}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
