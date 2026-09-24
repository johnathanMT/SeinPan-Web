// src/pages/SeinPanOfficialPage.jsx
// ✦ Complete single-file official website for Sein Pan Electronic Service
// ✦ Dark / Light mode toggle  ✦ 7 sections  ✦ Compact colorful technician card
// ✦ Controlled inquiry form with validation  ✦ All icons verified for lucide-react@1.22

import { useState, useRef } from 'react';
import {
  Tv, Wrench, MapPin, Phone, Clock, Star, Award, Shield,
  Upload, CheckCircle, X, Menu, ChevronRight, ChevronDown,
  ArrowUpRight, Zap, Home, Info, ClipboardList, PhoneCall,
  Users, History, TrendingUp, BadgeCheck, Gauge, Sparkles,
  Monitor, Radio, Cpu, Share2, Globe, SquarePlay, MessageSquare,
  Mail, Sun, Moon, GraduationCap, Lightbulb, Send, Quote,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────────────────────────

const NAV_TABS = [
  { id: 'home',     label: 'Home',     Icon: Home },
  { id: 'services', label: 'Services', Icon: Cpu },
  { id: 'about',    label: 'About',    Icon: Info },
  { id: 'inquiry',  label: 'Inquiry',  Icon: ClipboardList },
  { id: 'contact',  label: 'Contact',  Icon: PhoneCall },
];

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

const HERO_STATS = [
  { value: '1989',   label: 'Established' },
  { value: '37+',    label: 'Years of Trust' },
  { value: '5,000+', label: 'TVs Repaired' },
  { value: '3',      label: 'Technologies' },
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

const TESTIMONIALS = [
  {
    name: 'Daw Khin Myint',
    area: 'North Okkalapa',
    quote: 'Our LED went black the night before a family gathering. Sein Pan diagnosed it the same afternoon and the picture was perfect the next day.',
  },
  {
    name: 'Ko Htet Aung',
    area: 'South Okkalapa',
    quote: 'My parents have used this shop since the 14–15 junction days. The move to Maydarvi did not change the honesty or the workmanship.',
  },
  {
    name: 'Ma Thiri',
    area: 'Thingangyun',
    quote: 'They explained the plasma fault in plain language, used a genuine board, and stood behind the repair. I would not take a set anywhere else.',
  },
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
    <h2 className={`font-display text-4xl font-normal leading-[1.05] tracking-tight sm:text-5xl ${T.h}`}>{children}</h2>
  );
}

// ─────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────
function Navbar({ active, setActive, isDark, toggleTheme }) {
  const [open, setOpen] = useState(false);
  const T = getT(isDark);
  const go = (id) => { setActive(id); setOpen(false); };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl ${T.nav}`}>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-copper-400/70 to-transparent" />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">

        {/* Logo */}
        <button onClick={() => go('home')} className="group flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg border border-pcb-500/30 bg-pcb-500/20 transition group-hover:bg-pcb-500/30">
            <Tv size={17} className="text-pcb-400" />
          </div>
          <div className="text-left leading-none">
            <span className={`block text-[13px] font-extrabold tracking-wide ${T.h}`}>Sein Pan</span>
            <span className={`block text-[10px] uppercase tracking-[0.18em] ${T.muted}`}>Since 1989 · Electronic Service</span>
          </div>
        </button>

        {/* Desktop tabs */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 ${
                active === id ? T.tabActive : T.tabInact
              }`}
            >
              {label}
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
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Book Repair CTA (desktop) */}
          <button
            onClick={() => go('inquiry')}
            className="hidden items-center gap-2 rounded-xl bg-copper-500 px-4 py-2 text-sm font-bold text-pcb-950 shadow-glow transition hover:bg-copper-400 active:scale-95 md:flex"
          >
            <Wrench size={14} />
            Book Repair
          </button>

          {/* Hamburger (mobile) */}
          <button
            className={`grid h-9 w-9 place-items-center rounded-lg border transition md:hidden ${
              isDark ? 'border-white/8 text-slate-400 hover:bg-white/5 hover:text-white'
                     : 'border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className={`border-t px-4 pb-4 pt-2 md:hidden ${isDark ? 'bg-ink-900 border-white/5' : 'bg-white border-slate-100'}`}>
          <div className="space-y-1">
            {NAV_TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => go(id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active === id ? T.tabActive : T.tabInact
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => go('inquiry')}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-pcb-500 py-3 text-sm font-semibold text-white transition hover:bg-pcb-400"
          >
            <Wrench size={14} />
            Book a Repair
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
              Yangon · LED · LCD · Plasma
            </span>
          </div>

          <p className="font-display text-lg italic text-copper-300 sm:text-xl">Since 1989</p>
          <h1 className="mt-2 max-w-xl font-display text-[2.35rem] leading-[1.02] tracking-tight text-white sm:text-6xl sm:leading-[0.95] lg:text-7xl">
            Television repair with a thirty-seven year reputation.
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-400 sm:mt-6 sm:text-lg">
            LED, LCD, and Plasma repair beside Maydar Wee Market. Genuine parts, and the same workshop U Win Naing opened in South Okkalapa in 1989.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
            <button onClick={() => setActive('inquiry')} className={CTA}>
              <ClipboardList size={15} />
              Request a repair quote
              <ArrowUpRight size={14} />
            </button>
            <button
              onClick={() => setActive('services')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 text-sm font-medium text-slate-200 transition hover:border-copper-400/40 hover:text-white"
            >
              Explore services
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
            <span className="inline-flex items-center gap-1.5"><Shield size={12} className="text-pcb-400" /> Genuine parts</span>
            <span className="inline-flex items-center gap-1.5"><Clock size={12} className="text-copper-400" /> Same-day diagnosis</span>
            <span className="inline-flex items-center gap-1.5"><BadgeCheck size={12} className="text-pcb-300" /> No-fix, no-fee</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {HERO_STATS.map(({ value, label }) => (
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
  const row = [...BRANDS, ...BRANDS];
  return (
    <div className="overflow-hidden border-y border-white/5 bg-ink py-4">
      <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">
        Brands we service every week
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
  const T = getT(isDark);
  return (
    <section className={`px-4 py-20 ${T.sec}`}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <SectionLabel T={T}>The workshop</SectionLabel>
            <SectionHeading T={T}>
              Three technologies. <span className="font-display italic text-copper-400">One bench.</span>
            </SectionHeading>
          </div>
          <button onClick={() => setActive('services')} className={`text-sm font-semibold ${T.accent}`}>
            Full service list →
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
                  {svc.badge}
                </span>
              </div>
              <h3 className={`mt-6 font-display text-3xl ${T.h}`}>{svc.label.replace(' Repair', '')}</h3>
              <p className={`mt-3 text-sm leading-relaxed ${T.body}`}>{svc.desc}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-copper-400">
                See the repair list <ArrowUpRight size={12} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessStrip({ setActive, isDark }) {
  const T = getT(isDark);
  return (
    <section className={`px-4 py-16 ${T.altSec}`}>
      <div className="mx-auto max-w-6xl">
        <SectionLabel T={T}>How a repair begins</SectionLabel>
        <SectionHeading T={T}>A clear path from symptom to picture.</SectionHeading>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {INQUIRY_STEPS.map(({ Icon, title, body }, i) => (
            <div key={title} className={`rounded-3xl border p-6 ${T.card}`}>
              <p className="font-display text-4xl text-copper-400">0{i + 1}</p>
              <div className="mt-4 grid h-10 w-10 place-items-center rounded-xl border border-pcb-500/25 bg-pcb-500/10">
                <Icon size={16} className="text-pcb-400" />
              </div>
              <h3 className={`mt-4 text-base font-bold ${T.h}`}>{title}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${T.body}`}>{body}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setActive('inquiry')} className={`${CTA} mt-8`}>
          Start an inquiry
          <ArrowUpRight size={14} />
        </button>
      </div>
    </section>
  );
}

