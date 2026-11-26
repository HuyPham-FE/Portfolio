import {
  getProjects,
  getSkills,
  getAchievements,
  getSiteSettings,
  getCopy,
  getServices,
  getHero,
} from "@/lib/content";
import { Home } from "@/components/home";
export default async function Page() {
  const [projects, skills, achievements, settings, services, hero] =
    await Promise.all([
      getProjects(),
      getSkills(),
      getAchievements(),
      getSiteSettings(),
      getServices(),
      getHero(),
    ]);
  return (
    <Home
      services={services}
      hero={hero}
      projects={projects}
      skills={skills}
      achievements={achievements}
      settings={settings}
      copy={getCopy()}
    />
  );
}
