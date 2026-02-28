import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Cell,
} from "recharts";
import { preWarData } from "../data/warData";

const card = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };
const stripYear = (s) => s.replace(/, \d{4}\)/, ")").replace(/ \(\d{4}\)/, "");

// Chart data — show S&P for all, NASDAQ where available
const chartData = preWarData.map(d => ({
  label: d.label,
  spChange: d.spChange,
  nqChange: d.nqChange,
  surprise: d.surprise,
}));

function CustomTooltip({ active, payload, label, hiddenSeries }) {
  if (!active || !payload?.length) return null;
  const row = preWarData.find(d => d.label === label);
  return (
    <div style={{ background: "#334155", border: "1px solid #475569", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#F8FAFC", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", maxWidth: 300 }}>
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 11, color: "#94A3B8", marginBottom: 6 }}>{row?.period}</p>
      {payload.map((p) => p.value != null && !hiddenSeries.includes(p.dataKey) && (
        <p key={p.dataKey} style={{ color: p.color, margin: "2px 0" }}>
          {p.name}: <strong>{p.value > 0 ? "+" : ""}{p.value}%</strong>
        </p>
      ))}
      {row?.surprise && (
        <p style={{ fontSize: 11, color: "#FBBF24", marginTop: 4, fontStyle: "italic" }}>
          Surprise event — showing prior context, not anticipatory decline
        </p>
      )}
    </div>
  );
}

function ConflictCard({ d }) {
  const isDecline = d.spChange < 0;
  const changeColor = isDecline ? "#EF4444" : "#10B981";
  return (
    <div style={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 10, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <h3 style={{ fontWeight: 600, color: "#E2E8F0", fontSize: 14 }}>{stripYear(d.label)}</h3>
        {d.surprise && (
          <span style={{ fontSize: 10, fontWeight: 600, color: "#FBBF24", background: "rgba(251,191,36,0.12)", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Surprise
          </span>
        )}
      </div>

      <p style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
        {d.surprise ? "Context Period" : "Buildup Period"}
      </p>
      <p style={{ fontSize: 13, color: "#CBD5E1", marginBottom: 12 }}>{d.period}{d.days ? ` (${d.days} trading days)` : ""}</p>

      <p style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Catalyst</p>
      <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 12 }}>{d.catalyst}</p>

      <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 11, color: "#64748B", marginBottom: 2 }}>S&P 500</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: changeColor }}>
            {d.spChange > 0 ? "+" : ""}{d.spChange}%
          </p>
          <p style={{ fontSize: 11, color: "#475569" }}>{d.spStart} → {d.spEnd}</p>
        </div>
        {d.nqChange != null && (
          <div>
            <p style={{ fontSize: 11, color: "#64748B", marginBottom: 2 }}>NASDAQ</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: d.nqChange < 0 ? "#EF4444" : "#10B981" }}>
              {d.nqChange > 0 ? "+" : ""}{d.nqChange}%
            </p>
            <p style={{ fontSize: 11, color: "#475569" }}>{d.nqStart} → {d.nqEnd}</p>
          </div>
        )}
      </div>

      <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5, borderTop: "1px solid #334155", paddingTop: 10 }}>
        {d.narrative}
      </p>
    </div>
  );
}

export default function BuildupPanel() {
  const [hiddenSeries, setHiddenSeries] = useState([]);
  const [hoveredSeries, setHoveredSeries] = useState(null);

  const toggleSeries = (key) => {
    setHiddenSeries(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", paddingTop: "12px" }}>
        {payload.map((entry, index) => {
          const isHidden = hiddenSeries.includes(entry.dataKey);
          const isHovered = hoveredSeries === entry.dataKey;
          return (
            <div
              key={`item-${index}`}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                cursor: "pointer", padding: "4px 8px", borderRadius: "6px",
                background: isHovered ? "rgba(255,255,255,0.05)" : "transparent",
                transition: "all 0.2s", opacity: isHidden ? 0.4 : 1,
              }}
              onClick={() => toggleSeries(entry.dataKey)}
              onMouseEnter={() => setHoveredSeries(entry.dataKey)}
              onMouseLeave={() => setHoveredSeries(null)}
            >
              <div style={{ width: 10, height: 10, borderRadius: 2, background: entry.color }} />
              <span style={{
                fontSize: 12,
                color: isHovered ? "#F8FAFC" : "#CBD5E1",
                fontWeight: isHovered ? 600 : 400,
                textDecoration: isHidden ? "line-through" : "none",
              }}>
                {entry.value}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const spHidden = hiddenSeries.includes("spChange");
  const nqHidden = hiddenSeries.includes("nqChange");

  return (
    <section style={card}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#F8FAFC", marginBottom: 4 }}>Pre-War Market Buildup</h2>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20 }}>
        How markets performed in the lead-up to each conflict — anticipatory selloffs vs. surprise shocks
      </p>

      {/* Bar chart */}
      <ResponsiveContainer width="100%" height={380}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.25} horizontal={false} />
          <XAxis type="number" tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}%`} stroke="#475569"
            tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="label" width={185} stroke="#475569"
            tick={{ fill: "#CBD5E1", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip hiddenSeries={hiddenSeries} />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
          <Legend content={renderLegend} />
          <ReferenceLine x={0} stroke="#64748B" strokeWidth={1.5} />
          <Bar dataKey="spChange" name="S&P 500" radius={4} barSize={14}>
            {chartData.map((d, i) => (
              <Cell key={i} fill={d.spChange < 0 ? "#6366F1" : "#818CF8"} fillOpacity={spHidden ? 0 : (d.surprise ? 0.45 : 1)} />
            ))}
          </Bar>
          <Bar dataKey="nqChange" name="NASDAQ" radius={4} barSize={14}>
            {chartData.map((d, i) => (
              <Cell key={i} fill={d.nqChange != null ? (d.nqChange < 0 ? "#10B981" : "#34D399") : "transparent"} fillOpacity={nqHidden ? 0 : (d.surprise ? 0.45 : 1)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p style={{ fontSize: 11, color: "#64748B", textAlign: "center", marginTop: 8, marginBottom: 24, fontStyle: "italic" }}>
        Faded bars = surprise events (context only, not anticipatory). Positive values = market was rising before the conflict.
      </p>

      {/* Detail cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {preWarData.map(d => <ConflictCard key={d.conflict} d={d} />)}
      </div>
    </section>
  );
}
