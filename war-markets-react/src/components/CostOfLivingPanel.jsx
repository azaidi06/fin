import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { costOfLivingData, sourceUrls, sourceLabels, fiscalConflictColors } from "../data/warData";
import { TooltipSourceLink } from "./SourceLink";
import { useEventToggle } from "../context/EventToggleContext";

import { useTheme } from '../theme/ThemeContext';
const card = { background: 'var(--c-panel)', border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };
const innerCard = { background: 'var(--c-bg)', border: "1px solid #334155", borderRadius: 10, padding: 20 };

// Pull from shared semantic war color map so each conflict
// reads the same hue here as in fiscal/global/wealth charts.
const eraColors = fiscalConflictColors;

const itemLabels = {
  home: "Median Home", car: "New Car", tuition: "College Tuition", income: "Annual Income",
  milk: "Gallon of Milk", eggs: "Dozen Eggs", gas: "Gallon of Gas", bread: "Loaf of Bread",
};

const itemColors = {
  home: 'var(--c-red)', car: 'var(--c-indigo)', tuition: 'var(--c-amber)', income: 'var(--c-green)',
  milk: 'var(--c-text-high-alt)', eggs: 'var(--c-amber-strong)', gas: 'var(--c-orange)', bread: 'var(--c-violet-soft)',
};

