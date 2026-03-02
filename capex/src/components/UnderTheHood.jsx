import { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import {
  usefulLifeByYear,
  depreciationSavings,
  freeCashFlow,
  capexVsCashFlow,
  revenueGap,
  commentaryThemes,
} from "../data/accountingData";

const COMPANY_COLORS = {
  MSFT: "#00A4EF",
  GOOGL: "#4285F4",
  AMZN: "#FF9900",
  META: "#0668E1",
  ORCL: "#F80000",
};

/* ── Shared tooltip style ── */
const tooltipStyle = {
  background: "rgba(15, 23, 42, 0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "12px 16px",
  backdropFilter: "blur(12px)",
};

/* ── Section wrapper ── */
function Section({ title, subtitle, children, delay = 0, glow = "#6366F14D" }) {
  return (
    <div className={`card-enter card-enter-${delay}`} style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: "#F8FAFC", marginBottom: 4 }}>{title}</h3>
      {subtitle && <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 16 }}>{subtitle}</p>}
      <div className="glass-card" style={{ padding: 20, "--card-glow": `linear-gradient(135deg, ${glow}, transparent 60%)` }}>
        {children}
      </div>
    </div>
  );
}

/* ── 1. Depreciation useful-life step chart ── */
function DepreciationChart() {
  const chartData = useMemo(() => {
    const years = [2020, 2021, 2022, 2023, 2024, 2025];
    return years.map((year) => {
      const row = { year };
      Object.entries(usefulLifeByYear).forEach(([ticker, entries]) => {
        const entry = entries.find((e) => e.year === year);
        if (entry) row[ticker] = entry.life;
      });
      return row;
    });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="year"
          tick={{ fill: "#94A3B8", fontSize: 12 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#94A3B8", fontSize: 12 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
          domain={[2, 7]}
          tickFormatter={(v) => `${v}yr`}
          label={{ value: "Useful Life", angle: -90, position: "insideLeft", fill: "#64748B", fontSize: 11, dx: -5 }}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={{ color: "#F8FAFC", fontWeight: 600, marginBottom: 4 }}
          itemStyle={{ fontSize: 12, padding: 0 }}
          formatter={(v, name) => [`${v} years`, name]}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} iconType="plainline" iconSize={16} />
        {Object.keys(COMPANY_COLORS).map((ticker) => (
          <Line
            key={ticker}
            type="stepAfter"
            dataKey={ticker}
            stroke={COMPANY_COLORS[ticker]}
            strokeWidth={2.5}
            dot={{ r: 4, fill: COMPANY_COLORS[ticker], stroke: "#0F172A", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ── 2. Earnings boost bar chart ── */
function EarningsBoostChart() {
  const chartData = useMemo(() => {
    return depreciationSavings.map((d) => ({
      label: `${d.ticker} '${String(d.year).slice(2)}`,
      ticker: d.ticker,
      savings: d.savingsBillions,
      note: d.note,
    }));
  }, []);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: "#94A3B8", fontSize: 12 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
          tickFormatter={(v) => `$${v}B`}
        />
        <YAxis
          type="category"
          dataKey="label"
          tick={{ fill: "#F8FAFC", fontSize: 12, fontWeight: 600 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
          width={80}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={{ color: "#F8FAFC", fontWeight: 600 }}
          formatter={(v, _, props) => [`$${v}B saved — ${props.payload.note}`, "Depreciation reduction"]}
        />
        <Bar dataKey="savings" radius={[0, 6, 6, 0]} maxBarSize={28}>
          {chartData.map((entry) => (
            <Cell key={entry.label} fill={COMPANY_COLORS[entry.ticker] || "#818CF8"} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ── 3. Capex as % of operating cash flow ── */
function CapexCashFlowChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={capexVsCashFlow} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="capexGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#EF4444" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="year"
          tick={{ fill: "#94A3B8", fontSize: 12 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#94A3B8", fontSize: 12 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
          domain={[0, 120]}
        />
        <ReferenceLine y={100} stroke="#EF4444" strokeDasharray="6 3" strokeOpacity={0.6} label={{ value: "100% — all cash consumed", fill: "#EF4444", fontSize: 11, position: "insideTopRight" }} />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={{ color: "#F8FAFC", fontWeight: 600 }}
          formatter={(v, _, props) => {
            const extra = props.payload.note ? ` (${props.payload.note})` : "";
            return [`${v}%${extra}`, "Capex / Operating Cash Flow"];
          }}
        />
        <Area
          type="monotone"
          dataKey="capexPctOCF"
          stroke="#EF4444"
          strokeWidth={2.5}
          fill="url(#capexGrad)"
          dot={{ r: 4, fill: "#EF4444", stroke: "#0F172A", strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ── 4. Free cash flow collapse ── */
function FCFChart() {
  const chartData = useMemo(() => {
    return freeCashFlow
      .sort((a, b) => b.fcf2025 - a.fcf2025)
      .map((d) => ({
        ticker: d.ticker,
        "2024": d.fcf2024,
        "2025": d.fcf2025,
        "2026E": d.fcf2026,
      }));
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="ticker"
          tick={{ fill: "#F8FAFC", fontSize: 13, fontWeight: 600 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#94A3B8", fontSize: 12 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
          tickFormatter={(v) => `$${v}B`}
        />
        <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={{ color: "#F8FAFC", fontWeight: 600 }}
          formatter={(v, name) => [`$${v}B`, `FCF ${name}`]}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} iconType="square" iconSize={8} />
        <Bar dataKey="2024" fill="#34D399" fillOpacity={0.7} radius={[2, 2, 0, 0]} maxBarSize={32} />
        <Bar dataKey="2025" fill="#818CF8" fillOpacity={0.7} radius={[2, 2, 0, 0]} maxBarSize={32} />
        <Bar dataKey="2026E" radius={[2, 2, 0, 0]} maxBarSize={32}>
          {chartData.map((entry) => (
            <Cell
              key={entry.ticker}
              fill={entry["2026E"] < 0 ? "#EF4444" : "#F59E0B"}
              fillOpacity={0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ── 5. Revenue gap (Sequoia) ── */
function RevenueGapChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={revenueGap} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gapGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#EF4444" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="year"
          tick={{ fill: "#94A3B8", fontSize: 12 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#94A3B8", fontSize: 12 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
          tickFormatter={(v) => `$${v}B`}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={{ color: "#F8FAFC", fontWeight: 600 }}
          formatter={(v, name) => {
            const labels = { aiInfraSpend: "AI Infra Spend", aiRevenue: "AI Revenue", gap: "Revenue Gap" };
            return [`$${v}B`, labels[name] || name];
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 11 }}
          iconType="square"
          iconSize={8}
          formatter={(value) => {
            const labels = { aiInfraSpend: "AI Infra Spend", aiRevenue: "AI Revenue", gap: "Revenue Gap" };
            return labels[value] || value;
          }}
        />
        <Bar dataKey="aiRevenue" stackId="a" fill="#34D399" fillOpacity={0.7} radius={[0, 0, 0, 0]} maxBarSize={48} />
        <Bar dataKey="gap" stackId="a" fill="url(#gapGrad)" radius={[4, 4, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ── Quote card ── */
function QuoteCard({ entry, color, delay }) {
  return (
    <div
      className={`glass-card card-enter card-enter-${delay}`}
      style={{
        "--card-glow": `linear-gradient(135deg, ${color}4D, transparent 60%)`,
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
        <div style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC" }}>{entry.author}</span>
        <span style={{ fontSize: 11, color: "#64748B" }}>{entry.role}</span>
      </div>
      <p style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
        &ldquo;{entry.quote}&rdquo;
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4, flexWrap: "wrap", gap: 8 }}>
        <span style={{
          fontSize: 11, fontWeight: 600, color, background: `${color}1A`,
          padding: "3px 10px", borderRadius: 5,
        }}>
          {entry.metric}
        </span>
        <a
          href={entry.source}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ fontSize: 10, color: "#64748B", textDecoration: "underline" }}
        >
          Source
        </a>
      </div>
    </div>
  );
}

/* ── Themed commentary section ── */
function CommentarySection({ theme, color, entries, baseDelay }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div className={`card-enter card-enter-${baseDelay}`} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 12, height: 12, borderRadius: 3, background: color, flexShrink: 0 }} />
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", margin: 0 }}>{theme}</h3>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {entries.map((entry, i) => (
          <QuoteCard
            key={`${entry.author}-${i}`}
            entry={entry}
            color={color}
            delay={Math.min(baseDelay + i + 1, 10)}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function UnderTheHood() {
  return (
    <div>
      <h2
        className="card-enter card-enter-0"
        style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC", marginBottom: 4 }}
      >
        Under the Hood
      </h2>
      <p className="card-enter card-enter-0" style={{ fontSize: 13, color: "#94A3B8", marginBottom: 28, maxWidth: 700 }}>
        How accounting choices, depreciation extensions, and cash flow dynamics
        paint a different picture of the AI capex boom than the headline numbers suggest.
      </p>

      {/* 1. Depreciation useful life */}
      <Section
        title="The Depreciation Creep"
        subtitle="Server useful life extended from 3 to 6 years in just 4 years — every extra year reduces annual depreciation expense and inflates reported earnings. Amazon is the only company to reverse course."
        delay={1}
        glow="#F59E0B4D"
      >
        <DepreciationChart />
      </Section>

      {/* 2. Earnings boost */}
      <Section
        title="Earnings Boost from Depreciation Changes"
        subtitle="Billions in depreciation savings flowed straight to the bottom line. Michael Burry estimates $176B of understated depreciation across the industry between 2026–2028."
        delay={2}
        glow="#EF44444D"
      >
        <EarningsBoostChart />
      </Section>

      {/* 3. Capex vs cash flow */}
      <Section
        title="Capex Eating Cash Flow"
        subtitle="Capital expenditure as a percentage of operating cash flow across the big 5 hyperscalers. At 94% in 2025 and projected to exceed 100% in 2026, leaving no cash for buybacks, dividends, or debt reduction without external financing."
        delay={3}
        glow="#EF44444D"
      >
        <CapexCashFlowChart />
      </Section>

      {/* 4. FCF collapse */}
      <Section
        title="Free Cash Flow Collapse"
        subtitle="FCF is evaporating as capex accelerates. Amazon is projected to go negative in 2026. Alphabet's FCF drops ~90% year-over-year."
        delay={4}
        glow="#FF99004D"
      >
        <FCFChart />
        <div style={{ marginTop: 12, fontSize: 11, color: "#64748B" }}>
          2026E estimates from Morgan Stanley (AMZN), Pivotal Research (GOOGL), Barclays (MSFT), analyst consensus (META, ORCL).
        </div>
      </Section>

      {/* 5. Revenue gap */}
      <Section
        title="Sequoia's $600B Question"
        subtitle="AI infrastructure spending vs actual AI revenue generated. The gap between what's being spent and what's being earned keeps widening — from $35B in 2023 to a projected $510B in 2026."
        delay={5}
        glow="#F59E0B4D"
      >
        <RevenueGapChart />
      </Section>

      {/* Divider before commentary */}
      <div className="glow-divider" style={{ margin: "40px auto 36px", width: "60%" }} />

      {/* 6. Themed commentary sections */}
      <h2
        className="card-enter card-enter-6"
        style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC", marginBottom: 4 }}
      >
        What the Critics Are Saying
      </h2>
      <p className="card-enter card-enter-6" style={{ fontSize: 13, color: "#94A3B8", marginBottom: 28, maxWidth: 700 }}>
        Hedge fund managers, forensic accountants, independent researchers, and academics
        questioning the numbers behind the AI infrastructure boom — all with sourced links.
      </p>

      {commentaryThemes.map((group, gi) => (
        <CommentarySection
          key={group.theme}
          theme={group.theme}
          color={group.color}
          entries={group.entries}
          baseDelay={Math.min(7 + gi, 10)}
        />
      ))}
    </div>
  );
}
