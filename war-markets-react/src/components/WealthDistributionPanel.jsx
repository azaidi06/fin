import { useState } from "react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, ReferenceArea,
} from "recharts";
import {
  wealthStackedData, wealthDivergenceData, warPeriodBands,
  wealthNarratives, uCurveInsight, wealthMilestones,
  wealthSourceUrls, wealthSourceLabels,
} from "../data/wealthData";

const ACCENT = "#F472B6";

const card = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };
const innerCard = { background: "#0F172A", border: "1px solid #334155", borderRadius: 10, padding: 20, marginBottom: 24 };

const stackColors = {
  "Top 0.1%": "#F472B6",
  "Next 0.9%": "#A78BFA",
  "Next 9%": "#60A5FA",
  "Bottom 90%": "#475569",
};

const divergenceColors = {
  "Top 1%": "#F472B6",
  "Bottom 50%": "#34D399",
};

const linkStyle = {
  fontSize: 10,
  color: "#64748B",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: 3,
  transition: "color 0.15s",
};

function WealthSourceLink({ sourceKey, style }) {
  const url = wealthSourceUrls[sourceKey];
  const label = wealthSourceLabels[sourceKey];
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ ...linkStyle, ...style }}
      onMouseEnter={e => e.currentTarget.style.color = "#94A3B8"}
      onMouseLeave={e => e.currentTarget.style.color = "#64748B"}
    >
      Source: {label} ↗
    </a>
  );
}

function StackedTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#334155", border: "1px solid #475569", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#F8FAFC", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", maxWidth: 220 }}>
      <p style={{ fontWeight: 600, marginBottom: 6 }}>{label}</p>
      {payload.filter(p => p.dataKey !== "Bottom 90%").reverse().map(p => (
        <p key={p.dataKey} style={{ color: p.color || p.fill, margin: "2px 0" }}>
          {p.dataKey}: <strong>{p.value}%</strong>
        </p>
      ))}
      <div style={{ marginTop: 6, paddingTop: 6, borderTop: "1px solid #475569" }}>
        <a href={wealthSourceUrls.wid} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 10, color: "#64748B", textDecoration: "none" }}
          onMouseEnter={e => e.currentTarget.style.color = "#94A3B8"}
          onMouseLeave={e => e.currentTarget.style.color = "#64748B"}
        >
          World Inequality Database ↗
        </a>
      </div>
    </div>
  );
}

function DivergenceTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#334155", border: "1px solid #475569", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#F8FAFC", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", maxWidth: 220 }}>
      <p style={{ fontWeight: 600, marginBottom: 6 }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color, margin: "2px 0" }}>
          {p.dataKey}: <strong>{p.value}%</strong>
        </p>
      ))}
      <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 4, borderTop: "1px solid #475569", paddingTop: 4 }}>
        Gap: {(payload[0]?.value - (payload[1]?.value || 0)).toFixed(1)} pp
      </p>
      <div style={{ marginTop: 4 }}>
        <a href={wealthSourceUrls.saezZucman} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 10, color: "#64748B", textDecoration: "none" }}
          onMouseEnter={e => e.currentTarget.style.color = "#94A3B8"}
          onMouseLeave={e => e.currentTarget.style.color = "#64748B"}
        >
          Saez-Zucman (2016, updated) ↗
        </a>
      </div>
    </div>
  );
}