function Testimonials({ isDark }) {
  const T = getT(isDark);
  return (
    <section className={`px-4 py-20 ${T.sec}`}>
      <div className="mx-auto max-w-6xl">
        <SectionLabel T={T}>Neighbourhood trust</SectionLabel>
        <SectionHeading T={T}>Families who keep coming back.</SectionHeading>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {TESTIMONIALS.map(({ name, area, quote }) => (
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
  return (
    <section className="px-4 pb-16">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-copper-500/25 bg-forest-950 px-6 py-12 sm:px-12">
        <div className="pointer-events-none absolute -right-10 top-0 h-48 w-48 rounded-full bg-copper-500/20 blur-3xl" />
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-copper-300">Walk in or write first</p>
        <h2 className="mt-3 max-w-xl font-display text-4xl leading-tight text-white sm:text-5xl">
          Bring the set. Leave with a straight answer.
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-400">
          Near Maydar Wee Market, North Okkalapa. Diagnosis before you commit, genuine parts, and a technician who has done this work since 1989.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => setActive('inquiry')} className={CTA}>
            Submit a repair inquiry
          </button>
          <a href="tel:09423850609" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 text-sm font-semibold text-white">
            <Phone size={14} />
            09 423 850 609
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
      alt="U Win Naing — Founder & Master Technician"
      onError={() => setFailed(true)}
      className="h-full w-full rounded-[14px] object-cover object-top"
    />
  );
}

// ─────────────────────────────────────────────────────────────────
// TECHNICIAN CARD  (compact, advanced, colourful)
// ─────────────────────────────────────────────────────────────────
function TechnicianCard({ isDark, setActive }) {
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
                <p className={`text-lg font-extrabold leading-tight ${T.h}`}>U Win Naing</p>
                <p className="mt-0.5 text-xs font-semibold text-copper-400">
                  Founder &amp; Master Technician
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-pcb-500/30 bg-pcb-500/15 px-2.5 py-0.5">
                  <BadgeCheck size={11} className="text-pcb-400" />
                  <span className="text-[10px] font-bold text-pcb-300">37 Yrs Experience</span>
                </div>
                {/* Star row */}
                <div className="mt-1.5 flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} className="fill-copper-400 text-copper-400" />
                  ))}
                  <span className="ml-1 text-[10px] text-slate-500">5.0</span>
                </div>
              </div>
            </div>

            {/* ── Col 2: Skills grid ── */}
            <div>
              <p className={`mb-3 text-[10px] font-bold uppercase tracking-[0.14em] ${T.muted}`}>
                Core Specialisations
              </p>
              <div className="flex flex-wrap gap-2">
                {TECH_SKILLS.map(({ label, cls, Icon }) => (
                  <span
                    key={label}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${cls}`}
                  >
                    <Icon size={10} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Col 3: Mini stats + CTA ── */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: '5K+',  label: 'Repaired', color: 'text-pcb-400' },
                  { value: '37',   label: 'Years',    color: 'text-copper-400' },
                  { value: '100%', label: 'Genuine',  color: 'text-violet-400' },
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
                Full Story &amp; Heritage
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
  const T = getT(isDark);

  return (
    <section className={`min-h-screen px-4 py-20 sm:py-28 ${T.sec}`}>
      <div className="mx-auto max-w-6xl">
        <SectionLabel T={T}>What We Fix</SectionLabel>
        <SectionHeading T={T}>
          Specialized Repair for{' '}
          <span className="text-pcb-400">Every Screen</span>
        </SectionHeading>
        <p className={`mt-4 max-w-lg text-sm leading-relaxed sm:text-base ${T.body}`}>
          Whether it&rsquo;s the latest 4K LED panel or a beloved vintage plasma set, our
          certified technicians have the tools and expertise to bring it back to life.
        </p>

        {/* Service cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((svc) => {
            const isOpen = expanded === svc.id;
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
                      {svc.badge}
                    </span>
                  </div>

                  <h3 className={`mt-4 text-lg font-bold ${T.h}`}>{svc.label}</h3>
                  <p className={`mt-2 flex-1 text-sm leading-relaxed ${T.body}`}>{svc.desc}</p>

                  {/* Expand toggle */}
                  <button
                    className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-pcb-400 transition hover:text-pcb-300"
                    onClick={(e) => { e.stopPropagation(); setExpanded(isOpen ? null : svc.id); }}
                  >
                    {isOpen ? 'Hide details' : 'See what we fix'}
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Expandable feature list */}
                  {isOpen && (
                    <ul className={`mt-4 space-y-2 border-t pt-4 ${T.div}`}>
                      {svc.features.map((f) => (
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
          {TRUST_BADGES.map(({ Icon, text }) => (
            <div
              key={text}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 ${T.card}`}
            >
              <Icon size={14} className="text-copper-400" />
              <span className={`text-xs font-medium ${T.body}`}>{text}</span>
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
            Book a Repair — It&rsquo;s Free to Inquire
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
            <SectionLabel T={T}>Our Heritage</SectionLabel>
            <SectionHeading T={T}>
              A Legacy Built on{' '}
              <span className="text-copper-400">Trust</span> &amp; Skill
            </SectionHeading>

            <div className={`mt-5 space-y-3 text-sm leading-relaxed sm:text-base ${T.body}`}>
              <p>
                Sein Pan Electronic Service was born from a simple belief — every broken television
                deserves an honest repair at a fair price. Founder{' '}
                <strong className={`font-semibold ${T.h}`}>U Win Naing</strong> started this journey
                in <strong className={`font-semibold ${T.h}`}>1989</strong> with nothing but a
                toolkit, deep electronics knowledge, and an unwavering commitment to his community.
              </p>
              <p>
                Over more than three decades, the shop evolved from servicing bulky CRT sets to
                mastering modern LED, LCD, and plasma technologies — always staying ahead of the
                curve while keeping that same neighbourhood warmth and trusted reputation.
              </p>
              <p>
                Now located near{' '}
                <strong className="font-semibold text-pcb-400">Maydar Wee Market (Maydarvi)</strong>,
                North Okkalapa township, the shop is more accessible than ever, continuing to serve
                Yangon families with the same dedication that built its 37-year legacy.
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
                  <p className={`font-extrabold ${T.h}`}>U Win Naing</p>
                  <p className={`text-xs ${T.muted}`}>Founder &amp; Master Technician</p>
                  <p className="mt-1 text-[11px] font-semibold text-copper-400">
                    37+ Years · South Okkalapa → North Okkalapa
                  </p>
                  <div className="mt-2 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className="fill-copper-400 text-copper-400" />
                    ))}
                    <span className={`ml-1 text-[10px] ${T.muted}`}>Master-level expertise</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActive('inquiry')}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-pcb-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-pcb-400 active:scale-95"
            >
              <ClipboardList size={14} />
              Book a Repair Today
            </button>
          </div>

          {/* ── Right: Timeline ── */}
          <div className="relative">
            <div className={`absolute left-5 top-4 bottom-4 w-px ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
            <div className="space-y-8 pl-14">
              {TIMELINE.map(({ year, title, body, yearCls, dotBorder, dotBg, dotFill }, i) => (
                <div key={year} className="relative">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-9 top-0.5 grid h-8 w-8 place-items-center rounded-full border-2 ${dotBorder} ${dotBg}`}
                  >
                    <div className={`h-2.5 w-2.5 rounded-full ${dotFill}`} />
                  </div>
                  <p className={`text-xs font-bold uppercase tracking-[0.15em] ${yearCls}`}>{year}</p>
                  <h3 className={`mt-1 text-base font-bold ${T.h}`}>{title}</h3>
                  <p className={`mt-1.5 text-sm leading-relaxed ${T.body}`}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {ABOUT_STATS.map(({ Icon, label, value }) => (
            <div key={label} className={`rounded-xl border px-4 py-5 text-center ${T.card}`}>
              <Icon size={20} className="mx-auto mb-2 text-copper-500" />
              <p className={`text-2xl font-extrabold ${T.h}`}>{value}</p>
              <p className={`mt-0.5 text-[10px] uppercase tracking-wider ${T.muted}`}>{label}</p>
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
  const T = getT(isDark);

  function validate() {
    const e = {};
    if (!form.fullName.trim())  e.fullName = 'Full name is required.';
    if (!form.phone.trim())     e.phone = 'Phone number is required.';
    else if (!/^[0-9+()\-\s]{7,}$/.test(form.phone.trim()))
      e.phone = 'Enter a valid phone number.';
    if (!form.tvBrand.trim())   e.tvBrand = 'TV brand is required.';
    if (!form.issue.trim())     e.issue = 'Please describe the issue.';
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
            <SectionLabel T={T}>Online Repair Inquiry</SectionLabel>
            <SectionHeading T={T}>
              Book Your{' '}
              <span className="text-pcb-400">TV Repair</span> Today
            </SectionHeading>
            <p className={`mt-4 text-sm leading-relaxed sm:text-base ${T.body}`}>
              Fill in the form and our team will contact you within{' '}
              <strong className={`font-semibold ${T.h}`}>24 hours</strong> to confirm your
              appointment. No upfront fees — you only pay after the repair is complete.
            </p>

            <div className="mt-8 space-y-5">
              {INQUIRY_STEPS.map(({ Icon, title, body }, i) => (
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
              ))}
            </div>

            {/* Feature pills */}
            <div className="mt-6 flex flex-wrap gap-2">
              {['Free Consultation', 'No-Fix No-Fee', 'Same-Day Estimate', 'Genuine Parts'].map((tag) => (
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
            <h3 className={`mb-6 text-lg font-bold ${T.h}`}>Repair Inquiry Form</h3>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Full Name */}
              <div>
                <label className={`mb-1.5 block text-xs font-semibold ${T.muted}`}>
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mg Aung Kyaw"
                  value={form.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className={T.input(errors.fullName)}
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className={`mb-1.5 block text-xs font-semibold ${T.muted}`}>
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 09 423 850 609"
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
                    TV Brand <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Samsung"
                    value={form.tvBrand}
                    onChange={(e) => handleChange('tvBrand', e.target.value)}
                    className={T.input(errors.tvBrand)}
                  />
                  {errors.tvBrand && <p className="mt-1 text-xs text-red-400">{errors.tvBrand}</p>}
                </div>
                <div>
                  <label className={`mb-1.5 block text-xs font-semibold ${T.muted}`}>
                    Model <span className={`font-normal ${T.muted}`}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UA55TU7000"
                    value={form.tvModel}
                    onChange={(e) => handleChange('tvModel', e.target.value)}
                    className={T.input(false)}
                  />
                </div>
              </div>

              {/* Issue */}
              <div>
                <label className={`mb-1.5 block text-xs font-semibold ${T.muted}`}>
                  Describe the Issue <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Screen goes black after 10 minutes but sound still works…"
                  value={form.issue}
                  onChange={(e) => handleChange('issue', e.target.value)}
                  className={`${T.input(errors.issue)} resize-none`}
                />
                {errors.issue && <p className="mt-1 text-xs text-red-400">{errors.issue}</p>}
              </div>

              {/* File upload */}
              <div>
                <label className={`mb-1.5 block text-xs font-semibold ${T.muted}`}>
                  Attach Photo{' '}
                  <span className={`font-normal ${T.muted}`}>(optional — helps with diagnosis)</span>
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
                  {form.file ? form.file.name : 'Click to upload an image of your TV'}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl bg-copper-500 px-6 py-3.5 text-sm font-bold text-pcb-950 shadow-glow transition hover:bg-copper-400 active:scale-[0.98]"
              >
                Submit Repair Inquiry →
              </button>

              <p className={`text-center text-[10px] ${T.muted}`}>
                No upfront payment. Our team will contact you within 24 hours.
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
              Inquiry Received!
            </h3>
            <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Thank you,{' '}
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>{form.fullName}</strong>! We&rsquo;ve
              received your repair inquiry for your{' '}
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>{form.tvBrand}</strong> TV.
              Our team will call you at{' '}
              <strong className="text-pcb-400">{form.phone}</strong> within 24 hours.
            </p>

            {/* Summary table */}
            <div
              className={`mt-5 rounded-xl border px-4 py-3 text-left text-xs ${
                isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50'
              }`}
            >
              <p className={`mb-2 text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Submission Summary
              </p>
              {[
                { k: 'Name',  v: form.fullName },
                { k: 'Phone', v: form.phone },
                { k: 'TV',    v: `${form.tvBrand} ${form.tvModel}`.trim() },
                { k: 'Photo', v: form.file ? form.file.name : 'Not attached' },
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
                Submit Another
              </button>
              <button
                onClick={() => setSubmitted(false)}
                className="flex-1 rounded-xl bg-pcb-500 py-3 text-sm font-bold text-white transition hover:bg-pcb-400"
              >
                Close
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
  const T = getT(isDark);
  return (
    <section className={`min-h-screen px-4 py-20 sm:py-28 ${T.altSec}`}>
      <div className="mx-auto max-w-6xl">
        <SectionLabel T={T}>Get In Touch</SectionLabel>
        <SectionHeading T={T}>
          Find Us in{' '}
          <span className="text-copper-400">North Okkalapa</span>
        </SectionHeading>
        <p className={`mt-4 max-w-lg text-sm leading-relaxed sm:text-base ${T.body}`}>
          Visit us near Maydar Wee Market (Maydarvi), North Okkalapa township, Yangon.
          Walk-ins welcome during business hours.
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
                <p className={`text-sm font-bold ${T.h}`}>Phone Numbers</p>
              </div>
              <div className="space-y-2">
                {['09 423 850 609'].map((num) => (
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
                <p className={`text-sm font-bold ${T.h}`}>Business Hours</p>
              </div>
              <div className={`divide-y ${isDark ? 'divide-white/[0.04]' : 'divide-slate-100'}`}>
                {HOURS.map(({ day, time, open }) => (
                  <div key={day} className="flex items-center justify-between py-2.5">
                    <span className={`text-xs ${T.muted}`}>{day}</span>
                    <div className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-pcb-400' : 'bg-red-400'}`} />
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
                <p className={`text-sm font-bold ${T.h}`}>Address</p>
              </div>
              <p className={`text-sm leading-relaxed ${T.body}`}>
                Near Maydar Wee Market (Maydarvi),<br />
                North Okkalapa Township,<br />
                Yangon, Myanmar
              </p>
              <p className={`mt-3 text-[11px] ${T.muted}`}>
                Previous location: 14–15 Junction, Yadanar Road, 12 Quarter, South Okkalapa
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
                  Sein Pan Electronic
                </p>
                <p className="text-[10px] font-semibold text-pcb-400">Near Maydar Wee Market</p>
                <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  North Okkalapa, Yangon
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
              Maydarvi · North Okkalapa
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
              Open in Maps
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
const FOOTER_SERVICES = [
  'LED TV Repair', 'LCD TV Repair', 'Plasma TV Repair',
  'Remote Repair', 'Component Soldering', 'Smart TV Service',
];

function Footer({ setActive }) {
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
                <span className="block text-sm font-extrabold text-white">Sein Pan</span>
                <span className="block text-[10px] uppercase tracking-[0.15em] text-slate-500">
                  Electronic Service
                </span>
              </div>
            </button>
            <p className="max-w-xs text-xs leading-relaxed text-slate-500">
              LED, LCD &amp; Plasma TV Repair Service. Established in 1989 by U Win Naing.
              Serving Yangon with trust and expertise for over 37 years.
            </p>

            {/* Social icons */}
            <div className="mt-5 flex gap-2">
              {[
                { Icon: Share2,        label: 'Facebook' },
                { Icon: Globe,         label: 'Instagram' },
                { Icon: SquarePlay,    label: 'YouTube' },
                { Icon: MessageSquare, label: 'Viber' },
                { Icon: Mail,          label: 'Email' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-white/5 text-slate-500 transition hover:border-pcb-500/25 hover:bg-pcb-500/10 hover:text-pcb-400"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation col */}
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Navigation
            </p>
            <ul className="space-y-2.5">
              {NAV_TABS.map(({ id, label }) => (
                <li key={id}>
                  <button
                    onClick={() => setActive(id)}
                    className="text-xs text-slate-400 transition hover:text-white"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services + Contact col */}
          <div className="space-y-8">
            <div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Services
              </p>
              <ul className="space-y-2.5">
                {FOOTER_SERVICES.map((s) => (
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
                Contact
              </p>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2 text-xs text-slate-400">
                  <MapPin size={11} className="mt-0.5 shrink-0 text-copper-500" />
                  Near Maydar Wee Market, North Okkalapa, Yangon
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-400">
                  <Phone size={11} className="shrink-0 text-pcb-500" />
                  09 423 850 609
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock size={11} className="shrink-0 text-slate-500" />
                  Mon–Fri · 8 AM – 6 PM
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-2 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-slate-600">
            © {new Date().getFullYear()} Sein Pan Electronic Service. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="h-1 w-1 rounded-full bg-pcb-500" />
            <p className="text-[11px] text-slate-600">Est. 1989 · North Okkalapa, Yangon</p>
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
      <main className="pt-[57px]">
        <div className="transition-colors duration-300">
          {renderMain()}
        </div>
      </main>

      <Footer setActive={setActiveTab} />

      <nav className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl md:hidden ${isDark ? 'border-white/10 bg-ink/95' : 'border-slate-200 bg-white/95'}`}>
        <div className="grid grid-cols-5">
          {NAV_TABS.map(({ id, label, Icon }) => {
            const on = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold ${on ? 'text-copper-400' : isDark ? 'text-slate-500' : 'text-slate-400'}`}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
