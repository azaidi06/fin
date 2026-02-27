import { sharedConflicts } from "../data/warData";

export default function ComparisonPanel() {
  return (
    <section className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
      <h2 className="text-xl font-semibold text-slate-100 mb-1">NASDAQ vs. S&P 500 Comparison</h2>
      <p className="text-sm text-slate-500 mb-4">Side-by-side metrics for conflicts where both indices have data</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sharedConflicts.map((d) => (
          <div key={d.conflict} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <h3 className="font-semibold text-slate-200 text-sm mb-3">{d.label}</h3>

            <div className="space-y-3 text-sm">
              {/* Decline comparison */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Max Decline</p>
                <div className="flex justify-between">
                  <span className="text-indigo-400">S&P: -{d.spDecline}%</span>
                  <span className="text-emerald-400">NQ: -{d.nqDecline}%</span>
                </div>
                <div className="mt-1.5 flex gap-1 h-2 rounded overflow-hidden">
                  <div className="bg-indigo-500 rounded" style={{ width: `${(d.spDecline / 25) * 100}%` }} />
                  <div className="bg-emerald-500 rounded" style={{ width: `${(d.nqDecline / 25) * 100}%` }} />
                </div>
              </div>

              {/* Speed comparison */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Days to Bottom</p>
                <div className="flex justify-between text-slate-300">
                  <span>S&P: {d.spDaysToBottom}d</span>
                  <span>NQ: {d.nqDaysToBottom}d</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Days to Recover</p>
                <div className="flex justify-between text-slate-300">
                  <span>S&P: {d.spDaysToRecover}d</span>
                  <span>NQ: {d.nqDaysToRecover}d</span>
                </div>
              </div>

              {/* Ratio badge */}
              <div className="pt-1 border-t border-slate-700">
                <span className="text-xs text-slate-500">NASDAQ / S&P decline ratio: </span>
                <span className={`text-xs font-semibold ${parseFloat(d.ratio) > 1 ? "text-red-400" : "text-emerald-400"}`}>
                  {d.ratio}x
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
