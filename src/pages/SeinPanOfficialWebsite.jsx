'use client';

import { useState, useRef } from 'react';
import {
  Tv,
  Phone,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  Send,
  Upload,
  X,
  Menu,
  Award,
  Shield,
  Zap,
  ChevronRight,
  Share2,
  Globe,
  Mail,
  Users,
  Calendar,
  Wrench,
  Monitor,
  Radio,
  Home,
  Settings,
  Info,
  MessageSquare,
  PhoneCall,
  TrendingUp,
  HeartHandshake,
  BadgeCheck,
} from 'lucide-react';

// ─── Brand colour tokens (mirror tailwind.config.js) ──────────────────────────
const C = {
  ink:        '#05080a',
  ink900:     '#0a0f12',
  ink800:     '#0e1518',
  forest:     '#04211a',
  forest800:  '#073123',
  pcb500:     '#0f9d58',
  pcb400:     '#22c06f',
  pcb300:     '#57db96',
  copper400:  '#d99f33',
  copper500:  '#c8862a',
  copper300:  '#e4b75a',
  line:       'rgba(148,163,184,0.12)',
};

// ─── Shared micro-components ──────────────────────────────────────────────────
function Pill({ color = C.pcb500, children }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest"
      style={{ borderColor: `${color}55`, color, background: `${color}15` }}
    >
      {children}
    </span>
  );
}

function SectionHeading({ eyebrow, title, subtitle, eyebrowColor = C.copper400 }) {
  return (
    <div className="mb-8 text-center">
      {eyebrow && (
        <p className="mb-3">
          <Pill color={eyebrowColor}>{eyebrow}</Pill>
        </p>
      )}
      <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">{subtitle}</p>}
    </div>
  );
}

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: 'home',     label: 'Home',     icon: Home },
  { id: 'services', label: 'Services', icon: Settings },
  { id: 'about',    label: 'About',    icon: Info },
  { id: 'inquiry',  label: 'Inquiry',  icon: MessageSquare },
  { id: 'contact',  label: 'Contact',  icon: PhoneCall },
];

// ─── Services data ────────────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: Monitor,
    title: 'LED TV Repair',
    badge: 'Most Popular',
    badgeBg: '#1d4ed8',
    gradFrom: '#1e3a5f',
    gradTo:   '#0f172a',
    accentColor: '#60a5fa',
    description:
      'Advanced diagnostics and repair for all LED television models — from basic flat panels to Android Smart TVs.',
    features: ['Backlight Repair', 'Main Board Replacement', 'Screen Panel Repair', 'HDMI / USB Port Fix'],
  },
  {
    icon: Tv,
    title: 'LCD TV Repair',
    badge: 'Specialist',
    badgeBg: C.copper500,
    gradFrom: '#3b1f05',
    gradTo:   '#0a0f12',
    accentColor: C.copper300,
    description:
      'Comprehensive LCD TV repair with genuine spare parts, full diagnostics, and a service warranty on every job.',
    features: ['Display & Inverter Issues', 'Power Supply Fix', 'Remote Control Repair', 'No-Display Diagnosis'],
  },
  {
    icon: Radio,
    title: 'Plasma TV Repair',
    badge: 'Expert',
    badgeBg: '#7c3aed',
    gradFrom: '#2e1065',
    gradTo:   '#0a0f12',
    accentColor: '#a78bfa',
    description:
      'Specialised plasma television repair by seasoned technicians with decades of hands-on experience.',
    features: ['Plasma Panel Fix', 'Control Board Repair', 'Sustain Circuit Repair', 'Image Quality Restoration'],
  },
];

const EXTRA_SERVICES = [
  'Remote Control Repair', 'TV Wall Mounting',
  'Speaker / Audio Repair', 'HDMI / AV Port Repair',
  'Capacitor Replacement', 'Smart TV Software Update',
];

