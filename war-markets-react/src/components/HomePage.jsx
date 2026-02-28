import { useState, useEffect, useRef } from "react";
import { sp500Data, preWarData, globalMarketsData, cpiChartData, costOfLivingData } from "../data/warData";

/* ── AnimatedStat: counts from 0 to final value ── */

function AnimatedStat({ value, color }) {
  const [display, setDisplay] = useState("0");
  const rafRef = useRef(null);

  useEffect(() => {
    if (!value) return;

    // Parse numeric portion and suffix
    const match = value.match(/^([\d.]+)(.*)/);
    if (!match) {
      setDisplay(value);
      return;
    }

    const target = parseFloat(match[1]);
    const suffix = match[2]; // e.g. "%", "×", ""
    const hasDecimal = match[1].includes(".");
    const duration = 1200; // ms
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = eased * target;

      if (hasDecimal) {
        setDisplay(current.toFixed(1) + suffix);
      } else {
        setDisplay(Math.round(current) + suffix);
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value]);

  return (
    <div style={{ fontSize: 20, fontWeight: 700, color, lineHeight: 1 }}>
      {display}
    </div>
  );
}

/* ── Sparkline components ── */

function BarSparkline({ values, color, width = 120, height = 32, animated = false }) {
  const max = Math.max(...values.map(Math.abs));
  const barW = (width - (values.length - 1) * 2) / values.length;
  return (
    <svg width={width} height={height} style={{ opacity: 0.7, display: "block" }}>
      {values.map((v, i) => {
        const barH = (Math.abs(v) / max) * height;
        return (
          <rect
            key={i}
            className={animated ? "sparkline-bar" : undefined}
            style={animated ? { animationDelay: `${i * 60}ms` } : undefined}
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

function SignedBarSparkline({ values, color, width = 120, height = 32, animated = false }) {
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
            className={animated ? "sparkline-bar" : undefined}
            style={animated ? { animationDelay: `${i * 60}ms` } : undefined}
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

function LineSparkline({ values, color, width = 120, height = 32, animated = false }) {
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

  // Estimate path length for dash animation
  const pathLength = width * 1.5;

  return (
    <svg width={width} height={height} style={{ opacity: 0.7, display: "block" }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? "sparkline-draw" : undefined}
        style={animated ? { "--line-length": pathLength } : undefined}
      />
    </svg>
  );
}

function GroupedBarSparkline({ groups, color, width = 120, height = 32, animated = false }) {
  const max = Math.max(...groups.flat());
  const groupW = (width - (groups.length - 1) * 4) / groups.length;
  let barIndex = 0;
  return (
    <svg width={width} height={height} style={{ opacity: 0.7, display: "block" }}>
      {groups.map((bars, gi) => {
        const barW = (groupW - (bars.length - 1)) / bars.length;
        const gx = gi * (groupW + 4);
        return bars.map((v, bi) => {
          const barH = (v / max) * height;
          const idx = barIndex++;
          return (
            <rect
              key={`${gi}-${bi}`}
              className={animated ? "sparkline-bar" : undefined}
              style={animated ? { animationDelay: `${idx * 60}ms` } : undefined}
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

// Global Markets: pick conflicts with multiple indices, show decline values
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
function CardSparkline({ id, color, hero }) {
  const w = hero ? 200 : 120;
  const h = hero ? 48 : 32;
  switch (id) {
    case "reaction":
      return <BarSparkline values={reactionValues} color={color} width={w} height={h} animated />;
    case "buildup":
      return <SignedBarSparkline values={buildupValues} color={color} width={w} height={h} animated />;
    case "global":
      return <GroupedBarSparkline groups={globalGroups} color={color} width={w} height={h} animated />;
    case "fiscal":
      return <LineSparkline values={fiscalValues} color={color} width={w} height={h} animated />;
    case "cost":
      return <BarSparkline values={costValues} color={color} width={w} height={h} animated />;
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
    hero: true,
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

/* ── Glow orb helper ── */
function GlowOrb({ color, size, top, left, delay }) {
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(100px)",
        opacity: 0.12,
        top,
        left,
        animation: `float 20s ease-in-out ${delay}s infinite alternate`,
        pointerEvents: "none",
      }}
    />
  );
}

export default function HomePage({ onSelect }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", overflow: "hidden" }}>
      {/* Ambient glow orbs */}
      <GlowOrb color="#6366F1" size={400} top="-10%" left="-10%" delay={0} />
      <GlowOrb color="#8B5CF6" size={350} top="30%" left="40%" delay={3} />
      <GlowOrb color="#10B981" size={400} top="60%" left="70%" delay={6} />

      <div className="bento-grid">
        {cards.map((c, i) => (
          <button
            key={c.id}
            className={`glass-card card-enter card-enter-${i}${c.hero ? " bento-hero" : ""}`}
            style={{
              "--card-glow": `linear-gradient(135deg, ${c.color}4D, transparent 60%)`,
              boxShadow: "none",
            }}
            onClick={() => onSelect(c.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 8px 32px ${c.color}33`;
            }}
            onMouseLeave={(e) => {
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
              <h3 style={{ fontSize: c.hero ? 18 : 15, fontWeight: 600, color: "#F8FAFC", margin: 0 }}>
                {c.title}
              </h3>
            </div>

            {/* Description */}
            <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.5, margin: 0 }}>
              {c.desc}
            </p>

            {/* Sparkline */}
            {c.id !== "methodology" && (
              <div style={{ marginTop: c.hero ? 4 : -4, marginBottom: c.hero ? 4 : -4 }}>
                <CardSparkline id={c.id} color={c.color} hero={c.hero} />
              </div>
            )}

            {/* Stat + tag row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: c.hero ? 8 : 4 }}>
              {c.stat ? (
                <div>
                  <AnimatedStat value={c.stat} color={c.color} />
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
