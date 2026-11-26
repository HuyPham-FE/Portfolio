"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Skill } from "@/types/content";
import type { Copy } from "@/lib/content";
import { createSkillEntrance } from "@/lib/motion/skill-entrance";
import { BrandRow } from "./brand";
import { Heading } from "./ui";
import { useMotionState } from "./motion-provider";
import { Icon } from "./icon";
export function SkillLab({
  skills,
  copy,
}: {
  skills: Skill[];
  copy: Copy["skills"];
}) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const { ready, reduced } = useMotionState();
  useEffect(() => {
    if (reduced || !root.current) return;
    const tiles = root.current.querySelectorAll<HTMLElement>(".skill-tile");
    const cleanups = Array.from(tiles).map((tile) => {
      let tween: gsap.core.Tween | undefined;
      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const r = tile.getBoundingClientRect();
        tween?.kill();
        tween = gsap.to(tile, {
          rotateY: ((e.clientX - r.left - r.width / 2) / r.width) * 10,
          rotateX: (-(e.clientY - r.top - r.height / 2) / r.height) * 10,
          duration: 0.4,
          overwrite: "auto",
        });
      };
      const leave = () => {
        tween?.kill();
        tween = gsap.to(tile, { rotateX: 0, rotateY: 0, duration: 0.6 });
      };
      tile.addEventListener("pointermove", move);
      tile.addEventListener("pointerleave", leave);
      return () => {
        tile.removeEventListener("pointermove", move);
        tile.removeEventListener("pointerleave", leave);
        tween?.kill();
        gsap.set(tile, { clearProps: "transform" });
      };
    });
    return () => cleanups.forEach((fn) => fn());
  }, [reduced]);
  useEffect(() => {
    if (!ready || reduced || !root.current) return;
    const section = root.current;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const entrance = createSkillEntrance(section);
      ScrollTrigger.create({
        trigger: section.querySelector(".skill-lab"),
        start: "top 85%",
        endTrigger: section,
        end: "bottom 85%",
        scrub: true,
        invalidateOnRefresh: true,
        animation: entrance,
      });
    }, section);
    return () => ctx.revert();
  }, [ready, reduced]);
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panel.current,
        { y: 12, opacity: 0.3 },
        { y: 0, opacity: 1, duration: 0.4 },
      );
    }, panel);
    return () => ctx.revert();
  }, [active, reduced]);
  return (
    <section id="skills" className="skills section-shell" ref={root}>
      <div className="skills-copy">
        <div className="skills-heading-frame">
          <Heading className="skills-title">
            {copy.titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </Heading>
        </div>
        <p>{copy.body}</p>
        <div ref={panel} className="skill-detail" aria-live="polite">
          <span className="skill-detail-index">0{active + 1} /</span>
          <h3>{skills[active].name}</h3>
          <p>{skills[active].detail}</p>
          <BrandRow names={skills[active].brands} labels />
          <div className="tags">
            {skills[active].tools.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
        </div>
      </div>
      <div
        className="skill-lab"
        onPointerMove={(e) => {
          if (reduced || e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty(
            "--pointer-x",
            `${e.clientX - r.left}px`,
          );
          e.currentTarget.style.setProperty(
            "--pointer-y",
            `${e.clientY - r.top}px`,
          );
        }}
      >
        <div className="lab-orbit orbit-one" />
        <div className="lab-orbit orbit-two" />
        <div className="lab-core">
          <span><Icon name="sparkle" /></span>
          <small>{copy.center}</small>
        </div>
        {skills.map((skill, i) => (
          <div className={`skill-burst skill-${i}`} key={skill.id}>
            <button
              className={`skill-tile ${active === i ? "selected" : ""}`}
              onClick={() => setActive(i)}
              onFocus={() => setActive(i)}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") setActive(i);
              }}
              aria-pressed={active === i}
            >
              <div className="skill-tile-content">
                <div className="skill-tile-top">
                  <span className="skill-icon"><Icon name={skill.icon} /></span>
                  <BrandRow names={skill.brands.slice(0, 2)} />
                </div>
                <h3>{skill.name}</h3>
                <p>{skill.description}</p>
              </div>
              <span className="skill-tile-arrow"><Icon name="arrow-up-right" /></span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
