import { lazy, Suspense } from "react";
import OfficialPage from "../features/official/OfficialPage";

// The public site is a single page with hash tabs, so it needs no router.
// The legacy /hub and /immersive layouts (React Router + framer-motion) are a
// separate chunk the homepage never downloads.
const LegacyApp = lazy(() => import("../features/hub/LegacyApp"));

const LEGACY_PATHS = new Set(["/hub", "/immersive"]);

function currentPath(): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const path = window.location.pathname.slice(base.length) || "/";
  return path.length > 1 ? path.replace(/\/$/, "") : path;
}

export default function App() {
  if (LEGACY_PATHS.has(currentPath())) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-ink" aria-busy="true" />}>
        <LegacyApp />
      </Suspense>
    );
  }
  // "/", "/official" and any unknown path show the shop (never a blank page).
  return <OfficialPage />;
}
