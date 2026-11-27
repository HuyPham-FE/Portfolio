"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project, ServiceStackContent } from "@/types/content";
import {
  createServiceStackTimeline,
  stackTiming,
} from "@/lib/motion/service-stack";
import { useMotionState } from "./motion-provider";
import { Brand } from "./brand";
import { ServiceIcon, ServiceVisual } from "./service-visuals";
import styles from "./scroll-stacking-cards.module.css";
import { Icon } from "./icon";

export function ScrollStackingCards({
  content,
  projects,
}: {
  content: ServiceStackContent;
  projects: Project[];
}) {
  const root = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotionState();
  useEffect(() => {
    const section = root.current;
    if (!section || !ready || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const stack = section.querySelector<HTMLElement>("[data-service-stack]")!;
    const layers = [
      ...stack.querySelectorAll<HTMLElement>("[data-service-layer]"),
    ];
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 900px) and (min-height: 760px)",
      () => {
        let scene: gsap.Context | undefined;
        let frame = 0;
        let disposed = false;
        let lastWidth = 0,
          lastHeight = 0;
        const install = () => {
          if (disposed) return;
          scene?.revert();
          stack.dataset.enhanced = "true";
          lastWidth = stack.clientWidth;
          lastHeight = window.innerHeight;
          const cards = layers.map((layer) =>
            layer.querySelector<HTMLElement>("[data-service-card]")!,
          );
          // Large text/zoom must stay readable: fall back to natural flow if any fixed card overflows.
          if (
            cards.some((card) => {
              const copy = card.querySelector<HTMLElement>(
                "[data-service-copy]",
              )!;
              const box = getComputedStyle(card);
              const padding =
                parseFloat(box.paddingTop) + parseFloat(box.paddingBottom);
              return (
                copy.scrollHeight + padding > card.clientHeight + 2 ||
                copy.scrollWidth > copy.clientWidth + 2
              );
            })
          ) {
            delete stack.dataset.enhanced;
            stack.style.removeProperty("--stack-distance");
            stack.style.removeProperty("--stack-stage-height");
            ScrollTrigger.refresh();
            return;
          }
          const computed = getComputedStyle(stack);
          const geometry = {
            height: layers[0].clientHeight,
            gap: window.innerHeight * 0.28,
            viewport: window.innerHeight,
            top: parseFloat(computed.getPropertyValue("--stack-top")),
            edge: parseFloat(computed.getPropertyValue("--stack-edge")),
            tail: window.innerHeight * 0.3,
            count: cards.length,
          };
          stack.style.setProperty(
            "--stack-distance",
            `${stackTiming(geometry).end}px`,
          );
          stack.style.setProperty(
            "--stack-stage-height",
            `${stackTiming(geometry).stageHeight}px`,
          );
          scene = gsap.context(() => {
            const timeline = createServiceStackTimeline(stack, geometry);
            ScrollTrigger.create({
              id: "services-stack",
              trigger: stack,
              start: `top ${geometry.top}px`,
              end: `+=${stackTiming(geometry).end}`,
              animation: timeline,
              scrub: true,
              invalidateOnRefresh: true,
            });
          }, stack);
          ScrollTrigger.refresh();
        };
        const schedule = () => {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(install);
        };
        const resize = () => {
          if (
            lastWidth !== stack.clientWidth ||
            lastHeight !== window.innerHeight
          )
            schedule();
        };
        install();
        const observer = new ResizeObserver(resize);
        observer.observe(stack);
        window.addEventListener("resize", resize);
        const images = [...stack.querySelectorAll("img")];
        images.forEach((image) => image.addEventListener("load", schedule));
        document.fonts.ready.then(() => {
          if (!disposed) schedule();
        });
        return () => {
          disposed = true;
          cancelAnimationFrame(frame);
          observer.disconnect();
          window.removeEventListener("resize", resize);
          images.forEach((image) =>
            image.removeEventListener("load", schedule),
          );
          scene?.revert();
          delete stack.dataset.enhanced;
          stack.style.removeProperty("--stack-distance");
          stack.style.removeProperty("--stack-stage-height");
        };
      },
      section,
    );
    // Wherever the pinned stage is off (phones, short laptops): CSS sticky stack.
    // A card taller than the screen must stick only once its bottom is visible,
    // so CSS needs each card's height.
    media.add(
      "(max-width: 899.98px), (max-height: 759.98px)",
      () => {
        const measure = () =>
          layers.forEach((layer) =>
            layer.style.setProperty("--card-h", `${layer.offsetHeight}px`),
          );
        const observer = new ResizeObserver(measure);
        layers.forEach((layer) => observer.observe(layer));
        return () => {
          observer.disconnect();
          layers.forEach((layer) => layer.style.removeProperty("--card-h"));
        };
      },
      section,
    );
    return () => media.revert();
  }, [ready, reduced, content]);
  return (
    <section
      id="services"
      className={styles.services}
      ref={root}
      aria-labelledby="services-title"
    >
      <header className={styles.intro}>
        <h2 id="services-title">
          {content.title} <span>{content.accent}</span>
        </h2>
        <p>{content.description}</p>
      </header>
      <div className={styles.stack} data-service-stack>
        <div className={styles.stage} data-service-stage>
          {content.cards.map((card, index) => (
            <div
              className={styles.layer}
              data-service-layer
              key={card.id}
              style={{ "--card-index": index } as CSSProperties}
            >
              <article
                className={styles.card}
                data-service-card
                aria-labelledby={`service-${card.id}`}
              >
                <div className={styles.cardCopy} data-service-copy>
                  <p className={styles.label}>
                    <span aria-hidden="true" />
                    {card.label}
                  </p>
                  <h3 id={`service-${card.id}`}>{card.title}</h3>
                  <p className={styles.description}>{card.description}</p>
                  <ul className={styles.logos} aria-label={card.label}>
                    {card.logos.map((logo) => (
                      <li key={logo.label} data-service-logo>
                        {logo.brand ? (
                          <Brand name={logo.brand} />
                        ) : (
                          <ServiceIcon type={logo.icon!} />
                        )}
                        <span>{logo.label}</span>
                      </li>
                    ))}
                  </ul>
                  {card.cta && (
                    <a className={styles.cta} href={card.cta.href}>
                      {card.cta.label}
                      <span aria-hidden="true"><Icon name="arrow-right" /></span>
                    </a>
                  )}
                </div>
                <ServiceVisual
                  card={card}
                  copy={content.visualCopy}
                  project={projects.find(
                    (project) => project.slug === card.projectSlug,
                  )}
                />
                <div
                  className={styles.shade}
                  data-service-shade
                  aria-hidden="true"
                />
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
