"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Copy } from "@/lib/content";
import { Heading } from "./ui";
import { useMotionState } from "./motion-provider";
export function ProcessStory({ copy }: { copy: Copy["process"] }) {
  const root = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotionState();
  useEffect(() => {
    if (!ready || reduced || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const section = root.current;
    const ctx = gsap.context(() => {
      const list = section.querySelector(".process-narrative");
      gsap.fromTo(
        ".process-progress",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: list,
            start: "top 50%",
            end: "bottom 65%",
            scrub: true,
          },
        },
      );
      section
        .querySelectorAll<HTMLElement>(".process-scene")
        .forEach((scene) => {
          ScrollTrigger.create({
            trigger: scene,
            start: "top 55%",
            end: "bottom 55%",
            toggleClass: "is-active",
          });
          gsap.fromTo(
            scene.querySelector(".process-figure img"),
            { y: 35, scale: 0.95, clipPath: "inset(8% 0 8% 0 round 20px)" },
            {
              y: 0,
              scale: 1,
              clipPath: "inset(0% 0 0% 0 round 20px)",
              ease: "power2.out",
              scrollTrigger: {
                trigger: scene,
                start: "top 85%",
                end: "top 35%",
                scrub: 0.4,
              },
            },
          );
        });
    }, section);
    return () => ctx.revert();
  }, [ready, reduced]);
  return (
    <section id="process" className="process-story section-shell" ref={root}>
      <header className="process-heading">
        <Heading>{copy.title}</Heading>
      </header>
      <div className="process-narrative">
        <div className="process-track" aria-hidden="true">
          <span className="process-progress" />
        </div>
        {copy.steps.map((step, i) => (
          <article className="process-scene" key={step.title}>
            <span className="process-marker" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="process-copy">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
            <figure className="process-figure">
              <img
                src={step.image.src}
                alt={step.image.alt}
                width="800"
                height="600"
                loading="lazy"
              />
            </figure>
          </article>
        ))}
      </div>
    </section>
  );
}
