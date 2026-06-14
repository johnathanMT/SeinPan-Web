// src/App.jsx
// App shell + routing.
// Routes:
//   /            -> RootLayout (mounts <Header/>) -> HubPage
//   /immersive   -> ImmersivePage (full-screen, own floating switcher)
// The <Header/> lives in RootLayout so it persists across all hub routes,
// while the immersive page is intentionally chrome-free.
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/layout/Header";
import HubPage from "./pages/HubPage";
import ImmersivePage from "./pages/ImmersivePage";

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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<HubPage />} />
        </Route>
        <Route path="/immersive" element={<ImmersivePage />} />
      </Routes>
    </BrowserRouter>
  );
}
