// ── Number / value formatters (shared shape with options_dashboard) ──

export function formatCompactNumber(value, { digits = 1 } = {}) {
  if (value == null || Number.isNaN(value)) return "—";
  const abs = Math.abs(value);
  if (abs >= 1e12) return `${(value / 1e12).toFixed(digits)}T`;
  if (abs >= 1e9) return `${(value / 1e9).toFixed(digits)}B`;
  if (abs >= 1e6) return `${(value / 1e6).toFixed(digits)}M`;
  if (abs >= 1e3) return `${(value / 1e3).toFixed(digits)}K`;
  return Number(value).toFixed(abs < 1 ? Math.max(digits, 2) : 0);
}

export function formatPercent(value, { digits = 1, withSign = false } = {}) {
  if (value == null || Number.isNaN(value)) return "—";
  const sign = withSign && value > 0 ? "+" : "";
  return `${sign}${Number(value).toFixed(digits)}%`;
}

export function formatCurrency(value, { digits, compact = false } = {}) {
  if (value == null || Number.isNaN(value)) return "—";
  if (compact) return `$${formatCompactNumber(value, { digits: digits ?? 1 })}`;
  const abs = Math.abs(value);
  const d = digits ?? (abs >= 1000 ? 0 : abs >= 1 ? 2 : 4);
  return `$${Number(value).toLocaleString(undefined, {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  })}`;
}

export function formatDate(value, { style = "medium" } = {}) {
  if (value == null) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  if (style === "year") return String(d.getUTCFullYear());
  if (style === "short") {
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }
  if (style === "long") {
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
