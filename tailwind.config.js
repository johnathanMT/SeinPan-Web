/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Site palette, in order of prominence
        "theme-color-1": "#184542", // Deep blue-green teal — hero, banners
        "theme-color-2": "#EAE0D0", // Warm cream — page background, light surfaces
        "theme-color-3": "#A2664E", // Terracotta — accents, buttons. White text on it: 4.62:1 (WCAG AA)
        "theme-color-3-ink": "#7E4F3D", // Terracotta for small text on light surfaces (≥4.6:1)
        "theme-color-4": "#682C2C", // Deep maroon — footer, dark elements
        "theme-gold": { DEFAULT: "#E6C27A", light: "#F6E2AE", deep: "#C99A45" }, // text on theme-color-1 / theme-color-4 only
        // Third-party brand buttons, darkened just enough for AA white text.
        brand: { facebook: "#0D6FEE", messenger: "#0074DF", viber: "#715DF2" },
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
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(var(--float-y, -8px))" },
        },
        "shadow-breathe": {
          "0%, 100%": { transform: "translateX(-50%) scaleX(1)", opacity: "0.78" },
          "50%": { transform: "translateX(-50%) scaleX(0.86)", opacity: "0.42" },
        },
        dust: {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.12" },
          "50%": { transform: "translateY(var(--travel, -12px))", opacity: "0.5" },
        },
        needle: {
          "0%, 100%": { transform: "rotate(-22deg)" },
          "25%": { transform: "rotate(18deg)" },
          "50%": { transform: "rotate(-6deg)" },
          "75%": { transform: "rotate(14deg)" },
        },
        flame: {
          "0%": { opacity: "0.35", transform: "scale(0.75)" },
          "50%": { opacity: "0.85", transform: "scale(1.25)" },
          "100%": { opacity: "0.4", transform: "scale(0.85)" },
        },
        ember: {
          "0%": { opacity: "0.6", transform: "scale(0.9)" },
          "50%": { opacity: "1", transform: "scale(1.25)" },
          "100%": { opacity: "0.65", transform: "scale(0.95)" },
        },
        smoke: {
          "0%": { opacity: "0.15", transform: "translateY(0)" },
          "50%": { opacity: "0.6", transform: "translateY(-6px)" },
          "100%": { opacity: "0.1", transform: "translateY(-12px)" },
        },
        "spark-up": {
          "0%": { opacity: "0", transform: "translate(0, 0)" },
          "20%": { opacity: "1", transform: "translate(4px, -10px)" },
          "41%, 100%": { opacity: "0", transform: "translate(8px, -16px)" },
        },
        "spark-down": {
          "0%": { opacity: "0", transform: "translate(0, 0)" },
          "22%": { opacity: "1", transform: "translate(6px, 6px)" },
          "44%, 100%": { opacity: "0", transform: "translate(10px, 12px)" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.45" },
        },
        "glow-breathe": {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
        levitate: {
          "0%, 100%": { transform: "translateY(0) rotate(var(--rot-a, 0deg))", opacity: "0.35" },
          "50%": { transform: "translateY(var(--lev-y, -10px)) rotate(var(--rot-b, 4deg))", opacity: "0.45" },
        },
        "pulse-travel": {
          "0%": { strokeDashoffset: "0", opacity: "0" },
          "5%": { opacity: "0.9" },
          "90%": { opacity: "0.9" },
          "100%": { strokeDashoffset: "-2400", opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
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
        "rise-in": "rise-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "float-y": "float-y var(--float-dur, 5.2s) ease-in-out var(--float-delay, 0s) infinite",
        "shadow-breathe": "shadow-breathe 5.2s ease-in-out infinite",
        dust: "dust var(--dur, 9s) ease-in-out var(--delay, 0s) infinite both",
        needle: "needle 5.2s ease-in-out infinite",
        flame: "flame 1.3s ease-in-out infinite",
        ember: "ember 0.8s ease-in-out infinite",
        smoke: "smoke 1.9s ease-out infinite",
        "spark-up": "spark-up 1.7s ease-out infinite",
        "spark-down": "spark-down 1.25s ease-out 0.2s infinite both",
        breathe: "breathe 5.2s ease-in-out infinite",
        "glow-breathe": "glow-breathe 5.2s ease-in-out infinite",
        levitate: "levitate var(--dur, 14s) ease-in-out var(--delay, 0s) infinite both",
        "pulse-travel": "pulse-travel var(--dur, 7s) linear var(--delay, 2s) infinite both",
        marquee: "marquee 32s linear infinite",
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
