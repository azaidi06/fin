const cards = [
  {
    id: "reaction",
    title: "Post-Conflict Reaction",
    desc: "S&P 500 & NASDAQ drawdowns after major conflicts — how far markets fell and how long recovery took.",
    gradient: "linear-gradient(135deg, #6366F1, #818CF8)",
  },
  {
    id: "buildup",
    title: "Pre-War Buildup",
    desc: "How markets behaved in the lead-up to war — from first escalation signals to the eve of conflict.",
    gradient: "linear-gradient(135deg, #10B981, #34D399)",
  },
  {
    id: "global",
    title: "Global Markets",
    desc: "International index reactions to U.S. conflicts — FTSE, DAX, Nikkei, Hang Seng, and more.",
    gradient: "linear-gradient(135deg, #F59E0B, #FBBF24)",
  },
  {
    id: "fiscal",
    title: "Fiscal Impact",
    desc: "CPI inflation & federal debt trajectories across wartime eras — the long-term fiscal footprint.",
    gradient: "linear-gradient(135deg, #EF4444, #F87171)",
  },
  {
    id: "cost",
    title: "Cost of Living",
    desc: "Everyday prices across wartime eras — housing, gas, food, tuition, and income in 2024 dollars.",
    gradient: "linear-gradient(135deg, #8B5CF6, #A78BFA)",
  },
  {
    id: "methodology",
    title: "Methodology",
    desc: "How we calculate every number — formulas, data sources, CPI adjustments, and limitations.",
    gradient: "linear-gradient(135deg, #64748B, #94A3B8)",
  },
];

const cardStyle = {
  background: "#1E293B",
  border: "1px solid #334155",
  borderRadius: 12,
  padding: "28px 24px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  textAlign: "left",
};

export default function HomePage({ onSelect }) {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <p style={{ fontSize: 15, color: "#94A3B8", lineHeight: 1.6 }}>
          Explore how U.S. stock markets have reacted to every major conflict
          from WWII to the Iraq War — drawdowns, recoveries, inflation, and the
          true cost of war.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
        }}
        className="home-grid"
      >
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#6366F1";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 30px rgba(99,102,241,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#334155";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundImage: c.gradient,
                marginBottom: 12,
              }}
            />
            <h3
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#F8FAFC",
                marginBottom: 6,
              }}
            >
              {c.title}
            </h3>
            <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.5, margin: 0 }}>
              {c.desc}
            </p>
          </button>
        ))}
      </div>

      <style>{`
        @media (max-width: 500px) {
          .home-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
