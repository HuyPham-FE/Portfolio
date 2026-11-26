import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import { getSiteSettings, getCopy, getProjects } from "@/lib/content";
import { Header } from "@/components/header";
import { MotionProvider } from "@/components/motion-provider";
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    title: { default: s.seo.title, template: `%s — ${s.name}` },
    description: s.seo.description,
    openGraph: {
      title: s.seo.title,
      description: s.seo.description,
      locale: "vi_VN",
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, projects] = await Promise.all([
    getSiteSettings(),
    getProjects(),
  ]);
  const copy = getCopy();
  return (
    <html lang="vi">
      <body>
        <noscript>
          <style>{`.preloader{display:none!important}`}</style>
        </noscript>
        {/* Outline text traces the filled glyph edge: -webkit-text-stroke would
            draw Manrope's overlapping variable-font contours (box in A, X crossings). */}
        <svg className="svg-defs" aria-hidden="true" focusable="false">
          <filter id="text-outline">
            <feComponentTransfer in="SourceAlpha" result="solid">
              <feFuncA type="linear" slope="40" />
            </feComponentTransfer>
            <feMorphology in="SourceGraphic" operator="dilate" radius="1" result="grown" />
            <feComposite in="grown" in2="solid" operator="out" />
          </filter>
        </svg>
        <MotionProvider
          copy={copy}
          name={settings.name}
          previews={projects.slice(0, 2).map((project) => project.image)}
        >
          <Header settings={settings} copy={copy} />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
