import type { BrandAsset } from "@/types/content";
/** Platform identities, not client logos or certifications. */
export const brands: Record<string, BrandAsset> = {
  meta: { name: "Meta Ads", src: "/brands/meta.svg" },
  googleads: { name: "Google Ads", src: "/brands/googleads.svg" },
  googleanalytics: {
    name: "Google Analytics",
    src: "/brands/googleanalytics.svg",
  },
  wordpress: { name: "WordPress", src: "/brands/wordpress.svg" },
  gsap: { name: "GSAP", src: "/brands/gsap.svg" },
  javascript: { name: "JavaScript", src: "/brands/javascript.svg" },
  html: { name: "HTML5", src: "/brands/html5.svg" },
  css: { name: "CSS", src: "/brands/css.svg" },
  react: { name: "React", src: "/brands/react.svg" },
  next: { name: "Next.js", src: "/brands/nextdotjs.svg" },
  typescript: { name: "TypeScript", src: "/brands/typescript.svg" },
  figma: { name: "Figma", src: "/brands/figma.svg" },
  google: { name: "Google", src: "/brands/google.svg" },
  facebook: { name: "Facebook", src: "/brands/facebook.svg" },
};
