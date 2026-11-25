import { gsap } from "gsap";
/** Called inside the owning React GSAP context. No pinning or wheel interception. */
export function createGrowthTimeline(section: HTMLElement) {
  const q = (s: string) => section.querySelector(s);
  const all = (s: string) => [...section.querySelectorAll(s)];
  const timeline = gsap.timeline({
    defaults: { ease: "power2.out" },
    onUpdate: () => {
      const p = timeline.progress();
      section.dataset.storyStage = p < 0.34 ? "0" : p < 0.67 ? "1" : "2";
    },
  });
  timeline
    .addLabel("build", 0)
    .from(
      q("[data-build-browser]"),
      { y: 75, rotationY: -12, scale: 0.88, opacity: 0.15, duration: 1 },
      0,
    )
    .from(
      q("[data-build-code]"),
      { x: -35, y: 20, opacity: 0, duration: 0.8 },
      0.15,
    )
    .from(q("[data-build-tech]"), { y: 15, opacity: 0, duration: 0.7 }, 0.4)
    .addLabel("connect", 1)
    .fromTo(
      q("[data-growth-connection]"),
      { strokeDasharray: 1, strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 1.35, ease: "none" },
      0.8,
    )
    .from(
      q("[data-growth-signal]"),
      { opacity: 0, scale: 0, transformOrigin: "center", duration: 0.4 },
      1.4,
    )
    .to(q("[data-build]"), { y: -15, duration: 1.4 }, 1)
    .addLabel("grow", 2)
    .from(
      all("[data-grow-item]"),
      { x: 45, y: 35, rotationY: 8, opacity: 0, stagger: 0.2, duration: 0.8 },
      1.5,
    )
    .fromTo(
      q("[data-story-chart]"),
      { strokeDasharray: 1, strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 1, ease: "none" },
      2,
    )
    .to({}, { duration: 0.2 }, 3);
  return timeline;
}
