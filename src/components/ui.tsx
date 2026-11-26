"use client";
import { useEffect, useRef, type ReactNode, type PointerEvent } from "react";
import gsap from "gsap";
import { useMotionState } from "./motion-provider";
import { Icon } from "./icon";
export function Tilt({
  children,
  className = "",
  disabled = false,
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const { reduced } = useMotionState();
  useEffect(
    () => () => {
      tween.current?.kill();
    },
    [],
  );
  useEffect(() => {
    if (disabled || reduced) {
      tween.current?.kill();
      gsap.set(ref.current, { clearProps: "transform" });
    }
  }, [disabled, reduced]);
  function move(e: PointerEvent<HTMLDivElement>) {
    if (disabled || reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    tween.current?.kill();
    tween.current = gsap.to(ref.current, {
      rotateY: ((e.clientX - r.left - r.width / 2) / r.width) * 8,
      rotateX: (-(e.clientY - r.top - r.height / 2) / r.height) * 7,
      duration: 0.5,
      overwrite: true,
    });
  }
  function leave() {
    tween.current?.kill();
    tween.current = gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      duration: disabled || reduced ? 0 : 0.7,
      overwrite: true,
    });
  }
  return (
    <div className={className} onPointerMove={move} onPointerLeave={leave}>
      <div ref={ref} className="tilt-inner">
        {children}
      </div>
    </div>
  );
}
export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <span aria-hidden="true">
      <Icon name={diagonal ? "arrow-up-right" : "arrow-right"} />
    </span>
  );
}
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow">
      <span />
      {children}
    </p>
  );
}
export function Heading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={`section-title ${className}`} data-reveal>
      {children}
    </h2>
  );
}
