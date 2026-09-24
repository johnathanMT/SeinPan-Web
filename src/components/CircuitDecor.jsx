import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useInView,
  useScroll,
  useTransform,
} from 'framer-motion';

const TEAL = '#184542';
const TERRACOTTA = '#AE7057';
const MAROON = '#682C2C';
const PULSE_TEAL = '#14B8A6';
const PULSE_GOLD = '#E6C27A';

/* ── PCB paths (orthogonal, hair-thin, elegant) ── */
const TRACE_PATHS = [
  {
    d: 'M48 72 H168 V148 H292 V88 H420 V168 H548 V112 H692 V196',
    gold: false,
    delay: 0,
    pulse: true,
  },
  {
    d: 'M92 36 V128 H216 V248 H148 V348 H268 V428',
    gold: true,
    delay: 0.25,
    pulse: true,
  },
  {
    d: 'M752 48 V132 H608 V248 H728 V336 H580 V412',
    gold: false,
    delay: 0.4,
    pulse: false,
  },
  {
    d: 'M36 292 H156 V392 H288 V468 H400',
    gold: true,
    delay: 0.55,
    pulse: true,
  },
  {
    d: 'M360 52 V168 H488 V96 H560 V200 H640',
    gold: false,
    delay: 0.7,
    pulse: false,
  },
  {
    d: 'M720 220 H560 V320 H680 V400 H760',
    gold: true,
    delay: 0.85,
    pulse: true,
  },
  {
    d: 'M200 200 H320 V280 H240 V360',
    gold: false,
    delay: 1.0,
    pulse: false,
  },
  {
    d: 'M480 300 H620 V380 H520 V460 H700',
    gold: false,
    delay: 1.15,
    pulse: true,
  },
];

const VIAS = [
  [168, 72], [292, 148], [420, 88], [548, 168], [216, 128],
  [148, 348], [608, 132], [728, 248], [156, 292], [288, 392],
  [488, 168], [560, 320], [320, 200], [620, 300], [692, 112],
];

function EnergyPulse({ d, gold, delay = 0, duration = 7.5 }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  const stroke = gold ? PULSE_GOLD : PULSE_TEAL;
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth="4"
      strokeLinecap="round"
      strokeDasharray="10 2400"
      initial={{ strokeDashoffset: 0, opacity: 0 }}
      animate={{
        strokeDashoffset: [0, -2400],
        opacity: [0, 0.9, 0.9, 0],
      }}
      transition={{
        strokeDashoffset: {
          duration,
          repeat: Infinity,
          ease: 'linear',
          delay: delay + 2.2,
        },
        opacity: {
          duration,
          repeat: Infinity,
          ease: 'linear',
          delay: delay + 2.2,
          times: [0, 0.05, 0.9, 1],
        },
      }}
      style={{
        filter: `drop-shadow(0 0 4px ${stroke}) drop-shadow(0 0 10px ${stroke}) drop-shadow(0 0 18px ${stroke})`,
      }}
    />
  );
}

