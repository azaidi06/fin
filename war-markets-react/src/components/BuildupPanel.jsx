import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell,
} from "recharts";
import { preWarData } from "../data/warData";
import { MultiSourceTooltip } from "./SourceLink";
import SourceLink from "./SourceLink";

const card = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };
const stripYear = (s) => s.replace(/, \d{4}\)/, ")").replace(/ \(\d{4}\)/, "");

/* ── Custom SVG defs: gradients + glow filter ── */
function ChartDefs() {
  return (
    <defs>
      {/* S&P 500 gradient: indigo → purple */}
      <linearGradient id="grad-sp-neg" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#A78BFA" />
      </linearGradient>
      <linearGradient id="grad-sp-pos" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#818CF8" />
        <stop offset="100%" stopColor="#C4B5FD" />
      </linearGradient>
      {/* NASDAQ gradient: teal → cyan */}
      <linearGradient id="grad-nq-neg" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0%" stopColor="#14B8A6" />
        <stop offset="100%" stopColor="#22D3EE" />
      </linearGradient>
      <linearGradient id="grad-nq-pos" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#2DD4BF" />
        <stop offset="100%" stopColor="#67E8F9" />
      </linearGradient>
      {/* Neon glow filter */}
      <filter id="glow-sp" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feFlood floodColor="#818CF8" floodOpacity="0.35" result="color" />
        <feComposite in="color" in2="blur" operator="in" result="shadow" />
        <feMerge>
          <feMergeNode in="shadow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="glow-nq" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feFlood floodColor="#22D3EE" floodOpacity="0.35" result="color" />
        <feComposite in="color" in2="blur" operator="in" result="shadow" />
        <feMerge>
          <feMergeNode in="shadow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

/* ── Custom pill legend ── */
function PillLegend() {
  const items = [
    { label: "S&P 500", gradient: "linear-gradient(90deg, #6366F1, #A78BFA)", shadow: "#818CF8" },
    { label: "NASDAQ", gradient: "linear-gradient(90deg, #14B8A6, #22D3EE)", shadow: "#22D3EE" },
  ];
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 12, paddingTop: 12 }}>
      {items.map((item) => (
        <span
          key={item.label}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(30, 41, 59, 0.6)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "5px 14px",
            fontSize: 12,
            fontWeight: 500,
            color: "#E2E8F0",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              background: item.gradient,
              boxShadow: `0 0 6px ${item.shadow}66`,
              flexShrink: 0,
            }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

// Chart data — show S&P for all, NASDAQ where available
const chartData = preWarData.map(d => ({
  label: d.label,
  spChange: d.spChange,
  nqChange: d.nqChange,
  surprise: d.surprise,
}));

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const row = preWarData.find(d => d.label === label);
  return (
    <div style={{ background: "#334155", border: "1px solid #475569", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#F8FAFC", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", maxWidth: 300 }}>
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 11, color: "#94A3B8", marginBottom: 6 }}>{row?.period}</p>
      {payload.map((p) => p.value != null && (
        <p key={p.dataKey} style={{ color: p.color, margin: "2px 0" }}>
          {p.name}: <strong>{p.value > 0 ? "+" : ""}{p.value}%</strong>
        </p>
      ))}
      {row?.surprise && (
        <p style={{ fontSize: 11, color: "#FBBF24", marginTop: 4, fontStyle: "italic" }}>
          Surprise event — showing prior context, not anticipatory decline
        </p>
      )}
      <MultiSourceTooltip sourceKeys={["sp500", "nasdaq"]} />
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
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <SourceLink sourceKey="sp500" />
        {d.nqChange != null && <SourceLink sourceKey="nasdaq" />}
      </div>
    </div>
  );
}

export default function BuildupPanel() {
  return (
    <section style={card}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#F8FAFC", marginBottom: 4 }}>Pre-War Market Buildup</h2>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20 }}>
        How markets performed in the lead-up to each conflict — anticipatory selloffs vs. surprise shocks
      </p>

      {/* Bar chart */}
      <ResponsiveContainer width="100%" height={380}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
          <ChartDefs />
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.25} horizontal={false} />
          <XAxis type="number" tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}%`} stroke="#475569"
            tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="label" width={185} stroke="#475569"
            tick={{ fill: "#CBD5E1", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} wrapperStyle={{ pointerEvents: "auto" }} />
          <ReferenceLine x={0} stroke="#64748B" strokeWidth={1.5} />
          <Bar dataKey="spChange" name="S&P 500" radius={4} barSize={14} filter="url(#glow-sp)">
            {chartData.map((d, i) => (
              <Cell key={i} fill={d.spChange < 0 ? "url(#grad-sp-neg)" : "url(#grad-sp-pos)"} fillOpacity={d.surprise ? 0.45 : 1} />
            ))}
          </Bar>
          <Bar dataKey="nqChange" name="NASDAQ" radius={4} barSize={14} filter="url(#glow-nq)">
            {chartData.map((d, i) => (
              <Cell key={i} fill={d.nqChange != null ? (d.nqChange < 0 ? "url(#grad-nq-neg)" : "url(#grad-nq-pos)") : "transparent"} fillOpacity={d.surprise ? 0.45 : 1} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <PillLegend />

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
