import { gsap } from "gsap";

export interface StackGeometry {
  height: number;
  gap: number;
  viewport: number;
  top: number;
  edge: number;
  tail: number;
  count: number;
}
export function stackTiming(g: StackGeometry) {
  const stride = g.height + g.gap;
  const settled = Array.from(
    { length: g.count },
    (_, i) => i * (stride - g.edge),
  );
  const end = settled.at(-1)! + g.tail;
  const travel = Math.min(g.viewport * 0.85, stride - g.edge);
  return {
    stride,
    settled,
    end,
    travel,
    stageHeight: g.height + (g.count - 1) * g.edge,
  };
}
/** One sticky stage and one scroll clock own every card, including the full final-card ascent. */
export function createServiceStackTimeline(
  root: HTMLElement,
  geometry: StackGeometry,
) {
  const cards = [...root.querySelectorAll<HTMLElement>("[data-service-card]")];
  const timing = stackTiming(geometry);
  const timeline = gsap.timeline({
    paused: true,
    defaults: { ease: "none", lazy: false },
  });
  const clock = { value: 0 };
  timeline.to(clock, { value: 1, duration: timing.end }, 0);
  const layers = [
    ...root.querySelectorAll<HTMLElement>("[data-service-layer]"),
  ];
  layers.forEach((layer, i) => {
    if (i === 0) {
      gsap.set(layer, { y: 0 });
      return;
    }
    timeline.fromTo(
      layer,
      { y: geometry.viewport - geometry.top + 32 },
      { y: i * geometry.edge, duration: timing.travel },
      timing.settled[i] - timing.travel,
    );
  });
  cards.forEach((card, i) => {
    const entrance = i === 0 ? 0 : timing.settled[i] - timing.travel;
    const duration = Math.min(geometry.height * 0.55, timing.end - entrance);
    const mockup = card.querySelector("[data-service-mockup]");
    const ribbons = card.querySelectorAll("[data-service-ribbon]");
    const logos = card.querySelectorAll("[data-service-logo]");
    const paths = card.querySelectorAll("[data-service-line]");
    if (mockup)
      timeline.fromTo(
        mockup,
        { y: 28, scale: 0.94, rotationY: -5 },
        { y: 0, scale: 1, rotationY: 0, duration },
        entrance,
      );
    if (ribbons.length)
      timeline.fromTo(
        ribbons,
        { y: 22, opacity: 0.35 },
        { y: 0, opacity: 1, duration },
        entrance,
      );
    if (logos.length)
      timeline.fromTo(
        logos,
        { y: 8, opacity: 0.55 },
        {
          y: 0,
          opacity: 1,
          duration: duration * 0.6,
          stagger: duration * 0.08,
        },
        entrance,
      );
    if (paths.length)
      timeline.fromTo(
        paths,
        { strokeDasharray: 100, strokeDashoffset: 100 },
        { strokeDashoffset: 0, duration },
        entrance,
      );
    for (let next = i + 1; next < cards.length; next++) {
      const finish = timing.settled[next];
      const overlap = Math.min(geometry.height * 0.8, timing.stride * 0.8);
      timeline.to(
        card,
        {
          scale: 1 - (next - i) * 0.02,
          duration: overlap,
          transformOrigin: "50% 0%",
        },
        finish - overlap,
      );
      const shade = card.querySelector("[data-service-shade]");
      if (shade)
        timeline.to(
          shade,
          { opacity: (next - i) * 0.035, duration: overlap },
          finish - overlap,
        );
    }
  });
  return timeline;
}
