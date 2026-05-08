import { useState, useEffect, useRef } from "react";
import { colors, companyColor, gradients } from "../theme/tokens";
import { formatCurrency, formatPercent } from "../utils/formatters";
import {
  getCapex,
  getLatestOpex,
  getLatestTechSpend,
  getStackedSparkline,
} from "../utils/dataShape";

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

/* ── Stacked bar sparkline (capex bottom, opex top) ── */
function StackedBarSparkline({ rows, capexColor, opexColor, globalMax, width = 130, height = 36 }) {
  const max = globalMax ?? Math.max(...rows.map((r) => r.capex + r.opex), 1);
  if (!max || max === 0) return null;
  const barW = (width - (rows.length - 1) * 2) / rows.length;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {rows.map((r, i) => {
        const totalH = ((r.capex + r.opex) / max) * height;
        const capexH = (r.capex / max) * height;
        const opexH = (r.opex / max) * height;
        const x = i * (barW + 2);
        const yCapex = height - capexH;
        const yOpex = height - totalH;
        const minSeg = 1;
        return (
          <g key={r.year}>
            {opexH > 0 && (
              <rect
                className="sparkline-bar"
                style={{ animationDelay: `${i * 60}ms` }}
                x={x}
                y={yOpex}
                width={barW}
                height={Math.max(opexH, minSeg)}
                rx={1.5}
                fill={opexColor}
                opacity={0.55}
              />
            )}
            {capexH > 0 && (
              <rect
                className="sparkline-bar"
                style={{ animationDelay: `${i * 60}ms` }}
                x={x}
                y={yCapex}
                width={barW}
                height={Math.max(capexH, minSeg)}
                rx={1.5}
                fill={capexColor}
              />
            )}
          </g>
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

  // Stacked-sparkline values per company (last 5 years).
  const sparklineRows = companies.map((c) => getStackedSparkline(c, 5));

  // Global max for cross-card comparable sparklines (use total capex+opex).
  const globalSparklineMax = Math.max(
    ...sparklineRows.flatMap((rows) => rows.map((r) => r.capex + r.opex)),
    1
  );

  // Headline data
  const totalTech = summary.totalLatestAnnualTechSpendBillions
    ?? ((summary.totalLatestAnnualCapexBillions || 0) + (summary.totalLatestAnnualOpexBillions || 0));
  const totalCapex = summary.totalLatestAnnualCapexBillions || 0;
  const totalOpex = summary.totalLatestAnnualOpexBillions
    ?? ((summary.totalLatestAnnualRdBillions || 0) + (summary.totalLatestAnnualSgaBillions || 0));

  const topTicker = summary.topTechSpender || summary.topCapexSpender;
  const topCompany = companies.find((c) => c.ticker === topTicker);
  const topColor = companyColor(topTicker, colors.text);
  const topTech = topCompany ? getLatestTechSpend(topCompany) : { value: null };

  const fastestTicker = summary.fastestCapexGrower || summary.fastestGrower;
  const fastestCompany = companies.find((c) => c.ticker === fastestTicker);
  const fastestColor = companyColor(fastestTicker, colors.success);
  const fastestPct = getCapex(fastestCompany)?.latestAnnual?.yoyGrowthPct;

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <GlowOrb color={colors.indigo} size={400} top="-10%" left="-10%" delay={0} />
      <GlowOrb color="#FF9900" size={350} top="30%" left="60%" delay={3} />
      <GlowOrb color={colors.companies.NVDA} size={400} top="70%" left="20%" delay={6} />

      {/* Headline strip */}
      <div className="headline-strip">
        {/* Total Tech Spend */}
        <div
          className="headline-card card-enter card-enter-0"
          style={{ background: `${gradients.headlineTotal}, rgba(15, 23, 42, 0.6)` }}
        >
          <div className="headline-eyebrow">
            <span className="headline-icon"><IconSigma color={colors.indigoSoft} /></span>
            Total Tech Spend
          </div>
          <AnimatedStat
            value={totalTech}
            prefix="$"
            suffix="B"
            color={colors.text}
            fontSize={52}
            fontWeight={800}
          />
          <div className="headline-sub num">
            {formatCurrency(totalCapex, { unit: "B", digits: 0 })} CapEx + {formatCurrency(totalOpex, { unit: "B", digits: 0 })} OpEx
          </div>
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
              color: topColor,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginTop: 4,
            }}
          >
            {topTicker || "—"}
          </span>
          <div className="headline-sub num">
            {formatCurrency(topTech.value, { unit: "B" })} tech spend in latest year
          </div>
        </div>

        {/* Highest Growth (CapEx YoY) */}
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
              color: fastestColor,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginTop: 4,
            }}
          >
            {fastestTicker || "—"}
          </span>
          <div className="headline-sub num">
            {formatPercent(fastestPct, { digits: 0 })} CapEx YoY
          </div>
        </div>
      </div>

      {/* Per-company cards */}
      <div className="bento-grid">
        {companies.map((company, i) => {
          const capex = getCapex(company);
          const la = capex?.latestAnnual;
          const growth = la?.yoyGrowthPct;
          const isPositive = growth != null && growth >= 0;
          const color = companyColor(company.ticker);
          const opexColor = colors.indigoSoft;
          const opex = getLatestOpex(company);
          const sparkRows = sparklineRows[i];

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

              {/* CapEx row */}
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: colors.textFaint, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    CapEx
                  </span>
                  <AnimatedStat
                    value={la?.valueBillions || 0}
                    prefix="$"
                    suffix="B"
                    color={color}
                    fontSize={22}
                    fontWeight={700}
                  />
                </div>
                {growth != null && (
                  <span
                    className="num"
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: isPositive ? colors.success : colors.danger,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {formatPercent(growth, { digits: 0 })}
                  </span>
                )}
              </div>

              {/* OpEx row */}
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: colors.textFaint, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    OpEx
                  </span>
                  <AnimatedStat
                    value={opex.value || 0}
                    prefix="$"
                    suffix="B"
                    color={opexColor}
                    fontSize={22}
                    fontWeight={700}
                  />
                </div>
                {opex.partial && (
                  <span
                    className="num"
                    title="Missing R&D or SG&A — partial total"
                    style={{ fontSize: 11, color: colors.warning, fontWeight: 600 }}
                  >
                    partial
                  </span>
                )}
              </div>

              {/* CY label below */}
              <div className="num" style={{ fontSize: 10, color: colors.textFaint }}>
                CY{la?.calendarYear || "—"} &middot; CapEx YoY
              </div>

              {/* Stacked sparkline (capex bottom, opex top) */}
              {sparkRows.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <StackedBarSparkline
                    rows={sparkRows}
                    capexColor={color}
                    opexColor={opexColor}
                    globalMax={globalSparklineMax}
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 1, background: color }} />
                      <span style={{ fontSize: 9, color: colors.textFaint }}>CapEx</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 1, background: opexColor, opacity: 0.55 }} />
                      <span style={{ fontSize: 9, color: colors.textFaint }}>OpEx</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
