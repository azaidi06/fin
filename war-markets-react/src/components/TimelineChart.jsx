import { useState } from "react";
import { combinedData } from "../data/warData";

const card = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };

const CAP = 250;
const MARGIN = { top: 10, right: 80, bottom: 40, left: 190 };
const ROW_H = 72;
const DOT_R = 7;
const DOT_R_SM = 5.5;

export default function TimelineChart() {
  const [hovered, setHovered] = useState(null); // conflict key or null

  const height = combinedData.length * ROW_H;
  const fullH = height + MARGIN.top + MARGIN.bottom;
  const fullW = 900;
  const w = fullW - MARGIN.left - MARGIN.right;

  // Scale: 0 → CAP maps to 0 → w
  const xScale = (v) => (Math.min(v, CAP) / CAP) * w;
  const yCenter = (i) => MARGIN.top + i * ROW_H + ROW_H / 2;

  // Ticks
  const ticks = [0, 50, 100, 150, 200, 250];

  return (
    <section style={card}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#F8FAFC", marginBottom: 4 }}>Speed of Decline vs. Recovery</h2>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 8 }}>
        Trading days from conflict start to market bottom, and from bottom back to pre-war level
      </p>

      {/* Legend */}
      <div style={{ display: "flex", gap: 20, justifyContent: "center", marginBottom: 16, flexWrap: "wrap", fontSize: 12, color: "#CBD5E1" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="14" height="14"><circle cx="7" cy="7" r="5" fill="#F59E0B" /></svg> Days to Bottom
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="14" height="14"><circle cx="7" cy="7" r="5" fill="#10B981" /></svg> Days to Recover
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="24" height="14"><line x1="0" y1="7" x2="24" y2="7" stroke="#94A3B8" strokeWidth="2" /></svg> S&P 500
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="24" height="14"><line x1="0" y1="7" x2="24" y2="7" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4,3" /></svg> NASDAQ
        </span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <svg viewBox={`0 0 ${fullW} ${fullH}`} style={{ width: "100%", maxWidth: fullW }}>
          {/* Grid lines */}
          {ticks.map(t => (
            <line key={t} x1={MARGIN.left + xScale(t)} y1={MARGIN.top} x2={MARGIN.left + xScale(t)} y2={MARGIN.top + height}
              stroke="#475569" strokeOpacity={0.2} />
          ))}

          {/* X axis ticks */}
          {ticks.map(t => (
            <text key={t} x={MARGIN.left + xScale(t)} y={MARGIN.top + height + 20}
              textAnchor="middle" fill="#94A3B8" fontSize={12}>{t}d</text>
          ))}
          <text x={MARGIN.left + w / 2} y={fullH - 4} textAnchor="middle" fill="#94A3B8" fontSize={12}>
            Trading Days (capped at {CAP}d)
          </text>

          {/* Rows */}
          {combinedData.map((d, i) => {
            const cy = yCenter(i);
            const hasNQ = d.nqDaysToBottom != null;
            const spY = hasNQ ? cy - 10 : cy;
            const nqY = cy + 10;
            const dimmed = hovered != null && hovered !== d.conflict;
            const opacity = dimmed ? 0.15 : 1;

            return (
              <g key={d.conflict} style={{ transition: "opacity 0.2s" }} opacity={opacity}
                onMouseEnter={() => setHovered(d.conflict)}
                onMouseLeave={() => setHovered(null)}>

                {/* Y label */}
                <text x={MARGIN.left - 12} y={cy} dy="0.35em" textAnchor="end" fill="#CBD5E1" fontSize={13}>
                  {d.label}
                </text>

                {/* Row background on hover */}
                {hovered === d.conflict && (
                  <rect x={MARGIN.left} y={cy - ROW_H / 2 + 4} width={w} height={ROW_H - 8}
                    rx={6} fill="#6366F1" fillOpacity={0.06} />
                )}

                {/* S&P line (solid) */}
                <line x1={MARGIN.left + xScale(d.spDaysToBottom)} y1={spY}
                  x2={MARGIN.left + xScale(d.spDaysToRecover)} y2={spY}
                  stroke="#64748B" strokeWidth={2} />
                {/* S&P bottom dot */}
                <circle cx={MARGIN.left + xScale(d.spDaysToBottom)} cy={spY} r={DOT_R}
                  fill="#F59E0B" stroke={hovered === d.conflict ? "#fff" : "transparent"} strokeWidth={2} />
                {/* S&P recover dot */}
                <circle cx={MARGIN.left + xScale(d.spDaysToRecover)} cy={spY} r={DOT_R}
                  fill="#10B981" stroke={hovered === d.conflict ? "#fff" : "transparent"} strokeWidth={2} />

                {/* S&P labels */}
                <text x={MARGIN.left + xScale(d.spDaysToBottom)} y={spY - 12}
                  textAnchor="middle" fill="#F59E0B" fontSize={10} fontWeight={600}>
                  {d.spDaysToBottom}d
                </text>
                {d.spDaysToRecover <= CAP ? (
                  <text x={MARGIN.left + xScale(d.spDaysToRecover)} y={spY - 12}
                    textAnchor="middle" fill="#10B981" fontSize={10} fontWeight={600}>
                    {d.spDaysToRecover}d
                  </text>
                ) : (
                  <text x={MARGIN.left + xScale(d.spDaysToRecover) + 8} y={spY}
                    dy="0.35em" fill="#94A3B8" fontSize={11} fontWeight={600} fontStyle="italic">
                    {d.spDaysToRecover}d →
                  </text>
                )}

                {/* NASDAQ line (dashed) */}
                {hasNQ && (
                  <>
                    <line x1={MARGIN.left + xScale(d.nqDaysToBottom)} y1={nqY}
                      x2={MARGIN.left + xScale(d.nqDaysToRecover)} y2={nqY}
                      stroke="#64748B" strokeWidth={2} strokeDasharray="5,4" />
                    <circle cx={MARGIN.left + xScale(d.nqDaysToBottom)} cy={nqY} r={DOT_R_SM}
                      fill="#F59E0B" fillOpacity={0.8} stroke={hovered === d.conflict ? "#fff" : "transparent"} strokeWidth={2} />
                    <circle cx={MARGIN.left + xScale(d.nqDaysToRecover)} cy={nqY} r={DOT_R_SM}
                      fill="#10B981" fillOpacity={0.8} stroke={hovered === d.conflict ? "#fff" : "transparent"} strokeWidth={2} />

                    {/* NASDAQ labels */}
                    <text x={MARGIN.left + xScale(d.nqDaysToBottom)} y={nqY + 16}
                      textAnchor="middle" fill="#FBBF24" fontSize={9} fontWeight={500}>
                      {d.nqDaysToBottom}d
                    </text>
                    <text x={MARGIN.left + xScale(d.nqDaysToRecover)} y={nqY + 16}
                      textAnchor="middle" fill="#34D399" fontSize={9} fontWeight={500}>
                      {d.nqDaysToRecover}d
                    </text>
                  </>
                )}

                {/* "No NASDAQ" note for pre-1971 conflicts */}
                {!hasNQ && (
                  <text x={MARGIN.left + w} y={cy + 14} textAnchor="end" fill="#475569" fontSize={9} fontStyle="italic">
                    NASDAQ n/a
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hover instruction */}
      <p style={{ fontSize: 11, color: "#64748B", textAlign: "center", marginTop: 8, fontStyle: "italic" }}>
        Hover over a conflict to isolate it. Solid line = S&P 500, dashed = NASDAQ.
      </p>
    </section>
  );
}
