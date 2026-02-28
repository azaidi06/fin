import { useState, useEffect } from "react";

const stats = [
  "33.8% — Worst S&P drawdown (WWII)",
  "118% — Peak debt-to-GDP ratio (WWII)",
  "21.3\u00d7 — CPI multiplier since 1941",
  "917 days — Longest market recovery",
  "5 global indices tracked",
];

export default function Header({ compact }) {
  const [statIndex, setStatIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (compact) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setStatIndex((prev) => (prev + 1) % stats.length);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, [compact]);

  return (
    <header className="text-center mb-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{
        background: "linear-gradient(135deg, #818CF8, #34D399)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>
        War & Markets
      </h1>
      {compact ? (
        <p className="text-base sm:text-lg" style={{ color: "#CBD5E1" }}>
          How U.S. Stocks React to the Onset of Major Conflicts
        </p>
      ) : (
        <>
          <p className="text-base sm:text-lg mb-3" style={{ color: "#CBD5E1" }}>
            How U.S. Stocks React to the Onset of Major Conflicts
          </p>
          <p className="text-sm max-w-2xl mx-auto leading-relaxed" style={{ color: "#94A3B8" }}>
            S&P 500 (DJIA proxy pre-1957) and NASDAQ Composite drawdowns measured from the
            trading day before each conflict&apos;s start event. Recovery = return to pre-war close.
            NASDAQ data available from 1971 onward.
          </p>
          {/* Rotating stat ticker */}
          <p
            className="mt-4 text-sm font-semibold"
            style={{
              color: "#818CF8",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.4s ease",
              minHeight: "1.5em",
            }}
          >
            {stats[statIndex]}
          </p>
        </>
      )}
    </header>
  );
}
