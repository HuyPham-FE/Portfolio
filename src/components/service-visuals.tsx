import { useId } from "react";
import type {
  Project,
  ServiceStackCard,
  ServiceStackContent,
} from "@/types/content";
import { DeviceMockup } from "./device-mockup";
import { Brand } from "./brand";
import styles from "./scroll-stacking-cards.module.css";

export function ServiceIcon({
  type,
}: {
  type: "search" | "document" | "code" | "target";
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={styles.icon}
    >
      {type === "search" ? (
        <>
          <circle cx="14" cy="14" r="8" />
          <path d="m20 20 8 8" />
        </>
      ) : type === "document" ? (
        <>
          <path d="M7 3h12l6 6v20H7zM19 3v7h6M11 16h10M11 21h10" />
        </>
      ) : type === "code" ? (
        <path d="m10 9-7 7 7 7m12-14 7 7-7 7M19 5l-6 22" />
      ) : (
        <>
          <circle cx="15" cy="17" r="12" />
          <circle cx="15" cy="17" r="7" />
          <path d="m15 17 13-13m-6 0h6v6" />
        </>
      )}
    </svg>
  );
}
function Ribbon({ front = false }: { front?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={front ? styles.ribbonFront : styles.ribbonBack}
      viewBox="0 0 720 560"
      fill="none"
      aria-hidden="true"
      data-service-ribbon
    >
      <defs>
        <linearGradient
          id={id}
          x1="90"
          y1="450"
          x2="650"
          y2="180"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#a9d0ff" stopOpacity=".08" />
          <stop offset=".38" stopColor="#f5fbff" stopOpacity=".75" />
          <stop offset=".68" stopColor="#2864f0" stopOpacity=".6" />
          <stop offset=".86" stopColor="#a1c7ff" stopOpacity=".6" />
          <stop offset="1" stopColor="#eef7ff" stopOpacity=".2" />
        </linearGradient>
      </defs>
      <path
        d={
          front
            ? "M22 474C-10 391 401 401 638 290C692 264 706 240 678 217C769 280 686 379 489 435C279 494 94 467 87 500C81 524 242 537 386 505C220 568 52 553 22 474Z"
            : "M89 363C-16 275 270 111 532 98C705 91 751 170 645 215C723 150 580 138 432 171C228 216 103 308 89 363Z"
        }
        fill={`url(#${id})`}
        stroke="#ffffffb0"
        strokeWidth="1.5"
      />
      {front && (
        <path
          d="M24 473C38 405 402 403 638 290C686 266 705 244 678 217"
          stroke="#fff"
          strokeWidth="2"
        />
      )}
    </svg>
  );
}
function Graph({ marketing = false }: { marketing?: boolean }) {
  const id = useId().replace(/:/g, "");
  const points = marketing
    ? "M16 164L71 142L121 153L176 113L228 124L279 103L330 76L380 90L431 55L482 60L541 16"
    : "M16 162C77 157 78 116 139 128S218 92 271 102S359 62 410 77S488 40 541 18";
  return (
    <svg
      viewBox="0 0 560 200"
      className={styles.graph}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#5c9dff" stopOpacity=".32" />
          <stop offset="1" stopColor="#5c9dff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[40, 90, 140, 190].map((y) => (
        <path key={y} d={`M0 ${y}H560`} stroke="#cfdef4" strokeWidth="1" />
      ))}
      <path d={`${points}L541 200H16Z`} fill={`url(#${id})`} />
      <path
        d={points}
        stroke="#2864f0"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="100"
        data-service-line
      />
      {marketing &&
        [
          [16, 164],
          [71, 142],
          [121, 153],
          [176, 113],
          [228, 124],
          [279, 103],
          [330, 76],
          [380, 90],
          [431, 55],
          [482, 60],
          [541, 16],
        ].map(([x, y]) => (
          <circle
            key={x}
            cx={x}
            cy={y}
            r="4"
            fill="white"
            stroke="#2864f0"
            strokeWidth="2"
          />
        ))}
    </svg>
  );
}
export function ServiceVisual({
  card,
  copy,
  project,
}: {
  card: ServiceStackCard;
  copy: ServiceStackContent["visualCopy"];
  project?: Project;
}) {
  return (
    <figure className={`${styles.visual} ${styles[card.visual]}`}>
      <Ribbon />
      <div className={styles.mockupMotion} data-service-mockup>
        {card.visual === "website" && project && (
          <div className={styles.laptop}>
            <DeviceMockup image={project.image} />
          </div>
        )}
        {card.visual === "search" && (
          <div className={styles.searchSurface}>
            <div className={styles.searchBrand}>
              <Brand name="google" label />
            </div>
            <div className={styles.searchInput}>
              <span>{copy.searchQuery}</span>
              <ServiceIcon type="search" />
            </div>
            <div className={styles.searchResult}>
              <span>{copy.searchUrl}</span>
              <h4>{copy.searchTitle}</h4>
              <p>{copy.searchDescription}</p>
            </div>
            <div className={styles.searchGraph}>
              <span>{copy.searchGraph}</span>
              <Graph />
            </div>
            <div className={styles.searchTags}>
              {copy.searchTags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        )}
        {card.visual === "marketing" && (
          <div className={styles.dashboardFrame}>
            <div className={styles.dashboard}>
              <div className={styles.platforms}>
                {["meta", "googleads"].map((brand, i) => (
                  <span key={brand}>
                    <Brand name={brand} />
                    {copy.dashboardTabs[i]}
                  </span>
                ))}
              </div>
              <h4>{copy.dashboardTitle}</h4>
              <Graph marketing />
              <div className={styles.signals}>
                {copy.dashboardSignals.map((label, i) => (
                  <div key={label}>
                    <span className={styles.signalIcon}>
                      {["↗", "◎", "→"][i]}
                    </span>
                    <span>{label}</span>
                    <i>
                      <b style={{ width: `${55 + i * 14}%` }} />
                    </i>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.dashboardBase} />
          </div>
        )}
      </div>
      <div className={styles.visualEmblem} aria-hidden="true">
        <ServiceIcon
          type={
            card.visual === "website"
              ? "code"
              : card.visual === "search"
                ? "search"
                : "target"
          }
        />
      </div>
      <Ribbon front />
    </figure>
  );
}
