import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import {
  costItemColors, costOfLivingData, bigPurchaseChartData, everydayChartData,
} from "../data/warData";

const card = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };
const innerCard = { background: "#0F172A", border: "1px solid #334155", borderRadius: 10, padding: 20, marginBottom: 24 };

const fmtUsd = (v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v.toFixed(2)}`;
const fmtNominal = (v) => v >= 100 ? `$${v.toLocaleString()}` : `$${v.toFixed(2)}`;

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#334155", border: "1px solid #475569", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#F8FAFC", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", maxWidth: 260 }}>
      <p style={{ fontWeight: 600, marginBottom: 6 }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color, margin: "2px 0" }}>
          {p.dataKey}: <strong>{fmtUsd(p.value)}</strong>
        </p>
      ))}
    </div>
  );
}

const itemLabels = {
  home: "Median Home",
  car: "New Car",
  tuition: "College Tuition",
  income: "Avg. Annual Income",
  milk: "Gallon of Milk",
  eggs: "Dozen Eggs",
  gas: "Gallon of Gas",
  bread: "Loaf of Bread",
};

const itemColorKeys = {
  home: "Home", car: "Car", tuition: "Tuition", income: "Income",
  milk: "Milk", eggs: "Eggs", gas: "Gas", bread: "Bread",
};

function EraCard({ d }) {
  const allItems = Object.entries(d.items);
  return (
    <div style={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 10, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h3 style={{ fontWeight: 600, color: "#E2E8F0", fontSize: 14 }}>
          {d.era} <span style={{ color: "#64748B", fontWeight: 400 }}>({d.year})</span>
        </h3>
        <span style={{ fontSize: 10, color: "#94A3B8", background: "#1E293B", border: "1px solid #334155", borderRadius: 6, padding: "2px 8px" }}>
          CPI ×{d.cpiMultiplier}
        </span>
      </div>

      {allItems.map(([key, val]) => {
        const colorKey = itemColorKeys[key];
        const color = costItemColors[colorKey];
        return (
          <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid #1E293B" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#CBD5E1", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{itemLabels[key]}</span>
            </div>
            <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
              <span style={{ fontSize: 11, color: "#64748B", minWidth: 60, textAlign: "right" }}>{fmtNominal(val.nominal)}</span>
              <span style={{ fontSize: 11, color: "#F8FAFC", fontWeight: 600, minWidth: 70, textAlign: "right" }}>{fmtUsd(val.adjusted)}</span>
            </div>
          </div>
        );
      })}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        <span></span>
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ minWidth: 60, textAlign: "right" }}>Nominal</span>
          <span style={{ minWidth: 70, textAlign: "right" }}>2024 USD</span>
        </div>
      </div>
    </div>
  );
}

export default function CostOfLivingPanel() {
  const bigItems = ["Home", "Car", "Tuition", "Income"];
  const evItems = ["Milk", "Eggs", "Gas", "Bread"];

  return (
    <section style={card}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#F8FAFC", marginBottom: 4 }}>Cost of Living</h2>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>
        What everyday goods and big-ticket items cost during each conflict era — all prices adjusted to 2024 USD using CPI-U multipliers
      </p>

      {/* Big Purchases BarChart */}
      <div style={innerCard}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#E2E8F0", marginBottom: 4 }}>Big Purchases</h3>
        <p style={{ fontSize: 11, color: "#64748B", marginBottom: 16 }}>Median home, new car, college tuition, and average annual income — all in 2024 dollars</p>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={bigPurchaseChartData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.25} />
            <XAxis
              dataKey="era" stroke="#475569"
              tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false}
            />
            <YAxis
              stroke="#475569"
              tickFormatter={v => `$${v / 1000}K`}
              tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false}
              label={{ value: "2024 USD ($K)", angle: -90, position: "insideLeft", offset: -2, style: { fill: "#64748B", fontSize: 11 } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "#CBD5E1", paddingTop: 8 }}
              iconType="square" iconSize={10}
            />
            {bigItems.map(item => (
              <Bar
                key={item} dataKey={item} fill={costItemColors[item]}
                radius={[4, 4, 0, 0]} barSize={12}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Everyday Items BarChart */}
      <div style={innerCard}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#E2E8F0", marginBottom: 4 }}>Everyday Items</h3>
        <p style={{ fontSize: 11, color: "#64748B", marginBottom: 16 }}>Gallon of milk, dozen eggs, gallon of gas, and loaf of bread — all in 2024 dollars</p>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={everydayChartData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.25} />
            <XAxis
              dataKey="era" stroke="#475569"
              tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false}
            />
            <YAxis
              stroke="#475569"
              tickFormatter={v => `$${v.toFixed(0)}`}
              tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false}
              label={{ value: "2024 USD ($)", angle: -90, position: "insideLeft", offset: -2, style: { fill: "#64748B", fontSize: 11 } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "#CBD5E1", paddingTop: 8 }}
              iconType="square" iconSize={10}
            />
            {evItems.map(item => (
              <Bar
                key={item} dataKey={item} fill={costItemColors[item]}
                radius={[4, 4, 0, 0]} barSize={12}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
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
