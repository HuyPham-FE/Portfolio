"use client";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { HeroContent, Project } from "@/types/content";
import {
  createHeroEntrance,
  createHeroReveal,
  createHeroScroll,
  HERO_SCROLL,
} from "@/lib/motion/hero-story";
import { useMotionState } from "./motion-provider";
import { Brand, BrandRow } from "./brand";
import { DeviceMockup } from "./device-mockup";
import { Tilt } from "./ui";
import s from "./hero-story.module.css";

const MOTION = "(prefers-reduced-motion: no-preference)";

function CodeLine({ line }: { line: string }) {
  // Odd split indexes are the captured tokens.
  const parts = line.split(
    /(<\/?[A-Za-z]+\s*\/?>|\b(?:export|default|function|return)\b)/,
  );
  return parts.map((part, i) =>
    i % 2 ? (
      <span key={i} className={part.startsWith("<") ? s.tag : s.keyword}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function chartPath(series: number[]) {
  const min = Math.min(...series),
    range = Math.max(...series) - min || 1;
  return series
    .map(
      (value, i) =>
        `${i ? "L" : "M"}${((i / (series.length - 1)) * 160).toFixed(1)} ${(58 - ((value - min) / range) * 48).toFixed(1)}`,
    )
    .join(" ");
}

const SearchIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className={s.searchIcon}>
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.4 10.4 14 14" />
  </svg>
);

export function HeroStory({
  hero,
  project,
}: {
  hero: HeroContent;
  project: Project;
}) {
  const root = useRef<HTMLElement>(null);
  const entrance = useRef<gsap.core.Timeline | null>(null);
  const { ready, reduced } = useMotionState();
  // Hidden start state is set before first paint; it plays only once the intro hands over.
  useLayoutEffect(() => {
    if (!root.current || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const timeline = createHeroEntrance(root.current);
    entrance.current = timeline;
    return () => {
      timeline.revert();
      entrance.current = null;
    };
  }, []);
  useEffect(() => {
    if (ready) entrance.current?.play();
  }, [ready]);
  useEffect(() => {
    if (!ready || reduced || !root.current) return;
    const element = root.current;
    const media = gsap.matchMedia();
    media.add(`(min-width: 1200px) and (min-height: 560px) and ${MOTION}`, () =>
      createHeroScroll(element, HERO_SCROLL.desktop),
    );
    media.add(
      `(min-width: 900px) and (max-width: 1199.98px) and (min-height: 560px) and ${MOTION}`,
      () => createHeroScroll(element, HERO_SCROLL.tablet),
    );
    media.add(
      `(max-width: 899.98px) and ${MOTION}, (max-height: 559.98px) and ${MOTION}`,
      () => createHeroReveal(element),
    );
    return () => media.revert();
  }, [ready, reduced]);

  const [design, development, marketing] = hero.chapters;
  const { panels } = hero;
  const projectName = `${project.title}${project.accent}`;
  return (
    <section
      ref={root}
      className={`hero ${s.section}`}
      aria-labelledby="hero-title"
    >
      <div className={s.stage} data-hero-stage>
        <div className={s.atmosphere} data-hero-atmosphere aria-hidden="true">
          <span className={s.glowA} data-hero-enter="backdrop" />
          <span className={s.glowB} data-hero-enter="backdrop" />
          <span className={s.grid} />
        </div>
        <div className={s.type} aria-hidden="true">
          {hero.backdrop.map((phrase, i) => (
            <span
              key={phrase}
              className={`${s.row} ${s[`row${i}`]}`}
              data-type-row
            >
              <span data-hero-enter={i < 2 ? "type" : undefined}>{phrase}</span>
            </span>
          ))}
        </div>
        <div className={s.world} data-hero-world>
          <div className={s.intro} data-hero-frame="intro">
            <div className={s.copy} data-hero-copy>
              <h1 id="hero-title" className={s.title}>
                {hero.lines.map((line, i) => (
                  <span key={line} className={s.mask}>
                    <span
                      data-hero-enter="line"
                      className={
                        i === hero.lines.length - 1 ? s.accent : undefined
                      }
                    >
                      {line}
                    </span>
                  </span>
                ))}
              </h1>
              <p className={s.lead} data-hero-enter="support">
                {hero.description}
              </p>
              <div className={s.actions} data-hero-enter="support">
                <a className={`${s.primary} magnetic`} href={hero.primary.href}>
                  {hero.primary.label}
                  <span className={s.arrow} aria-hidden="true">
                    ↗
                  </span>
                </a>
                <a
                  className={`${s.secondary} magnetic`}
                  href={hero.secondary.href}
                >
                  <span className={s.circle} aria-hidden="true">
                    <span className={s.arrow}>↘</span>
                  </span>
                  {hero.secondary.label}
                </a>
              </div>
            </div>
            <div className={s.visual}>
              {/* Empty target the preloader's project panel travels to; never animated here. */}
              <span className={s.handoff} data-hero-visual aria-hidden="true" />
              <div className={s.mockup} data-hero-mockup data-depth="1">
                <div className={s.mockupEnter} data-hero-enter="mockup">
                  <Tilt className={s.tilt}>
                    <Link
                      href={`/projects/${project.slug}/`}
                      className={s.mockupLink}
                      aria-label={`${hero.project.cta}: ${projectName}`}
                    >
                      <DeviceMockup
                        image={project.image}
                        critical
                      />
                      <span
                        className={s.layoutGrid}
                        data-layout-grid
                        aria-hidden="true"
                      />
                      <span className={s.mockupReveal} aria-hidden="true">
                        <b>{projectName}</b>
                        {hero.project.cta}
                        <span className={s.arrow}>↗</span>
                      </span>
                    </Link>
                  </Tilt>
                </div>
              </div>
              <div
                className={`${s.panel} ${s.panelDev}`}
                data-hero-panel
                data-depth="1.35"
              >
                <div className={s.card} data-hero-enter="panel">
                  <BrandRow names={panels.development.brands} />
                  <span className={s.panelTitle}>
                    {panels.development.title}
                  </span>
                </div>
              </div>
              <div
                className={`${s.panel} ${s.panelSeo}`}
                data-hero-panel
                data-depth="1.6"
              >
                <div
                  className={`${s.card} ${s.cardRow}`}
                  data-hero-enter="panel"
                >
                  <Brand name={panels.seo.brand} />
                  <span className={s.searchPill}>
                    <SearchIcon />
                    {panels.seo.query}
                  </span>
                </div>
              </div>
              <div
                className={`${s.panel} ${s.panelAds}`}
                data-hero-panel
                data-depth="0.8"
              >
                <div
                  className={`${s.card} ${s.cardRow}`}
                  data-hero-enter="panel"
                >
                  <BrandRow names={panels.ads.brands} />
                  <span className={s.panelTitle}>{panels.ads.title}</span>
                </div>
              </div>
              <div
                className={`${s.panel} ${s.panelChart}`}
                data-hero-panel
                data-depth="1.15"
              >
                <div className={s.card} data-hero-enter="panel">
                  <svg
                    viewBox="0 0 160 64"
                    className={s.chart}
                    aria-hidden="true"
                  >
                    <path
                      d={`${chartPath(panels.chart.series)} L160 64 L0 64 Z`}
                      className={s.chartArea}
                    />
                    <path
                      d={chartPath(panels.chart.series)}
                      className={s.chartLine}
                    />
                  </svg>
                  <span className={s.panelNote}>{panels.chart.note}</span>
                </div>
              </div>
            </div>
          </div>
          <article
            className={`${s.chapter} ${s.design}`}
            data-hero-chapter={design.id}
            aria-labelledby="hero-design"
          >
            <div className={s.chapterCopy}>
              <h2 id="hero-design" className={`${s.word} ${s.wordFill}`}>
                <span className={s.mask}>
                  <span data-design-line>{design.title}</span>
                </span>
              </h2>
              <p className={s.chapterText} data-design-support>
                {design.description}
              </p>
              <p className={s.keywords} data-design-support>
                {design.keywords.join(" · ")}
              </p>
              <div className={s.kit} data-design-support aria-hidden="true">
                {hero.design.palette.map((color) => (
                  <span
                    key={color}
                    className={s.swatch}
                    style={{ background: color }}
                  />
                ))}
                <span className={s.typeface}>
                  <b>Aa</b>
                  {hero.design.typeface}
                </span>
              </div>
            </div>
          </article>
          <article
            className={`${s.chapter} ${s.frame}`}
            data-hero-frame={development.id}
            data-hero-chapter={development.id}
            aria-labelledby="hero-development"
          >
            <div className={s.chapterCopy}>
              <h2
                id="hero-development"
                className={`${s.word} ${s.wordOutline}`}
              >
                {development.title}
              </h2>
              <p className={s.chapterText}>{development.description}</p>
              <p className={s.keywords}>{development.keywords.join(" · ")}</p>
            </div>
            <div className={s.chapterVisual}>
              <div className={s.code} data-depth="1">
                <div className={s.codeBar}>
                  <i />
                  <i />
                  <i />
                  <span>{hero.development.file}</span>
                </div>
                <pre>
                  <code>
                    {hero.development.code.map((line, i) => (
                      <span key={i} className={s.codeLine}>
                        <CodeLine line={line} />
                      </span>
                    ))}
                  </code>
                </pre>
              </div>
              <ul className={s.tree} data-depth="1.45">
                {hero.development.structure.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className={s.stack} data-depth="0.7">
                <BrandRow names={hero.development.brands} />
              </div>
            </div>
          </article>
          <article
            className={`${s.chapter} ${s.frame}`}
            data-hero-frame={marketing.id}
            data-hero-chapter={marketing.id}
            aria-labelledby="hero-marketing"
          >
            <div className={s.chapterCopy} data-hero-exit-text>
              <h2 id="hero-marketing" className={`${s.word} ${s.wordBlue}`}>
                {marketing.title}
              </h2>
              <p className={s.chapterText}>{marketing.description}</p>
              <p className={s.keywords}>{marketing.keywords.join(" · ")}</p>
              <p className={s.note}>{hero.marketing.note}</p>
            </div>
            <div className={s.chapterVisual}>
              <div className={s.search} data-depth="1" data-hero-exit>
                <div className={s.searchHead}>
                  <Brand name={panels.seo.brand} />
                  <span className={s.searchPill}>
                    <SearchIcon />
                    {hero.marketing.query}
                  </span>
                </div>
                <span className={s.resultUrl}>{hero.marketing.url}</span>
                <span className={s.resultTitle}>{hero.marketing.title}</span>
                <span className={s.resultText}>
                  {hero.marketing.description}
                </span>
              </div>
              <div className={s.ad} data-depth="1.45" data-hero-exit>
                <BrandRow names={hero.marketing.adBrands} />
                <img
                  src={project.image.src.replace(".jpg", "-800.jpg")}
                  alt=""
                  width="800"
                  height="600"
                  loading="lazy"
                />
                <span className={s.adTitle}>{hero.marketing.adTitle}</span>
                <span className={s.adAction}>{hero.marketing.adAction}</span>
              </div>
            </div>
          </article>
        </div>
        <span className={s.carry} data-hero-carry aria-hidden="true" />
      </div>
    </section>
  );
}
