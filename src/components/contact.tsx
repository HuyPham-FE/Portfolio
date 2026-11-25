import type { SiteSettings } from "@/types/content";
import type { Copy } from "@/lib/content";
import { Heading, Arrow } from "./ui";
export function Contact({
  settings,
  copy,
}: {
  settings: SiteSettings;
  copy: Copy["contact"];
}) {
  return (
    <>
      <section id="contact" className="contact section-shell">
        <div className="contact-copy">
          <Heading>{copy.title}</Heading>
          <p>{copy.body}</p>
          <a className="button magnetic" href={`mailto:${settings.email}`}>
            {copy.cta}
            <Arrow diagonal />
          </a>
          <div className="contact-links">
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
            <a href={`tel:${settings.phoneHref}`}>{settings.phone}</a>
          </div>
        </div>
        <div className="contact-art" aria-hidden="true">
          <div className="glass-ribbon ribbon-one" />
          <div className="glass-ribbon ribbon-two" />
          <div className="contact-note">
            <span>↗</span>
            <p>{settings.role}</p>
            <small>{settings.location}</small>
          </div>
        </div>
      </section>
      <footer className="footer">
        <a className="wordmark" href="/">
          {settings.shortName}
          <span>.</span>
        </a>
        <span>{copy.copyright}</span>
        <span className="footer-note">{copy.footer}</span>
        <a href="#main">{copy.back} ↑</a>
        {settings.socials.map((s) => (
          <a
            href={s.href}
            key={s.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {s.label}
          </a>
        ))}
      </footer>
    </>
  );
}
