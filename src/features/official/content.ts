/**
 * Static, non-translated content for the official site. Every visible
 * string lives in locales/<lang>/official.json; this file only holds
 * structure: ids, icons, links and flags.
 */
import type { LucideIcon } from "lucide-react";
import {
  Award,
  Camera,
  ClipboardList,
  Cpu,
  Handshake,
  History,
  Home,
  Info,
  Lightbulb,
  Monitor,
  Phone,
  PhoneCall,
  Radio,
  Shield,
  ShieldCheck,
  Tv,
  User,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

export const TAB_IDS = ["home", "services", "about", "inquiry", "contact"] as const;
export type TabId = (typeof TAB_IDS)[number];

export function isTabId(value: string): value is TabId {
  return (TAB_IDS as readonly string[]).includes(value);
}

export const NAV_TABS: readonly { id: TabId; Icon: LucideIcon }[] = [
  { id: "home", Icon: Home },
  { id: "services", Icon: Cpu },
  { id: "about", Icon: Info },
  { id: "inquiry", Icon: ClipboardList },
  { id: "contact", Icon: PhoneCall },
];

export type ServiceId = "led" | "lcd" | "plasma";

export interface ServiceMeta {
  id: ServiceId;
  Icon: LucideIcon;
  /** Tailwind class for the thin colour bar on the service card. */
  accentClass: string;
}

export const SERVICES: readonly [ServiceMeta, ...ServiceMeta[]] = [
  { id: "led", Icon: Monitor, accentClass: "bg-theme-color-3" },
  { id: "lcd", Icon: Tv, accentClass: "bg-theme-color-1" },
  { id: "plasma", Icon: Radio, accentClass: "bg-theme-color-4" },
];

/** Icons paired by index with translated lists. */
export const SKILL_ICONS: readonly LucideIcon[] = [Monitor, Tv, Radio, Cpu, Lightbulb, Zap];
export const TRUST_ICONS: readonly LucideIcon[] = [Shield, Award, Wrench, Zap];
export const ABOUT_STAT_ICONS: readonly LucideIcon[] = [History, Users, Wrench, Award];
export const PROCESS_ICONS: readonly LucideIcon[] = [ClipboardList, Phone, Wrench];
export const WHY_ICONS: readonly LucideIcon[] = [Award, ShieldCheck, Handshake];
export const GUIDE_ICONS: readonly LucideIcon[] = [User, Tv, ClipboardList, Camera];

/** Opening days, paired by index with contact.days (Mon–Fri, Sat, Sun). */
export const OPEN_DAYS: readonly boolean[] = [true, true, false];

export const LINKS = {
  maps: "https://maps.app.goo.gl/18ACK194oobVr4uP9?g_st=ic",
  facebook: "https://www.facebook.com/seinpanelectronic",
  messenger: "https://m.me/seinpanelectronic",
  viber: "viber://chat?number=%2B959423858609",
  tel: "tel:+959423858609",
} as const;

/** External links open in a new tab without handing over window.opener. */
export const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" } as const;