const fmtUsd = (v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v.toFixed(2)}`;
const fmtNominal = (v) => v >= 100 ? `$${v.toLocaleString()}` : `$${v.toFixed(2)}`;

// Short era labels for compact charts
const eraShort = { WWII: "WW2", Korea: "Korea", "Cuban Missile": "Cuba", Vietnam: "Viet.", "Oil Embargo": "Oil '73", "Black Monday": "Blk Mon", "Gulf War": "Gulf", "9/11": "9/11", Iraq: "Iraq", "2008 Crisis": "'08", COVID: "COVID", "Russia-Ukraine": "Russ.", Today: "Today", Iran: "Iran '26" };

function ItemTooltip({ active, payload, itemKey }) {
  const t = useTheme().tokens;
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: t.border, border: "1px solid #475569", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: t.textHigh, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{d.era} ({d.year})</p>
      <p style={{ color: t.textMute, margin: "2px 0" }}>Nominal: <strong style={{ color: t.textMid }}>{fmtNominal(d.nominal)}</strong></p>
      <p style={{ color: t.textMute, margin: "2px 0" }}>2024 USD: <strong style={{ color: t.textHigh }}>{fmtUsd(d.value)}</strong></p>
      {itemKey && <TooltipSourceLink sourceKey={itemKey} />}
    </div>
  );
}

function ItemChart({ itemKey, filteredData, height = 240, yFormatter, big = false }) {
  const t = useTheme().tokens;
  const data = useMemo(() => filteredData.map(d => ({
    era: d.era,
    eraShort: eraShort[d.era] || d.era,
    year: d.year,
    value: d.items[itemKey].adjusted,
    nominal: d.items[itemKey].nominal,
  })), [filteredData, itemKey]);

  const title = itemLabels[itemKey];
  return (
    <div style={{ ...innerCard, marginBottom: 0 }}>
      <h4 style={{ fontSize: big ? 15 : 13, fontWeight: 600, color: t.textHighAlt, marginBottom: big ? 12 : 8 }}>{title}</h4>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: big ? 10 : 0, bottom: big ? 40 : 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={t.axis} opacity={0.25} />
          <XAxis
            dataKey={big ? "era" : "eraShort"} stroke={t.axis}
            tick={{ fill: t.textMute, fontSize: big ? 12 : 9 }}
            axisLine={false} tickLine={false}
            interval={0} tickMargin={4}
            angle={-35} textAnchor="end"
          />
          <YAxis
            stroke={t.axis}
            tickFormatter={yFormatter}
            tick={{ fill: t.textMute, fontSize: 11 }} axisLine={false} tickLine={false}
            width={big ? 65 : 45}
          />
          <Tooltip content={<ItemTooltip itemKey={itemKey} />} cursor={{ fill: "rgba(255,255,255,0.04)" }} wrapperStyle={{ pointerEvents: "auto" }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={big ? 50 : 32}>
            {data.map(d => (
              <Cell key={d.era} fill={eraColors[d.era] || t.textMute} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function SourceIcon({ sourceKey }) {
  const t = useTheme().tokens;
  const url = sourceUrls[sourceKey];
  const label = sourceLabels[sourceKey];
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      style={{
        fontSize: 10,
        color: t.axis,
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 18,
        height: 18,
        borderRadius: 4,
        flexShrink: 0,
        transition: "color 0.15s, background 0.15s",
      }}
      onMouseEnter={e => { e.currentTarget.style.color = t.textMute; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
      onMouseLeave={e => { e.currentTarget.style.color = t.axis; e.currentTarget.style.background = "transparent"; }}
    >
      ↗
    </a>
  );
}

function EraCard({ d }) {
  const t = useTheme().tokens;
  const allItems = Object.entries(d.items);
  return (
    <div style={{
      background: t.bg,
      border: "1px solid #334155",
      borderRadius: 10,
      padding: 20,
      ...(d.preliminary ? { backgroundImage: "repeating-linear-gradient(135deg, rgba(251,191,36,0.04) 0 8px, transparent 8px 16px)" } : {}),
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, gap: 8, flexWrap: "wrap" }}>
        <h3 style={{ fontWeight: 600, color: t.textHighAlt, fontSize: 14 }}>
          {d.era} <span style={{ color: t.textLow, fontWeight: 400 }}>({d.year})</span>
          {d.preliminary && (
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              color: t.amberStrong,
              background: "rgba(251,191,36,0.14)",
              padding: "2px 6px",
              borderRadius: 4,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginLeft: 8,
            }}>
              Preliminary
            </span>
          )}
        </h3>
        <span style={{ fontSize: 10, color: t.textMute, background: t.panel, border: "1px solid #334155", borderRadius: 6, padding: "2px 8px" }}>
          CPI ×{d.cpiMultiplier}
        </span>
      </div>

      {/* Column headers */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0 2px", borderBottom: "1px solid #334155", marginBottom: 2 }}>
        <span style={{ fontSize: 9, color: t.axis, textTransform: "uppercase", letterSpacing: "0.05em" }}>Item</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 9, color: t.axis, textTransform: "uppercase", letterSpacing: "0.05em", minWidth: 56, textAlign: "right" }}>Nominal</span>
          <span style={{ fontSize: 9, color: t.axis, textTransform: "uppercase", letterSpacing: "0.05em", minWidth: 56, textAlign: "right" }}>2024 USD</span>
          <span style={{ width: 18 }} />
        </div>
      </div>

      {allItems.map(([key, val]) => (
        <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0", borderTop: "1px solid #1E293B" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: itemColors[key], flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: t.textMid, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{itemLabels[key]}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 11, color: t.textLow, minWidth: 56, textAlign: "right" }}>{fmtNominal(val.nominal)}</span>
            <span style={{ fontSize: 11, color: t.textHigh, fontWeight: 600, minWidth: 56, textAlign: "right" }}>{fmtUsd(val.adjusted)}</span>
            <SourceIcon sourceKey={key} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CostOfLivingPanel() {
  const t = useTheme().tokens;
  const { filterData } = useEventToggle();

  const filteredData = useMemo(() => filterData(costOfLivingData), [filterData]);

  // Active era colors for legend
  const activeEraColors = useMemo(() =>
    Object.fromEntries(filteredData.map(d => [d.era, eraColors[d.era] || t.textMute])),
    [filteredData]
  );

  const fmtK = v => `$${(v / 1000).toFixed(0)}K`;
  const fmtDollar = v => `$${v.toFixed(0)}`;

  return (
    <section style={card}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: t.textHigh, marginBottom: 4 }}>Cost of Living</h2>
      <p style={{ fontSize: 13, color: t.textMute, marginBottom: 24 }}>
        What everyday goods and big-ticket items cost during each conflict era — all prices adjusted to 2024 USD using CPI-U multipliers
      </p>

      {/* Era color legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12, justifyContent: "center" }}>
        {Object.entries(activeEraColors).map(([era, color]) => (
          <div key={era} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
            <span style={{ fontSize: 11, color: t.textMute }}>{era}</span>
          </div>
        ))}
      </div>

      {/* 2024-USD inflation-adjusted indicator */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        marginBottom: 20,
        borderRadius: 999,
        background: "rgba(99,102,241,0.12)",
        border: "1px solid rgba(99,102,241,0.32)",
        fontSize: 11,
        fontWeight: 600,
        color: t.indigoFaint,
        letterSpacing: "0.04em",
      }}>
        <span style={{ width: 6, height: 6, borderRadius: 3, background: t.indigoFaint }} />
        ALL VALUES IN 2024 USD · CPI-U adjusted
      </div>

      {/* ── BIG PURCHASES ── */}
      <h3 style={{ fontSize: 15, fontWeight: 600, color: t.textHighAlt, marginBottom: 4 }}>Big Purchases</h3>
      <p style={{ fontSize: 11, color: t.textLow, marginBottom: 12 }}>Median home, new car, college tuition, and average annual income — all in 2024 dollars</p>

      {/* Median Home — solo full-width chart */}
      <div style={{ marginBottom: 12 }}>
        <ItemChart itemKey="home" filteredData={filteredData} height={300} yFormatter={fmtK} big />
      </div>

      {/* Car, Tuition, Income — 3-up grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginBottom: 24 }}>
        <ItemChart itemKey="car" filteredData={filteredData} height={220} yFormatter={fmtK} />
        <ItemChart itemKey="tuition" filteredData={filteredData} height={220} yFormatter={fmtK} />
        <ItemChart itemKey="income" filteredData={filteredData} height={220} yFormatter={fmtK} />
      </div>

      {/* ── EVERYDAY ITEMS ── */}
      <h3 style={{ fontSize: 15, fontWeight: 600, color: t.textHighAlt, marginBottom: 4 }}>Everyday Items</h3>
      <p style={{ fontSize: 11, color: t.textLow, marginBottom: 12 }}>Gallon of milk, dozen eggs, gallon of gas, and loaf of bread — all in 2024 dollars</p>

      {/* Everyday items — forced 2x2 grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 24 }}>
        <ItemChart itemKey="milk" filteredData={filteredData} height={220} yFormatter={fmtDollar} />
        <ItemChart itemKey="eggs" filteredData={filteredData} height={220} yFormatter={fmtDollar} />
        <ItemChart itemKey="gas" filteredData={filteredData} height={220} yFormatter={fmtDollar} />
        <ItemChart itemKey="bread" filteredData={filteredData} height={220} yFormatter={fmtDollar} />
      </div>

      {/* Era Detail Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {filteredData.map(d => (
          <EraCard key={d.year} d={d} />
        ))}
      </div>

      {filteredData.some(d => d.preliminary) && (
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginTop: 16,
          padding: "5px 12px",
          borderRadius: 999,
          background: "rgba(251,191,36,0.12)",
          border: "1px solid rgba(251,191,36,0.32)",
          fontSize: 11,
          color: t.amberStrong,
          letterSpacing: "0.02em",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: t.amberStrong }} />
          Iran 2026 figures are preliminary (snapshot Apr 15, 2026; CPI multiplier estimated from 2024 baseline + 5% cumulative inflation).
        </div>
      )}

      <p style={{ fontSize: 11, color: t.textLow, textAlign: "center", marginTop: 16, fontStyle: "italic" }}>
        Sources: BLS CPI-U (inflation adjustment), Census Bureau (housing), EIA (gasoline), USDA (food), NCES (tuition), BLS (income).
      </p>
    </section>
  );
}
