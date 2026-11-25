import { services } from "@/data/services";
import { brands } from "@/data/brands";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { achievements } from "@/data/achievements";
import { siteSettings, copy } from "@/data/site-settings";
import type { ContentRepository } from "@/types/content";
// Replace this adapter with API/database reads; UI and motion consume serializable data.
const repository: ContentRepository = {
  async getProjects() {
    return projects;
  },
  async getProject(slug) {
    return projects.find((project) => project.slug === slug);
  },
  async getSkills() {
    return skills;
  },
  async getAchievements() {
    return achievements;
  },
  async getSettings() {
    return siteSettings;
  },
};
export const getProjects = () => repository.getProjects();
export const getProject = (slug: string) => repository.getProject(slug);
export const getSkills = () => repository.getSkills();
export const getAchievements = () => repository.getAchievements();
export const getSiteSettings = () => repository.getSettings();
export const getCopy = () => copy;
export type Copy = typeof copy;

export function getBrand(id: string) {
  return brands[id];
}

export const getServices = async () => services;
