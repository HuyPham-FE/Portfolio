"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Project, SiteSettings } from "@/types/content";
import type { Copy } from "@/lib/content";
import { useSceneMotion } from "@/hooks/use-scene-motion";
import { Eyebrow, Tilt, Arrow } from "./ui";
import { DeviceMockup } from "./device-mockup";
import { Contact } from "./contact";
import { Icon } from "./icon";
export function ProjectShowcase({
  projects,
  settings,
  copy,
}: {
  projects: Project[];
  settings: SiteSettings;
  copy: Copy;
}) {
  const root = useSceneMotion();
  const [active, setActive] = useState(0);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setActive(Number((entry.target as HTMLElement).dataset.index));
        });
      },
      { threshold: 0.55 },
    );
    root.current
      ?.querySelectorAll("[data-scene]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [root]);
  return (
    <div ref={root}>
      <main id="main" className="projects-page">
        <h1 className="sr-only">{copy.projects.title}</h1>
        <aside className="project-rail" aria-label={copy.projects.title}>
          <span>
            {String(active + 1).padStart(2, "0")}
            <small>{String(projects.length).padStart(2, "0")}</small>
          </span>
          <div className="rail-line" />
          {projects.map((p, i) => (
            <a
              href={`#${p.slug}`}
              key={p.slug}
              className={active === i ? "active" : ""}
              aria-label={`${copy.featured.select}: ${p.title}`}
              aria-current={active === i ? "true" : undefined}
            >
              <img src={p.image.src} alt="" width="60" height="60" />
            </a>
          ))}
        </aside>
        {projects.map((p, i) => (
          <section
            id={p.slug}
            key={p.slug}
            className={`project-scene scene-${i}`}
            data-scene
            data-index={i}
          >
            <div className="scene-background">
              <img
                src={p.image.src}
                srcSet={`${p.image.src.replace(/\.(jpg|webp)$/, "-800.$1")} 800w, ${p.image.src} 1800w`}
                sizes="100vw"
                alt=""
                width="1800"
                height="1200"
                loading={i ? "lazy" : "eager"}
                data-parallax
              />
            </div>
            <div className="scene-content">
              <Eyebrow>{copy.featured.eyebrow}</Eyebrow>
              <span className="scene-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="micro-label scene-category">{p.category}</p>
              <h2 data-scene-title>
                {p.title}
                <span>{p.accent}</span>
              </h2>
              <p className="scene-description">{p.description}</p>
              <p className="scene-summary">{p.summary}</p>
              <Link className="inline-link" href={`/projects/${p.slug}/`}>
                <span className="circle-button"><Icon name="arrow-right" /></span>
                {copy.projects.detail}
                <Arrow />
              </Link>
              <div className="scene-meta">
                <div>
                  <b>{copy.projects.role}</b>
                  <p>{p.role.join(" / ")}</p>
                </div>
                <div>
                  <b>{copy.projects.technologies}</b>
                  <p>{p.technologies.slice(0, 3).join(" · ")}</p>
                </div>
              </div>
              <span className="concept-label">
                {p.status === "concept" ? copy.featured.demo : p.year}
              </span>
            </div>
            <div className="scene-visual" data-scene-visual>
              <Link
                href={`/projects/${p.slug}/`}
                aria-label={`${copy.projects.detail}: ${p.title}`}
              >
                <Tilt>
                  {p.seo ? (
                    // Finished results artwork: shown whole, never cropped into a device frame.
                    <img
                      className="scene-artwork"
                      src={p.image.src}
                      srcSet={`${p.image.src.replace(/\.(jpg|webp)$/, "-800.$1")} 800w, ${p.image.src} 1648w`}
                      sizes="(max-width: 767px) 92vw, 50vw"
                      alt={p.image.alt}
                      width="1648"
                      height="928"
                      loading="lazy"
                    />
                  ) : (
                    <DeviceMockup image={p.image} critical={i === 0} />
                  )}
                </Tilt>
              </Link>
              <span className="scene-floating-note">
                {p.category}
                <Arrow diagonal />
              </span>
            </div>
          </section>
        ))}
        <Contact settings={settings} copy={copy.contact} />
      </main>
    </div>
  );
}
