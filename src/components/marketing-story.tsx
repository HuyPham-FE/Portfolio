import type { AchievementContent } from "@/types/content";
import type { Copy } from "@/lib/content";
import { BrandRow } from "./brand";
import { Heading } from "./ui";
export function MarketingStory({
  content,
  copy,
  sourceLabel,
}: {
  content: AchievementContent;
  copy: Copy["marketing"];
  sourceLabel: string;
}) {
  const metrics = content.metrics.filter((m) => m.verified && m.source);
  const points = content.demoSeries
    .map((v, i) => `${30 + i * 140},${260 - v * 2.6}`)
    .join(" ");
  return (
    <section className="marketing marketing-editorial section-shell">
      <div className="section-top">
        <div>
          <Heading>{copy.title}</Heading>
        </div>
        <BrandRow names={copy.platforms} labels />
      </div>
      <div className="marketing-story">
        <div className="marketing-editorial-copy">
          <h3>{copy.studyTitle}</h3>
          <p>{copy.body}</p>
          <ul>
            {copy.indicators.map((label, i) => (
              <li key={label}>
                <span>0{i + 1}</span>
                {label}
              </li>
            ))}
          </ul>
        </div>
        <div className="marketing-data">
          {metrics.length > 0 && (
            <div className="marketing-kpis">
              {metrics.map((m) => (
                <div key={m.label}>
                  <strong>
                    <span data-counter={m.value}>{m.value}</span>
                    {m.suffix}
                  </strong>
                  <p>{m.label}</p>
                  <a href={m.source}>{sourceLabel} ↗</a>
                </div>
              ))}
            </div>
          )}
          <div className="chart-panel">
            <div className="chart-header">
              <b>{copy.chartTitle}</b>
            </div>
            <svg
              className="growth-chart"
              viewBox="0 0 900 300"
              role="img"
              aria-label={content.demoLabel}
            >
              <defs>
                <linearGradient
                  id="marketing-chart-fill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop stopColor="#2864F0" stopOpacity=".18" />
                  <stop offset="1" stopColor="#2864F0" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[80, 140, 200, 260].map((y) => (
                <line key={y} x1="0" x2="900" y1={y} y2={y} stroke="#dce5f7" />
              ))}
              <polygon
                points={`30,290 ${points} 870,290`}
                fill="url(#marketing-chart-fill)"
              />
              <path
                d={`M ${points.split(" ").join(" L ")}`}
                fill="none"
                stroke="#2864F0"
                strokeWidth="3"
                strokeLinejoin="round"
                data-chart-line
              />
              {content.demoSeries.map((v, i) => (
                <circle
                  key={i}
                  data-chart-point
                  cx={30 + i * 140}
                  cy={260 - v * 2.6}
                  r="6"
                  fill="#f8faff"
                  stroke="#2864f0"
                  strokeWidth="3"
                />
              ))}
            </svg>
            <p className="chart-disclaimer">{content.demoLabel}</p>
          </div>
          {!metrics.length && <p className="data-note">{content.emptyLabel}</p>}
        </div>
      </div>
    </section>
  );
}
