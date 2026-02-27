export default function DataTable({ title, color, data }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
      <h3 className="text-base font-semibold text-slate-100 mb-4 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: color }} />
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-2 px-3 text-xs text-slate-500 uppercase tracking-wide font-medium">Conflict</th>
              <th className="text-left py-2 px-3 text-xs text-slate-500 uppercase tracking-wide font-medium">Date</th>
              <th className="text-left py-2 px-3 text-xs text-slate-500 uppercase tracking-wide font-medium">Decline</th>
              <th className="text-left py-2 px-3 text-xs text-slate-500 uppercase tracking-wide font-medium">Days Down</th>
              <th className="text-left py-2 px-3 text-xs text-slate-500 uppercase tracking-wide font-medium">Days Recover</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.conflict} className="border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors">
                <td className="py-2 px-3 text-slate-300">{d.label}</td>
                <td className="py-2 px-3 text-slate-400">{d.date}</td>
                <td className="py-2 px-3 text-red-400 font-semibold">-{d.decline}%</td>
                <td className="py-2 px-3 text-slate-400">{d.daysToBottom}</td>
                <td className="py-2 px-3 text-slate-400">{d.daysToRecover}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
