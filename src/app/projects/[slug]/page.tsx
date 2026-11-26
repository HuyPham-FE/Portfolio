import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getProjects,
  getProject,
  getSiteSettings,
  getCopy,
} from "@/lib/content";
import { ProjectDetail } from "@/components/project-detail";
import { SeoCaseStudy } from "@/components/seo-case-study";
export const dynamicParams = false;
export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);
  return p ? { title: `${p.title}${p.accent}`, description: p.summary } : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, projects, settings] = await Promise.all([
    getProject(slug),
    getProjects(),
    getSiteSettings(),
  ]);
  if (!project) notFound();
  const index = projects.findIndex((p) => p.slug === slug);
  const Detail = project.seo ? SeoCaseStudy : ProjectDetail;
  return (
    <Detail
      project={project}
      next={projects[(index + 1) % projects.length]}
      settings={settings}
      copy={getCopy()}
    />
  );
}
