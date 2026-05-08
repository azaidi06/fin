import { useState, useEffect, useRef } from "react";
import { colors, companyColor, gradients } from "../theme/tokens";
import { formatCurrency, formatPercent } from "../utils/formatters";

/* ── Animated counter ── */
function AnimatedStat({ value, prefix = "", suffix = "", color, decimals = 1, fontSize = 22, fontWeight = 700 }) {
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
    <span
      className="num"
      style={{ fontSize, fontWeight, color, lineHeight: 1, letterSpacing: "-0.02em" }}
    >
      {prefix}{display}{suffix}
    </span>
  );
}

/* ── Bar sparkline for company cards ── */
function BarSparkline({ values, color, globalMax, width = 120, height = 32 }) {
  const max = globalMax ?? Math.max(...values.map(Math.abs));
  if (!max || max === 0) return null;
  const barW = (width - (values.length - 1) * 2) / values.length;
  return (
    <svg width={width} height={height} style={{ opacity: 0.85, display: "block" }}>
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

/* ── Inline icons ── */
function IconSigma({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h14v3l-7 5 7 5v3H5l7-8L5 4z" />
    </svg>
  );
}
function IconCrown({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7l4 5 5-7 5 7 4-5v11H3V7z" />
    </svg>
  );
}
function IconTrendUp({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="14 7 21 7 21 14" />
    </svg>
  );
}

export default function OverviewCards({ data }) {
  const { companies, summary } = data;

  // Get last 5 annual values for sparklines
  const getSparklineValues = (company) => {
    const annual = company.annual || [];
    return annual.slice(-5).map((a) => a.valueBillions);
  };

  // Phase 2C: global sparkline max so cross-card comparisons are valid
  const globalSparklineMax = Math.max(
    ...companies.flatMap((c) => getSparklineValues(c).map(Math.abs)),
    1
  );

  const topSpenderCompany = companies.find((c) => c.ticker === summary.topSpender);
  const topSpenderColor = companyColor(summary.topSpender, colors.text);
  const fastestGrowerCompany = companies.find((c) => c.ticker === summary.fastestGrower);
  const fastestGrowerColor = companyColor(summary.fastestGrower, colors.success);
  const fastestGrowerPct = fastestGrowerCompany?.latestAnnual?.yoyGrowthPct;

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <GlowOrb color={colors.indigo} size={400} top="-10%" left="-10%" delay={0} />
      <GlowOrb color="#FF9900" size={350} top="30%" left="60%" delay={3} />
      <GlowOrb color={colors.companies.NVDA} size={400} top="70%" left="20%" delay={6} />

      {/* Phase 2A: Headline strip — visually distinct from per-company cards */}
      <div className="headline-strip">
        {/* Total Capex */}
        <div
          className="headline-card card-enter card-enter-0"
          style={{ background: `${gradients.headlineTotal}, rgba(15, 23, 42, 0.6)` }}
        >
          <div className="headline-eyebrow">
            <span className="headline-icon"><IconSigma color={colors.indigoSoft} /></span>
            Total Annual Capex
          </div>
          <AnimatedStat
            value={summary.totalLatestAnnualCapexBillions}
            prefix="$"
            suffix="B"
            color={colors.text}
            fontSize={52}
            fontWeight={800}
          />
          <div className="headline-sub">Combined across {companies.length} companies</div>
        </div>

        {/* Top Spender */}
        <div
          className="headline-card card-enter card-enter-1"
          style={{ background: `${gradients.headlineTop}, rgba(15, 23, 42, 0.6)` }}
        >
          <div className="headline-eyebrow">
            <span className="headline-icon"><IconCrown color="#FBBF24" /></span>
            Top Spender
          </div>
          <span
            className="num"
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: topSpenderColor,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginTop: 4,
            }}
          >
            {summary.topSpender}
          </span>
          <div className="headline-sub num">
            {formatCurrency(topSpenderCompany?.latestAnnual?.valueBillions, { unit: "B" })} in latest year
          </div>
        </div>

        {/* Fastest Grower */}
        <div
          className="headline-card card-enter card-enter-2"
          style={{ background: `${gradients.headlineGrowth}, rgba(15, 23, 42, 0.6)` }}
        >
          <div className="headline-eyebrow">
            <span className="headline-icon"><IconTrendUp color={colors.success} /></span>
            Highest Growth
          </div>
          <span
            className="num"
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: fastestGrowerColor,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginTop: 4,
            }}
          >
            {summary.fastestGrower}
          </span>
          <div className="headline-sub num">
            {formatPercent(fastestGrowerPct, { digits: 0 })} YoY growth
          </div>
        </div>
      </div>

      {/* Per-company cards */}
      <div className="bento-grid">
        {companies.map((company, i) => {
          const la = company.latestAnnual;
          const growth = la?.yoyGrowthPct;
          const isPositive = growth != null && growth >= 0;
          const color = companyColor(company.ticker);
          const sparkValues = getSparklineValues(company);

          return (
            <div
              key={company.ticker}
              className={`glass-card card-enter card-enter-${Math.min(i + 3, 10)}`}
              style={{ "--card-glow": `linear-gradient(135deg, ${color}4D, transparent 60%)` }}
            >
              {/* Ticker + name */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: color, flexShrink: 0 }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: colors.text, margin: 0 }}>
                  {company.ticker}
                </h3>
                <span style={{ fontSize: 12, color: colors.textFaint }}>{company.name}</span>
              </div>

              {/* Phase 2B: dollar value + YoY pill side-by-side, same line */}
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                <AnimatedStat
                  value={la?.valueBillions || 0}
                  prefix="$"
                  suffix="B"
                  color={color}
                  fontSize={26}
                  fontWeight={700}
                />
                {growth != null && (
                  <span
                    className="num"
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: isPositive ? colors.success : colors.danger,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {formatPercent(growth, { digits: 1 })}
                  </span>
                )}
              </div>

              {/* CY label below */}
              <div className="num" style={{ fontSize: 10, color: colors.textFaint, marginTop: -4 }}>
                CY{la?.calendarYear || "—"} &middot; YoY
              </div>

              {/* Sparkline (normalized to global max) */}
              {sparkValues.length > 0 && (
                <BarSparkline values={sparkValues} color={color} globalMax={globalSparklineMax} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
