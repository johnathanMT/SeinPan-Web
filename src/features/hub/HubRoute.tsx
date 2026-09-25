import Header from "./components/layout/Header";
import HubPage from "./pages/HubPage";
import { registerHubLocales } from "./registerHubLocales";

registerHubLocales();

/** Legacy catalog layout (/hub). */
export default function HubRoute() {
  return (
    <div id="top" className="min-h-screen bg-ink text-slate-200">
      <Header />
      <main>
        <HubPage />
      </main>
    </div>
  );
}
