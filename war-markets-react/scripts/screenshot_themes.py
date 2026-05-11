"""Capture dark + light theme screenshots of war-markets-react."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT_DIR = Path(sys.argv[1] if len(sys.argv) > 1 else '.')
URL = 'http://localhost:5173/'


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={'width': 1440, 'height': 1000})
        page = ctx.new_page()
        for theme in ('dark', 'light'):
            page.goto(URL, wait_until='domcontentloaded')
            page.evaluate(f"localStorage.setItem('war-markets-theme', '{theme}')")
            page.goto(URL, wait_until='networkidle')
            page.wait_for_timeout(1500)
            out_home = OUT_DIR / f'war_markets_home_{theme}.png'
            page.screenshot(path=str(out_home), full_page=False)
            print(f'wrote {out_home}')
            # Click the Fiscal Impact tab to test a chart-heavy panel
            try:
                page.get_by_text('Fiscal Impact', exact=True).first.click(timeout=2000)
                page.wait_for_timeout(1500)
                out_fiscal = OUT_DIR / f'war_markets_fiscal_{theme}.png'
                page.screenshot(path=str(out_fiscal), full_page=False)
                print(f'wrote {out_fiscal}')
            except Exception as e:
                print(f'fiscal screenshot skipped: {e}')
        browser.close()


if __name__ == '__main__':
    main()
