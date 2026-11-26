"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { AchievementContent } from "@/types/content";
import type { Copy } from "@/lib/content";
import { formatNumber } from "@/lib/format";
import { createCaseEntrance } from "@/lib/motion/marketing-case";
import { useMotionState } from "./motion-provider";
import { BrandRow } from "./brand";
import s from "./marketing-story.module.css";

export function MarketingStory({
  content,
  copy,
}: {
  content: AchievementContent;
  copy: Copy["marketing"];
}) {
  const root = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotionState();
  const metrics = content.metrics.filter((m) => m.verified && m.source);
  const sources = [...new Set(metrics.map((m) => m.source!))];

  useEffect(() => {
    if (!ready || reduced || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const section = root.current;
    const media = gsap.matchMedia();
    media.add(
      { wide: "(min-width: 1100px)", stacked: "(max-width: 1099px)" },
      (context) => {
        // Stacked layouts reveal the metrics when they, not the intro, reach the viewport.
        const parts: ("all" | "intro" | "metrics")[] = context.conditions?.wide
          ? ["all"]
          : ["intro", "metrics"];
        const restores = parts.map((part) => {
          const { timeline, restore } = createCaseEntrance(section, part);
          ScrollTrigger.create({
            trigger: section.querySelector(
              part === "metrics" ? "[data-case-grid]" : "[data-case-intro]",
            ),
            start: "top 80%",
            animation: timeline,
            once: true,
          });
          return restore;
        });
        return () => restores.forEach((restore) => restore());
      },
      section,
    );
    return () => media.revert();
  }, [ready, reduced]);

  return (
    <section
      ref={root}
      className={`${s.section} section-shell`}
      aria-labelledby="case-study-title"
    >
      <div className={s.backdrop} aria-hidden="true">
        <svg className={s.curveTop} viewBox="0 0 600 420" fill="none" data-parallax>
          <defs>
            <linearGradient id="case-curve-top" x1="600" y1="0" x2="80" y2="420">
              <stop stopColor="#2864f0" stopOpacity=".32" />
              <stop offset="1" stopColor="#2864f0" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 26, 52, 78].map((d) => (
            <path
              key={d}
              d={`M${120 + d} -20 C ${180 + d} ${150 + d}, ${380 + d} ${250 + d}, ${640} ${230 + d * 1.4}`}
              stroke="url(#case-curve-top)"
              strokeWidth={d ? 1 : 1.6}
            />
          ))}
        </svg>
        <svg className={s.curveBottom} viewBox="0 0 600 420" fill="none" data-parallax>
          <defs>
            <linearGradient id="case-curve-bottom" x1="0" y1="420" x2="520" y2="0">
              <stop stopColor="#2864f0" stopOpacity=".26" />
              <stop offset="1" stopColor="#2864f0" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 26, 52].map((d) => (
            <path
              key={d}
              d={`M-40 ${150 - d} C ${160 + d} ${170 - d}, ${300 + d} ${290 - d}, ${380 + d * 1.3} 440`}
              stroke="url(#case-curve-bottom)"
              strokeWidth={d ? 1 : 1.6}
            />
          ))}
        </svg>
      </div>

      <div className={s.intro} data-case-intro>
        <p className={s.label} data-case-label>
          {copy.label}
        </p>
        <p className={s.client}>
          <span className={s.mask}>
            <span data-case-line>{copy.client}</span>
          </span>
        </p>
        <span className={s.rule} data-case-rule aria-hidden="true" />
        <h2 id="case-study-title" className={s.title}>
          {copy.title.split("\n").map((line, i) => (
            <span className={s.mask} key={line}>
              <span data-case-line className={i ? s.accent : undefined}>
                {line}
              </span>{" "}
            </span>
          ))}
        </h2>
        <p className={s.body} data-case-fade>
          {copy.body}
        </p>
        <div className={s.platforms} data-case-fade>
          <BrandRow names={copy.platforms} labels />
        </div>
      </div>

      <div className={s.data}>
        <dl className={s.grid} data-case-grid>
          {metrics.map((m) => (
            <div
              key={m.label}
              className={m.highlight ? `${s.metric} ${s.highlight}` : s.metric}
              style={{ gridArea: m.id }}
              data-case-metric
            >
              <dt className={s.term}>
                {m.label}
                {m.note && <span className={s.note}>{m.note}</span>}
              </dt>
              <dd className={s.value}>
                {/* The count-up is visual only; assistive tech reads the exact value. */}
                <span className={s.figure} aria-hidden="true">
                  <span data-case-value={m.value}>{formatNumber(m.value)}</span>
                  {m.suffix && <small>{m.suffix}</small>}
                </span>
                <span className="sr-only">
                  {formatNumber(m.value)}
                  {m.suffix}
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <p className={s.source} data-case-note>
          {copy.sourceLabel}: {sources.join(" · ")}
        </p>
      </div>
    </section>
  );
}
