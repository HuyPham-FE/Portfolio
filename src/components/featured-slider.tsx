"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Project } from "@/types/content";
import type { Copy } from "@/lib/content";
import { createFeaturedController } from "@/lib/motion/featured-controller";
import { useMotionState } from "./motion-provider";
import styles from "./featured-orbit.module.css";

/** Kept as the existing integration point; the stacked slider is fully replaced. */
export function FeaturedSlider({
  projects,
  copy,
}: {
  projects: Project[];
  copy: Copy["featured"];
}) {
  const root = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotionState();
  // Only small collections need extra visual slots to recycle outside the viewport.
  // Copies are never extra projects or keyboard stops, and remain mounted throughout.
  const copies =
    projects.length > 1 ? Math.max(1, Math.ceil(8 / projects.length)) : 1;
  const slots = Array.from({ length: copies }, (_, copyIndex) =>
    projects.map((project) => ({ project, copyIndex })),
  ).flat();
  useEffect(() => {
    if (!ready || reduced || !root.current || projects.length < 2) return;
    const element = root.current;
    const media = gsap.matchMedia();
    let cancelled = false;
    let frame = 0;
    // A returning visit skips the intro while the route's CSS entrance is still
    // moving. Measure only after that ancestor settles, including restored scroll.
    const entrance = element.closest(".page-enter")?.getAnimations?.() ?? [];
    Promise.allSettled(
      entrance
        .filter((animation) => animation.playState !== "finished")
        .map((animation) => animation.finished),
    ).then(() => {
      if (cancelled) return;
      frame = requestAnimationFrame(() => {
        if (cancelled) return;
        media.add(
          "(min-width: 768px) and (min-height: 540px) and (prefers-reduced-motion: no-preference)",
          () => createFeaturedController(element, projects.length),
        );
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      media.revert();
    };
  }, [ready, reduced, projects]);
  if (!projects.length) return null;
  return (
    <section
      id="featured"
      ref={root}
      className={styles.section}
      aria-labelledby="featured-title"
      data-featured-orbit
    >
      <div className={styles.stage} data-orbit-stage>
        <header className={styles.header}>
          <Link href="/projects/" className={styles.all}>
            {copy.all}
            <span aria-hidden="true">↗</span>
          </Link>
        </header>
        <div className={styles.typeScene}>
          <h2 id="featured-title" className={styles.title} data-orbit-title>
            <span>{copy.orbitTitle[0]}</span>
            <span>{copy.orbitTitle[1]}</span>
          </h2>
          <div className={styles.outline} aria-hidden="true" data-orbit-outline>
            {copy.orbitTitle.join(" ")}
          </div>
        </div>
        <div
          className={styles.plane}
          data-orbit-plane
          role="group"
          aria-label={copy.title}
          onDragStart={(event) => event.preventDefault()}
        >
          {slots.map(({ project: p, copyIndex }, index) => (
            <article
              key={`${p.slug}:${copyIndex}`}
              className={styles.card}
              data-orbit-card
              data-orbit-copy={copyIndex > 0 ? "true" : undefined}
              aria-hidden={copyIndex > 0 ? true : undefined}
            >
              <div className={styles.loop} data-orbit-loop>
                <Link
                  href={`/projects/${p.slug}/`}
                  className={styles.surface}
                  tabIndex={copyIndex > 0 ? -1 : 0}
                  aria-label={`${copy.view}: ${p.title} ${p.accent}`}
                  draggable={false}
                >
                  <img
                    src={p.image.src}
                    srcSet={
                      p.image.src.endsWith(".jpg")
                        ? `${p.image.src.replace(/\.jpg$/, "-800.jpg")} 800w, ${p.image.src} 1800w`
                        : undefined
                    }
                    sizes="(max-width: 767px) 86vw, (max-height: 700px) 600px, 650px"
                    alt={copyIndex > 0 ? "" : p.image.alt}
                    width="1400"
                    height="1000"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                  <span className={styles.index}>
                    {String((index % projects.length) + 1).padStart(2, "0")} /{" "}
                    {String(projects.length).padStart(2, "0")}
                  </span>
                  <div className={styles.caption}>
                    <p className={styles.category}>{p.category}</p>
                    <h3>
                      {p.title} <span>{p.accent}</span>
                    </h3>
                    <p className={styles.technologies}>
                      {p.technologies.join(" / ")}
                    </p>
                    {p.status === "concept" && (
                      <span className={styles.disclosure}>{copy.demo}</span>
                    )}
                  </div>
                  <span className={styles.view}>
                    <span>{copy.view}</span>
                    <b aria-hidden="true">↗</b>
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.progress} aria-hidden="true">
          <span data-orbit-meter />
        </div>
      </div>
    </section>
  );
}
