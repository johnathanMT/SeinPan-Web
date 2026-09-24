// src/pages/SeinPanOfficialPage.jsx
// ✦ Complete single-file official website for Sein Pan Electronic Service
// ✦ Dark / Light mode toggle  ✦ 7 sections  ✦ Compact colorful technician card
// ✦ Controlled inquiry form with validation  ✦ All icons verified for lucide-react@1.22

import { Children, cloneElement, isValidElement, useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BRAND_LOGOS } from '../components/BrandLogos';
import { WorkshopDecor } from '../components/WorkshopTools';
import { CircuitDecor } from '../components/CircuitDecor';
import {
  Tv, Wrench, MapPin, Phone, Clock, Award, Shield,
  CheckCircle, X, Menu, ChevronRight, ChevronDown, User, Camera,
  ArrowUpRight, ArrowLeft, Zap, Home, Info, ClipboardList, PhoneCall,
  Users, History, TrendingUp, BadgeCheck, Gauge, Sparkles,
  Monitor, Radio, Cpu, Sun, Moon, Lightbulb, Send, ShieldCheck, Handshake,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────────────────────────

const NAV_TABS = [
  { id: 'home',     Icon: Home },
  { id: 'services', Icon: Cpu },
  { id: 'about',    Icon: Info },
  { id: 'inquiry',  Icon: ClipboardList },
  { id: 'contact',  Icon: PhoneCall },
];

const TAB_IDS = NAV_TABS.map(({ id }) => id);
const tabFromHash = () => {
  const id = window.location.hash.slice(1);
  return TAB_IDS.includes(id) ? id : 'home';
};

function useOfficial() {
  const { t, i18n } = useTranslation('official');
  const lang = (i18n.resolvedLanguage || i18n.language || 'my').split('-')[0] === 'en' ? 'en' : 'my';
  const list = (key) => {
    const value = t(key, { returnObjects: true });
    return Array.isArray(value) ? value : [];
  };
  return { t, i18n, lang, list };
}

function LangToggle({ isDark }) {
  const { t, i18n, lang } = useOfficial();
  return (
    <div
      className={`flex overflow-hidden rounded-xl border text-[11px] font-bold ${
        isDark ? 'border-theme-color-2/25' : 'border-theme-color-4/15'
      }`}
      role="group"
      aria-label={t('nav.switchLanguage')}
    >
      {[
        ['my', t('lang.my')],
        ['en', t('lang.en')],
      ].map(([code, label]) => (
        <button
          key={code}
          type="button"
          lang={code}
          onClick={() => i18n.changeLanguage(code)}
          aria-pressed={lang === code}
          className={`px-2.5 py-2 transition ${
            lang === code
              ? 'bg-theme-color-3 text-white'
              : isDark
                ? 'text-white/75 hover:text-white'
                : 'text-theme-color-4/75 hover:text-theme-color-4'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

const SERVICES = [
  {
    id: 'led', Icon: Monitor,
    label: 'LED TV Repair', badge: 'Most Popular',
    accentHex: '#AE7057',
    desc: 'Expert diagnosis and repair for all LED TV brands and sizes. From backlight failures to mainboard shorts, we restore full picture quality.',
    features: ['Backlight Strip Replacement', 'Main & Power Board Repair', 'Panel Crack Assessment', 'Firmware Reflash'],
  },
  {
    id: 'lcd', Icon: Tv,
    label: 'LCD TV Repair', badge: 'High Demand',
    accentHex: '#184542',
    desc: 'Specialized LCD panel servicing with genuine components. Our 37+ years of hands-on experience means faster turnaround and lasting repairs.',
    features: ['Inverter & CCFL Board Fix', 'T-Con Board Replacement', 'Colour Calibration', 'Remote & IR Sensor Sync'],
  },
  {
    id: 'plasma', Icon: Radio,
    label: 'Plasma TV Repair', badge: 'Specialist',
    accentHex: '#682C2C',
    desc: 'One of the few remaining service centres still expertly servicing vintage and modern plasma display units across Yangon.',
    features: ['Y & Z Sustain Board', 'Voltage Regulation Fix', 'Plasma Cell Diagnostics', 'High-voltage Safety Check'],
  },
];

const TECH_SKILLS = [
  { label: 'LED Technology',      Icon: Monitor },
  { label: 'LCD Mastery',         Icon: Tv },
  { label: 'Plasma Systems',      Icon: Radio },
  { label: 'Circuit Diagnostics', Icon: Cpu },
  { label: 'Smart TV Firmware',   Icon: Lightbulb },
  { label: 'Component Soldering', Icon: Zap },
];

const TRUST_BADGES = [
  { Icon: Shield,  text: 'Genuine Parts Guaranteed' },
  { Icon: Award,   text: '37+ Years Certified Experience' },
  { Icon: Wrench,  text: 'All Brands Serviced' },
  { Icon: Zap,     text: 'Same-Day Diagnosis Available' },
];

const ABOUT_STATS = [
  { Icon: History,    label: 'Founded',          value: '1989' },
  { Icon: Users,      label: 'Happy Customers',  value: '5,000+' },
  { Icon: Wrench,     label: 'Repair Types',     value: '3' },
  { Icon: Award,      label: 'Years Active',     value: '37+' },
];

const LINKS = {
  maps:      'https://maps.app.goo.gl/18ACK194oobVr4uP9?g_st=ic',
  facebook:  'https://www.facebook.com/seinpanelectronic',
  messenger: 'https://m.me/seinpanelectronic',
  viber:     'viber://chat?number=%2B959423858609',
  tel:       'tel:+959423858609',
};

// Every external link opens in a new tab without giving it window.opener.
const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' };

// lucide-react 1.x ships no brand logos, so these two are drawn inline.
function FacebookIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function MessengerIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2C6.48 2 2 6.14 2 11.25c0 2.92 1.46 5.52 3.74 7.24V22l3.42-1.88c.9.25 1.85.38 2.84.38 5.52 0 10-4.14 10-9.25S17.52 2 12 2Zm1.07 12.47-2.56-2.73-5 2.73 5.5-5.84 2.61 2.73 4.95-2.73-5.5 5.84Z" />
    </svg>
  );
}

function ViberIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M12 2.6c5.1 0 8.6 2.5 8.6 7.5v1.4c0 5-3.5 7.5-8.6 7.5-.9 0-1.8-.1-2.6-.3L6.3 21v-3.1c-1.9-1.2-2.9-3.4-2.9-6.4v-1.4c0-5 3.5-7.5 8.6-7.5Z" />
      <path d="M9.3 7.4c.3-.3.8-.3 1 .1l.8 1.3c.2.3.1.7-.1.9l-.5.5c.4 1 1.2 1.8 2.2 2.2l.5-.5c.3-.3.7-.3.9-.1l1.3.8c.4.2.4.7.1 1l-.6.6c-.6.6-1.6.7-2.4.3a7.2 7.2 0 0 1-3.8-3.8c-.4-.8-.3-1.8.3-2.4Z" fill="currentColor" stroke="none" />
      <path d="M13.2 5.6a4 4 0 0 1 3.5 3.5" />
      <path d="M13.2 7.6a2 2 0 0 1 1.6 1.6" />
    </svg>
  );
}

const HOURS = [
  { day: 'Monday – Friday', time: '9:00 AM – 8:00 PM', open: true },
  { day: 'Saturday',         time: '8:00 AM – 8:00 PM', open: true },
  { day: 'Sunday',           time: 'Closed',            open: false },
];

const INQUIRY_STEPS = [
  { Icon: ClipboardList, title: 'Describe Your Issue',  body: 'Tell us your TV model and what\'s wrong — no technical knowledge needed.' },
  { Icon: Phone,          title: 'We Call You Back',     body: 'Our technician will call to confirm availability and provide an estimate.' },
  { Icon: Wrench,         title: 'We Fix It',            body: 'Drop off your set or arrange collection in North Okkalapa township.' },
];

const CTA =
  'neon-cta inline-flex items-center justify-center gap-2 rounded-xl bg-theme-color-3 px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-theme-color-4/20 hover:scale-105 active:scale-100';

const BADGE = 'rounded-full bg-theme-color-3 px-3 py-1 text-xs font-bold text-white shadow-sm';

// Browsers break Burmese between syllables, splitting words mid-line;
// keep each space-separated phrase whole so lines only break at spaces.
const keepWords = (text) =>
  typeof text !== 'string'
    ? text
    : text.split(/(\s+)/).map((part, i) =>
        !part || /^\s+$/.test(part) ? part : <span key={i} className="whitespace-nowrap">{part}</span>,
      );

const keepNodeWords = (node) =>
  isValidElement(node) && typeof node.props.children === 'string'
    ? cloneElement(node, undefined, keepWords(node.props.children))
    : keepWords(node);

const MY_DIGITS = '၀၁၂၃၄၅၆၇၈၉';
const toLocalDigits = (value, lang) =>
  lang === 'my' ? String(value).replace(/[0-9]/g, (d) => MY_DIGITS[d]) : String(value);

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] || motion.div;
  if (reduce) return <MotionTag className={className}>{children}</MotionTag>;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.14, margin: '0px 0px -48px 0px' }}
      variants={{
        hidden: fadeUp.hidden,
        show: {
          ...fadeUp.show,
          transition: { ...fadeUp.show.transition, delay: delay / 1000 },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}

function RevealGroup({ children, className = '', stagger = 0.12, as = 'div' }) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] || motion.div;
  if (reduce) {
    const StaticTag = as === 'ol' ? 'ol' : as === 'ul' ? 'ul' : 'div';
    return <StaticTag className={className}>{children}</StaticTag>;
  }
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -48px 0px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: 0.04 } },
      }}
    >
      {children}
    </MotionTag>
  );
}

function RevealItem({ children, className = '', as = 'div' }) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag className={className} variants={fadeUp}>
      {children}
    </MotionTag>
  );
}

function GlitchTitle({ text, className = '', baseClassName = '' }) {
  const [play, setPlay] = useState(true);
  const timer = useRef(null);

  const burst = () => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    clearTimeout(timer.current);
    setPlay(false);
    requestAnimationFrame(() => {
      setPlay(true);
      timer.current = setTimeout(() => setPlay(false), 800);
    });
  };

  useEffect(() => {
    burst();
    return () => clearTimeout(timer.current);
  }, [text]);

  return (
    <span
      className={`glitch-title ${play ? 'glitch-title--play' : ''} ${className}`}
      onMouseEnter={burst}
    >
      <span className={`glitch-title__base ${baseClassName}`}>{keepWords(text)}</span>
      <span aria-hidden="true" className="glitch-title__slice glitch-title__slice--cyan">{keepWords(text)}</span>
      <span aria-hidden="true" className="glitch-title__slice glitch-title__slice--amber">{keepWords(text)}</span>
      <span aria-hidden="true" className="glitch-title__scan" />
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────
// THEME TOKENS
// ─────────────────────────────────────────────────────────────────
// Returns a frozen object of Tailwind class strings for the current theme.
function getT(isDark) {
  return Object.freeze({
    page:       isDark ? 'bg-theme-color-4 text-theme-color-2'      : 'bg-theme-color-2 text-theme-color-4',
    sec:        isDark ? 'bg-theme-color-4'                       : 'bg-theme-color-2',
    altSec:     isDark ? 'bg-theme-color-1/40'                     : 'bg-theme-color-1/[0.08]',
    card:       isDark ? 'border border-theme-color-2/15 bg-white/5 shadow-sm' : 'border border-theme-color-4/10 bg-white/50 shadow-md shadow-theme-color-4/5',
    cardHov:    isDark ? 'neon-card hover:border-theme-color-3/60' : 'neon-card hover:border-theme-color-3/40',
    feature:    'bg-theme-color-1 text-white shadow-md shadow-theme-color-4/10',
    h:          isDark ? 'text-theme-color-2' : 'text-theme-color-4',
    body:       isDark ? 'text-theme-color-2/85' : 'text-theme-color-4/80',
    muted:      isDark ? 'text-theme-color-2/70' : 'text-theme-color-4/75',
    label:      isDark ? 'text-theme-color-2' : 'text-theme-color-4',
    accent:     isDark ? 'text-theme-color-2' : 'text-theme-color-4',
    div:        isDark ? 'border-theme-color-2/15' : 'border-theme-color-4/10',
    soft:       isDark ? 'border-theme-color-2/10 bg-white/5' : 'border-theme-color-4/10 bg-theme-color-2/70',
    input: (err) =>
      `w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
        err
          ? isDark ? 'border-theme-color-3 bg-theme-color-3/10 text-theme-color-2 placeholder-theme-color-2/40'
                   : 'border-theme-color-3 bg-theme-color-3/5 text-theme-color-4 placeholder-theme-color-4/40'
          : isDark ? 'border-theme-color-2/15 bg-white/5 text-theme-color-2 placeholder-theme-color-2/40 focus:border-theme-color-3 focus:ring-2 focus:ring-theme-color-3/30'
                   : 'border-theme-color-4/15 bg-white/60 text-theme-color-4 placeholder-theme-color-4/40 focus:border-theme-color-3 focus:ring-2 focus:ring-theme-color-3/25'
      }`,
  });
}

// ─────────────────────────────────────────────────────────────────
// SECTION LABEL + HEADING (shared)
// ─────────────────────────────────────────────────────────────────
function SectionLabel({ children, T, className = '' }) {
  return (
    <p className={`mb-3 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] ${T.label} ${className}`}>
      <span className="h-0.5 w-7 rounded-full bg-theme-color-3" />
      {children}
    </p>
  );
}
function SectionHeading({ children, T, className = '' }) {
  return (
    <h2 className={`font-display text-3xl font-normal leading-snug tracking-tight sm:text-5xl ${T.h} ${className}`}>
      {Children.map(children, keepNodeWords)}
    </h2>
  );
}

// ─────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────
function Navbar({ active, setActive, isDark, toggleTheme }) {
  const [open, setOpen] = useState(false);
  const { t } = useOfficial();
  const go = (id) => { setActive(id); setOpen(false); };
  const tabCls = (id) =>
    active === id
      ? 'bg-theme-color-2 text-theme-color-4 shadow-sm'
      : 'text-white/85 hover:bg-white/10 hover:text-white';

  return (
    <header className="fixed inset-x-0 top-0 z-50 shadow-md shadow-theme-color-4/10">
      <div className="hidden bg-theme-color-4 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-[11px] tracking-[0.06em]">
          <span className="text-theme-color-2/85">{t('nav.utility')}</span>
          <a href={`tel:${t('phone')}`} className="inline-flex items-center gap-1.5 font-semibold text-theme-color-2 transition hover:text-white">
            <Phone size={11} />
            {t('phone')}
          </a>
        </div>
      </div>
      <div className="bg-theme-color-1/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <button onClick={() => go('home')} className="group flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-theme-color-3 shadow-md shadow-theme-color-4/20 transition group-hover:scale-105">
              <Tv size={17} className="text-white" />
            </div>
            <div className="text-left leading-none">
              <span className="block text-[13px] font-extrabold leading-snug tracking-wide text-theme-color-2">{t('nav.brand')}</span>
              <span className="hidden text-[10px] uppercase leading-snug tracking-[0.18em] text-white/80 xl:block">{t('nav.tagline')}</span>
            </div>
          </button>

          <nav className="hidden items-center gap-1 rounded-2xl bg-black/10 p-1 xl:flex">
            {NAV_TABS.map(({ id }) => (
              <button
                key={id}
                onClick={() => go(id)}
                aria-current={active === id ? 'page' : undefined}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium leading-snug transition-all duration-200 ${tabCls(id)}`}
              >
                {t(`nav.${id}`)}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="grid h-9 w-9 place-items-center rounded-xl border border-theme-color-2/25 text-theme-color-2 transition hover:bg-white/10"
              aria-label={t('nav.toggleTheme')}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <LangToggle isDark />

            <button
              onClick={() => go('inquiry')}
              className="hidden items-center gap-2 whitespace-nowrap rounded-xl bg-theme-color-3 px-4 py-2 text-sm font-bold leading-snug text-white shadow-md shadow-theme-color-4/20 transition hover:scale-105 hover:opacity-90 xl:flex"
            >
              <Wrench size={14} />
              {t('nav.bookRepair')}
            </button>

            <button
              className="grid h-9 w-9 place-items-center rounded-xl border border-theme-color-2/25 text-theme-color-2 transition hover:bg-white/10 xl:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={t('nav.toggleMenu')}
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-theme-color-2/15 px-4 pb-4 pt-2 xl:hidden">
            <div className="space-y-1">
              {NAV_TABS.map(({ id, Icon }) => (
                <button
                  key={id}
                  onClick={() => go(id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${tabCls(id)}`}
                >
                  <Icon size={16} />
                  {t(`nav.${id}`)}
                </button>
              ))}
            </div>
            <button onClick={() => go('inquiry')} className={`${CTA} mt-3 w-full`}>
              <Wrench size={14} />
              {t('nav.bookARepair')}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────
// VINTAGE TV PARTS
// ─────────────────────────────────────────────────────────────────
function CrtOverlay({ subtle = false, roll = true }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
      <div className={`absolute inset-0 bg-scanlines ${subtle ? 'opacity-25' : 'opacity-60'}`} />
      {roll && (
        <div className="absolute inset-x-0 top-0 h-1/4 motion-safe:animate-crt-roll bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
      )}
      <div className="absolute inset-0 bg-crt-vignette" />
      <div className="absolute inset-0 bg-crt-glass" />
    </div>
  );
}

function TvKnob({ angle = 0, small = false, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`relative rounded-full bg-[conic-gradient(#EFE6D6,#9C9282,#EFE6D6,#9C9282,#EFE6D6)] shadow-[0_6px_10px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.7)] ${
          small ? 'h-7 w-7' : 'h-11 w-11 lg:h-14 lg:w-14'
        }`}
      >
        <div className="absolute inset-[18%] rounded-full bg-gradient-to-b from-[#F4EDE1] to-[#B8AC98] shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]" />
        <div className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
          <span className="absolute left-1/2 top-[9%] h-[30%] w-[3px] -translate-x-1/2 rounded-full bg-theme-color-4" />
        </div>
      </div>
      {label && (
        <span className="hidden text-[9px] font-semibold tracking-[0.25em] text-theme-color-2/70 sm:block">{label}</span>
      )}
    </div>
  );
}

const CRT_RADIUS = { borderRadius: 'clamp(1.25rem, 4vw, 2.75rem) / clamp(1rem, 3.2vw, 2.25rem)' };
const CABINET_SHADOW =
  'shadow-[0_50px_90px_-35px_rgba(0,0,0,0.8),inset_0_2px_0_rgba(255,255,255,0.14),inset_0_-6px_0_rgba(0,0,0,0.35)] ring-1 ring-black/40';
const BEZEL =
  'bg-[#121212] shadow-[inset_0_0_0_2px_rgba(255,255,255,0.06),inset_0_10px_30px_rgba(0,0,0,0.9)]';

// ─────────────────────────────────────────────────────────────────
// HERO SECTION  (styled as a vintage television set)
// ─────────────────────────────────────────────────────────────────
function HeroSection({ setActive }) {
  const { t, list } = useOfficial();
  const stats = list('hero.stats');
  const trust = [
    [Shield, t('hero.genuine')],
    [Clock, t('hero.sameDay')],
    [BadgeCheck, t('hero.noFee')],
  ];
  const statBorder = ['', 'border-l', 'border-t sm:border-l sm:border-t-0', 'border-l border-t sm:border-t-0'];
  return (
    <section className="relative isolate overflow-hidden bg-theme-color-1">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/35" />
        <div className="absolute inset-0 bg-grid-lines bg-[length:56px_56px] [mask-image:radial-gradient(ellipse_at_50%_35%,black_15%,transparent_70%)]" />
        <div className="absolute left-1/2 top-[-18rem] h-[40rem] w-[40rem] animate-aurora rounded-full bg-theme-color-2/[0.07] blur-[140px]" />
        <div className="absolute -left-40 top-1/3 h-[26rem] w-[26rem] rounded-full bg-theme-color-3/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl px-3 pb-10 pt-12 sm:px-6 sm:pb-12 sm:pt-36">
        <Reveal>
          <div className="relative">
            <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 hidden h-24 w-72 -translate-x-1/2 sm:block">
              <span className="absolute bottom-3 left-1/2 h-32 w-[3px] origin-bottom -translate-x-1/2 -rotate-[32deg] rounded-full bg-gradient-to-t from-[#8F877B] to-[#EFE6D6]">
                <span className="absolute -left-[4px] -top-2 h-3 w-3 rounded-full bg-[#EFE6D6] shadow" />
              </span>
              <span className="absolute bottom-3 left-1/2 h-32 w-[3px] origin-bottom -translate-x-1/2 rotate-[32deg] rounded-full bg-gradient-to-t from-[#8F877B] to-[#EFE6D6]">
                <span className="absolute -left-[4px] -top-2 h-3 w-3 rounded-full bg-[#EFE6D6] shadow" />
              </span>
              <span className="absolute bottom-0 left-1/2 h-7 w-20 -translate-x-1/2 rounded-t-full bg-wood-grain shadow-[inset_0_2px_0_rgba(255,255,255,0.14)]" />
            </div>

            <div className={`relative rounded-[1.75rem] bg-wood-grain p-2.5 sm:rounded-[2.75rem] sm:p-5 ${CABINET_SHADOW}`}>
              <div className="flex flex-col gap-2.5 sm:gap-5 lg:flex-row">
                <div className={`flex-1 rounded-[1.5rem] p-2 sm:rounded-[2.25rem] sm:p-4 ${BEZEL}`}>
                  <div
                    className="relative isolate overflow-hidden bg-crt-glow shadow-[inset_0_0_80px_rgba(0,0,0,0.65)] motion-safe:animate-crt-on"
                    style={CRT_RADIUS}
                  >
                    <div className="relative z-10 flex flex-col items-center gap-6 px-4 py-12 text-center motion-safe:animate-crt-flicker sm:gap-7 sm:px-10 sm:py-16 lg:py-20">
                      <p className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.3em] text-theme-gold sm:text-sm">
                        <span aria-hidden="true" className="h-px w-8 bg-theme-gold/70 sm:w-12" />
                        {t('hero.since')}
                        <span aria-hidden="true" className="h-px w-8 bg-theme-gold/70 sm:w-12" />
                      </p>

                      <div>
                        <h1 className="px-2 font-display font-bold [text-wrap:balance]">
                          <span className="block py-1 text-5xl leading-relaxed text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.25)] sm:text-7xl lg:text-8xl">
                            {t('hero.titleLine1')}
                          </span>
                          <GlitchTitle
                            text={t('hero.titleLine2')}
                            className="mt-1 block py-3 text-3xl leading-relaxed sm:text-5xl lg:text-6xl"
                            baseClassName="bg-gradient-to-r from-theme-gold-light via-theme-gold to-theme-gold-deep bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(230,194,122,0.35)]"
                          />
                        </h1>
                        <div aria-hidden="true" className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-theme-gold-deep via-theme-gold to-theme-gold-deep" />
                      </div>

                      <div className="flex w-full flex-col items-center justify-center gap-3 pt-2 sm:w-auto sm:flex-row">
                        <button onClick={() => setActive('inquiry')} className={`${CTA} w-full sm:w-auto`}>
                          <ClipboardList size={16} className="shrink-0" />
                          <span>{keepWords(t('hero.quote'))}</span>
                          <ArrowUpRight size={15} />
                        </button>
                        <a
                          href={`tel:${t('phone')}`}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-theme-color-2/70 px-7 py-3.5 text-sm font-semibold text-theme-color-2 transition hover:scale-105 hover:bg-theme-color-2 hover:text-theme-color-4 sm:w-auto"
                        >
                          <Phone size={15} />
                          {t('phone')}
                        </a>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white sm:text-sm">
                        {trust.map(([Icon, label]) => (
                          <span key={label} className="inline-flex items-center gap-2">
                            <Icon size={14} className="text-theme-gold" />
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <CrtOverlay />
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className="flex items-center justify-between gap-4 rounded-[1.1rem] bg-black/25 px-4 py-3 shadow-[inset_0_2px_6px_rgba(0,0,0,0.45)] ring-1 ring-white/5 sm:rounded-[1.5rem] sm:px-6 lg:w-44 lg:flex-col lg:justify-start lg:gap-7 lg:rounded-[1.75rem] lg:px-4 lg:py-8"
                >
                  <div className="hidden text-center sm:block">
                    <p className="text-sm font-extrabold tracking-[0.3em] text-theme-gold">SEIN PAN</p>
                    <p className="mt-0.5 text-[9px] tracking-[0.35em] text-theme-color-2/60">EST. 1989</p>
                  </div>
                  <div className="rounded-md bg-black px-3 py-1.5 font-mono text-sm font-bold tracking-widest text-theme-gold shadow-[inset_0_0_8px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] [text-shadow:0_0_8px_rgba(230,194,122,0.8)]">
                    CH 89
                  </div>
                  <div className="flex gap-4 lg:flex-col lg:gap-6">
                    <TvKnob angle={-40} label="CHANNEL" />
                    <TvKnob angle={55} label="VOLUME" />
                  </div>
                  <div className="hidden h-10 w-24 rounded-lg bg-speaker-grille shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)] sm:block lg:h-24 lg:w-full" />
                  <div className="flex items-center gap-2 lg:mt-auto">
                    <span className="h-2.5 w-2.5 rounded-full bg-theme-gold shadow-[0_0_10px_2px_rgba(230,194,122,0.75)]" />
                    <span className="hidden text-[9px] font-semibold tracking-[0.25em] text-theme-color-2/70 sm:inline">POWER</span>
                  </div>
                </div>
              </div>
            </div>

            <div aria-hidden="true" className="mx-auto flex w-[78%] justify-between">
              <span className="h-4 w-14 bg-[#3B1818] shadow-[0_12px_20px_rgba(0,0,0,0.5)] [clip-path:polygon(0_0,100%_0,82%_100%,18%_100%)] sm:h-6 sm:w-24" />
              <span className="h-4 w-14 bg-[#3B1818] shadow-[0_12px_20px_rgba(0,0,0,0.5)] [clip-path:polygon(0_0,100%_0,82%_100%,18%_100%)] sm:h-6 sm:w-24" />
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-16 sm:pb-24">
        <Reveal delay={300}>
          <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] shadow-md shadow-black/20 backdrop-blur-md sm:grid-cols-4">
            {stats.map(({ value, label }, i) => (
              <div key={label} className={`border-white/15 px-4 py-6 text-center sm:py-8 ${statBorder[i] || ''}`}>
                <p className="font-display text-3xl font-bold text-theme-gold sm:text-4xl">{value}</p>
                <p className="mt-1.5 text-xs tracking-wide text-white">{label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function BrandMarquee({ isDark }) {
  const { t } = useOfficial();
  const row = [...BRAND_LOGOS, ...BRAND_LOGOS];
  return (
    <section className={`border-y py-12 ${isDark ? 'border-theme-color-2/10 bg-theme-color-1/40' : 'border-theme-color-4/10 bg-theme-color-1/[0.08]'}`}>
      <p className={`mb-6 text-center text-xs font-semibold tracking-[0.2em] ${isDark ? 'text-theme-color-2/75' : 'text-theme-color-4/75'}`}>
        {t('brandsLabel')}
      </p>
      <div className="group/marquee overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max items-center gap-12 motion-safe:animate-marquee group-hover/marquee:[animation-play-state:paused] sm:gap-16">
          {row.map(({ id, Logo }, i) => (
            <span
              key={`${id}-${i}`}
              className="inline-flex h-10 items-center"
            >
              <Logo />
            </span>
          ))}
        </div>
      </div>
      <p className={`mx-auto mt-7 max-w-3xl px-6 text-center text-[10px] leading-relaxed sm:text-[11px] ${isDark ? 'text-theme-color-2/55' : 'text-theme-color-4/55'}`}>
        {keepWords(t('brandsDisclaimer'))}
      </p>
    </section>
  );
}

function HomeServices({ setActive, isDark }) {
  const { t, list } = useOfficial();
  const T = getT(isDark);
  const [lead, ...rest] = SERVICES;
  const leadFeatures = list(`services.${lead.id}.features`);
  return (
    <section className={`relative px-4 py-20 sm:py-28 ${T.sec}`}>
      <div className="relative mx-auto max-w-6xl">
        <div className="relative lg:px-28 xl:px-36">
          <WorkshopDecor />
          <Reveal className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="lg:max-w-xl xl:max-w-2xl">
              <SectionLabel T={T}>{t('homeServices.label')}</SectionLabel>
              <SectionHeading T={T}>
                {t('homeServices.title')} <span className="text-theme-color-3">{t('homeServices.titleEm')}</span>
              </SectionHeading>
            </div>
            <button onClick={() => setActive('services')} className={`group inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-semibold ${T.accent}`}>
              {t('homeServices.all')}
              <ArrowUpRight size={15} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </Reveal>
        </div>

        <RevealGroup className="mt-12 grid gap-5 lg:grid-cols-2 lg:grid-rows-2" stagger={0.12}>
          <RevealItem className="lg:row-span-2">
            <button
              onClick={() => setActive('services')}
              className="neon-card-dark group relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-theme-color-1 p-8 text-left text-white shadow-md shadow-theme-color-4/15 hover:-translate-y-1 sm:p-10"
            >
              <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-theme-color-3/35 blur-3xl transition duration-500 group-hover:bg-theme-color-3/50" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid-lines bg-[length:40px_40px] opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
              <div className="relative flex items-center justify-between">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-theme-color-2 text-theme-color-4 shadow-md">
                  <lead.Icon size={24} />
                </div>
                <span className={BADGE}>
                  {t(`services.${lead.id}.badge`)}
                </span>
              </div>
              <h3 className="relative mt-10 font-display text-4xl text-theme-color-2 sm:text-5xl">{t(`services.${lead.id}.short`)}</h3>
              <p className="relative mt-4 max-w-md text-sm leading-loose text-white sm:text-base">{keepWords(t(`services.${lead.id}.desc`))}</p>
              <ul className="relative mt-8 grid gap-3 sm:grid-cols-2">
                {leadFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white">
                    <CheckCircle size={16} className="mt-0.5 shrink-0 text-theme-color-2" />
                    {f}
                  </li>
                ))}
              </ul>
              <span className="relative mt-auto inline-flex items-center gap-1.5 pt-10 text-sm font-semibold text-theme-color-2">
                {t('homeServices.seeList')}
                <ArrowUpRight size={15} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </button>
          </RevealItem>

          {rest.map((svc) => (
            <RevealItem key={svc.id} className="h-full">
              <button
                onClick={() => setActive('services')}
                className={`group flex h-full w-full flex-col rounded-2xl border p-8 text-left transition duration-300 hover:-translate-y-1 ${T.card} ${T.cardHov}`}
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-theme-color-1 text-theme-color-2 shadow-sm">
                    <svc.Icon size={20} />
                  </div>
                  <span className={BADGE}>
                    {t(`services.${svc.id}.badge`)}
                  </span>
                </div>
                <h3 className={`mt-6 font-display text-3xl ${T.h}`}>{t(`services.${svc.id}.short`)}</h3>
                <p className={`mt-3 text-sm leading-loose ${T.body}`}>{keepWords(t(`services.${svc.id}.desc`))}</p>
                <span className={`mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold ${T.accent}`}>
                  {t('homeServices.seeList')}
                  <ArrowUpRight size={15} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </button>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function ProcessStrip({ setActive, isDark }) {
  const { t, list, lang } = useOfficial();
  const steps = list('process.steps');
  const T = getT(isDark);
  return (
    <section className={`px-4 py-20 sm:py-28 ${T.altSec}`}>
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionLabel T={T}>{t('process.label')}</SectionLabel>
          <SectionHeading T={T}>{t('process.title')}</SectionHeading>
        </Reveal>
        <div className="relative mt-14">
          <div aria-hidden="true" className="absolute left-[16%] right-[16%] top-8 hidden h-0.5 bg-gradient-to-r from-transparent via-theme-color-3/60 to-transparent md:block" />
          <ol className="relative grid gap-12 md:grid-cols-3 md:gap-6">
            {steps.map(({ title, body }, i) => {
              const Icon = INQUIRY_STEPS[i]?.Icon || ClipboardList;
              return (
                <Reveal as="li" key={title} delay={i * 120} className="flex flex-col items-center text-center">
                  <div className={`relative grid h-16 w-16 place-items-center rounded-full bg-theme-color-1 text-theme-color-2 shadow-md shadow-theme-color-4/15 ring-8 ${isDark ? 'ring-theme-color-4' : 'ring-theme-color-2'}`}>
                    <Icon size={22} />
                    <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-theme-color-3 text-[11px] font-bold text-white">
                      {toLocalDigits(i + 1, lang)}
                    </span>
                  </div>
                  <h3 className={`mt-6 text-lg font-bold ${T.h}`}>{title}</h3>
                  <p className={`mt-2 max-w-xs text-sm leading-loose ${T.body}`}>{keepWords(body)}</p>
                </Reveal>
              );
            })}
          </ol>
        </div>
        <div className="mt-12 flex justify-center">
          <button onClick={() => setActive('inquiry')} className={CTA}>
            {t('process.start')}
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}

const WHY_ICONS = [Award, ShieldCheck, Handshake];

function WhyChooseUs({ isDark }) {
  const { t, list } = useOfficial();
  const items = list('why.items');
  const T = getT(isDark);
  return (
    <section className={`px-4 py-20 sm:py-28 ${T.sec}`}>
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-3xl">
          <SectionLabel T={T}>{t('why.title')}</SectionLabel>
          <SectionHeading T={T}>{t('why.subtitle')}</SectionHeading>
        </Reveal>
        <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map(({ heading, body }, i) => {
            const Icon = WHY_ICONS[i] || Award;
            return (
              <RevealItem key={heading} className="h-full">
                <article className={`flex h-full flex-col rounded-2xl border p-7 transition duration-300 hover:-translate-y-1 ${T.card} ${T.cardHov}`}>
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-theme-color-1 shadow-sm">
                    <Icon size={22} className="text-theme-color-2" />
                  </div>
                  <h3 className={`mt-6 text-lg font-bold leading-snug ${T.h}`}>{keepWords(heading)}</h3>
                  <p className={`mt-3 flex-1 text-[15px] leading-loose ${T.body}`}>{keepWords(body)}</p>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}

function ClosingBand({ setActive, isDark }) {
  const { t } = useOfficial();
  const T = getT(isDark);
  return (
    <section className={`px-4 pb-20 sm:pb-28 ${T.sec}`}>
      <Reveal className={`mx-auto max-w-6xl rounded-[1.75rem] bg-wood-grain p-2.5 sm:rounded-[2.5rem] sm:p-4 ${CABINET_SHADOW}`}>
        <div className={`rounded-[1.5rem] p-2 sm:rounded-[2rem] sm:p-3 ${BEZEL}`}>
        <div
          className="relative isolate overflow-hidden bg-crt-glow px-6 py-16 text-center shadow-[inset_0_0_80px_rgba(0,0,0,0.65)] sm:px-16 sm:py-24"
          style={CRT_RADIUS}
        >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-grid-lines bg-[length:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
          <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-theme-color-3/25 blur-3xl" />
        </div>
        <CrtOverlay />
        <p className="text-xs font-semibold tracking-[0.2em] text-theme-gold">{t('closing.label')}</p>
        <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl leading-snug text-white [text-wrap:balance] sm:text-5xl">
          {keepWords(t('closing.title'))}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-loose text-white">
          {keepWords(t('closing.body'))}
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={() => setActive('inquiry')} className={CTA}>
            <ClipboardList size={16} />
            {t('closing.submit')}
          </button>
          <a
            href={`tel:${t('phone')}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-theme-color-2/70 px-7 py-3.5 text-sm font-semibold text-theme-color-2 transition hover:scale-105 hover:bg-theme-color-2 hover:text-theme-color-4"
          >
            <Phone size={15} />
            {t('phone')}
          </a>
        </div>
        </div>
        </div>
      </Reveal>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────
// TECHNICIAN PHOTO — real image with graceful fallback to initials
// ─────────────────────────────────────────────────────────────────
function TechPhoto({ isDark }) {
  const { t } = useOfficial();
  const [failed, setFailed] = useState(false);
  const src = `${import.meta.env.BASE_URL}technician.jpg`;

  if (failed) {
    return (
      <div
        className="flex h-full w-full items-center justify-center rounded-[14px] text-xl font-extrabold"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #184542, #0F2E2C)'
            : 'linear-gradient(135deg, #EAE0D0, #d9ccb6)',
        }}
      >
        <span className={isDark ? 'text-theme-color-2' : 'text-theme-color-4'}>WN</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={t('tech.alt')}
      onError={() => setFailed(true)}
      className="h-full w-full rounded-[14px] object-cover object-top"
    />
  );
}

// ─────────────────────────────────────────────────────────────────
// TECHNICIAN CARD  (compact, advanced, colourful)
// ─────────────────────────────────────────────────────────────────
function TechnicianCard({ isDark, setActive }) {
  const { t, list } = useOfficial();
  const skills = list('tech.skills');
  const values = list('tech.values');
  const T = getT(isDark);
  const stats = [
    [values[0], t('tech.repaired')],
    [values[1], t('tech.yearsShort')],
    [values[2], t('tech.genuine')],
  ];
  return (
    <section className={`px-4 py-20 sm:py-28 ${T.sec}`}>
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-sm">
          <div aria-hidden="true" className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-theme-color-3/25 via-transparent to-theme-color-1/30 blur-2xl" />
          <div className={`relative rounded-[2rem] bg-wood-grain p-3 ${CABINET_SHADOW}`}>
            <div className={`rounded-[1.6rem] p-2 ${BEZEL}`}>
              <div className="relative aspect-[4/5] overflow-hidden bg-theme-color-1" style={{ borderRadius: '1.4rem / 1.15rem' }}>
                <TechPhoto isDark />
                <CrtOverlay subtle roll={false} />
              </div>
            </div>
            <div aria-hidden="true" className="flex items-center justify-between px-2 pb-4 pt-3">
              <div className="h-7 w-28 rounded-md bg-speaker-grille shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]" />
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-theme-gold shadow-[0_0_8px_2px_rgba(230,194,122,0.7)]" />
                <TvKnob small angle={-35} />
                <TvKnob small angle={50} />
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-theme-color-3 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-theme-color-4/25">
            <BadgeCheck size={16} className="text-white" />
            {t('tech.years')}
          </div>
        </Reveal>

        <Reveal delay={150}>
          <SectionLabel T={T}>{t('tech.label')}</SectionLabel>
          <h2 className={`font-display text-4xl leading-snug sm:text-5xl ${T.h}`}>{t('tech.name')}</h2>
          <p className={`mt-1 text-sm font-semibold sm:text-base ${T.accent}`}>{t('tech.role')}</p>
          <p className={`mt-5 max-w-xl text-base leading-loose ${T.body}`}>{keepWords(t('tech.bio'))}</p>

          <p className={`mt-8 text-xs font-semibold tracking-[0.14em] ${T.muted}`}>{t('tech.skillsLabel')}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {TECH_SKILLS.map(({ Icon }, i) => (
              <span
                key={skills[i] || i}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium ${isDark ? 'border-theme-color-2/15 bg-white/5 text-theme-color-2' : 'border-theme-color-4/10 bg-white/60 text-theme-color-4 shadow-sm'}`}
              >
                <Icon size={12} className={isDark ? 'text-theme-color-2' : 'text-theme-color-3'} />
                {skills[i]}
              </span>
            ))}
          </div>

          <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
            {stats.map(([value, label]) => (
              <div key={label} className={`rounded-2xl p-4 text-center ${T.feature}`}>
                <p className="font-display text-2xl font-bold text-theme-gold sm:text-3xl">{value}</p>
                <p className="mt-1 text-[11px] text-white">{label}</p>
              </div>
            ))}
          </div>

          <button onClick={() => setActive('about')} className={`group mt-8 inline-flex items-center gap-2 text-sm font-semibold ${T.accent}`}>
            {t('tech.story')}
            <ArrowUpRight size={15} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// SERVICES SECTION
// ─────────────────────────────────────────────────────────────────
function ServicesSection({ isDark, setActive }) {
  const [expanded, setExpanded] = useState(null);
  const { t, list } = useOfficial();
  const trust = list('trust');
  const T = getT(isDark);

  return (
    <section className={`relative min-h-screen px-4 py-20 sm:py-28 ${T.sec}`}>
      <div className="relative mx-auto max-w-6xl">
        <div className="relative lg:px-28 xl:px-36">
          <WorkshopDecor />
          <div className="relative z-10 max-w-2xl lg:max-w-xl xl:max-w-2xl">
            <SectionLabel T={T}>{t('services.pageLabel')}</SectionLabel>
            <SectionHeading T={T}>
              {t('services.pageTitle')}{' '}
              <span className="text-theme-color-3">{t('services.pageTitleEm')}</span>
            </SectionHeading>
            <p className={`mt-4 max-w-lg text-sm leading-relaxed sm:text-base ${T.body}`}>
              {t('services.pageBody')}
            </p>
          </div>
        </div>

        {/* Service cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((svc) => {
            const isOpen = expanded === svc.id;
            const features = list(`services.${svc.id}.features`);
            return (
              <div
                key={svc.id}
                className={`neon-card group flex cursor-pointer flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${T.card} ${T.cardHov}`}
                onClick={() => setExpanded(isOpen ? null : svc.id)}
              >
                <div className="h-1.5 w-full" style={{ background: svc.accentHex }} />

                <div className="flex flex-col flex-1 p-7">
                  <div className="flex items-start justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-theme-color-1 text-theme-color-2 shadow-sm transition group-hover:scale-105">
                      <svc.Icon size={22} />
                    </div>
                    <span className={BADGE}>
                      {t(`services.${svc.id}.badge`)}
                    </span>
                  </div>

                  <h3 className={`mt-4 text-lg font-bold ${T.h}`}>{t(`services.${svc.id}.label`)}</h3>
                  <p className={`mt-2 flex-1 text-sm leading-relaxed ${T.body}`}>{t(`services.${svc.id}.desc`)}</p>

                  {/* Expand toggle */}
                  <button
                    className={`mt-4 flex items-center gap-1.5 text-xs font-semibold underline-offset-4 transition hover:underline ${T.accent}`}
                    onClick={(e) => { e.stopPropagation(); setExpanded(isOpen ? null : svc.id); }}
                  >
                    {isOpen ? t('services.hide') : t('services.see')}
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Expandable feature list */}
                  {isOpen && (
                    <ul className={`mt-4 space-y-2 border-t pt-4 ${T.div}`}>
                      {features.map((f) => (
                        <li key={f} className={`flex items-center gap-2 text-xs ${T.body}`}>
                          <CheckCircle size={12} className={`shrink-0 ${isDark ? 'text-theme-color-2' : 'text-theme-color-1'}`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust badge strip */}
        <div className="mt-14 flex flex-wrap gap-3">
          {TRUST_BADGES.map(({ Icon }, i) => (
            <div
              key={trust[i] || i}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 ${T.card}`}
            >
              <Icon size={14} className={isDark ? 'text-theme-color-2' : 'text-theme-color-3'} />
              <span className={`text-xs font-medium ${T.body}`}>{trust[i]}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setActive('inquiry')}
            className={CTA}
          >
            <Send size={14} />
            {t('services.book')}
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// ABOUT SECTION
// ─────────────────────────────────────────────────────────────────
function AboutSection({ isDark, setActive, featured = false }) {
  const { t, list } = useOfficial();
  const timeline = list('about.timeline');
  const stats = list('about.stats');
  const T = getT(isDark);
  return (
    <section className={`relative overflow-hidden px-4 ${featured ? 'py-16 sm:py-20' : 'min-h-screen py-20 sm:py-28'} ${T.altSec}`}>
      <CircuitDecor isDark={isDark} />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-theme-color-3/15 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-theme-color-1/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start">

          <RevealGroup className="space-y-6" stagger={0.1}>
            <RevealItem>
              <SectionLabel T={T}>{t('about.label')}</SectionLabel>
              <SectionHeading T={T}>
                {t('about.title')}{' '}
                <span className="text-theme-color-3">{t('about.titleTrust')}</span>{t('about.titleAfter')}
              </SectionHeading>
            </RevealItem>

            <RevealItem className={`flex gap-4 rounded-2xl border-l-4 border-theme-color-3 p-5 shadow-sm ${isDark ? 'bg-white/5' : 'bg-white/60'}`}>
              <MapPin size={20} className="mt-1 shrink-0 text-theme-color-3" />
              <p className={`text-[15px] font-medium leading-loose sm:text-base ${T.h}`}>
                {keepWords(t('about.notice'))}
              </p>
            </RevealItem>

            <RevealItem className={`space-y-4 text-[15px] leading-loose sm:text-base ${T.body}`}>
              <p>
                {keepWords(t('about.p1a'))}{' '}
                <strong className={`font-semibold ${T.h}`}>{t('about.p1name')}</strong> {t('about.p1b')}{' '}
                <strong className={`font-semibold ${T.h}`}>{t('about.p1year')}</strong> {keepWords(t('about.p1c'))}
              </p>
              <p>{keepWords(t('about.p2'))}</p>
              <p>
                {t('about.p3a')}{' '}
                <strong className={`font-semibold ${T.accent}`}>{t('about.p3place')}</strong>
                {keepWords(t('about.p3b'))}
              </p>
            </RevealItem>

            {!featured && (
              <RevealItem className={`flex items-center gap-4 rounded-2xl p-5 ${T.card}`}>
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-theme-color-3 p-[3px]">
                  <TechPhoto isDark />
                </div>
                <div>
                  <p className={`font-bold ${T.h}`}>{t('tech.name')}</p>
                  <p className={`text-xs ${T.muted}`}>{t('tech.role')}</p>
                  <p className={`mt-1 text-xs font-semibold ${T.accent}`}>{t('about.journey')}</p>
                </div>
              </RevealItem>
            )}

            <RevealItem>
              <button onClick={() => setActive('inquiry')} className={`${CTA} mt-2`}>
                <ClipboardList size={14} />
                {t('about.book')}
              </button>
            </RevealItem>
          </RevealGroup>

          <div className="relative">
            <div aria-hidden="true" className="absolute bottom-6 left-[1.2rem] top-6 w-0.5 bg-gradient-to-b from-theme-color-3 via-theme-color-1 to-transparent" />
            <RevealGroup as="ol" className="space-y-5" stagger={0.1}>
              {timeline.map(({ year, title, body }) => (
                <RevealItem as="li" key={year} className="relative pl-14">
                  <span className="absolute left-0 top-5 grid h-10 w-10 place-items-center rounded-full bg-theme-color-1 shadow-md shadow-theme-color-4/15">
                    <span className="h-2.5 w-2.5 rounded-full bg-theme-color-2" />
                  </span>
                  <div className={`rounded-2xl p-5 transition duration-300 hover:-translate-y-0.5 ${T.card} ${T.cardHov}`}>
                    <p className="font-display text-2xl text-theme-color-3">{year}</p>
                    <h3 className={`mt-1 text-base font-bold ${T.h}`}>{title}</h3>
                    <p className={`mt-2 text-sm leading-loose ${T.body}`}>{keepWords(body)}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>

        <RevealGroup className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4" stagger={0.08}>
          {ABOUT_STATS.map(({ Icon }, i) => (
            <RevealItem key={stats[i]?.label || i} className={`rounded-2xl px-4 py-7 text-center ${T.feature}`}>
              <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl bg-theme-color-3">
                <Icon size={18} className="text-white" />
              </div>
              <p className="font-display text-3xl text-theme-gold">{stats[i]?.value}</p>
              <p className="mt-1 text-xs text-white">{stats[i]?.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// INQUIRY SECTION
// ─────────────────────────────────────────────────────────────────
const GUIDE_ICONS = [User, Tv, ClipboardList, Camera];

function InquirySection({ isDark }) {
  const { t, list } = useOfficial();
  const steps = list('inquiry.steps');
  const T = getT(isDark);

  return (
    <section className={`min-h-screen px-4 py-20 sm:py-28 ${T.sec}`}>
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <article className={`overflow-hidden rounded-[1.75rem] border p-6 shadow-md sm:p-10 ${T.card}`}>
            <SectionLabel T={T}>{t('nav.inquiry')}</SectionLabel>
            <SectionHeading T={T}>{t('inquiry.title')}</SectionHeading>
            <p className={`mt-4 text-sm leading-loose sm:text-base ${T.body}`}>
              {keepWords(t('inquiry.subtitle'))}
            </p>

            <ol className="mt-10 space-y-4">
              {steps.map((step, i) => {
                const Icon = GUIDE_ICONS[i] || ClipboardList;
                return (
                  <li key={step} className={`flex items-start gap-4 rounded-2xl border px-4 py-4 sm:px-5 ${T.soft}`}>
                    <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-theme-color-1 shadow-sm">
                      <Icon size={20} className="text-theme-color-2" />
                      <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-theme-color-3 text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                    </span>
                    <p className={`pt-2.5 text-sm font-semibold leading-snug sm:text-[15px] ${T.h}`}>
                      {keepWords(step)}
                    </p>
                  </li>
                );
              })}
            </ol>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <a
                href={LINKS.messenger}
                {...EXTERNAL}
                aria-label={t('inquiry.messengerAria')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0084FF] px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-black/10 transition hover:-translate-y-0.5 hover:brightness-110"
              >
                <MessengerIcon size={18} />
                <span>{keepWords(t('inquiry.messenger'))}</span>
              </a>
              <a
                href={LINKS.viber}
                {...EXTERNAL}
                aria-label={t('inquiry.viberAria')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7360F2] px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-black/10 transition hover:-translate-y-0.5 hover:brightness-110"
              >
                <ViberIcon size={18} />
                <span>{keepWords(t('inquiry.viber'))}</span>
              </a>
              <a
                href={LINKS.tel}
                aria-label={t('inquiry.callAria')}
                className={`${CTA} px-4 shadow-md shadow-black/10`}
              >
                <Phone size={16} />
                <span>{keepWords(t('inquiry.call'))}</span>
              </a>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// CONTACT SECTION
// ─────────────────────────────────────────────────────────────────
function ContactSection({ isDark }) {
  const { t, list } = useOfficial();
  const days = list('contact.days');
  const T = getT(isDark);
  return (
    <section className={`min-h-screen px-4 py-20 sm:py-28 ${T.altSec}`}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel T={T}>{t('contact.label')}</SectionLabel>
          <SectionHeading T={T}>
            {t('contact.title')}
            <span className="text-theme-color-3">{t('contact.titleEm')}</span>
            {t('contact.titleEnd')}
          </SectionHeading>
          <p className={`mt-4 max-w-lg text-sm leading-relaxed sm:text-base ${T.body}`}>
            {t('contact.body')}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">

          {/* ── Left: Details ── */}
          <RevealGroup className="space-y-4" stagger={0.1}>

            {/* Phone */}
            <RevealItem className={`rounded-2xl border p-6 ${T.card} ${T.cardHov}`}>
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-theme-color-1 shadow-sm">
                  <Phone size={17} className="text-theme-color-2" />
                </div>
                <p className={`text-sm font-bold ${T.h}`}>{t('contact.phones')}</p>
              </div>
              <div className="space-y-2">
                {[t('phone')].map((num) => (
                  <a
                    key={num}
                    href={`tel:${num.replace(/\s/g, '')}`}
                    className="neon-cta group flex items-center justify-between rounded-xl bg-theme-color-3 px-4 py-3 text-sm text-white shadow-sm hover:scale-[1.02]"
                  >
                    <span className="font-semibold">{num}</span>
                    <ArrowUpRight size={13} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                ))}
              </div>
            </RevealItem>

            {/* Hours */}
            <RevealItem className={`rounded-2xl border p-6 ${T.card} ${T.cardHov}`}>
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-theme-color-1 shadow-sm">
                  <Clock size={17} className="text-theme-color-2" />
                </div>
                <p className={`text-sm font-bold ${T.h}`}>{t('contact.hours')}</p>
              </div>
              <div className={`divide-y ${isDark ? 'divide-theme-color-2/10' : 'divide-theme-color-4/10'}`}>
                {days.map(({ day, time }, i) => {
                  const open = HOURS[i]?.open;
                  return (
                    <div key={day} className="flex items-center justify-between gap-4 py-2.5">
                      <span className={`text-xs ${T.muted}`}>{day}</span>
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${open ? 'bg-theme-color-1' : 'bg-theme-color-3'}`} />
                        <span className={`whitespace-nowrap text-xs font-semibold tabular-nums ${open ? T.h : 'text-theme-color-3'}`}>
                          {time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </RevealItem>

            {/* Address */}
            <RevealItem className={`rounded-2xl border p-6 ${T.card} ${T.cardHov}`}>
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-theme-color-1 shadow-sm">
                  <MapPin size={17} className="text-theme-color-2" />
                </div>
                <p className={`text-sm font-bold ${T.h}`}>{t('contact.address')}</p>
              </div>
              <p className={`whitespace-pre-line text-sm leading-relaxed ${T.body}`}>
                {t('contact.addressLines')}
              </p>
              <p className={`mt-3 text-[11px] ${T.muted}`}>
                {t('contact.previous')}
              </p>
            </RevealItem>

            {/* Facebook */}
            <RevealItem className={`rounded-2xl border p-6 ${T.card} ${T.cardHov}`}>
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#1877F2] shadow-sm">
                  <FacebookIcon size={19} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-bold ${T.h}`}>{t('contact.facebookTitle')}</p>
                  <p className={`truncate text-[11px] ${T.muted}`}>{t('contact.facebookHandle')}</p>
                </div>
              </div>
              <p className={`mb-4 text-sm leading-relaxed ${T.body}`}>{keepWords(t('contact.facebookBody'))}</p>
              <a
                href={LINKS.facebook}
                {...EXTERNAL}
                className="group flex items-center justify-between rounded-xl bg-theme-color-1 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:opacity-90"
              >
                <span className="inline-flex items-center gap-2">
                  <FacebookIcon size={16} />
                  {t('contact.facebookCta')}
                </span>
                <ArrowUpRight size={13} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </RevealItem>
          </RevealGroup>

          {/* ── Right: Stylized Map (whole panel opens Google Maps) ── */}
          <Reveal className="h-full">
          <a
            href={LINKS.maps}
            {...EXTERNAL}
            aria-label={t('contact.mapAria')}
            className="neon-card-dark group relative block min-h-[360px] h-full overflow-hidden rounded-2xl bg-theme-color-1 shadow-md shadow-theme-color-4/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-theme-color-3 lg:min-h-0"
          >
            {/* Map grid */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'linear-gradient(rgba(234,224,208,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(234,224,208,0.12) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            {/* Roads */}
            <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(234,224,208,0.3)" strokeWidth="2" />
              <line x1="30%" y1="0" x2="30%" y2="100%" stroke="rgba(234,224,208,0.22)" strokeWidth="1.5" />
              <line x1="70%" y1="0" x2="70%" y2="100%" stroke="rgba(234,224,208,0.22)" strokeWidth="1.5" />
              <line x1="0" y1="30%" x2="100%" y2="30%" stroke="rgba(234,224,208,0.14)" strokeWidth="1" />
              <line x1="0" y1="70%" x2="100%" y2="70%" stroke="rgba(234,224,208,0.14)" strokeWidth="1" />
              {/* Maydar Wee Market main road */}
              <line x1="0" y1="52%" x2="100%" y2="52%" stroke="rgba(174,112,87,0.85)" strokeWidth="7" strokeLinecap="round" />
            </svg>

            {/* Pin */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="relative">
                <div className="absolute -inset-4 animate-ping rounded-full bg-theme-color-3/30" />
                <div className="absolute -inset-2 rounded-full bg-theme-color-3/20" />
                <div className="relative grid h-14 w-14 place-items-center rounded-full border-4 border-theme-color-2 bg-theme-color-3 shadow-md">
                  <Tv size={22} className="text-white" />
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-theme-color-2 px-4 py-2.5 text-center shadow-md">
                <p className="text-xs font-extrabold text-theme-color-4">
                  {t('contact.mapName')}
                </p>
                <p className="text-[10px] font-semibold text-theme-color-4">{t('contact.mapPlace')}</p>
                <p className="text-[10px] text-theme-color-4/75">
                  {t('contact.mapArea')}
                </p>
              </div>
            </div>

            {/* Compass */}
            <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-theme-color-2 text-[11px] font-extrabold text-theme-color-4 shadow-sm">
              N
            </div>

            {/* Label */}
            <p className="absolute bottom-4 left-4 text-[9px] uppercase tracking-[0.15em] text-white/80">
              {t('contact.mapLabel')}
            </p>

            <span
              aria-hidden="true"
              className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-lg bg-theme-color-3 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition group-hover:scale-105 group-hover:opacity-90"
            >
              <MapPin size={13} />
              {t('contact.openMaps')}
              <ArrowUpRight size={12} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// FOOTER  (always dark for impact)
// ─────────────────────────────────────────────────────────────────
function Footer({ setActive }) {
  const { t, list } = useOfficial();
  const links = list('footer.links');
  const days = list('contact.days');
  return (
    <footer className="relative isolate overflow-hidden bg-theme-color-4 px-4 pb-28 pt-16 text-white md:pb-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1 bg-theme-color-3" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-theme-color-2/10 blur-3xl" />
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <button onClick={() => setActive('home')} className="group mb-5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-theme-color-3 shadow-md shadow-theme-color-4/20">
                <Tv size={18} className="text-white" />
              </div>
              <div className="text-left leading-none">
                <span className="block text-sm font-extrabold leading-snug text-theme-color-2">{t('nav.brand')}</span>
                <span className="block text-[11px] leading-snug text-white/80">{t('footer.service')}</span>
              </div>
            </button>
            <p className="max-w-xs text-sm leading-loose text-white/90">{keepWords(t('footer.blurb'))}</p>
            <a
              href={`tel:${t('phone')}`}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-theme-color-3 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-theme-color-4/20 transition hover:scale-105 hover:opacity-90"
            >
              <Phone size={14} />
              {t('phone')}
            </a>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold tracking-[0.16em] text-theme-color-2">{t('footer.navigation')}</p>
            <ul className="space-y-3">
              {NAV_TABS.map(({ id }) => (
                <li key={id}>
                  <button onClick={() => setActive(id)} className="text-sm text-white/90 transition hover:text-theme-color-2 hover:underline hover:underline-offset-4">
                    {t(`nav.${id}`)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold tracking-[0.16em] text-theme-color-2">{t('footer.services')}</p>
            <ul className="space-y-3">
              {links.map((s) => (
                <li key={s}>
                  <button onClick={() => setActive('services')} className="text-left text-sm text-white/90 transition hover:text-theme-color-2 hover:underline hover:underline-offset-4">
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold tracking-[0.16em] text-theme-color-2">{t('footer.contact')}</p>
            <ul className="space-y-3 text-sm text-white/90">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-1 shrink-0 text-theme-color-2" />
                <span>{keepWords(t('footer.address'))}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="shrink-0 text-theme-color-2" />
                <a href={`tel:${t('phone')}`} className="transition hover:text-theme-color-2">{t('phone')}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={15} className="mt-1 shrink-0 text-theme-color-2" />
                <dl className="space-y-1">
                  {days.map(({ day, time }, i) => (
                    <div key={day}>
                      <dt className="inline">
                        {day}
                        <span aria-hidden="true" className="px-1.5 text-white/50">·</span>
                      </dt>
                      <dd className={`inline whitespace-nowrap ${HOURS[i]?.open ? '' : 'font-semibold text-theme-color-2'}`}>{time}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 rounded-2xl border border-theme-color-2/15 bg-white/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-theme-color-2">{t('footer.connect')}</p>
            <p className="mt-1.5 text-sm text-white/85">{keepWords(t('footer.connectBody'))}</p>
          </div>
          <ul className="flex flex-wrap gap-3">
            <li>
              <a
                href={LINKS.facebook}
                {...EXTERNAL}
                aria-label={t('footer.social.facebookAria')}
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#1877F2] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-black/20 transition hover:-translate-y-0.5 hover:brightness-110"
              >
                <FacebookIcon size={18} />
                {t('footer.social.facebook')}
              </a>
            </li>
            <li>
              <a
                href={LINKS.viber}
                {...EXTERNAL}
                aria-label={t('footer.social.viberAria')}
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#7360F2] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-black/20 transition hover:-translate-y-0.5 hover:brightness-110"
              >
                <ViberIcon size={18} />
                {t('footer.social.viber')}
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-theme-color-2/20 pt-6 text-xs text-white/80">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} {t('footer.rights')}</p>
            <p className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-theme-color-3" />
              {t('footer.est')}
            </p>
          </div>
          <p className="max-w-3xl text-[10px] leading-relaxed text-white/55 sm:text-[11px]">
            {keepWords(t('brandsDisclaimer'))}
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────
// BACK BAR — shown on every inner page
// ─────────────────────────────────────────────────────────────────
function BackBar({ active, onBack, isDark, top }) {
  const { t } = useOfficial();
  const T = getT(isDark);
  return (
    <div
      style={{ top }}
      className={`sticky z-40 border-b shadow-sm backdrop-blur-md ${
        isDark ? 'border-theme-color-2/10 bg-theme-color-4/90' : 'border-theme-color-4/10 bg-theme-color-2/90'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2.5">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 rounded-xl bg-theme-color-1 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:scale-105 hover:opacity-90"
        >
          <ArrowLeft size={16} className="shrink-0 transition group-hover:-translate-x-0.5" />
          {t('nav.backHome')}
        </button>
        <nav aria-label={t('nav.breadcrumb')} className={`hidden items-center gap-1.5 text-xs sm:flex ${T.muted}`}>
          <button onClick={onBack} className="transition hover:underline hover:underline-offset-4">
            {t('nav.home')}
          </button>
          <ChevronRight size={12} aria-hidden="true" />
          <span aria-current="page" className={`font-semibold ${T.h}`}>{t(`nav.${active}`)}</span>
        </nav>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ROOT PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function SeinPanOfficialPage() {
  const { t } = useOfficial();
  const [activeTab, setActiveTabState] = useState(tabFromHash);
  const [isDark,    setIsDark]    = useState(false);

  // Each page gets its own history entry so the phone / browser back button
  // returns to the previous page instead of leaving the site.
  const setActiveTab = (id) => {
    if (id !== activeTab) {
      const { pathname, search } = window.location;
      window.history.pushState({ tab: id }, '', id === 'home' ? `${pathname}${search}` : `#${id}`);
      setActiveTabState(id);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // The fixed header's height changes with language and breakpoint, so measure it.
  const [headerH, setHeaderH] = useState(90);
  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return undefined;
    const update = () => setHeaderH(Math.ceil(header.getBoundingClientRect().height));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onPop = () => setActiveTabState(tabFromHash());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }, [activeTab]);

  const sp = { isDark, setActive: setActiveTab };

  const renderMain = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <HeroSection {...sp} />
            <TechnicianCard {...sp} />
            <AboutSection {...sp} featured />
            <BrandMarquee isDark={isDark} />
            <HomeServices {...sp} />
            <ProcessStrip {...sp} />
            <WhyChooseUs isDark={isDark} />
            <ClosingBand {...sp} />
          </>
        );
      case 'services':
        return <ServicesSection {...sp} />;
      case 'about':
        return <AboutSection {...sp} />;
      case 'inquiry':
        return <InquirySection isDark={isDark} />;
      case 'contact':
        return <ContactSection isDark={isDark} />;
      default:
        return <HeroSection {...sp} />;
    }
  };

  return (
    <div
      className={`min-h-screen antialiased ${getT(isDark).page}`}
    >
      <Navbar
        active={activeTab}
        setActive={setActiveTab}
        isDark={isDark}
        toggleTheme={() => setIsDark((v) => !v)}
      />

      {/* Scrollable content with navbar offset */}
      <main style={{ paddingTop: headerH }}>
        {activeTab !== 'home' && (
          <BackBar active={activeTab} onBack={() => setActiveTab('home')} isDark={isDark} top={headerH} />
        )}
        <div className="transition-colors duration-300">
          {renderMain()}
        </div>
      </main>

      <Footer setActive={setActiveTab} />

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-theme-color-2/15 bg-theme-color-1/95 shadow-[0_-4px_16px_rgba(104,44,44,0.12)] backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-5">
          {NAV_TABS.map(({ id, Icon }) => {
            const on = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                aria-current={on ? 'page' : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition ${on ? 'text-theme-color-2' : 'text-white/75'}`}
              >
                <Icon size={16} />
                {t(`nav.${id}`)}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
