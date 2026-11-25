"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Copy } from "@/lib/content";
import type { Media } from "@/types/content";
import { useMotionState } from "./motion-provider";
import { DeviceMockup } from "./device-mockup";
import { Brand, BrandRow } from "./brand";
import { createGrowthTimeline } from "@/lib/motion/growth-story";
export function GrowthStory({
  copy,
  image,
  mockup,
}: {
  copy: Copy["growth"];
  image: Media;
  mockup: Copy["hero"]["mockup"];
}) {
  const root = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotionState();
  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const stage = section.querySelector<HTMLElement>(".growth-stage")!;
    const build = section.querySelector<HTMLElement>(".growth-build")!;
    const market = section.querySelector<HTMLElement>(".growth-market")!;
    const svg = section.querySelector<SVGSVGElement>(".growth-connection")!;
    const update = () => {
      const vertical =
        market.offsetTop > build.offsetTop + build.offsetHeight / 2;
      const x1 =
        build.offsetLeft + build.offsetWidth * (vertical ? 0.48 : 0.84);
      const y1 =
        build.offsetTop + build.offsetHeight * (vertical ? 0.94 : 0.66);
      const x2 =
        market.offsetLeft + market.offsetWidth * (vertical ? 0.52 : 0.08);
      const y2 =
        market.offsetTop + market.offsetHeight * (vertical ? 0.06 : 0.28);
      const midX = (x1 + x2) / 2,
        midY = (y1 + y2) / 2;
      const d = vertical
        ? "M " +
          x1 +
          " " +
          y1 +
          " C " +
          (x1 + 80) +
          " " +
          midY +
          " " +
          (x2 - 80) +
          " " +
          midY +
          " " +
          x2 +
          " " +
          y2
        : "M " +
          x1 +
          " " +
          y1 +
          " C " +
          midX +
          " " +
          (y1 - 100) +
          " " +
          midX +
          " " +
          (y2 + 100) +
          " " +
          x2 +
          " " +
          y2;
      svg.setAttribute(
        "viewBox",
        "0 0 " + stage.clientWidth + " " + stage.clientHeight,
      );
      svg.querySelectorAll("path").forEach((path) => path.setAttribute("d", d));
      const signal = svg.querySelector("circle");
      signal?.setAttribute("cx", String(midX));
      signal?.setAttribute("cy", String(midY));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(stage);
    observer.observe(build);
    observer.observe(market);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!ready || !root.current) return;
    const section = root.current;
    if (reduced) {
      section.dataset.storyStage = "2";
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const timeline = createGrowthTimeline(section);
      ScrollTrigger.create({
        trigger: section,
        start: "top 65%",
        end: "bottom 75%",
        scrub: 0.8,
        animation: timeline,
      });
    }, section);
    return () => {
      ctx.revert();
      delete section.dataset.storyStage;
    };
  }, [ready, reduced]);
  return (
    <section id="value" className="growth-story section-shell" ref={root}>
      <div className="growth-heading">
        <h2 className="section-title">{copy.title}</h2>
        <p>{copy.body}</p>
      </div>
      <div className="growth-stage">
        <svg
          className="growth-connection"
          viewBox="0 0 1200 600"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M130 300 C340 50 370 540 620 320 S900 100 1110 260"
            stroke="#b5cef8"
            strokeWidth="1"
          />
          <path
            data-growth-connection
            d="M130 300 C340 50 370 540 620 320 S900 100 1110 260"
            stroke="#2864f0"
            strokeWidth="3"
            pathLength="1"
          />
          <circle data-growth-signal cx="620" cy="320" r="8" fill="#2864f0" />
        </svg>
        <div className="growth-build" data-build>
          <div className="growth-code" data-build-code>
            <div>
              <span />
              <span />
              <span />
              <b>{copy.codeLabel}</b>
            </div>
            <pre>
              <code>{copy.code.join("\n")}</code>
            </pre>
          </div>
          <div className="growth-browser" data-build-browser>
            <DeviceMockup image={image} copy={mockup} />
          </div>
          <div className="growth-tech" data-build-tech>
            <BrandRow names={copy.technologies} />
            <span>{copy.browserLabel}</span>
          </div>
        </div>
        <div className="growth-market" data-grow>
          <div className="growth-search" data-grow-item>
            <div className="growth-searchbar">
              <Brand name={copy.platforms[0]} />
              <span>{copy.searchQuery}</span>
              <span aria-hidden="true">⌕</span>
            </div>
            <h3>{copy.searchTitle}</h3>
            <p>{copy.searchDescription}</p>
            <div className="search-lines" aria-hidden="true">
              <i />
              <i />
            </div>
          </div>
          <div className="growth-ad" data-grow-item>
            <div className="growth-ad-top">
              <Brand name={copy.platforms[1]} label />
              <span>{copy.adLabel}</span>
            </div>
            <h3>{copy.adTitle}</h3>
            <p>{copy.adDescription}</p>
            <svg viewBox="0 0 300 105" fill="none" aria-hidden="true">
              <path d="M5 95 H295 M5 55 H295 M5 15 H295" stroke="#dbe5f5" />
              <path
                data-story-chart
                d="M10 88 C70 85 75 34 120 45 S198 65 230 25 S265 34 290 9"
                pathLength="1"
                stroke="#2864f0"
                strokeWidth="3"
              />
            </svg>
            <span className="growth-chart-label">{copy.chartLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
