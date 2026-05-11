import { useMemo } from "react";
import { sp500Data, nasdaqData } from "../data/warData";
import SourceLink from "./SourceLink";
import { useEventToggle } from "../context/EventToggleContext";

import { useTheme } from '../theme/ThemeContext';
const section = { background: 'var(--c-panel)', border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };
const CAP = 250;

function BarRow({ label, value, color, maxVal }) {
  const t = useTheme().tokens;
  const pct = Math.min(value / maxVal, 1) * 100;
  const capped = value > maxVal;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <span style={{ width: 56, fontSize: 11, color: t.textLow, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 14, background: t.bg, borderRadius: 7, overflow: "hidden", position: "relative" }}>
        <div style={{
          width: `${pct}%`, height: "100%", background: color, borderRadius: 7,
          transition: "width 0.6s ease",
        }} />
        {capped && (
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: 3,
            background: t.textHigh, opacity: 0.5, borderRadius: 2,
          }} />
        )}
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color, minWidth: 48, textAlign: "right" }}>
        {value}d{capped ? " →" : ""}
      </span>
    </div>
  );
}

function IndexBlock({ name, color, bottom, recover, maxVal }) {
  const t = useTheme().tokens;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: "0.05em", marginBottom: 6 }}>
        {name}
      </div>
      <BarRow label="Bottom" value={bottom} color={t.amber} maxVal={maxVal} />
      <BarRow label="to Recover" value={recover} color={t.green} maxVal={maxVal} />
    </div>
  );
}

function ConflictCard({ d, maxVal }) {
  const t = useTheme().tokens;
  const hasNQ = d.nqDaysToBottom != null;
  return (
    <div style={{
      background: t.bg, border: "1px solid #334155", borderRadius: 10, padding: 16,
    }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: t.textHighAlt, marginBottom: 12 }}>
        {d.label}
      </h3>

      <IndexBlock name="S&P 500" color={t.indigoSoft} bottom={d.spDaysToBottom} recover={d.spRecoveryPhase} maxVal={maxVal} />

      {hasNQ ? (
        <IndexBlock name="NASDAQ" color={t.greenSoft} bottom={d.nqDaysToBottom} recover={d.nqRecoveryPhase} maxVal={maxVal} />
      ) : (
        <div style={{ fontSize: 11, color: t.axis, fontStyle: "italic", marginTop: 4 }}>
          NASDAQ not yet trading
        </div>
      )}
      <div style={{ display: "flex", gap: 12, marginTop: 8, borderTop: "1px solid #334155", paddingTop: 8 }}>
        <SourceLink sourceKey="sp500" />
        {hasNQ && <SourceLink sourceKey="nasdaq" />}
      </div>
    </div>
  );
}

export default function TimelineChart() {
  const t = useTheme().tokens;
  const { filterData } = useEventToggle();

  const combinedData = useMemo(() => {
    const filtered500 = filterData(sp500Data);
    const filteredNQ = filterData(nasdaqData);
    // daysToRecover in the source data is total days from EVENT; the
    // recovery phase alone (bottom → back to pre-war level) is the diff.
    const recoveryPhase = (toBottom, toRecoverTotal) =>
      toBottom != null && toRecoverTotal != null ? toRecoverTotal - toBottom : null;
    return filtered500.map(sp => {
      const nq = filteredNQ.find(n => n.conflict === sp.conflict);
      return {
        conflict: sp.conflict,
        label: sp.label,
        date: sp.date,
        spDecline: sp.decline,
        nqDecline: nq ? nq.decline : null,
        spDaysToBottom: sp.daysToBottom,
        nqDaysToBottom: nq ? nq.daysToBottom : null,
        spRecoveryPhase: recoveryPhase(sp.daysToBottom, sp.daysToRecover),
        nqRecoveryPhase: nq ? recoveryPhase(nq.daysToBottom, nq.daysToRecover) : null,
      };
    });
  }, [filterData]);

  return (
    <section style={section}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: t.textHigh, marginBottom: 4 }}>Speed of Decline vs. Recovery</h2>
      <p style={{ fontSize: 13, color: t.textMute, marginBottom: 8 }}>
        Trading days from conflict start to market bottom, and from bottom back to pre-war level
      </p>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap", fontSize: 12, color: t.textMid }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: t.amber, display: "inline-block" }} /> Days to Bottom
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: t.green, display: "inline-block" }} /> Days to Recover
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: t.indigoSoft, display: "inline-block" }} /> S&P 500
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: t.greenSoft, display: "inline-block" }} /> NASDAQ
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
        {combinedData.map(d => (
          <ConflictCard key={d.conflict} d={d} maxVal={CAP} />
        ))}
      </div>

      <p style={{ fontSize: 11, color: t.textLow, textAlign: "center", marginTop: 12, fontStyle: "italic" }}>
        Bars scaled to {CAP} days max. Oil Embargo recovery (1,435d) and WWII recovery (774d) extend beyond scale.
      </p>
    </section>
  );
}