function CircuitField({ inView, pulses = true }) {
  const reduce = useReducedMotion();

  return (
    <svg
      viewBox="0 0 800 520"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Soft ambient grid — barely there */}
      <defs>
        <pattern id="pcb-micro" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 H0 V40" fill="none" stroke={TEAL} strokeWidth="0.6" opacity="0.45" />
        </pattern>
      </defs>
      <rect width="800" height="520" fill="url(#pcb-micro)" opacity="0.25" />

      {VIAS.map(([cx, cy], i) => (
        <g key={`${cx}-${cy}`} opacity={inView || reduce ? 1 : 0}>
          <circle
            cx={cx}
            cy={cy}
            r="3.2"
            fill="none"
            stroke={i % 2 ? TERRACOTTA : TEAL}
            strokeWidth="1.5"
          />
          <circle cx={cx} cy={cy} r="1.6" fill={i % 2 ? TERRACOTTA : TEAL} />
        </g>
      ))}

      {TRACE_PATHS.map(({ d, gold, delay, pulse }) => (
        <g key={d}>
          <motion.path
            d={d}
            fill="none"
            stroke={gold ? TERRACOTTA : TEAL}
            strokeWidth="1.75"
            strokeLinecap="square"
            strokeLinejoin="miter"
            initial={reduce ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            animate={
              inView || reduce
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            transition={
              reduce
                ? { duration: 0 }
                : { pathLength: { duration: 2.8, ease: [0.22, 1, 0.36, 1], delay }, opacity: { duration: 0.6, delay } }
            }
          />
          {pulse && pulses && <EnergyPulse d={d} gold={gold} delay={delay} duration={6.8 + delay} />}
        </g>
      ))}
    </svg>
  );
}

/* ── Wireframe IC ── */
function MicrochipWire({ className = '' }) {
  const pins = [0, 1, 2, 3, 4, 5, 6];
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none">
      <rect x="30" y="30" width="60" height="60" rx="2" stroke={TEAL} strokeWidth="1.75" />
      <rect x="38" y="38" width="44" height="44" rx="1" stroke={TEAL} strokeWidth="1.25" opacity="0.7" />
      <rect x="50" y="50" width="20" height="20" stroke={TERRACOTTA} strokeWidth="1.6" />
      <path d="M52 30 A8 8 0 0 0 68 30" stroke={TEAL} strokeWidth="1.5" />
      <circle cx="42" cy="42" r="2" stroke={TERRACOTTA} strokeWidth="1.5" />
      <path d="M54 56h12M60 50v12" stroke={MAROON} strokeWidth="1.4" opacity="0.85" />
      {pins.map((i) => {
        const o = 36 + i * 7.5;
        return (
          <g key={i} stroke={TERRACOTTA} strokeWidth="1.6">
            <path d={`M${o} 30 V18`} />
            <path d={`M${o} 90 V102`} />
            <path d={`M30 ${o} H18`} />
            <path d={`M90 ${o} H102`} />
          </g>
        );
      })}
    </svg>
  );
}

/* ── Wireframe capacitor (schematic parallel plates) ── */
function CapacitorWire({ className = '' }) {
  return (
    <svg viewBox="0 0 64 140" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none">
      <path d="M32 8 V48" stroke={TEAL} strokeWidth="1.75" strokeLinecap="round" />
      <path d="M32 92 V132" stroke={TEAL} strokeWidth="1.75" strokeLinecap="round" />
      <path d="M14 48 H50" stroke={TERRACOTTA} strokeWidth="2" strokeLinecap="round" />
      <path d="M14 58 H50" stroke={MAROON} strokeWidth="2" strokeLinecap="round" />
      <path d="M18 72 H46" stroke={TEAL} strokeWidth="1.5" opacity="0.7" />
      <path d="M22 80 H42" stroke={TEAL} strokeWidth="1.5" opacity="0.5" />
      <circle cx="32" cy="8" r="2.2" stroke={TERRACOTTA} strokeWidth="1.5" />
      <circle cx="32" cy="132" r="2.2" stroke={TERRACOTTA} strokeWidth="1.5" />
    </svg>
  );
}

/* ── Wireframe inductor coil ── */
function CoilWire({ className = '' }) {
  return (
    <svg viewBox="0 0 180 64" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none">
      <path d="M4 32 H22" stroke={TEAL} strokeWidth="1.75" strokeLinecap="round" />
      <path d="M158 32 H176" stroke={TEAL} strokeWidth="1.75" strokeLinecap="round" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path
          key={i}
          d={`M${22 + i * 19.5} 32
             C${22 + i * 19.5} 10, ${41.5 + i * 19.5} 10, ${41.5 + i * 19.5} 32
             C${41.5 + i * 19.5} 54, ${22 + i * 19.5} 54, ${22 + i * 19.5} 32`}
          stroke={i % 2 ? TERRACOTTA : TEAL}
          strokeWidth="1.75"
        />
      ))}
      <circle cx="4" cy="32" r="2" stroke={MAROON} strokeWidth="1.5" />
      <circle cx="176" cy="32" r="2" stroke={MAROON} strokeWidth="1.5" />
    </svg>
  );
}

function BreathingChip({ className = '', style }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      animate={
        reduce
          ? { opacity: 0.4 }
          : {
              opacity: [0.35, 0.45, 0.35],
              filter: [
                'drop-shadow(0 0 0px rgba(230,194,122,0))',
                'drop-shadow(0 0 14px rgba(94,234,212,0.45)) drop-shadow(0 0 6px rgba(230,194,122,0.35))',
                'drop-shadow(0 0 0px rgba(230,194,122,0))',
              ],
            }
      }
      transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <MicrochipWire className="h-auto w-full" />
    </motion.div>
  );
}