function StackedAreaSection() {
  const [hoveredSeries, setHoveredSeries] = useState(null);
  const [hiddenSeries, setHiddenSeries] = useState([]);

  const toggleSeries = (name) => {
    setHiddenSeries(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  const seriesKeys = ["Top 0.1%", "Next 0.9%", "Next 9%"];

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", paddingTop: "12px" }}>
        {payload.filter(e => e.value !== "Bottom 90%").map((entry, index) => {
          const isHidden = hiddenSeries.includes(entry.value);
          const isHovered = hoveredSeries === entry.value;
          return (
            <div
              key={`item-${index}`}
              style={{
                display: "flex", alignItems: "center", gap: "6px", cursor: "pointer",
                padding: "4px 8px", borderRadius: "6px",
                background: isHovered ? "rgba(255,255,255,0.05)" : "transparent",
                transition: "all 0.2s", opacity: isHidden ? 0.4 : 1,
              }}
              onClick={() => toggleSeries(entry.value)}
              onMouseEnter={() => setHoveredSeries(entry.value)}
              onMouseLeave={() => setHoveredSeries(null)}
            >
              <div style={{ width: 10, height: 10, borderRadius: 2, background: entry.color }} />
              <span style={{
                fontSize: 12, color: isHovered ? "#F8FAFC" : "#CBD5E1",
                fontWeight: isHovered ? 600 : 400,
                textDecoration: isHidden ? "line-through" : "none",
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
      <h3 style={{ fontSize: 15, fontWeight: 600, color: "#E2E8F0", marginBottom: 4 }}>
        Wealth Concentration in the Top 10% (1913–2024)
      </h3>
      <p style={{ fontSize: 11, color: "#64748B", marginBottom: 16 }}>
        Stacked area showing how wealth is distributed within the top 10% — shaded bands mark war periods
      </p>
      <ResponsiveContainer width="100%" height={360}>
        <AreaChart data={wealthStackedData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <defs>
            {seriesKeys.map(key => (
              <linearGradient key={key} id={`grad-${key.replace(/[\s.%]/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={stackColors[key]} stopOpacity={0.4} />
                <stop offset="95%" stopColor={stackColors[key]} stopOpacity={0.05} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.25} />
          <XAxis
            dataKey="year" stroke="#475569"
            tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false}
            type="number" domain={[1913, 2024]}
            ticks={[1913, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020]}
          />
          <YAxis
            stroke="#475569" tickFormatter={v => `${v}%`}
            tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false}
            label={{ value: "Wealth Share", angle: -90, position: "insideLeft", offset: -2, style: { fill: "#64748B", fontSize: 11 } }}
          />
          <Tooltip content={<StackedTooltip />} />
          <Legend content={renderLegend} />
          {warPeriodBands.map(w => (
            <ReferenceArea
              key={w.conflict}
              x1={w.startYear} x2={w.endYear}
              fill={w.color} fillOpacity={0.08}
              stroke={w.color} strokeOpacity={0.2} strokeDasharray="3 3"
            />
          ))}
          {wealthMilestones.map(m => (
            <ReferenceLine
              key={m.year}
              x={m.year}
              stroke="#F8FAFC"
              strokeDasharray="6 4"
              strokeOpacity={0.4}
              label={{ value: m.label, position: "top", fill: "#94A3B8", fontSize: 9 }}
            />
          ))}
          {seriesKeys.map(key => {
            const isHovered = hoveredSeries === key;
            const isAnyHovered = hoveredSeries !== null;
            const isHidden = hiddenSeries.includes(key);
            if (isHidden) return null;
            return (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={stackColors[key]}
                strokeWidth={isHovered ? 3 : 1.5}
                fill={`url(#grad-${key.replace(/[\s.%]/g, "")})`}
                fillOpacity={!isAnyHovered || isHovered ? 1 : 0.3}
                strokeOpacity={!isAnyHovered || isHovered ? 1 : 0.3}
                onMouseEnter={() => setHoveredSeries(key)}
                onMouseLeave={() => setHoveredSeries(null)}
              />
            );
          })}
          {/* Bottom 90% as base layer, always shown */}
          {!hiddenSeries.includes("Bottom 90%") && (
            <Area
              type="monotone"
              dataKey="Bottom 90%"
              stackId="1"
              stroke={stackColors["Bottom 90%"]}
              strokeWidth={0}
              fill={stackColors["Bottom 90%"]}
              fillOpacity={0.15}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
      <div style={{ marginTop: 8 }}>
        <WealthSourceLink sourceKey="wid" />
      </div>
    </div>
  );
}

function DivergenceSection() {
  const [hoveredLine, setHoveredLine] = useState(null);

  return (
    <div style={innerCard}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: "#E2E8F0", marginBottom: 4 }}>
        Top 1% vs Bottom 50% Wealth Share (1913–2024)
      </h3>
      <p style={{ fontSize: 11, color: "#64748B", marginBottom: 16 }}>
        The great divergence — how the gap between richest and poorest widened, narrowed, then widened again
      </p>
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={wealthDivergenceData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.25} />
          <XAxis
            dataKey="year" stroke="#475569"
            tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false}
            type="number" domain={[1913, 2024]}
            ticks={[1913, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020]}
          />
          <YAxis
            stroke="#475569" tickFormatter={v => `${v}%`}
            tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false}
            domain={[0, 50]}
            label={{ value: "Wealth Share %", angle: -90, position: "insideLeft", offset: -2, style: { fill: "#64748B", fontSize: 11 } }}
          />
          <Tooltip content={<DivergenceTooltip />} />
          {warPeriodBands.map(w => (
            <ReferenceArea
              key={w.conflict}
              x1={w.startYear} x2={w.endYear}
              fill={w.color} fillOpacity={0.08}
              stroke={w.color} strokeOpacity={0.2} strokeDasharray="3 3"
            />
          ))}
          {Object.entries(divergenceColors).map(([key, color]) => {
            const isHovered = hoveredLine === key;
            const isAnyHovered = hoveredLine !== null;
            return (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={isHovered ? 4 : 2}
                strokeOpacity={!isAnyHovered || isHovered ? 1 : 0.2}
                dot={{
                  r: isHovered ? 4 : 3,
                  fill: color,
                  strokeWidth: 0,
                  fillOpacity: !isAnyHovered || isHovered ? 1 : 0.2,
                }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                onMouseEnter={() => setHoveredLine(key)}
                onMouseLeave={() => setHoveredLine(null)}
                style={{ transition: "all 0.2s" }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
      {/* Inline legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 8 }}>
        {Object.entries(divergenceColors).map(([key, color]) => (
          <div
            key={key}
            style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", padding: "4px 8px", borderRadius: 6 }}
            onMouseEnter={() => setHoveredLine(key)}
            onMouseLeave={() => setHoveredLine(null)}
          >
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
            <span style={{ fontSize: 12, color: hoveredLine === key ? "#F8FAFC" : "#CBD5E1", fontWeight: hoveredLine === key ? 600 : 400 }}>
              {key}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8 }}>
        <WealthSourceLink sourceKey="saezZucman" />
      </div>
    </div>
  );
}

function NarrativeCard({ d }) {
  const isUp = d.direction === "up";
  const arrowColor = isUp ? "#EF4444" : "#10B981";
  return (
    <div style={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 10, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: ACCENT, flexShrink: 0 }} />
        <h3 style={{ fontWeight: 600, color: "#E2E8F0", fontSize: 14 }}>{d.era}</h3>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>
            Top 0.1% Before
          </p>
          <p style={{ fontSize: 20, fontWeight: 700, color: "#CBD5E1" }}>{d.topShareBefore}</p>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>
            Top 0.1% After
          </p>
          <p style={{ fontSize: 20, fontWeight: 700, color: "#CBD5E1" }}>{d.topShareAfter}</p>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>
            Change
          </p>
          <p style={{ fontSize: 20, fontWeight: 700, color: arrowColor }}>
            {isUp ? "+" : ""}{d.delta} pp
          </p>
        </div>
      </div>

      <p style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.5, borderTop: "1px solid #334155", paddingTop: 10 }}>
        {d.narrative}
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <WealthSourceLink sourceKey="wid" />
        <WealthSourceLink sourceKey="saezZucman" />
      </div>
    </div>
  );
}

function InsightCallout() {
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(244,114,182,0.08), rgba(167,139,250,0.05))",
      border: "1px solid rgba(244,114,182,0.25)",
      borderRadius: 10, padding: 24, marginBottom: 24,
    }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: ACCENT, marginBottom: 8 }}>
        {uCurveInsight.title}
      </h3>
      <p style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6, marginBottom: 16 }}>
        {uCurveInsight.description}
      </p>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {uCurveInsight.keyPoints.map((point, i) => (
          <li key={i} style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.7 }}>
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function WealthDistributionPanel() {
  return (
    <section style={card}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#F8FAFC", marginBottom: 4 }}>
        Wealth Distribution
      </h2>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>
        How wealth inequality shifted across a century of American wars — from the Great Compression to the New Gilded Age
      </p>

      <InsightCallout />
      <StackedAreaSection />
      <DivergenceSection />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {wealthNarratives.map(d => (
          <NarrativeCard key={d.era} d={d} />
        ))}
      </div>

      <p style={{ fontSize: 11, color: "#64748B", textAlign: "center", marginTop: 16, fontStyle: "italic" }}>
        Wealth share data: Saez-Zucman (2016, updated) via World Inequality Database (WID). Top 0.1% / 1% / 10% net personal wealth shares, United States, 1913–2024.
      </p>
    </section>
  );
}
