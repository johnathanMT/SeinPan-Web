import { useState } from "react";
import avif360 from "../../../assets/images/technician-360.avif";
import avif540 from "../../../assets/images/technician-540.avif";
import avif720 from "../../../assets/images/technician-720.avif";
import webp360 from "../../../assets/images/technician-360.webp";
import webp540 from "../../../assets/images/technician-540.webp";
import webp720 from "../../../assets/images/technician-720.webp";
import jpg360 from "../../../assets/images/technician-360.jpg";
import jpg540 from "../../../assets/images/technician-540.jpg";
import jpg720 from "../../../assets/images/technician-720.jpg";
import { useOfficial } from "../hooks/useOfficial";

const AVIF = `${avif360} 360w, ${avif540} 540w, ${avif720} 720w`;
const WEBP = `${webp360} 360w, ${webp540} 540w, ${webp720} 720w`;
const JPEG = `${jpg360} 360w, ${jpg540} 540w, ${jpg720} 720w`;

interface TechPhotoProps {
  /** CSS width the photo renders at, for the browser's srcset choice. */
  sizes: string;
  isDark?: boolean;
  /** Decorative copies (e.g. a thumbnail next to the name) use an empty alt. */
  decorative?: boolean;
}

/**
 * Responsive technician photo: AVIF → WebP → JPEG, pre-cropped to the 4:5
 * frame it is shown in, with intrinsic dimensions to prevent layout shift.
 * Falls back to initials if the image cannot load.
 */
export function TechPhoto({ sizes, isDark = true, decorative = false }: TechPhotoProps) {
  const { t } = useOfficial();
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center rounded-[14px] text-xl font-extrabold ${
          isDark ? "bg-gradient-to-br from-[#184542] to-[#0F2E2C] text-theme-color-2" : "bg-gradient-to-br from-[#EAE0D0] to-[#d9ccb6] text-theme-color-4"
        }`}
        role={decorative ? undefined : "img"}
        aria-label={decorative ? undefined : t("tech.alt")}
        aria-hidden={decorative || undefined}
      >
        <span aria-hidden="true">WN</span>
      </div>
    );
  }

  return (
    <picture>
      <source type="image/avif" srcSet={AVIF} sizes={sizes} />
      <source type="image/webp" srcSet={WEBP} sizes={sizes} />
      <img
        src={jpg720}
        srcSet={JPEG}
        sizes={sizes}
        width={720}
        height={900}
        alt={decorative ? "" : t("tech.alt")}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="h-full w-full rounded-[14px] object-cover object-top"
      />
    </picture>
  );
}
