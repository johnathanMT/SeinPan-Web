// src/App.jsx
// App shell + routing.
// Routes:
//   /            -> commercial shop site (the public front door)
//   /hub         -> earlier catalog layout
//   /immersive   -> ImmersivePage (full-screen, own floating switcher)
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/layout/Header";
import HubPage from "./pages/HubPage";
import ImmersivePage from "./pages/ImmersivePage";
import SeinPanOfficialPage from "./pages/SeinPanOfficialPage";

function RootLayout() {
  return (
    <div id="top" className="min-h-screen bg-ink text-slate-200">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

// Vite injects import.meta.env.BASE_URL ("/" on the custom domain).
// React Router wants the basename without a trailing slash.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<SeinPanOfficialPage />} />
        <Route path="/official" element={<SeinPanOfficialPage />} />
        <Route element={<RootLayout />}>
          <Route path="/hub" element={<HubPage />} />
        </Route>
        <Route path="/immersive" element={<ImmersivePage />} />
      </Routes>
    </BrowserRouter>
  );
}
