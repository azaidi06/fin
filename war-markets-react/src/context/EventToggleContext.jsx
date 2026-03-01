import { createContext, useContext, useState, useMemo, useCallback } from "react";
import { BASE_CONFLICTS, EXTRA_EVENTS } from "../data/warData";

const EventToggleContext = createContext(null);

export function EventToggleProvider({ children }) {
  const [toggles, setToggles] = useState(() =>
    Object.fromEntries(Object.keys(EXTRA_EVENTS).map(k => [k, false]))
  );

  const toggle = useCallback((name) => {
    setToggles(prev => ({ ...prev, [name]: !prev[name] }));
  }, []);

  const activeConflicts = useMemo(
    () => [
      ...BASE_CONFLICTS,
      ...Object.keys(EXTRA_EVENTS).filter(k => toggles[k]),
    ],
    [toggles]
  );

  const isActive = useCallback(
    (conflict) => activeConflicts.includes(conflict),
    [activeConflicts]
  );

  const filterData = useCallback(
    (arr) => arr.filter(d => {
      const key = d.conflict || d.era;
      if (!key) return true;
      if (key === "Today") return true;
      return activeConflicts.includes(key);
    }),
    [activeConflicts]
  );

  const value = useMemo(
    () => ({ toggles, toggle, activeConflicts, isActive, filterData }),
    [toggles, toggle, activeConflicts, isActive, filterData]
  );

  return (
    <EventToggleContext.Provider value={value}>
      {children}
    </EventToggleContext.Provider>
  );
}

export function useEventToggle() {
  const ctx = useContext(EventToggleContext);
  if (!ctx) throw new Error("useEventToggle must be used within EventToggleProvider");
  return ctx;
}

export default EventToggleContext;
