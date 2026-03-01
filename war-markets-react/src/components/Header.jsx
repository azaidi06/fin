import { useState, useEffect } from "react";

const stats = [
  "33.8% — Worst S&P drawdown (WWII)",
  "118% — Peak debt-to-GDP ratio (WWII)",
  "21.3× — CPI multiplier since 1941",
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
      <h1 className="animated-gradient-text text-4xl sm:text-5xl font-bold mb-3">
        Money 4 War
      </h1>
      {compact ? (
        <p className="text-lg sm:text-xl" style={{ color: "#CBD5E1" }}>
          How U.S. Stocks React to the Onset of Major Conflicts
        </p>
      ) : (
        <>
          <p className="text-lg sm:text-xl mb-3" style={{ color: "#CBD5E1" }}>
            How U.S. Stocks React to the Onset of Major Conflicts
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
          {/* Glowing divider */}
          <div className="glow-divider" />
        </>
      )}
    </header>
  );
}
