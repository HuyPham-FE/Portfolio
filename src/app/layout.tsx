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
