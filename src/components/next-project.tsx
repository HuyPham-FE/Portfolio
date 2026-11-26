import Link from "next/link";
import type { Project } from "@/types/content";
import { Icon } from "./icon";

/** Full-bleed link to the following case study, shared by every project page. */
export function NextProject({
  project: next,
  label,
}: {
  project: Project;
  label: string;
}) {
  return (
    <Link className="next-project" href={`/projects/${next.slug}/`}>
      <img
        src={next.image.src}
        srcSet={`${next.image.src.replace(/\.(jpg|webp)$/, "-800.$1")} 800w, ${next.image.src} 1800w`}
        sizes="100vw"
        alt={next.image.alt}
        loading="lazy"
        width="1800"
        height="1000"
      />
      <div>
        <p className="micro-label">{label}</p>
        <h2>
          {next.title}
          {next.accent}
        </h2>
        <span>{next.category}</span>
      </div>
      <span className="next-project-arrow"><Icon name="arrow-up-right" /></span>
    </Link>
  );
}
