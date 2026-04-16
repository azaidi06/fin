import { useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { postTroughReturns, postTroughWeeks, fiscalConflictColors } from "../data/warData";
import { useEventToggle } from "../context/EventToggleContext";
import SourceLink from "./SourceLink";

const card = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const sorted = [...payload].filter(p => p.value != null).sort((a, b) => b.value - a.value);
  return (
    <div style={{ background: "#334155", border: "1px solid #475569", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#F8FAFC", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
      <p style={{ fontWeight: 600, marginBottom: 6, fontSize: 13 }}>Week {label} post-trough</p>
      {sorted.map(p => (
        <div key={p.dataKey} style={{ display: "flex", justifyContent: "space-between", gap: 16, color: p.color, margin: "2px 0" }}>
          <span>{p.name}</span>
          <strong>+{p.value.toFixed(1)}%</strong>
        </div>
      ))}
    </div>
  );
}

export default function PostTroughReboundChart() {
  const { activeConflicts } = useEventToggle();
  const [hovered, setHovered] = useState(null);

  const conflictKeys = useMemo(
    () => activeConflicts.filter(k => postTroughReturns[k]),
    [activeConflicts]
  );

  const chartData = useMemo(() => postTroughWeeks.map(w => {
    const row = { week: w };
    conflictKeys.forEach(k => {
      const v = postTroughReturns[k][`w${w}`];
      row[k] = v;
    });
    return row;
  }), [conflictKeys]);

  // Sort conflicts by 26-week return (descending) — puts best rebounds first in legend
  const sortedKeys = useMemo(() => {
    return [...conflictKeys].sort((a, b) => {
      const av = postTroughReturns[a].w26 ?? -Infinity;
      const bv = postTroughReturns[b].w26 ?? -Infinity;
      return bv - av;
    });
  }, [conflictKeys]);

  // Iran specifically — so we can highlight it
  const hasIran = conflictKeys.includes("Iran");
  const iranRow = postTroughReturns["Iran"];

  return (
    <section style={card}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#F8FAFC", marginBottom: 4 }}>
        Post-Trough Rebound Speed
      </h2>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 4 }}>
        S&P 500 % return from trough close at each weekly interval. Hover a conflict to highlight its path.
      </p>
      {hasIran && (
        <p style={{ fontSize: 12, color: "#FBBF24", marginBottom: 16, lineHeight: 1.5 }}>
          Iran trough (Mar 30, 2026) → <strong>+{iranRow.w2}%</strong> after 2 weeks,<em> while the war is still active</em>.
          Cleared its pre-war close in just <strong>11 trading days</strong> — the 3rd-fastest recovery phase on record,
          behind only the Cuban Missile Crisis and the Iraq War (both 6d), and beating COVID (82d), 9/11 (21d),
          and Russia-Ukraine (296d). Unlike those, Iran's rebound is happening with no Fed stimulus and an active naval blockade still in place.
        </p>
      )}

      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={chartData} margin={{ top: 16, right: 30, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.25} />
          <XAxis
            dataKey="week"
            stroke="#475569"
            tick={{ fill: "#94A3B8", fontSize: 12 }}
            tickFormatter={v => `W${v}`}
            type="number"
            domain={[2, 26]}
            ticks={postTroughWeeks}
          />
          <YAxis
            stroke="#475569"
            tick={{ fill: "#94A3B8", fontSize: 12 }}
            tickFormatter={v => `+${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#64748B" strokeWidth={1} />
          {sortedKeys.map(k => {
            const isIran = k === "Iran";
            const isHovered = hovered === k;
            const dimmed = hovered != null && !isHovered && !isIran;
            const color = fiscalConflictColors[k] || "#94A3B8";
            return (
              <Line
                key={k}
                type="monotone"
                dataKey={k}
                name={k}
                stroke={color}
                strokeWidth={isIran ? 3 : (isHovered ? 3 : 1.8)}
                strokeOpacity={dimmed ? 0.18 : 1}
                dot={{ r: isIran ? 4 : 3, fill: color, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
                connectNulls={false}
                isAnimationActive
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>

      {/* Interactive legend — click/hover to highlight */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12, justifyContent: "center" }}>
        {sortedKeys.map(k => {
          const color = fiscalConflictColors[k] || "#94A3B8";
          const r = postTroughReturns[k];
          const w26 = r.w26;
          const isIran = k === "Iran";
          return (
            <button
              key={k}
              onMouseEnter={() => setHovered(k)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 11,
                fontWeight: isIran ? 700 : 500,
                color: hovered === k || isIran ? "#F8FAFC" : "#CBD5E1",
                background: hovered === k ? "rgba(255,255,255,0.05)" : "transparent",
                border: `1px solid ${isIran ? color : "rgba(255,255,255,0.08)"}`,
                borderRadius: 16,
                padding: "4px 10px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
              {k}
              <span style={{ color: "#64748B", fontWeight: 400 }}>
                {w26 != null ? `W26 +${w26}%` : "in progress"}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
        <SourceLink sourceKey="sp500" />
      </div>
    </section>
  );
}
