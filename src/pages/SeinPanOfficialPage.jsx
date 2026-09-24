// src/pages/SeinPanOfficialPage.jsx
// ✦ Complete single-file official website for Sein Pan Electronic Service
// ✦ Dark / Light mode toggle  ✦ 7 sections  ✦ Compact colorful technician card
// ✦ Controlled inquiry form with validation  ✦ All icons verified for lucide-react@1.22

import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Tv, Wrench, MapPin, Phone, Clock, Award, Shield,
  Upload, CheckCircle, X, Menu, ChevronRight, ChevronDown,
  ArrowUpRight, Zap, Home, Info, ClipboardList, PhoneCall,
  Users, History, TrendingUp, BadgeCheck, Gauge, Sparkles,
  Monitor, Radio, Cpu, Sun, Moon, Lightbulb, Send, Quote,
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
      className={`flex overflow-hidden rounded-lg border text-[11px] font-bold ${
        isDark ? 'border-white/10' : 'border-slate-200'
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
          onClick={() => i18n.changeLanguage(code)}
          aria-pressed={lang === code}
          className={`px-2.5 py-2 transition ${
            lang === code
              ? 'bg-copper-500 text-pcb-950'
              : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-500 hover:text-slate-900'
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
    gradFrom: '#052017', gradTo: '#04211a',
    accentHex: '#22c06f',
    badgeCls: 'bg-pcb-500/20 text-pcb-300 border border-pcb-500/30',
    iconCls:  'bg-pcb-500/10 border-pcb-500/20 text-pcb-400',
    desc: 'Expert diagnosis and repair for all LED TV brands and sizes. From backlight failures to mainboard shorts, we restore full picture quality.',
    features: ['Backlight Strip Replacement', 'Main & Power Board Repair', 'Panel Crack Assessment', 'Firmware Reflash'],
  },
  {
    id: 'lcd', Icon: Tv,
    label: 'LCD TV Repair', badge: 'High Demand',
    gradFrom: '#3b1f05', gradTo: '#1a0d02',
    accentHex: '#d99f33',
    badgeCls: 'bg-copper-500/20 text-copper-300 border border-copper-500/30',
    iconCls:  'bg-copper-500/10 border-copper-500/20 text-copper-400',
    desc: 'Specialized LCD panel servicing with genuine components. Our 37+ years of hands-on experience means faster turnaround and lasting repairs.',
    features: ['Inverter & CCFL Board Fix', 'T-Con Board Replacement', 'Colour Calibration', 'Remote & IR Sensor Sync'],
  },
  {
    id: 'plasma', Icon: Radio,
    label: 'Plasma TV Repair', badge: 'Specialist',
    gradFrom: '#1e1030', gradTo: '#0f0a20',
    accentHex: '#a78bfa',
    badgeCls: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
    iconCls:  'bg-violet-500/10 border-violet-500/20 text-violet-400',
    desc: 'One of the few remaining service centres still expertly servicing vintage and modern plasma display units across Yangon.',
    features: ['Y & Z Sustain Board', 'Voltage Regulation Fix', 'Plasma Cell Diagnostics', 'High-voltage Safety Check'],
  },
];

const TIMELINE = [
  {
    year: '1989', title: 'The Beginning',
    yearCls: 'text-copper-400',
    dotBorder: 'border-copper-400', dotBg: 'bg-copper-500/20', dotFill: 'bg-copper-400',
    body: 'U Win Naing founded Sein Pan Electronic Service near the 14–15 junction, Yadanar Road, 12 Quarter, South Okkalapa — serving the neighbourhood with honest, skilled TV repair.',
  },
  {
    year: '2000s', title: 'Growing Reputation',
    yearCls: 'text-pcb-400',
    dotBorder: 'border-pcb-400', dotBg: 'bg-pcb-500/20', dotFill: 'bg-pcb-400',
    body: "Word spread across Yangon. Customers from neighbouring townships sought Sein Pan specifically for their LCD and Plasma sets — trusting only U Win Naing's hands.",
  },
  {
    year: 'Today', title: 'North Okkalapa — New Home',
    yearCls: 'text-pcb-300',
    dotBorder: 'border-pcb-300', dotBg: 'bg-pcb-400/20', dotFill: 'bg-pcb-300',
    body: 'Now operating near Maydar Wee Market (Maydarvi) in North Okkalapa township, serving an even wider community while preserving the same founding values: honesty, quality, and care.',
  },
];

