import { formatPrice, timeAgo, useMarketData } from "./HomePage";

const card = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };
const colHeader = { fontSize: 10, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" };

export default function LiveMarketsPage() {
  const { assets, updatedAt, loading } = useMarketData();

  return (
    <section style={card}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span className="live-dot" />
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#F8FAFC", margin: 0 }}>Live Markets</h2>
        <span style={{ fontSize: 11, color: "#64748B", marginLeft: "auto" }}>
          {updatedAt ? timeAgo(updatedAt) : ""}
        </span>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 32, opacity: 1 - i * 0.08 }} />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <p style={{ fontSize: 13, color: "#64748B" }}>Market data unavailable</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Column headers */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px 6px",
            borderBottom: "1px solid rgba(71, 85, 105, 0.4)",
            marginBottom: 2,
          }}>
            <span style={colHeader}>Asset</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <span style={{ ...colHeader, width: 80, textAlign: "right" }}>Price</span>
              <span style={{ ...colHeader, minWidth: 56, textAlign: "right" }}>1D %</span>
              <span style={{ ...colHeader, minWidth: 56, textAlign: "right" }}>7D %</span>
            </div>
          </div>

          {assets.map((a) => {
            const val1d = a.change1d ?? null;
            const val7d = a.change7d ?? null;
            const has1d = val1d != null && val1d !== 0;
            const has7d = val7d != null && val7d !== 0;
            const up1d = (val1d ?? 0) >= 0;
            const up7d = (val7d ?? 0) >= 0;
            return (
              <div
                key={a.symbol}
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
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", width: 52, flexShrink: 0 }}>
                    {a.symbol}
                  </span>
                  <span style={{ fontSize: 13, color: "#64748B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {a.name}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#CBD5E1", fontVariantNumeric: "tabular-nums", width: 80, textAlign: "right" }}>
                    {formatPrice(a.price)}
                  </span>
                  {has1d ? (
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: up1d ? "#34D399" : "#EF4444",
                      background: up1d ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)",
                      border: `1px solid ${up1d ? "rgba(52,211,153,0.2)" : "rgba(239,68,68,0.2)"}`,
                      padding: "2px 8px", borderRadius: 6, minWidth: 56, textAlign: "right", fontVariantNumeric: "tabular-nums",
                    }}>
                      {up1d ? "+" : ""}{val1d.toFixed(1)}%
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#475569", padding: "2px 8px", minWidth: 56, textAlign: "right" }}>—</span>
                  )}
                  {has7d ? (
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: up7d ? "#34D399" : "#EF4444",
                      background: up7d ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)",
                      border: `1px solid ${up7d ? "rgba(52,211,153,0.2)" : "rgba(239,68,68,0.2)"}`,
                      padding: "2px 8px", borderRadius: 6, minWidth: 56, textAlign: "right", fontVariantNumeric: "tabular-nums",
                    }}>
                      {up7d ? "+" : ""}{val7d.toFixed(1)}%
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#475569", padding: "2px 8px", minWidth: 56, textAlign: "right" }}>—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 16, marginBottom: 0 }}>
        Prices from Alpha Vantage, Google Finance, and CoinGecko. Refreshes every 5 minutes.
      </p>
    </section>
  );
}
