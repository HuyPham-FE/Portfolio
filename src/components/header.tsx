"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { SiteSettings } from "@/types/content";
import type { Copy } from "@/lib/content";
import { Logo } from "./logo";
export function Header({
  settings,
  copy,
}: {
  settings: SiteSettings;
  copy: Copy;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 30);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <>
      <a className="skip-link" href="#main">
        {copy.nav.skip}
      </a>
      <header className={`header ${scrolled ? "is-scrolled" : ""}`}>
        <Link href="/" className="wordmark" aria-label={settings.name}>
          <Logo />
        </Link>
        <nav
          id="main-navigation"
          className={open ? "nav open" : "nav"}
          aria-label={copy.nav.label}
        >
          {settings.navigation.map((item) => (
            <Link
              key={item.href}
              onClick={() => setOpen(false)}
              href={item.href}
              className={
                (
                  item.href === "/"
                    ? pathname === "/"
                    : item.href === "/projects/" &&
                      pathname.startsWith("/projects")
                )
                  ? "active"
                  : ""
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <a
          className="button button-small header-cta"
          href={`mailto:${settings.email}`}
        >
          {copy.nav.talk}
          <span>↗</span>
        </a>
        <button
          className="menu-toggle"
          aria-label={open ? copy.nav.close : copy.nav.menu}
          aria-controls="main-navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "×" : "☰"}
        </button>
      </header>
    </>
  );
}
