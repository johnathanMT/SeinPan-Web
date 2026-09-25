// src/components/integrations/IntegrationGrid.jsx
// Sparse, floating-tile grid. Tile labels come from home.json -> tools.*
// so they translate. Icons are inline SVG (no asset/dependency needed).
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";

const ChipIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"
      stroke="currentColor"
      strokeWidth="1.6"
    />
  </svg>
);

const tools = [
  { key: "tools.mcu", col: 1, row: 1 },
  { key: "tools.power", col: 3, row: 1 },
  { key: "tools.sensors", col: 5, row: 1 },
  { key: "tools.resistors", col: 2, row: 2 },
  { key: "tools.capacitors", col: 4, row: 2 },
  { key: "tools.leds", col: 6, row: 2 },
  { key: "tools.connectors", col: 1, row: 3 },
  { key: "tools.equipment", col: 3, row: 3 },
  { key: "tools.modules", col: 5, row: 3 },
];

export function IntegrationGrid() {
  const { t } = useTranslation("home");
  const reduce = useReducedMotion();

  return (
    <div className="grid grid-cols-6 gap-4 auto-rows-[72px] md:auto-rows-[88px]">
      {tools.map((tool, i) => (
        <motion.button
          key={tool.key}
          type="button"
          style={{ gridColumnStart: tool.col, gridRowStart: tool.row }}
          className="group relative flex items-center justify-center rounded-2xl border border-line bg-ink-800/70 text-slate-300 shadow-card backdrop-blur transition-colors hover:border-copper-500/40 hover:text-copper-300"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, type: "spring", stiffness: 220, damping: 18 }}
          whileHover={reduce ? undefined : { y: -6, scale: 1.05 }}
          aria-label={t(tool.key)}
        >
          <ChipIcon />
          <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 shadow-glow transition group-hover:opacity-100" />
          <span className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-slate-500 opacity-0 transition group-hover:opacity-100">
            {t(tool.key)}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

export default IntegrationGrid;
