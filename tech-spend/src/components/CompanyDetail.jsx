import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { companyColor } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";
import { formatCurrency, formatPercent } from "../utils/formatters";
import {
  getCapex,
  getRd,
  getSga,
  annualEntry,
  getOpexAnnual,
  getTotalTechSpendAnnual,
} from "../utils/dataShape";

function CustomTooltip({ active, payload, label }) {
  const colors = useTheme().tokens;
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: colors.tooltipBg,
        border: `1px solid ${colors.tooltipBorder}`,
        borderRadius: 10,
        padding: "12px 16px",
        backdropFilter: "blur(12px)",
        minWidth: 180,
      }}
    >
      <p style={{ fontSize: 13, fontWeight: 600, color: colors.text, margin: "0 0 6px" }}>{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ width: 10, height: 2, background: p.color, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: colors.textSubtle, minWidth: 56 }}>{p.name}</span>
          <span className="num" style={{ fontSize: 12, fontWeight: 600, color: p.color }}>
            {formatCurrency(p.value, { unit: "B", digits: 2 })}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Build a quarterly time series with capex/rd/sga aligned by period key.
 */
function buildQuarterlySeries(company) {
  const map = {};
  const add = (metric, key) => {
    if (!metric) return;
    metric.quarterly.forEach((q) => {
      const periodKey = q.period;
      if (!map[periodKey]) {
        map[periodKey] = {
          period: periodKey,
          label: `${q.calendarYear} Q${q.calendarQuarter}`,
          calendarYear: q.calendarYear,
          calendarQuarter: q.calendarQuarter,
        };
      }
      map[periodKey][key] = q.valueBillions;
    });
  };
  add(getCapex(company), "capex");
  add(getRd(company), "rd");
  add(getSga(company), "sga");
  return Object.values(map).sort((a, b) => {
    if (a.calendarYear !== b.calendarYear) return a.calendarYear - b.calendarYear;
    return a.calendarQuarter - b.calendarQuarter;
  });
}

