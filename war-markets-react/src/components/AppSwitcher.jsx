const APPS = [
  { id: "war-markets", label: "Money + War", href: "/" },
  { id: "tech-spend", label: "Tech Spend", href: "/tech-spend/" },
  { id: "options", label: "Options", href: "https://app.money4war.com" },
];

const CURRENT = "war-markets";

export default function AppSwitcher() {
  return (
    <nav
      aria-label="Sibling apps"
      style={{
        background: 'var(--c-glass-bg)',
        border: '1px solid var(--c-border)',
        backdropFilter: 'blur(8px)',
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
                    background: 'rgba(99, 102, 241, 0.20)',
                    color: 'var(--c-indigo-faint)',
                    boxShadow: '0 0 0 1px rgba(99, 102, 241, 0.40)',
                  }
                : { color: 'var(--c-text-mute)' }
            }
          >
            {app.label}
          </a>
        );
      })}
    </nav>
  );
}
