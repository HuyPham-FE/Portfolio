import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ENTER_START } from "./triggers.ts";

/**
 * Sticky scroll budget in viewport heights. heroExit is not in it: it plays over
 * the one viewport in which the released stage scrolls away and About rises.
 */
export const HERO_SCROLL = {
  desktop: { parallax: 0.7, story: 2.6, hold: 0.2 },
  tablet: { parallax: 0.5, story: 1.7, hold: 0.15 },
} as const;
export type HeroScrollLengths = (typeof HERO_SCROLL)[keyof typeof HERO_SCROLL];

/** Camera targets for each chapter: its left edge, clamped to the real travel. */
export function cameraStops(
  offsets: number[],
  contentWidth: number,
  viewport: number,
) {
  const distance = Math.max(0, contentWidth - viewport);
  return offsets.map((offset) => Math.min(distance, Math.max(0, offset)));
}

const depth = (el: Element) => Number((el as HTMLElement).dataset.depth ?? 1);

type From = gsap.TweenVars | ((index: number) => gsap.TweenVars);
/**
 * One fromTo per target: a staggered fromTo only paints the first target's start
 * state before it plays, which flashes the rest. Separate tweens hide all of them.
 * Timelines here use `lazy: false` so start states land before the next paint.
 */
export function staggerFromTo(
  timeline: gsap.core.Timeline,
  targets: Element[],
  from: From,
  to: gsap.TweenVars,
  at: number,
  each = 0,
) {
  targets.forEach((target, i) =>
    timeline.fromTo(
      target,
      typeof from === "function" ? from(i) : from,
      { ...to },
      at + i * each,
    ),
  );
  return timeline;
}

/** Post-preloader entrance: backdrop, giant type, headline, mockup, panels, CTAs. */
export function createHeroEntrance(root: HTMLElement) {
  const q = (name: string) => [
    ...root.querySelectorAll<HTMLElement>(`[data-hero-enter="${name}"]`),
  ];
  const timeline = gsap.timeline({
    paused: true,
    defaults: { ease: "power3.out", lazy: false },
  });
  staggerFromTo(
    timeline,
    q("backdrop"),
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" },
    0,
  );
  staggerFromTo(
    timeline,
    q("type"),
    (i) => ({ opacity: 0, xPercent: i % 2 ? 8 : -8 }),
    { opacity: 1, xPercent: 0, duration: 1.3 },
    0.05,
    0.1,
  );
  staggerFromTo(
    timeline,
    q("line"),
    { yPercent: 115 },
    { yPercent: 0, duration: 0.85, ease: "power4.out" },
    0.2,
    0.1,
  );
  staggerFromTo(
    timeline,
    q("mockup"),
    {
      opacity: 0,
      y: 70,
      rotationX: 14,
      scale: 0.93,
      transformPerspective: 1200,
    },
    { opacity: 1, y: 0, rotationX: 0, scale: 1, duration: 1.05 },
    0.45,
  );
  staggerFromTo(
    timeline,
    q("panel"),
    { opacity: 0, y: 26, scale: 0.9 },
    { opacity: 1, y: 0, scale: 1, duration: 0.75 },
    0.7,
    0.08,
  );
  staggerFromTo(
    timeline,
    q("support"),
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.65 },
    0.9,
    0.1,
  );
  return timeline;
}

/**
 * One scrubbed master timeline (verticalParallax -> horizontalStory -> heroExit)
 * on one ScrollTrigger. The stage is CSS-sticky inside a tall section, so there is
 * no pin spacer and no fixed-position containing-block problem under `.page-enter`.
 */
