import { useMemo, useState } from "react";
import { formatPrice, timeAgo, useMarketData } from "./HomePage";

import { useTheme } from '../theme/ThemeContext';
const card = { background: 'var(--c-panel)', border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };
const colHeader = { fontSize: 10, fontWeight: 600, color: 'var(--c-text-low)', textTransform: "uppercase", letterSpacing: "0.05em" };

// ── Lightweight classifier — assets in market-data.json have no `category`
// field, so we derive one from the symbol so the table can group rows. The
// orchestrator can move this to the data layer later.
const CATEGORY_BY_SYMBOL = {
  BTC: "Crypto", ETH: "Crypto", SOL: "Crypto", DOGE: "Crypto", XRP: "Crypto", ADA: "Crypto",
  GOLD: "Commodities", SILVER: "Commodities", OIL: "Commodities", USO: "Commodities", DBC: "Commodities",
  EURUSD: "FX", USDJPY: "FX", GBPUSD: "FX", DXY: "FX",
};

function classify(asset) {
  if (CATEGORY_BY_SYMBOL[asset.symbol]) return CATEGORY_BY_SYMBOL[asset.symbol];
  // Crude heuristic: 6-letter pairs ending in USD / JPY etc. → FX
  if (/^[A-Z]{6}$/.test(asset.symbol)) return "FX";
  // Bitcoin-style ticker fallback
  if (/^[A-Z]{3,4}USDT?$/.test(asset.symbol)) return "Crypto";
  return "Equities";
}

const CATEGORY_ORDER = ["Equities", "Crypto", "Commodities", "FX", "Other"];

const SORT_OPTIONS = [
  { id: "category", label: "Group" },
  { id: "symbol", label: "Symbol" },
  { id: "price", label: "Price" },
  { id: "change1d", label: "1D %" },
  { id: "change7d", label: "7D %" },
];

function ChangePill({ value }) {
  const t = useTheme().tokens;
  if (value == null || value === 0) {
    return (
      <span style={{
        display: "inline-block",
        fontSize: 12,
        fontWeight: 500,
        color: t.axis,
        background: "rgba(71, 85, 105, 0.15)",
        border: "1px solid rgba(71, 85, 105, 0.25)",
        padding: "2px 8px",
        borderRadius: 999,
        minWidth: 60,
        textAlign: "center",
        fontVariantNumeric: "tabular-nums",
      }}>
        —
      </span>
    );
  }
  const up = value >= 0;
  return (
    <span style={{
      display: "inline-block",
      fontSize: 12,
      fontWeight: 600,
      color: up ? t.greenSoft : t.red,
      background: up ? "rgba(52,211,153,0.12)" : "rgba(239,68,68,0.12)",
      border: `1px solid ${up ? "rgba(52,211,153,0.28)" : "rgba(239,68,68,0.28)"}`,
      padding: "2px 8px",
      borderRadius: 999,
      minWidth: 60,
      textAlign: "center",
      fontVariantNumeric: "tabular-nums",
    }}>
      {up ? "+" : ""}{value.toFixed(1)}%
    </span>
  );
}

function SortHeader({ id, label, sortKey, sortDir, onSort, align = "right", width }) {
  const t = useTheme().tokens;
  const active = sortKey === id;
  return (
    <button
      onClick={() => onSort(id)}
      style={{
        ...colHeader,
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: "pointer",
        color: active ? t.indigoFaint : t.textLow,
        textAlign: align,
        width,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: align === "right" ? "flex-end" : "flex-start",
        gap: 4,
        fontFamily: "inherit",
      }}
    >
      <span>{label}</span>
      {active && (
        <span aria-hidden style={{ fontSize: 9 }}>{sortDir === "asc" ? "▲" : "▼"}</span>
      )}
    </button>
  );
}

function AssetRow({ a }) {
  const t = useTheme().tokens;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 12px",
        borderRadius: 10,
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: t.textHigh, width: 64, flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
          {a.symbol}
        </span>
        <span style={{ fontSize: 13, color: t.textLow, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {a.name}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: t.textMid, fontVariantNumeric: "tabular-nums", width: 90, textAlign: "right" }}>
          {formatPrice(a.price)}
        </span>
        <ChangePill value={a.change1d} />
        <ChangePill value={a.change7d} />
      </div>
    </div>
  );
}