const TIMELINE = [
  {
    year: '1989',
    title: 'The Beginning',
    dot: C.copper400,
    desc: 'U Win Naing establishes Sein Pan Electronic Service near 14–15 Junction, 12 Quarter, Yadanar Road, South Okkalapa Township, Yangon.',
  },
  {
    year: '1995',
    title: 'Growing Reputation',
    dot: C.pcb400,
    desc: 'Expanded services to include the emerging LCD flat-panel TV technology as the industry rapidly evolved.',
  },
  {
    year: '2010',
    title: 'Modern Era',
    dot: '#a78bfa',
    desc: 'Adapted to the LED TV revolution — invested in specialist training and modern diagnostic equipment for Smart TVs.',
  },
  {
    year: 'Present',
    title: 'New Location · North Okkalapa',
    dot: C.pcb300,
    desc: 'Now proudly serving the community near Maydar Wee Market (Maydarvi), North Okkalapa Township, with the same trusted excellence.',
  },
];

const WHY_US = [
  { icon: Shield,        title: 'Trusted Quality',     desc: '37+ years of consistent excellence in TV repair.' },
  { icon: Award,         title: 'Deep Expertise',       desc: 'Specialised in LED, LCD & Plasma televisions.' },
  { icon: Zap,           title: 'Fast Turnaround',      desc: 'Rapid diagnosis and efficient same-day service.' },
  { icon: BadgeCheck,    title: 'Genuine Parts',        desc: 'Only authentic, compatible spare parts installed.' },
  { icon: HeartHandshake,title: 'Community Roots',      desc: 'Born local, trusted by thousands of families.' },
  { icon: TrendingUp,    title: 'Service Warranty',     desc: 'Every repair backed by our quality guarantee.' },
];