function shift(hex, amount = 0.4, towardLight = true) {
  // Mix the hex color toward white (or black) by `amount`. Returns rgb() string.
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const v = parseInt(m[1], 16);
  let r = (v >> 16) & 0xff;
  let g = (v >> 8) & 0xff;
  let b = v & 0xff;
  const target = towardLight ? 255 : 0;
  r = Math.round(r + (target - r) * amount);
  g = Math.round(g + (target - g) * amount);
  b = Math.round(b + (target - b) * amount);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function CompanyDetail({ data }) {
  const [selected, setSelected] = useState(data.companies[0]?.ticker || "MSFT");
  const { theme, tokens: colors } = useTheme();

  const company = useMemo(
    () => data.companies.find((c) => c.ticker === selected),
    [data, selected]
  );

  const quarterlyData = useMemo(() => (company ? buildQuarterlySeries(company) : []), [company]);

  const annualYears = useMemo(() => {
    if (!company) return [];
    const set = new Set();
    ["capex", "rd", "sga"].forEach((m) => {
      (company.metrics?.[m]?.annual || []).forEach((a) => set.add(a.calendarYear));
    });
    return [...set].sort((a, b) => b - a);
  }, [company]);

  const color = companyColor(selected);
  const towardLight = theme === "dark";
  const rdColor = shift(color, 0.45, towardLight);
  const sgaColor = shift(color, 0.7, towardLight);

  if (!company) return null;

  const capexSrc = getCapex(company)?.source;
  const rdSrc = getRd(company)?.source;
  const sgaSrc = getSga(company)?.source;

  return (
    <div className="card-enter card-enter-0">
      <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: 8 }}>
        Company Details
      </h2>
      <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 24 }}>
        Quarterly and annual breakdown — CapEx, R&amp;D, and SG&amp;A.
      </p>

      {/* Pill-row company picker */}
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

      {/* Quarterly multi-line chart */}
      <div
        className="glass-card"
        style={{ padding: 20, marginBottom: 24, "--card-glow": `linear-gradient(135deg, ${color}4D, transparent 60%)` }}
      >
        <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 16 }}>
          Quarterly CapEx, R&amp;D, SG&amp;A — {company.name}
        </h3>
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={quarterlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis
              dataKey="label"
              tick={{ fill: colors.textMuted, fontSize: 10 }}
              axisLine={{ stroke: colors.axis }}
              tickLine={false}
              interval="preserveStartEnd"
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fill: colors.textMuted, fontSize: 12 }}
              axisLine={{ stroke: colors.axis }}
              tickLine={false}
              tickFormatter={(v) => `$${v}B`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: colors.textMuted }} iconType="plainline" iconSize={16} />
            <Line
              type="monotone"
              dataKey="capex"
              name="CapEx"
              stroke={color}
              strokeWidth={2.25}
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: colors.dotStroke, strokeWidth: 2 }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="rd"
              name="R&D"
              stroke={rdColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: rdColor, stroke: colors.dotStroke, strokeWidth: 2 }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="sga"
              name="SG&A"
              stroke={sgaColor}
              strokeWidth={2}
              strokeDasharray="4 3"
              dot={false}
              activeDot={{ r: 4, fill: sgaColor, stroke: colors.dotStroke, strokeWidth: 2 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ marginTop: 12, fontSize: 10, color: colors.textGhost, lineHeight: 1.5 }}>
          Source: SEC EDGAR XBRL — CapEx: <span className="num">{capexSrc || "—"}</span>
          {" / "}R&amp;D: <span className="num">{rdSrc || "n/a (Amazon does not tag R&D under us-gaap)"}</span>
          {" / "}SG&amp;A: <span className="num">{sgaSrc || "—"}</span>
        </div>
      </div>

      {/* Annual data table */}
      <div
        className="glass-card"
        style={{ padding: 0, overflow: "hidden", "--card-glow": `linear-gradient(135deg, ${color}4D, transparent 60%)` }}
      >
        <div style={{ padding: "16px 20px 8px", fontSize: 14, fontWeight: 600, color: colors.text }}>
          Annual Tech Spend — {company.name}
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="num" style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.borderSoft}` }}>
                <th style={{ padding: "10px 16px", textAlign: "left", color: colors.textFaint, fontWeight: 600 }}>Year</th>
                <th style={{ padding: "10px 16px", textAlign: "right", color: colors.textFaint, fontWeight: 600 }}>CapEx ($B)</th>
                <th style={{ padding: "10px 16px", textAlign: "right", color: colors.textFaint, fontWeight: 600 }}>R&amp;D ($B)</th>
                <th style={{ padding: "10px 16px", textAlign: "right", color: colors.textFaint, fontWeight: 600 }}>SG&amp;A ($B)</th>
                <th style={{ padding: "10px 16px", textAlign: "right", color: colors.textFaint, fontWeight: 600 }}>Total ($B)</th>
                <th style={{ padding: "10px 16px", textAlign: "right", color: colors.textFaint, fontWeight: 600 }}>CapEx YoY</th>
              </tr>
            </thead>
            <tbody>
              {annualYears.map((year) => {
                const cx = annualEntry(getCapex(company), year);
                const rd = annualEntry(getRd(company), year);
                const sga = annualEntry(getSga(company), year);
                const total = getTotalTechSpendAnnual(company, year);
                const g = cx?.yoyGrowthPct;
                return (
                  <tr key={year} style={{ borderBottom: `1px solid ${colors.borderSoft}` }}>
                    <td style={{ padding: "10px 16px", fontWeight: 600, color: colors.text }}>{year}</td>
                    <td style={{ padding: "10px 16px", textAlign: "right", color, fontWeight: 600 }}>
                      {cx ? formatCurrency(cx.valueBillions, { unit: "B", digits: 2 }) : "—"}
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "right", color: rdColor, fontWeight: 500 }}>
                      {rd ? formatCurrency(rd.valueBillions, { unit: "B", digits: 2 }) : "—"}
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "right", color: sgaColor, fontWeight: 500 }}>
                      {sga ? formatCurrency(sga.valueBillions, { unit: "B", digits: 2 }) : "—"}
                    </td>
                    <td
                      style={{
                        padding: "10px 16px",
                        textAlign: "right",
                        color: colors.text,
                        fontWeight: 700,
                        opacity: total.partial ? 0.7 : 1,
                      }}
                      title={total.partial ? "Partial — at least one component missing" : undefined}
                    >
                      {total.value != null ? formatCurrency(total.value, { unit: "B", digits: 2 }) : "—"}
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
