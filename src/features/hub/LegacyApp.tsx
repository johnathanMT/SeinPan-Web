import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import HubRoute from "./HubRoute";
import ImmersiveRoute from "./ImmersiveRoute";

/** Any path outside the legacy layouts belongs to the main site: do a full load. */
function LeaveLegacy() {
  const { pathname, search, hash } = useLocation();
  useEffect(() => {
    window.location.replace(`${pathname}${search}${hash}`);
  }, [pathname, search, hash]);
  return null;
}

/**
 * The legacy /hub and /immersive layouts are the only pages that link
 * between paths, so they alone ship React Router (and framer-motion).
 */
export default function LegacyApp() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/hub" element={<HubRoute />} />
        <Route path="/immersive" element={<ImmersiveRoute />} />
        <Route path="*" element={<LeaveLegacy />} />
      </Routes>
    </BrowserRouter>
  );
}
