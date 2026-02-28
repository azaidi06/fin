# Phase 2: Homepage Visual Enhancements

Ideas from Claude + Gemini review of the landing page. These add visual richness but require more implementation effort.

## 1. Sparklines in Cards
Add tiny inline charts inside each card that preview the data behind it:
- **Post-Conflict Reaction**: Mini line chart showing a dip and recovery pattern
- **Pre-War Buildup**: Small trending line (up or down)
- **Global Markets**: Cluster of small diverging lines (different indices)
- **Fiscal Impact**: Upward inflation curve
- **Cost of Living**: Stepped bar showing price increases
- **Methodology**: No chart (keep text-only)

**Implementation**: Use lightweight `<svg>` paths with hardcoded coordinates (no data fetching). ~30 lines of SVG per card. Could extract a `<MiniSparkline points={[...]} color="..." />` component.

## 2. Subtle Background Animation
A slow-moving, low-opacity animated element in the hero area:
- Option A: CSS-animated gradient that slowly shifts hue
- Option B: Very faint SVG stock-chart line that draws itself on load
- Option C: Particle dots that drift slowly (canvas-based, heavier)

**Recommendation**: Option A or B. Option C is overkill for a data site.

## 3. Hero Stat Ticker
Show 2-3 rotating headline stats above the cards to draw the eye:
- "S&P 500 fell 33.8% after Pearl Harbor"
- "Markets recovered in 96 trading days after the Gulf War"
- "Federal debt hit 118% of GDP during WWII"

**Implementation**: CSS animation cycling through 4-5 stats with a fade transition. Data is static/hardcoded.

## 4. Card Hover: Data Preview Tooltip
On hover, show a small floating preview of the actual data (e.g., a mini chart or key stat) before the user clicks through.

**Implementation**: Absolute-positioned overlay with a fade-in. Heavier lift — needs data from each panel extracted into summary form.

## Priority Order
1. Sparklines in cards (biggest visual bang, moderate effort)
2. Hero stat ticker (quick win, high impact)
3. Background animation (polish, low effort if CSS-only)
4. Hover data previews (nice-to-have, highest effort)
