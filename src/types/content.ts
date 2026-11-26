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
  /** Grid area name in the case-study layout. */
  id?: string;
  /** Plain-language meaning of an industry abbreviation. */
  note?: string;
  highlight?: boolean;
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
  /** Present for SEO case studies: the image is finished artwork, shown uncropped. */
  seo?: SeoCaseStudy;
}
export interface SeoCaseStudy {
  headline: string;
  discipline: string;
  overview: StoryItem[];
  rankings: { value: number; label: string }[];
  rankingNote: string;
  keywords: { keyword: string; rank: number }[];
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
}
export interface SiteSettings {
  name: string;
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

export interface HeroLink {
  label: string;
  href: string;
}
export interface HeroChapter {
  id: "design" | "development" | "marketing";
  title: string;
  description: string;
  keywords: string[];
}
/** Homepage hero copy and visuals. Motion lives in lib/motion/hero-story.ts. */
export interface HeroContent {
  lines: string[];
  description: string;
  primary: HeroLink;
  secondary: HeroLink;
  /** Giant background phrases; the scroll story shows at most two at once. */
  backdrop: string[];
  project: { slug: string; cta: string };
  panels: {
    development: { title: string; brands: string[] };
    seo: { brand: string; query: string };
    ads: { title: string; brands: string[] };
    chart: { note: string; series: number[] };
  };
  chapters: HeroChapter[];
  design: { palette: string[]; typeface: string };
  development: {
    file: string;
    code: string[];
    structure: string[];
    brands: string[];
  };
  marketing: {
    query: string;
    url: string;
    title: string;
    description: string;
    adTitle: string;
    adAction: string;
    adBrands: string[];
    note: string;
  };
}