const HOURS = [
  { day: 'Monday – Friday', hours: '8:00 AM – 6:00 PM', open: true },
  { day: 'Saturday',         hours: '8:00 AM – 4:00 PM', open: true },
  { day: 'Sunday',           hours: 'Closed',             open: false },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SeinPanOfficialWebsite() {
  const [activeTab,    setActiveTab]    = useState('home');
  const [mobileOpen,  setMobileOpen]   = useState(false);
  const [showSuccess, setShowSuccess]  = useState(false);
  const [isSubmitting,setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: '', phone: '', tvBrand: '', tvModel: '',
    issueDescription: '', fileName: '',
  });

  const fileRef = useRef(null);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    if (e.target.files?.[0])
      setForm((f) => ({ ...f, fileName: e.target.files[0].name }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setForm({ fullName: '', phone: '', tvBrand: '', tvModel: '', issueDescription: '', fileName: '' });
    }, 1500);
  };

  const go = (tab) => { setActiveTab(tab); setMobileOpen(false); };

  // ── Shared card class
  const card = 'bg-slate-900 border border-slate-800 rounded-2xl';

  // ── Field class
  const field =
    'w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 ' +
    'focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/30 transition-all';

  return (
    <div className="min-h-screen font-sans" style={{ background: C.ink, color: '#e2e8f0' }}>

      {/* ══════════════════ SUCCESS MODAL ══════════════════ */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-sm rounded-3xl border p-8 text-center shadow-2xl"
            style={{ background: C.ink900, borderColor: `${C.pcb500}44` }}
          >
            <div
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: `${C.pcb500}22` }}
            >
              <CheckCircle className="h-8 w-8" style={{ color: C.pcb400 }} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">Inquiry Submitted!</h3>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              Thank you! Our team will contact you within&nbsp;24&nbsp;hours to schedule your TV repair.
            </p>
            <button
              onClick={() => { setShowSuccess(false); go('home'); }}
              className="w-full rounded-xl py-3 text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${C.pcb500}, ${C.pcb400})` }}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════ HEADER / NAV ══════════════════ */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{ background: `${C.ink}f2`, borderColor: C.line }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <button onClick={() => go('home')} className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: `linear-gradient(135deg, ${C.pcb500}, ${C.copper400})` }}
            >
              <Tv className="h-4 w-4 text-white" />
            </div>
            <div className="text-left leading-tight">
              <p className="text-[13px] font-extrabold text-white">Sein Pan</p>
              <p className="text-[10px] font-semibold" style={{ color: C.copper300 }}>Electronic Service</p>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => go(id)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all"
                style={
                  activeTab === id
                    ? { background: `${C.pcb500}20`, color: C.pcb400, border: `1px solid ${C.pcb500}44` }
                    : { color: '#94a3b8', border: '1px solid transparent' }
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </nav>

          {/* Book repair CTA (desktop) + hamburger (mobile) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => go('inquiry')}
              className="hidden items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white transition-all hover:opacity-90 md:flex"
              style={{ background: `linear-gradient(135deg, ${C.copper500}, ${C.copper400})` }}
            >
              <Wrench className="h-3.5 w-3.5" />
              Book Repair
            </button>
            <button
              className="rounded-lg p-2 md:hidden"
              style={{ color: '#94a3b8' }}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="border-t px-4 py-4 md:hidden" style={{ background: C.ink900, borderColor: C.line }}>
            <div className="mb-3 grid grid-cols-5 gap-1.5">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => go(id)}
                  className="flex flex-col items-center gap-1 rounded-xl py-3 text-[10px] font-semibold transition-all"
                  style={
                    activeTab === id
                      ? { background: `${C.pcb500}25`, color: C.pcb400 }
                      : { background: C.ink800, color: '#64748b' }
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => go('inquiry')}
              className="w-full rounded-xl py-2.5 text-sm font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${C.copper500}, ${C.copper400})` }}
            >
              Book a Repair Now
            </button>
          </div>
        )}
      </header>

      {/* ══════════════════ MAIN CONTENT ══════════════════ */}
      <main className="pb-20 md:pb-0">

        {/* ━━━━━━━━━━━━━━━━━━ HOME ━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 'home' && (
          <>
            {/* ── Hero ── */}
            <section
              className="relative overflow-hidden px-4 py-16 text-center md:py-24"
              style={{ background: `linear-gradient(160deg, ${C.forest} 0%, ${C.ink} 60%, ${C.forest800} 100%)` }}
            >
              {/* Glow orbs */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full opacity-20"
                  style={{ background: `radial-gradient(circle, ${C.pcb500} 0%, transparent 70%)` }} />
                <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full opacity-10"
                  style={{ background: `radial-gradient(circle, ${C.copper400} 0%, transparent 70%)` }} />
              </div>

              <div className="relative z-10 mx-auto max-w-3xl">
                <p className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold"
                  style={{ borderColor: `${C.copper400}55`, color: C.copper300, background: `${C.copper400}12` }}>
                  <Star className="h-3.5 w-3.5 fill-current" />
                  Established 1989 · Trusted for 37+ Years
                </p>

                <h1 className="mb-4 text-3xl font-extrabold leading-tight text-white sm:text-5xl">
                  Expert{' '}
                  <span style={{ WebkitTextFillColor: 'transparent',
                    background: `linear-gradient(90deg, ${C.pcb300}, ${C.pcb400})`,
                    WebkitBackgroundClip: 'text' }}>
                    Television Repair
                  </span>
                  <br />You Can Trust
                </h1>

                <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
                  North Okkalapa&rsquo;s premier TV repair specialist — LED, LCD &amp; Plasma televisions
                  restored with expert precision, near <strong className="text-slate-300">Maydar Wee Market</strong>.
                </p>

                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    onClick={() => go('inquiry')}
                    className="flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90"
                    style={{ background: `linear-gradient(135deg, ${C.pcb500}, ${C.pcb400})`,
                      boxShadow: `0 8px 30px -8px ${C.pcb500}60` }}
                  >
                    <Wrench className="h-4 w-4" />
                    Book a Repair
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => go('services')}
                    className="flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-semibold text-slate-300 transition-all hover:text-white"
                    style={{ borderColor: C.line }}
                  >
                    View Services
                  </button>
                </div>

                {/* Stats row */}
                <div className="mx-auto mt-10 grid max-w-sm grid-cols-3 gap-3 sm:max-w-md">
                  {[
                    { value: '37+',   label: 'Years' },
                    { value: '5000+', label: 'TVs Repaired' },
                    { value: '100%',  label: 'Guaranteed' },
                  ].map((s) => (
                    <div key={s.label}
                      className="rounded-2xl border p-3 text-center"
                      style={{ background: 'rgba(255,255,255,0.04)', borderColor: C.line }}>
                      <p className="text-xl font-extrabold sm:text-2xl" style={{ color: C.copper300 }}>{s.value}</p>
                      <p className="mt-0.5 text-[10px] text-slate-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── What We Fix (preview cards) ── */}
            <section className="mx-auto max-w-6xl px-4 py-12">
              <SectionHeading
                eyebrow="What We Fix"
                title="Specialised TV Repair Services"
                subtitle="Professional repairs for all television technologies."
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {SERVICES.map((svc) => {
                  const Icon = svc.icon;
                  return (
                    <button
                      key={svc.title}
                      onClick={() => go('services')}
                      className="group rounded-2xl border p-5 text-left transition-all hover:border-opacity-60"
                      style={{ background: C.ink900, borderColor: C.line }}
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ background: `linear-gradient(135deg, ${svc.gradFrom}, ${svc.gradTo})`,
                          border: `1px solid ${svc.accentColor}33` }}>
                        <Icon className="h-5 w-5" style={{ color: svc.accentColor }} />
                      </div>
                      <h3 className="mb-1 text-sm font-semibold text-white">{svc.title}</h3>
                      <p className="text-xs leading-relaxed text-slate-500">
                        {svc.description.split('.')[0]}.
                      </p>
                      <p className="mt-3 flex items-center gap-1 text-xs font-semibold transition-colors"
                        style={{ color: svc.accentColor }}>
                        Learn more <ChevronRight className="h-3 w-3" />
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── Quality Banner ── */}
            <div className="mx-4 mb-10 rounded-2xl border p-5 sm:mx-auto sm:max-w-4xl"
              style={{ background: `linear-gradient(135deg, ${C.forest800}cc, ${C.ink900})`,
                borderColor: `${C.pcb500}33` }}>
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${C.pcb500}22` }}>
                  <Shield className="h-6 w-6" style={{ color: C.pcb400 }} />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="mb-1 text-sm font-bold text-white">Service Quality Guaranteed</h3>
                  <p className="text-xs leading-relaxed text-slate-400">
                    All repairs carry our workmanship warranty. We use genuine spare parts and our
                    experienced technicians ensure every TV is restored to perfect condition.
                  </p>
                </div>
                <button
                  onClick={() => go('inquiry')}
                  className="flex-shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-all hover:opacity-90"
                  style={{ background: C.pcb500 }}
                >
                  Get a Free Quote
                </button>
              </div>
            </div>
          </>
        )}

        {/* ━━━━━━━━━━━━━━━━━━ SERVICES ━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 'services' && (
          <div className="mx-auto max-w-3xl px-4 py-10">
            <SectionHeading
              eyebrow="Professional TV Repair"
              title="Our Specialisations"
              subtitle="Expert repair services for all television types — backed by 37+ years of hands-on mastery."
              eyebrowColor={C.pcb400}
            />

            <div className="space-y-5">
              {SERVICES.map((svc) => {
                const Icon = svc.icon;
                return (
                  <div key={svc.title} className="overflow-hidden rounded-2xl border"
                    style={{ background: C.ink900, borderColor: C.line }}>
                    {/* Card header */}
                    <div className="flex items-center justify-between p-4"
                      style={{ background: `linear-gradient(135deg, ${svc.gradFrom}, ${C.ink900})`,
                        borderBottom: `1px solid ${svc.accentColor}22` }}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                          style={{ background: `${svc.accentColor}22`, border: `1px solid ${svc.accentColor}44` }}>
                          <Icon className="h-5 w-5" style={{ color: svc.accentColor }} />
                        </div>
                        <h3 className="font-bold text-white">{svc.title}</h3>
                      </div>
                      <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase text-white"
                        style={{ background: svc.badgeBg }}>
                        {svc.badge}
                      </span>
                    </div>
                    {/* Card body */}
                    <div className="p-4">
                      <p className="mb-4 text-sm leading-relaxed text-slate-400">{svc.description}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {svc.features.map((f) => (
                          <div key={f} className="flex items-center gap-2">
                            <CheckCircle className="h-3.5 w-3.5 flex-shrink-0" style={{ color: C.pcb400 }} />
                            <span className="text-xs text-slate-300">{f}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => go('inquiry')}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:opacity-80"
                        style={{ background: C.ink800, border: `1px solid ${C.line}` }}
                      >
                        <Send className="h-3.5 w-3.5" />
                        Submit Repair Request
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Services */}
            <div className="mt-6 rounded-2xl border p-5"
              style={{ background: C.ink900, borderColor: C.line }}>
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
                <Wrench className="h-4 w-4" style={{ color: C.copper400 }} />
                Additional Services
              </h3>
              <div className="grid grid-cols-2 gap-y-2.5">
                {EXTRA_SERVICES.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: C.copper400 }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━ ABOUT ━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 'about' && (
          <div className="mx-auto max-w-3xl px-4 py-10">
            <SectionHeading
              eyebrow="Our Story"
              title="A Legacy of Trust"
              subtitle="Three and a half decades of dedicated television repair service in Yangon."
              eyebrowColor={C.copper400}
            />

            {/* Founder card */}
            <div className="mb-6 rounded-2xl border p-6"
              style={{
                background: `linear-gradient(135deg, ${C.forest800}cc, ${C.ink900})`,
                borderColor: `${C.copper400}44`,
              }}>
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: `linear-gradient(135deg, ${C.copper500}, ${C.copper400})` }}>
                  <Users className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest" style={{ color: C.copper400 }}>
                    Founder &amp; Master Technician
                  </p>
                  <h3 className="text-lg font-bold text-white">U Win Naing</h3>
                  <p className="text-xs text-slate-500">Since 1989</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                U Win Naing founded Sein Pan Electronic Service in 1989 with a single vision: to provide
                honest, expert television repair to the community. His passion for electronics and unwavering
                commitment to quality swiftly earned the trust of hundreds of households in South Okkalapa —
                a legacy that endures in North Okkalapa today.
              </p>
            </div>

            {/* Timeline */}
            <div className="mb-6">
              <h3 className="mb-5 flex items-center gap-2 font-semibold text-white">
                <Calendar className="h-4 w-4" style={{ color: C.pcb400 }} />
                Our Journey
              </h3>
              <div className="space-y-0">
                {TIMELINE.map((item, i) => (
                  <div key={item.year} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="mt-1.5 h-3 w-3 flex-shrink-0 rounded-full"
                        style={{ background: item.dot }} />
                      {i < TIMELINE.length - 1 && (
                        <span className="my-1 w-px flex-1" style={{ background: C.line }} />
                      )}
                    </div>
                    <div className="pb-5">
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="rounded-md px-2 py-0.5 text-[10px] font-bold text-white"
                          style={{ background: item.dot }}>
                          {item.year}
                        </span>
                        <span className="text-sm font-semibold text-white">{item.title}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why choose us */}
            <div className="rounded-2xl border p-5" style={{ background: C.ink900, borderColor: C.line }}>
              <h3 className="mb-4 font-semibold text-white">Why Choose Sein Pan</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {WHY_US.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 rounded-xl p-3"
                    style={{ background: C.ink800 }}>
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{ background: `${C.pcb500}22` }}>
                      <Icon className="h-4 w-4" style={{ color: C.pcb400 }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{title}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━ INQUIRY ━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 'inquiry' && (
          <div className="mx-auto max-w-xl px-4 py-10">
            <SectionHeading
              eyebrow="Free Consultation"
              title="Book Your TV Repair"
              subtitle="Fill out the form and we'll get back to you within 24 hours."
              eyebrowColor={C.pcb400}
            />

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Full Name *
                </label>
                <input type="text" name="fullName" value={form.fullName}
                  onChange={handleChange} required placeholder="Enter your full name"
                  className={field} />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Phone Number *
                </label>
                <input type="tel" name="phone" value={form.phone}
                  onChange={handleChange} required placeholder="09xxxxxxxxx"
                  className={field} />
              </div>

              {/* Brand + Model */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    TV Brand *
                  </label>
                  <input type="text" name="tvBrand" value={form.tvBrand}
                    onChange={handleChange} required placeholder="e.g. Samsung"
                    className={field} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    TV Model
                  </label>
                  <input type="text" name="tvModel" value={form.tvModel}
                    onChange={handleChange} placeholder="e.g. UA55NU7100"
                    className={field} />
                </div>
              </div>

              {/* Issue */}
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Issue Description *
                </label>
                <textarea name="issueDescription" value={form.issueDescription}
                  onChange={handleChange} required rows={4} className={`${field} resize-none`}
                  placeholder="Describe the problem (e.g. 'No picture but has sound', 'Screen flickering', 'Won't turn on'…)" />
              </div>

              {/* File upload */}
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Attach Photo (Optional)
                </label>
                <input type="file" ref={fileRef} onChange={handleFile}
                  accept="image/*" className="hidden" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="group w-full rounded-xl border-2 border-dashed p-4 text-center transition-all"
                  style={{ borderColor: C.line }}
                >
                  <Upload className="mx-auto mb-1.5 h-5 w-5 text-slate-500 transition-colors group-hover:text-emerald-400" />
                  {form.fileName ? (
                    <span className="text-xs font-semibold" style={{ color: C.pcb300 }}>{form.fileName}</span>
                  ) : (
                    <>
                      <p className="text-xs text-slate-500">Click to upload a photo of the issue</p>
                      <p className="mt-0.5 text-[10px] text-slate-600">PNG, JPG up to 10 MB</p>
                    </>
                  )}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: `linear-gradient(135deg, ${C.pcb500}, ${C.pcb400})`,
                  boxShadow: `0 8px 30px -8px ${C.pcb500}60`,
                }}
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2"
                      style={{ borderColor: 'rgba(255,255,255,.3)', borderTopColor: '#fff' }} />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Repair Inquiry
                  </>
                )}
              </button>
              <p className="text-center text-[10px] text-slate-600">
                By submitting, you agree to be contacted by our team for repair consultation.
              </p>
            </form>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━ CONTACT ━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 'contact' && (
          <div className="mx-auto max-w-2xl px-4 py-10">
            <SectionHeading
              eyebrow="Get In Touch"
              title="Contact &amp; Location"
              subtitle="Find us at our North Okkalapa location near Maydar Wee Market."
              eyebrowColor="#a78bfa"
            />

            <div className="space-y-4">
              {/* Phone */}
              <div className="rounded-2xl border p-5" style={{ background: C.ink900, borderColor: C.line }}>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: '#1d4ed822' }}>
                    <Phone className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Call Us</p>
                    <p className="text-xs text-slate-500">Available during business hours</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {['09-XXXX-XXXXX', '09-YYYY-YYYYY'].map((num) => (
                    <a key={num} href={`tel:${num}`}
                      className="flex items-center justify-between rounded-xl px-4 py-3 transition-all hover:opacity-80"
                      style={{ background: C.ink800 }}>
                      <span className="text-sm font-medium text-white">{num}</span>
                      <PhoneCall className="h-4 w-4 text-blue-400" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Hours */}
              <div className="rounded-2xl border p-5" style={{ background: C.ink900, borderColor: C.line }}>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: `${C.copper400}22` }}>
                    <Clock className="h-5 w-5" style={{ color: C.copper300 }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Business Hours</p>
                    <p className="text-xs text-slate-500">Open 6 days a week</p>
                  </div>
                </div>
                <div className="divide-y" style={{ '--tw-divide-opacity': 1 }}>
                  {HOURS.map(({ day, hours, open }) => (
                    <div key={day} className="flex items-center justify-between py-2.5"
                      style={{ borderColor: C.line }}>
                      <span className="text-xs text-slate-400">{day}</span>
                      <span className={`text-xs font-semibold ${open ? 'text-green-400' : 'text-red-400'}`}>
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="rounded-2xl border p-5" style={{ background: C.ink900, borderColor: C.line }}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: '#16a34a22' }}>
                    <MapPin className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Our Location</p>
                    <p className="text-xs text-slate-500">North Okkalapa Township, Yangon</p>
                  </div>
                </div>

                <div className="mb-4 rounded-xl p-4" style={{ background: C.ink800 }}>
                  <p className="text-sm leading-relaxed text-slate-300">
                    Near <strong className="text-white">Maydar Wee Market (Maydarvi)</strong>,<br />
                    North Okkalapa Township,<br />
                    Yangon, Myanmar.
                  </p>
                  <div className="mt-3 border-t pt-3" style={{ borderColor: C.line }}>
                    <p className="text-[11px] text-slate-600">
                      <span className="text-slate-500">Previously at:</span> Near 14–15 Junction, 12 Quarter,
                      Yadanar Road, South Okkalapa
                    </p>
                  </div>
                </div>

                {/* Stylised map block */}
                <div className="overflow-hidden rounded-xl border" style={{ borderColor: C.line }}>
                  <div className="relative flex min-h-[200px] items-center justify-center p-6"
                    style={{ background: `linear-gradient(135deg, #03150f, #052017)` }}>
                    {/* Grid */}
                    <div className="pointer-events-none absolute inset-0 opacity-20">
                      {[...Array(7)].map((_, i) => (
                        <div key={`h${i}`} className="absolute w-full border-t"
                          style={{ borderColor: C.pcb500, top: `${(i + 1) * 12.5}%` }} />
                      ))}
                      {[...Array(7)].map((_, i) => (
                        <div key={`v${i}`} className="absolute h-full border-l"
                          style={{ borderColor: C.pcb500, left: `${(i + 1) * 12.5}%` }} />
                      ))}
                    </div>
                    {/* Roads */}
                    <div className="pointer-events-none absolute inset-0 opacity-40">
                      <div className="absolute w-full border-t-2" style={{ borderColor: C.copper400, top: '52%' }} />
                      <div className="absolute h-full border-l-2" style={{ borderColor: C.copper400, left: '38%' }} />
                    </div>
                    {/* Pin */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="flex h-14 w-14 animate-bounce items-center justify-center rounded-full border-4 border-white shadow-2xl"
                        style={{ background: '#ef4444' }}>
                        <MapPin className="h-7 w-7 text-white" />
                      </div>
                      <div className="mt-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-900 shadow-lg">
                        Sein Pan Electronic Service
                      </div>
                      <p className="mt-1 text-xs font-medium" style={{ color: C.pcb300 }}>
                        Near Maydar Wee Market
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3"
                    style={{ background: C.ink800 }}>
                    <span className="text-xs text-slate-400">North Okkalapa, Yangon</span>
                    <button className="flex items-center gap-1 text-xs font-semibold transition-colors hover:opacity-80"
                      style={{ color: C.pcb400 }}>
                      <MapPin className="h-3 w-3" />
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => go('inquiry')}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-white transition-all hover:opacity-90"
              style={{
                background: `linear-gradient(135deg, ${C.pcb500}, ${C.pcb400})`,
                boxShadow: `0 8px 30px -8px ${C.pcb500}55`,
              }}
            >
              <Wrench className="h-4 w-4" />
              Book a Repair Now
            </button>
          </div>
        )}
      </main>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer className="border-t px-4 py-8 md:mb-0 mb-16"
        style={{ background: C.ink900, borderColor: C.line }}>
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: `linear-gradient(135deg, ${C.pcb500}, ${C.copper400})` }}>
                <Tv className="h-5 w-5 text-white" />
              </div>
              <div className="text-left leading-tight">
                <p className="text-sm font-bold text-white">Sein Pan</p>
                <p className="text-[10px] font-semibold" style={{ color: C.copper300 }}>Electronic Service</p>
              </div>
            </div>

            <p className="mb-5 max-w-xs text-[11px] leading-relaxed text-slate-500">
              LED, LCD &amp; Plasma TV Repair Specialists. Trusted by thousands of families in Yangon since 1989.
            </p>

            <div className="mb-6 flex items-center gap-3">
              {[
                { icon: Share2, label: 'Facebook' },
                { icon: Globe,  label: 'Instagram' },
                { icon: Mail,   label: 'Email' },
              ].map(({ icon: Icon, label }) => (
                <button key={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-all hover:text-white"
                  style={{ background: C.ink800 }}
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            <div className="w-full border-t pt-4" style={{ borderColor: C.line }}>
              <p className="text-[10px] text-slate-600">
                © {new Date().getFullYear()} Sein Pan Electronic Service. All rights reserved.
              </p>
              <p className="mt-1 text-[10px] text-slate-700">
                Founded 1989 by U Win Naing · North Okkalapa Township, Yangon
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* ══════════════════ BOTTOM TAB BAR (mobile only) ══════════════════ */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t md:hidden"
        style={{ background: `${C.ink900}f5`, borderColor: C.line, backdropFilter: 'blur(12px)' }}>
        <div className="flex">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => go(id)}
              className="flex flex-1 flex-col items-center gap-1 py-2 transition-all"
              style={{ color: activeTab === id ? C.pcb400 : '#475569' }}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] font-semibold leading-none">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
