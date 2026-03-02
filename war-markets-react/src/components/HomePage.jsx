import { useState, useEffect, useRef, useMemo } from "react";
import { sp500Data, preWarData, globalMarketsData, costOfLivingData, totalDebtData, buildCpiChartData } from "../data/warData";
import { wealthTimeSeries } from "../data/wealthData";
import { useEventToggle } from "../context/EventToggleContext";

/* ── Tablet detection hook ── */
function useIsTablet() {
  const [t, setT] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 601 && window.innerWidth <= 1024
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 601px) and (max-width: 1024px)');
    const h = (e) => setT(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return t;
}

/* ── AnimatedStat: counts from 0 to final value ── */

function AnimatedStat({ value, color }) {
  const [display, setDisplay] = useState("0");
  const rafRef = useRef(null);

  useEffect(() => {
    if (!value) return;

    // Parse numeric portion and suffix
    const match = value.match(/^([^0-9]*)([\d.]+)(.*)/);
    if (!match) {
      setDisplay(value);
      return;
    }

    const prefix = match[1]; // e.g. "$", "+", "-", ""
    const target = parseFloat(match[2]);
    const suffix = match[3]; // e.g. "%", "×", "T"
    const hasDecimal = match[2].includes(".");
    const duration = 1200; // ms
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = eased * target;

      if (hasDecimal) {
        setDisplay(prefix + current.toFixed(1) + suffix);
      } else {
        setDisplay(prefix + Math.round(current) + suffix);
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

/* ── Card sparkline map ── */
function CardSparkline({ id, color, filterData, activeConflicts, isTablet }) {
  const w = 120;
  const h = isTablet ? 24 : 32;

  const reactionValues = useMemo(() => filterData(sp500Data).map(d => d.decline), [filterData]);
  const buildupValues = useMemo(() => filterData(preWarData).map(d => d.spChange), [filterData]);
  const globalGroups = useMemo(() =>
    filterData(globalMarketsData)
      .filter(d => d.indices.length >= 3)
      .slice(0, 4)
      .map(d => d.indices.filter(idx => idx.decline != null).slice(0, 3).map(idx => idx.decline)),
    [filterData]
  );
  const fiscalValues = useMemo(() => {
    const chart = buildCpiChartData(activeConflicts);
    return chart.map(row => row["WWII"]).filter(v => v != null);
  }, [activeConflicts]);
  const costValues = useMemo(() => filterData(costOfLivingData).map(d => d.cpiMultiplier), [filterData]);
  const debtTimelineValues = useMemo(() => totalDebtData.map(d => d.debt), []);
  const wealthValues = useMemo(() => wealthTimeSeries.map(d => d.top1), []);

  switch (id) {
    case "reaction":
      return <BarSparkline values={reactionValues} color={color} width={w} height={h} animated />;
    case "buildup":
      return <SignedBarSparkline values={buildupValues} color={color} width={w} height={h} animated />;
    case "global":
      return globalGroups.length > 0 ? <GroupedBarSparkline groups={globalGroups} color={color} width={w} height={h} animated /> : null;
    case "fiscal":
      return <LineSparkline values={fiscalValues} color={color} width={w} height={h} animated />;
    case "cost":
      return <BarSparkline values={costValues} color={color} width={w} height={h} animated />;
    case "debt":
      return <LineSparkline values={debtTimelineValues} color={color} width={w} height={h} animated />;
    case "wealth":
      return <LineSparkline values={wealthValues} color={color} width={w} height={h} animated />;
    default:
      return null;
  }
}

/* ── Live Market helpers ── */

function formatPrice(price) {
  if (price >= 1000) return "$" + Math.round(price).toLocaleString();
  if (price >= 1) return "$" + price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return "$" + price.toFixed(4);
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function useMarketData() {
  const [assets, setAssets] = useState([]);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () =>
      fetch(`./market-data.json?t=${Date.now()}`)
        .then((r) => r.ok ? r.json() : null)
        .then((data) => {
          if (data?.assets) {
            setAssets(data.assets);
            setUpdatedAt(data.updatedAt);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));

    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return { assets, updatedAt, loading };
}

/* ── Ticker Strip (compact, above cards) ── */

function TickerStrip({ assets, updatedAt, loading }) {
  if (loading || assets.length === 0) return null;

  return (
    <div className="ticker-strip">
      {assets.map((a, i) => {
        const val = a.change1d ?? null;
        const has = val != null && val !== 0;
        const up = (val ?? 0) >= 0;
        return (
          <span key={a.symbol} className="ticker-item">
            <span style={{ fontSize: 12, fontWeight: 700, color: "#F8FAFC" }}>{a.symbol}</span>
            <span style={{ fontSize: 12, color: "#CBD5E1" }}>{formatPrice(a.price)}</span>
            {has && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "1px 6px", borderRadius: 4,
                color: up ? "#34D399" : "#EF4444",
                background: up ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)",
              }}>
                {up ? "+" : ""}{val.toFixed(1)}%
              </span>
            )}
            {i < assets.length - 1 && <span className="ticker-sep" />}
          </span>
        );
      })}
      <span style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", flexShrink: 0 }}>
        <span className="live-dot" style={{ width: 6, height: 6 }} />
        <span style={{ fontSize: 10, color: "#64748B" }}>{updatedAt ? timeAgo(updatedAt) : ""}</span>
      </span>
    </div>
  );
}

/* ── Compact market row (used in 2-col grid on homepage) ── */
function MarketRow({ a }) {
  const val = a.change1d ?? null;
  const has = val != null && val !== 0;
  const up = (val ?? 0) >= 0;
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "7px 10px",
      borderRadius: 8,
      transition: "background 0.15s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#F8FAFC", width: 44, flexShrink: 0 }}>{a.symbol}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#CBD5E1", fontVariantNumeric: "tabular-nums" }}>
          {formatPrice(a.price)}
        </span>
      </div>
      {has ? (
        <span style={{
          fontSize: 11, fontWeight: 600,
          color: up ? "#34D399" : "#EF4444",
          background: up ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)",
          border: `1px solid ${up ? "rgba(52,211,153,0.2)" : "rgba(239,68,68,0.2)"}`,
          padding: "2px 7px", borderRadius: 5, fontVariantNumeric: "tabular-nums",
        }}>
          {up ? "+" : ""}{val.toFixed(1)}%
        </span>
      ) : (
        <span style={{ fontSize: 11, color: "#475569", padding: "2px 7px" }}>—</span>
      )}
    </div>
  );
}

