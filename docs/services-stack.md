# Services scroll stack

The Services section is an addition between the existing GrowthStory and FeaturedSlider. GrowthStory is deliberately retained following the user's correction. No existing section animation is replaced.

Content: `src/data/services.ts`, exposed by `getServices()` in `src/lib/content.ts`. The content contract is `ServiceStackContent`. The Website card references the existing `toan-interior` concept and its local image; this is not a screenshot of a delivered client website. SEO and advertising illustrations are native HTML/SVG and explicitly labelled as illustrative, with no invented results.

## Motion

A single `services-stack` ScrollTrigger drives `createServiceStackTimeline`. One sticky stage holds all three layers; GSAP explicitly translates each incoming layer from below the viewport to its final 20/40 px offset. Inner cards scale to 0.98/0.96. There are no wheel listeners, snap, artificial scroll jumps, or nested pins.

Each card is viewport height minus 156 px. The stage height is the measured card height plus the two exposed top edges. Each incoming card has the same 0.85-viewport scroll travel, including card 03. The final state holds for another 0.3 viewport of scroll, with the stage still visible. Track height is exactly stage height plus timeline distance: there is no trailing blank padding after release. The 24 px section bottom padding and scoped Featured Projects spacing keep the transition compact. Direct scrub reverses both layer positions and inner illustrations.

Stacking runs at width ≥900 px and height ≥760 px only when card copy fits. Smaller/shorter screens, zoomed content that does not fit, reduced-motion mode and the pre-hydration baseline use natural flow. Images have fixed geometry. Font/image completion and viewport changes rebuild measurements. ResizeObserver, image/resize listeners, RAF and GSAP contexts are cleaned up on unmount and media changes.

## Checks

- `npm run test:motion`: forward/backward timeline states, final hold for 760–1440 px viewport heights, cleanup, and existing motion regression tests.
- `npm run build`: production static export.
- `npm run verify:export` and `npm run verify:redesign`: existing routes, sections and local assets.
- `node scripts/verify-services.mjs`: new markup, section placement, CTA, no competing animation selectors, and no fabricated KPIs.

Browser UI was unavailable during implementation (`cua` listed no browsers; opening IAB returned unavailable). The following still require actual browser QA:

1. At 1440×900 and 1920×1080, open `/#services`, scroll slowly and quickly forward, then backward; watch the 20 px exposed edges and final hold.
2. Resize while midway through the stack; the current scroll position should remain usable and Featured Projects should follow without overlap.
3. At 1024×768, verify all copy/CTA fits. At 768×1024 and 390×844, verify natural reading order, no horizontal overflow, and readable platform labels.
4. Enable reduced motion and increase text size; verify static full-content cards, working Process CTA, and no clipped content.
