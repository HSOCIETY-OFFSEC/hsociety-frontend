# Founder Launch Audit: Problems and Risks

Date: 2026-03-07
Project: `hsociety-frontend`

## Critical Pre-Launch Issues

1. Broken student lesson route in `CourseLearning.jsx` (`/student-learning/module/...`) did not match router path.
2. Public CTAs sending users to protected `/corporate/pentest` without funnel handling.
3. Internal footer links used `<a href="/...">`, forcing full page reloads in SPA.
4. Heavy 3D rendering components loaded too early on landing, increasing initial JS and runtime overhead.
5. Main JS chunk is oversized (build output flagged > 500 kB warning).
6. Very large image assets (multiple 1.4MB–3MB PNG files) significantly increase page weight.
7. SEO setup missing canonical tag, social preview images, JSON-LD schema.
8. Missing crawler files (`robots.txt`, `sitemap.xml`) for growth/SEO readiness.

## UI/UX Problems

1. Some clickable containers used non-semantic `div` instead of keyboard-accessible buttons.
2. Landing page is long and section-heavy, diluting value hierarchy and CTA focus.
3. Interaction states and micro-feedback are inconsistent across sections.
4. Motion density is high on landing (risk of distraction and lower perceived speed).
5. Error/loading/empty states are uneven across feature pages.

## Performance Problems

1. Large static image payload in `src/assets` (~37MB total source assets).
2. Landing threat map and 3D globe can consume GPU/CPU on mobile and low-end devices.
3. Community profile visual effects add unnecessary animation/paint cost.
4. Landing makes 3 parallel API calls immediately on mount.
5. Scroll reveal hook observes full DOM and uses `MutationObserver` globally.
6. CP/streak data fetched in both navbar and workspace layout (duplicate network calls).
7. Global background image and fixed attachment can increase repaint cost on mobile.

## Product/Growth Problems

1. Analytics funnel is not production-ready (no full conversion instrumentation strategy).
2. Enterprise trust proof is not surfaced early enough in the landing hierarchy.
3. Messaging has grammar/clarity issues in several CTA labels and copy blocks.
4. Limited lead-capture journey beyond newsletter form.
5. No formal variant landing pages for distinct personas (student vs company buyer).

## Architecture / DX Problems

1. Route path strings are repeated in many places; high risk of string drift and regressions.
2. No first-party tests in `src` (no unit/integration/e2e baseline).
3. Placeholder security/encryption modules remain in production code paths.
4. CSS is highly fragmented (150+ style files), increasing maintenance overhead.
5. Shared data-fetch and cache strategy is not centralized.

## Notes

- The fixes implemented in this pass are listed in commit-ready code changes.
- Remaining issues (especially image optimization and analytics instrumentation) should be handled in a dedicated follow-up performance/growth sprint.
