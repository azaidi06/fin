import { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import AppSwitcher from "./components/AppSwitcher";
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
import LiveMarketsPage from "./components/LiveMarketsPage";
import PostTroughReboundChart from "./components/PostTroughReboundChart";
import { sp500Data, nasdaqData, EXTRA_EVENTS } from "./data/warData";
import { EventToggleProvider, useEventToggle } from "./context/EventToggleContext";

import { useTheme } from './theme/ThemeContext';
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

// Capex-style indigo-glow tab button. Inactive tabs are muted slate;
// active uses indigo-500/20 fill, A5B4FC text, soft glow ring.
const tabBtn = (active) => ({
  padding: "10px 18px",
  fontSize: 13,
  fontWeight: 600,
  fontFamily: "inherit",
  whiteSpace: "nowrap",
  color: active ? 'var(--c-indigo-faint)' : 'var(--c-text-mute)',
  background: active ? "rgba(99,102,241,0.20)" : "transparent",
  border: "1px solid",
  borderColor: active ? "rgba(99,102,241,0.40)" : "transparent",
  borderRadius: 8,
  cursor: "pointer",
  transition: "all 0.18s ease",
  boxShadow: active ? "0 0 14px rgba(99,102,241,0.20)" : "none",
});

const sourceCategory = { marginBottom: 12 };
const sourceCatLabel = { fontSize: 11, fontWeight: 600, color: 'var(--c-text-mute)', textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 };
const sourceList = { fontSize: 11, color: 'var(--c-text-low)', lineHeight: 1.6, margin: 0 };

function FilterDropdown() {
  const t = useTheme().tokens;
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
          color: activeCount > 0 ? t.cyan : t.textMute,
          borderColor: open ? t.axis : "transparent",
          background: open ? t.border : "transparent",
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
            color: t.bg,
            background: t.cyan,
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
          background: t.panel,
          border: "1px solid #334155",
          borderRadius: 12,
          padding: 16,
          minWidth: 240,
          zIndex: 50,
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: t.textMute, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
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
                    color: on ? t.textHigh : t.textLow,
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
                    background: on ? t.cyan : t.axis,
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
                      background: t.textHigh,
                      transition: "left 0.2s ease",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                    }} />
                  </span>
                  {label}
                </button>
              );
            })}
          </div>
          <p style={{ fontSize: 11, color: t.axis, marginTop: 12, lineHeight: 1.4 }}>
            Toggle non-conflict events to include them across all charts and tables.
          </p>
        </div>
      )}
    </div>
  );
}

function AppInner() {
  const t = useTheme().tokens;
  const [activeTab, setActiveTab] = useState("home");
  const { filterData } = useEventToggle();

  const goHome = () => {
    setActiveTab("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredSp500 = filterData(sp500Data);
  const filteredNasdaq = filterData(nasdaqData);

  return (
    <div className="page-root min-h-screen px-4 py-10 sm:px-6 lg:px-8" style={{ color: t.textHigh }}>
      <div className="max-w-[960px] lg:max-w-[1200px] mx-auto">
        <div className="flex justify-end mb-4">
          <AppSwitcher />
        </div>
        <Header compact={activeTab === "home"} onGoHome={activeTab !== "home" ? goHome : undefined} />

        {activeTab === "home" ? (
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: 0, right: 0, zIndex: 10 }}>
              <FilterDropdown />
            </div>
            <HomePage onSelect={setActiveTab} />
          </div>
        ) : (
          <>
            {/* Breadcrumb (out of the tab pill row) */}
            <nav
              aria-label="breadcrumb"
              style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, fontSize: 12, color: t.textLow }}
            >
              <button
                onClick={goHome}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: t.textMute,
                  padding: "4px 6px",
                  borderRadius: 6,
                  fontFamily: "inherit",
                  fontSize: 12,
                  transition: "color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = t.textHigh;
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = t.textMute;
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Home
              </button>
              <span style={{ opacity: 0.4 }}>/</span>
              <span style={{ color: t.textMid }}>Money + War</span>
              <span style={{ opacity: 0.4 }}>/</span>
              <span style={{ color: t.textHigh, fontWeight: 600 }}>
                {tabs.find(t => t.id === activeTab)?.label || "Live Markets"}
              </span>
            </nav>

            {/* Tab bar — sticky, indigo-glow active state */}
            <div className="sticky-tabbar" style={{ marginBottom: 28 }}>
              <div
                role="tablist"
                aria-label="Sections"
                style={{
                  display: "flex",
                  gap: 4,
                  padding: 4,
                  background: "rgba(30, 41, 59, 0.55)",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.06)",
                  overflowX: "auto",
                  flexWrap: "nowrap",
                }}
              >
                {tabs.map(t => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={activeTab === t.id}
                    style={{ ...tabBtn(activeTab === t.id), flex: "0 0 auto" }}
                    onClick={() => setActiveTab(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
                <div style={{ marginLeft: "auto", flexShrink: 0 }}>
                  <FilterDropdown />
                </div>
              </div>
            </div>

            {/* Post-Conflict Reaction tab */}
            {activeTab === "reaction" && (
              <>
                <DrawdownChart />
                <PostTroughReboundChart />
                <TimelineChart />
                <ComparisonPanel />
                <details
                  style={{
                    background: t.panel,
                    border: "1px solid #334155",
                    borderRadius: 12,
                    marginBottom: 32,
                    overflow: "hidden",
                  }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      padding: "14px 20px",
                      listStyle: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      userSelect: "none",
                    }}
                  >
                    <span style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: t.indigoFaint,
                      background: "rgba(99,102,241,0.16)",
                      padding: "3px 8px",
                      borderRadius: 4,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}>
                      Raw Data
                    </span>
                    <span style={{ fontSize: 13, color: t.textHigh, fontWeight: 600 }}>
                      Show source tables
                    </span>
                    <span style={{ fontSize: 12, color: t.textLow, marginLeft: "auto" }}>
                      S&amp;P 500 + NASDAQ — for verification
                    </span>
                  </summary>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 num" style={{ padding: 20, paddingTop: 4 }}>
                    <DataTable title="S&P 500" color={t.indigo} data={filteredSp500} sourceKey="sp500" />
                    <DataTable title="NASDAQ" color={t.green} data={filteredNasdaq} sourceKey="nasdaq" />
                  </div>
                </details>
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

            {/* Live Markets full page */}
            {activeTab === "markets" && <LiveMarketsPage />}

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
            <p style={{ fontSize: 11, color: t.axis, textAlign: "center", lineHeight: 1.5 }}>
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
