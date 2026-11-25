"use client";
import { useLayoutEffect, useRef } from "react";
import type { Copy } from "@/lib/content";
import type { Media } from "@/types/content";
import { watchCriticalAssets } from "@/lib/motion/critical-assets";
import { BrandRow } from "./brand";
import { GlassScene } from "./glass-scene";
import {
  createGlassUnfold,
  lockIntroInteraction,
} from "@/lib/motion/glass-unfold";
import { INTRO_SESSION_KEY } from "@/lib/motion/glass-geometry";
interface Props {
  copy: Copy["loader"];
  name: string;
  disciplines: string[];
  previews: Media[];
  page: React.RefObject<HTMLDivElement | null>;
  onReveal: () => void;
  onComplete: () => void;
}
export function Preloader({
  copy,
  name,
  disciplines,
  previews,
  page,
  onReveal,
  onComplete,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onReveal, onComplete });
  callbacks.current = { onReveal, onComplete };
  useLayoutEffect(() => {
    if (!root.current || !page.current) return;
    const overlay = root.current,
      content = page.current;
    let visited = false;
    try {
      visited = sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
    } catch {}
    const replay =
      new URLSearchParams(location.search).get("intro") === "replay";
    if (visited && !replay) {
      callbacks.current.onComplete();
      return;
    }
    let disposed = false,
      finished = false;
    let hardStop: ReturnType<typeof setTimeout> | undefined;
    const unlock = lockIntroInteraction(content);
    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    const finish = () => {
      if (disposed || finished) return;
      finished = true;
      clearTimeout(hardStop);
      try {
        sessionStorage.setItem(INTRO_SESSION_KEY, "1");
      } catch {}
      unlock();
      callbacks.current.onComplete();
    };
    const controller = createGlassUnfold({
      overlay,
      page: content,
      reduced: motionQuery.matches || typeof window.SVGElement === "undefined",
      mobile: matchMedia("(max-width: 767px)").matches,
      messages: copy,
      onReveal: () => callbacks.current.onReveal(),
      onComplete: finish,
    });
    const cancelAssets = watchCriticalAssets(content, {
      fontsReady: document.fonts.ready,
      onProgress: (ratio) => {
        overlay.dataset.assetReadiness = String(ratio);
      },
      onSettled: ({ success }) => controller.settleAssets(success),
    });
    // The single master begins immediately, independently of cached/uncached asset speed.
    // Hold the composed focus scene until hero images and fonts settle.
    controller.timeline.play(0);
    hardStop = setTimeout(() => {
      if (disposed || finished) return;
      controller.finishImmediately();
      finish();
    }, 11000);
    const motionChange = () => {
      if (motionQuery.matches) {
        controller.finishImmediately();
        finish();
      }
    };
    motionQuery.addEventListener("change", motionChange);
    return () => {
      disposed = true;
      clearTimeout(hardStop);
      cancelAssets();
      motionQuery.removeEventListener("change", motionChange);
      controller.dispose();
      unlock();
    };
  }, [copy, page]);
  return (
    <div ref={root} className="preloader cinematic-intro" data-phase="wake">
      <GlassScene />
      <div className="intro-masthead" data-intro-copy aria-hidden="true">
        <b>{name}</b>
        <span>{copy.edition}</span>
        <div>
          {disciplines.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <div className="intro-world" aria-hidden="true">
        <div className="intro-caustic" data-caustic />
        <div className="intro-orb-system" data-orb-system>
          <div className="intro-orbit intro-orbit-back" data-orbit />
          <div className="intro-orb" data-orb>
            <div />
          </div>
          <div className="intro-orbit intro-orbit-front" data-orbit />
        </div>
        <div className="intro-fragments">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              data-fragment
              className={"intro-fragment fragment-" + i}
            />
          ))}
        </div>
        <div className="intro-composition" data-composition>
          <div className="intro-panel intro-identity" data-identity>
            <span className="intro-micro">{copy.identityLabel}</span>
            <div className="intro-title">
              <span data-title-first>{copy.title}</span>
              <span data-title-final>{copy.focusTitle}</span>
            </div>
            <span className="intro-identity-role">{copy.role}</span>
            <div className="intro-skill-chips" data-skill-chips>
              {copy.skills.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
          <div className="intro-panel intro-work" data-work>
            <div className="intro-panel-heading">
              <span>{copy.projectTitle}</span>
              <span className="intro-micro">{copy.projectType}</span>
            </div>
            {previews[0] && (
              <img
                src={previews[0].src.replace(".jpg", "-800.jpg")}
                alt=""
                width="800"
                height="600"
              />
            )}
            <span className="intro-micro intro-image-note">
              {copy.previewNote}
            </span>
          </div>
          <div className="intro-panel intro-growth" data-growth>
            <div className="intro-platform-heading">
              <span className="intro-panel-heading">{copy.growthTitle}</span>
              <BrandRow names={copy.marketingBrands} />
            </div>
            <svg viewBox="0 0 240 110" fill="none">
              <path
                d="M10 95 H230 M10 65 H230 M10 35 H230"
                stroke="currentColor"
                opacity=".1"
              />
              <path
                data-growth-line
                d="M12 91 C45 88 43 67 78 70 S115 56 141 54 S179 43 218 13"
                stroke="currentColor"
                strokeWidth="2"
                pathLength="1"
              />
              <path
                d="M205 14 L220 11 L218 26"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <span className="intro-micro">{copy.growthNote}</span>
          </div>
          <div className="intro-panel intro-tech" data-tech>
            <BrandRow names={copy.developmentBrands} />
            <div>
              <span className="intro-panel-heading">{copy.techTitle}</span>
              <span className="intro-micro">{copy.techStack}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="intro-caption" data-intro-copy>
        <span className="intro-phase-index" data-phase-index aria-hidden="true">
          01 / 06
        </span>
        <p data-progress-status role="status" aria-live="polite">
          {copy.stages[0]}
        </p>
        <span className="intro-caption-rule" aria-hidden="true" />
      </div>
    </div>
  );
}
