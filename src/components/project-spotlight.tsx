import Link from "next/link";
import type { Project } from "@/types/content";
import { Tilt, Arrow } from "./ui";
import s from "./project-spotlight.module.css";

/**
 * Asymmetric showcase for a case study whose image is finished artwork (VietyachtPlus).
 * Reveal, parallax and the magnetic button come from the page's useSceneMotion.
 */
export function ProjectSpotlight({
  project: p,
  view,
}: {
  project: Project;
  view: string;
}) {
  const href = `/projects/${p.slug}/`;
  return (
    <article className={s.spotlight} aria-labelledby={`${p.slug}-spotlight`}>
      <div className={s.visual}>
        <div data-parallax>
          <div className={s.reveal} data-reveal>
            <Tilt className={s.tilt}>
              {/* The button below is the accessible link; this one is a pointer shortcut. */}
              <Link href={href} className={s.frame} tabIndex={-1} aria-hidden="true">
                <img
                  src={p.image.src}
                  srcSet={`${p.image.src.replace(/\.(jpg|webp)$/, "-800.$1")} 800w, ${p.image.src} 1648w`}
                  sizes="(max-width: 1099px) 92vw, 62vw"
                  alt=""
                  width="1648"
                  height="928"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
            </Tilt>
          </div>
        </div>
      </div>
      <div className={s.info}>
        <p className={s.label} data-reveal>
          {p.category}
        </p>
        <h3 id={`${p.slug}-spotlight`} className={s.name} data-reveal>
          {p.title}
          <span>{p.accent}</span>
        </h3>
        {p.seo && (
          <p className={s.headline} data-reveal>
            {p.seo.headline}
          </p>
        )}
        <p className={s.summary} data-reveal>
          {p.summary}
        </p>
        <Link className={`button magnetic ${s.cta}`} href={href}>
          {view}
          <Arrow />
        </Link>
      </div>
    </article>
  );
}
