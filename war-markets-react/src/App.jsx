import { useState } from "react";
import Header from "./components/Header";
import BuildupPanel from "./components/BuildupPanel";
import DrawdownChart from "./components/DrawdownChart";
import TimelineChart from "./components/TimelineChart";
import DataTable from "./components/DataTable";
import ComparisonPanel from "./components/ComparisonPanel";
import GlobalMarketsPanel from "./components/GlobalMarketsPanel";
import FiscalImpactPanel from "./components/FiscalImpactPanel";
import CostOfLivingPanel from "./components/CostOfLivingPanel";
import MethodologyPage from "./components/MethodologyPage";
import { sp500Data, nasdaqData } from "./data/warData";

const tabs = [
  { id: "reaction", label: "Post-Conflict Reaction" },
  { id: "buildup", label: "Pre-War Buildup" },
  { id: "global", label: "Global Markets" },
  { id: "fiscal", label: "Fiscal Impact" },
  { id: "cost", label: "Cost of Living" },
];

const tabBtn = (active) => ({
  padding: "10px 24px",
  fontSize: 14,
  fontWeight: active ? 600 : 400,
  color: active ? "#F8FAFC" : "#94A3B8",
  background: active ? "#334155" : "transparent",
  border: "1px solid",
  borderColor: active ? "#475569" : "transparent",
  borderRadius: 8,
  cursor: "pointer",
  transition: "all 0.15s ease",
});

const sourceCategory = { marginBottom: 12 };
const sourceCatLabel = { fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 };
const sourceList = { fontSize: 11, color: "#64748B", lineHeight: 1.6, margin: 0 };

export default function App() {
  const [activeTab, setActiveTab] = useState("reaction");
  const [showMethodology, setShowMethodology] = useState(false);

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8" style={{ background: "#0F172A", color: "#F8FAFC" }}>
      <div className="max-w-[960px] mx-auto">
        <Header />

        {showMethodology ? (
          <MethodologyPage onClose={() => setShowMethodology(false)} />
        ) : (
          <>
            {/* Tab bar */}
            <div style={{ display: "flex", gap: 8, marginBottom: 32, justifyContent: "center", flexWrap: "wrap" }}>
              {tabs.map(t => (
                <button key={t.id} style={tabBtn(activeTab === t.id)} onClick={() => setActiveTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Post-Conflict Reaction tab */}
            {activeTab === "reaction" && (
              <>
                <DrawdownChart />
                <TimelineChart />
                <ComparisonPanel />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <DataTable title="S&P 500" color="#6366F1" data={sp500Data} sourceKey="sp500" />
                  <DataTable title="NASDAQ" color="#10B981" data={nasdaqData} sourceKey="nasdaq" />
                </div>
              </>
            )}

            {/* Pre-War Buildup tab */}
            {activeTab === "buildup" && (
              <BuildupPanel />
            )}

            {/* Global Markets tab */}
            {activeTab === "global" && (
              <GlobalMarketsPanel />
            )}

            {/* Fiscal Impact tab */}
            {activeTab === "fiscal" && (
              <FiscalImpactPanel />
            )}

            {/* Cost of Living tab */}
            {activeTab === "cost" && (
              <CostOfLivingPanel />
            )}
          </>
        )}

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: "1px solid #334155", paddingTop: 20, marginTop: 8 }}>
          {/* Methodology link */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <button
              onClick={() => {
                setShowMethodology(!showMethodology);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)",
                borderRadius: 8, padding: "10px 24px", fontSize: 13, fontWeight: 600,
                color: "#818CF8", cursor: "pointer", transition: "all 0.2s",
              }}
            >
              {showMethodology ? "Back to Dashboard" : "Our Methodology — How We Calculate Every Number"}
            </button>
          </div>

          {/* Structured sources */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "8px 24px", marginBottom: 16 }}>
            <div style={sourceCategory}>
              <p style={sourceCatLabel}>Market Data</p>
              <p style={sourceList}>
                Yahoo Finance (via yfinance), iSectors, Hennion & Walsh, The Motley Fool, CFA Institute, Invesco
              </p>
            </div>
            <div style={sourceCategory}>
              <p style={sourceCatLabel}>Economic Data</p>
              <p style={sourceList}>
                FRED CPIAUCSL (BLS CPI-U), FRED GFDGDPA188S (Debt/GDP), Minneapolis Fed historical tables
              </p>
            </div>
            <div style={sourceCategory}>
              <p style={sourceCatLabel}>Cost of Living</p>
              <p style={sourceList}>
                Census Bureau (housing), EIA (gasoline), USDA (food), NCES (tuition), BLS (income)
              </p>
            </div>
          </div>

          {/* Key assumptions note */}
          <p style={{ fontSize: 11, color: "#475569", textAlign: "center", lineHeight: 1.5 }}>
            S&P 500 uses DJIA as proxy for pre-1957 conflicts. NASDAQ data available from 1971 onward.
            All cost-of-living prices adjusted to 2024 USD using CPI-U annual average multipliers.
          </p>
        </footer>
      </div>
    </div>
  );
}
