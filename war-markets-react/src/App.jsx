import { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import BuildupPanel from "./components/BuildupPanel";
import DrawdownChart from "./components/DrawdownChart";
import TimelineChart from "./components/TimelineChart";
import DataTable from "./components/DataTable";
import ComparisonPanel from "./components/ComparisonPanel";
import GlobalMarketsPanel from "./components/GlobalMarketsPanel";
import FiscalImpactPanel from "./components/FiscalImpactPanel";
import CostOfLivingPanel from "./components/CostOfLivingPanel";
import WealthDistributionPanel from "./components/WealthDistributionPanel";
import MethodologyPage from "./components/MethodologyPage";
import EventExplainerPanel from "./components/EventExplainerPanel";
import { sp500Data, nasdaqData, EXTRA_EVENTS } from "./data/warData";
import { EventToggleProvider, useEventToggle } from "./context/EventToggleContext";

const tabs = [
  { id: "reaction", label: "Post-Conflict Reaction" },
  { id: "buildup", label: "Pre-War Buildup" },
  { id: "global", label: "Global Markets" },
  { id: "fiscal", label: "Fiscal Impact" },
  { id: "cost", label: "Cost of Living" },
  { id: "wealth", label: "Wealth Distribution" },
  { id: "events", label: "Event Explainer" },
  { id: "methodology", label: "Methodology" },
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

function FilterDropdown() {
  const { toggles, toggle } = useEventToggle();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const entries = Object.entries(EXTRA_EVENTS);
  const activeCount = Object.values(toggles).filter(Boolean).length;

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (entries.length === 0) return null;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          ...tabBtn(false),
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: activeCount > 0 ? "#06B6D4" : "#94A3B8",
          borderColor: open ? "#475569" : "transparent",
          background: open ? "#334155" : "transparent",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M1 3h14M3 8h10M5.5 13h5" />
        </svg>
        Filter
        {activeCount > 0 && (
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#0F172A",
            background: "#06B6D4",
            width: 16,
            height: 16,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          right: 0,
          background: "#1E293B",
          border: "1px solid #334155",
          borderRadius: 12,
          padding: 16,
          minWidth: 240,
          zIndex: 50,
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
            Extra Events
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {entries.map(([key, label]) => {
              const on = toggles[key];
              return (
                <button
                  key={key}
                  onClick={() => toggle(key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: 0,
                    fontSize: 13,
                    fontWeight: 500,
                    color: on ? "#F8FAFC" : "#64748B",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "color 0.15s ease",
                    textAlign: "left",
                  }}
                >
                  {/* Toggle track */}
                  <span style={{
                    width: 32,
                    height: 18,
                    borderRadius: 9,
                    background: on ? "#06B6D4" : "#475569",
                    position: "relative",
                    transition: "background 0.2s ease",
                    flexShrink: 0,
                  }}>
                    <span style={{
                      position: "absolute",
                      top: 2,
                      left: on ? 16 : 2,
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: "#F8FAFC",
                      transition: "left 0.2s ease",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                    }} />
                  </span>
                  {label}
                </button>
              );
            })}
          </div>
          <p style={{ fontSize: 11, color: "#475569", marginTop: 12, lineHeight: 1.4 }}>
            Toggle non-conflict events to include them across all charts and tables.
          </p>
        </div>
      )}
    </div>
  );
}

function AppInner() {
  const [activeTab, setActiveTab] = useState("home");
  const { filterData } = useEventToggle();

  const goHome = () => {
    setActiveTab("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredSp500 = filterData(sp500Data);
  const filteredNasdaq = filterData(nasdaqData);

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8" style={{ color: "#F8FAFC" }}>
      <div className="max-w-[960px] mx-auto">
        <Header compact={activeTab === "home"} />

        {activeTab === "home" ? (
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: 0, right: 0, zIndex: 10 }}>
              <FilterDropdown />
            </div>
            <HomePage onSelect={setActiveTab} />
          </div>
        ) : (
          <>
            {/* Tab bar */}
            <div style={{ display: "flex", gap: 8, marginBottom: 32, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                style={{
                  ...tabBtn(false),
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
                onClick={goHome}
              >
                ← Home
              </button>
              {tabs.map(t => (
                <button key={t.id} style={tabBtn(activeTab === t.id)} onClick={() => setActiveTab(t.id)}>
                  {t.label}
                </button>
              ))}
              <FilterDropdown />
            </div>

            {/* Post-Conflict Reaction tab */}
            {activeTab === "reaction" && (
              <>
                <DrawdownChart />
                <TimelineChart />
                <ComparisonPanel />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <DataTable title="S&P 500" color="#6366F1" data={filteredSp500} sourceKey="sp500" />
                  <DataTable title="NASDAQ" color="#10B981" data={filteredNasdaq} sourceKey="nasdaq" />
                </div>
              </>
            )}

            {/* Pre-War Buildup tab */}
            {activeTab === "buildup" && <BuildupPanel />}

            {/* Global Markets tab */}
            {activeTab === "global" && <GlobalMarketsPanel />}

            {/* Fiscal Impact tab */}
            {activeTab === "fiscal" && <FiscalImpactPanel />}

            {/* Cost of Living tab */}
            {activeTab === "cost" && <CostOfLivingPanel />}

            {/* Wealth Distribution tab */}
            {activeTab === "wealth" && <WealthDistributionPanel />}

            {/* Event Explainer tab */}
            {activeTab === "events" && <EventExplainerPanel />}

            {/* Methodology tab */}
            {activeTab === "methodology" && <MethodologyPage onClose={goHome} />}
          </>
        )}

        {/* ── FOOTER ── */}
        {activeTab !== "home" && (
          <footer style={{ borderTop: "1px solid #334155", paddingTop: 20, marginTop: 8 }}>
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
              <div style={sourceCategory}>
                <p style={sourceCatLabel}>Wealth Distribution</p>
                <p style={sourceList}>
                  Saez-Zucman (2016, updated), World Inequality Database (WID)
                </p>
              </div>
            </div>

            {/* Key assumptions note */}
            <p style={{ fontSize: 11, color: "#475569", textAlign: "center", lineHeight: 1.5 }}>
              S&P 500 uses DJIA as proxy for pre-1957 conflicts. NASDAQ data available from 1971 onward.
              All cost-of-living prices adjusted to 2024 USD using CPI-U annual average multipliers.
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <EventToggleProvider>
      <AppInner />
    </EventToggleProvider>
  );
}
