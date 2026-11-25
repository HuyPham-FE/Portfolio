import { gsap } from "gsap";

/** Scroll reveal and pointer motion own separate wrappers. Static content stays visible. */
export function createAboutEntrance(
  root: HTMLElement,
  part: "all" | "text" | "portrait" = "all",
) {
  const timeline = gsap.timeline({
    paused: true,
    defaults: { ease: "power3.out", lazy: false },
  });
  const reveal = (
    name: string,
    from: gsap.TweenVars,
    to: gsap.TweenVars,
    at: number,
  ) => {
    const targets = root.querySelectorAll(`[data-about-${name}]`);
    // The supplied artwork already contains its handwritten decorations.
    if (targets.length) timeline.fromTo(targets, from, to, at);
  };
  if (part !== "portrait") {
    reveal(
      "line",
      { yPercent: 110 },
      { yPercent: 0, duration: 0.95, stagger: 0.09 },
      0,
    );
    reveal(
      "body",
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75 },
      0.35,
    );
    reveal(
      "link",
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65 },
      0.55,
    );
  }
  if (part !== "text") {
    const offset = part === "all" ? 0.15 : 0;
    reveal(
      "frame",
      { clipPath: "inset(13% 0% 87% 0% round 100px 28px 100px 28px)" },
      { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.2 },
      offset,
    );
    reveal("photo", { scale: 1.08 }, { scale: 1, duration: 1.3 }, offset);
    reveal(
      "atmosphere",
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.1 },
      offset + 0.1,
    );
    reveal(
      "card",
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65 },
      offset + 0.65,
    );
    reveal(
      "note",
      { y: 8, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      offset + 0.95,
    );
    reveal(
      "signature",
      { y: 8, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      offset + 1.12,
    );
  }
  return timeline;
}
export function portraitPointer(x: number, y: number) {
  const clamp = (value: number) => Math.max(-1, Math.min(1, value));
  return {
    x: clamp(x),
    y: clamp(y),
    rotationY: clamp(x) * 2.3,
    rotationX: -clamp(y) * 2,
  };
}
