import { motion, useReducedMotion } from 'framer-motion';

function AnalogMultimeter({ className = '' }) {
  const reduce = useReducedMotion();
  return (
    <svg
      viewBox="0 0 140 168"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="8" y="6" width="124" height="156" rx="14" fill="#682C2C" />
      <rect x="12" y="10" width="116" height="148" rx="12" fill="#184542" />
      <rect x="12" y="10" width="116" height="18" rx="12" fill="#4E2020" />
      <rect x="12" y="22" width="116" height="8" fill="#184542" />
      <text x="70" y="22" textAnchor="middle" fill="#E6C27A" fontFamily="Inter, Arial, sans-serif" fontSize="7" fontWeight="700" letterSpacing="1.6">SEIN PAN</text>

      <rect x="22" y="32" width="96" height="72" rx="8" fill="#EAE0D0" />
      <rect x="26" y="36" width="88" height="64" rx="6" fill="#F4EDE0" />

      <path d="M38 86 A32 32 0 0 1 102 86" fill="none" stroke="#682C2C" strokeWidth="1.2" />
      {[...Array(11)].map((_, i) => {
        const a = (-70 + i * 14) * (Math.PI / 180);
        const x1 = 70 + Math.cos(a) * 28;
        const y1 = 86 + Math.sin(a) * 28;
        const x2 = 70 + Math.cos(a) * (i % 2 === 0 ? 34 : 32);
        const y2 = 86 + Math.sin(a) * (i % 2 === 0 ? 34 : 32);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#682C2C" strokeWidth={i % 2 === 0 ? 1.4 : 0.8} />;
      })}
      <text x="36" y="78" fill="#AE7057" fontSize="6" fontFamily="JetBrains Mono, monospace">Ω</text>
      <text x="66" y="52" fill="#184542" fontSize="6" fontFamily="JetBrains Mono, monospace">V</text>
      <text x="98" y="78" fill="#184542" fontSize="6" fontFamily="JetBrains Mono, monospace">A</text>

      <motion.g
        style={{ transformOrigin: '70px 86px', transformBox: 'view-box' }}
        animate={reduce ? { rotate: -8 } : { rotate: [-22, 18, -6, 14, -22] }}
        transition={reduce ? undefined : { duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <polygon points="70,90 67.8,50 70,46 72.2,50" fill="#AE7057" />
        <circle cx="70" cy="86" r="5" fill="#682C2C" />
        <circle cx="70" cy="86" r="2.2" fill="#E6C27A" />
      </motion.g>

      <rect x="30" y="110" width="36" height="14" rx="3" fill="#0C2624" />
      <text x="48" y="120" textAnchor="middle" fill="#E6C27A" fontSize="7" fontFamily="JetBrains Mono, monospace">1.98</text>
      <circle cx="86" cy="117" r="8" fill="#4E2020" stroke="#E6C27A" strokeWidth="1.2" />
      <circle cx="108" cy="117" r="6" fill="#3A1818" stroke="#EAE0D0" strokeWidth="0.8" />

      <rect x="28" y="132" width="84" height="16" rx="4" fill="#0C2624" />
      <circle cx="42" cy="140" r="3.5" fill="#AE7057" />
      <circle cx="58" cy="140" r="3.5" fill="#E6C27A" />
      <circle cx="98" cy="140" r="3.5" fill="#7ee8e0" />
    </svg>
  );
}

function SolderingIron({ className = '' }) {
  const reduce = useReducedMotion();
  return (
    <svg
      viewBox="0 0 280 130"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M168 86c18 14 42 16 68 4" fill="none" stroke="#184542" strokeWidth="5" strokeLinecap="round" />
      <path d="M176 90c14 10 34 12 56 2" fill="none" stroke="#E6C27A" strokeWidth="2" strokeLinecap="round" />

      <path d="M10 78c10-8 26-6 38 0" fill="none" stroke="#4E2020" strokeWidth="4" strokeLinecap="round" />
      <path d="M12 78c8 7 20 9 32 3" fill="none" stroke="#682C2C" strokeWidth="2.4" strokeLinecap="round" />

      <rect x="42" y="42" width="86" height="44" rx="14" fill="#3A1818" />
      <rect x="48" y="46" width="74" height="12" rx="6" fill="#5C2222" />
      <rect x="56" y="62" width="58" height="4" rx="2" fill="#AE7057" opacity="0.8" />
      <rect x="56" y="70" width="46" height="3" rx="1.5" fill="#E6C27A" opacity="0.45" />

      <rect x="122" y="46" width="20" height="36" rx="4" fill="#E6C27A" />
      <rect x="126" y="50" width="12" height="6" rx="2" fill="#F4EDE0" opacity="0.6" />

      <rect x="138" y="52" width="58" height="26" rx="5" fill="#184542" />
      <rect x="144" y="56" width="46" height="5" rx="2" fill="#7ee8e0" opacity="0.3" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={148 + i * 14} y="64" width="8" height="9" rx="1.5" fill="#0C2624" />
      ))}

      <path d="M192 54h22l14 11-14 11H192V54Z" fill="#8A6A4A" />
      <path d="M212 50 258 28l10 16-42 32-14-26Z" fill="#C4A574" />
      <path d="M248 32 272 18l6 12-22 22-8-20Z" fill="#E6C27A" />
      <path d="M270 16l8-6 3 10-8 8-3-12Z" fill="#FF8A4A" />

      <motion.ellipse
        cx="274"
        cy="16"
        rx="16"
        ry="12"
        fill="#FF7A3D"
        animate={reduce ? { opacity: 0.4 } : { opacity: [0.35, 0.85, 0.4], scale: [0.75, 1.25, 0.85] }}
        transition={reduce ? undefined : { duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'blur(3px)', transformOrigin: '274px 16px' }}
      />
      <motion.circle
        cx="274"
        cy="16"
        r="4.5"
        fill="#FFE08A"
        animate={reduce ? { opacity: 0.9 } : { opacity: [0.6, 1, 0.65], scale: [0.9, 1.25, 0.95] }}
        transition={reduce ? undefined : { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '274px 16px' }}
      />
      {!reduce && (
        <>
          <motion.path
            d="M258 10c6-12 2-20-4-26"
            fill="none"
            stroke="#EAE0D0"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{ opacity: [0.15, 0.6, 0.1], y: [0, -6, -12] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.circle
            cx="276"
            cy="8"
            r="1.6"
            fill="#E6C27A"
            animate={{ opacity: [0, 1, 0], y: [0, -10, -16], x: [0, 4, 8] }}
            transition={{ duration: 0.7, repeat: Infinity, repeatDelay: 1 }}
          />
          <motion.circle
            cx="278"
            cy="22"
            r="1.4"
            fill="#FF7A3D"
            animate={{ opacity: [0, 1, 0], y: [0, 6, 12], x: [0, 6, 10] }}
            transition={{ duration: 0.55, repeat: Infinity, repeatDelay: 0.7, delay: 0.2 }}
          />
        </>
      )}
    </svg>
  );
}

export function WorkshopDecor() {
  const reduce = useReducedMotion();
  const float = (delay, y = 6) =>
    reduce
      ? undefined
      : { y: [0, -y, 0], transition: { duration: 5.6, repeat: Infinity, ease: 'easeInOut', delay } };

  return (
    <div aria-hidden="true" className="pointer-events-none select-none">
      <div className="mb-5 flex items-end justify-center gap-8 sm:mb-6 lg:hidden">
        <AnalogMultimeter className="h-[4.5rem] w-auto drop-shadow-md" />
        <SolderingIron className="mb-1 h-14 w-auto drop-shadow-md" />
      </div>

      <motion.div
        animate={float(0, 7)}
        className="absolute -left-2 top-0 hidden lg:block xl:-left-6"
      >
        <AnalogMultimeter className="w-[5.6rem] -rotate-6 drop-shadow-lg xl:w-[6.5rem]" />
      </motion.div>
      <motion.div
        animate={float(0.8, 5)}
        className="absolute -right-2 -top-4 hidden lg:block xl:-right-6"
      >
        <SolderingIron className="w-[11.5rem] rotate-[14deg] drop-shadow-lg xl:w-[13.5rem]" />
      </motion.div>
    </div>
  );
}
