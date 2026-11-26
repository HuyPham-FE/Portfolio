"use client";
import type {
  AchievementContent,
  HeroContent,
  Project,
  SiteSettings,
  Skill,
  ServiceStackContent,
} from "@/types/content";
import type { Copy } from "@/lib/content";
import { useSceneMotion } from "@/hooks/use-scene-motion";
import { HeroStory } from "./hero-story";
import { SkillLab } from "./skill-lab";
import { FeaturedSlider } from "./featured-slider";
import { ProcessStory } from "./process-story";
import { TechnologyMarquee } from "./technology-marquee";
import { MarketingStory } from "./marketing-story";
import { Contact } from "./contact";
import { AboutPortrait } from "./about-portrait";
import { ScrollStackingCards } from "./scroll-stacking-cards";
export function Home({
  services,
  hero,
  projects,
  skills,
  achievements,
  settings,
  copy,
}: {
  services: ServiceStackContent;
  hero: HeroContent;
  projects: Project[];
  skills: Skill[];
  achievements: AchievementContent;
  settings: SiteSettings;
  copy: Copy;
}) {
  const root = useSceneMotion();
  return (
    <div ref={root}>
      <main id="main">
        <HeroStory
          hero={hero}
          project={
            projects.find((p) => p.slug === hero.project.slug) ?? projects[0]
          }
        />
        <div className="discipline-strip">
          {copy.hero.tags.map((t, i) => (
            <span key={t}>
              {i > 0 && <i>✳</i>}
              {t}
            </span>
          ))}
        </div>
        <AboutPortrait copy={copy.about} name={settings.name} />
        <SkillLab skills={skills} copy={copy.skills} />
        <TechnologyMarquee copy={copy.technologies} />
        <ScrollStackingCards
          content={services}
          projects={projects}
        />
        <FeaturedSlider
          projects={projects.filter((p) => p.featured)}
          spotlight={projects.find((p) => p.seo)}
          copy={copy.featured}
        />
        <MarketingStory content={achievements} copy={copy.marketing} />
        <ProcessStory copy={copy.process} />
        <Contact settings={settings} copy={copy.contact} />
      </main>
    </div>
  );
}