/* ── Compact 2-col live market card (homepage) ── */
const PREVIEW_ROWS = 5; // per column → up to 10 tickers shown

function LiveMarketCompact({ assets, updatedAt, loading, onExpand }) {
  const preview = assets.slice(0, PREVIEW_ROWS * 2);
  const col1 = preview.slice(0, PREVIEW_ROWS);
  const col2 = preview.slice(PREVIEW_ROWS, PREVIEW_ROWS * 2);
  const remaining = assets.length - preview.length;

  return (
    <div
      className="glass-card"
      onClick={onExpand}
      style={{ cursor: "pointer", transition: "box-shadow 0.2s" }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(52,211,153,0.15)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span className="live-dot" />
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#F8FAFC", margin: 0 }}>Live Markets</h3>
        <span style={{ fontSize: 10, color: "#64748B", marginLeft: "auto" }}>
          {updatedAt ? timeAgo(updatedAt) : ""}
        </span>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 24, marginBottom: 6, opacity: 1 - (i % 5) * 0.15 }} />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <p style={{ fontSize: 13, color: "#64748B" }}>Market data unavailable</p>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <div>{col1.map(a => <MarketRow key={a.symbol} a={a} />)}</div>
            <div>{col2.map(a => <MarketRow key={a.symbol} a={a} />)}</div>
          </div>
          {remaining > 0 && (
            <p style={{ fontSize: 12, color: "#64748B", textAlign: "center", marginTop: 8, marginBottom: 0 }}>
              +{remaining} more — click to view all
            </p>
          )}
        </>
      )}
    </div>
  );
}

/* ── Card data ── */

