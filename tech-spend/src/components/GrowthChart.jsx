import { useMemo, useState } from "react";
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
import { companyColor } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";
import { formatPercent } from "../utils/formatters";
import { getCapex, getRd, getSga, annualEntry, getOpexAnnual } from "../utils/dataShape";

const MODES = [
  { id: "capex", label: "CapEx YoY" },
  { id: "opex", label: "OpEx YoY" },
];

function CustomTooltip({ active, payload, mode }) {
  const colors = useTheme().tokens;
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const label = mode === "opex" ? "OpEx YoY" : "CapEx YoY";
  return (
    <div
      style={{
        background: colors.tooltipBg,
        border: `1px solid ${colors.tooltipBorder}`,
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
        {formatPercent(d.growth, { digits: 1 })} {label}
      </p>
      {d.partial && (
        <p style={{ fontSize: 11, color: colors.warning, margin: "4px 0 0" }}>
          partial — one OpEx component missing
        </p>
      )}
    </div>
  );
}

/**
 * Compute an OpEx YoY % for a given year on a company.
 * Returns { growth: number|null, partial: bool } where partial is true when
 * one of R&D/SG&A is missing for the comparison.
 */
function opexYoY(company, year) {
  const cur = getOpexAnnual(company, year);
  const prev = getOpexAnnual(company, year - 1);
  if (cur.value == null || prev.value == null || prev.value === 0) {
    return { growth: null, partial: cur.partial || prev.partial };
  }
  const growth = ((cur.value - prev.value) / prev.value) * 100;
  return { growth, partial: cur.partial || prev.partial };
}

export default function GrowthChart({ data }) {
  const [mode, setMode] = useState("capex");
  const colors = useTheme().tokens;

  const growthData = useMemo(() => {
    return data.companies
      .map((c) => {
        let growth, year, partial = false;
        if (mode === "capex") {
          const la = getCapex(c)?.latestAnnual;
          growth = la?.yoyGrowthPct ?? null;
          year = la?.calendarYear;
        } else {
          // Use the latest year present in either rd or sga
          const yearsRd = (getRd(c)?.annual || []).map((a) => a.calendarYear);
          const yearsSga = (getSga(c)?.annual || []).map((a) => a.calendarYear);
          const latest = Math.max(...yearsRd, ...yearsSga, -Infinity);
          if (Number.isFinite(latest)) {
            const r = opexYoY(c, latest);
            growth = r.growth;
            partial = r.partial;
            year = latest;
          } else {
            growth = null;
          }
        }
        return {
          ticker: c.ticker,
          name: c.name,
          growth: growth ?? 0,
          rawGrowth: growth,
          year,
          partial,
        };
      })
      .filter((d) => d.rawGrowth != null)
      .sort((a, b) => b.growth - a.growth);
  }, [data, mode]);

  // Historical years (last 6 calendar years)
  const historyYears = useMemo(() => {
    const set = new Set();
    data.companies.forEach((c) => {
      ["capex", "rd", "sga"].forEach((m) => {
        (c.metrics?.[m]?.annual || []).forEach((a) => {
          if (a.calendarYear >= 2020) set.add(a.calendarYear);
        });
      });
    });
    return [...set].sort((a, b) => b - a);
  }, [data]);

  return (
    <div className="card-enter card-enter-0">
      <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: 8 }}>
        Year-over-Year Growth
      </h2>
      <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 16 }}>
        Latest annual {mode === "opex" ? "OpEx (R&D + SG&A)" : "CapEx"} growth rate by company.
      </p>

      {/* Mode toggle */}
      <div
        role="tablist"
        aria-label="Growth metric"
        style={{
          display: "inline-flex",
          gap: 4,
          marginBottom: 16,
          padding: 4,
          background: colors.panelGlass,
          borderRadius: 10,
          border: `1px solid ${colors.borderSoft}`,
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
              background: mode === m.id ? "var(--c-pill-active-bg)" : "transparent",
              color: mode === m.id ? "var(--c-pill-active-text)" : colors.textFaint,
              boxShadow: mode === m.id ? "0 0 12px var(--c-pill-active-glow)" : "none",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Horizontal bar chart */}
      <div
        className="glass-card"
        style={{ padding: 20, marginBottom: 24, "--card-glow": "linear-gradient(135deg, #34D3994D, transparent 60%)" }}
      >
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={growthData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: colors.textMuted, fontSize: 12 }}
              axisLine={{ stroke: colors.axis }}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="ticker"
              tick={{ fill: colors.text, fontSize: 13, fontWeight: 600 }}
              axisLine={{ stroke: colors.axis }}
              tickLine={false}
              width={50}
            />
            <Tooltip content={<CustomTooltip mode={mode} />} cursor={{ fill: colors.grid }} />
            <Bar dataKey="growth" radius={[0, 4, 4, 0]} maxBarSize={28}>
              {growthData.map((entry) => (
                <Cell
                  key={entry.ticker}
                  fill={entry.growth >= 0 ? colors.success : colors.danger}
                  fillOpacity={entry.partial ? 0.5 : 0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Historical growth table — CapEx and OpEx side by side */}
      <div
        className="glass-card"
        style={{ padding: 0, overflow: "hidden", "--card-glow": "linear-gradient(135deg, #818CF84D, transparent 60%)" }}
      >
        <div style={{ padding: "16px 20px 8px", fontSize: 14, fontWeight: 600, color: colors.text }}>
          Historical YoY Growth (%) — {mode === "opex" ? "OpEx (R&D + SG&A)" : "CapEx"}
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="num" style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.borderSoft}` }}>
                <th style={{ padding: "10px 16px", textAlign: "left", color: colors.textFaint, fontWeight: 600 }}>Company</th>
                {historyYears.map((year) => (
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
                <tr key={c.ticker} style={{ borderBottom: `1px solid ${colors.borderSoft}` }}>
                  <td
                    style={{ padding: "10px 16px", fontWeight: 600, color: companyColor(c.ticker) }}
                  >
                    {c.ticker}
                  </td>
                  {historyYears.map((year) => {
                    let g, partial = false;
                    if (mode === "capex") {
                      g = annualEntry(getCapex(c), year)?.yoyGrowthPct ?? null;
                    } else {
                      const r = opexYoY(c, year);
                      g = r.growth;
                      partial = r.partial;
                    }
                    return (
                      <td
                        key={year}
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          fontWeight: 500,
                          color: g == null ? colors.textGhost : g >= 0 ? colors.success : colors.danger,
                          opacity: partial ? 0.65 : 1,
                        }}
                        title={partial ? "Partial — missing one OpEx component" : undefined}
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
