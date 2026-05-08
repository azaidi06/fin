import { useMemo, useState } from "react";
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
import { getCapex, annualEntry, getOpexAnnual } from "../utils/dataShape";

const MODES = [
  { id: "total", label: "Total" },
  { id: "capex", label: "CapEx" },
  { id: "opex", label: "OpEx" },
];

function CustomTooltip({ active, payload, label, mode }) {
  if (!active || !payload?.length) return null;
  const totalEntry = payload.find((p) => p.dataKey === "__total");
  // For stacked total mode each ticker has two entries (capex/opex). For single
  // metric mode each ticker has one. Group by ticker.
  const byTicker = {};
  payload.forEach((p) => {
    if (p.dataKey === "__total" || p.value == null) return;
    const m = /^([A-Z]+)__(capex|opex)$/.exec(p.dataKey);
    if (m) {
      const t = m[1];
      const seg = m[2];
      if (!byTicker[t]) byTicker[t] = { ticker: t, capex: 0, opex: 0, fill: companyColor(t) };
      byTicker[t][seg] = p.value;
    } else {
      // Single-metric mode: dataKey is just the ticker
      const t = p.dataKey;
      if (!byTicker[t]) byTicker[t] = { ticker: t, capex: 0, opex: 0, fill: p.fill };
      if (mode === "capex") byTicker[t].capex = p.value;
      else if (mode === "opex") byTicker[t].opex = p.value;
    }
  });
  const rows = Object.values(byTicker)
    .map((r) => ({ ...r, total: r.capex + r.opex }))
    .filter((r) => r.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <div
      style={{
        background: "rgba(15, 23, 42, 0.95)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 10,
        padding: "12px 16px",
        backdropFilter: "blur(12px)",
        minWidth: 220,
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
      {rows.map((r) => (
        <div key={r.ticker} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: r.fill, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: colors.textSubtle, minWidth: 50 }}>{r.ticker}</span>
          <span className="num" style={{ fontSize: 12, fontWeight: 600, color: colors.text }}>
            {formatCurrency(r.total, { unit: "B" })}
          </span>
          {mode === "total" && (
            <span className="num" style={{ fontSize: 11, color: colors.textFaint, marginLeft: 4 }}>
              ({formatCurrency(r.capex, { unit: "B", digits: 0 })} cx + {formatCurrency(r.opex, { unit: "B", digits: 0 })} ox)
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function AnnualChart({ data }) {
  const [mode, setMode] = useState("total");

  const { chartData, tickers } = useMemo(() => {
    const yearMap = {};
    const tickerSet = new Set();

    data.companies.forEach((company) => {
      tickerSet.add(company.ticker);
      const capex = getCapex(company);
      const annualYears = new Set();
      if (capex) capex.annual.forEach((a) => annualYears.add(a.calendarYear));
      // Also include years where opex exists even if capex doesn't
      if (company?.metrics?.rd) company.metrics.rd.annual.forEach((a) => annualYears.add(a.calendarYear));
      if (company?.metrics?.sga) company.metrics.sga.annual.forEach((a) => annualYears.add(a.calendarYear));

      annualYears.forEach((year) => {
        if (year < 2018) return;
        if (!yearMap[year]) yearMap[year] = { year };
        const cx = annualEntry(capex, year)?.valueBillions ?? 0;
        const opx = getOpexAnnual(company, year).value ?? 0;
        // Stacked keys for the bar segments
        yearMap[year][`${company.ticker}__capex`] = cx;
        yearMap[year][`${company.ticker}__opex`] = opx;
        // Single-metric keys (used when mode !== 'total')
        yearMap[year][`${company.ticker}`] = mode === "capex" ? cx : mode === "opex" ? opx : cx + opx;
      });
    });

    const sorted = Object.values(yearMap)
      .sort((a, b) => a.year - b.year)
      .map((row) => {
        // Combined total per year for the trend line — always full tech spend
        let total = 0;
        Object.entries(row).forEach(([k, v]) => {
          if (k.endsWith("__capex") || k.endsWith("__opex")) total += v || 0;
        });
        return { ...row, __total: total };
      });

    return { chartData: sorted, tickers: [...tickerSet] };
  }, [data, mode]);

  const titleByMode = {
    total: "Annual Tech Spend (CapEx + OpEx)",
    capex: "Annual CapEx",
    opex: "Annual OpEx (R&D + SG&A)",
  };
  const subtitleByMode = {
    total: "Billions USD, 2018 to present. Bars stack CapEx (saturated) below OpEx (faded). Indigo line = combined total.",
    capex: "Billions USD, 2018 to present. Bars show capital expenditure only.",
    opex: "Billions USD, 2018 to present. Bars show operating tech spend (R&D + SG&A) only. AMZN R&D is unavailable.",
  };

  return (
    <div className="card-enter card-enter-0">
      <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: 8 }}>
        {titleByMode[mode]}
      </h2>
      <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 16 }}>
        {subtitleByMode[mode]} Source: SEC EDGAR.
      </p>

      {/* Mode toggle */}
      <div
        role="tablist"
        aria-label="Metric mode"
        style={{
          display: "inline-flex",
          gap: 4,
          marginBottom: 16,
          padding: 4,
          background: "rgba(30, 41, 59, 0.4)",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {MODES.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={mode === m.id}
            onClick={() => setMode(m.id)}
            style={{
              padding: "6px 14px",
              borderRadius: 7,
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "inherit",
              transition: "all 0.2s ease",
              background: mode === m.id ? "rgba(99,102,241,0.2)" : "transparent",
              color: mode === m.id ? "#A5B4FC" : "#64748B",
              boxShadow: mode === m.id ? "0 0 12px rgba(99,102,241,0.15)" : "none",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

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
            <Tooltip content={<CustomTooltip mode={mode} />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Legend
              wrapperStyle={{ fontSize: 11, color: colors.textMuted }}
              iconType="square"
              iconSize={8}
              formatter={(value) => {
                if (value === "__total") return "Combined Total";
                // hide opex stacked legend entries — capex entry covers each ticker
                if (value.endsWith("__opex")) return null;
                if (value.endsWith("__capex")) return value.split("__")[0];
                return value;
              }}
              payload={
                mode === "total"
                  ? [
                      ...tickers.map((t) => ({ value: t, type: "square", id: t, color: companyColor(t) })),
                      { value: "__total", type: "plainline", id: "__total", color: colors.indigo },
                    ]
                  : [
                      ...tickers.map((t) => ({ value: t, type: "square", id: t, color: companyColor(t) })),
                      { value: "__total", type: "plainline", id: "__total", color: colors.indigo },
                    ]
              }
            />
            {mode === "total"
              ? tickers.flatMap((ticker) => [
                  <Bar
                    key={`${ticker}__capex`}
                    dataKey={`${ticker}__capex`}
                    stackId={ticker}
                    fill={companyColor(ticker)}
                    radius={[0, 0, 0, 0]}
                    maxBarSize={16}
                  />,
                  <Bar
                    key={`${ticker}__opex`}
                    dataKey={`${ticker}__opex`}
                    stackId={ticker}
                    fill={companyColor(ticker)}
                    fillOpacity={0.4}
                    radius={[2, 2, 0, 0]}
                    maxBarSize={16}
                  />,
                ])
              : tickers.map((ticker) => (
                  <Bar
                    key={ticker}
                    dataKey={ticker}
                    fill={companyColor(ticker)}
                    fillOpacity={mode === "opex" ? 0.6 : 1}
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
