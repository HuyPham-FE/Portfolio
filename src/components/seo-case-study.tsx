"use client";
import Link from "next/link";
import { useRef } from "react";
import type { Project, SiteSettings } from "@/types/content";
import type { Copy } from "@/lib/content";
import { useSceneMotion } from "@/hooks/use-scene-motion";
import { Heading, Tilt } from "./ui";
import { Contact } from "./contact";
import { NextProject } from "./next-project";
import s from "./seo-case-study.module.css";

/** Case-study page for an SEO project: artwork, rankings summary and keyword table. */
export function SeoCaseStudy({
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
  const zoom = useRef<HTMLDialogElement>(null);
  const seo = p.seo!;
  const t = copy.projects;
  const openZoom = () => zoom.current?.showModal();
  const small = p.image.src.replace(/\.(jpg|webp)$/, "-800.$1");
  return (
    <div ref={root}>
      <main id="main">
        <section className={`${s.intro} section-shell`}>
          <Link className="back-link" href="/projects/">
            ← &nbsp;{t.back}
          </Link>
          <p className="detail-tag">{p.category}</p>
          <h1 className={s.title}>
            <span className="line-mask">
              <span data-hero-line>
                {p.title}
                <span className="blue">{p.accent}</span>
              </span>
            </span>
          </h1>
          <p className={s.headline}>
            <span className="line-mask">
              <span data-hero-line>{seo.headline}</span>
            </span>
          </p>
          <dl className={s.meta}>
            {[
              [t.role, p.role.join(" & ")],
              [t.industry, p.industry],
              [t.discipline, seo.discipline],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className={`${s.hero} section-shell`}>
          <div data-parallax>
            <div className={s.reveal} data-reveal>
              <Tilt className={s.tilt}>
                <button
                  type="button"
                  className={s.artwork}
                  onClick={openZoom}
                  aria-label={t.zoom}
                >
                  <img
                    src={p.image.src}
                    srcSet={`${small} 800w, ${p.image.src} 1648w`}
                    sizes="(max-width: 767px) 92vw, 88vw"
                    alt={p.image.alt}
                    width="1648"
                    height="928"
                    fetchPriority="high"
                  />
                  <span className={s.zoomHint} aria-hidden="true">
                    ⤢
                  </span>
                </button>
              </Tilt>
            </div>
          </div>
        </div>

        <section className={`${s.overview} section-shell`}>
          <Heading>{t.overview}</Heading>
          <div className={s.overviewGrid}>
            {seo.overview.map((item) => (
              <div key={item.title} data-reveal>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={`${s.performance} section-shell`}>
          <Heading>{t.performance}</Heading>
          <ul className={s.figures}>
            {seo.rankings.map((r) => (
              <li key={r.label} data-reveal>
                <span className={s.unit}>{t.keyword}</span>
                <strong>
                  <span data-counter={r.value} data-counter-pad="2">
                    {String(r.value).padStart(2, "0")}
                  </span>
                </strong>
                <span className={s.rankLabel}>{r.label}</span>
              </li>
            ))}
          </ul>
          <p className={s.note}>{seo.rankingNote}</p>
        </section>

        <section className={`${s.rankings} section-shell`}>
          <div className={s.rankingsIntro}>
            <Heading>{t.rankings}</Heading>
            <button
              type="button"
              className="button button-outline"
              onClick={openZoom}
            >
              {t.zoomOpen}
              <span aria-hidden="true">⤢</span>
            </button>
          </div>
          <div className={s.table}>
            <p className={s.tableHead} aria-hidden="true">
              <span>{t.keyword}</span>
              <span>{t.rank}</span>
            </p>
            <ol className={s.rows}>
              {seo.keywords.map((k) => (
                <li
                  key={k.keyword}
                  className={k.rank === 1 ? s.top : undefined}
                  data-reveal
                >
                  <span className={s.keyword}>{k.keyword}</span>
                  <span className={s.rank}>
                    <span className="sr-only">{t.rank} </span>
                    <span aria-hidden="true">#</span>
                    {k.rank}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <NextProject project={next} label={t.next} />
        <Contact settings={settings} copy={copy.contact} />
      </main>

      <dialog
        ref={zoom}
        className={s.dialog}
        aria-label={t.zoom}
        onClick={(event) => {
          // A click on the backdrop lands on the dialog itself.
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <button
          type="button"
          className={s.close}
          onClick={() => zoom.current?.close()}
        >
          {t.close}
          <span aria-hidden="true">×</span>
        </button>
        <div className={s.zoomScroll} data-lenis-prevent>
          <img
            src={p.image.src}
            alt={p.image.alt}
            width="1648"
            height="928"
            loading="lazy"
          />
        </div>
      </dialog>
    </div>
  );
}
