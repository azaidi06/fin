import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
} from "recharts";
import { combinedData } from "../data/warData";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-sm shadow-xl">
      <p className="font-semibold text-slate-100 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: -{p.value}%
        </p>
      ))}
    </div>
  );
}

export default function DrawdownChart() {
  return (
    <section className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
      <h2 className="text-xl font-semibold text-slate-100 mb-1">Maximum Drawdown by Conflict</h2>
      <p className="text-sm text-slate-500 mb-4">Peak-to-trough decline from the pre-war close</p>
      <ResponsiveContainer width="100%" height={380}>
        <BarChart
          data={combinedData}
          layout="vertical"
          margin={{ top: 5, right: 40, left: 30, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v) => `${v}%`}
            stroke="#94A3B8"
            tick={{ fill: "#94A3B8", fontSize: 12 }}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={180}
            stroke="#94A3B8"
            tick={{ fill: "#CBD5E1", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.08)" }} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "#CBD5E1" }}
            iconType="square"
          />
          <Bar dataKey="spDecline" name="S&P 500" fill="#6366F1" radius={[0, 4, 4, 0]} barSize={16} />
          <Bar dataKey="nqDecline" name="NASDAQ" fill="#10B981" radius={[0, 4, 4, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
