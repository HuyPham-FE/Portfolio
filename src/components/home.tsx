"use client";
import Link from "next/link";
import type {
  AchievementContent,
  Project,
  SiteSettings,
  Skill,
  ServiceStackContent,
} from "@/types/content";
import type { Copy } from "@/lib/content";
import { useSceneMotion } from "@/hooks/use-scene-motion";
import { Tilt, Arrow } from "./ui";
import { DeviceMockup } from "./device-mockup";
import { SkillLab } from "./skill-lab";
import { FeaturedSlider } from "./featured-slider";
import { ProcessStory } from "./process-story";
import { TechnologyMarquee } from "./technology-marquee";
import { GrowthStory } from "./growth-story";
import { MarketingStory } from "./marketing-story";
import { Contact } from "./contact";
import { AboutPortrait } from "./about-portrait";
import { ScrollStackingCards } from "./scroll-stacking-cards";
export function Home({
  services,
  projects,
  skills,
  achievements,
  settings,
  copy,
}: {
  services: ServiceStackContent;
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
        <section className="hero">
          <div className="hero-background">
            <img
              src={copy.hero.background}
              srcSet={`${copy.hero.background.replace(".jpg", "-800.jpg")} 800w, ${copy.hero.background} 1800w`}
              sizes="(max-width: 767px) 100vw, 65vw"
              alt=""
              width="1800"
              height="1200"
              data-critical
              data-parallax
            />
          </div>
          <div className="hero-copy">
            <h1>
              {copy.hero.lines.map((line, i) => (
                <span className="line-mask" key={line}>
                  <span data-hero-line className={i === 2 ? "blue" : ""}>
                    {line}
                  </span>
                </span>
              ))}
            </h1>
            <p className="hero-description">{copy.hero.description}</p>
            <div className="hero-actions">
              <Link className="button magnetic" href="#featured">
                {copy.hero.primary}
                <Arrow diagonal />
              </Link>
              <a className="text-button" href="#process">
                <span className="play-circle">↘</span>
                {copy.hero.secondary}
              </a>
            </div>
          </div>
          <div className="hero-art" data-hero-visual>
            <div className="hero-glass" />
            <Tilt className="hero-device">
              <DeviceMockup
                image={projects[0].image}
                copy={copy.hero.mockup}
                critical
              />
            </Tilt>
            <div className="floating-label">
              <span className="blue-dot" />
              <div>
                {copy.hero.concept}
                <b>
                  {projects[0].title}
                  {projects[0].accent}
                </b>
              </div>
              <Arrow diagonal />
            </div>
          </div>
          <div className="hero-bottom">
            <a href="#about">
              <span className="scroll-line" />
              {copy.hero.scroll}
            </a>
            <span>{settings.location} &nbsp; ↗</span>
          </div>
        </section>
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
        <GrowthStory
          copy={copy.growth}
          image={projects[0].image}
          mockup={copy.hero.mockup}
        />
        <ScrollStackingCards
          content={services}
          projects={projects}
          mockup={copy.hero.mockup}
        />
        <FeaturedSlider
          projects={projects.filter((p) => p.featured)}
          copy={copy.featured}
        />
        <MarketingStory
          content={achievements}
          copy={copy.marketing}
          sourceLabel={copy.projects.source}
        />
        <ProcessStory copy={copy.process} />
        <Contact settings={settings} copy={copy.contact} />
      </main>
    </div>
  );
}
