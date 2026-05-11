import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from '../theme/ThemeContext';
const stats = [
  "33.8% — Worst S&P drawdown (WWII)",
  "118% — Peak debt-to-GDP ratio (WWII)",
  "21.3× — CPI multiplier since 1941",
  "917 days — Longest market recovery",
  "5 global indices tracked",
  "−7.8% — S&P 500 in Iran War (2026, 21 trading days)",
  "32 days — Fastest S&P recovery to ATH after a shooting war (Iran 2026)",
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
    <header className="text-center mb-10 page-header" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, right: 0 }}>
        <ThemeToggle />
      </div>
      <h1
        className="animated-gradient-text text-4xl sm:text-5xl font-bold mb-3"
        onClick={onGoHome}
        style={{ cursor: onGoHome ? "pointer" : undefined }}
      >
        Money + War
      </h1>
      {compact ? (
        <p className="text-lg sm:text-xl" style={{ color: t.textMid }}>
          Chaos and Its Toll on Wealth, Money, and Markets
        </p>
      ) : (
        <>
          <p className="text-lg sm:text-xl mb-3" style={{ color: t.textMid }}>
            Chaos and Its Toll on Wealth, Money, and Markets
          </p>
          {/* Rotating stat ticker */}
          <p
            className="mt-4 text-sm font-semibold"
            style={{
              color: t.indigoSoft,
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
