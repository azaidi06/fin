import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
} from "recharts";
import { globalMarketsData, globalIndexColors, indexCountries, indexFlags } from "../data/warData";
import { MultiSourceTooltip } from "./SourceLink";
import SourceLink from "./SourceLink";
import { useEventToggle } from "../context/EventToggleContext";

import { useTheme } from '../theme/ThemeContext';
const card = { background: 'var(--c-panel)', border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };

const qualityColors = {
  high: { bg: "rgba(16,185,129,0.12)", text: 'var(--c-green-soft)' },
  medium: { bg: "rgba(251,191,36,0.12)", text: 'var(--c-amber-strong)' },
  low: { bg: "rgba(251,146,60,0.12)", text: 'var(--c-orange-soft)' },
  minimal: { bg: "rgba(148,163,184,0.12)", text: 'var(--c-text-mute)' },
};

function CustomTooltip({ active, payload, label }) {
  const t = useTheme().tokens;
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: t.border, border: "1px solid #475569", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: t.textHigh, boxShadow: "0 8px 24px rgba(0,0,0,0.4)", maxWidth: 280 }}>
      <p style={{ fontWeight: 600, marginBottom: 6 }}>{label}</p>
      {payload.map(p => p.value != null && (
        <p key={p.dataKey} style={{ color: p.color, margin: "2px 0" }}>
          {p.name}: <strong>-{p.value}%</strong>
        </p>
      ))}
      <MultiSourceTooltip sourceKeys={["sp500", "djia"]} />
    </div>
  );
}

function DeclineBar({ value, maxVal, color, prefix }) {
  const t = useTheme().tokens;
  const absVal = Math.abs(value);
  const pct = Math.min(absVal / maxVal, 1) * 100;
  const isPositive = value < 0; // negative "decline" means positive return
  const barColor = isPositive ? t.green : color;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 14, background: t.bg, borderRadius: 7, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 7, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: barColor, minWidth: 56, textAlign: "right" }}>
        {prefix}{absVal}%
      </span>
    </div>
  );
}

