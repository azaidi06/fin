import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
} from "recharts";
import { globalMarketsData, globalIndexColors, indexCountries, indexFlags } from "../data/warData";
import { MultiSourceTooltip } from "./SourceLink";
import SourceLink from "./SourceLink";

const card = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };

const qualityColors = {
  high: { bg: "rgba(16,185,129,0.12)", text: "#34D399" },
  medium: { bg: "rgba(251,191,36,0.12)", text: "#FBBF24" },
  low: { bg: "rgba(251,146,60,0.12)", text: "#FB923C" },
  minimal: { bg: "rgba(148,163,184,0.12)", text: "#94A3B8" },
};

// Build comparison chart data for Gulf War + 9/11 (the two data-rich conflicts)
const comparisonConflicts = globalMarketsData.filter(d => d.dataQuality === "high");
const allIndices = [...new Set(comparisonConflicts.flatMap(c => c.indices.filter(i => i.decline != null && !i.isPositive).map(i => i.id)))];

const comparisonData = allIndices.map(idx => {
  const label = `${indexFlags[idx] || ""} ${idx} (${indexCountries[idx] || ""})`;
  const row = { index: label };
  comparisonConflicts.forEach(c => {
    const entry = c.indices.find(i => i.id === idx);
    row[c.conflict] = entry?.decline ?? null;
  });
  return row;
});

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#334155", border: "1px solid #475569", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#F8FAFC", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", maxWidth: 280 }}>
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
  const absVal = Math.abs(value);
  const pct = Math.min(absVal / maxVal, 1) * 100;
  const isPositive = value < 0; // negative "decline" means positive return
  const barColor = isPositive ? "#10B981" : color;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 14, background: "#0F172A", borderRadius: 7, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 7, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: barColor, minWidth: 56, textAlign: "right" }}>
        {prefix}{absVal}%
      </span>
    </div>
  );
}

function IndexRow({ idx, maxVal }) {
  const color = globalIndexColors[idx.id] || "#94A3B8";
  const isNarrative = idx.confidence === "narrative";
  const prefix = idx.isPositive ? "+" : (idx.confidence === "approx" ? "~" : "-");

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: color, flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 600, color }}>
          {indexFlags[idx.id]} {idx.id}
          <span style={{ fontWeight: 400, fontSize: 10, color: "#64748B", marginLeft: 4 }}>
            {indexCountries[idx.id]}
          </span>
        </span>
        <SourceLink indexId={idx.id} style={{ fontSize: 9, marginLeft: 4 }} />
        {idx.caveat && (
          <span style={{ fontSize: 9, fontWeight: 600, color: "#FBBF24", background: "rgba(251,191,36,0.12)", padding: "1px 6px", borderRadius: 4, marginLeft: "auto" }}>
            {idx.caveat}
          </span>
        )}
      </div>
      {isNarrative ? (
        <p style={{ fontSize: 11, color: "#94A3B8", fontStyle: "italic", paddingLeft: 18 }}>{idx.note}</p>
      ) : (
        <div style={{ paddingLeft: 18 }}>
          <DeclineBar value={idx.isPositive ? -idx.decline : idx.decline} maxVal={maxVal} color={color} prefix={prefix} />
          {idx.note && <p style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>{idx.note}</p>}
          {idx.daysToBottom != null && (
            <div style={{ display: "flex", gap: 16, fontSize: 10, color: "#64748B", marginTop: 2 }}>
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
  const qc = qualityColors[d.dataQuality];
  const numericIndices = d.indices.filter(i => i.decline != null && !i.isPositive);
  const maxVal = numericIndices.length > 0 ? Math.max(...numericIndices.map(i => i.decline)) : 25;

  return (
    <div style={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 10, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <h3 style={{ fontWeight: 600, color: "#E2E8F0", fontSize: 14 }}>
          {d.label}
        </h3>
        <span style={{ fontSize: 9, fontWeight: 600, color: qc.text, background: qc.bg, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0, marginLeft: 8 }}>
          {d.dataQuality} data
        </span>
      </div>

      {/* Market cap ranking pills */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
        {d.marketCapRanking.map(ex => (
          <span key={ex} style={{ fontSize: 9, color: "#94A3B8", background: "#1E293B", padding: "1px 6px", borderRadius: 3, border: "1px solid #334155" }}>
            {ex}
          </span>
        ))}
      </div>

      {/* Index rows */}
      {d.indices.map(idx => (
        <IndexRow key={idx.id} idx={idx} maxVal={maxVal} />
      ))}

      {/* Narrative */}
      <p style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.5, borderTop: "1px solid #334155", paddingTop: 10, marginTop: 8 }}>
        {d.narrative}
      </p>
    </div>
  );
}

export default function GlobalMarketsPanel() {
  return (
    <section style={card}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#F8FAFC", marginBottom: 4 }}>Global Markets Reaction</h2>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>
        How major world indices reacted to each conflict — data availability improves dramatically from the Gulf War onward
      </p>

      {/* Comparison chart: Gulf War vs 9/11 */}
      <div style={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 10, padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#E2E8F0", marginBottom: 4 }}>Gulf War vs. 9/11 — Max Decline by Index</h3>
        <p style={{ fontSize: 11, color: "#64748B", marginBottom: 16 }}>The two conflicts with comprehensive global data</p>

        <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap", fontSize: 12, color: "#CBD5E1" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: "#6366F1", display: "inline-block" }} /> Gulf War
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: "#F59E0B", display: "inline-block" }} /> 9/11
          </span>
        </div>

        <ResponsiveContainer width="100%" height={Math.max(comparisonData.length * 60, 200)}>
          <BarChart data={comparisonData} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.25} horizontal={false} />
            <XAxis type="number" tickFormatter={v => `${v}%`} stroke="#475569"
              tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="index" width={175} stroke="#475569"
              tick={{ fill: "#CBD5E1", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} wrapperStyle={{ pointerEvents: "auto" }} />
            <Bar dataKey="Gulf War" name="Gulf War" fill="#6366F1" radius={4} barSize={14}>
              {comparisonData.map((d, i) => (
                <Cell key={i} fill="#6366F1" fillOpacity={d["Gulf War"] == null ? 0 : 1} />
              ))}
            </Bar>
            <Bar dataKey="9/11" name="9/11" fill="#F59E0B" radius={4} barSize={14}>
              {comparisonData.map((d, i) => (
                <Cell key={i} fill="#F59E0B" fillOpacity={d["9/11"] == null ? 0 : 1} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p style={{ fontSize: 10, color: "#64748B", textAlign: "center", marginTop: 8, fontStyle: "italic" }}>
          Nikkei 225 Gulf War decline (35%) includes the Japanese bubble burst — war-specific impact was likely 5–8%.
        </p>
      </div>

      {/* Per-conflict cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {globalMarketsData.map(d => (
          <ConflictCard key={d.conflict} d={d} />
        ))}
      </div>

      <p style={{ fontSize: 11, color: "#64748B", textAlign: "center", marginTop: 16, fontStyle: "italic" }}>
        Data quality varies by era. FTSE 100 began 1984, DAX 1988, Hang Seng 1969. Approximate values marked with ~.
      </p>
    </section>
  );
}