export default function LiveMarketsPage() {
  const t = useTheme().tokens;
  const { assets, updatedAt, loading } = useMarketData();
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("category");
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = (id) => {
    if (id === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(id);
      // Pick a sensible default direction per column.
      setSortDir(id === "price" || id === "change1d" || id === "change7d" ? "desc" : "asc");
    }
  };

  // Tag every asset with a category; filter by query string.
  const tagged = useMemo(() => assets.map(a => ({ ...a, category: classify(a) })), [assets]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tagged;
    return tagged.filter(a =>
      a.symbol.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  }, [tagged, query]);

  // When sortKey is "category", we render grouped sections in CATEGORY_ORDER.
  // Otherwise we render a flat sorted table.
  const grouped = useMemo(() => {
    if (sortKey !== "category") return null;
    const buckets = new Map();
    for (const a of filtered) {
      const k = a.category || "Other";
      if (!buckets.has(k)) buckets.set(k, []);
      buckets.get(k).push(a);
    }
    // Sort each bucket alphabetically by symbol
    for (const list of buckets.values()) {
      list.sort((a, b) => a.symbol.localeCompare(b.symbol));
    }
    // Order buckets by CATEGORY_ORDER (unknown categories go last alphabetically)
    const ordered = [];
    for (const cat of CATEGORY_ORDER) {
      if (buckets.has(cat)) ordered.push([cat, buckets.get(cat)]);
      buckets.delete(cat);
    }
    for (const [cat, list] of [...buckets.entries()].sort()) {
      ordered.push([cat, list]);
    }
    if (sortDir === "desc") ordered.reverse();
    return ordered;
  }, [filtered, sortKey, sortDir]);

  const flat = useMemo(() => {
    if (sortKey === "category") return null;
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const an = av == null ? -Infinity : av;
      const bn = bv == null ? -Infinity : bv;
      if (typeof av === "string" || typeof bv === "string") {
        return sortDir === "asc"
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      }
      return sortDir === "asc" ? an - bn : bn - an;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  return (
    <section style={card}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <span className="live-dot" />
        <h2 style={{ fontSize: 20, fontWeight: 600, color: t.textHigh, margin: 0 }}>Live Markets</h2>
        <span style={{ fontSize: 11, color: t.textLow }}>
          {updatedAt ? timeAgo(updatedAt) : ""}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              style={{ position: "absolute", left: 10, color: t.textLow, pointerEvents: "none" }}
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="20" y1="20" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              placeholder="Search symbol or name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid #334155",
                borderRadius: 8,
                padding: "6px 10px 6px 30px",
                fontSize: 13,
                color: t.textHigh,
                fontFamily: "inherit",
                width: 220,
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 32, opacity: 1 - i * 0.08 }} />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <p style={{ fontSize: 13, color: t.textLow }}>Market data unavailable</p>
      ) : (
        <div className="num" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Column headers (clickable to sort) */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px 6px",
            borderBottom: "1px solid rgba(71, 85, 105, 0.4)",
            marginBottom: 2,
          }}>
            <SortHeader id="symbol" label="Asset" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="left" />
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <SortHeader id="price" label="Price" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} width={90} />
              <SortHeader id="change1d" label="1D %" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} width={60} />
              <SortHeader id="change7d" label="7D %" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} width={60} />
            </div>
          </div>

          {grouped ? (
            grouped.length === 0 ? (
              <p style={{ fontSize: 13, color: t.textLow, padding: 12 }}>No matches.</p>
            ) : (
              grouped.map(([cat, list]) => (
                <div key={cat} style={{ marginTop: 10 }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 12px 6px",
                    borderBottom: "1px solid rgba(71, 85, 105, 0.25)",
                    marginBottom: 4,
                  }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: t.indigoFaint,
                      background: "rgba(99,102,241,0.16)",
                      padding: "2px 8px",
                      borderRadius: 4,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}>
                      {cat}
                    </span>
                    <span style={{ fontSize: 11, color: t.textLow }}>{list.length}</span>
                  </div>
                  {list.map(a => <AssetRow key={a.symbol} a={a} />)}
                </div>
              ))
            )
          ) : flat && flat.length === 0 ? (
            <p style={{ fontSize: 13, color: t.textLow, padding: 12 }}>No matches.</p>
          ) : (
            (flat || []).map(a => <AssetRow key={a.symbol} a={a} />)
          )}
        </div>
      )}

      <p style={{ fontSize: 11, color: t.axis, textAlign: "center", marginTop: 16, marginBottom: 0 }}>
        Prices from Alpha Vantage, Google Finance, and CoinGecko. Refreshes every 5 minutes.
      </p>
    </section>
  );
}
