import { useState, useMemo } from "react";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, ReferenceArea, ReferenceDot,
} from "recharts";
import {
  fiscalConflictColors, cpiData, debtGdpData, fiscalSummary,
  totalDebtData, conflictMarkers, presidentialTerms,
  buildCpiChartData, buildDebtGdpChartData,
} from "../data/warData";
import { TooltipSourceLink } from "./SourceLink";
import SourceLink from "./SourceLink";
import { useEventToggle } from "../context/EventToggleContext";

const card = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };
const innerCard = { background: "#0F172A", border: "1px solid #334155", borderRadius: 10, padding: 20, marginBottom: 24 };

function DebtTimelineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const debt = payload[0].value;
  const formatted = debt >= 1000
    ? `$${(debt / 1000).toFixed(1)}T`
    : `$${debt.toFixed(0)}B`;
  const term = presidentialTerms.find(t => label >= t.start && label < t.end);
  const marker = conflictMarkers.find(m => m.year === label);
  return (
    <div style={{ background: "#334155", border: "1px solid #475569", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#F8FAFC", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
      <p style={{ color: "#06B6D4", fontWeight: 700 }}>{formatted}</p>
      {term && (
        <p style={{ color: term.party === "D" ? "#60A5FA" : "#F87171", fontSize: 11, marginTop: 4 }}>
          President: {term.president} ({term.party === "D" ? "Dem" : "Rep"})
        </p>
      )}
      {marker && (
        <p style={{ color: "#FBBF24", fontSize: 11, marginTop: 2 }}>
          Event: {marker.label}
        </p>
      )}
      <TooltipSourceLink sourceKey="totalDebt" />
    </div>
  );
}

function DebtTimelineChart({ filteredMarkers }) {
  const debtByYear = useMemo(() => {
    const map = {};
    totalDebtData.forEach(d => { map[d.year] = d.debt; });
    return map;
  }, []);

  // Determine which event labels need extra vertical offset to avoid overlap with neighbors
  const labelOffsets = useMemo(() => {
    const offsets = {};
    const sorted = [...filteredMarkers].sort((a, b) => a.year - b.year);
    for (let i = 0; i < sorted.length; i++) {
      const prevYear = i > 0 ? sorted[i - 1].year : -Infinity;
      offsets[sorted[i].year] = (sorted[i].year - prevYear <= 4) ? 24 : 10;
    }
    return offsets;
  }, [filteredMarkers]);

  return (
    <div style={innerCard}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: "#E2E8F0", marginBottom: 4 }}>US Total Federal Debt (1940–2025)</h3>
      <p style={{ fontSize: 11, color: "#64748B", marginBottom: 16 }}>Nominal USD — background shading by presidential party (blue = Democrat, red = Republican)</p>
      <ResponsiveContainer width="100%" height={440}>
        <AreaChart data={totalDebtData} margin={{ top: 40, right: 30, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="debtGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.25} />
          <XAxis
            dataKey="year" stroke="#475569"
            tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false}
            type="number" domain={[1940, 2026]}
            ticks={[1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020]}
          />
          <YAxis
            stroke="#475569"
            tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}T` : `$${v}B`}
            tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false}
            label={{ value: "Total Debt", angle: -90, position: "insideLeft", offset: -2, style: { fill: "#64748B", fontSize: 11 } }}
          />
          <Tooltip content={<DebtTimelineTooltip />} />

          {/* Presidential term background areas */}
          {presidentialTerms.map((term) => {
            const duration = term.end - term.start;
            return (
              <ReferenceArea
                key={`${term.president}-${term.start}`}
                x1={term.start}
                x2={term.end}
                fill={term.party === "D" ? "#3B82F6" : "#EF4444"}
                fillOpacity={0.08}
                label={duration >= 4 ? {
                  value: term.president,
                  position: "insideTop",
                  fill: term.party === "D" ? "#60A5FA" : "#F87171",
                  fontSize: 9,
                  fontWeight: 500,
                  offset: 5,
                } : undefined}
              />
            );
          })}

          {/* Subtle vertical event lines */}
          {filteredMarkers.map((m) => (
            <ReferenceLine
              key={m.year}
              x={m.year}
              stroke="#F8FAFC"
              strokeDasharray="4 4"
              strokeOpacity={0.2}
            />
          ))}

          <Area
            type="monotone"
            dataKey="debt"
            stroke="#06B6D4"
            strokeWidth={2}
            fill="url(#debtGradient)"
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0, fill: "#06B6D4" }}
          />

          {/* Event marker dots on the debt line */}
          {filteredMarkers.map((m) => {
            const debt = debtByYear[m.year];
            if (debt == null) return null;
            return (
              <ReferenceDot
                key={`dot-${m.year}`}
                x={m.year}
                y={debt}
                r={4}
                fill="#FBBF24"
                stroke="#0F172A"
                strokeWidth={2}
                label={{
                  value: m.label,
                  position: "top",
                  offset: labelOffsets[m.year] || 10,
                  fill: "#F8FAFC",
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 16, marginTop: 8, marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 14, height: 10, borderRadius: 2, background: "rgba(59, 130, 246, 0.3)", border: "1px solid rgba(59, 130, 246, 0.5)" }} />
          <span style={{ fontSize: 11, color: "#94A3B8" }}>Democrat</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 14, height: 10, borderRadius: 2, background: "rgba(239, 68, 68, 0.3)", border: "1px solid rgba(239, 68, 68, 0.5)" }} />
          <span style={{ fontSize: 11, color: "#94A3B8" }}>Republican</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FBBF24", border: "2px solid #0F172A" }} />
          <span style={{ fontSize: 11, color: "#94A3B8" }}>Event</span>
        </div>
      </div>
      <div style={{ marginTop: 4 }}>
        <SourceLink sourceKey="totalDebt" />
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label, hoveredConflict, sourceKey }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#334155", border: "1px solid #475569", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#F8FAFC", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", maxWidth: 260 }}>
      <p style={{ fontWeight: 600, marginBottom: 6 }}>{label}</p>
      {payload.map(p => {
        const isHovered = hoveredConflict === p.dataKey;
        return (
          <p key={p.dataKey} style={{
            color: p.color,
            margin: "2px 0",
            fontWeight: isHovered ? 700 : 400,
            opacity: !hoveredConflict || isHovered ? 1 : 0.6
          }}>
            {p.dataKey}: <strong>{p.value}%</strong>
          </p>
        );
      })}
      <TooltipSourceLink sourceKey={sourceKey} />
    </div>
  );
}

function FiscalChart({ title, subtitle, data, conflicts, yLabel, yDomain, yTickFormatter, sourceKey }) {
  const [hoveredConflict, setHoveredConflict] = useState(null);
  const [hiddenConflicts, setHiddenConflicts] = useState([]);

  const toggleConflict = (conflict) => {
    setHiddenConflicts(prev =>
      prev.includes(conflict)
        ? prev.filter(c => c !== conflict)
        : [...prev, conflict]
    );
  };

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", paddingTop: "12px" }}>
        {payload.map((entry, index) => {
          const isHidden = hiddenConflicts.includes(entry.value);
          const isHovered = hoveredConflict === entry.value;
          return (
            <div
              key={`item-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "6px",
                background: isHovered ? "rgba(255,255,255,0.05)" : "transparent",
                transition: "all 0.2s",
                opacity: isHidden ? 0.4 : 1
              }}
              onClick={() => toggleConflict(entry.value)}
              onMouseEnter={() => setHoveredConflict(entry.value)}
              onMouseLeave={() => setHoveredConflict(null)}
            >
              <div style={{ width: 10, height: 10, borderRadius: 2, background: entry.color }} />
              <span style={{
                fontSize: 12,
                color: isHovered ? "#F8FAFC" : "#CBD5E1",
                fontWeight: isHovered ? 600 : 400,
                textDecoration: isHidden ? "line-through" : "none"
              }}>
                {entry.value}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

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
          <Tooltip content={<CustomTooltip hoveredConflict={hoveredConflict} sourceKey={sourceKey} />} wrapperStyle={{ pointerEvents: "auto" }} />
          <Legend content={renderLegend} />
          <ReferenceLine
            x="T=0" stroke="#F8FAFC" strokeDasharray="6 4" strokeOpacity={0.5}
            label={{ value: "War Start", position: "top", fill: "#94A3B8", fontSize: 10 }}
          />
          {conflicts.map(c => {
            const isHovered = hoveredConflict === c;
            const isAnyHovered = hoveredConflict !== null;
            const isHidden = hiddenConflicts.includes(c);

            if (isHidden) return null;

            return (
              <Line
                key={c}
                type="monotone"
                dataKey={c}
                stroke={fiscalConflictColors[c]}
                strokeWidth={isHovered ? 4 : 2}
                strokeOpacity={!isAnyHovered || isHovered ? 1 : 0.15}
                dot={{
                  r: isHovered ? 4 : 3,
                  fill: fiscalConflictColors[c],
                  strokeWidth: 0,
                  fillOpacity: !isAnyHovered || isHovered ? 1 : 0.15
                }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                connectNulls
                onMouseEnter={() => setHoveredConflict(c)}
                onMouseLeave={() => setHoveredConflict(null)}
                style={{ transition: "all 0.2s" }}
              />
            );
          })}
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
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <SourceLink sourceKey="cpi" />
        <SourceLink sourceKey="debtGdp" />
      </div>
    </div>
  );
}

