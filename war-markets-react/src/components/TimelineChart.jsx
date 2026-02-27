import { useState } from "react";
import { combinedData } from "../data/warData";

const card = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };

const CAP = 250;
const MARGIN = { top: 10, right: 80, bottom: 40, left: 190 };
const ROW_H = 120; // much taller rows for readability
const DOT_R = 8;
const DOT_R_SM = 6.5;

// Line colors to distinguish indices (not just dash pattern)
const SP_LINE = "#818CF8"; // indigo-light for S&P line
const NQ_LINE = "#34D399"; // emerald-light for NASDAQ line

export default function TimelineChart() {
  const [hovered, setHovered] = useState(null);

  const height = combinedData.length * ROW_H;
  const fullH = height + MARGIN.top + MARGIN.bottom;
  const fullW = 900;
  const w = fullW - MARGIN.left - MARGIN.right;

  const xScale = (v) => (Math.min(v, CAP) / CAP) * w;
  const yCenter = (i) => MARGIN.top + i * ROW_H + ROW_H / 2;

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
          <svg width="24" height="14"><line x1="0" y1="7" x2="24" y2="7" stroke={SP_LINE} strokeWidth="3" /></svg> S&P 500
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="24" height="14"><line x1="0" y1="7" x2="24" y2="7" stroke={NQ_LINE} strokeWidth="3" /></svg> NASDAQ
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

          {/* Row separator lines */}
          {combinedData.map((_, i) => i > 0 && (
            <line key={`sep-${i}`} x1={MARGIN.left} y1={MARGIN.top + i * ROW_H}
              x2={MARGIN.left + w} y2={MARGIN.top + i * ROW_H}
              stroke="#334155" strokeOpacity={0.5} />
          ))}

          {/* Rows */}
          {combinedData.map((d, i) => {
            const cy = yCenter(i);
            const hasNQ = d.nqDaysToBottom != null;
            // More vertical separation between S&P and NQ
            const spY = hasNQ ? cy - 18 : cy;
            const nqY = cy + 18;
            const dimmed = hovered != null && hovered !== d.conflict;
            const opacity = dimmed ? 0.12 : 1;
            const isHovered = hovered === d.conflict;

            return (
              <g key={d.conflict} style={{ transition: "opacity 0.2s" }} opacity={opacity}
                onMouseEnter={() => setHovered(d.conflict)}
                onMouseLeave={() => setHovered(null)}>

                {/* Y label */}
                <text x={MARGIN.left - 12} y={cy} dy="0.35em" textAnchor="end" fill="#CBD5E1" fontSize={13} fontWeight={500}>
                  {d.label}
                </text>

                {/* Row background on hover */}
                {isHovered && (
                  <rect x={MARGIN.left} y={cy - ROW_H / 2 + 4} width={w} height={ROW_H - 8}
                    rx={6} fill="#6366F1" fillOpacity={0.06} />
                )}

                {/* ── S&P 500 ── */}
                {/* Index label */}
                <text x={MARGIN.left + 4} y={spY - 14} fill={SP_LINE} fontSize={10} fontWeight={700} letterSpacing="0.05em">
                  S&P
                </text>
                {/* Connecting line */}
                <line x1={MARGIN.left + xScale(d.spDaysToBottom)} y1={spY}
                  x2={MARGIN.left + xScale(d.spDaysToRecover)} y2={spY}
                  stroke={SP_LINE} strokeWidth={3} strokeLinecap="round" />
                {/* Bottom dot */}
                <circle cx={MARGIN.left + xScale(d.spDaysToBottom)} cy={spY} r={DOT_R}
                  fill="#F59E0B" stroke={isHovered ? "#fff" : SP_LINE} strokeWidth={2} />
                {/* Recover dot */}
                <circle cx={MARGIN.left + xScale(d.spDaysToRecover)} cy={spY} r={DOT_R}
                  fill="#10B981" stroke={isHovered ? "#fff" : SP_LINE} strokeWidth={2} />
                {/* Day labels */}
                <text x={MARGIN.left + xScale(d.spDaysToBottom)} y={spY + DOT_R + 14}
                  textAnchor="middle" fill="#F59E0B" fontSize={11} fontWeight={600}>
                  {d.spDaysToBottom}d
                </text>
                {d.spDaysToRecover <= CAP ? (
                  <text x={MARGIN.left + xScale(d.spDaysToRecover)} y={spY + DOT_R + 14}
                    textAnchor="middle" fill="#10B981" fontSize={11} fontWeight={600}>
                    {d.spDaysToRecover}d
                  </text>
                ) : (
                  <text x={MARGIN.left + xScale(d.spDaysToRecover) + 8} y={spY}
                    dy="0.35em" fill="#94A3B8" fontSize={12} fontWeight={700} fontStyle="italic">
                    {d.spDaysToRecover}d →
                  </text>
                )}

                {/* ── NASDAQ ── */}
                {hasNQ ? (
                  <>
                    {/* Index label */}
                    <text x={MARGIN.left + 4} y={nqY - 14} fill={NQ_LINE} fontSize={10} fontWeight={700} letterSpacing="0.05em">
                      NQ
                    </text>
                    {/* Connecting line */}
                    <line x1={MARGIN.left + xScale(d.nqDaysToBottom)} y1={nqY}
                      x2={MARGIN.left + xScale(d.nqDaysToRecover)} y2={nqY}
                      stroke={NQ_LINE} strokeWidth={3} strokeLinecap="round" />
                    {/* Bottom dot */}
                    <circle cx={MARGIN.left + xScale(d.nqDaysToBottom)} cy={nqY} r={DOT_R_SM}
                      fill="#F59E0B" stroke={isHovered ? "#fff" : NQ_LINE} strokeWidth={2} />
                    {/* Recover dot */}
                    <circle cx={MARGIN.left + xScale(d.nqDaysToRecover)} cy={nqY} r={DOT_R_SM}
                      fill="#10B981" stroke={isHovered ? "#fff" : NQ_LINE} strokeWidth={2} />
                    {/* Day labels */}
                    <text x={MARGIN.left + xScale(d.nqDaysToBottom)} y={nqY + DOT_R_SM + 14}
                      textAnchor="middle" fill="#F59E0B" fontSize={10} fontWeight={600}>
                      {d.nqDaysToBottom}d
                    </text>
                    <text x={MARGIN.left + xScale(d.nqDaysToRecover)} y={nqY + DOT_R_SM + 14}
                      textAnchor="middle" fill="#10B981" fontSize={10} fontWeight={600}>
                      {d.nqDaysToRecover}d
                    </text>
                  </>
                ) : (
                  <text x={MARGIN.left + 4} y={nqY} fill="#475569" fontSize={10} fontStyle="italic">
                    NASDAQ not yet trading
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <p style={{ fontSize: 11, color: "#64748B", textAlign: "center", marginTop: 8, fontStyle: "italic" }}>
        Hover over a conflict to isolate it. Purple line = S&P 500, green line = NASDAQ.
      </p>
    </section>
  );
}
