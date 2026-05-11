#!/usr/bin/env python3
"""
Convert `t.X` references that are NOT inside a function body to
`'var(--c-x-kebab)'` strings. Object literals and control-flow blocks at
module top-level still get the conversion because `t` only exists inside
the component function bodies where `useTheme()` was called.

Strategy: walk char-by-char tracking only FUNCTION-body brace depth.
A `{` is a function brace if it's preceded (after stripping whitespace)
by `=>` or by a `)` whose matching `(` is preceded by `function` or any
identifier other than `if`/`for`/`while`/`switch`/`catch`/`do`/`with`.
All other `{` are ignored for depth purposes (object literals, control
flow blocks). When function-brace depth is 0, we are at module scope.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

T_REF = re.compile(r'\bt\.([a-zA-Z_]\w*)')
BLOCK_KEYWORDS = {'if', 'for', 'while', 'switch', 'catch', 'do', 'with'}


def camel_to_kebab(name: str) -> str:
    return re.sub(r'(?<!^)(?=[A-Z])', '-', name).lower()


def is_function_brace(src: str, pos: int) -> bool:
    """`pos` is the index of `{`. Return True if it opens a function body."""
    # Walk back skipping whitespace
    i = pos - 1
    while i >= 0 and src[i].isspace():
        i -= 1
    if i < 0:
        return False
    # `=>` arrow
    if i >= 1 and src[i] == '>' and src[i - 1] == '=':
        return True
    # `)` — could be function param list or control-flow condition
    if src[i] == ')':
        depth = 1
        j = i - 1
        while j >= 0 and depth > 0:
            cc = src[j]
            if cc == ')':
                depth += 1
            elif cc == '(':
                depth -= 1
            j -= 1
        # j is index of char before matching '('
        # skip whitespace
        while j >= 0 and src[j].isspace():
            j -= 1
        if j < 0:
            return True  # default to function body at file start
        # extract preceding identifier
        end = j + 1
        while j >= 0 and (src[j].isalnum() or src[j] in '_$'):
            j -= 1
        ident = src[j + 1:end]
        if ident in BLOCK_KEYWORDS:
            return False
        return True
    return False


def transform(src: str) -> str:
    out: list[str] = []
    n = len(src)
    i = 0
    fn_depth = 0
    # Stack of bools: True if the open `{` was a function brace
    brace_stack: list[bool] = []
    in_string = None
    line_comment = False
    block_comment = False

    while i < n:
        c = src[i]
        # comments
        if line_comment:
            out.append(c)
            if c == '\n':
                line_comment = False
            i += 1
            continue
        if block_comment:
            out.append(c)
            if c == '*' and i + 1 < n and src[i + 1] == '/':
                out.append(src[i + 1])
                i += 2
                block_comment = False
                continue
            i += 1
            continue
        # strings
        if in_string is not None:
            out.append(c)
            if c == '\\' and i + 1 < n:
                out.append(src[i + 1])
                i += 2
                continue
            if c == in_string:
                in_string = None
            i += 1
            continue
        # comment starts
        if c == '/' and i + 1 < n and src[i + 1] == '/':
            out.append(c)
            line_comment = True
            i += 1
            continue
        if c == '/' and i + 1 < n and src[i + 1] == '*':
            out.append(c)
            out.append(src[i + 1])
            block_comment = True
            i += 2
            continue
        # string starts
        if c in ('"', "'", '`'):
            out.append(c)
            in_string = c
            i += 1
            continue
        # braces
        if c == '{':
            is_fn = is_function_brace(src, i)
            brace_stack.append(is_fn)
            if is_fn:
                fn_depth += 1
            out.append(c)
            i += 1
            continue
        if c == '}':
            if brace_stack:
                was_fn = brace_stack.pop()
                if was_fn:
                    fn_depth -= 1
            out.append(c)
            i += 1
            continue
        # match `t.<name>` only when at module scope (fn_depth == 0)
        if fn_depth == 0 and c == 't':
            m = T_REF.match(src, i)
            if m:
                prev = src[i - 1] if i > 0 else ' '
                if not (prev.isalnum() or prev == '_'):
                    name = m.group(1)
                    out.append(f"'var(--c-{camel_to_kebab(name)})'")
                    i = m.end()
                    continue
        out.append(c)
        i += 1

    return ''.join(out)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('roots', nargs='+')
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
        if 'theme' not in f.parts and 'data' not in f.parts and 'context' not in f.parts
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