const TECH_SKILLS = [
  { label: 'LED Technology',      cls: 'bg-pcb-500/20 text-pcb-300 border-pcb-500/30',          Icon: Monitor },
  { label: 'LCD Mastery',         cls: 'bg-amber-500/20 text-amber-300 border-amber-500/30',     Icon: Tv },
  { label: 'Plasma Systems',      cls: 'bg-violet-500/20 text-violet-300 border-violet-500/30',  Icon: Radio },
  { label: 'Circuit Diagnostics', cls: 'bg-blue-500/20 text-blue-300 border-blue-500/30',        Icon: Cpu },
  { label: 'Smart TV Firmware',   cls: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',        Icon: Lightbulb },
  { label: 'Component Soldering', cls: 'bg-orange-500/20 text-orange-300 border-orange-500/30',  Icon: Zap },
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

const HOURS = [
  { day: 'Monday – Friday', time: '8:00 AM – 6:00 PM', open: true },
  { day: 'Saturday',         time: '8:00 AM – 5:00 PM', open: true },
  { day: 'Sunday',           time: '9:00 AM – 2:00 PM', open: true },
];

const INQUIRY_STEPS = [
  { Icon: ClipboardList, title: 'Describe Your Issue',  body: 'Tell us your TV model and what\'s wrong — no technical knowledge needed.' },
  { Icon: Phone,          title: 'We Call You Back',     body: 'Our technician will call to confirm availability and provide an estimate.' },
  { Icon: Wrench,         title: 'We Fix It',            body: 'Drop off your set or arrange collection in North Okkalapa township.' },
];

const BRANDS = [
  'Samsung', 'LG', 'Sony', 'Panasonic', 'Toshiba', 'Sharp',
  'TCL', 'Hisense', 'Philips', 'Haier', 'Skyworth', 'Changhong',
];

const CTA =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-copper-500 px-7 py-3.5 text-sm font-bold text-pcb-950 shadow-glow transition hover:bg-copper-400 active:scale-[0.98]';

// ─────────────────────────────────────────────────────────────────
// THEME TOKENS
// ─────────────────────────────────────────────────────────────────
// Returns a frozen object of Tailwind class strings for the current theme.
function getT(isDark) {
  return Object.freeze({
    page:       isDark ? 'bg-ink text-slate-200'                 : 'bg-slate-50 text-slate-900',
    nav:        isDark ? 'bg-ink/90 border-white/5'              : 'bg-white/90 border-slate-200',
    sec:        isDark ? 'bg-ink-900'                            : 'bg-white',
    altSec:     isDark ? 'bg-forest-950'                         : 'bg-slate-100',
    card:       isDark ? 'border border-white/5 bg-white/[0.02]' : 'border border-slate-200 bg-white shadow-sm',
    cardHov:    isDark ? 'hover:border-pcb-500/20 hover:bg-white/[0.04]' : 'hover:border-pcb-500/30 hover:shadow-md',
    h:          isDark ? 'text-white'       : 'text-slate-900',
    body:       isDark ? 'text-slate-400'   : 'text-slate-600',
    muted:      isDark ? 'text-slate-500'   : 'text-slate-500',
    label:      isDark ? 'text-copper-400'  : 'text-copper-700',
    accent:     isDark ? 'text-pcb-400'     : 'text-pcb-600',
    div:        isDark ? 'border-white/5'   : 'border-slate-100',
    input: (err) =>
      `w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
        err
          ? isDark ? 'border-red-500/50 bg-red-500/5 text-white placeholder-slate-600'
                   : 'border-red-400 bg-red-50 text-slate-900 placeholder-slate-400'
          : isDark ? 'border-white/8 bg-white/[0.03] text-white placeholder-slate-600 focus:border-pcb-500/50 focus:bg-pcb-500/5'
                   : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-pcb-500 focus:ring-1 focus:ring-pcb-500/20'
      }`,
    tabActive:  'bg-pcb-500/15 text-pcb-300 border border-pcb-500/25',
    tabInact:   isDark ? 'text-slate-400 hover:text-white hover:bg-white/5'
                       : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
  });
}

// ─────────────────────────────────────────────────────────────────
// SECTION LABEL + HEADING (shared)
// ─────────────────────────────────────────────────────────────────
function SectionLabel({ children, T }) {
  return (
    <p className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${T.label}`}>
      {children}
    </p>
  );
}
function SectionHeading({ children, T }) {
  return (
    <h2 className={`font-display text-3xl font-normal leading-snug tracking-tight sm:text-5xl ${T.h}`}>{children}</h2>
  );
}

// ─────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────
function Navbar({ active, setActive, isDark, toggleTheme }) {
  const [open, setOpen] = useState(false);
  const { t } = useOfficial();
  const T = getT(isDark);
  const go = (id) => { setActive(id); setOpen(false); };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl ${T.nav}`}>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-copper-400/70 to-transparent" />
      <div className={`hidden border-b sm:block ${isDark ? 'border-white/5 bg-black/30' : 'border-slate-200 bg-slate-50'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-[11px] tracking-[0.08em]">
          <span className={T.muted}>{t('nav.utility')}</span>
          <a href={`tel:${t('phone')}`} className="font-semibold text-copper-400">{t('phone')}</a>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">

        {/* Logo */}
        <button onClick={() => go('home')} className="group flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg border border-pcb-500/30 bg-pcb-500/20 transition group-hover:bg-pcb-500/30">
            <Tv size={17} className="text-pcb-400" />
          </div>
          <div className="text-left leading-none">
            <span className={`block text-[13px] font-extrabold tracking-wide leading-snug ${T.h}`}>{t('nav.brand')}</span>
            <span className={`hidden text-[10px] uppercase tracking-[0.18em] leading-snug xl:block ${T.muted}`}>{t('nav.tagline')}</span>
          </div>
        </button>

        {/* Desktop tabs */}
        <nav className="hidden items-center gap-1 xl:flex">
          {NAV_TABS.map(({ id }) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium leading-snug transition-all duration-150 ${
                active === id ? T.tabActive : T.tabInact
              }`}
            >
              {t(`nav.${id}`)}
            </button>
          ))}
        </nav>

        {/* Right: Theme toggle + Book + Hamburger */}
        <div className="flex items-center gap-2">
          {/* Dark / Light toggle */}
          <button
            onClick={toggleTheme}
            className={`grid h-9 w-9 place-items-center rounded-lg border transition ${
              isDark
                ? 'border-white/8 bg-white/[0.04] text-slate-400 hover:text-amber-400 hover:border-amber-400/30'
                : 'border-slate-200 bg-white text-slate-500 hover:text-amber-600 hover:border-amber-400/50 shadow-sm'
            }`}
            aria-label={t('nav.toggleTheme')}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <LangToggle isDark={isDark} />

          {/* Book Repair CTA (desktop) */}
          <button
            onClick={() => go('inquiry')}
            className="hidden items-center gap-2 whitespace-nowrap rounded-xl bg-copper-500 px-4 py-2 text-sm font-bold leading-snug text-pcb-950 shadow-glow transition hover:bg-copper-400 active:scale-95 xl:flex"
          >
            <Wrench size={14} />
            {t('nav.bookRepair')}
          </button>

          {/* Hamburger (mobile) */}
          <button
            className={`grid h-9 w-9 place-items-center rounded-lg border transition xl:hidden ${
              isDark ? 'border-white/8 text-slate-400 hover:bg-white/5 hover:text-white'
                     : 'border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
            onClick={() => setOpen((v) => !v)}
            aria-label={t('nav.toggleMenu')}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className={`border-t px-4 pb-4 pt-2 xl:hidden ${isDark ? 'bg-ink-900 border-white/5' : 'bg-white border-slate-100'}`}>
          <div className="space-y-1">
            {NAV_TABS.map(({ id, Icon }) => (
              <button
                key={id}
                onClick={() => go(id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active === id ? T.tabActive : T.tabInact
                }`}
              >
                <Icon size={16} />
                {t(`nav.${id}`)}
              </button>
            ))}
          </div>
          <button
            onClick={() => go('inquiry')}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-pcb-500 py-3 text-sm font-semibold text-white transition hover:bg-pcb-400"
          >
            <Wrench size={14} />
            {t('nav.bookARepair')}
          </button>
        </div>
      )}
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────────────────────────
function HeroSection({ setActive }) {
  const { t, list } = useOfficial();
  const stats = list('hero.stats');
  return (
    <section className="relative overflow-hidden bg-forest-950 lg:flex lg:min-h-[88vh] lg:items-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(15,157,88,0.2) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div className="pointer-events-none absolute -top-32 right-0 h-[520px] w-[520px] rounded-full bg-pcb-800/40 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-copper-900/30 blur-3xl" />

      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-50" viewBox="0 0 1200 700" fill="none" aria-hidden="true">
        <path d="M-20 180 H280 V320 H520 V140 H820 V360 H1220" stroke="rgba(200,134,42,0.35)" strokeWidth="1.2" strokeDasharray="8 10" className="animate-trace" />
        <path d="M-20 480 H180 V260 H460 V520 H760 V300 H1220" stroke="rgba(34,192,111,0.28)" strokeWidth="1.2" strokeDasharray="6 12" className="animate-trace" />
        <circle cx="280" cy="180" r="3.5" fill="#e4b75a" />
        <circle cx="520" cy="320" r="3.5" fill="#22c06f" />
        <circle cx="820" cy="140" r="3.5" fill="#e4b75a" />
        <circle cx="460" cy="520" r="3.5" fill="#22c06f" />
      </svg>

      <div className="relative mx-auto grid w-full max-w-6xl items-end gap-10 px-4 pb-10 pt-24 sm:pt-32 lg:grid-cols-[1.15fr_0.85fr] lg:pb-16">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-copper-500/40 bg-copper-500/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-pcb-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-copper-300">
              {t('hero.eyebrow')}
            </span>
          </div>

          <p className="font-display text-lg italic text-copper-300 sm:text-xl">{t('hero.since')}</p>
          <h1 className="mt-2 max-w-3xl font-display text-[2.15rem] leading-[1.2] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t('hero.title')}
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-400 sm:mt-6 sm:text-lg">
            {t('hero.body')}
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
            <button onClick={() => setActive('inquiry')} className={CTA}>
              <ClipboardList size={15} />
              {t('hero.quote')}
              <ArrowUpRight size={14} />
            </button>
            <a
              href={`tel:${t('phone')}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-copper-400/40"
            >
              <Phone size={14} />
              {t('phone')}
            </a>
            <button
              onClick={() => setActive('services')}
              className="inline-flex items-center justify-center gap-2 px-2 py-3.5 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {t('hero.explore')}
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
            <span className="inline-flex items-center gap-1.5"><Shield size={12} className="text-pcb-400" /> {t('hero.genuine')}</span>
            <span className="inline-flex items-center gap-1.5"><Clock size={12} className="text-copper-400" /> {t('hero.sameDay')}</span>
            <span className="inline-flex items-center gap-1.5"><BadgeCheck size={12} className="text-pcb-300" /> {t('hero.noFee')}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md"
            >
              <p className="font-display text-4xl text-copper-300 sm:text-5xl">{value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandMarquee() {
  const { t } = useOfficial();
  const row = [...BRANDS, ...BRANDS];
  return (
    <div className="overflow-hidden border-y border-white/5 bg-ink py-4">
      <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">
        {t('brandsLabel')}
      </p>
      <div className="flex w-max animate-marquee gap-10">
        {row.map((brand, i) => (
          <span key={`${brand}-${i}`} className="text-sm font-semibold tracking-[0.18em] text-slate-500">
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
}

function HomeServices({ setActive, isDark }) {
  const { t } = useOfficial();
  const T = getT(isDark);
  return (
    <section className={`px-4 py-20 ${T.sec}`}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <SectionLabel T={T}>{t('homeServices.label')}</SectionLabel>
            <SectionHeading T={T}>
              {t('homeServices.title')} <span className="font-display italic text-copper-400">{t('homeServices.titleEm')}</span>
            </SectionHeading>
          </div>
          <button onClick={() => setActive('services')} className={`text-sm font-semibold ${T.accent}`}>
            {t('homeServices.all')}
          </button>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {SERVICES.map((svc) => (
            <button
              key={svc.id}
              onClick={() => setActive('services')}
              className={`group rounded-3xl border p-6 text-left transition duration-300 ${T.card} ${T.cardHov}`}
            >
              <div className="flex items-center justify-between">
                <div className={`grid h-12 w-12 place-items-center rounded-2xl border ${svc.iconCls}`}>
                  <svc.Icon size={20} />
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${svc.badgeCls}`}>
                  {t(`services.${svc.id}.badge`)}
                </span>
              </div>
              <h3 className={`mt-6 font-display text-3xl ${T.h}`}>{t(`services.${svc.id}.short`)}</h3>
              <p className={`mt-3 text-sm leading-relaxed ${T.body}`}>{t(`services.${svc.id}.desc`)}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-copper-400">
                {t('homeServices.seeList')} <ArrowUpRight size={12} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessStrip({ setActive, isDark }) {
  const { t, list } = useOfficial();
  const steps = list('process.steps');
  const T = getT(isDark);
  return (
    <section className={`px-4 py-16 ${T.altSec}`}>
      <div className="mx-auto max-w-6xl">
        <SectionLabel T={T}>{t('process.label')}</SectionLabel>
        <SectionHeading T={T}>{t('process.title')}</SectionHeading>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map(({ title, body }, i) => {
            const Icon = INQUIRY_STEPS[i]?.Icon || ClipboardList;
            return (
            <div key={title} className={`rounded-3xl border p-6 ${T.card}`}>
              <p className="font-display text-4xl text-copper-400">0{i + 1}</p>
              <div className="mt-4 grid h-10 w-10 place-items-center rounded-xl border border-pcb-500/25 bg-pcb-500/10">
                <Icon size={16} className="text-pcb-400" />
              </div>
              <h3 className={`mt-4 text-base font-bold ${T.h}`}>{title}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${T.body}`}>{body}</p>
            </div>
          );
          })}
        </div>
        <button onClick={() => setActive('inquiry')} className={`${CTA} mt-8`}>
          {t('process.start')}
          <ArrowUpRight size={14} />
        </button>
      </div>
    </section>
  );
}

function Testimonials({ isDark }) {
  const { t, list } = useOfficial();
  const items = list('testimonials.items');
  const T = getT(isDark);
  return (
    <section className={`px-4 py-20 ${T.sec}`}>
      <div className="mx-auto max-w-6xl">
        <SectionLabel T={T}>{t('testimonials.label')}</SectionLabel>
        <SectionHeading T={T}>{t('testimonials.title')}</SectionHeading>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {items.map(({ name, area, quote }) => (
            <figure key={name} className={`flex flex-col rounded-3xl border p-6 ${T.card}`}>
              <Quote size={18} className="text-copper-400" />
              <blockquote className={`mt-4 flex-1 text-sm leading-relaxed ${T.body}`}>&ldquo;{quote}&rdquo;</blockquote>
              <figcaption className={`mt-6 border-t pt-4 ${T.div}`}>
                <p className={`text-sm font-semibold ${T.h}`}>{name}</p>
                <p className={`text-[11px] uppercase tracking-[0.14em] ${T.muted}`}>{area}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingBand({ setActive }) {
  const { t } = useOfficial();
  return (
    <section className="px-4 pb-16">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-copper-500/25 bg-forest-950 px-6 py-12 sm:px-12">
        <div className="pointer-events-none absolute -right-10 top-0 h-48 w-48 rounded-full bg-copper-500/20 blur-3xl" />
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-copper-300">{t('closing.label')}</p>
        <h2 className="mt-3 max-w-xl font-display text-4xl leading-tight text-white sm:text-5xl">
          {t('closing.title')}
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-400">
          {t('closing.body')}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => setActive('inquiry')} className={CTA}>
            {t('closing.submit')}
          </button>
          <a href={`tel:${t('phone')}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 text-sm font-semibold text-white">
            <Phone size={14} />
            {t('phone')}
          </a>
        </div>
      </div>
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
            ? 'linear-gradient(135deg, #073123, #04211a)'
            : 'linear-gradient(135deg, #d1fae5, #ecfdf5)',
        }}
      >
        <span
          style={{
            background: 'linear-gradient(135deg, #22c06f, #d99f33)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          UW
        </span>
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
  const T = getT(isDark);
  return (
    <section className={`px-4 py-10 ${T.altSec}`}>
      <div className="mx-auto max-w-6xl">
        <div
          className="relative overflow-hidden rounded-3xl border"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #073123 0%, #04211a 45%, #05080a 100%)'
              : 'linear-gradient(135deg, #eafff3 0%, #f0fdf4 50%, #f8fafc 100%)',
            borderColor: isDark ? 'rgba(15,157,88,0.18)' : 'rgba(15,157,88,0.25)',
          }}
        >
          {/* PCB circuit decoration */}
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(15,157,88,0.25) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          />
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-pcb-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 left-1/3 h-40 w-40 rounded-full bg-copper-500/10 blur-2xl" />

          <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-3 lg:gap-8 lg:items-center">

            {/* ── Col 1: Avatar + identity ── */}
            <div className="flex items-center gap-5">
              {/* Avatar ring with real photo */}
              <div className="relative flex-shrink-0">
                <div
                  className="h-20 w-20 overflow-hidden rounded-2xl p-[3px]"
                  style={{
                    background: 'conic-gradient(from 0deg, #0f9d58, #d99f33, #a78bfa, #22d3ee, #0f9d58)',
                  }}
                >
                  <TechPhoto isDark={isDark} />
                </div>
                {/* Online indicator */}
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-forest-950 bg-pcb-500">
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
              </div>

              <div>
                <p className={`text-lg font-extrabold leading-tight ${T.h}`}>{t('tech.name')}</p>
                <p className="mt-0.5 text-xs font-semibold text-copper-400">
                  {t('tech.role')}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-pcb-500/30 bg-pcb-500/15 px-2.5 py-0.5">
                  <BadgeCheck size={11} className="text-pcb-400" />
                  <span className="text-[10px] font-bold text-pcb-300">{t('tech.years')}</span>
                </div>
              </div>
            </div>

            {/* ── Col 2: Skills grid ── */}
            <div>
              <p className={`mb-3 text-[10px] font-bold uppercase tracking-[0.14em] ${T.muted}`}>
                {t('tech.skillsLabel')}
              </p>
              <div className="flex flex-wrap gap-2">
                {TECH_SKILLS.map(({ cls, Icon }, i) => (
                  <span
                    key={skills[i] || i}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${cls}`}
                  >
                    <Icon size={10} />
                    {skills[i]}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Col 3: Mini stats + CTA ── */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: '5K+',  label: t('tech.repaired'), color: 'text-pcb-400' },
                  { value: '37',   label: t('tech.yearsShort'), color: 'text-copper-400' },
                  { value: '100%', label: t('tech.genuine'), color: 'text-violet-400' },
                ].map(({ value, label, color }) => (
                  <div
                    key={label}
                    className={`rounded-xl border p-3 text-center ${T.card}`}
                  >
                    <p className={`text-lg font-extrabold ${color}`}>{value}</p>
                    <p className={`mt-0.5 text-[9px] uppercase tracking-wider ${T.muted}`}>{label}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActive('about')}
                className="flex items-center justify-center gap-2 rounded-xl border border-pcb-500/30 bg-pcb-500/10 py-2.5 text-sm font-semibold text-pcb-300 transition hover:bg-pcb-500/20 hover:text-pcb-200"
              >
                <Info size={14} />
                {t('tech.story')}
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
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
    <section className={`min-h-screen px-4 py-20 sm:py-28 ${T.sec}`}>
      <div className="mx-auto max-w-6xl">
        <SectionLabel T={T}>{t('services.pageLabel')}</SectionLabel>
        <SectionHeading T={T}>
          {t('services.pageTitle')}{' '}
          <span className="text-pcb-400">{t('services.pageTitleEm')}</span>
        </SectionHeading>
        <p className={`mt-4 max-w-lg text-sm leading-relaxed sm:text-base ${T.body}`}>
          {t('services.pageBody')}
        </p>

        {/* Service cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((svc) => {
            const isOpen = expanded === svc.id;
            const features = list(`services.${svc.id}.features`);
            return (
              <div
                key={svc.id}
                className={`group flex flex-col rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${T.card} ${T.cardHov}`}
                onClick={() => setExpanded(isOpen ? null : svc.id)}
                style={{
                  background: isDark
                    ? `linear-gradient(160deg, ${svc.gradFrom}, ${svc.gradTo})`
                    : undefined,
                }}
              >
                {/* Colour accent bar */}
                <div
                  className="h-1 w-full"
                  style={{ background: `linear-gradient(90deg, ${svc.accentHex}88, transparent)` }}
                />

                <div className="flex flex-col flex-1 p-6">
                  {/* Icon + Badge */}
                  <div className="flex items-start justify-between">
                    <div className={`grid h-12 w-12 place-items-center rounded-xl border transition group-hover:opacity-90 ${svc.iconCls}`}>
                      <svc.Icon size={22} />
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${svc.badgeCls}`}>
                      {t(`services.${svc.id}.badge`)}
                    </span>
                  </div>

                  <h3 className={`mt-4 text-lg font-bold ${T.h}`}>{t(`services.${svc.id}.label`)}</h3>
                  <p className={`mt-2 flex-1 text-sm leading-relaxed ${T.body}`}>{t(`services.${svc.id}.desc`)}</p>

                  {/* Expand toggle */}
                  <button
                    className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-pcb-400 transition hover:text-pcb-300"
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
                        <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle size={12} className="shrink-0 text-pcb-500" />
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
              <Icon size={14} className="text-copper-400" />
              <span className={`text-xs font-medium ${T.body}`}>{trust[i]}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setActive('inquiry')}
            className="inline-flex items-center gap-2 rounded-xl bg-pcb-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-pcb-900/30 transition hover:bg-pcb-400 active:scale-95"
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
function AboutSection({ isDark, setActive }) {
  const { t, list } = useOfficial();
  const timeline = list('about.timeline');
  const stats = list('about.stats');
  const T = getT(isDark);
  return (
    <section className={`min-h-screen relative overflow-hidden px-4 py-20 sm:py-28 ${T.altSec}`}>
      {/* Ambient glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-pcb-900/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-copper-900/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">

          {/* ── Left: Story ── */}
          <div>
            <SectionLabel T={T}>{t('about.label')}</SectionLabel>
            <SectionHeading T={T}>
              {t('about.title')}{' '}
              <span className="text-copper-400">{t('about.titleTrust')}</span> &amp; {t('about.titleSkill')}
            </SectionHeading>

            <div className={`mt-5 space-y-3 text-sm leading-relaxed sm:text-base ${T.body}`}>
              <p>
                {t('about.p1a')}{' '}
                <strong className={`font-semibold ${T.h}`}>{t('about.p1name')}</strong> {t('about.p1b')}{' '}
                <strong className={`font-semibold ${T.h}`}>{t('about.p1year')}</strong> {t('about.p1c')}
              </p>
              <p>{t('about.p2')}</p>
              <p>
                {t('about.p3a')}{' '}
                <strong className="font-semibold text-pcb-400">{t('about.p3place')}</strong>
                {t('about.p3b')}
              </p>
            </div>

            {/* Founder card (compact, colourful) */}
            <div
              className="mt-8 relative overflow-hidden rounded-2xl border p-5"
              style={{
                borderColor: isDark ? 'rgba(200,134,42,0.25)' : 'rgba(200,134,42,0.35)',
                background: isDark
                  ? 'linear-gradient(135deg, rgba(59,31,5,0.6), rgba(10,15,18,0.8))'
                  : 'linear-gradient(135deg, #fef3c7, #fffbeb)',
              }}
            >
              <div
                className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full blur-2xl"
                style={{ background: 'radial-gradient(circle, rgba(200,134,42,0.2), transparent)' }}
              />
              <div className="relative flex items-center gap-4">
                {/* Avatar */}
                <div
                  className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-copper-500/30 text-lg font-extrabold"
                  style={{
                    background: isDark
                      ? 'linear-gradient(135deg, rgba(200,134,42,0.25), rgba(200,134,42,0.1))'
                      : 'linear-gradient(135deg, #fde68a, #fcd34d)',
                  }}
                >
                  <span style={{
                    background: 'linear-gradient(135deg, #d99f33, #c8862a)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    UW
                  </span>
                </div>
                <div>
                  <p className={`font-extrabold ${T.h}`}>{t('tech.name')}</p>
                  <p className={`text-xs ${T.muted}`}>{t('tech.role')}</p>
                  <p className="mt-1 text-[11px] font-semibold text-copper-400">
                    {t('about.journey')}
                  </p>
                  <p className={`mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] ${T.muted}`}>{t('about.master')}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActive('inquiry')}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-pcb-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-pcb-400 active:scale-95"
            >
              <ClipboardList size={14} />
              {t('about.book')}
            </button>
          </div>

          {/* ── Right: Timeline ── */}
          <div className="relative">
            <div className={`absolute left-5 top-4 bottom-4 w-px ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
            <div className="space-y-8 pl-14">
              {timeline.map(({ year, title, body }, i) => {
                const meta = TIMELINE[i] || TIMELINE[0];
                return (
                <div key={year} className="relative">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-9 top-0.5 grid h-8 w-8 place-items-center rounded-full border-2 ${meta.dotBorder} ${meta.dotBg}`}
                  >
                    <div className={`h-2.5 w-2.5 rounded-full ${meta.dotFill}`} />
                  </div>
                  <p className={`text-xs font-bold uppercase tracking-[0.15em] ${meta.yearCls}`}>{year}</p>
                  <h3 className={`mt-1 text-base font-bold ${T.h}`}>{title}</h3>
                  <p className={`mt-1.5 text-sm leading-relaxed ${T.body}`}>{body}</p>
                </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {ABOUT_STATS.map(({ Icon }, i) => (
            <div key={stats[i]?.label || i} className={`rounded-xl border px-4 py-5 text-center ${T.card}`}>
              <Icon size={20} className="mx-auto mb-2 text-copper-500" />
              <p className={`text-2xl font-extrabold ${T.h}`}>{stats[i]?.value}</p>
              <p className={`mt-0.5 text-[10px] uppercase tracking-wider ${T.muted}`}>{stats[i]?.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// INQUIRY SECTION
// ─────────────────────────────────────────────────────────────────
const INITIAL_FORM = { fullName: '', phone: '', tvBrand: '', tvModel: '', issue: '', file: null };

function InquirySection({ isDark }) {
  const [form, setForm]       = useState(INITIAL_FORM);
  const [errors, setErrors]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef(null);
  const { t, list } = useOfficial();
  const steps = list('process.steps');
  const tags = list('inquiry.tags');
  const T = getT(isDark);

  function validate() {
    const e = {};
    if (!form.fullName.trim())  e.fullName = t('inquiry.errName');
    if (!form.phone.trim())     e.phone = t('inquiry.errPhone');
    else if (!/^[0-9+()\-\s]{7,}$/.test(form.phone.trim()))
      e.phone = t('inquiry.errPhoneInvalid');
    if (!form.tvBrand.trim())   e.tvBrand = t('inquiry.errBrand');
    if (!form.issue.trim())     e.issue = t('inquiry.errIssue');
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitted(true);
  }

  function handleChange(field, val) {
    setForm((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  }

  function resetForm() {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitted(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <section className={`min-h-screen px-4 py-20 sm:py-28 ${T.sec}`}>
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">

          {/* ── Left: intro ── */}
          <div>
            <SectionLabel T={T}>{t('inquiry.label')}</SectionLabel>
            <SectionHeading T={T}>
              {t('inquiry.title')}{' '}
              <span className="text-pcb-400">{t('inquiry.titleEm')}</span> {t('inquiry.titleEnd')}
            </SectionHeading>
            <p className={`mt-4 text-sm leading-relaxed sm:text-base ${T.body}`}>
              {t('inquiry.bodyBefore')}{' '}
              <strong className={`font-semibold ${T.h}`}>{t('inquiry.bodyHours')}</strong>{' '}
              {t('inquiry.bodyAfter')}
            </p>

            <div className="mt-8 space-y-5">
              {steps.map(({ title, body }, i) => {
                const Icon = INQUIRY_STEPS[i]?.Icon || ClipboardList;
                return (
                <div key={title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-pcb-500/20 bg-pcb-500/10">
                      <Icon size={15} className="text-pcb-400" />
                    </div>
                    {i < INQUIRY_STEPS.length - 1 && (
                      <div className={`mt-2 w-px flex-1 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
                    )}
                  </div>
                  <div className="pb-5">
                    <p className={`text-sm font-bold ${T.h}`}>{title}</p>
                    <p className={`mt-0.5 text-xs ${T.body}`}>{body}</p>
                  </div>
                </div>
                );
              })}
            </div>

            {/* Feature pills */}
            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-pcb-500/25 bg-pcb-500/10 px-3 py-1 text-[11px] font-semibold text-pcb-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: form ── */}
          <div className={`rounded-2xl border p-6 sm:p-8 ${T.card}`}>
            <h3 className={`mb-6 text-lg font-bold ${T.h}`}>{t('inquiry.formTitle')}</h3>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Full Name */}
              <div>
                <label className={`mb-1.5 block text-xs font-semibold ${T.muted}`}>
                  {t('inquiry.fullName')} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t('inquiry.fullNamePh')}
                  value={form.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className={T.input(errors.fullName)}
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className={`mb-1.5 block text-xs font-semibold ${T.muted}`}>
                  {t('inquiry.phone')} <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  placeholder={t('inquiry.phonePh')}
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={T.input(errors.phone)}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
              </div>

              {/* Brand + Model */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`mb-1.5 block text-xs font-semibold ${T.muted}`}>
                    {t('inquiry.brand')} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={t('inquiry.brandPh')}
                    value={form.tvBrand}
                    onChange={(e) => handleChange('tvBrand', e.target.value)}
                    className={T.input(errors.tvBrand)}
                  />
                  {errors.tvBrand && <p className="mt-1 text-xs text-red-400">{errors.tvBrand}</p>}
                </div>
                <div>
                  <label className={`mb-1.5 block text-xs font-semibold ${T.muted}`}>
                    {t('inquiry.model')} <span className={`font-normal ${T.muted}`}>{t('inquiry.optional')}</span>
                  </label>
                  <input
                    type="text"
                    placeholder={t('inquiry.modelPh')}
                    value={form.tvModel}
                    onChange={(e) => handleChange('tvModel', e.target.value)}
                    className={T.input(false)}
                  />
                </div>
              </div>

              {/* Issue */}
              <div>
                <label className={`mb-1.5 block text-xs font-semibold ${T.muted}`}>
                  {t('inquiry.issue')} <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder={t('inquiry.issuePh')}
                  value={form.issue}
                  onChange={(e) => handleChange('issue', e.target.value)}
                  className={`${T.input(errors.issue)} resize-none`}
                />
                {errors.issue && <p className="mt-1 text-xs text-red-400">{errors.issue}</p>}
              </div>

              {/* File upload */}
              <div>
                <label className={`mb-1.5 block text-xs font-semibold ${T.muted}`}>
                  {t('inquiry.photo')}{' '}
                  <span className={`font-normal ${T.muted}`}>{t('inquiry.photoHint')}</span>
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleChange('file', e.target.files?.[0] ?? null)}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-4 text-xs font-medium transition ${
                    isDark
                      ? 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-pcb-500/30 hover:text-pcb-300'
                      : 'border-slate-300 bg-slate-50 text-slate-500 hover:border-pcb-500/40 hover:text-pcb-600'
                  }`}
                >
                  <Upload size={14} />
                  {form.file ? form.file.name : t('inquiry.upload')}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl bg-copper-500 px-6 py-3.5 text-sm font-bold text-pcb-950 shadow-glow transition hover:bg-copper-400 active:scale-[0.98]"
              >
                {t('inquiry.submit')}
              </button>

              <p className={`text-center text-[10px] ${T.muted}`}>
                {t('inquiry.note')}
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* ── Success Modal ── */}
      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border p-8 text-center"
            style={{
              background: isDark ? '#0a0f12' : '#ffffff',
              borderColor: isDark ? 'rgba(15,157,88,0.25)' : 'rgba(15,157,88,0.35)',
            }}
          >
            {/* Top accent bar */}
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-pcb-500 via-copper-400 to-pcb-500" />

            <button
              onClick={resetForm}
              className={`absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg transition ${
                isDark ? 'text-slate-500 hover:bg-white/5 hover:text-white' : 'text-slate-400 hover:bg-slate-100'
              }`}
            >
              <X size={16} />
            </button>

            {/* Success icon */}
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-pcb-500/30 bg-pcb-500/15">
              <CheckCircle size={32} className="text-pcb-400" />
            </div>

            <h3 className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('inquiry.successTitle')}
            </h3>
            <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {t('inquiry.thanks')}{' '}
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>{form.fullName}</strong>.{' '}
              {t('inquiry.received')}{' '}
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>{form.tvBrand}</strong>{' '}
              {t('inquiry.tvWord')}{' '}
              {t('inquiry.callAt')}{' '}
              <strong className="text-pcb-400">{form.phone}</strong> {t('inquiry.within')}
            </p>

            {/* Summary table */}
            <div
              className={`mt-5 rounded-xl border px-4 py-3 text-left text-xs ${
                isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50'
              }`}
            >
              <p className={`mb-2 text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {t('inquiry.summary')}
              </p>
              {[
                { k: t('inquiry.sumName'),  v: form.fullName },
                { k: t('inquiry.sumPhone'), v: form.phone },
                { k: t('inquiry.sumTv'),    v: `${form.tvBrand} ${form.tvModel}`.trim() },
                { k: t('inquiry.sumPhoto'), v: form.file ? form.file.name : t('inquiry.noPhoto') },
              ].map(({ k, v }) => (
                <div key={k} className={`flex justify-between py-1 ${isDark ? 'border-b border-white/[0.04]' : 'border-b border-slate-100'} last:border-0`}>
                  <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{k}</span>
                  <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} max-w-[55%] truncate`}>{v}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={resetForm}
                className="flex-1 rounded-xl border border-pcb-500/30 py-3 text-sm font-semibold text-pcb-400 transition hover:bg-pcb-500/10"
              >
                {t('inquiry.another')}
              </button>
              <button
                onClick={() => setSubmitted(false)}
                className="flex-1 rounded-xl bg-pcb-500 py-3 text-sm font-bold text-white transition hover:bg-pcb-400"
              >
                {t('inquiry.close')}
              </button>
            </div>
          </div>
        </div>
      )}
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
        <SectionLabel T={T}>{t('contact.label')}</SectionLabel>
        <SectionHeading T={T}>
          {t('contact.title')}{' '}
          <span className="text-copper-400">{t('contact.titleEm')}</span>
        </SectionHeading>
        <p className={`mt-4 max-w-lg text-sm leading-relaxed sm:text-base ${T.body}`}>
          {t('contact.body')}
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">

          {/* ── Left: Details ── */}
          <div className="space-y-4">

            {/* Phone */}
            <div className={`rounded-2xl border p-6 ${T.card}`}>
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-pcb-500/20 bg-pcb-500/10">
                  <Phone size={17} className="text-pcb-400" />
                </div>
                <p className={`text-sm font-bold ${T.h}`}>{t('contact.phones')}</p>
              </div>
              <div className="space-y-2">
                {[t('phone')].map((num) => (
                  <a
                    key={num}
                    href={`tel:${num.replace(/\s/g, '')}`}
                    className={`group flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                      isDark
                        ? 'border-white/5 bg-white/[0.02] text-slate-300 hover:border-pcb-500/25 hover:text-pcb-300'
                        : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-pcb-500/30 hover:text-pcb-600'
                    }`}
                  >
                    <span className="font-medium">{num}</span>
                    <ArrowUpRight size={13} className="text-slate-500 transition group-hover:text-pcb-400" />
                  </a>
                ))}
              </div>
            </div>

            {/* Hours */}
            <div className={`rounded-2xl border p-6 ${T.card}`}>
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-copper-500/20 bg-copper-500/10">
                  <Clock size={17} className="text-copper-400" />
                </div>
                <p className={`text-sm font-bold ${T.h}`}>{t('contact.hours')}</p>
              </div>
              <div className={`divide-y ${isDark ? 'divide-white/[0.04]' : 'divide-slate-100'}`}>
                {days.map(({ day, time }, i) => (
                  <div key={day} className="flex items-center justify-between py-2.5">
                    <span className={`text-xs ${T.muted}`}>{day}</span>
                    <div className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${HOURS[i]?.open ? 'bg-pcb-400' : 'bg-red-400'}`} />
                      <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className={`rounded-2xl border p-6 ${T.card}`}>
              <div className="mb-4 flex items-center gap-3">
                <div className={`grid h-10 w-10 place-items-center rounded-xl border ${
                  isDark ? 'border-slate-500/20 bg-slate-500/10' : 'border-slate-200 bg-slate-100'
                }`}>
                  <MapPin size={17} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                </div>
                <p className={`text-sm font-bold ${T.h}`}>{t('contact.address')}</p>
              </div>
              <p className={`whitespace-pre-line text-sm leading-relaxed ${T.body}`}>
                {t('contact.addressLines')}
              </p>
              <p className={`mt-3 text-[11px] ${T.muted}`}>
                {t('contact.previous')}
              </p>
            </div>
          </div>

          {/* ── Right: Stylized Map ── */}
          <div
            className="relative min-h-[360px] overflow-hidden rounded-2xl border lg:min-h-0"
            style={{
              background: isDark
                ? 'linear-gradient(160deg, #022014, #05080a)'
                : 'linear-gradient(160deg, #ecfdf5, #f8fafc)',
              borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#d1d5db',
            }}
          >
            {/* Map grid */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(${isDark ? 'rgba(148,163,184,0.04)' : 'rgba(148,163,184,0.15)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(148,163,184,0.04)' : 'rgba(148,163,184,0.15)'} 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}
            />

            {/* Roads */}
            <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(15,157,88,0.14)" strokeWidth="2" />
              <line x1="30%" y1="0" x2="30%" y2="100%" stroke="rgba(15,157,88,0.10)" strokeWidth="1.5" />
              <line x1="70%" y1="0" x2="70%" y2="100%" stroke="rgba(15,157,88,0.10)" strokeWidth="1.5" />
              <line x1="0" y1="30%" x2="100%" y2="30%" stroke="rgba(15,157,88,0.07)" strokeWidth="1" />
              <line x1="0" y1="70%" x2="100%" y2="70%" stroke="rgba(15,157,88,0.07)" strokeWidth="1" />
              {/* Maydar Wee Market main road */}
              <line x1="0" y1="52%" x2="100%" y2="52%" stroke="rgba(200,134,42,0.22)" strokeWidth="7" strokeLinecap="round" />
            </svg>

            {/* Pin */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="relative">
                <div className="absolute -inset-4 animate-ping rounded-full bg-pcb-500/15" />
                <div className="absolute -inset-2 rounded-full bg-pcb-500/10" />
                <div
                  className="relative grid h-14 w-14 place-items-center rounded-full border-2 border-pcb-400 shadow-xl"
                  style={{ background: isDark ? '#022014' : '#ecfdf5' }}
                >
                  <Tv size={22} className="text-pcb-400" />
                </div>
              </div>
              <div
                className="mt-4 rounded-xl border px-4 py-2.5 text-center backdrop-blur-sm"
                style={{
                  background: isDark ? 'rgba(10,15,18,0.92)' : 'rgba(255,255,255,0.92)',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#d1d5db',
                }}
              >
                <p className={`text-xs font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t('contact.mapName')}
                </p>
                <p className="text-[10px] font-semibold text-pcb-400">{t('contact.mapPlace')}</p>
                <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {t('contact.mapArea')}
                </p>
              </div>
            </div>

            {/* Compass */}
            <div
              className={`absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border text-[11px] font-extrabold ${
                isDark ? 'border-white/10 bg-ink-900/80 text-slate-400' : 'border-slate-200 bg-white/80 text-slate-600'
              }`}
            >
              N
            </div>

            {/* Label */}
            <p className={`absolute bottom-4 left-4 text-[9px] uppercase tracking-[0.15em] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              {t('contact.mapLabel')}
            </p>

            {/* Open in Maps */}
            <a
              href="https://maps.google.com/?q=Maydar+Wee+Market+North+Okkalapa+Yangon"
              target="_blank"
              rel="noreferrer"
              className={`absolute bottom-4 right-4 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-semibold backdrop-blur-sm transition ${
                isDark
                  ? 'border-white/10 bg-ink-900/80 text-slate-400 hover:border-pcb-500/30 hover:text-pcb-300'
                  : 'border-slate-200 bg-white/80 text-slate-600 hover:border-pcb-500/30 hover:text-pcb-600'
              }`}
            >
              {t('contact.openMaps')}
              <ArrowUpRight size={11} />
            </a>
          </div>
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
  return (
    <footer className="border-t border-white/5 bg-ink px-4 py-14 pb-28 md:pb-14">
      <div className="mx-auto mb-10 h-px max-w-6xl bg-gradient-to-r from-transparent via-copper-400/60 to-transparent" />
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand col */}
          <div className="lg:col-span-2">
            <button
              onClick={() => setActive('home')}
              className="group mb-5 flex items-center gap-2.5"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-pcb-500/30 bg-pcb-500/20 transition group-hover:bg-pcb-500/30">
                <Tv size={18} className="text-pcb-400" />
              </div>
              <div className="text-left leading-none">
                <span className="block text-sm font-extrabold text-white">{t('nav.brand')}</span>
                <span className="block text-[10px] uppercase tracking-[0.15em] text-slate-500">
                  {t('footer.service')}
                </span>
              </div>
            </button>
            <p className="max-w-xs text-xs leading-relaxed text-slate-500">
              {t('footer.blurb')}
            </p>

            <a href={`tel:${t('phone')}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-copper-300">
              <Phone size={14} />
              {t('phone')}
            </a>
          </div>

          {/* Navigation col */}
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              {t('footer.navigation')}
            </p>
            <ul className="space-y-2.5">
              {NAV_TABS.map(({ id }) => (
                <li key={id}>
                  <button
                    onClick={() => setActive(id)}
                    className="text-xs text-slate-400 transition hover:text-white"
                  >
                    {t(`nav.${id}`)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services + Contact col */}
          <div className="space-y-8">
            <div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                {t('footer.services')}
              </p>
              <ul className="space-y-2.5">
                {links.map((s) => (
                  <li key={s}>
                    <button
                      onClick={() => setActive('services')}
                      className="text-xs text-slate-400 transition hover:text-white"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                {t('footer.contact')}
              </p>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2 text-xs text-slate-400">
                  <MapPin size={11} className="mt-0.5 shrink-0 text-copper-500" />
                  {t('footer.address')}
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-400">
                  <Phone size={11} className="shrink-0 text-pcb-500" />
                  <a href={`tel:${t('phone')}`}>{t('phone')}</a>
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock size={11} className="shrink-0 text-slate-500" />
                  {t('footer.hours')}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-2 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-slate-600">
            © {new Date().getFullYear()} {t('footer.rights')}
          </p>
          <div className="flex items-center gap-3">
            <span className="h-1 w-1 rounded-full bg-pcb-500" />
            <p className="text-[11px] text-slate-600">{t('footer.est')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────
// ROOT PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function SeinPanOfficialPage() {
  const { t } = useOfficial();
  const [activeTab, setActiveTab] = useState('home');
  const [isDark,    setIsDark]    = useState(true);

  // Shared props
  const sp = { isDark, setActive: setActiveTab };

  const renderMain = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <HeroSection {...sp} />
            <BrandMarquee />
            <HomeServices {...sp} />
            <ProcessStrip {...sp} />
            <TechnicianCard {...sp} />
            <Testimonials isDark={isDark} />
            <ClosingBand setActive={setActiveTab} />
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
      className={`min-h-screen antialiased ${isDark ? 'bg-ink text-slate-200' : 'bg-slate-50 text-slate-900'}`}
    >
      <Navbar
        active={activeTab}
        setActive={setActiveTab}
        isDark={isDark}
        toggleTheme={() => setIsDark((v) => !v)}
      />

      {/* Scrollable content with navbar offset */}
      <main className="pt-[57px] sm:pt-[88px]">
        <div className="transition-colors duration-300">
          {renderMain()}
        </div>
      </main>

      <Footer setActive={setActiveTab} />

      <nav className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl md:hidden ${isDark ? 'border-white/10 bg-ink/95' : 'border-slate-200 bg-white/95'}`}>
        <div className="grid grid-cols-5">
          {NAV_TABS.map(({ id, Icon }) => {
            const on = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold ${on ? 'text-copper-400' : isDark ? 'text-slate-500' : 'text-slate-400'}`}
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
