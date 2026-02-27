import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, LabelList,
} from "recharts";
import { combinedData } from "../data/warData";

const card = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };

const CAP = 250; // clamp axis here so WWII doesn't squash everything

// Transform data — keep real values for tooltips, clamp display values
const timelineData = combinedData.map(d => ({
  label: d.label,
  spBottom: d.spDaysToBottom,
  spRecover: d.spDaysToRecover,
  nqBottom: d.nqDaysToBottom,
  nqRecover: d.nqDaysToRecover,
  // Clamped values for bar rendering
  spBottomCapped: d.spDaysToBottom != null ? Math.min(d.spDaysToBottom, CAP) : null,
  spRecoverCapped: d.spDaysToRecover != null ? Math.min(d.spDaysToRecover, CAP) : null,
  nqBottomCapped: d.nqDaysToBottom != null ? Math.min(d.nqDaysToBottom, CAP) : null,
  nqRecoverCapped: d.nqDaysToRecover != null ? Math.min(d.nqDaysToRecover, CAP) : null,
}));

const realKeys = { spBottomCapped: "spBottom", spRecoverCapped: "spRecover", nqBottomCapped: "nqBottom", nqRecoverCapped: "nqRecover" };
const names = {
  spBottomCapped: "S&P Days to Bottom",
  spRecoverCapped: "S&P Days to Recover",
  nqBottomCapped: "NQ Days to Bottom",
  nqRecoverCapped: "NQ Days to Recover",
};
const colors = {
  spBottomCapped: "#F59E0B",
  spRecoverCapped: "#6366F1",
  nqBottomCapped: "#FBBF24",
  nqRecoverCapped: "#10B981",
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const row = timelineData.find(d => d.label === label);
  return (
    <div style={{ background: "#334155", border: "1px solid #475569", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#F8FAFC", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
      <p style={{ fontWeight: 600, marginBottom: 6 }}>{label}</p>
      {payload.map(p => {
        if (p.value == null) return null;
        const realKey = realKeys[p.dataKey];
        const realVal = row ? row[realKey] : p.value;
        return (
          <p key={p.dataKey} style={{ color: colors[p.dataKey] || p.color, margin: "2px 0" }}>
            {names[p.dataKey] || p.name}: <strong>{realVal}d</strong>
          </p>
        );
      })}
    </div>
  );
}

// Custom label that shows real value when bar is capped
function OverflowLabel({ x, y, width, height, value, index, dataKey }) {
  const row = timelineData[index];
  const realKey = realKeys[dataKey];
  const realVal = row ? row[realKey] : value;
  if (realVal == null || realVal <= CAP) return null;
  return (
    <text x={x + width + 4} y={y + height / 2} dy="0.35em" fill="#94A3B8" fontSize={11} fontWeight={600} fontStyle="italic">
      {realVal}d →
    </text>
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
        <BarChart data={timelineData} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.25} horizontal={false} />
          <XAxis type="number" domain={[0, CAP]} tickFormatter={(v) => `${v}d`} stroke="#475569"
            tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false}
            label={{ value: "Trading Days", position: "insideBottom", offset: -2, fill: "#94A3B8", fontSize: 12 }} />
          <YAxis type="category" dataKey="label" width={185} stroke="#475569"
            tick={{ fill: "#CBD5E1", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
          <Legend wrapperStyle={{ fontSize: 12, color: "#CBD5E1", paddingTop: 8 }} iconType="square" iconSize={10} />
          <Bar dataKey="spBottomCapped" name="S&P Bottom" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={10}>
            <LabelList content={<OverflowLabel dataKey="spBottomCapped" />} />
          </Bar>
          <Bar dataKey="spRecoverCapped" name="S&P Recover" fill="#6366F1" radius={[0, 4, 4, 0]} barSize={10}>
            <LabelList content={<OverflowLabel dataKey="spRecoverCapped" />} />
          </Bar>
          <Bar dataKey="nqBottomCapped" name="NQ Bottom" fill="#FBBF24" radius={[0, 4, 4, 0]} barSize={10} fillOpacity={0.7}>
            <LabelList content={<OverflowLabel dataKey="nqBottomCapped" />} />
          </Bar>
          <Bar dataKey="nqRecoverCapped" name="NQ Recover" fill="#10B981" radius={[0, 4, 4, 0]} barSize={10}>
            <LabelList content={<OverflowLabel dataKey="nqRecoverCapped" />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p style={{ fontSize: 11, color: "#64748B", textAlign: "center", marginTop: 4, fontStyle: "italic" }}>
        Axis capped at {CAP} days. WWII recovery (917 days) annotated on chart.
      </p>
    </section>
  );
}
