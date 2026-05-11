import SourceLink from "./SourceLink";

import { useTheme } from '../theme/ThemeContext';
const card = { background: 'var(--c-panel)', border: "1px solid #334155", borderRadius: 12, padding: 20 };
const th = { textAlign: "left", padding: "8px 12px", color: 'var(--c-text-low)', fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #334155" };
const td = { padding: "8px 12px", color: 'var(--c-text-mid)', fontSize: 13, borderBottom: "1px solid #1E293B" };
const stripYear = (s) => s.replace(/, \d{4}\)/, ")").replace(/ \(\d{4}\)/, "");

export default function DataTable({ title, color, data, sourceKey }) {
  const t = useTheme().tokens;
  return (
    <div style={card}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: t.textHigh, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block" }} />
        {title}
      </h3>
      <div style={{ overflowX: "auto" }}>
        <table className="num" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Conflict</th>
              <th style={th}>Date</th>
              <th style={th}>Decline</th>
              <th style={th}>Days Down</th>
              <th style={th}>Days to Recover</th>
              <th style={th}>Source</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.conflict} style={{ transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = t.border}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={td}>{stripYear(d.label)}</td>
                <td style={{ ...td, color: t.textMute }}>{d.date}</td>
                <td style={{ ...td, color: t.red, fontWeight: 600 }}>-{d.decline}%</td>
                <td style={td}>{d.daysToBottom}</td>
                <td style={td}>{d.daysToRecover}</td>
                <td style={td}><SourceLink sourceKey={sourceKey} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
