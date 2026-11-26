"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Project } from "@/types/content";
import type { Copy } from "@/lib/content";
import { createFeaturedController } from "@/lib/motion/featured-controller";
import { SLICES } from "@/lib/motion/featured-orbit";
import { useMotionState } from "./motion-provider";
import { ProjectSpotlight } from "./project-spotlight";
import styles from "./featured-orbit.module.css";
import { Icon } from "./icon";

/** Kept as the existing integration point; the stacked slider is fully replaced. */
export function FeaturedSlider({
  projects,
  spotlight,
  copy,
}: {
  projects: Project[];
  /** A case study shown as its own showcase after the website row. */
  spotlight?: Project;
  copy: Copy["featured"];
}) {
  const root = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotionState();
  const count = projects.length;
  // The helix train reads best with 8-10 cards; repeats are decorative only.
  const train = Array.from(
    { length: Math.min(10, count * Math.ceil(8 / Math.max(count, 1))) },
    (_, i) => projects[i % count],
  );
  // Three identical sets keep the auto-scrolling row seamless on wide screens.
  // Copies are never extra projects or keyboard stops.
  const slots = [0, 1, 2].flatMap((copyIndex) =>
    projects.map((project) => ({ project, copyIndex })),
  );
  const outline = copy.orbitTitle.join(" ");
  const small = (src: string) => src.replace(/\.jpg$/, "-800.jpg");
  useEffect(() => {
    if (!ready || reduced || !root.current || count < 2) return;
    const element = root.current;
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 768px) and (min-height: 540px) and (prefers-reduced-motion: no-preference)",
      () => createFeaturedController(element, count),
    );
    return () => media.revert();
  }, [ready, reduced, count]);
  if (!count) return null;
  return (
    <section
      id="featured"
      ref={root}
      className={styles.section}
      aria-labelledby="featured-title"
      data-featured-orbit
    >
      <div className={styles.roll} data-orbit-roll>
        <div className={styles.stage} data-orbit-stage>
          <header className={styles.header}>
            <Link href="/projects/" className={styles.all}>
              {copy.all}
              <span aria-hidden="true"><Icon name="arrow-up-right" /></span>
            </Link>
          </header>
          <div className={styles.typeScene}>
            <h2 id="featured-title" className={styles.title} data-orbit-title>
              {/* Second line is a visual repeat for the seamless marquee only. */}
              {[0, 1].map((n) => (
                <span
                  key={n}
                  className={styles.line}
                  aria-hidden={n ? true : undefined}
                >
                  <span>{copy.orbitTitle[0]}</span>{" "}
                  <span>{copy.orbitTitle[1]}</span>
                </span>
              ))}
            </h2>
            <div className={styles.outline} aria-hidden="true">
              <span>{outline}</span>
              <span>{outline}</span>
            </div>
          </div>
          {/* Decorative scroll scene; the row below holds the accessible links. */}
          <div className={styles.helix} data-orbit-helix aria-hidden="true">
            <svg className={styles.edges}>
              <path data-ribbon-edge />
              <path data-ribbon-edge />
            </svg>
            <div className={styles.helixOrigin}>
              {train.map((p, i) => (
                <Link
                  key={`${p.slug}:${i}`}
                  href={`/projects/${p.slug}/`}
                  className={styles.helixCard}
                  tabIndex={-1}
                  draggable={false}
                  data-helix-card
                >
                  {Array.from({ length: SLICES }, (_, k) => (
                    <span
                      key={k}
                      className={styles.slice}
                      data-slice
                      style={{
                        // Full size: cards scale up in 3D, the 800px copy blurs on HiDPI.
                        backgroundImage: `url(${p.image.src})`,
                        backgroundSize: `calc(var(--slice-step) * ${SLICES}) 100%`,
                        ["--part" as string]: k,
                      }}
                    />
                  ))}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className={styles.plane}
        data-orbit-plane
        role="group"
        aria-label={copy.title}
        onDragStart={(event) => event.preventDefault()}
      >
        <div className={styles.track}>
          {slots.map(({ project: p, copyIndex }, index) => (
            <article
              key={`${p.slug}:${copyIndex}`}
              className={styles.card}
              data-orbit-card
              data-orbit-copy={copyIndex > 0 ? "true" : undefined}
              aria-hidden={copyIndex > 0 ? true : undefined}
            >
              <Link
                href={`/projects/${p.slug}/`}
                className={styles.surface}
                tabIndex={copyIndex > 0 ? -1 : 0}
                aria-label={`${copy.view}: ${p.title}${p.accent}`}
                draggable={false}
              >
                <img
                  src={p.image.src}
                  srcSet={
                    p.image.src.endsWith(".jpg")
                      ? `${small(p.image.src)} 800w, ${p.image.src} 1800w`
                      : undefined
                  }
                  sizes="(max-width: 767px) 86vw, 36vw"
                  alt={copyIndex > 0 ? "" : p.image.alt}
                  width="1400"
                  height="1000"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                <span className={styles.index}>
                  {String((index % count) + 1).padStart(2, "0")} /{" "}
                  {String(count).padStart(2, "0")}
                </span>
                <div className={styles.caption}>
                  <p className={styles.category}>{p.category}</p>
                  <h3>
                    {p.title}<span>{p.accent}</span>
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
                  <b aria-hidden="true"><Icon name="arrow-up-right" /></b>
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
      {spotlight && <ProjectSpotlight project={spotlight} view={copy.view} />}
    </section>
  );
}
