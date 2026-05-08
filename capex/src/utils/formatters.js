/**
 * Formatting utilities for capex dashboard.
 * All functions are safe with null/undefined input.
 */

/**
 * Compact number formatter — turns 1234 → "1.23K", 1_500_000 → "1.50M",
 * 1_200_000_000 → "1.20B". Adds optional `$` prefix for currency.
 */
export function formatCompactNumber(value, { prefix = "", digits = 1 } = {}) {
  if (value == null || isNaN(value)) return "—";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e12) return `${sign}${prefix}${(abs / 1e12).toFixed(digits)}T`;
  if (abs >= 1e9) return `${sign}${prefix}${(abs / 1e9).toFixed(digits)}B`;
  if (abs >= 1e6) return `${sign}${prefix}${(abs / 1e6).toFixed(digits)}M`;
  if (abs >= 1e3) return `${sign}${prefix}${(abs / 1e3).toFixed(digits)}K`;
  return `${sign}${prefix}${abs.toFixed(digits)}`;
}

/**
 * Percent formatter — 8.5 → "+8.5%", -2.1 → "-2.1%".
 * Pass `signed: false` to suppress leading "+".
 */
export function formatPercent(value, { digits = 1, signed = true } = {}) {
  if (value == null || isNaN(value)) return "—";
  const sign = value >= 0 ? (signed ? "+" : "") : "-";
  return `${sign}${Math.abs(value).toFixed(digits)}%`;
}

/**
 * Currency formatter — accepts either raw dollar value (12_300_000_000)
 * or a "billions" value (12.3) via `unit: "B"`.
 */
export function formatCurrency(value, { unit = "raw", digits = 1 } = {}) {
  if (value == null || isNaN(value)) return "—";
  if (unit === "B") {
    return `$${value.toFixed(digits)}B`;
  }
  return formatCompactNumber(value, { prefix: "$", digits });
}

/**
 * Date formatter — ISO string or Date object → "Apr 28, 2026".
 */
export function formatDate(value, { style = "medium" } = {}) {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return "—";
  if (style === "short") {
    return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" });
  }
  if (style === "long") {
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
