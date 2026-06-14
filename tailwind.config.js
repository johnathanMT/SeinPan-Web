/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // canvas + hairlines (the "dark crisp" base)
        ink: { DEFAULT: "#05080a", 900: "#0a0f12", 800: "#0e1518" },
        line: "rgba(148,163,184,0.12)",
        // Deep Forest / PCB-green base — used as the primary background on
        // the Hero + About sections (premium "deep forest green").
        forest: {
          DEFAULT: "#04211a", 950: "#03150f", 900: "#052017",
          800: "#073123", 700: "#0a4230", 600: "#0d5640",
        },
        // PCB / Electronic Green — primary brand
        pcb: {
          50: "#eafff3", 100: "#c9f7dd", 200: "#94edbd", 300: "#57db96",
          400: "#22c06f", 500: "#0f9d58", 600: "#0a7d46", 700: "#0a6238",
          800: "#0b4e2e", 900: "#0a3d25", 950: "#022014",
        },
        // Copper / Gold-Bronze — accent
        copper: {
          50: "#fdf8ed", 100: "#f7ebc9", 200: "#eed28f", 300: "#e4b75a",
          400: "#d99f33", 500: "#c8862a", 600: "#a86a20", 700: "#855020",
          800: "#6e4120", 900: "#5d381f",
        },
      },
      fontFamily: {
        sans: ["var(--font-app)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "dot-grid":
          "radial-gradient(circle, rgba(148,163,184,0.10) 1px, transparent 1px)",
        holo:
          "conic-gradient(from 180deg at 50% 50%, #0f9d58, #22d3ee, #818cf8, #e4b75a, #f472b6, #0f9d58)",
      },
      backgroundSize: { "dot-grid": "22px 22px" },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 10px 40px -12px rgba(0,0,0,0.6)",
        glow: "0 0 0 1px rgba(200,134,42,0.30), 0 8px 30px -8px rgba(200,134,42,0.25)",
      },
    },
  },
  plugins: [],
};
