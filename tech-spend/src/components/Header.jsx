import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../theme/ThemeContext";

const stats = [
  "Total tech spend across 8 hyperscalers — CapEx + OpEx",
  "AMZN — Top CapEx spender",
  "ORCL — Fastest CapEx grower (+209%)",
  "Tracked via SEC EDGAR XBRL filings",
  "Updated daily from 10-Qs and 10-Ks",
];

export default function Header({ compact, onGoHome }) {
  const t = useTheme().tokens;
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
    <header className="text-center mb-10" style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 0, right: 0 }}>
        <ThemeToggle />
      </div>
      <h1
        className="animated-gradient-text text-4xl sm:text-5xl font-bold mb-3"
        onClick={onGoHome}
        style={{ cursor: onGoHome ? "pointer" : undefined }}
      >
        Tech Spend
      </h1>
      {compact ? (
        <p className="text-lg sm:text-xl" style={{ color: t.textSubtle }}>
          CapEx + OpEx Across Big Tech
        </p>
      ) : (
        <>
          <p className="text-lg sm:text-xl mb-3" style={{ color: t.textSubtle }}>
            CapEx + OpEx Across Big Tech
          </p>
          <p
            className="mt-4 text-sm font-semibold"
            style={{
              color: t.indigoLight,
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
