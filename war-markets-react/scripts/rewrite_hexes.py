#!/usr/bin/env python3
"""
Replace inline hex color literals in war-markets-react components with theme
token references.

  attr="#1E293B"          ->  attr={t.panel}
  attr={"#1E293B"}         ->  attr={t.panel}
  '#1E293B' / "#1E293B"    ->  t.panel  (in object literals)

The PREFIX of attr-form lookbacks could let us be smarter, but in practice
the simple substitution is good enough — every component will get a
useTheme() hook added by hand after this script runs.

Run: python scripts/rewrite_hexes.py src
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

# Mapping is case-insensitive on the input hex. Keys in lowercase.
HEX_TO_TOKEN = {
    # page / chrome / borders
    '#0f172a': 'bg',
    '#1e293b': 'panel',
    '#334155': 'border',
    '#475569': 'axis',

    # text ramp
    '#f8fafc': 'textHigh',
    '#f1f5f9': 'textHigh',
    '#e2e8f0': 'textHighAlt',
    '#cbd5e1': 'textMid',
    '#94a3b8': 'textMute',
    '#64748b': 'textLow',

    # accents
    '#6366f1': 'indigo',
    '#818cf8': 'indigoSoft',
    '#a5b4fc': 'indigoFaint',
    '#8b5cf6': 'violet',
    '#a78bfa': 'violetSoft',
    '#10b981': 'green',
    '#34d399': 'greenSoft',
    '#ef4444': 'red',
    '#f87171': 'redSoft',
    '#f59e0b': 'amber',
    '#fbbf24': 'amberStrong',
    '#f97316': 'orange',
    '#fb923c': 'orangeSoft',
    '#3b82f6': 'blue',
    '#60a5fa': 'blueSoft',
    '#06b6d4': 'cyan',
    '#22d3ee': 'cyanBright',
    '#ec4899': 'pink',
    '#f472b6': 'pinkSoft',
    '#a855f7': 'purple',
    '#14b8a6': 'teal',
    '#84cc16': 'lime',
    '#e11d48': 'crimson',
}

# Sort keys longest-first so future longer patterns don't get partial-matched.
KEYS = sorted(HEX_TO_TOKEN.keys(), key=len, reverse=True)


JS_DECL_KW = re.compile(r'\b(?:const|let|var|return|throw|case|in|of|from|typeof|new|await|yield)\s*$')


def _attr_repl(token: str):
    """Replacer for `attr="#hex"`. Skips when the match is actually a JS
    assignment (`const X = "#hex"`, `obj.style.color = "#hex"`, etc.)."""
    def repl(m: re.Match) -> str:
        whole = m.string
        start = m.start()
        # Scan back to the start of the current line for context
        line_start = whole.rfind('\n', 0, start) + 1
        prefix = whole[line_start:start]
        # Skip if the line looks like a JS variable declaration or
        # any other expression context. JSX attributes in JSX tags
        # are typically preceded only by whitespace + sibling attrs,
        # never by `const`/`let`/`var` etc. on the same line.
        if JS_DECL_KW.search(prefix):
            return m.group(0)
        # Skip when preceded by `=` (e.g. `obj.foo = "#hex"` after `.`-strip)
        if re.search(r'[=,]\s*$', prefix):
            return m.group(0)
        return f'{m.group(1)}={{t.{token}}}'
    return repl


def transform(src: str) -> str:
    out = src
    for hex_lit in KEYS:
        token = HEX_TO_TOKEN[hex_lit]

        # JSX attribute form:  attr="#hex"  ->  attr={t.token}
        # Negative lookbehind on `.` skips property access like
        #   `e.currentTarget.style.color = "#hex"`.
        attr_pat = re.compile(
            r'(?<![.\w])(\w+)\s*=\s*"' + re.escape(hex_lit) + r'"',
            re.IGNORECASE,
        )
        out = attr_pat.sub(_attr_repl(token), out)

        # Standalone-quoted form (in object literals, arrays, or JS
        # assignments): '#hex' or "#hex"  ->  t.token
        str_pat = re.compile(
            r"(['\"])" + re.escape(hex_lit) + r"\1",
            re.IGNORECASE,
        )
        out = str_pat.sub(f't.{token}', out)

    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('roots', nargs='+')
    ap.add_argument('--ext', default='.jsx,.js,.tsx,.ts')
    ap.add_argument('--dry-run', action='store_true')
    args = ap.parse_args()

    exts = tuple(e.strip() for e in args.ext.split(',') if e.strip())
    files: list[Path] = []
    for root in args.roots:
        p = Path(root)
        if p.is_file():
            files.append(p)
        else:
            for ext in exts:
                files.extend(p.rglob(f'*{ext}'))

    # Skip the theme directory and data files — those define the palette.
    files = [
        f for f in files
        if 'theme' not in f.parts and 'data' not in f.parts
    ]

    changed = 0
    for f in sorted(set(files)):
        src = f.read_text()
        new = transform(src)
        if new != src:
            changed += 1
            if args.dry_run:
                print(f'would rewrite {f}')
            else:
                f.write_text(new)
                print(f'rewrote {f}')
    print(f'\n{"would change" if args.dry_run else "changed"} {changed} files')
    return 0


if __name__ == '__main__':
    sys.exit(main())
