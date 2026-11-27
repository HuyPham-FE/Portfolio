"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionState } from "@/components/motion-provider";
import { decimalsOf, formatNumber } from "@/lib/format";
import { ENTER_START } from "@/lib/motion/triggers";
export function useSceneMotion() {
  const root = useRef<HTMLDivElement>(null);
  const { ready, reduced } = useMotionState();
  useEffect(() => {
    if (!ready || !root.current || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const listeners: (() => void)[] = [];
    const ctx = gsap.context(() => {
      const all = <T extends Element = HTMLElement>(selector: string) =>
        Array.from(root.current!.querySelectorAll<T>(selector));
      const lines = all("[data-hero-line]").filter(
        (el) => !el.closest("[data-intro-owned]"),
      );
      const visuals = all("[data-hero-visual]").filter(
        (el) => !el.closest("[data-intro-owned]"),
      );
      if (lines.length)
        gsap.from(lines, {
          yPercent: 115,
          rotate: 3,
          stagger: 0.12,
          duration: 1.15,
          ease: "power4.out",
        });
      if (visuals.length)
        gsap.from(visuals, {
          y: 70,
          scale: 0.88,
          rotate: 4,
          opacity: 0,
          duration: 1.5,
          delay: 0.2,
          ease: "power3.out",
        });
      all("[data-reveal]").forEach((el) =>
        gsap.from(el, {
          clipPath: "inset(0 0 100% 0)",
          y: 35,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: ENTER_START, once: true },
        }),
      );
      all("[data-parallax]").forEach((el) =>
        gsap.fromTo(
          el,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        ),
      );
      all("[data-scene]").forEach((el) => {
        const visual = el.querySelector("[data-scene-visual]");
        const title = el.querySelector("[data-scene-title]");
        if (visual)
          gsap.fromTo(
            visual,
            { scale: 0.86, rotateY: -12, y: 70 },
            {
              scale: 1,
              rotateY: 0,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                end: "top 15%",
                scrub: 1,
              },
            },
          );
        if (title)
          gsap.fromTo(
            title,
            { y: 50 },
            {
              y: -20,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
      });
      all<HTMLElement>("[data-counter]").forEach((el) => {
        const counter = { value: 0 };
        const target = Number(el.dataset.counter);
        const pad = Number(el.dataset.counterPad ?? 0); // "05" style figures
        // Start from zero up front so the figure doesn't flash its final value first.
        const final = el.textContent;
        el.textContent = formatNumber(0, decimalsOf(target)).padStart(pad, "0");
        listeners.push(() => {
          el.textContent = final;
        });
        gsap.to(counter, {
          value: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: ENTER_START, once: true },
          onUpdate: () => {
            el.textContent = formatNumber(
              counter.value,
              decimalsOf(target),
            ).padStart(pad, "0");
          },
        });
      });
      all<HTMLElement>(".magnetic").forEach((el) => {
        let tween: gsap.core.Tween | undefined;
        const move = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          const bounds = el.getBoundingClientRect();
          tween?.kill();
          tween = gsap.to(el, {
            x: (event.clientX - bounds.left - bounds.width / 2) * 0.13,
            y: (event.clientY - bounds.top - bounds.height / 2) * 0.2,
            duration: 0.35,
            overwrite: true,
          });
        };
        const leave = () => {
          tween?.kill();
          tween = gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, .5)",
            overwrite: true,
          });
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        listeners.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
          tween?.kill();
          gsap.set(el, { clearProps: "transform" });
        });
      });
    }, root);
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const frame = requestAnimationFrame(refresh);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("load", refresh);
      listeners.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, [ready, reduced]);
  return root;
}
