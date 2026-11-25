import { getProjects, getSiteSettings, getCopy } from "@/lib/content";
import { ProjectShowcase } from "@/components/project-showcase";
export const metadata = { title: getCopy().projects.title };
export default async function Page() {
  const [projects, settings] = await Promise.all([
    getProjects(),
    getSiteSettings(),
  ]);
  return (
    <ProjectShowcase projects={projects} settings={settings} copy={getCopy()} />
  );
}
