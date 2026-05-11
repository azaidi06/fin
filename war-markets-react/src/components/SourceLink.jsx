import { sourceUrls, sourceLabels, globalIndexSourceUrls } from "../data/warData";

import { useTheme } from '../theme/ThemeContext';
const linkStyle = {
  fontSize: 10,
  color: 'var(--c-text-low)',
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: 3,
  transition: "color 0.15s",
};

export default function SourceLink({ sourceKey, indexId, style }) {
  const t = useTheme().tokens;
  const url = indexId ? globalIndexSourceUrls[indexId] : sourceUrls[sourceKey];
  const label = indexId ? `Yahoo Finance ${indexId}` : sourceLabels[sourceKey];
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ ...linkStyle, ...style }}
      onMouseEnter={e => e.currentTarget.style.color = t.textMute}
      onMouseLeave={e => e.currentTarget.style.color = t.textLow}
    >
      Source: {label} ↗
    </a>
  );
}

export function TooltipSourceLink({ sourceKey, indexId }) {
  const t = useTheme().tokens;
  const url = indexId ? globalIndexSourceUrls[indexId] : sourceUrls[sourceKey];
  const label = indexId ? `Yahoo Finance ${indexId}` : sourceLabels[sourceKey];
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ fontSize: 10, color: t.textLow, textDecoration: "none", display: "block", marginTop: 6, paddingTop: 6, borderTop: "1px solid #475569" }}
      onMouseEnter={e => e.currentTarget.style.color = t.textMute}
      onMouseLeave={e => e.currentTarget.style.color = t.textLow}
    >
      Source: {label} ↗
    </a>
  );
}

export function MultiSourceTooltip({ sourceKeys }) {
  const t = useTheme().tokens;
  if (!sourceKeys?.length) return null;
  return (
    <div style={{ marginTop: 6, paddingTop: 6, borderTop: "1px solid #475569" }}>
      {sourceKeys.map(key => {
        const url = sourceUrls[key];
        const label = sourceLabels[key];
        if (!url) return null;
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 10, color: t.textLow, textDecoration: "none", display: "block", marginBottom: 1 }}
            onMouseEnter={e => e.currentTarget.style.color = t.textMute}
            onMouseLeave={e => e.currentTarget.style.color = t.textLow}
          >
            {label} ↗
          </a>
        );
      })}
    </div>
  );
}
