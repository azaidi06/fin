import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import {
  fiscalConflictColors, cpiChartData, debtGdpChartData, fiscalSummary,
} from "../data/warData";

const card = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };
const innerCard = { background: "#0F172A", border: "1px solid #334155", borderRadius: 10, padding: 20, marginBottom: 24 };

const conflicts = ["WWII", "Korea", "Vietnam", "Gulf War", "9/11", "Iraq"];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#334155", border: "1px solid #475569", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#F8FAFC", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", maxWidth: 260 }}>
      <p style={{ fontWeight: 600, marginBottom: 6 }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color, margin: "2px 0" }}>
          {p.dataKey}: <strong>{p.value}%</strong>
        </p>
      ))}
    </div>
  );
}

function FiscalChart({ title, subtitle, data, yLabel, yDomain, yTickFormatter }) {
  return (
    <div style={innerCard}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: "#E2E8F0", marginBottom: 4 }}>{title}</h3>
      <p style={{ fontSize: 11, color: "#64748B", marginBottom: 16 }}>{subtitle}</p>
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.25} />
          <XAxis
            dataKey="tLabel" stroke="#475569"
            tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false}
          />
          <YAxis
            stroke="#475569" tickFormatter={yTickFormatter || (v => `${v}%`)}
            tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false}
            domain={yDomain}
            label={{ value: yLabel, angle: -90, position: "insideLeft", offset: -2, style: { fill: "#64748B", fontSize: 11 } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "#CBD5E1", paddingTop: 8 }}
            iconType="plainline" iconSize={14}
          />
          <ReferenceLine
            x="T=0" stroke="#F8FAFC" strokeDasharray="6 4" strokeOpacity={0.5}
            label={{ value: "War Start", position: "top", fill: "#94A3B8", fontSize: 10 }}
          />
          {conflicts.map(c => (
            <Line
              key={c} type="monotone" dataKey={c}
              stroke={fiscalConflictColors[c]} strokeWidth={2}
              dot={{ r: 3, fill: fiscalConflictColors[c] }}
              activeDot={{ r: 5 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function FiscalCard({ d }) {
  const color = fiscalConflictColors[d.conflict];
  const debtPositive = d.debtGdpDelta > 0;
  return (
    <div style={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 10, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: color, flexShrink: 0 }} />
        <h3 style={{ fontWeight: 600, color: "#E2E8F0", fontSize: 14 }}>{d.conflict}</h3>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Peak CPI</p>
          <p style={{ fontSize: 20, fontWeight: 700, color: "#FBBF24" }}>{d.peakCpi}%</p>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Debt/GDP {"\u0394"}</p>
          <p style={{ fontSize: 20, fontWeight: 700, color: debtPositive ? "#EF4444" : "#10B981" }}>
            {debtPositive ? "+" : ""}{d.debtGdpDelta} pp
          </p>
        </div>
      </div>

      <p style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.5, borderTop: "1px solid #334155", paddingTop: 10 }}>
        {d.narrative}
      </p>
    </div>
  );
}

export default function FiscalImpactPanel() {
  return (
    <section style={card}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#F8FAFC", marginBottom: 4 }}>Fiscal Impact</h2>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>
        How inflation and federal debt responded in the years surrounding each conflict (T=0 is the war start year)
      </p>

      <FiscalChart
        title="CPI Inflation Trajectory"
        subtitle="Year-over-year CPI change (%) — T-2 through T+5 relative to conflict start"
        data={cpiChartData}
        yLabel="CPI YoY %"
        yDomain={["auto", "auto"]}
      />

      <FiscalChart
        title="Federal Debt / GDP Trajectory"
        subtitle="US federal debt as % of GDP — T-2 through T+5 relative to conflict start"
        data={debtGdpChartData}
        yLabel="Debt / GDP %"
        yDomain={["auto", "auto"]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {fiscalSummary.map(d => (
          <FiscalCard key={d.conflict} d={d} />
        ))}
      </div>

      <p style={{ fontSize: 11, color: "#64748B", textAlign: "center", marginTop: 16, fontStyle: "italic" }}>
        CPI data: BLS / FRED CPIAUCSL (post-1947), Minneapolis Fed historical tables (pre-1947). Debt/GDP: FRED GFDGDPA188S.
      </p>
    </section>
  );
}
