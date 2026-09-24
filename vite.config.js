import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Custom domain (seinpan.myothant.dev) is served from the site root.
// A project-site base like "/SeinPan-Web/" makes the browser request
// /SeinPan-Web/assets/*, which 404s and leaves a blank page.
export default defineConfig({
  base: "/",
  plugins: [react()],
  server: { port: 5173, open: true },
});
