import { useState, useEffect } from "react";
import Header from "./components/Header";
import OverviewCards from "./components/OverviewCards";
import AnnualChart from "./components/AnnualChart";
import GrowthChart from "./components/GrowthChart";
import CompanyDetail from "./components/CompanyDetail";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "annual", label: "Annual Spending" },
  { id: "growth", label: "YoY Growth" },
  { id: "company", label: "Company Details" },
];

export default function App() {
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("./capex-data.json")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#64748B", fontSize: 14 }}>Loading capex data...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "48px 24px 64px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Header compact={tab !== "overview"} onGoHome={() => setTab("overview")} />

        {/* Tab bar */}
        <nav
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 32,
            padding: 4,
            background: "rgba(30, 41, 59, 0.4)",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.06)",
            overflowX: "auto",
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
                background: tab === t.id ? "rgba(99,102,241,0.2)" : "transparent",
                color: tab === t.id ? "#A5B4FC" : "#64748B",
                boxShadow: tab === t.id ? "0 0 12px rgba(99,102,241,0.15)" : "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        {tab === "overview" && <OverviewCards data={data} />}
        {tab === "annual" && <AnnualChart data={data} />}
        {tab === "growth" && <GrowthChart data={data} />}
        {tab === "company" && <CompanyDetail data={data} />}

        {/* Footer */}
        <footer style={{ textAlign: "center", marginTop: 48, paddingTop: 24 }}>
          <div className="glow-divider" style={{ marginBottom: 16 }} />
          <p style={{ fontSize: 11, color: "#475569" }}>
            Data from SEC EDGAR XBRL filings &middot; Updated {new Date(data.updatedAt).toLocaleDateString()}
          </p>
        </footer>
      </div>
    </div>
  );
}
