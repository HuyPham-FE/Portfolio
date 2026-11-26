import type { Media } from "@/types/content";
/** Device frame around a real website screenshot. */
export function DeviceMockup({
  image,
  critical = false,
}: {
  image: Media;
  critical?: boolean;
}) {
  return (
    <div className="device">
      <div className="device-camera" />
      <div className="device-screen">
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
        </div>
      </div>
      <div className="device-base" />
    </div>
  );
}
