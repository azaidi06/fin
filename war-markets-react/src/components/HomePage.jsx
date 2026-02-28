const cards = [
  {
    id: "reaction",
    title: "Post-Conflict Reaction",
    desc: "How far markets fell and how long recovery took",
    color: "#6366F1",
    stat: "33.8%",
    statLabel: "Worst drawdown (WWII)",
    tag: "S&P 500 + NASDAQ",
  },
  {
    id: "buildup",
    title: "Pre-War Buildup",
    desc: "Market moves from first escalation to eve of conflict",
    color: "#10B981",
    stat: "6",
    statLabel: "Conflicts tracked",
    tag: "Buildup windows",
  },
  {
    id: "global",
    title: "Global Markets",
    desc: "International index reactions to U.S. wars",
    color: "#F59E0B",
    stat: "5",
    statLabel: "Global indices",
    tag: "FTSE · DAX · Nikkei · HSI",
  },
  {
    id: "fiscal",
    title: "Fiscal Impact",
    desc: "Inflation spikes and federal debt across wartime eras",
    color: "#EF4444",
    stat: "118%",
    statLabel: "Peak debt/GDP (WWII)",
    tag: "CPI + Debt/GDP",
  },
  {
    id: "cost",
    title: "Cost of Living",
    desc: "Housing, gas, food, tuition, and income in 2024 dollars",
    color: "#8B5CF6",
    stat: "21.3×",
    statLabel: "CPI multiplier since 1941",
    tag: "Adjusted to 2024 USD",
  },
  {
    id: "methodology",
    title: "Methodology",
    desc: "Formulas, data sources, CPI adjustments, and limitations",
    color: "#94A3B8",
    stat: null,
    statLabel: null,
    tag: "How we calculate",
  },
];

const panel = {
  background: "#1E293B",
  border: "1px solid #334155",
  borderRadius: 12,
  padding: 24,
  cursor: "pointer",
  transition: "all 0.2s ease",
  textAlign: "left",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const badge = (color) => ({
  fontSize: 9,
  fontWeight: 600,
  color,
  background: `${color}1F`,
  padding: "2px 8px",
  borderRadius: 4,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  alignSelf: "flex-start",
});

export default function HomePage({ onSelect }) {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            style={panel}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#475569";
              e.currentTarget.style.background = "#243044";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#334155";
              e.currentTarget.style.background = "#1E293B";
            }}
          >
            {/* Color dot + title row */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: c.color,
                  flexShrink: 0,
                }}
              />
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#F8FAFC", margin: 0 }}>
                {c.title}
              </h3>
            </div>

            {/* Description */}
            <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.5, margin: 0 }}>
              {c.desc}
            </p>

            {/* Stat + tag row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 4 }}>
              {c.stat ? (
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: c.color, lineHeight: 1 }}>
                    {c.stat}
                  </div>
                  <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>
                    {c.statLabel}
                  </div>
                </div>
              ) : (
                <div />
              )}
              <span style={badge(c.color)}>{c.tag}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
