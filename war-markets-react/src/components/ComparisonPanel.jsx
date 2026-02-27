import { sharedConflicts } from "../data/warData";

const card = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };

export default function ComparisonPanel() {
  return (
    <section style={card}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#F8FAFC", marginBottom: 4 }}>NASDAQ vs. S&P 500 Comparison</h2>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20 }}>Side-by-side metrics for conflicts where both indices have data</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {sharedConflicts.map((d) => (
          <div key={d.conflict} style={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 10, padding: 20 }}>
            <h3 style={{ fontWeight: 600, color: "#E2E8F0", fontSize: 14, marginBottom: 16 }}>{d.label}</h3>

            <div style={{ fontSize: 13 }}>
              {/* Decline comparison */}
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Max Decline</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "#818CF8" }}>S&P: -{d.spDecline}%</span>
                  <span style={{ color: "#34D399" }}>NQ: -{d.nqDecline}%</span>
                </div>
                <div style={{ display: "flex", gap: 3, height: 6, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ background: "#6366F1", borderRadius: 3, width: `${(d.spDecline / 26) * 100}%` }} />
                  <div style={{ background: "#10B981", borderRadius: 3, width: `${(d.nqDecline / 26) * 100}%` }} />
                </div>
              </div>

              {/* Speed comparison */}
              <div style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Days to Bottom</p>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#CBD5E1" }}>
                  <span>S&P: {d.spDaysToBottom}d</span>
                  <span>NQ: {d.nqDaysToBottom}d</span>
                </div>
              </div>

              <div style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Days to Recover</p>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#CBD5E1" }}>
                  <span>S&P: {d.spDaysToRecover}d</span>
                  <span>NQ: {d.nqDaysToRecover}d</span>
                </div>
              </div>

              {/* Ratio */}
              <div style={{ paddingTop: 8, borderTop: "1px solid #334155" }}>
                <span style={{ fontSize: 12, color: "#64748B" }}>NASDAQ / S&P ratio: </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: parseFloat(d.ratio) > 1 ? "#EF4444" : "#10B981" }}>
                  {d.ratio}x
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
