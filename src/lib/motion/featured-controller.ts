import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  blend,
  canAutoplay,
  loopPosition,
  orbitGeometry,
  orbitPose,
  ORBIT_PHASES,
} from "./featured-orbit.ts";

/** One pinned scroll clock; independent nested layers for the loop and hover. */
export function createFeaturedController(root: HTMLElement, count: number) {
  gsap.registerPlugin(ScrollTrigger);
  const stage = root.querySelector<HTMLElement>("[data-orbit-stage]")!;
  const plane = root.querySelector<HTMLElement>("[data-orbit-plane]")!;
  const cards = [...root.querySelectorAll<HTMLElement>("[data-orbit-card]")];
  const title = root.querySelector<HTMLElement>("[data-orbit-title]")!;
  const outline = root.querySelector<HTMLElement>("[data-orbit-outline]")!;
  const meter = root.querySelector<HTMLElement>("[data-orbit-meter]")!;
  const clock = { progress: 0 };
  let geometry = orbitGeometry(stage.clientWidth, stage.clientHeight, count);
  let offset = 0,
    visible = false,
    hovered = false,
    focused = false,
    dragging = false;
  let pointer: { id: number; x: number; y: number; offset: number } | null =
    null;
  let blockClick = false,
    resizeFrame = 0,
    refreshFrame = 0;
  let timeline: gsap.core.Timeline;
  let trigger: ScrollTrigger;
  let paint = () => {};
  let paintLoop = () => {};

  const cleanup: Array<() => void> = [];
  const listen = (
    target: EventTarget,
    type: string,
    handler: EventListener,
  ) => {
    target.addEventListener(type, handler);
    cleanup.push(() => target.removeEventListener(type, handler));
  };

  const context = gsap.context(() => {
    root.dataset.enhanced = "true";
    stage.dataset.enhanced = "true";
    const layers = cards.map((card) =>
      card.querySelector<HTMLElement>("[data-orbit-loop]")!,
    );
    // Capture initial styles in the GSAP context before using allocation-free setters.
    gsap.set([...cards, ...layers, title, outline, meter], {
      force3D: true,
    });
    // Write full transform strings directly: GSAP's transform-cache setter is for
    // individual x/rotation fields, not a composed CSS transform string.
    const transforms = cards.map((card) => (value: string) => {
      card.style.transform = value;
    });
    const opacities = cards.map((card) => gsap.quickSetter(card, "opacity"));
    const loopTransforms = layers.map((layer) =>
      gsap.quickSetter(layer, "x", "px"),
    );
    const titleTransform = (value: string) => {
      title.style.transform = value;
    };
    const outlineTransform = (value: string) => {
      outline.style.transform = value;
    };
    const titleOpacity = gsap.quickSetter(title, "opacity");
    const meterTransform = gsap.quickSetter(meter, "scaleX");

    paintLoop = () => {
      const flatten = blend(clock.progress, 0.7, 0.86);
      cards.forEach((_, i) => {
        const base = i * geometry.stride - geometry.width * 0.2;
        loopTransforms[i](
          (loopPosition(base, offset, geometry, cards.length) - base) * flatten,
        );
      });
    };
    paint = () => {
      const p = clock.progress;
      cards.forEach((card, i) => {
        const pose = orbitPose(i, p, geometry);
        transforms[i](
          `translate(-50%, -50%) translate3d(${pose.x}px, ${pose.y}px, ${pose.z}px) rotateY(${pose.rotationY}deg) rotateZ(${pose.rotationZ}deg) scale(${pose.scale})`,
        );
        opacities[i](pose.opacity);
        card.style.pointerEvents = pose.opacity < 0.9 ? "none" : "auto";
      });
      titleTransform(
        `translate3d(${-4 + p * 8}%, ${-blend(p, 0.18, 0.8) * geometry.height * 0.2}px, 0) rotateY(${-5 + p * 7}deg) scale(${1.05 - p * 0.1})`,
      );
      outlineTransform(
        `translate3d(${4 - p * 9}%, ${geometry.height * 0.19 - p * geometry.height * 0.08}px, 0)`,
      );
      titleOpacity(1 - blend(p, 0.16, 0.65) * 0.86);
      meterTransform(p);
      root.dataset.gallery = String(p >= ORBIT_PHASES.galleryReveal);
      stage.dataset.gallery = root.dataset.gallery;
      paintLoop();
    };
    const measure = () => {
      const next = orbitGeometry(stage.clientWidth, stage.clientHeight, count);
      offset = (offset / geometry.stride) * next.stride;
      geometry = next;
      stage.style.setProperty("--orbit-card-width", `${geometry.cardWidth}px`);
      paint();
    };
    measure();
    timeline = gsap.timeline({ paused: true, onUpdate: paint });
    Object.entries(ORBIT_PHASES).forEach(([name, position]) =>
      timeline.addLabel(name, position),
    );
    timeline.to(clock, { progress: 1, duration: 1, ease: "none" }, 0);
    trigger = ScrollTrigger.create({
      id: "featured-orbit",
      trigger: root,
      start: "top top",
      end: () => `+=${Math.round(stage.clientHeight * 5.4)}`,
      pin: stage,
      // The route template has a forwards-filled transform animation. A fixed
      // descendant is otherwise pinned to that ancestor, outside the viewport.
      // Keep this scene self-contained so reparenting never drops its CSS/state.
      pinReparent: true,
      // This pin mounts after the route entrance, later than downstream effects.
      // Rebuild its spacing first so Marketing/Process measure their final flow.
      refreshPriority: 1,
      animation: timeline,
      scrub: 0.65,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefresh: measure,
    });
    const resize = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        if (
          Math.abs(stage.clientWidth - geometry.width) > 1 ||
          Math.abs(stage.clientHeight - geometry.height) > 1
        ) {
          measure();
          ScrollTrigger.refresh();
        }
      });
    });
    resize.observe(stage);
    cleanup.push(() => resize.disconnect());
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.12 },
    );
    observer.observe(stage);
    cleanup.push(() => observer.disconnect());
    const tick = (_time: number, delta: number) => {
      if (
        !canAutoplay(
          clock.progress,
          visible,
          hovered,
          focused,
          dragging,
          document.hidden,
        )
      )
        return;
      // Clamp inactive-tab/frame stalls; 26px/s takes ~25 seconds to cross one card.
      offset -= (Math.min(delta, 48) / 1000) * 26;
      offset %= geometry.stride * cards.length;
      paintLoop();
    };
    gsap.ticker.add(tick);
    cleanup.push(() => gsap.ticker.remove(tick));
    refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
  }, root);

  listen(plane, "pointerover", ((event: PointerEvent) => {
    if (event.pointerType === "mouse")
      hovered = Boolean(
        (event.target as HTMLElement).closest("[data-orbit-card]"),
      );
  }) as EventListener);
  listen(plane, "pointerout", ((event: PointerEvent) => {
    if (event.pointerType === "mouse")
      hovered = Boolean(
        (event.relatedTarget as HTMLElement | null)?.closest?.(
          "[data-orbit-card]",
        ),
      );
  }) as EventListener);
  listen(plane, "pointerleave", () => {
    hovered = false;
  });
  listen(stage, "focusin", ((event: FocusEvent) => {
    focused = true;
    if (!(event.target as HTMLElement).matches(":focus-visible")) return;
    const card = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-orbit-card]",
    );
    if (!card) return;
    const index = cards.indexOf(card);
    // Tabbing always exposes the actual focused project instead of an offscreen link.
    if (clock.progress < 0.9) {
      trigger.scroll(trigger.start + (trigger.end - trigger.start) * 0.9);
      timeline.progress(0.9);
      trigger.update();
    }
    offset = geometry.width * 0.2 - index * geometry.stride;
    paint();
  }) as EventListener);
  listen(stage, "focusout", ((event: FocusEvent) => {
    focused = stage.contains(event.relatedTarget as Node | null);
  }) as EventListener);
  listen(plane, "pointerdown", ((event: PointerEvent) => {
    blockClick = false;
    if (event.button !== 0 || clock.progress < 0.86) return;
    pointer = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      offset,
    };
  }) as EventListener);
  listen(plane, "pointermove", ((event: PointerEvent) => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x,
      dy = event.clientY - pointer.y;
    if (!dragging && Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
      pointer = null;
      return;
    }
    if (!dragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      dragging = true;
      blockClick = true;
      plane.setPointerCapture(event.pointerId);
      root.dataset.dragging = "true";
      stage.dataset.dragging = "true";
    }
    if (dragging) {
      offset = pointer.offset + dx;
      paintLoop();
    }
  }) as EventListener);
  const endDrag = () => {
    if (pointer && plane.hasPointerCapture(pointer.id))
      plane.releasePointerCapture(pointer.id);
    pointer = null;
    dragging = false;
    delete root.dataset.dragging;
    delete stage.dataset.dragging;
  };
  listen(window, "pointerup", endDrag);
  listen(plane, "pointercancel", endDrag);
  listen(plane, "lostpointercapture", endDrag);
  const click = (event: MouseEvent) => {
    if (blockClick && event.detail > 0) {
      event.preventDefault();
      event.stopPropagation();
      blockClick = false;
    }
  };
  plane.addEventListener("click", click, true);
  cleanup.push(() => plane.removeEventListener("click", click, true));
  listen(plane, "keydown", ((event: KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const current = (event.target as HTMLElement).closest("[data-orbit-card]");
    if (!current) return;
    event.preventDefault();
    const index = cards.indexOf(current as HTMLElement);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? count - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + count) % count;
    cards[next]
      .querySelector<HTMLAnchorElement>("a")
      ?.focus({ preventScroll: true });
  }) as EventListener);

  return () => {
    cleanup.forEach((fn) => fn());
    cancelAnimationFrame(resizeFrame);
    cancelAnimationFrame(refreshFrame);
    context.revert();
    // quickSetter/direct CSS writes are deliberately scoped and restored here.
    [
      ...cards,
      ...root.querySelectorAll<HTMLElement>("[data-orbit-loop]"),
      title,
      outline,
      meter,
    ].forEach((node) => node.removeAttribute("style"));
    stage.style.removeProperty("--orbit-card-width");
    delete root.dataset.enhanced;
    delete root.dataset.gallery;
    delete root.dataset.dragging;
    delete stage.dataset.enhanced;
    delete stage.dataset.gallery;
    delete stage.dataset.dragging;
  };
}
