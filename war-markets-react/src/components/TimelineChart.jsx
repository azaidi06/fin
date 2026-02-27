import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import { combinedData } from "../data/warData";

const card = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };

// Transform data for a grouped bar chart: days to bottom + days to recover per conflict
const timelineData = combinedData.map(d => ({
  label: d.label,
  spBottom: d.spDaysToBottom,
  spRecover: d.spDaysToRecover,
  nqBottom: d.nqDaysToBottom,
  nqRecover: d.nqDaysToRecover,
}));

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const names = {
    spBottom: "S&P Days to Bottom",
    spRecover: "S&P Days to Recover",
    nqBottom: "NQ Days to Bottom",
    nqRecover: "NQ Days to Recover",
  };
  const colors = {
    spBottom: "#F59E0B",
    spRecover: "#6366F1",
    nqBottom: "#FBBF24",
    nqRecover: "#10B981",
  };
  return (
    <div style={{ background: "#334155", border: "1px solid #475569", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#F8FAFC", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
      <p style={{ fontWeight: 600, marginBottom: 6 }}>{label}</p>
      {payload.map(p => p.value != null && (
        <p key={p.dataKey} style={{ color: colors[p.dataKey] || p.color, margin: "2px 0" }}>
          {names[p.dataKey] || p.name}: <strong>{p.value}d</strong>
        </p>
      ))}
    </div>
  );
}

export default function TimelineChart() {
  return (
    <section style={card}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#F8FAFC", marginBottom: 4 }}>Speed of Decline vs. Recovery</h2>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20 }}>
        Trading days from conflict start to market bottom, and from bottom back to pre-war level
      </p>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={timelineData} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.25} horizontal={false} />
          <XAxis type="number" tickFormatter={(v) => `${v}d`} stroke="#475569"
            tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false}
            label={{ value: "Trading Days", position: "insideBottom", offset: -2, fill: "#94A3B8", fontSize: 12 }} />
          <YAxis type="category" dataKey="label" width={185} stroke="#475569"
            tick={{ fill: "#CBD5E1", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
          <Legend wrapperStyle={{ fontSize: 12, color: "#CBD5E1", paddingTop: 8 }} iconType="square" iconSize={10} />
          <Bar dataKey="spBottom" name="S&P Bottom" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={10} />
          <Bar dataKey="spRecover" name="S&P Recover" fill="#6366F1" radius={[0, 4, 4, 0]} barSize={10} />
          <Bar dataKey="nqBottom" name="NQ Bottom" fill="#FBBF24" radius={[0, 4, 4, 0]} barSize={10} fillOpacity={0.7} />
          <Bar dataKey="nqRecover" name="NQ Recover" fill="#10B981" radius={[0, 4, 4, 0]} barSize={10} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
