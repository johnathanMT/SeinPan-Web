import { useState } from "react";
import { useOfficial } from "../hooks/useOfficial";

/**
 * The technician portrait lives on the shop's Cloudinary account, which crops
 * it to the 4:5 frame (centred on the face) and encodes each size and format
 * on the fly. The CSP allows only this account's path: see vite.config.ts.
 */
const CLOUDINARY = "https://res.cloudinary.com/dhlhzmmtt/image/upload";
const PHOTO = { version: "v1790595764", id: "IMG_8158_blj204" } as const;
const WIDTHS = [360, 540, 720] as const;

function techPhotoUrl(width: number, ext: "avif" | "webp" | "jpg"): string {
  return `${CLOUDINARY}/c_fill,g_face,ar_4:5,w_${width},q_auto/${PHOTO.version}/${PHOTO.id}.${ext}`;
}

const srcSet = (ext: "avif" | "webp" | "jpg") => WIDTHS.map((w) => `${techPhotoUrl(w, ext)} ${w}w`).join(", ");
const AVIF = srcSet("avif");
const WEBP = srcSet("webp");
const JPEG = srcSet("jpg");

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
        src={techPhotoUrl(720, "jpg")}
        srcSet={JPEG}
        sizes={sizes}
        width={720}
        height={900}
        alt={decorative ? "" : t("tech.alt")}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-full w-full rounded-[14px] object-cover object-top"
      />
    </picture>
  );
}
