import {
  getProjects,
  getSkills,
  getAchievements,
  getSiteSettings,
  getCopy,
  getServices,
} from "@/lib/content";
import { Home } from "@/components/home";
export default async function Page() {
  const [projects, skills, achievements, settings, services] =
    await Promise.all([
      getProjects(),
      getSkills(),
      getAchievements(),
      getSiteSettings(),
      getServices(),
    ]);
  return (
    <Home
      services={services}
      projects={projects}
      skills={skills}
      achievements={achievements}
      settings={settings}
      copy={getCopy()}
    />
  );
}
