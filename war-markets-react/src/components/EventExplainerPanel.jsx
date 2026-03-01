import { useState } from "react";
import { sp500Data, preWarData, globalMarketsData, fiscalSummary } from "../data/warData";
import { useEventToggle } from "../context/EventToggleContext";

const card = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 32 };

/* ── Why each event matters for market analysis ── */
const eventContext = {
  WWII: {
    type: "World War",
    era: "1941 – 1945",
    summary: "The defining geopolitical shock of the 20th century. Japan's attack on Pearl Harbor drew the U.S. into a two-front global war, transforming the economy into a centrally planned war machine overnight.",
    whyItMatters: [
      "Established the template for wartime market behavior — initial panic followed by a rally as government spending surged",
      "Proved that total war is ultimately bullish for equities: the S&P returned to pre-war levels within 3 years as defense spending created full employment",
      "Triggered the largest debt-to-GDP surge in U.S. history (42% to 118%), yet the economy boomed afterward — a key precedent for modern deficit spending arguments",
      "Post-war inflation hit 14.4% after price controls were lifted, showing that wartime suppression of prices only delays inflationary effects",
    ],
    keyTakeaway: "Wars destroy lives but often create economic booms. The WWII recovery established that government spending can pull an economy out of depression — a lesson that shaped fiscal policy for 80+ years.",
  },
  Korea: {
    type: "Regional War",
    era: "1950 – 1953",
    summary: "North Korea's surprise invasion caught markets completely off guard. The S&P was at 52-week highs and fell 12% in 18 trading days — one of the fastest drawdowns on record.",
    whyItMatters: [
      "Demonstrated that surprise invasions cause sharper but shorter market drops than anticipated conflicts",
      "Recovery took just 60 days — among the fastest of any conflict — because the war was regionally contained",
      "Kickstarted Japan's postwar economic miracle through U.S. military procurement spending",
      "Showed that Cold War-era 'police actions' have limited market impact compared to total wars",
    ],
    keyTakeaway: "Regional conflicts that don't threaten the global economic order tend to produce buying opportunities, not bear markets.",
  },
  "Cuban Missile": {
    type: "Nuclear Standoff",
    era: "October 1962 (13 days)",
    summary: "The closest the world came to nuclear war. Soviet missiles discovered in Cuba triggered a 13-day standoff between Kennedy and Khrushchev, with the fate of civilization hanging in the balance.",
    whyItMatters: [
      "The shortest crisis-to-recovery cycle of any conflict (14 days) — proof that markets price existential risk very differently than economic risk",
      "Despite the theoretical possibility of nuclear annihilation, the S&P only fell 6.5% — suggesting markets assign near-zero probability to worst-case outcomes",
      "Established that diplomatic resolution of crises produces sharp V-shaped recoveries",
      "Zero lasting fiscal or inflationary impact — the crisis was too brief to affect the real economy",
    ],
    keyTakeaway: "Markets are remarkably sanguine about existential threats. If nuclear war didn't trigger a bear market, very few geopolitical events will.",
  },
  Vietnam: {
    type: "Prolonged War",
    era: "1964 – 1975",
    summary: "The Gulf of Tonkin incident gave LBJ authorization for full U.S. involvement in Vietnam. Markets barely noticed — the S&P fell just 5% — but the decade-long fiscal drain would reshape the American economy.",
    whyItMatters: [
      "A cautionary tale about slow-burn conflicts: the immediate market reaction was minimal, but the cumulative cost was enormous",
      "War spending without tax increases overheated the economy, planting the seeds for 1970s stagflation",
      "Showed that prolonged conflicts erode the economy through inflation and social disruption, not through immediate market crashes",
      "The S&P went nowhere for a decade (1966–1982) as inflation ate into real returns",
    ],
    keyTakeaway: "The most dangerous conflicts for long-term investors aren't the ones that cause sharp crashes — they're the ones that slowly corrode purchasing power through inflation.",
  },
  "Oil Embargo": {
    type: "Economic Warfare",
    era: "1973 – 1974",
    summary: "OPEC's oil embargo quadrupled oil prices from $3 to $12 per barrel, triggering the worst bear market since the Great Depression. The S&P lost 43.3% and didn't recover for over 4.5 years.",
    whyItMatters: [
      "Proved that commodity shocks can be more devastating than military conflicts — this was worse than any war-driven selloff",
      "The 1,680-day recovery was the longest of any event in this dataset, highlighting how supply-side shocks create persistent damage",
      "Triggered a global crisis: the UK's FT 30 fell 73%, Japan's Nikkei fell 37%",
      "Ended the postwar economic consensus and ushered in the era of stagflation (simultaneous high inflation + high unemployment)",
    ],
    keyTakeaway: "Energy dependence is a critical national security vulnerability. The embargo showed that economic weapons can inflict more market damage than conventional military action.",
  },
  "Black Monday": {
    type: "Market Crash",
    era: "October 1987",
    summary: "The S&P fell 20.4% in a single day — the largest one-day percentage decline in history. Program trading, rising interest rates, and overlooked geopolitical tensions in the Persian Gulf combined to create a perfect storm.",
    whyItMatters: [
      "Demonstrated that financial market structure itself can be a source of systemic risk — program trading amplified the selloff",
      "The geopolitical context (U.S.-Iran tensions, Operation Earnest Will) is often overlooked but created the backdrop of uncertainty",
      "Despite the historic crash, the S&P recovered within 393 days — relatively fast for a 33.5% decline",
      "Led directly to the creation of circuit breakers and the 'Plunge Protection Team' (President's Working Group on Financial Markets)",
    ],
    keyTakeaway: "Market plumbing matters as much as fundamentals. Black Monday proved that technical market structure can turn a correction into a catastrophe.",
  },
  "Gulf War": {
    type: "Regional War",
    era: "1990 – 1991",
    summary: "Iraq's invasion of Kuwait sent oil prices spiking and the S&P fell 16.9%. But the swift U.S. military victory (100-hour ground war) produced a textbook relief rally.",
    whyItMatters: [
      "The first conflict with comprehensive global market data across all major indices",
      "Established the 'sell the fear, buy the resolution' pattern that has defined post-Cold War conflict investing",
      "Oil's role as a transmission mechanism was clear: markets fell on oil fears, not military fears",
      "Japan's Nikkei fell 35% — but this was mostly its own bubble bursting, not the war. A reminder to separate confounding factors",
    ],
    keyTakeaway: "Short, decisive military actions with clear objectives tend to produce buying opportunities for investors. Ambiguity and escalation are what markets truly fear.",
  },
  "9/11": {
    type: "Terrorist Attack",
    era: "September 2001",
    summary: "The deadliest terrorist attack in history shut down U.S. markets for 4 trading days. When they reopened, the S&P fell 11.6% in a week — but recovered within a month.",
    whyItMatters: [
      "The fastest recovery of any surprise attack (31 days) reflected markets' belief that the economic system was resilient to terrorism",
      "The most globally synchronized reaction to that point — all 6 major indices fell within hours",
      "Triggered the War on Terror and the creation of the Department of Homeland Security, permanently increasing defense spending",
      "Markets were already in the dot-com bust — 9/11 accelerated an existing decline rather than creating a new one",
    ],
    keyTakeaway: "Terrorism is devastating on a human level but has limited lasting impact on equity markets. The economic system proved far more resilient than the immediate panic suggested.",
  },
  Iraq: {
    type: "Preemptive War",
    era: "2003 – 2011",
    summary: "The most telegraphed war in modern history. Markets sold off 14.7% during the buildup as certainty of invasion grew, then rallied immediately when it began — the textbook 'buy the invasion.'",
    whyItMatters: [
      "The clearest example of 'sell the rumor, buy the news' in conflict investing — the S&P fell just 5.3% post-invasion because the selloff had already happened",
      "Combined with 9/11, the War on Terror cost an estimated $8 trillion and helped push debt/GDP from 55% to 100%",
      "Showed that markets can front-run well-publicized conflicts, making the actual event date nearly irrelevant",
      "The post-invasion rally began the 2003–2007 bull market",
    ],
    keyTakeaway: "When war is certain, the best time to buy is often the day of invasion — because all the bad news is already priced in.",
  },
  "2008 Crisis": {
    type: "Financial Crisis",
    era: "2007 – 2009",
    summary: "Lehman Brothers' bankruptcy triggered a global credit freeze and the worst financial crisis since the Great Depression. The S&P fell 46.1% — the deepest decline in this entire dataset.",
    whyItMatters: [
      "The deepest and second-longest drawdown of any event tracked (46.1% decline, 881-day recovery)",
      "Every major global index fell 40–65% — demonstrating that financial contagion is more globally destructive than wars",
      "Triggered unprecedented policy responses: zero interest rates, quantitative easing, bank bailouts (TARP)",
      "Permanently changed the financial landscape: Dodd-Frank, stress tests, and the era of central bank dominance",
    ],
    keyTakeaway: "Financial system failures are more dangerous to portfolios than geopolitical conflicts. The 2008 crisis caused more wealth destruction than any war since WWII.",
  },
  COVID: {
    type: "Pandemic",
    era: "2020 – 2023",
    summary: "The fastest 30%+ decline in S&P history (just 22 trading days) followed the most dramatic case of markets ignoring an obvious threat. Three circuit breakers triggered in a single week.",
    whyItMatters: [
      "The ultimate stress test: a simultaneous global supply and demand shock affecting every sector and every country",
      "The recovery was equally unprecedented — massive fiscal ($5T+) and monetary (unlimited QE) intervention produced the fastest bear-to-bull reversal ever",
      "Triggered delayed inflation that hit 8% by 2022, leading to the most aggressive Fed tightening cycle since Volcker",
      "Debt/GDP jumped 21 points in a single year — the largest peacetime fiscal expansion in history",
    ],
    keyTakeaway: "The speed of the policy response determines the speed of recovery. COVID proved that governments and central banks can brute-force a market recovery if they're willing to spend unlimited money — but the inflationary bill eventually comes due.",
  },
  "Russia-Ukraine": {
    type: "Interstate War",
    era: "2022 – present",
    summary: "The most telegraphed invasion in modern history. U.S. intelligence publicly predicted Russia's attack weeks in advance. Markets priced in the risk beforehand, and the invasion itself caused only a brief dip.",
    whyItMatters: [
      "Demonstrated that pre-priced geopolitical events have diminishing market impact — intelligence transparency is now a market factor",
      "European markets suffered far more than U.S. markets due to energy dependence on Russia (DAX fell 24.5%)",
      "The larger 2022 selloff was primarily driven by Fed rate hikes, not the war — showing that monetary policy matters more than geopolitics",
      "Energy as a weapon returned to center stage: Russia's gas cutoff to Europe echoed the 1973 oil embargo playbook",
    ],
    keyTakeaway: "In a world of real-time intelligence sharing, well-telegraphed invasions lose their market shock value. The bigger risk to portfolios was the Fed's response to inflation, not Russian tanks.",
  },
};

