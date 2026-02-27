import { combinedData } from "../data/warData";

const section = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };
const CAP = 250;

function BarRow({ label, value, color, maxVal }) {
  const pct = Math.min(value / maxVal, 1) * 100;
  const capped = value > maxVal;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <span style={{ width: 56, fontSize: 11, color: "#64748B", flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 14, background: "#0F172A", borderRadius: 7, overflow: "hidden", position: "relative" }}>
        <div style={{
          width: `${pct}%`, height: "100%", background: color, borderRadius: 7,
          transition: "width 0.6s ease",
        }} />
        {capped && (
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: 3,
            background: "#F8FAFC", opacity: 0.5, borderRadius: 2,
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
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: "0.05em", marginBottom: 6 }}>
        {name}
      </div>
      <BarRow label="Bottom" value={bottom} color="#F59E0B" maxVal={maxVal} />
      <BarRow label="to Recover" value={recover} color="#10B981" maxVal={maxVal} />
    </div>
  );
}

function ConflictCard({ d, maxVal }) {
  const hasNQ = d.nqDaysToBottom != null;
  return (
    <div style={{
      background: "#0F172A", border: "1px solid #334155", borderRadius: 10, padding: 16,
    }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "#E2E8F0", marginBottom: 12 }}>
        {d.label}
      </h3>

      <IndexBlock name="S&P 500" color="#818CF8" bottom={d.spDaysToBottom} recover={d.spDaysToRecover} maxVal={maxVal} />

      {hasNQ ? (
        <IndexBlock name="NASDAQ" color="#34D399" bottom={d.nqDaysToBottom} recover={d.nqDaysToRecover} maxVal={maxVal} />
      ) : (
        <div style={{ fontSize: 11, color: "#475569", fontStyle: "italic", marginTop: 4 }}>
          NASDAQ not yet trading
        </div>
      )}
    </div>
  );
}

export default function TimelineChart() {
  return (
    <section style={section}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#F8FAFC", marginBottom: 4 }}>Speed of Decline vs. Recovery</h2>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 8 }}>
        Trading days from conflict start to market bottom, and from bottom back to pre-war level
      </p>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap", fontSize: 12, color: "#CBD5E1" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: "#F59E0B", display: "inline-block" }} /> Days to Bottom
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: "#10B981", display: "inline-block" }} /> Days to Recover
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: "#818CF8", display: "inline-block" }} /> S&P 500
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: "#34D399", display: "inline-block" }} /> NASDAQ
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
        {combinedData.map(d => (
          <ConflictCard key={d.conflict} d={d} maxVal={CAP} />
        ))}
      </div>

      <p style={{ fontSize: 11, color: "#64748B", textAlign: "center", marginTop: 12, fontStyle: "italic" }}>
        Bars scaled to {CAP} days max. WWII recovery (917d) extends beyond scale.
      </p>
    </section>
  );
}
