export interface Media {
  src: string;
  alt: string;
  credit?: string;
}
export interface StoryItem {
  title: string;
  description: string;
}
export interface Metric {
  value: number;
  suffix: string;
  label: string;
  verified: boolean;
  source?: string;
}
export interface Project {
  slug: string;
  title: string;
  accent: string;
  category: string;
  description: string;
  summary: string;
  status: "concept" | "published";
  featured: boolean;
  image: Media;
  gallery: Media[];
  role: string[];
  duration: string;
  year: string;
  industry: string;
  technologies: string[];
  website?: string;
  challenges: StoryItem[];
  solutions: StoryItem[];
  results: Metric[];
  resultNote: string;
}
export interface BrandAsset {
  name: string;
  src: string;
}
export interface Skill {
  id: string;
  name: string;
  icon: string;
  brands: string[];
  description: string;
  tools: string[];
  detail: string;
}
export interface AchievementContent {
  metrics: Metric[];
  demoSeries: number[];
  demoLabel: string;
  emptyLabel: string;
  impact: StoryItem[];
}
export interface SiteSettings {
  name: string;
  shortName: string;
  role: string;
  email: string;
  phone: string;
  phoneHref: string;
  location: string;
  seo: { title: string; description: string };
  navigation: { label: string; href: string }[];
  socials: { label: string; href: string }[];
}
export interface ContentRepository {
  getProjects(): Promise<Project[]>;
  getProject(slug: string): Promise<Project | undefined>;
  getSkills(): Promise<Skill[]>;
  getAchievements(): Promise<AchievementContent>;
  getSettings(): Promise<SiteSettings>;
}

export interface ServiceStackCard {
  id: string;
  label: string;
  title: string;
  description: string;
  logos: { label: string; brand?: string; icon?: "search" | "document" }[];
  visual: "website" | "search" | "marketing";
  projectSlug?: string;
  cta?: { label: string; href: string };
}
export interface ServiceStackContent {
  title: string;
  accent: string;
  description: string;
  cards: ServiceStackCard[];
  visualCopy: {
    websiteCaption: string;
    searchQuery: string;
    searchUrl: string;
    searchTitle: string;
    searchDescription: string;
    searchTags: string[];
    searchGraph: string;
    dashboardTitle: string;
    dashboardTabs: string[];
    dashboardSignals: string[];
    illustrationNote: string;
  };
}
