import { useState, useEffect } from "react";
import Header from "./components/Header";
import AppSwitcher from "./components/AppSwitcher";
import OverviewCards from "./components/OverviewCards";
import AnnualChart from "./components/AnnualChart";
import GrowthChart from "./components/GrowthChart";
import CompanyDetail from "./components/CompanyDetail";
import UnderTheHood from "./components/UnderTheHood";
import { formatDate } from "./utils/formatters";
import { useTheme } from "./theme/ThemeContext";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "annual", label: "Annual Spend" },
  { id: "growth", label: "YoY Growth" },
  { id: "company", label: "Company Details" },
  { id: "accounting", label: "Under the Hood" },
];

export default function App() {
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState(null);
  const t = useTheme().tokens;

  useEffect(() => {
    fetch("./tech-spend-data.json")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: t.textFaint, fontSize: 14 }}>Loading tech-spend data...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "48px 24px 64px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <AppSwitcher />
        </div>
        <Header compact={tab !== "overview"} onGoHome={() => setTab("overview")} />

        {/* Tab bar */}
        <nav
          role="tablist"
          aria-label="Sections"
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 32,
            padding: 4,
            background: t.panelGlass,
            borderRadius: 12,
            border: `1px solid ${t.borderSoft}`,
            overflowX: "auto",
          }}
        >
          {TABS.map((tb) => (
            <button
              key={tb.id}
              role="tab"
              aria-selected={tab === tb.id}
              onClick={() => setTab(tb.id)}
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
                background: tab === tb.id ? "var(--c-pill-active-bg)" : "transparent",
                color: tab === tb.id ? "var(--c-pill-active-text)" : t.textFaint,
                boxShadow: tab === tb.id ? "0 0 12px var(--c-pill-active-glow)" : "none",
              }}
            >
              {tb.label}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        {tab === "overview" && <OverviewCards data={data} />}
        {tab === "annual" && <AnnualChart data={data} />}
        {tab === "growth" && <GrowthChart data={data} />}
        {tab === "company" && <CompanyDetail data={data} />}
        {tab === "accounting" && <UnderTheHood />}

        {/* Footer */}
        <footer style={{ textAlign: "center", marginTop: 48, paddingTop: 24 }}>
          <div className="glow-divider" style={{ marginBottom: 16 }} />
          <p className="num" style={{ fontSize: 11, color: t.textGhost }}>
            Data from SEC EDGAR XBRL filings &middot; Updated {formatDate(data.updatedAt)}
          </p>
        </footer>
      </div>
    </div>
  );
}