export function createHeroScroll(
  root: HTMLElement,
  lengths: HeroScrollLengths,
) {
  gsap.registerPlugin(ScrollTrigger);
  const one = (s: string) => root.querySelector<HTMLElement>(s);
  const all = (s: string) => [...root.querySelectorAll<HTMLElement>(s)];
  const stage = one("[data-hero-stage]")!;
  const world = one("[data-hero-world]")!;
  const frames = all("[data-hero-frame]");
  const rows = all("[data-type-row]");
  const visibleRows = rows.slice(0, 2);
  const lateRow = rows[2];
  const { parallax, story, hold } = lengths;
  const sticky = parallax + story + hold;
  const exit = 1;

  root.dataset.enhanced = "true";
  root.style.setProperty("--hero-scroll", String(sticky));

  const vw = () => stage.clientWidth / 100;
  const vh = () => stage.clientHeight / 100;
  // Measured on every refresh: offsets do not include transforms.
  const stop = (i: number) => {
    const last = frames[frames.length - 1];
    const contentWidth = last ? last.offsetLeft + last.offsetWidth : 0;
    return (
      cameraStops(
        frames.map((frame) => frame.offsetLeft),
        contentWidth,
        stage.clientWidth,
      )[i] ?? 0
    );
  };

  const verticalParallax = gsap
    .timeline({ defaults: { ease: "none", duration: parallax, lazy: false } })
    .to(
      one("[data-hero-copy]"),
      { y: () => -26 * vh(), duration: parallax * 0.65, ease: "power1.in" },
      0,
    )
    .to(
      one("[data-hero-copy]"),
      { opacity: 0, duration: parallax * 0.4, ease: "power1.in" },
      parallax * 0.15,
    )
    .to(visibleRows[0] ?? [], { x: () => -9 * vw() }, 0)
    .to(visibleRows[1] ?? [], { x: () => 9 * vw() }, 0)
    .to(
      one("[data-hero-mockup]"),
      { y: () => -4 * vh(), x: () => -3 * vw(), rotation: -1.2 },
      0,
    )
    .to(
      all("[data-hero-panel]"),
      {
        y: (_: number, el: Element) => -depth(el) * 7 * vh(),
        rotation: (i: number) => (i % 2 ? 2.5 : -2.5),
      },
      0,
    )
    .fromTo(
      one("[data-layout-grid]"),
      { opacity: 0 },
      { opacity: 1, duration: parallax * 0.5 },
      parallax * 0.5,
    );
  staggerFromTo(
    verticalParallax,
    all("[data-design-line]"),
    { yPercent: 115 },
    { yPercent: 0, duration: parallax * 0.4, ease: "power2.out" },
    parallax * 0.5,
  );
  staggerFromTo(
    verticalParallax,
    all("[data-design-support]"),
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: parallax * 0.32, ease: "power2.out" },
    parallax * 0.6,
    0.03,
  );

  // Two eased camera legs read as one continuous move with a short dwell per chapter.
  const leg = story / 2;
  const horizontalStory = gsap
    .timeline({
      defaults: { ease: "power2.inOut", duration: leg, lazy: false },
    })
    .to(world, { x: () => -stop(1) }, 0)
    .to(world, { x: () => -stop(2) }, leg);
  // Depth: nearer layers travel further than the camera, far ones lag behind.
  frames.forEach((frame, i) => {
    const layers = all(
      `[data-hero-frame="${frame.dataset.heroFrame}"] [data-depth]`,
    );
    if (!layers.length) return;
    const shift = (sign: number) => (_: number, el: Element) =>
      sign * (depth(el) - 0.6) * 14 * vw();
    if (i > 0)
      horizontalStory.fromTo(layers, { x: shift(1) }, { x: 0 }, (i - 1) * leg);
    if (i < frames.length - 1)
      horizontalStory.to(layers, { x: shift(-1) }, i * leg);
  });
  horizontalStory
    .to(visibleRows[0] ?? [], { x: () => -22 * vw(), opacity: 0.55 }, 0)
    .to(visibleRows[1] ?? [], { x: () => 20 * vw(), duration: leg * 1.4 }, 0)
    .to(visibleRows[0] ?? [], { opacity: 0, duration: leg * 0.5 }, leg * 1.3)
    .fromTo(
      lateRow ?? [],
      { opacity: 0, x: () => 12 * vw() },
      { opacity: 1, x: 0, duration: leg * 0.8 },
      leg * 1.2,
    );

  // Runs while the stage scrolls away, so About is already rising: no empty frame.
  const heroExit = gsap
    .timeline({
      defaults: { ease: "power1.in", duration: exit * 0.7, lazy: false },
    })
    .to(
      all("[data-hero-exit]"),
      {
        x: (i: number) => (i % 2 ? 1 : -1) * 10 * vw(),
        y: (i: number) => (i % 2 ? 1 : -1) * 8 * vh(),
        rotation: (i: number) => (i % 2 ? 3 : -3),
        opacity: 0,
        duration: exit * 0.5,
      },
      0,
    )
    .to(
      all("[data-hero-exit-text]"),
      { y: () => -10 * vh(), opacity: 0, duration: exit * 0.5 },
      0,
    )
    .to(
      [lateRow, visibleRows[1]].filter(Boolean),
      { scale: 1.2, opacity: 0, duration: exit * 0.6 },
      0,
    )
    .to(
      one("[data-hero-atmosphere]"),
      { opacity: 0, ease: "none", duration: exit * 0.6 },
      0,
    )
    .fromTo(
      one("[data-hero-carry]"),
      { opacity: 0, scale: 0.7 },
      { opacity: 1, scale: 1, ease: "power2.out", duration: exit * 0.45 },
      0.05,
    )
    .to(
      one("[data-hero-carry]"),
      { opacity: 0, ease: "power1.inOut", duration: exit * 0.45 },
      exit * 0.55,
    );

  const master = gsap
    .timeline({ paused: true })
    .add(verticalParallax, 0)
    .add(horizontalStory, parallax)
    // Panels start leaving just before the stage releases, then About takes over.
    .add(heroExit, sticky - 0.15);
  // Keep the timeline exactly as long as the scroll it maps onto.
  master.to(
    {},
    { duration: Math.max(0, sticky + exit - master.duration()) },
    master.duration(),
  );

  const trigger = ScrollTrigger.create({
    id: "hero-story",
    trigger: root,
    start: "top top",
    end: "bottom top",
    animation: master,
    scrub: 0.8,
    invalidateOnRefresh: true,
  });
  // The section just grew to its scroll length; triggers below must re-measure.
  const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());

  return () => {
    cancelAnimationFrame(refreshFrame);
    trigger.kill();
    master.revert();
    delete root.dataset.enhanced;
    root.style.removeProperty("--hero-scroll");
  };
}

/** Narrow or short screens: natural flow, chapters fade up once. */
export function createHeroReveal(root: HTMLElement) {
  gsap.registerPlugin(ScrollTrigger);
  const tweens = [
    ...root.querySelectorAll<HTMLElement>("[data-hero-chapter]"),
  ].map((chapter) =>
    gsap.fromTo(
      chapter,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: chapter, start: ENTER_START, once: true },
      },
    ),
  );
  return () => tweens.forEach((tween) => tween.revert());
}
