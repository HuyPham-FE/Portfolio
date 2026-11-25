import { gsap } from "gsap";
import {
  GLASS_TIMING as T,
  IRIS_OPEN,
  RIBBON_ORBIT,
  RIBBON_READY,
  RIBBON_EXIT,
} from "./glass-geometry.ts";
interface Messages {
  stages: string[];
  ready: string;
  fallback: string;
  waiting: string;
}
export interface GlassUnfoldOptions {
  overlay: HTMLElement;
  page: HTMLElement;
  reduced: boolean;
  mobile: boolean;
  messages: Messages;
  onReveal: () => void;
  onComplete: () => void;
}
/** One master clock: abstract objects assemble, focus, then uncover the real mounted page. */
export function createGlassUnfold({
  overlay,
  page,
  reduced,
  mobile,
  messages,
  onReveal,
  onComplete,
}: GlassUnfoldOptions) {
  const hero = page.querySelector<HTMLElement>(".hero");
  const header = page.querySelector<HTMLElement>(".header");
  const lines = [
    ...(hero?.querySelectorAll<HTMLElement>("[data-hero-line]") ?? []),
  ];
  const visual = hero?.querySelector<HTMLElement>("[data-hero-visual]");
  const support = [
    ...(hero?.querySelectorAll<HTMLElement>(
      ".hero-copy > .eyebrow,.hero-description",
    ) ?? []),
  ];
  const ctas = [
    ...(hero?.querySelectorAll<HTMLElement>(
      ".hero-actions > *, .hero-bottom",
    ) ?? []),
  ];
  const oldOwner = hero?.dataset.introOwned;
  const q = (s: string) => overlay.querySelector<HTMLElement>(s);
  const qa = (s: string) => [...overlay.querySelectorAll(s)];
  const status = q("[data-progress-status]");
  // Measure the real hero visual before preparation. The project panel travels toward
  // this existing element during the handoff, without cloning or moving the homepage.
  const workBounds = q("[data-work]")?.getBoundingClientRect();
  const visualBounds = visual?.getBoundingClientRect();
  const compositionScale = mobile ? 1.08 : 1.16;
  const handoff =
    workBounds?.width && visualBounds?.width
      ? {
          x:
            (visualBounds.left +
              visualBounds.width / 2 -
              workBounds.left -
              workBounds.width / 2) /
            compositionScale,
          y:
            (visualBounds.top +
              visualBounds.height / 2 -
              workBounds.top -
              workBounds.height / 2) /
            compositionScale,
        }
      : { x: mobile ? 45 : 230, y: 60 };
  let assets: "pending" | "ready" | "failed" = "pending";
  let disposed = false,
    completed = false,
    atGate = false;
  let timeline!: gsap.core.Timeline;
  const gate = reduced ? 0.15 : T.gate;
  if (hero) hero.dataset.introOwned = "true";
  const setStatus = (text: string) => {
    if (status) status.textContent = text;
  };
  const phase = (name: string, index: number) => {
    overlay.dataset.phase = name;
    const number = q("[data-phase-index]");
    if (number) number.textContent = `0${index + 1} / 06`;
    setStatus(messages.stages[index]);
  };
  const context = gsap.context(() => {
    if (!reduced) {
      if (lines.length) gsap.set(lines, { yPercent: 85, autoAlpha: 0 });
      if (visual)
        gsap.set(visual, {
          y: mobile ? 16 : 30,
          scale: 0.96,
          rotationY: mobile ? 0 : -4,
          autoAlpha: 0.45,
        });
      if (support.length) gsap.set(support, { y: 12, autoAlpha: 0 });
      if (ctas.length) gsap.set(ctas, { y: 10, autoAlpha: 0 });
      if (header) gsap.set(header, { y: -8, autoAlpha: 0 });
    }
    timeline = gsap.timeline({
      paused: true,
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        completed = true;
        overlay.dataset.phase = "complete";
        onComplete();
      },
    });
    const readinessGate = () => {
      atGate = true;
      if (assets === "pending") {
        overlay.dataset.phase = "waiting";
        setStatus(messages.waiting);
      } else {
        atGate = false;
        timeline.play();
      }
    };
    if (reduced) {
      gsap.set(qa("[data-intro-copy]"), { opacity: 1 });
      timeline
        .addLabel("wake", 0)
        .addPause(gate, readinessGate)
        .call(
          () => {
            setStatus(assets === "ready" ? messages.ready : messages.fallback);
            onReveal();
          },
          [],
          0.2,
        )
        .to(overlay, { opacity: 0, duration: 0.3, ease: "none" }, 0.25);
      return;
    }
    Object.entries(T).forEach(([name, time]) => timeline.addLabel(name, time));
    // Establish a centered camera and quiet initial scene before the first paint.
    gsap.set(
      qa(
        "[data-identity],[data-work],[data-growth],[data-tech],[data-fragment]",
      ),
      { opacity: 0 },
    );
    gsap.set(q("[data-title-final]"), { opacity: 0, y: 14 });
    gsap.set(q("[data-skill-chips]"), { opacity: 0, y: 8 });
    gsap.set(q("[data-growth-line]"), {
      strokeDasharray: 1,
      strokeDashoffset: 1,
    });
    gsap.set(qa("[data-glass-left],[data-glass-right]"), { opacity: 0.12 });
    timeline
      .call(() => phase("wake", 0), [], 0)
      .fromTo(
        q("[data-orb-system]"),
        { scale: 0.62, opacity: 0, y: 24 },
        { scale: 1, opacity: 1, y: 0, duration: 1.1, ease: "power3.out" },
        0,
      )
      .fromTo(
        q("[data-caustic]"),
        { scale: 0.4, opacity: 0 },
        { scale: 1.2, opacity: 0.8, duration: 1.3 },
        0.12,
      )
      .fromTo(
        qa("[data-intro-copy]"),
        { opacity: 0, y: 5 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.05 },
        0.12,
      )
      .fromTo(
        qa("[data-orbit]"),
        { rotationZ: -30 },
        { rotationZ: 25, duration: 3.7, ease: "sine.inOut" },
        0,
      )
      .fromTo(
        qa("[data-fragment]"),
        { scale: 0.35, y: 30, rotationY: -30 },
        {
          opacity: 0.7,
          scale: 1,
          y: 0,
          rotationY: 15,
          duration: 1.2,
          stagger: 0.06,
        },
        0.35,
      )
      .fromTo(
        q("[data-ribbon-front]"),
        { scale: 0.5, y: 80, opacity: 0, transformOrigin: "50% 60%" },
        { scale: 1, y: 0, opacity: 0.85, duration: 1.5 },
        0.5,
      )
      .fromTo(
        q("[data-ribbon-back]"),
        { x: 50, opacity: 0 },
        { x: 0, opacity: 0.8, duration: 1.6 },
        0.8,
      )
      // The same title and project panels remain alive through Assemble, Flow and Focus.
      .call(() => phase("assemble", 1), [], T.assemble)
      .fromTo(
        q("[data-identity]"),
        { y: 35, scale: 0.72, rotationY: -17, rotationZ: -6 },
        {
          opacity: 1,
          y: -30,
          scale: 1,
          rotationY: -8,
          rotationZ: -3,
          duration: 1.05,
        },
        0.8,
      )
      .fromTo(
        q("[data-work]"),
        { x: 15, y: 25, scale: 0.65, rotationY: -20 },
        {
          opacity: 1,
          x: mobile ? 35 : 175,
          y: mobile ? 80 : 95,
          scale: 0.72,
          rotationY: -9,
          duration: 1.1,
        },
        1,
      )
      .fromTo(
        q("[data-tech]"),
        { x: 75, y: -30, scale: 0.6 },
        {
          opacity: 1,
          x: mobile ? 95 : 280,
          y: mobile ? -150 : -135,
          scale: 0.8,
          duration: 1,
        },
        1.15,
      )
      .to(
        q("[data-orb-system]"),
        { scale: 0.85, opacity: 0.4, y: 10, duration: 1.1 },
        0.9,
      )
      .call(() => phase("flow", 2), [], T.flow)
      .to(
        q("[data-identity]"),
        {
          x: mobile ? -20 : -145,
          y: mobile ? -130 : -125,
          scale: 0.68,
          rotationY: 5,
          rotationZ: 0,
          duration: 1,
        },
        1.8,
      )
      .to(
        q("[data-work]"),
        {
          x: mobile ? -20 : -215,
          y: mobile ? 35 : 10,
          scale: mobile ? 0.8 : 1,
          rotationY: 8,
          rotationZ: -3,
          duration: 1.1,
        },
        1.8,
      )
      .fromTo(
        q("[data-growth]"),
        { x: mobile ? 80 : 270, y: 70, scale: 0.7, rotationY: -18 },
        {
          opacity: 1,
          x: mobile ? 90 : 270,
          y: mobile ? -65 : -55,
          scale: mobile ? 0.65 : 0.9,
          rotationY: -10,
          duration: 1,
        },
        1.8,
      )
      .to(
        q("[data-growth-line]"),
        { strokeDashoffset: 0, duration: 1, ease: "power2.out" },
        2,
      )
      .to(
        q("[data-tech]"),
        {
          x: mobile ? 55 : 150,
          y: mobile ? 170 : 170,
          scale: 0.85,
          rotationZ: 3,
          duration: 1,
        },
        1.8,
      )
      .to(
        qa("[data-ribbon-shape]"),
        { attr: { d: RIBBON_ORBIT }, duration: 1.2, ease: "sine.inOut" },
        1.8,
      )
      .to(
        q("[data-orb-system]"),
        { scale: 1.35, opacity: 0.15, duration: 1.2 },
        1.8,
      )
      .to(
        qa("[data-fragment]"),
        {
          y: (i: number) => (i % 2 ? -35 : 25),
          rotationZ: 20,
          duration: 2.1,
          ease: "sine.inOut",
        },
        1.3,
      )
      .call(() => phase("focus", 3), [], T.focus)
      .to(
        q("[data-identity]"),
        {
          x: 0,
          y: mobile ? -75 : -60,
          scale: 1,
          rotationY: 0,
          rotationZ: 0,
          duration: 0.85,
        },
        2.9,
      )
      .to(q("[data-title-first]"), { opacity: 0, y: -12, duration: 0.3 }, 2.9)
      .to(q("[data-title-final]"), { opacity: 1, y: 0, duration: 0.55 }, 3.1)
      .to(q("[data-skill-chips]"), { opacity: 1, y: 0, duration: 0.5 }, 3.15)
      .to(
        q("[data-work]"),
        {
          x: mobile ? -25 : -115,
          y: mobile ? 90 : 110,
          scale: mobile ? 0.68 : 0.7,
          rotationY: 0,
          rotationZ: 0,
          duration: 0.85,
        },
        2.9,
      )
      .to(
        q("[data-growth]"),
        {
          x: mobile ? 70 : 210,
          y: mobile ? 70 : 105,
          scale: 0.6,
          opacity: mobile ? 0 : 0.65,
          rotationY: 0,
          duration: 0.85,
        },
        2.9,
      )
      .to(
        q("[data-tech]"),
        {
          x: mobile ? 45 : 170,
          y: mobile ? 180 : 225,
          scale: 0.65,
          opacity: 0.65,
          rotationZ: 0,
          duration: 0.85,
        },
        2.9,
      )
      .to(
        qa("[data-ribbon-shape]"),
        { attr: { d: RIBBON_READY }, duration: 0.9, ease: "sine.inOut" },
        2.9,
      )
      .to(q("[data-caustic]"), { opacity: 0.3, scale: 1.6, duration: 0.9 }, 2.9)
      .addPause(gate, readinessGate)
      .call(
        () => {
          phase("revealThreshold", 4);
          overlay.dataset.outcome = assets === "ready" ? "loaded" : "fallback";
          if (assets !== "ready") setStatus(messages.fallback);
        },
        [],
        3.81,
      )
      // Open a curved full-height seam through the veil, exposing only the actual page.
      .to(
        q("[data-composition]"),
        { scale: mobile ? 1.08 : 1.16, duration: 1.1 },
        3.8,
      )
      .to(
        q("[data-identity]"),
        { scale: 1.15, y: -80, opacity: 0, duration: 0.8 },
        3.9,
      )
      .to(
        q("[data-work]"),
        { x: handoff.x, y: handoff.y, opacity: 0, duration: 0.95 },
        3.9,
      )
      .to(
        q("[data-growth]"),
        { x: mobile ? 110 : 370, opacity: 0, duration: 0.65 },
        3.85,
      )
      .to(
        q("[data-tech]"),
        { x: mobile ? 130 : 300, y: 230, opacity: 0, duration: 0.65 },
        3.9,
      )
      .to(
        qa("[data-fragment],[data-orb-system],[data-caustic]"),
        { opacity: 0, scale: 1.15, duration: 0.7 },
        3.85,
      )
      .to(
        q("[data-iris]"),
        { attr: { d: IRIS_OPEN }, duration: 1.45, ease: "power3.inOut" },
        3.9,
      )
      .to(
        q("[data-glass-left]"),
        {
          opacity: 0,
          xPercent: -80,
          rotationY: mobile ? 0 : -12,
          duration: 1.45,
        },
        3.9,
      )
      .to(
        q("[data-glass-right]"),
        {
          opacity: 0,
          xPercent: 80,
          rotationY: mobile ? 0 : 12,
          duration: 1.45,
        },
        3.9,
      )
      .to(q("[data-intro-atmosphere]"), { opacity: 0, duration: 1.3 }, 3.9)
      .to(
        qa("[data-ribbon-shape]"),
        { attr: { d: RIBBON_EXIT }, duration: 1.2, ease: "sine.inOut" },
        3.9,
      )
      .to(
        q("[data-ribbon-front]"),
        { x: mobile ? 80 : 220, y: 150, opacity: 0, duration: 1.55 },
        4,
      )
      .to(
        q("[data-ribbon-back]"),
        { x: -140, y: -160, opacity: 0, duration: 1.4 },
        4,
      )
      .to(qa("[data-intro-copy]"), { opacity: 0, y: -5, duration: 0.5 }, 4.4)
      .call(
        () => {
          phase("heroReveal", 5);
          onReveal();
        },
        [],
        T.heroReveal,
      );
    if (visual)
      timeline.to(
        visual,
        {
          y: 0,
          scale: 1,
          rotationY: 0,
          autoAlpha: 1,
          duration: 1.1,
          ease: "power3.out",
        },
        4.55,
      );
    if (lines.length)
      timeline.to(
        lines,
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
        },
        4.65,
      );
    if (header)
      timeline.to(header, { y: 0, autoAlpha: 1, duration: 0.65 }, 4.95);
    if (support.length)
      timeline.to(
        support,
        { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.06 },
        5.3,
      );
    if (ctas.length)
      timeline.to(
        ctas,
        { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.04 },
        5.65,
      );
    timeline
      .set(overlay, { visibility: "hidden" }, 5.65)
      .to({}, { duration: 0.55 }, 5.65);
  });
  return {
    timeline,
    settleAssets(success: boolean) {
      if (disposed || assets !== "pending") return;
      assets = success ? "ready" : "failed";
      if (atGate) {
        atGate = false;
        timeline.play();
      }
    },
    finishImmediately() {
      if (disposed) return;
      if (assets === "pending") assets = "failed";
      timeline.removePause(gate);
      timeline.progress(1, false);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      context.revert();
      if (hero && !completed) {
        if (oldOwner === undefined) delete hero.dataset.introOwned;
        else hero.dataset.introOwned = oldOwner;
      }
    },
  };
}
/** Locks native scrolling before Lenis starts, without changing document width or scroll position. */
export function lockIntroInteraction(page: HTMLElement) {
  const html = document.documentElement;
  const body = document.body;
  const oldOverflow = html.style.overflow;
  const oldPadding = body.style.paddingRight;
  const oldInert = page.inert;
  const oldBusy = page.getAttribute("aria-busy");
  const oldScrollBehavior = html.style.scrollBehavior;
  const widthBefore = html.clientWidth;
  const scrollX = window.scrollX,
    scrollY = window.scrollY;
  html.style.overflow = "hidden";
  const scrollbar = Math.max(0, html.clientWidth - widthBefore);
  if (scrollbar)
    body.style.paddingRight = `${(parseFloat(getComputedStyle(body).paddingRight) || 0) + scrollbar}px`;
  html.style.scrollBehavior = "auto";
  page.inert = true;
  page.setAttribute("aria-busy", "true");
  const stop = (event: Event) => {
    if (event.cancelable) event.preventDefault();
  };
  window.addEventListener("wheel", stop, { passive: false });
  window.addEventListener("touchmove", stop, { passive: false });
  let restored = false;
  return () => {
    if (restored) return;
    restored = true;
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchmove", stop);
    html.style.overflow = oldOverflow;
    body.style.paddingRight = oldPadding;
    page.inert = oldInert;
    if (oldBusy === null) page.removeAttribute("aria-busy");
    else page.setAttribute("aria-busy", oldBusy);
    window.scrollTo(scrollX, scrollY);
    html.style.scrollBehavior = oldScrollBehavior;
  };
}
