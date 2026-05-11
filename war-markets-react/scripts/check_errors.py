"""Capture browser console errors from war-markets-react."""
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = b.new_context(viewport={'width': 1200, 'height': 800})
    page = ctx.new_page()
    errors = []
    page.on('pageerror', lambda exc: errors.append(('pageerror', str(exc))))
    page.on('console', lambda msg: errors.append((msg.type, msg.text)) if msg.type in ('error', 'warning') else None)
    page.goto('http://localhost:5173/', wait_until='networkidle')
    page.wait_for_timeout(800)
    for typ, msg in errors[:20]:
        print(f'[{typ}] {msg[:200]}')
    b.close()
