"use client";
import Link from "next/link";
import type { Project, SiteSettings } from "@/types/content";
import type { Copy } from "@/lib/content";
import { useSceneMotion } from "@/hooks/use-scene-motion";
import { Heading, Tilt } from "./ui";
import { DeviceMockup } from "./device-mockup";
import { Contact } from "./contact";
import { NextProject } from "./next-project";
import { Icon } from "./icon";
export function ProjectDetail({
  project: p,
  next,
  settings,
  copy,
}: {
  project: Project;
  next: Project;
  settings: SiteSettings;
  copy: Copy;
}) {
  const root = useSceneMotion();
  const results = p.results.filter((m) => m.verified && m.source);
  return (
    <div ref={root}>
      <main id="main">
        <section className="detail-hero">
          <div className="detail-background">
            <img
              src={p.image.src}
              srcSet={`${p.image.src.replace(".jpg", "-800.jpg")} 800w, ${p.image.src} 1800w`}
              sizes="100vw"
              alt=""
              width="1800"
              height="1200"
              data-parallax
              data-critical
            />
          </div>
          <div className="detail-hero-copy">
            <Link className="back-link" href="/projects/">
              <Icon name="arrow-left" /> {copy.projects.back}
            </Link>
            <p className="detail-tag">{p.category}</p>
            <h1>
              <span className="line-mask">
                <span data-hero-line>
                  {p.title}
                  <span className="blue">{p.accent}</span>
                </span>
              </span>
            </h1>
            <h2>{p.description}</h2>
            <p>{p.summary}</p>
            <span className="concept-label">
              {p.status === "concept" ? copy.featured.demo : p.year}
            </span>
          </div>
          <div className="detail-device" data-hero-visual>
            <Tilt>
              <DeviceMockup
                image={p.image}
                critical
              />
            </Tilt>
          </div>
        </section>
        <dl className="detail-metadata section-shell">
          {[
            { label: copy.projects.role, value: p.role.join(" / ") },
            { label: copy.projects.duration, value: p.duration },
            {
              label: copy.projects.technologies,
              value: p.technologies.join(" · "),
            },
            { label: copy.projects.industry, value: p.industry },
          ].map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
          <div>
            <dt>{copy.projects.website}</dt>
            <dd>
              {p.website ? (
                <a href={p.website} target="_blank" rel="noopener noreferrer">
                  {new URL(p.website).hostname} <Icon name="arrow-up-right" />
                </a>
              ) : (
                copy.projects.unavailable
              )}
            </dd>
          </div>
        </dl>
        <section className="detail-overview section-shell">
          <Heading>{copy.projects.overview}</Heading>
          <p>{p.summary}</p>
        </section>
        <section className="detail-section section-shell">
          <Heading>{copy.projects.challenge}</Heading>
          <div className="challenge-list">
            {p.challenges.map((item) => (
              <article key={item.title} data-reveal>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="detail-section solution-section section-shell">
          <Heading>{copy.projects.solution}</Heading>
          <div className="solution-list">
            {p.solutions.map((item, i) => (
              <article key={item.title} data-reveal>
                <span className="solution-icon"><Icon name={(["layout", "search", "trend", "target"] as const)[i % 4]} /></span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="solution-arrow"><Icon name="arrow-right" /></span>
              </article>
            ))}
          </div>
        </section>
        <section className="detail-section detail-results section-shell">
          <Heading>{copy.projects.results}</Heading>
          {results.length ? (
            <div className="marketing-kpis">
              {results.map((m) => (
                <div key={m.label}>
                  <strong>
                    <span data-counter={m.value}>{m.value}</span>
                    {m.suffix}
                  </strong>
                  <p>{m.label}</p>
                  <a href={m.source}>{copy.projects.source} <Icon name="arrow-up-right" /></a>
                </div>
              ))}
            </div>
          ) : (
            <p className="result-note">
              <span className="blue-dot" />
              {p.resultNote}
            </p>
          )}
        </section>
        <section className="detail-section section-shell">
          <Heading>{copy.projects.gallery}</Heading>
          <div className="project-gallery">
            {p.gallery.map((media, i) => (
              <figure key={`${media.src}-${i}`} data-reveal>
                <img
                  src={media.src}
                  srcSet={`${media.src.replace(".jpg", "-800.jpg")} 800w, ${media.src} 1800w`}
                  sizes="(max-width: 767px) 90vw, 65vw"
                  alt={media.alt}
                  loading="lazy"
                  width="1400"
                  height="1000"
                />
              </figure>
            ))}
          </div>
        </section>
        <section className="detail-section section-shell">
          <Heading>{copy.projects.stack}</Heading>
          <ul className="tech-stack">
            {p.technologies.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </section>
        <NextProject project={next} label={copy.projects.next} />
        <Contact settings={settings} copy={copy.contact} />
      </main>
    </div>
  );
}