/* ── Color mapping from existing data ── */
const eventColors = {
  WWII: "#EF4444",
  Korea: "#F59E0B",
  "Cuban Missile": "#84CC16",
  Vietnam: "#10B981",
  "Oil Embargo": "#F97316",
  "Black Monday": "#A855F7",
  "Gulf War": "#6366F1",
  "9/11": "#EC4899",
  Iraq: "#3B82F6",
  "2008 Crisis": "#14B8A6",
  COVID: "#06B6D4",
  "Russia-Ukraine": "#E11D48",
};

const typeIcons = {
  "World War": "War",
  "Regional War": "War",
  "Nuclear Standoff": "Crisis",
  "Prolonged War": "War",
  "Economic Warfare": "Economic",
  "Market Crash": "Financial",
  "Terrorist Attack": "Attack",
  "Preemptive War": "War",
  "Financial Crisis": "Financial",
  "Pandemic": "Pandemic",
  "Interstate War": "War",
};

function EventCard({ conflict, sp, preWar, global, fiscal, context, isExpanded, onToggle }) {
  const color = eventColors[conflict] || "#94A3B8";

  return (
    <div
      style={{
        background: "#0F172A",
        border: `1px solid ${isExpanded ? color + "66" : "#334155"}`,
        borderRadius: 12,
        overflow: "hidden",
        transition: "border-color 0.2s ease",
      }}
    >
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          padding: "20px 24px",
          cursor: "pointer",
          textAlign: "left",
          color: "#F8FAFC",
          display: "flex",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        {/* Color accent */}
        <div style={{
          width: 4,
          minHeight: 48,
          borderRadius: 2,
          background: color,
          flexShrink: 0,
          marginTop: 2,
        }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Top row: name + type badge + date */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#F8FAFC", margin: 0 }}>
              {sp?.label || conflict}
            </h3>
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              color,
              background: `${color}1A`,
              padding: "2px 8px",
              borderRadius: 4,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              {context.type}
            </span>
          </div>

          {/* Summary */}
          <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.5, margin: 0 }}>
            {context.summary}
          </p>

          {/* Quick stats row */}
          <div style={{ display: "flex", gap: 20, marginTop: 12, flexWrap: "wrap" }}>
            {sp && (
              <div>
                <span style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  S&P 500
                </span>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#EF4444", margin: "2px 0 0" }}>
                  -{sp.decline}%
                </p>
              </div>
            )}
            {sp && (
              <div>
                <span style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Recovery
                </span>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#34D399", margin: "2px 0 0" }}>
                  {sp.daysToRecover ? `${sp.daysToRecover}d` : "N/A"}
                </p>
              </div>
            )}
            {preWar && (
              <div>
                <span style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {preWar.surprise ? "Surprise" : "Buildup"}
                </span>
                <p style={{ fontSize: 16, fontWeight: 700, color: preWar.surprise ? "#FBBF24" : "#94A3B8", margin: "2px 0 0" }}>
                  {preWar.surprise ? "Yes" : `${preWar.days}d`}
                </p>
              </div>
            )}
            <div>
              <span style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Date
              </span>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#CBD5E1", margin: "2px 0 0" }}>
                {sp?.date || context.era}
              </p>
            </div>
          </div>
        </div>

        {/* Expand arrow */}
        <span style={{
          fontSize: 18,
          color: "#64748B",
          transition: "transform 0.2s ease",
          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          flexShrink: 0,
          marginTop: 4,
        }}>
          ▾
        </span>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div style={{
          padding: "0 24px 24px",
        }}>
          {/* Separator */}
          <div style={{
            borderTop: "1px solid #1E293B",
            margin: "0 -24px",
            padding: "0 24px",
          }} />

          {/* Why It Matters */}
          <div style={{ marginBottom: 20, marginTop: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
              Why It Should Be Considered
            </h4>
            <ul style={{ margin: 0, paddingLeft: 18, listStyleType: "none" }}>
              {context.whyItMatters.map((point, i) => (
                <li key={i} style={{
                  fontSize: 13,
                  color: "#CBD5E1",
                  lineHeight: 1.6,
                  marginBottom: 8,
                  position: "relative",
                  paddingLeft: 16,
                }}>
                  <span style={{
                    position: "absolute",
                    left: -2,
                    top: 2,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: color,
                    opacity: 0.6,
                  }} />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Key Takeaway */}
          <div style={{
            background: `${color}0D`,
            border: `1px solid ${color}33`,
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
          }}>
            <p style={{ fontSize: 11, fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              Key Takeaway
            </p>
            <p style={{ fontSize: 13, color: "#E2E8F0", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
              {context.keyTakeaway}
            </p>
          </div>

          {/* Additional context from existing data */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {/* Pre-war / catalyst */}
            {preWar && (
              <div style={{ background: "#1E293B", borderRadius: 8, padding: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                  Catalyst
                </p>
                <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5, margin: 0 }}>
                  {preWar.catalyst}
                </p>
              </div>
            )}

            {/* Global impact */}
            {global && (
              <div style={{ background: "#1E293B", borderRadius: 8, padding: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                  Global Impact
                </p>
                <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5, margin: 0 }}>
                  {global.narrative}
                </p>
              </div>
            )}

            {/* Fiscal impact */}
            {fiscal && (
              <div style={{ background: "#1E293B", borderRadius: 8, padding: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                  Fiscal Impact
                </p>
                <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5, margin: 0 }}>
                  {fiscal.narrative}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EventExplainerPanel() {
  const { activeConflicts } = useEventToggle();
  const [expanded, setExpanded] = useState(null);

  const toggle = (conflict) => {
    setExpanded(prev => prev === conflict ? null : conflict);
  };

  /* Only show events that are currently active */
  const events = activeConflicts
    .filter(c => eventContext[c])
    .map(c => ({
      conflict: c,
      sp: sp500Data.find(d => d.conflict === c),
      preWar: preWarData.find(d => d.conflict === c),
      global: globalMarketsData.find(d => d.conflict === c),
      fiscal: fiscalSummary.find(d => d.conflict === c),
      context: eventContext[c],
    }));

  return (
    <section style={card}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#F8FAFC", marginBottom: 4 }}>
        Event Explainer
      </h2>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 8 }}>
        Why each event is included and what it reveals about markets, geopolitics, and economic policy
      </p>
      <p style={{ fontSize: 12, color: "#64748B", marginBottom: 20 }}>
        {events.length} events tracked — click any event to expand
      </p>

      {/* Timeline view */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {events.map(e => (
          <EventCard
            key={e.conflict}
            {...e}
            isExpanded={expanded === e.conflict}
            onToggle={() => toggle(e.conflict)}
          />
        ))}
      </div>
    </section>
  );
}
