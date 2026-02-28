import { sp500Data, preWarData, globalMarketsData, cpiChartData, costOfLivingData } from "../data/warData";

/* ── Sparkline components ── */

function BarSparkline({ values, color, width = 120, height = 32 }) {
  const max = Math.max(...values.map(Math.abs));
  const barW = (width - (values.length - 1) * 2) / values.length;
  return (
    <svg width={width} height={height} style={{ opacity: 0.7, display: "block" }}>
      {values.map((v, i) => {
        const barH = (Math.abs(v) / max) * height;
        return (
          <rect
            key={i}
            x={i * (barW + 2)}
            y={height - barH}
            width={barW}
            height={barH}
            rx={1}
            fill={color}
          />
        );
      })}
    </svg>
  );
}

function SignedBarSparkline({ values, color, width = 120, height = 32 }) {
  const max = Math.max(...values.map(Math.abs));
  const mid = height / 2;
  const barW = (width - (values.length - 1) * 2) / values.length;
  return (
    <svg width={width} height={height} style={{ opacity: 0.7, display: "block" }}>
      {/* zero line */}
      <line x1={0} y1={mid} x2={width} y2={mid} stroke="#475569" strokeWidth={0.5} />
      {values.map((v, i) => {
        const barH = (Math.abs(v) / max) * (mid - 1);
        const y = v >= 0 ? mid - barH : mid;
        return (
          <rect
            key={i}
            x={i * (barW + 2)}
            y={y}
            width={barW}
            height={barH}
            rx={1}
            fill={v >= 0 ? "#34D399" : "#EF4444"}
          />
        );
      })}
    </svg>
  );
}

function LineSparkline({ values, color, width = 120, height = 32 }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} style={{ opacity: 0.7, display: "block" }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GroupedBarSparkline({ groups, color, width = 120, height = 32 }) {
  const max = Math.max(...groups.flat());
  const groupW = (width - (groups.length - 1) * 4) / groups.length;
  return (
    <svg width={width} height={height} style={{ opacity: 0.7, display: "block" }}>
      {groups.map((bars, gi) => {
        const barW = (groupW - (bars.length - 1)) / bars.length;
        const gx = gi * (groupW + 4);
        return bars.map((v, bi) => {
          const barH = (v / max) * height;
          return (
            <rect
              key={`${gi}-${bi}`}
              x={gx + bi * (barW + 1)}
              y={height - barH}
              width={barW}
              height={barH}
              rx={1}
              fill={color}
              opacity={0.5 + (bi / bars.length) * 0.5}
            />
          );
        });
      })}
    </svg>
  );
}

/* ── Build sparkline data from warData exports ── */

// Post-Conflict Reaction: S&P 500 decline percentages
const reactionValues = sp500Data.map((d) => d.decline);

// Pre-War Buildup: spChange values (positive/negative)
const buildupValues = preWarData.map((d) => d.spChange);

// Global Markets: pick 3 conflicts with multiple indices, show decline values
const globalGroups = globalMarketsData
  .filter((d) => d.indices.length >= 3)
  .slice(0, 4)
  .map((d) =>
    d.indices
      .filter((idx) => idx.decline != null)
      .slice(0, 3)
      .map((idx) => idx.decline)
  );

// Fiscal Impact: CPI line from WWII series (T-2 to T+10)
const fiscalValues = cpiChartData.map((row) => row["WWII"]).filter((v) => v != null);

// Cost of Living: CPI multipliers per era
const costValues = costOfLivingData.map((d) => d.cpiMultiplier);

/* ── Card sparkline map ── */
function CardSparkline({ id, color }) {
  switch (id) {
    case "reaction":
      return <BarSparkline values={reactionValues} color={color} />;
    case "buildup":
      return <SignedBarSparkline values={buildupValues} color={color} />;
    case "global":
      return <GroupedBarSparkline groups={globalGroups} color={color} />;
    case "fiscal":
      return <LineSparkline values={fiscalValues} color={color} />;
    case "cost":
      return <BarSparkline values={costValues} color={color} />;
    default:
      return null;
  }
}

/* ── Card data ── */

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
    stat: "21.3\u00d7",
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
  transition: "all 0.25s ease",
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
        {cards.map((c, i) => (
          <button
            key={c.id}
            className={`card-enter card-enter-${i}`}
            onClick={() => onSelect(c.id)}
            style={panel}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#475569";
              e.currentTarget.style.background = "#243044";
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = `0 0 20px ${c.color}33`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#334155";
              e.currentTarget.style.background = "#1E293B";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
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

            {/* Sparkline */}
            {c.id !== "methodology" && (
              <div style={{ marginTop: -4, marginBottom: -4 }}>
                <CardSparkline id={c.id} color={c.color} />
              </div>
            )}

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
