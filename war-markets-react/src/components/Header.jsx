export default function Header() {
  return (
    <header className="text-center mb-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{
        background: "linear-gradient(135deg, #818CF8, #34D399)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>
        War & Markets
      </h1>
      <p className="text-base sm:text-lg mb-3" style={{ color: "#CBD5E1" }}>
        How U.S. Stocks React to the Onset of Major Conflicts
      </p>
      <p className="text-sm max-w-2xl mx-auto leading-relaxed" style={{ color: "#94A3B8" }}>
        S&P 500 (DJIA proxy pre-1957) and NASDAQ Composite drawdowns measured from the
        trading day before each conflict&apos;s start event. Recovery = return to pre-war close.
        NASDAQ data available from 1971 onward.
      </p>
    </header>
  );
}
