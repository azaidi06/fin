import Header from "./components/Header";
import DrawdownChart from "./components/DrawdownChart";
import TimelineChart from "./components/TimelineChart";
import DataTable from "./components/DataTable";
import ComparisonPanel from "./components/ComparisonPanel";
import { sp500Data, nasdaqData } from "./data/warData";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <Header />
        <DrawdownChart />
        <TimelineChart />
        <ComparisonPanel />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <DataTable title="S&P 500" color="#6366F1" data={sp500Data} />
          <DataTable title="NASDAQ" color="#10B981" data={nasdaqData} />
        </div>

        <footer className="text-center text-xs text-slate-600 pt-4 border-t border-slate-800 leading-relaxed">
          Data sources: Yahoo Finance (via yfinance), iSectors, Hennion & Walsh, The Motley Fool, CFA Institute, Invesco<br />
          S&P 500 uses DJIA as proxy for pre-1957 conflicts. NASDAQ began trading in 1971.
        </footer>
      </div>
    </div>
  );
}
