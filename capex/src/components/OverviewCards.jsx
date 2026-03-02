import { useState, useEffect, useRef } from "react";

const COMPANY_COLORS = {
  MSFT: "#00A4EF",
  GOOGL: "#4285F4",
  AMZN: "#FF9900",
  META: "#0668E1",
  AAPL: "#A2AAAD",
  NVDA: "#76B900",
  ORCL: "#F80000",
  TSLA: "#CC0000",
};

/* ── Animated counter ── */
function AnimatedStat({ value, prefix = "", suffix = "", color, decimals = 1 }) {
  const [display, setDisplay] = useState("0");
  const rafRef = useRef(null);

  useEffect(() => {
    const target = parseFloat(value);
    if (isNaN(target)) { setDisplay(value); return; }

    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = eased * target;
      setDisplay(current.toFixed(decimals));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, decimals]);

  return (
    <span style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
      {prefix}{display}{suffix}
    </span>
  );
}

/* ── Bar sparkline for company cards ── */
function BarSparkline({ values, color, width = 120, height = 32 }) {
  const max = Math.max(...values.map(Math.abs));
  if (max === 0) return null;
  const barW = (width - (values.length - 1) * 2) / values.length;
  return (
    <svg width={width} height={height} style={{ opacity: 0.7, display: "block" }}>
      {values.map((v, i) => {
        const barH = Math.max((Math.abs(v) / max) * height, 1);
        return (
          <rect
            key={i}
            className="sparkline-bar"
            style={{ animationDelay: `${i * 60}ms` }}
            x={i * (barW + 2)}
            y={height - barH}
            width={barW}
            height={barH}
            rx={2}
            fill={color}
          />
        );
      })}
    </svg>
  );
}

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

export default function OverviewCards({ data }) {
  const { companies, summary } = data;

  // Get last 5 annual values for sparklines
  const getSparklineValues = (company) => {
    const annual = company.annual || [];
    return annual.slice(-5).map((a) => a.valueBillions);
  };

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <GlowOrb color="#6366F1" size={400} top="-10%" left="-10%" delay={0} />
      <GlowOrb color="#FF9900" size={350} top="30%" left="60%" delay={3} />
      <GlowOrb color="#76B900" size={400} top="70%" left="20%" delay={6} />

      {/* Summary cards */}
      <div className="bento-grid" style={{ marginBottom: 24 }}>
        {/* Total Annual Capex */}
        <div
          className="glass-card card-enter card-enter-0"
          style={{ "--card-glow": "linear-gradient(135deg, #6366F14D, transparent 60%)" }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Total Annual Capex
          </div>
          <AnimatedStat
            value={summary.totalLatestAnnualCapexBillions}
            prefix="$"
            suffix="B"
            color="#A5B4FC"
          />
          <div style={{ fontSize: 12, color: "#94A3B8" }}>Combined across 8 companies</div>
        </div>

        {/* Top Spender */}
        <div
          className="glass-card card-enter card-enter-1"
          style={{ "--card-glow": "linear-gradient(135deg, #FF99004D, transparent 60%)" }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Top Spender
          </div>
          <span style={{ fontSize: 22, fontWeight: 700, color: COMPANY_COLORS[summary.topSpender] || "#F8FAFC" }}>
            {summary.topSpender}
          </span>
          <div style={{ fontSize: 12, color: "#94A3B8" }}>
            ${companies.find((c) => c.ticker === summary.topSpender)?.latestAnnual?.valueBillions?.toFixed(1) || "—"}B in latest year
          </div>
        </div>

        {/* Fastest Grower */}
        <div
          className="glass-card card-enter card-enter-2"
          style={{ "--card-glow": "linear-gradient(135deg, #34D3994D, transparent 60%)" }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Fastest Grower
          </div>
          <span style={{ fontSize: 22, fontWeight: 700, color: "#34D399" }}>
            {summary.fastestGrower}
          </span>
          <div style={{ fontSize: 12, color: "#94A3B8" }}>
            +{companies.find((c) => c.ticker === summary.fastestGrower)?.latestAnnual?.yoyGrowthPct?.toFixed(0) || "—"}% YoY growth
          </div>
        </div>
      </div>

      {/* Company cards */}
      <div className="bento-grid">
        {companies.map((company, i) => {
          const la = company.latestAnnual;
          const growth = la?.yoyGrowthPct;
          const isPositive = growth != null && growth >= 0;
          const color = COMPANY_COLORS[company.ticker] || "#818CF8";
          const sparkValues = getSparklineValues(company);

          return (
            <div
              key={company.ticker}
              className={`glass-card card-enter card-enter-${i + 3}`}
              style={{ "--card-glow": `linear-gradient(135deg, ${color}4D, transparent 60%)` }}
            >
              {/* Ticker + name */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: color, flexShrink: 0 }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC", margin: 0 }}>
                  {company.ticker}
                </h3>
                <span style={{ fontSize: 12, color: "#64748B" }}>{company.name}</span>
              </div>

              {/* Latest annual capex */}
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div>
                  <AnimatedStat
                    value={la?.valueBillions || 0}
                    prefix="$"
                    suffix="B"
                    color={color}
                  />
                  <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>
                    CY{la?.calendarYear || "—"}
                  </div>
                </div>

                {/* YoY growth badge */}
                {growth != null && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: 6,
                      color: isPositive ? "#34D399" : "#EF4444",
                      background: isPositive ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)",
                      border: `1px solid ${isPositive ? "rgba(52,211,153,0.2)" : "rgba(239,68,68,0.2)"}`,
                    }}
                  >
                    {isPositive ? "+" : ""}
                    {growth.toFixed(1)}%
                  </span>
                )}
              </div>

              {/* Sparkline */}
              {sparkValues.length > 0 && (
                <BarSparkline values={sparkValues} color={color} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
