#!/usr/bin/env python3
"""
Auto-insert `useTheme()` hook calls into every top-level function body that
references theme tokens (`t.<name>`) plus an import for `useTheme` at the
top of the file.

Targets the war-markets-react codebase where the prior hex rewrite
substituted hex literals with `t.X` references but didn't define `t`.

Heuristic: any line starting at column zero matching
  function FooBar( ... ) {           (capitalized name → React component)
  export function FooBar( ... ) {
  export default function FooBar( ... ) {
followed by a body that contains `t.<word>` gets:
  const t = useTheme().tokens;
inserted after the opening brace.

Usage: python scripts/inject_useTheme.py src
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


FUNC_HEAD = re.compile(
    r'^(export\s+default\s+function|export\s+function|function)\s+([A-Z]\w*)\s*\([^)]*\)\s*\{',
    re.MULTILINE,
)

T_REF = re.compile(r'\bt\.[a-zA-Z_]\w*')


def find_matching_brace(src: str, open_idx: int) -> int:
    """Given the position of an opening brace, return the index of the matching
    closing brace. Counts {} only outside string/comment contexts (rough
    handling — ignores template literals; sufficient for our codebase)."""
    depth = 1
    i = open_idx + 1
    n = len(src)
    while i < n and depth > 0:
        c = src[i]
        # skip block comments
        if c == '/' and i + 1 < n and src[i + 1] == '*':
            end = src.find('*/', i + 2)
            i = end + 2 if end != -1 else n
            continue
        # skip line comments
        if c == '/' and i + 1 < n and src[i + 1] == '/':
            end = src.find('\n', i + 2)
            i = end if end != -1 else n
            continue
        # skip string literals
        if c in '"\'':
            quote = c
            i += 1
            while i < n and src[i] != quote:
                if src[i] == '\\':
                    i += 2
                    continue
                i += 1
            i += 1
            continue
        # skip template literals (basic — doesn't handle nested ${ })
        if c == '`':
            i += 1
            while i < n and src[i] != '`':
                if src[i] == '\\':
                    i += 2
                    continue
                i += 1
            i += 1
            continue
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return -1


def transform(src: str, import_path: str) -> tuple[str, int]:
    """Insert `const t = useTheme().tokens;` at the top of every component-
    function body that uses `t.X`. Returns (new_src, count_inserted)."""
    inserted = 0
    # Walk function heads from end -> start so insertions don't shift earlier offsets
    matches = list(FUNC_HEAD.finditer(src))
    if not matches:
        return src, 0

    edits: list[tuple[int, str]] = []  # (insert_position, text)
    for m in matches:
        head_start = m.start()
        brace_open = m.end() - 1  # position of `{`
        brace_close = find_matching_brace(src, brace_open)
        if brace_close == -1:
            continue
        body = src[brace_open + 1 : brace_close]
        # Skip if body has no `t.X` reference
        if not T_REF.search(body):
            continue
        # Skip if body already declares `const t =`
        if re.search(r'\bconst\s+t\s*=', body):
            continue
        # Compute indentation: use 2 spaces inside the function body
        indent = '  '
        insertion = f'\n{indent}const t = useTheme().tokens;'
        edits.append((brace_open + 1, insertion))

    # Apply edits in reverse order
    out = src
    for pos, text in sorted(edits, reverse=True):
        out = out[:pos] + text + out[pos:]
        inserted += 1

    if inserted == 0:
        return src, 0

    # Ensure `import { useTheme } from '...'` is present.
    if 'useTheme' not in out or 'from "../theme/ThemeContext"' not in out and "from '../theme/ThemeContext'" not in out:
        if 'useTheme' not in re.sub(r'^//.*$', '', out, flags=re.MULTILINE):
            # find last import line
            import_lines = list(re.finditer(r'^import .*?;\s*$', out, re.MULTILINE))
            new_import = f"import {{ useTheme }} from '{import_path}';"
            if import_lines:
                last = import_lines[-1]
                out = out[: last.end()] + '\n' + new_import + out[last.end():]
            else:
                out = new_import + '\n' + out

    return out, inserted


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('roots', nargs='+')
    ap.add_argument('--import-path', default='../theme/ThemeContext')
    ap.add_argument('--ext', default='.jsx,.js')
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

    files = [
        f for f in files
        if 'theme' not in f.parts and 'data' not in f.parts
    ]

    total_inserts = 0
    changed_files = 0
    src_root = Path(args.roots[0]).resolve()
    for f in sorted(set(files)):
        src = f.read_text()
        # Compute relative import path from this file to src/theme/ThemeContext
        rel_dir = f.resolve().parent.relative_to(src_root)
        depth = len(rel_dir.parts)
        rel_prefix = '../' * depth if depth else './'
        import_path = rel_prefix + 'theme/ThemeContext'
        new, n = transform(src, import_path)
        if n > 0:
            total_inserts += n
            changed_files += 1
            if args.dry_run:
                print(f'would insert {n} hook(s) in {f}')
            else:
                f.write_text(new)
                print(f'inserted {n} hook(s) in {f}')
    print(f'\n{"would change" if args.dry_run else "changed"} {changed_files} files, {total_inserts} hooks total')
    return 0


if __name__ == '__main__':
    sys.exit(main())