export default function FiscalImpactPanel() {
  const { activeConflicts, filterData } = useEventToggle();

  const cpiChart = useMemo(() => buildCpiChartData(activeConflicts), [activeConflicts]);
  const debtGdpChart = useMemo(() => buildDebtGdpChartData(activeConflicts), [activeConflicts]);
  const filteredSummary = useMemo(() => filterData(fiscalSummary), [filterData]);
  const filteredMarkers = useMemo(() => {
    return conflictMarkers.filter(m => activeConflicts.includes(m.label));
  }, [activeConflicts]);

  return (
    <section style={card}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#F8FAFC", marginBottom: 4 }}>Fiscal Impact</h2>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>
        How inflation and federal debt responded in the years surrounding each conflict (T=0 is the war start year)
      </p>

      <DebtTimelineChart filteredMarkers={filteredMarkers} />

      <FiscalChart
        title="CPI Inflation Trajectory"
        subtitle="Year-over-year CPI change (%) — T-2 through T+5 relative to conflict start"
        data={cpiChart}
        conflicts={activeConflicts}
        yLabel="CPI YoY %"
        yDomain={["auto", "auto"]}
        sourceKey="cpi"
      />

      <FiscalChart
        title="Federal Debt / GDP Trajectory"
        subtitle="US federal debt as % of GDP — T-2 through T+5 relative to conflict start"
        data={debtGdpChart}
        conflicts={activeConflicts}
        yLabel="Debt / GDP %"
        yDomain={["auto", "auto"]}
        sourceKey="debtGdp"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {filteredSummary.map(d => (
          <FiscalCard key={d.conflict} d={d} />
        ))}
      </div>

      <p style={{ fontSize: 11, color: "#64748B", textAlign: "center", marginTop: 16, fontStyle: "italic" }}>
        CPI data: BLS / FRED CPIAUCSL (post-1947), Minneapolis Fed historical tables (pre-1947). Debt/GDP: FRED GFDGDPA188S.
      </p>
    </section>
  );
}
