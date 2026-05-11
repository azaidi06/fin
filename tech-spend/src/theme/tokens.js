/**
 * Theme tokens for the tech-spend dashboard.
 * Dark (default) + light palettes. Use `useTheme().tokens` in components.
 * Per-company brand colors stay constant across themes so a given ticker
 * reads the same hue in either mode.
 */

const companies = {
  MSFT: "#00A4EF",
  GOOGL: "#4285F4",
  AMZN: "#FF9900",
  META: "#0668E1",
  AAPL: "#A2AAAD",
  NVDA: "#76B900",
  ORCL: "#F80000",
  TSLA: "#CC0000",
};

export const darkColors = {
  bg: "#0F172A",
  panel: "#1E293B",
  panelMuted: "#334155",
  panelGlass: "rgba(30, 41, 59, 0.5)",
  border: "#334155",
  borderSoft: "rgba(255, 255, 255, 0.06)",

  text: "#F8FAFC",
  textSubtle: "#CBD5E1",
  textMuted: "#94A3B8",
  textFaint: "#64748B",
  textGhost: "#475569",

  indigo: "#6366F1",
  indigoLight: "#818CF8",
  indigoSoft: "#A5B4FC",
  violet: "#8B5CF6",

  success: "#34D399",
  danger: "#EF4444",
  warning: "#F59E0B",
  info: "#06B6D4",

  axis: "rgba(255,255,255,0.1)",
  grid: "rgba(255,255,255,0.06)",
  tooltipBg: "rgba(15, 23, 42, 0.95)",
  tooltipBorder: "rgba(255,255,255,0.1)",
  dotStroke: "#0F172A",

  companies,
};

export const lightColors = {
  bg: "#F5F5F4",
  panel: "#FAFAF9",
  panelMuted: "#E7E5E4",
  panelGlass: "rgba(255, 255, 255, 0.85)",
  border: "#D6D3D1",
  borderSoft: "rgba(28, 25, 23, 0.10)",

  text: "#1C1917",
  textSubtle: "#44403C",
  textMuted: "#57534E",
  textFaint: "#78716C",
  textGhost: "#A8A29E",

  indigo: "#4F46E5",
  indigoLight: "#4338CA",
  indigoSoft: "#4338CA",
  violet: "#6D28D9",

  success: "#047857",
  danger: "#DC2626",
  warning: "#B45309",
  info: "#0891B2",

  axis: "rgba(28,25,23,0.18)",
  grid: "rgba(28,25,23,0.10)",
  tooltipBg: "rgba(255, 255, 255, 0.96)",
  tooltipBorder: "rgba(28,25,23,0.12)",
  dotStroke: "#FFFFFF",

  companies,
};

export const TOKENS_BY_THEME = { dark: darkColors, light: lightColors };

/**
 * Legacy export — kept so modules that still `import { colors } from "../theme/tokens"`
 * continue to compile. Mirrors the dark palette. Prefer `useTheme().tokens` in new code.
 */
export const colors = darkColors;

export function companyColor(ticker, fallback) {
  return companies[ticker] || fallback || darkColors.indigoLight;
}

export const gradients = {
  headlineTotal: "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.10))",
  headlineTop: "linear-gradient(135deg, rgba(255,153,0,0.18), rgba(244,114,182,0.08))",
  headlineGrowth: "linear-gradient(135deg, rgba(52,211,153,0.18), rgba(99,102,241,0.10))",
};
