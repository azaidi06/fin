/**
 * Brand tokens for the capex dashboard.
 * Single source of truth for colors, gradients, and per-company palette.
 */

export const colors = {
  // Surfaces
  bg: "#0F172A",
  panel: "#1E293B",
  panelMuted: "#334155",

  // Text ramps
  text: "#F8FAFC",
  textSubtle: "#CBD5E1",
  textMuted: "#94A3B8",
  textFaint: "#64748B",
  textGhost: "#475569",

  // Brand accents
  indigo: "#6366F1",
  indigoLight: "#818CF8",
  indigoSoft: "#A5B4FC",
  violet: "#8B5CF6",

  // Status
  success: "#34D399",
  danger: "#EF4444",
  warning: "#F59E0B",
  info: "#06B6D4",

  // Per-company brand palette (used across overview, sparklines, charts, tables)
  companies: {
    MSFT: "#00A4EF",   // Microsoft cyan
    GOOGL: "#4285F4",  // Google blue
    AMZN: "#FF9900",   // Amazon orange
    META: "#0668E1",   // Meta blue
    AAPL: "#A2AAAD",   // Apple silver
    NVDA: "#76B900",   // NVIDIA green
    ORCL: "#F80000",   // Oracle red
    TSLA: "#CC0000",   // Tesla red
  },
};

/**
 * Get a company brand color, with a fallback if the ticker isn't in the map.
 */
export function companyColor(ticker, fallback = colors.indigoLight) {
  return colors.companies[ticker] || fallback;
}

export const gradients = {
  headlineTotal: "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.10))",
  headlineTop: "linear-gradient(135deg, rgba(255,153,0,0.18), rgba(244,114,182,0.08))",
  headlineGrowth: "linear-gradient(135deg, rgba(52,211,153,0.18), rgba(99,102,241,0.10))",
};
