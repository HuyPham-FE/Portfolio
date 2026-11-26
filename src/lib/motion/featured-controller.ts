import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CAMERA,
  CARD,
  cardCenter,
  cardSlices,
  pixelsPerUnit,
  ribbonEdge,
  SLICES,
} from "./featured-orbit.ts";

/**
 * Scroll-driven helix: the stage is CSS-sticky inside a tall wrapper, so there is
 * no GSAP pin or spacer for downstream triggers to account for.
 */
export function createFeaturedController(root: HTMLElement, count: number) {
  gsap.registerPlugin(ScrollTrigger);
  const roll = root.querySelector<HTMLElement>("[data-orbit-roll]")!;
  const stage = root.querySelector<HTMLElement>("[data-orbit-stage]")!;
  const helix = root.querySelector<HTMLElement>("[data-orbit-helix]")!;
  const plane = root.querySelector<HTMLElement>("[data-orbit-plane]")!;
  const edges = [...root.querySelectorAll<SVGPathElement>("[data-ribbon-edge]")];
  const cards = [
    ...root.querySelectorAll<HTMLElement>("[data-helix-card]"),
  ].map((card) => ({
    card,
    slices: [...card.querySelectorAll<HTMLElement>("[data-slice]")],
    outside: null as boolean | null,
    visible: true,
  }));
  const clock = { progress: 0 };
  let px = 1;

  const paint = () => {
    let from = Infinity,
      to = -Infinity;
    cards.forEach((entry, i) => {
      const center = cardCenter(i, cards.length, clock.progress);
      if (center !== null) {
        from = Math.min(from, center - CARD.length);
        to = Math.max(to, center + CARD.length);
      }
      if ((center !== null) !== entry.visible) {
        entry.visible = center !== null;
        entry.card.style.visibility = entry.visible ? "" : "hidden";
      }
      if (center === null) return;
      const { outside, matrices } = cardSlices(center, px);
      entry.slices.forEach((slice, k) => {
        slice.style.transform = matrices[k];
      });
      if (outside === entry.outside) return;
      entry.outside = outside;
      entry.slices.forEach((slice, k) => {
        const part = outside ? SLICES - 1 - k : k;
        slice.style.setProperty("--part", String(part));
      });
    });
    edges.forEach((edge, i) =>
      edge.setAttribute(
        "d",
        to > from ? ribbonEdge(from, to, i ? -1 : 1, px) : "",
      ),
    );
  };
  const measure = () => {
    px = pixelsPerUnit(stage.clientHeight);
    helix.style.setProperty(
      "--helix-perspective",
      `${CAMERA.distance * px}px`,
    );
    // Image maps to the true slice step; the +2px overlap only repeats the
    // neighbour's first pixels, so seams hide without losing any image.
    helix.style.setProperty("--slice-step", `${(CARD.length / SLICES) * px}px`);
    helix.style.setProperty(
      "--slice-w",
      `${(CARD.length / SLICES) * px + 2}px`,
    );
    helix.style.setProperty("--slice-h", `${CARD.height * px}px`);
    paint();
  };

  root.dataset.enhanced = "true";
  stage.dataset.enhanced = "true";
  measure();
  const timeline = gsap
    .timeline({ paused: true, onUpdate: paint })
    .to(clock, { progress: 1, duration: 1, ease: "none" });
  const trigger = ScrollTrigger.create({
    id: "featured-orbit",
    trigger: roll,
    start: "top top",
    end: "bottom bottom",
    animation: timeline,
    scrub: 0.4,
    invalidateOnRefresh: true,
    onRefresh: measure,
  });
  // The section just grew to its scroll length; every trigger below must re-measure.
  const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());

  const keydown = (event: KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
      return;
    const links = [
      ...plane.querySelectorAll<HTMLAnchorElement>(
        "[data-orbit-card]:not([data-orbit-copy]) a",
      ),
    ];
    const index = links.indexOf(event.target as HTMLAnchorElement);
    if (index < 0) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? count - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + count) % count;
    links[next]?.focus({ preventScroll: true });
  };
  plane.addEventListener("keydown", keydown);

  return () => {
    plane.removeEventListener("keydown", keydown);
    cancelAnimationFrame(refreshFrame);
    trigger.kill();
    timeline.kill();
    // Only clear what the controller set: React owns each slice's image.
    cards.forEach(({ card, slices }) => {
      card.style.removeProperty("visibility");
      slices.forEach((slice) => {
        slice.style.removeProperty("transform");
        slice.style.removeProperty("--part");
      });
    });
    edges.forEach((edge) => edge.removeAttribute("d"));
    ["--helix-perspective", "--slice-step", "--slice-w", "--slice-h"].forEach((name) =>
      helix.style.removeProperty(name),
    );
    delete root.dataset.enhanced;
    delete stage.dataset.enhanced;
  };
}
