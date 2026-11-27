"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Copy } from "@/lib/content";
import {
  createAboutEntrance,
  portraitPointer,
} from "@/lib/motion/about-portrait";
import { ENTER_START } from "@/lib/motion/triggers";
import { useMotionState } from "./motion-provider";
import { Arrow } from "./ui";
import styles from "./about-portrait.module.css";

export function AboutPortrait({
  copy,
  name,
}: {
  copy: Copy["about"];
  name: string;
}) {
  const root = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotionState();
  useEffect(() => {
    if (!ready || reduced || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const section = root.current;
    const media = gsap.matchMedia();
    media.add(
      { desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" },
      (context) => {
        // On stacked layouts the photo waits for its own viewport entrance.
        const parts: ("all" | "text" | "portrait")[] = context.conditions
          ?.desktop
          ? ["all"]
          : ["text", "portrait"];
        parts.forEach((part) => {
          const timeline = createAboutEntrance(section, part);
          ScrollTrigger.create({
            trigger: section.querySelector(
              part === "portrait" ? "[data-about-visual]" : "[data-about-copy]",
            ),
            start: ENTER_START,
            animation: timeline,
            once: true,
          });
        });
      },
      section,
    );
    media.add(
      "(min-width: 900px) and (hover: hover) and (pointer: fine)",
      () => {
        const visual = section.querySelector<HTMLElement>(
          "[data-about-visual]",
        )!;
        const tilt = section.querySelector<HTMLElement>("[data-about-tilt]")!;
        const card = section.querySelector<HTMLElement>(
          "[data-about-card-parallax]",
        )!;
        const backdrop = section.querySelector<HTMLElement>(
          "[data-about-backdrop]",
        )!;
        const quick = (target: HTMLElement, property: string) =>
          gsap.quickTo(target, property, {
            duration: 0.75,
            ease: "power3.out",
          });
        const rotateX = quick(tilt, "rotationX"),
          rotateY = quick(tilt, "rotationY");
        const cardX = quick(card, "x"),
          cardY = quick(card, "y");
        const backdropX = quick(backdrop, "x"),
          backdropY = quick(backdrop, "y");
        const move = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          const bounds = visual.getBoundingClientRect();
          if (!bounds.width || !bounds.height) return;
          const pointer = portraitPointer(
            ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
            ((event.clientY - bounds.top) / bounds.height) * 2 - 1,
          );
          rotateX(pointer.rotationX);
          rotateY(pointer.rotationY);
          cardX(pointer.x * -5);
          cardY(pointer.y * -4);
          backdropX(pointer.x * 8);
          backdropY(pointer.y * 6);
        };
        const reset = () => {
          rotateX(0);
          rotateY(0);
          cardX(0);
          cardY(0);
          backdropX(0);
          backdropY(0);
        };
        visual.addEventListener("pointermove", move);
        visual.addEventListener("pointerleave", reset);
        visual.addEventListener("pointercancel", reset);
        return () => {
          visual.removeEventListener("pointermove", move);
          visual.removeEventListener("pointerleave", reset);
          visual.removeEventListener("pointercancel", reset);
        };
      },
      section,
    );
    return () => media.revert();
  }, [ready, reduced]);

  return (
    <section
      id="about"
      className={`${styles.about} section-shell`}
      ref={root}
      aria-labelledby="about-title"
    >
      <div className={styles.copy} data-about-copy>
        <h2 id="about-title" className={styles.heading}>
          {copy.title.split("\n").map((line) => (
            <span className={styles.lineMask} key={line}>
              <span data-about-line>{line}</span>{" "}
            </span>
          ))}
        </h2>
        <p className={styles.body} data-about-body>
          {copy.body}
        </p>
        <a className="inline-link" href="#process" data-about-link>
          {copy.link}
          <Arrow />
        </a>
      </div>
      <div className={styles.visual} data-about-visual>
        <div className={styles.backdrop} data-about-backdrop aria-hidden="true">
          <div className={styles.atmosphere} data-about-atmosphere />
        </div>
        <div className={styles.tilt} data-about-tilt>
          <div className={styles.frame} data-about-frame>
            <div className={styles.photo} data-about-photo>
              {/* Use the supplied composition verbatim: no regenerated face or reconstructed glass.
                  CSS crops only the right artwork; the left copy remains live, accessible text. */}
              <img
                src={copy.portrait.src}
                alt={copy.portrait.alt}
                width={copy.portrait.width}
                height={copy.portrait.height}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
        <div className={styles.cardPosition} data-about-card-parallax>
          <div className={styles.roleCard} data-about-card>
            <span className={styles.codeIcon} aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none">
                <path d="m10 9-7 7 7 7m12-14 7 7-7 7M19 5l-6 22" />
              </svg>
            </span>
            <p>{copy.portraitNote}</p>
          </div>
        </div>
        <span className={styles.accessibleCaption}>
          {name}. {copy.note}
        </span>
      </div>
    </section>
  );
}