function IndexRow({ idx, maxVal }) {
  const t = useTheme().tokens;
  const color = globalIndexColors[idx.id] || t.textMute;
  const isNarrative = idx.confidence === "narrative";
  const prefix = idx.isPositive ? "+" : (idx.confidence === "approx" ? "~" : "-");

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: color, flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 600, color }}>
          {indexFlags[idx.id]} {idx.id}
          <span style={{ fontWeight: 400, fontSize: 10, color: t.textLow, marginLeft: 4 }}>
            {indexCountries[idx.id]}
          </span>
        </span>
        <SourceLink indexId={idx.id} style={{ fontSize: 9, marginLeft: 4 }} />
        {idx.caveat && (
          <span style={{ fontSize: 9, fontWeight: 600, color: t.amberStrong, background: "rgba(251,191,36,0.12)", padding: "1px 6px", borderRadius: 4, marginLeft: "auto" }}>
            {idx.caveat}
          </span>
        )}
      </div>
      {isNarrative ? (
        <p style={{ fontSize: 11, color: t.textMute, fontStyle: "italic", paddingLeft: 18 }}>{idx.note}</p>
      ) : (
        <div style={{ paddingLeft: 18 }}>
          <DeclineBar value={idx.isPositive ? -idx.decline : idx.decline} maxVal={maxVal} color={color} prefix={prefix} />
          {idx.note && <p style={{ fontSize: 10, color: t.textLow, marginTop: 2 }}>{idx.note}</p>}
          {idx.daysToBottom != null && (
            <div style={{ display: "flex", gap: 16, fontSize: 10, color: t.textLow, marginTop: 2 }}>
              <span>Bottom: {idx.daysToBottom}d</span>
              {idx.daysToRecover != null && <span>Recover: {idx.daysToRecover}d</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ConflictCard({ d }) {
  const t = useTheme().tokens;
  const qc = qualityColors[d.dataQuality];
  const numericIndices = d.indices.filter(i => i.decline != null && !i.isPositive);
  const maxVal = numericIndices.length > 0 ? Math.max(...numericIndices.map(i => i.decline)) : 25;

  return (
    <div style={{ background: t.bg, border: "1px solid #334155", borderRadius: 10, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <h3 style={{ fontWeight: 600, color: t.textHighAlt, fontSize: 14 }}>
          {d.label}
        </h3>
        <span style={{ fontSize: 9, fontWeight: 600, color: qc.text, background: qc.bg, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0, marginLeft: 8 }}>
          {d.dataQuality} data
        </span>
      </div>

      {/* Market cap ranking pills */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
        {d.marketCapRanking.map(ex => (
          <span key={ex} style={{ fontSize: 9, color: t.textMute, background: t.panel, padding: "1px 6px", borderRadius: 3, border: "1px solid #334155" }}>
            {ex}
          </span>
        ))}
      </div>

      {/* Index rows */}
      {d.indices.map(idx => (
        <IndexRow key={idx.id} idx={idx} maxVal={maxVal} />
      ))}

      {/* Narrative */}
      <p style={{ fontSize: 11, color: t.textMute, lineHeight: 1.5, borderTop: "1px solid #334155", paddingTop: 10, marginTop: 8 }}>
        {d.narrative}
      </p>
    </div>
  );
}

export default function GlobalMarketsPanel() {
  const t = useTheme().tokens;
  const { filterData } = useEventToggle();

  const filteredGlobal = useMemo(() => filterData(globalMarketsData), [filterData]);

  // Build comparison chart data for data-rich conflicts
  const { comparisonConflicts, comparisonData } = useMemo(() => {
    const cc = filteredGlobal.filter(d => d.dataQuality === "high");
    const allIndices = [...new Set(cc.flatMap(c => c.indices.filter(i => i.decline != null && !i.isPositive).map(i => i.id)))];
    const cd = allIndices.map(idx => {
      const label = `${indexFlags[idx] || ""} ${idx} (${indexCountries[idx] || ""})`;
      const row = { index: label };
      cc.forEach(c => {
        const entry = c.indices.find(i => i.id === idx);
        row[c.conflict] = entry?.decline ?? null;
      });
      return row;
    });
    return { comparisonConflicts: cc, comparisonData: cd };
  }, [filteredGlobal]);

  // Dynamic legend colors for comparison chart
  const conflictColors = {
    "Cuban Missile": t.lime,
    "Oil Embargo": t.orange,
    "Black Monday": t.purple,
    "Gulf War": t.indigo,
    "9/11": t.amber,
    Iraq: t.blue,
    "2008 Crisis": t.teal,
    "COVID": t.cyan,
    "Russia-Ukraine": t.crimson,
    Iran: t.amberStrong,
  };

  return (
    <section style={card}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: t.textHigh, marginBottom: 4 }}>Global Markets Reaction</h2>
      <p style={{ fontSize: 13, color: t.textMute, marginBottom: 24 }}>
        How major world indices reacted to each conflict — data availability improves dramatically from the Gulf War onward
      </p>

      {/* Comparison chart: high-quality data conflicts */}
      {comparisonConflicts.length >= 2 && (
        <div style={{ background: t.bg, border: "1px solid #334155", borderRadius: 10, padding: 20, marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: t.textHighAlt, marginBottom: 4 }}>
            {comparisonConflicts.map(c => c.conflict).join(" vs. ")} — Max Decline by Index
          </h3>
          <p style={{ fontSize: 11, color: t.textLow, marginBottom: 16 }}>
            {comparisonConflicts.length === 2 ? "The two conflicts" : "The conflicts"} with comprehensive global data
          </p>

          <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap", fontSize: 12, color: t.textMid }}>
            {comparisonConflicts.map(c => (
              <span key={c.conflict} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: conflictColors[c.conflict] || t.textMute, display: "inline-block" }} /> {c.conflict}
              </span>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={Math.max(comparisonData.length * 60, 200)}>
            <BarChart data={comparisonData} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.axis} opacity={0.25} horizontal={false} />
              <XAxis type="number" tickFormatter={v => `${v}%`} stroke={t.axis}
                tick={{ fill: t.textMute, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="index" width={175} stroke={t.axis}
                tick={{ fill: t.textMid, fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} wrapperStyle={{ pointerEvents: "auto" }} />
              {comparisonConflicts.map(c => (
                <Bar key={c.conflict} dataKey={c.conflict} name={c.conflict} fill={conflictColors[c.conflict] || t.textMute} radius={4} barSize={14}>
                  {comparisonData.map((d, i) => (
                    <Cell key={i} fill={conflictColors[c.conflict] || t.textMute} fillOpacity={d[c.conflict] == null ? 0 : 1} />
                  ))}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
          <p style={{ fontSize: 10, color: t.textLow, textAlign: "center", marginTop: 8, fontStyle: "italic" }}>
            Nikkei 225 Gulf War decline (35%) includes the Japanese bubble burst — war-specific impact was likely 5–8%.
          </p>
        </div>
      )}

      {/* Per-conflict cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {filteredGlobal.map(d => (
          <ConflictCard key={d.conflict} d={d} />
        ))}
      </div>

      <p style={{ fontSize: 11, color: t.textLow, textAlign: "center", marginTop: 16, fontStyle: "italic" }}>
        Data quality varies by era. FTSE 100 began 1984, DAX 1988, Hang Seng 1969. Approximate values marked with ~.
      </p>
    </section>
  );
}
