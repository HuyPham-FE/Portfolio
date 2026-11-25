"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import type { Media } from "@/types/content";
import type { Copy } from "@/lib/content";
import { Preloader } from "./preloader";
const MotionContext = createContext({
  ready: false,
  reduced: false,
  revealing: false,
});
export const useMotionState = () => useContext(MotionContext);
export function MotionProvider({
  children,
  copy,
  name,
  previews,
}: {
  children: ReactNode;
  copy: Copy;
  name: string;
  previews: Media[];
}) {
  const [ready, setReady] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const page = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!ready || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      anchors: true,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [ready, reduced]);
  useEffect(() => {
    if (ready) {
      const frame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [pathname, ready]);
  return (
    <MotionContext.Provider value={{ ready, reduced, revealing }}>
      <div ref={page} data-site-shell>
        {children}
      </div>
      {!ready && (
        <Preloader
          key={pathname}
          page={page}
          disciplines={copy.hero.tags}
          previews={previews}
          onReveal={() => setRevealing(true)}
          copy={copy.loader}
          name={name}
          onComplete={() => {
            setReady(true);
            setRevealing(false);
          }}
        />
      )}
    </MotionContext.Provider>
  );
}
