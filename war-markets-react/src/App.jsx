import { useState } from "react";
import Header from "./components/Header";
import BuildupPanel from "./components/BuildupPanel";
import DrawdownChart from "./components/DrawdownChart";
import TimelineChart from "./components/TimelineChart";
import DataTable from "./components/DataTable";
import ComparisonPanel from "./components/ComparisonPanel";
import { sp500Data, nasdaqData } from "./data/warData";

const tabs = [
  { id: "reaction", label: "Post-Conflict Reaction" },
  { id: "buildup", label: "Pre-War Buildup" },
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

export default function App() {
  const [activeTab, setActiveTab] = useState("reaction");

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8" style={{ background: "#0F172A", color: "#F8FAFC" }}>
      <div className="max-w-[960px] mx-auto">
        <Header />

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
              <DataTable title="S&P 500" color="#6366F1" data={sp500Data} />
              <DataTable title="NASDAQ" color="#10B981" data={nasdaqData} />
            </div>
          </>
        )}

        {/* Pre-War Buildup tab */}
        {activeTab === "buildup" && (
          <BuildupPanel />
        )}

        <footer className="text-center text-xs pt-4 border-t leading-relaxed" style={{ color: "#64748B", borderColor: "#334155" }}>
          Data sources: Yahoo Finance (via yfinance), iSectors, Hennion & Walsh, The Motley Fool, CFA Institute, Invesco<br />
          S&P 500 uses DJIA as proxy for pre-1957 conflicts. NASDAQ began trading in 1971.
        </footer>
      </div>
    </div>
  );
}
