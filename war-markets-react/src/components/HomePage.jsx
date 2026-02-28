const cards = [
  {
    id: "reaction",
    title: "Post-Conflict Reaction",
    desc: "How far markets fell and how long recovery took.",
    gradient: "linear-gradient(135deg, #6366F1, #818CF8)",
    accent: "#6366F1",
  },
  {
    id: "buildup",
    title: "Pre-War Buildup",
    desc: "Market behavior from first escalation to eve of conflict.",
    gradient: "linear-gradient(135deg, #10B981, #34D399)",
    accent: "#10B981",
  },
  {
    id: "global",
    title: "Global Markets",
    desc: "FTSE, DAX, Nikkei, and Hang Seng reactions to U.S. wars.",
    gradient: "linear-gradient(135deg, #F59E0B, #FBBF24)",
    accent: "#F59E0B",
  },
  {
    id: "fiscal",
    title: "Fiscal Impact",
    desc: "Inflation spikes and federal debt across wartime eras.",
    gradient: "linear-gradient(135deg, #EF4444, #F87171)",
    accent: "#EF4444",
  },
  {
    id: "cost",
    title: "Cost of Living",
    desc: "Housing, gas, food, and income in 2024 dollars.",
    gradient: "linear-gradient(135deg, #8B5CF6, #A78BFA)",
    accent: "#8B5CF6",
  },
  {
    id: "methodology",
    title: "Methodology",
    desc: "Formulas, data sources, and limitations.",
    gradient: "linear-gradient(135deg, #64748B, #94A3B8)",
    accent: "#64748B",
  },
];

const cardStyle = {
  background: "#1E293B",
  border: "1px solid #334155",
  borderRadius: 12,
  padding: "24px 24px 24px 28px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  textAlign: "left",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
};

export default function HomePage({ onSelect }) {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
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
              e.currentTarget.style.borderColor = c.accent;
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 8px 30px ${c.accent}26`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#334155";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
            }}
          >
            {/* Left accent bar */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 4,
                backgroundImage: c.gradient,
                borderRadius: "12px 0 0 12px",
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
