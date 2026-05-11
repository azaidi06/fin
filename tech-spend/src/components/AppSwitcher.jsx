const APPS = [
  { id: "war-markets", label: "Money + War", href: "/" },
  { id: "tech-spend", label: "Tech Spend", href: "/tech-spend/" },
  { id: "options", label: "Options", href: "https://app.money4war.com" },
];

const CURRENT = "tech-spend";

export default function AppSwitcher() {
  return (
    <nav
      aria-label="Sibling apps"
      style={{
        background: "var(--c-glass-bg)",
        border: "1px solid var(--c-border)",
        backdropFilter: "blur(8px)",
      }}
      className="flex items-center gap-1 rounded-full px-1 py-1"
    >
      {APPS.map((app) => {
        const active = app.id === CURRENT;
        return (
          <a
            key={app.id}
            href={app.href}
            aria-current={active ? "page" : undefined}
            className="px-3 py-1 text-xs font-medium rounded-full transition-colors"
            style={
              active
                ? {
                    background: "var(--c-pill-active-bg)",
                    color: "var(--c-pill-active-text)",
                    boxShadow: "0 0 0 1px var(--c-pill-active-border)",
                  }
                : { color: "var(--c-text-mute)" }
            }
          >
            {app.label}
          </a>
        );
      })}
    </nav>
  );
}
