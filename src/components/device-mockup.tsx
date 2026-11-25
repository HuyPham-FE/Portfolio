import type { Copy } from "@/lib/content";
import type { Media } from "@/types/content";
export function DeviceMockup({
  image,
  copy,
  critical = false,
}: {
  image: Media;
  copy: Copy["hero"]["mockup"];
  critical?: boolean;
}) {
  return (
    <div className="device">
      <div className="device-camera" />
      <div className="device-screen">
        <div className="mock-nav">
          <strong>
            {copy.brand}
            <span>®</span>
          </strong>
          <div>
            {copy.nav.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <span>↗</span>
        </div>
        <div className="mock-scene">
          <img
            src={image.src}
            srcSet={`${image.src.replace(".jpg", "-800.jpg")} 800w, ${image.src} 1800w`}
            sizes="(max-width: 767px) 90vw, 60vw"
            alt={image.alt}
            width="1400"
            height="1000"
            loading={critical ? "eager" : "lazy"}
            data-critical={critical ? "true" : undefined}
          />
          <div className="mock-copy">
            <h3>{copy.title}</h3>
            <p>{copy.subtitle}</p>
            <span>{copy.action} &nbsp; →</span>
          </div>
        </div>
        <div className="mock-footer">
          <span>
            {copy.brand.toUpperCase()} / {copy.collection}
          </span>
          <span>{copy.footer}</span>
        </div>
      </div>
      <div className="device-base" />
    </div>
  );
}
