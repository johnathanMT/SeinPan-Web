import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: `base` must match your GitHub repo name exactly (case-sensitive),
// with leading and trailing slashes. Repo: johnathanMT/SeinPan-Web
// -> site served at https://johnathanMT.github.io/SeinPan-Web/
export default defineConfig({
  base: "/SeinPan-Web/",
  plugins: [react()],
  server: { port: 5173, open: true },
});
