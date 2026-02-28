import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import { combinedData } from "../data/warData";

const card = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };

function CustomTooltip({ active, payload, label, hiddenSeries }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#334155", border: "1px solid #475569", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#F8FAFC", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map((p) => p.value != null && !hiddenSeries.includes(p.dataKey) && (
        <p key={p.dataKey} style={{ color: p.color, margin: "2px 0" }}>
          {p.name}: <strong>-{p.value}%</strong>
        </p>
      ))}
    </div>
  );
}

export default function DrawdownChart() {
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

  return (
    <section style={card}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#F8FAFC", marginBottom: 4 }}>Maximum Drawdown by Conflict</h2>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20 }}>Peak-to-trough decline from the pre-war close</p>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={combinedData} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.25} horizontal={false} />
          <XAxis type="number" tickFormatter={(v) => `${v}%`} stroke="#475569"
            tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="label" width={185} stroke="#475569"
            tick={{ fill: "#CBD5E1", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip hiddenSeries={hiddenSeries} />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
          <Legend content={renderLegend} />
          <Bar dataKey="spDecline" name="S&P 500" fill="#6366F1" radius={[0, 5, 5, 0]} barSize={14}
            fillOpacity={hiddenSeries.includes("spDecline") ? 0 : 1} />
          <Bar dataKey="nqDecline" name="NASDAQ" fill="#10B981" radius={[0, 5, 5, 0]} barSize={14}
            fillOpacity={hiddenSeries.includes("nqDecline") ? 0 : 1} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