function LevitatingWire({ children, className = '', style, rotateAmp = 4, floatY = 10, duration = 14, delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      animate={
        reduce
          ? { opacity: 0.4 }
          : {
              y: [0, -floatY, 0],
              rotate: [-rotateAmp * 0.15, rotateAmp, -rotateAmp * 0.15],
              opacity: [0.35, 0.45, 0.35],
            }
      }
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

export function CircuitDecor({ isDark = false }) {
  const rootRef = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(rootRef, { once: true, amount: 0.15 });

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ['start end', 'end start'],
  });

  const yFar = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [48, -56]);
  const yMid = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [28, -36]);
  const yNear = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [12, -18]);
  const rotateFar = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-1.5, 1.5]);

  const farBlend = isDark ? 'mix-blend-overlay' : '';
  const farOpacity = isDark ? 'opacity-40' : 'opacity-40';
  const midOpacity = isDark ? 'opacity-35' : 'opacity-40';

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{
        WebkitMaskImage:
          'radial-gradient(ellipse 28% 24% at 38% 32%, transparent 0%, transparent 6%, black 42%)',
        maskImage:
          'radial-gradient(ellipse 28% 24% at 38% 32%, transparent 0%, transparent 6%, black 42%)',
      }}
    >
      {/* Far — PCB field */}
      <motion.div
        className={`absolute inset-[-8%] ${farBlend} ${farOpacity}`}
        style={{ y: yFar, rotate: rotateFar }}
      >
        <CircuitField inView={inView} pulses={false} />
      </motion.div>

      {/* Energy pulses sit above the dim traces so the glow stays bright */}
      <motion.div className="absolute inset-[-8%] opacity-90" style={{ y: yFar }}>
        <svg
          viewBox="0 0 800 520"
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          preserveAspectRatio="xMidYMid slice"
        >
          {TRACE_PATHS.filter((trace) => trace.pulse).map(({ d, gold, delay }) => (
            <EnergyPulse key={d} d={d} gold={gold} delay={delay} duration={6.8 + delay} />
          ))}
        </svg>
      </motion.div>

      {/* Mid — corner frame traces */}
      <motion.div className={`absolute inset-0 ${isDark ? 'mix-blend-overlay' : ''} ${midOpacity}`} style={{ y: yMid }}>
        <svg
          viewBox="0 0 800 520"
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          preserveAspectRatio="xMidYMid slice"
        >
          {[
            'M0 100 H80 V40 H0',
            'M800 80 H720 V20 H800',
            'M0 420 H100 V500 H0',
            'M800 440 H700 V510 H800',
          ].map((d, i) => (
            <motion.path
              key={d}
              d={d}
              fill="none"
              stroke={i % 2 ? TERRACOTTA : TEAL}
              strokeWidth="1.75"
              initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
              animate={inView || reduce ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 2.2, delay: 0.4 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </svg>
      </motion.div>

      {/* Near — wireframe components framing content */}
      <motion.div className="absolute inset-0" style={{ y: yNear }}>
        <BreathingChip className="absolute -right-1 top-4 w-12 sm:right-[2%] sm:top-[7%] sm:w-16 lg:w-[5.5rem] xl:right-[3.5%] xl:w-[6.5rem]" />

        <LevitatingWire
          className="absolute -left-1 top-[34%] w-8 sm:left-[1.5%] sm:w-10 xl:left-[2.5%] xl:w-12"
          rotateAmp={6}
          floatY={12}
          duration={16}
          delay={0.4}
        >
          <CapacitorWire className="h-auto w-full" />
        </LevitatingWire>

        <LevitatingWire
          className="absolute bottom-[6%] -right-2 w-28 sm:bottom-[9%] sm:right-[4%] sm:w-36 lg:w-40 xl:right-[6%] xl:w-48"
          rotateAmp={3}
          floatY={8}
          duration={18}
          delay={1.1}
        >
          <CoilWire className="h-auto w-full" />
        </LevitatingWire>

        <BreathingChip className="absolute bottom-[16%] -left-1 w-11 rotate-[8deg] sm:bottom-[18%] sm:left-[2%] sm:w-14 xl:w-16" />

        <LevitatingWire
          className="absolute right-1 top-[46%] w-7 -rotate-6 sm:right-[3%] sm:w-8 lg:w-9"
          rotateAmp={8}
          floatY={9}
          duration={13}
          delay={0.8}
        >
          <CapacitorWire className="h-auto w-full" />
        </LevitatingWire>
      </motion.div>
    </div>
  );
}
