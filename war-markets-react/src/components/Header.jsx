export default function Header() {
  return (
    <header className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
        War & Markets
      </h1>
      <p className="text-lg text-slate-300 mb-3">
        How U.S. Stocks React to the Onset of Major Conflicts
      </p>
      <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
        S&P 500 (DJIA proxy pre-1957) and NASDAQ Composite drawdowns measured from the
        trading day before each conflict&apos;s start event. Recovery = return to pre-war close.
        NASDAQ data available from 1971 onward.
      </p>
    </header>
  );
}
