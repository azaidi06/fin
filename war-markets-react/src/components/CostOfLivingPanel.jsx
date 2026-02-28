import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { costOfLivingData } from "../data/warData";
import { TooltipSourceLink } from "./SourceLink";
import SourceLink from "./SourceLink";

const card = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };
const innerCard = { background: "#0F172A", border: "1px solid #334155", borderRadius: 10, padding: 20 };

const eraColors = {
  WWII: "#EF4444", Korea: "#F59E0B", Vietnam: "#10B981",
  "Gulf War": "#6366F1", "9/11": "#EC4899", Iraq: "#3B82F6", Today: "#8B5CF6",
};

const itemLabels = {
  home: "Median Home", car: "New Car", tuition: "College Tuition", income: "Annual Income",
  milk: "Gallon of Milk", eggs: "Dozen Eggs", gas: "Gallon of Gas", bread: "Loaf of Bread",
};

const itemColors = {
  home: "#EF4444", car: "#6366F1", tuition: "#F59E0B", income: "#10B981",
  milk: "#E2E8F0", eggs: "#FBBF24", gas: "#F97316", bread: "#A78BFA",
};

const fmtUsd = (v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v.toFixed(2)}`;
const fmtNominal = (v) => v >= 100 ? `$${v.toLocaleString()}` : `$${v.toFixed(2)}`;

// Short era labels for compact charts
const eraShort = { WWII: "WW2", Korea: "Korea", Vietnam: "Viet.", "Gulf War": "Gulf", "9/11": "9/11", Iraq: "Iraq", Today: "Today" };

function getItemData(itemKey) {
  return costOfLivingData.map(d => ({
    era: d.era,
    eraShort: eraShort[d.era],
    year: d.year,
    value: d.items[itemKey].adjusted,
    nominal: d.items[itemKey].nominal,
  }));
}

function ItemTooltip({ active, payload, itemKey }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: "#334155", border: "1px solid #475569", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#F8FAFC", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{d.era} ({d.year})</p>
      <p style={{ color: "#94A3B8", margin: "2px 0" }}>Nominal: <strong style={{ color: "#CBD5E1" }}>{fmtNominal(d.nominal)}</strong></p>
      <p style={{ color: "#94A3B8", margin: "2px 0" }}>2024 USD: <strong style={{ color: "#F8FAFC" }}>{fmtUsd(d.value)}</strong></p>
      {itemKey && <TooltipSourceLink sourceKey={itemKey} />}
    </div>
  );
}

function ItemChart({ itemKey, height = 240, yFormatter, big = false }) {
  const data = getItemData(itemKey);
  const title = itemLabels[itemKey];
  return (
    <div style={{ ...innerCard, marginBottom: 0 }}>
      <h4 style={{ fontSize: big ? 15 : 13, fontWeight: 600, color: "#E2E8F0", marginBottom: big ? 12 : 8 }}>{title}</h4>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: big ? 10 : 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.25} />
          <XAxis
            dataKey={big ? "era" : "eraShort"} stroke="#475569"
            tick={{ fill: "#94A3B8", fontSize: big ? 12 : 9 }}
            axisLine={false} tickLine={false}
            interval={0} tickMargin={4}
          />
          <YAxis
            stroke="#475569"
            tickFormatter={yFormatter}
            tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false}
            width={big ? 65 : 45}
          />
          <Tooltip content={<ItemTooltip itemKey={itemKey} />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={big ? 50 : 32}>
            {data.map(d => (
              <Cell key={d.era} fill={eraColors[d.era]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function EraCard({ d }) {
  const allItems = Object.entries(d.items);
  return (
    <div style={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 10, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <h3 style={{ fontWeight: 600, color: "#E2E8F0", fontSize: 14 }}>
          {d.era} <span style={{ color: "#64748B", fontWeight: 400 }}>({d.year})</span>
        </h3>
        <span style={{ fontSize: 10, color: "#94A3B8", background: "#1E293B", border: "1px solid #334155", borderRadius: 6, padding: "2px 8px" }}>
          CPI ×{d.cpiMultiplier}
        </span>
      </div>

      {/* Column headers */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0 2px", borderBottom: "1px solid #334155", marginBottom: 2 }}>
        <span style={{ fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>Item</span>
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", minWidth: 64, textAlign: "right" }}>Nominal</span>
          <span style={{ fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", minWidth: 70, textAlign: "right" }}>2024 USD</span>
        </div>
      </div>

      {allItems.map(([key, val]) => (
        <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0", borderTop: "1px solid #1E293B" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: itemColors[key], flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#CBD5E1" }}>{itemLabels[key]}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <span style={{ fontSize: 11, color: "#64748B", minWidth: 64, textAlign: "right" }}>{fmtNominal(val.nominal)}</span>
            <span style={{ fontSize: 11, color: "#F8FAFC", fontWeight: 600, minWidth: 70, textAlign: "right" }}>{fmtUsd(val.adjusted)}</span>
            <SourceLink sourceKey={key} style={{ fontSize: 9, marginLeft: 4 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CostOfLivingPanel() {
  const fmtK = v => `$${(v / 1000).toFixed(0)}K`;
  const fmtDollar = v => `$${v.toFixed(0)}`;

  return (
    <section style={card}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#F8FAFC", marginBottom: 4 }}>Cost of Living</h2>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>
        What everyday goods and big-ticket items cost during each conflict era — all prices adjusted to 2024 USD using CPI-U multipliers
      </p>

      {/* Era color legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20, justifyContent: "center" }}>
        {Object.entries(eraColors).map(([era, color]) => (
          <div key={era} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
            <span style={{ fontSize: 11, color: "#94A3B8" }}>{era}</span>
          </div>
        ))}
      </div>

      {/* ── BIG PURCHASES ── */}
      <h3 style={{ fontSize: 15, fontWeight: 600, color: "#E2E8F0", marginBottom: 4 }}>Big Purchases</h3>
      <p style={{ fontSize: 11, color: "#64748B", marginBottom: 12 }}>Median home, new car, college tuition, and average annual income — all in 2024 dollars</p>

      {/* Median Home — solo full-width chart */}
      <div style={{ marginBottom: 12 }}>
        <ItemChart itemKey="home" height={300} yFormatter={fmtK} big />
      </div>

      {/* Car, Tuition, Income — 3-up grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginBottom: 24 }}>
        <ItemChart itemKey="car" height={220} yFormatter={fmtK} />
        <ItemChart itemKey="tuition" height={220} yFormatter={fmtK} />
        <ItemChart itemKey="income" height={220} yFormatter={fmtK} />
      </div>

      {/* ── EVERYDAY ITEMS ── */}
      <h3 style={{ fontSize: 15, fontWeight: 600, color: "#E2E8F0", marginBottom: 4 }}>Everyday Items</h3>
      <p style={{ fontSize: 11, color: "#64748B", marginBottom: 12 }}>Gallon of milk, dozen eggs, gallon of gas, and loaf of bread — all in 2024 dollars</p>

      {/* Everyday items — forced 2x2 grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 24 }}>
        <ItemChart itemKey="milk" height={220} yFormatter={fmtDollar} />
        <ItemChart itemKey="eggs" height={220} yFormatter={fmtDollar} />
        <ItemChart itemKey="gas" height={220} yFormatter={fmtDollar} />
        <ItemChart itemKey="bread" height={220} yFormatter={fmtDollar} />
      </div>

      {/* Era Detail Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {costOfLivingData.map(d => (
          <EraCard key={d.year} d={d} />
        ))}
      </div>

      <p style={{ fontSize: 11, color: "#64748B", textAlign: "center", marginTop: 16, fontStyle: "italic" }}>
        Sources: BLS CPI-U (inflation adjustment), Census Bureau (housing), EIA (gasoline), USDA (food), NCES (tuition), BLS (income).
      </p>
    </section>
  );
}
