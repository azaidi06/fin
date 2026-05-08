// ── Shared theme tokens for war-markets-react ──
// Single source of truth for the color/typography palette.
// Wars get a fixed semantic color used across every chart so a
// given conflict reads the same hue regardless of which view you're in.

export const colors = {
  // Page chrome
  bg: "#0F172A",
  panel: "#1E293B",
  panelInset: "#0F172A",
  border: "#334155",
  borderSoft: "#1E293B",

  // Three-step text ramp (slate-50 → slate-400 → slate-500)
  text: {
    high: "#F8FAFC",
    mid: "#94A3B8",
    low: "#64748B",
  },

  // Accent ramps
  indigo: "#6366F1",
  indigoSoft: "#A5B4FC",
  violet: "#8B5CF6",
  green: "#34D399",
  red: "#EF4444",

  // ── Semantic war / conflict palette ──
  // One color per conflict, used everywhere. Hues are spaced so no two
  // wars sit in the same red/orange family. The legacy keys (Cuban Missile,
  // Oil Embargo, Black Monday, 2008 Crisis, COVID, Russia-Ukraine, Iran)
  // are also exported so existing data files continue to resolve.
  wars: {
    "WWI": "#A78BFA",            // soft violet
    "WWII": "#EF4444",           // red
    "Korea": "#F59E0B",          // amber
    "Vietnam": "#10B981",        // emerald
    "Cuban Missile": "#84CC16",  // lime
    "Oil Embargo": "#F97316",    // orange
    "Black Monday": "#A855F7",   // purple
    "GulfWar": "#6366F1",        // indigo
    "Gulf War": "#6366F1",       // indigo (legacy key)
    "9/11": "#EC4899",           // pink
    "Afghanistan": "#F472B6",    // rose-pink
    "Iraq": "#3B82F6",           // blue
    "2008 Crisis": "#14B8A6",    // teal
    "COVID": "#06B6D4",          // cyan
    "Ukraine": "#E11D48",        // crimson
    "Russia-Ukraine": "#E11D48", // crimson (legacy key)
    "Iran": "#FBBF24",           // gold
  },
};

// Helper: resolve a war color with a sensible fallback.
export function warColor(key) {
  return colors.wars[key] || colors.text.mid;
}

// Common typography rhythm — used across StatCard / table headers.
export const type = {
  eyebrow: {
    fontSize: 11,
    fontWeight: 600,
    color: colors.text.mid,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  metric: {
    fontSize: 36,
    fontWeight: 700,
    lineHeight: 1,
  },
  metricLg: {
    fontSize: 40,
    fontWeight: 700,
    lineHeight: 1,
  },
};
