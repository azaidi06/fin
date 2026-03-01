import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import { sp500Data, nasdaqData } from "../data/warData";
import { MultiSourceTooltip } from "./SourceLink";
import { useEventToggle } from "../context/EventToggleContext";

const card = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#334155", border: "1px solid #475569", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#F8FAFC", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map((p) => p.value != null && (
        <p key={p.dataKey} style={{ color: p.color, margin: "2px 0" }}>
          {p.name}: <strong>-{p.value}%</strong>
        </p>
      ))}
      <MultiSourceTooltip sourceKeys={["sp500", "nasdaq"]} />
    </div>
  );
}

export default function DrawdownChart() {
  const { filterData } = useEventToggle();

  const combinedData = useMemo(() => {
    const filtered500 = filterData(sp500Data);
    const filteredNQ = filterData(nasdaqData);
    return filtered500.map(sp => {
      const nq = filteredNQ.find(n => n.conflict === sp.conflict);
      return {
        conflict: sp.conflict,
        label: sp.label,
        date: sp.date,
        spDecline: sp.decline,
        nqDecline: nq ? nq.decline : null,
        spDaysToBottom: sp.daysToBottom,
        nqDaysToBottom: nq ? nq.daysToBottom : null,
        spDaysToRecover: sp.daysToRecover,
        nqDaysToRecover: nq ? nq.daysToRecover : null,
      };
    });
  }, [filterData]);

  return (
    <section style={card}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#F8FAFC", marginBottom: 4 }}>Maximum Drawdown by Conflict</h2>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20 }}>Peak-to-trough decline from the pre-war close</p>
      <ResponsiveContainer width="100%" height={Math.max(combinedData.length * 55, 300)}>
        <BarChart data={combinedData} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.25} horizontal={false} />
          <XAxis type="number" tickFormatter={(v) => `${v}%`} stroke="#475569"
            tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="label" width={185} stroke="#475569"
            tick={{ fill: "#CBD5E1", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} wrapperStyle={{ pointerEvents: "auto" }} />
          <Legend wrapperStyle={{ fontSize: 12, color: "#CBD5E1", paddingTop: 8 }} iconType="square" iconSize={10} />
          <Bar dataKey="spDecline" name="S&P 500" fill="#6366F1" radius={[0, 5, 5, 0]} barSize={14} />
          <Bar dataKey="nqDecline" name="NASDAQ" fill="#10B981" radius={[0, 5, 5, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
