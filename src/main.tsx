import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./shared/i18n";
import "./styles/index.css";
import App from "./app/App";
import { applyPerformanceTier, detectPerformanceTier } from "./shared/perf/tier";

// Decide once how much decorative motion this device should run (see shared/perf/tier.ts).
applyPerformanceTier(detectPerformanceTier());

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("index.html is missing the #root element");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