const cards = [
  {
    id: "reaction",
    title: "Post-Conflict Reaction",
    desc: "How far markets fell and how long recovery took",
    color: "#6366F1",
    stat: "46.1%",
    statLabel: "Worst (2008 Crisis)",
    statColor: "#EF4444",
    stat2: "5.0%",
    statLabel2: "Mildest (Vietnam '64)",
    stat2Color: "#34D399",
    tag: "S&P 500 + NASDAQ",
  },
  {
    id: "buildup",
    title: "Pre-War Buildup",
    desc: "Market moves from first escalation to eve of conflict",
    color: "#10B981",
    stat: "-15.2%",
    statLabel: "Worst (Black Monday)",
    statColor: "#EF4444",
    stat2: "+11.0%",
    statLabel2: "Best (Korea '50)",
    stat2Color: "#34D399",
    tag: "Buildup windows",
  },
  {
    id: "global",
    title: "Global Markets",
    desc: "International index reactions to U.S. wars",
    color: "#F59E0B",
    stat: "73%",
    statLabel: "Worst (FTSE '73)",
    statColor: "#EF4444",
    stat2: "5.0%",
    statLabel2: "Mildest (FTSE '03)",
    stat2Color: "#34D399",
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
    id: "debt",
    title: "National Debt",
    desc: "Total US federal debt from WWII to today",
    color: "#06B6D4",
    stat: "$36.2T",
    statLabel: "Total federal debt (2025)",
    tag: "FRED GFDEBTN",
  },
  {
    id: "wealth",
    title: "Wealth Distribution",
    desc: "How the top 0.1% share shifted with each conflict era",
    color: "#F472B6",
    stat: "25%",
    statLabel: "Top 0.1% peak (1929)",
    stat2: "38%",
    statLabel2: "Top 1% share (2024)",
    tag: "Saez-Zucman / WID",
  },
  {
    id: "events",
    title: "Event Explainer",
    desc: "Why each event is included and what it reveals about markets",
    color: "#FB923C",
    stat: "84",
    statLabel: "Years of data (1941–2025)",
    stat2: "12",
    statLabel2: "Events tracked",
    tag: "Context & analysis",
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

export { formatPrice, timeAgo, useMarketData };

export default function HomePage({ onSelect }) {
  const { filterData, activeConflicts } = useEventToggle();
  const { assets, updatedAt, loading } = useMarketData();
  const isTablet = useIsTablet();

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", overflow: "hidden" }}>
      {/* Ambient glow orbs */}
      <GlowOrb color="#6366F1" size={400} top="-10%" left="-10%" delay={0} />
      <GlowOrb color="#8B5CF6" size={350} top="30%" left="40%" delay={3} />
      <GlowOrb color="#10B981" size={400} top="60%" left="70%" delay={6} />

      {/* Ticker strip — compact market glance */}
      <TickerStrip assets={assets} updatedAt={updatedAt} loading={loading} />

      {/* Intro paragraph */}
      <p className="landing-intro" style={{
        fontSize: 14,
        color: "#94A3B8",
        lineHeight: 1.75,
        maxWidth: 720,
        margin: "0 auto 28px",
        textAlign: "center",
      }}>
        The recovery of markets after a shock are not a measure of societal resilience, but rather
        a byproduct of how modern crises are financed. Because governments have shifted from funding
        emergencies through taxation and shared sacrifice to relying on debt and central bank
        intervention, a market "recovery" now functions as a massive wealth transfer mechanism.
        Wall Street always bounces back, but the method of that bounce-back inflates the assets of
        the top 1% while quietly eroding the purchasing power and economic standing of everyone else.
        In 1978, the top 0.1% held 7% of American wealth, the most equal the country has ever been.
        By 2024, they're back to 20%, approaching 1929 levels.
      </p>

      <div className="bento-grid">
        {/* Content cards */}
        {cards.map((c, i) => (
          <button
            key={c.id}
            className={`glass-card card-enter card-enter-${i + 1}`}
            style={{
              "--card-glow": `linear-gradient(135deg, ${c.color}4D, transparent 60%)`,
              boxShadow: "none",
            }}
            onClick={() => onSelect(c.id === "debt" ? "fiscal" : c.id)}
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
                <CardSparkline id={c.id} color={c.color} filterData={filterData} activeConflicts={activeConflicts} isTablet={isTablet} />
              </div>
            )}

            {/* Stat + tag row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 4 }}>
              {c.stat ? (
                <div style={{ display: "flex", gap: 14, alignItems: "flex-end" }}>
                  <div>
                    <AnimatedStat value={c.stat} color={c.statColor || c.color} />
                    <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>
                      {c.statLabel}
                    </div>
                  </div>
                  {c.stat2 && (
                    <div>
                      <AnimatedStat value={c.stat2} color={c.stat2Color || c.color} />
                      <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>
                        {c.statLabel2}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div />
              )}
              {!c.stat2 && <span style={badge(c.color)}>{c.tag}</span>}
            </div>
          </button>
        ))}
      </div>

      {/* Compact live market preview — click to expand */}
      <hr className="glow-divider" style={{ marginTop: 32, marginBottom: 28 }} />
      <LiveMarketCompact assets={assets} updatedAt={updatedAt} loading={loading} onExpand={() => onSelect("markets")} />
    </div>
  );
}
