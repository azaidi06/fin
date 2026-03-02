import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
      <p style={{ fontSize: 13, fontWeight: 600, color: "#F8FAFC", margin: "0 0 8px" }}>{label}</p>
      {payload
        .filter((p) => p.value > 0)
        .sort((a, b) => b.value - a.value)
        .map((p) => (
          <div key={p.dataKey} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: p.fill, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#CBD5E1", minWidth: 44 }}>{p.dataKey}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#F8FAFC" }}>
              ${p.value.toFixed(1)}B
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

    const sorted = Object.values(yearMap).sort((a, b) => a.year - b.year);
    return { chartData: sorted, tickers: [...tickerSet] };
  }, [data]);

  return (
    <div className="card-enter card-enter-0">
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC", marginBottom: 8 }}>
        Annual Capital Expenditure
      </h2>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>
        Billions USD, 2018 to present. Source: SEC EDGAR.
      </p>

      <div
        className="glass-card"
        style={{ padding: 20, "--card-glow": "linear-gradient(135deg, #6366F14D, transparent 60%)" }}
      >
        <ResponsiveContainer width="100%" height={420}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="year"
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
              tickFormatter={(v) => `$${v}B`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Legend
              wrapperStyle={{ fontSize: 11, color: "#94A3B8" }}
              iconType="square"
              iconSize={8}
            />
            {tickers.map((ticker) => (
              <Bar
                key={ticker}
                dataKey={ticker}
                fill={COMPANY_COLORS[ticker]}
                radius={[2, 2, 0, 0]}
                maxBarSize={16}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
