"use client";
import type { Copy } from "@/lib/content";
import { Brand } from "./brand";
import { useMotionState } from "./motion-provider";
export function TechnologyMarquee({ copy }: { copy: Copy["technologies"] }) {
  const { ready, reduced } = useMotionState();
  return (
    <section className="technology-section" aria-labelledby="technology-title">
      <div className="technology-heading">
        <h2 id="technology-title">{copy.title}</h2>
        <p>{copy.description}</p>
      </div>
      <div
        className="technology-viewport"
        tabIndex={0}
        role="region"
        aria-label={copy.title}
        data-paused={!ready || reduced}
      >
        <div className="technology-track">
          {[0, 1].map((track) => (
            <ul
              className="technology-group"
              key={track}
              aria-hidden={track === 1 ? true : undefined}
            >
              {copy.brands.map((name) => (
                <li key={name}>
                  <Brand name={name} label />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
