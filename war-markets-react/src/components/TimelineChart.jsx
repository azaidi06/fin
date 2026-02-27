import {
  ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ZAxis,
} from "recharts";
import { combinedData } from "../data/warData";

// Reshape data for the scatter plot
const bottomData = combinedData.map(d => ({
  label: d.label,
  conflict: d.conflict,
  spDays: d.spDaysToBottom,
  nqDays: d.nqDaysToBottom,
}));

const recoverData = combinedData.map(d => ({
  label: d.label,
  conflict: d.conflict,
  spDays: d.spDaysToRecover,
  nqDays: d.nqDaysToRecover,
}));

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-sm shadow-xl">
      <p className="font-semibold text-slate-100 mb-1">{d.label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color || p.fill }}>
          {p.name}: {p.value} days
        </p>
      ))}
    </div>
  );
}

// Custom shape for dumbbell rows
function DumbbellRow({ data }) {
  return (
    <div className="space-y-3">
      {data.map((d) => {
        const maxVal = Math.max(d.spDaysToRecover, d.nqDaysToRecover || 0);
        const scale = (v) => (v / 950) * 100; // Scale to percentage of container width
        return (
          <div key={d.conflict} className="flex items-center gap-4">
            <div className="w-44 text-sm text-slate-300 text-right shrink-0">{d.label}</div>
            <div className="relative flex-1 h-12">
              {/* S&P line */}
              <div className="absolute top-3 h-0.5 bg-slate-500"
                style={{ left: `${scale(d.spDaysToBottom)}%`, width: `${scale(d.spDaysToRecover - d.spDaysToBottom)}%` }} />
              {/* S&P bottom dot */}
              <div className="absolute top-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-slate-800"
                style={{ left: `calc(${scale(d.spDaysToBottom)}% - 8px)` }}
                title={`S&P Days to bottom: ${d.spDaysToBottom}`} />
              {/* S&P recover dot */}
              <div className="absolute top-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-800"
                style={{ left: `calc(${scale(d.spDaysToRecover)}% - 8px)` }}
                title={`S&P Days to recover: ${d.spDaysToRecover}`} />

              {d.nqDaysToBottom != null && (
                <>
                  {/* NASDAQ line (dashed) */}
                  <div className="absolute top-8 h-0.5 border-t-2 border-dashed border-slate-500"
                    style={{ left: `${scale(d.nqDaysToBottom)}%`, width: `${scale(d.nqDaysToRecover - d.nqDaysToBottom)}%` }} />
                  <div className="absolute top-6 w-3 h-3 rounded-full bg-amber-500/80 border-2 border-slate-800"
                    style={{ left: `calc(${scale(d.nqDaysToBottom)}% - 6px)` }}
                    title={`NASDAQ Days to bottom: ${d.nqDaysToBottom}`} />
                  <div className="absolute top-6 w-3 h-3 rounded-full bg-emerald-500/80 border-2 border-slate-800"
                    style={{ left: `calc(${scale(d.nqDaysToRecover)}% - 6px)` }}
                    title={`NASDAQ Days to recover: ${d.nqDaysToRecover}`} />
                </>
              )}

              {/* WWII annotation */}
              {d.conflict === "WWII" && (
                <span className="absolute top-0 text-xs text-slate-500 italic"
                  style={{ left: `calc(${scale(d.spDaysToRecover)}% + 12px)` }}>
                  917d (~2.5 yrs)
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function TimelineChart() {
  return (
    <section className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
      <h2 className="text-xl font-semibold text-slate-100 mb-1">Speed of Decline vs. Recovery</h2>
      <p className="text-sm text-slate-500 mb-2">Trading days from conflict start to market bottom, and from bottom back to pre-war level</p>
      <div className="flex flex-wrap gap-4 justify-center mb-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Days to bottom</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Days to recover</span>
        <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-slate-400 inline-block" /> S&P 500</span>
        <span className="flex items-center gap-1.5"><span className="w-4 border-t-2 border-dashed border-slate-400 inline-block" /> NASDAQ</span>
      </div>

      {/* Scale bar */}
      <div className="flex items-center gap-4 mb-2 ml-48">
        <div className="flex-1 relative h-6">
          {[0, 100, 200, 300, 500, 700, 900].map(v => (
            <span key={v} className="absolute text-xs text-slate-600 -translate-x-1/2"
              style={{ left: `${(v / 950) * 100}%`, top: 0 }}>{v}d</span>
          ))}
        </div>
      </div>

      <DumbbellRow data={combinedData} />
    </section>
  );
}
