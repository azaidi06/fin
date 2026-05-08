import { useState, useEffect } from "react";

const stats = [
  "$406B — Total AI Capex (2025)",
  "AMZN — Top Spender ($132B)",
  "ORCL — Fastest Grower (+209%)",
  "8 companies tracked via SEC EDGAR",
  "74% — Google YoY capex growth",
];

export default function Header({ compact, onGoHome }) {
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
      <h1
        className="animated-gradient-text text-4xl sm:text-5xl font-bold mb-3"
        onClick={onGoHome}
        style={{ cursor: onGoHome ? "pointer" : undefined }}
      >
        AI Capex Tracker
      </h1>
      {compact ? (
        <p className="text-lg sm:text-xl" style={{ color: "#CBD5E1" }}>
          Capital Expenditure Across Big Tech
        </p>
      ) : (
        <>
          <p className="text-lg sm:text-xl mb-3" style={{ color: "#CBD5E1" }}>
            Capital Expenditure Across Big Tech
          </p>
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
          <div className="glow-divider" />
        </>
      )}
    </header>
  );
}
