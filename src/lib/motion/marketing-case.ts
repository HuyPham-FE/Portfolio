import { gsap } from "gsap";
import { decimalsOf, formatNumber } from "../format.ts";

/**
 * Case-study entrance: label, masked title lines, accent rule, copy, then the metric grid
 * with drawn dividers and a one-off count-up. Static markup already shows final values.
 */
export function createCaseEntrance(
  root: HTMLElement,
  part: "all" | "intro" | "metrics" = "all",
) {
  const timeline = gsap.timeline({
    paused: true,
    defaults: { ease: "power3.out", lazy: false },
  });
  const reveal = (
    selector: string,
    from: gsap.TweenVars,
    to: gsap.TweenVars,
    at: number,
  ) => {
    const targets = root.querySelectorAll(selector);
    if (targets.length) timeline.fromTo(targets, from, to, at);
  };
  const values = [...root.querySelectorAll<HTMLElement>("[data-case-value]")];
  if (part !== "metrics") {
    reveal("[data-case-label]", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0);
    reveal(
      "[data-case-line]",
      { yPercent: 110 },
      { yPercent: 0, duration: 0.95, stagger: 0.1 },
      0.1,
    );
    reveal(
      "[data-case-rule]",
      { scaleX: 0, transformOrigin: "0% 50%" },
      { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
      0.35,
    );
    reveal(
      "[data-case-fade]",
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, stagger: 0.1 },
      0.6,
    );
  }
  if (part !== "intro") {
    const at = part === "all" ? 0.45 : 0;
    // Each metric's divider is a pseudo-element scaled by --draw; its text rises separately.
    reveal(
      "[data-case-metric]",
      { "--draw": 0 },
      { "--draw": 1, duration: 0.9, ease: "power2.inOut", stagger: 0.07 },
      at,
    );
    reveal(
      "[data-case-metric] > *",
      { y: 22, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.035 },
      at + 0.1,
    );
    values.forEach((el, i) => {
      const target = Number(el.dataset.caseValue);
      const decimals = decimalsOf(target);
      const counter = { value: 0 };
      el.textContent = formatNumber(0, decimals);
      timeline.to(
        counter,
        {
          value: target,
          duration: 1.8,
          ease: "power3.out",
          onUpdate: () => {
            el.textContent = formatNumber(counter.value, decimals);
          },
        },
        at + 0.2 + i * 0.05,
      );
    });
    reveal("[data-case-note]", { opacity: 0 }, { opacity: 1, duration: 0.6 }, at + 0.9);
  }
  /** Puts the exact final values back when the motion is reverted mid-way. */
  const restore = () =>
    values.forEach((el) => {
      el.textContent = formatNumber(Number(el.dataset.caseValue));
    });
  return { timeline, restore: part === "intro" ? () => {} : restore };
}
