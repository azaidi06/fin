import Header from "./components/Header";
import BuildupPanel from "./components/BuildupPanel";
import DrawdownChart from "./components/DrawdownChart";
import TimelineChart from "./components/TimelineChart";
import DataTable from "./components/DataTable";
import ComparisonPanel from "./components/ComparisonPanel";
import { sp500Data, nasdaqData } from "./data/warData";

export default function App() {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8" style={{ background: "#0F172A", color: "#F8FAFC" }}>
      <div className="max-w-[960px] mx-auto">
        <Header />
        <BuildupPanel />
        <DrawdownChart />
        <TimelineChart />
        <ComparisonPanel />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <DataTable title="S&P 500" color="#6366F1" data={sp500Data} />
          <DataTable title="NASDAQ" color="#10B981" data={nasdaqData} />
        </div>

        <footer className="text-center text-xs pt-4 border-t leading-relaxed" style={{ color: "#64748B", borderColor: "#334155" }}>
          Data sources: Yahoo Finance (via yfinance), iSectors, Hennion & Walsh, The Motley Fool, CFA Institute, Invesco<br />
          S&P 500 uses DJIA as proxy for pre-1957 conflicts. NASDAQ began trading in 1971.
        </footer>
      </div>
    </div>
  );
}
