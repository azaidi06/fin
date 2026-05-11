import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell,
} from "recharts";
import { preWarData } from "../data/warData";
import { MultiSourceTooltip } from "./SourceLink";
import SourceLink from "./SourceLink";
import { useEventToggle } from "../context/EventToggleContext";

import { useTheme } from '../theme/ThemeContext';
const card = { background: 'var(--c-panel)', border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };
const stripYear = (s) => s.replace(/, \d{4}\)/, ")").replace(/ \(\d{4}\)/, "");

/* ── Custom SVG defs: gradients + glow filter ── */
function ChartDefs() {
  const t = useTheme().tokens;
  return (
    <defs>
      {/* S&P 500 gradient: indigo → purple */}
      <linearGradient id="grad-sp-neg" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0%" stopColor={t.indigo} />
        <stop offset="100%" stopColor={t.violetSoft} />
      </linearGradient>
      <linearGradient id="grad-sp-pos" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={t.indigoSoft} />
        <stop offset="100%" stopColor="#C4B5FD" />
      </linearGradient>
      {/* NASDAQ gradient: teal → cyan */}
      <linearGradient id="grad-nq-neg" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0%" stopColor={t.teal} />
        <stop offset="100%" stopColor={t.cyanBright} />
      </linearGradient>
      <linearGradient id="grad-nq-pos" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#2DD4BF" />
        <stop offset="100%" stopColor="#67E8F9" />
      </linearGradient>
      {/* Neon glow filter */}
      <filter id="glow-sp" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feFlood floodColor={t.indigoSoft} floodOpacity="0.35" result="color" />
        <feComposite in="color" in2="blur" operator="in" result="shadow" />
        <feMerge>
          <feMergeNode in="shadow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="glow-nq" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feFlood floodColor={t.cyanBright} floodOpacity="0.35" result="color" />
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
  const t = useTheme().tokens;
  const items = [
    { label: "S&P 500", gradient: "linear-gradient(90deg, #6366F1, #A78BFA)", shadow: t.indigoSoft },
    { label: "NASDAQ", gradient: "linear-gradient(90deg, #14B8A6, #22D3EE)", shadow: t.cyanBright },
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
            color: t.textHighAlt,
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

function CustomTooltip({ active, payload, label, filteredPreWar }) {
  const t = useTheme().tokens;
  if (!active || !payload?.length) return null;
  const row = filteredPreWar.find(d => d.label === label);
  return (
    <div style={{ background: t.border, border: "1px solid #475569", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: t.textHigh, boxShadow: "0 8px 24px rgba(0,0,0,0.4)", maxWidth: 300 }}>
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 11, color: t.textMute, marginBottom: 6 }}>{row?.period}</p>
      {payload.map((p) => p.value != null && (
        <p key={p.dataKey} style={{ color: p.color, margin: "2px 0" }}>
          {p.name}: <strong>{p.value > 0 ? "+" : ""}{p.value}%</strong>
        </p>
      ))}
      {row?.surprise && (
        <p style={{ fontSize: 11, color: t.amberStrong, marginTop: 4, fontStyle: "italic" }}>
          Surprise event — showing prior context, not anticipatory decline
        </p>
      )}
      <MultiSourceTooltip sourceKeys={["sp500", "nasdaq"]} />
    </div>
  );
}

function ConflictCard({ d }) {
  const t = useTheme().tokens;
  const isDecline = d.spChange < 0;
  const changeColor = isDecline ? t.red : t.green;
  return (
    <div style={{ background: t.bg, border: "1px solid #334155", borderRadius: 10, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <h3 style={{ fontWeight: 600, color: t.textHighAlt, fontSize: 14 }}>{stripYear(d.label)}</h3>
        {d.surprise && (
          <span style={{ fontSize: 10, fontWeight: 600, color: t.amberStrong, background: "rgba(251,191,36,0.12)", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Surprise
          </span>
        )}
      </div>

      <p style={{ fontSize: 11, color: t.textLow, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
        {d.surprise ? "Context Period" : "Buildup Period"}
      </p>
      <p style={{ fontSize: 13, color: t.textMid, marginBottom: 12 }}>{d.period}{d.days ? ` (${d.days} trading days)` : ""}</p>

      <p style={{ fontSize: 11, color: t.textLow, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Catalyst</p>
      <p style={{ fontSize: 12, color: t.textMute, marginBottom: 12 }}>{d.catalyst}</p>

      <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 11, color: t.textLow, marginBottom: 2 }}>S&P 500</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: changeColor }}>
            {d.spChange > 0 ? "+" : ""}{d.spChange}%
          </p>
          <p style={{ fontSize: 11, color: t.axis }}>{d.spStart} → {d.spEnd}</p>
        </div>
        {d.nqChange != null && (
          <div>
            <p style={{ fontSize: 11, color: t.textLow, marginBottom: 2 }}>NASDAQ</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: d.nqChange < 0 ? t.red : t.green }}>
              {d.nqChange > 0 ? "+" : ""}{d.nqChange}%
            </p>
            <p style={{ fontSize: 11, color: t.axis }}>{d.nqStart} → {d.nqEnd}</p>
          </div>
        )}
      </div>

      <p style={{ fontSize: 12, color: t.textMute, lineHeight: 1.5, borderTop: "1px solid #334155", paddingTop: 10 }}>
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
  const t = useTheme().tokens;
  const { filterData } = useEventToggle();

  const filteredPreWar = useMemo(() => filterData(preWarData), [filterData]);

  const chartData = useMemo(() => filteredPreWar.map(d => ({
    label: d.label,
    spChange: d.spChange,
    nqChange: d.nqChange,
    surprise: d.surprise,
  })), [filteredPreWar]);

  return (
    <section style={card}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: t.textHigh, marginBottom: 4 }}>Pre-War Market Buildup</h2>
      <p style={{ fontSize: 13, color: t.textMute, marginBottom: 20 }}>
        How markets performed in the lead-up to each conflict — anticipatory selloffs vs. surprise shocks
      </p>

      {/* Bar chart */}
      <ResponsiveContainer width="100%" height={Math.max(chartData.length * 55, 280)}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
          <ChartDefs />
          <CartesianGrid strokeDasharray="3 3" stroke={t.axis} opacity={0.25} horizontal={false} />
          <XAxis type="number" tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}%`} stroke={t.axis}
            tick={{ fill: t.textMute, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="label" width={185} stroke={t.axis}
            tick={{ fill: t.textMid, fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip filteredPreWar={filteredPreWar} />} cursor={{ fill: "rgba(99,102,241,0.06)" }} wrapperStyle={{ pointerEvents: "auto" }} />
          <ReferenceLine x={0} stroke={t.textLow} strokeWidth={1.5} />
          <Bar dataKey="spChange" name="S&P 500" radius={4} barSize={14} filter="url(#glow-sp)">
            {chartData.map((d, i) => (
              <Cell key={i} fill={d.spChange < 0 ? "url(#grad-sp-neg)" : "url(#grad-sp-pos)"} fillOpacity={d.surprise ? 0.45 : 1}
                stroke={d.spChange < 0 ? t.red : t.green} strokeWidth={2} strokeOpacity={d.surprise ? 0.5 : 0.85} />
            ))}
          </Bar>
          <Bar dataKey="nqChange" name="NASDAQ" radius={4} barSize={14} filter="url(#glow-nq)">
            {chartData.map((d, i) => (
              <Cell key={i} fill={d.nqChange != null ? (d.nqChange < 0 ? "url(#grad-nq-neg)" : "url(#grad-nq-pos)") : "transparent"} fillOpacity={d.surprise ? 0.45 : 1}
                stroke={d.nqChange != null ? (d.nqChange < 0 ? t.red : t.green) : "transparent"} strokeWidth={2} strokeOpacity={d.surprise ? 0.5 : 0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <PillLegend />

      <p style={{ fontSize: 11, color: t.textLow, textAlign: "center", marginTop: 8, marginBottom: 24, fontStyle: "italic" }}>
        Faded bars = surprise events (context only, not anticipatory). <span style={{ color: t.red }}>Red border</span> = market declined. <span style={{ color: t.green }}>Green border</span> = market rose.
      </p>

      {/* Detail cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {filteredPreWar.map(d => <ConflictCard key={d.conflict} d={d} />)}
      </div>
    </section>
  );
}
