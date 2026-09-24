/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Site palette, in order of prominence
        "theme-color-1": "#184542", // Deep blue-green teal — hero, banners
        "theme-color-2": "#EAE0D0", // Warm cream — page background, light surfaces
        "theme-color-3": "#AE7057", // Terracotta — accents, buttons
        "theme-color-4": "#682C2C", // Deep maroon — footer, dark elements
        "theme-gold": { DEFAULT: "#E6C27A", light: "#F6E2AE", deep: "#C99A45" }, // text on theme-color-1 only
        // Sein Pan tree — Royal Poinciana / Flamboyant
        seinpan: {
          red: "#E63946",
          flame: "#FF4500",
          "red-deep": "#C1121F",
          "green-bg": "#3A6258",
          "green-deep": "#2F564C",
          "green-card": "#4A7266",
          mist: "#D1D5DB",
          pearl: "#F6F1E8",
          "pearl-deep": "#EFE6D6",
          "pearl-card": "#FFFCF6",
          ink: "#2C2622",
          gold: "#C4A574",
          "gold-soft": "#E8D5A3",
          "gold-deep": "#6F5430",
          maroon: "#7A2432",
          "maroon-deep": "#5C1824",
          "blue-green": "#2A5248",
          "forest-ink": "#16261D",
          cta: "#D62839",
          "cta-deep": "#B3122B",
        },
        ink: { DEFAULT: "#0B2412", 900: "#0F291E", 800: "#1A3A26" },
        line: "rgba(209,213,219,0.14)",
        forest: {
          DEFAULT: "#2F564C",
          950: "#264840",
          900: "#2F564C",
          800: "#3A6258",
          700: "#4A7266",
          600: "#5A8276",
        },
        // Leaf surfaces stay green; the bright steps are flower red
        // so existing accent classes (icons, active tabs) match the tree.
        pcb: {
          50: "#F8FAF9",
          100: "#E5E7EB",
          200: "#D1D5DB",
          300: "#FF6B4A",
          400: "#FF4500",
          500: "#E63946",
          600: "#C1121F",
          700: "#1A3A26",
          800: "#143022",
          900: "#0F291E",
          950: "#0B2412",
        },
        // Former copper/gold scale, now the Sein Pan flower.
        copper: {
          50: "#FFF1F0",
          100: "#FFD6D1",
          200: "#FFB0A3",
          300: "#FF7A66",
          400: "#FF4500",
          500: "#E63946",
          600: "#C1121F",
          700: "#9B1B2E",
          800: "#6E1522",
          900: "#3D0C14",
        },
      },
      fontFamily: {
        sans: ["var(--font-app)", "system-ui", "sans-serif"],
        display: ['"Instrument Serif"', "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        trace: {
          "0%": { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "-280" },
        },
        aurora: {
          "0%, 100%": { transform: "translate(-50%, 0) scale(1)" },
          "50%": { transform: "translate(-44%, 6%) scale(1.1)" },
        },
        "crt-roll": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(400%)" },
        },
        "crt-flicker": {
          "0%, 100%": { opacity: "1" },
          "48%": { opacity: "0.97" },
          "50%": { opacity: "0.92" },
          "52%": { opacity: "0.98" },
        },
        "crt-on": {
          "0%": { transform: "scale(1, 0.004)", filter: "brightness(3)" },
          "45%": { transform: "scale(1, 0.004)", filter: "brightness(3)" },
          "70%": { transform: "scale(1, 1)", filter: "brightness(1.6)" },
          "100%": { transform: "scale(1, 1)", filter: "brightness(1)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        trace: "trace 9s linear infinite",
        aurora: "aurora 14s ease-in-out infinite",
        "crt-roll": "crt-roll 7s linear infinite",
        "crt-flicker": "crt-flicker 5s steps(1, end) infinite",
        "crt-on": "crt-on 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) both",
      },
      backgroundImage: {
        scanlines:
          "repeating-linear-gradient(to bottom, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 1px, transparent 1px, transparent 3px)",
        "crt-glow":
          "radial-gradient(ellipse at 50% 42%, #2A6A64 0%, #184542 48%, #0C2624 100%)",
        "crt-vignette":
          "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
        "crt-glass":
          "linear-gradient(155deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 28%, transparent 45%)",
        "wood-grain":
          "repeating-linear-gradient(92deg, rgba(0,0,0,0.10) 0px, rgba(0,0,0,0.10) 2px, transparent 2px, transparent 9px), repeating-linear-gradient(88deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 23px), linear-gradient(180deg, #7A3834 0%, #682C2C 45%, #4E2020 100%)",
        "speaker-grille":
          "repeating-linear-gradient(to bottom, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.55) 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 5px)",
        "grid-lines":
          "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
        "dot-grid":
          "radial-gradient(circle, rgba(209,213,219,0.10) 1px, transparent 1px)",
        holo:
          "conic-gradient(from 180deg at 50% 50%, #E63946, #FF4500, #1A3A26, #FF7A66, #E63946)",
      },
      backgroundSize: { "dot-grid": "22px 22px" },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 10px 40px -12px rgba(0,0,0,0.6)",
        glow: "0 0 0 1px rgba(230,57,70,0.45), 0 8px 30px -8px rgba(230,57,70,0.45)",
      },
    },
  },
  plugins: [],
};
