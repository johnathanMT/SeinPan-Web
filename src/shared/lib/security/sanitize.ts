/**
 * Client-side input hygiene for anything a visitor types.
 *
 * IMPORTANT: this is defence-in-depth and UX, not the security boundary.
 * A request can bypass the browser entirely, so the API MUST repeat
 * validation, use parameterised queries (EF Core does by default) and
 * HTML-encode on output (e.g. in the admin dashboard). See SECURITY.md.
 *
 * What we do here:
 *  - Unicode NFC normalisation (one canonical form for storage and search)
 *  - strip C0/C1 control characters (keeping \n in multi-line fields)
 *  - strip bidirectional override characters (used for spoofing, the
 *    "Trojan Source" class of attacks) and the BOM
 *  - collapse whitespace, trim, clamp length without splitting a grapheme
 *    (important for Burmese stacked characters and emoji)
 *
 * We deliberately do NOT HTML-escape here: React escapes on render, and
 * escaping before storage corrupts data (double-encoding). Encoding is an
 * output concern.
 */
import { toAsciiDigits } from "../text";

// eslint-disable-next-line no-control-regex
const CONTROL_EXCEPT_TAB_NL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;
const BIDI_AND_BOM = /[\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g;

export interface SanitizeOptions {
  maxLength: number;
  multiline?: boolean;
}

function clampGraphemes(value: string, max: number): string {
  if (value.length <= max) return value;
  const Segmenter = (Intl as { Segmenter?: typeof Intl.Segmenter }).Segmenter;
  if (Segmenter) {
    let out = "";
    let count = 0;
    for (const { segment } of new Segmenter(undefined, { granularity: "grapheme" }).segment(value)) {
      if (count === max) break;
      out += segment;
      count += 1;
    }
    return out;
  }
  // Fallback: never split a surrogate pair.
  return Array.from(value).slice(0, max).join("");
}

export function sanitizeText(input: unknown, { maxLength, multiline = false }: SanitizeOptions): string {
  if (typeof input !== "string") return "";
  let s = input.normalize("NFC").replace(/\r\n?/g, "\n");
  s = s.replace(CONTROL_EXCEPT_TAB_NL, "").replace(BIDI_AND_BOM, "");
  if (multiline) {
    s = s
      .split("\n")
      .map((line) => line.replace(/[ \t]+/g, " ").trim())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n");
  } else {
    s = s.replace(/\s+/g, " ");
  }
  return clampGraphemes(s.trim(), maxLength);
}

/* ── Inquiry validation ─────────────────────────────────────────────── */

export const INQUIRY_LIMITS = { name: 80, email: 254, phone: 20, message: 2000 } as const;

export type InquiryField = keyof typeof INQUIRY_LIMITS;
export type FieldError = "required" | "invalidName" | "invalidEmail" | "invalidPhone" | "tooManyLinks";

export interface InquiryInput {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface InquiryValidation {
  data: InquiryInput;
  errors: Partial<Record<InquiryField, FieldError>>;
  valid: boolean;
}

// Letters and combining marks from any script (Burmese needs \p{M}),
// plus the punctuation real names use.
const NAME_RE = /^[\p{L}\p{M}\p{N} .,'’()-]+$/u;
// Pragmatic RFC 5321 shape: a local part without spaces/brackets, and a
// dotted domain whose labels don't start or end with a hyphen.
const EMAIL_RE =
  /^[^\s@<>()[\]\\,;:"]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
const URL_RE = /\b(?:https?:\/\/|www\.)\S+/gi;
const MAX_LINKS = 2;

export function isValidEmail(value: string): boolean {
  return value.length <= INQUIRY_LIMITS.email && EMAIL_RE.test(value);
}

/** Digits (Burmese numerals accepted) with an optional leading +. */
export function normalizePhone(value: string): string {
  const ascii = toAsciiDigits(value).trim();
  const plus = ascii.startsWith("+") ? "+" : "";
  return plus + ascii.replace(/\D/g, "");
}

export function isValidPhone(value: string): boolean {
  if (/[^\d\s()+.-]/.test(toAsciiDigits(value))) return false;
  return /^\+?\d{6,15}$/.test(normalizePhone(value));
}

export function validateInquiry(raw: Record<InquiryField, unknown>, { phoneRequired = false } = {}): InquiryValidation {
  const data: InquiryInput = {
    name: sanitizeText(raw.name, { maxLength: INQUIRY_LIMITS.name }),
    email: sanitizeText(raw.email, { maxLength: INQUIRY_LIMITS.email }).toLowerCase(),
    phone: sanitizeText(raw.phone, { maxLength: INQUIRY_LIMITS.phone }),
    message: sanitizeText(raw.message, { maxLength: INQUIRY_LIMITS.message, multiline: true }),
  };

  const errors: Partial<Record<InquiryField, FieldError>> = {};
  if (!data.name) errors.name = "required";
  else if (!NAME_RE.test(data.name)) errors.name = "invalidName";

  if (!data.email) errors.email = "required";
  else if (!isValidEmail(data.email)) errors.email = "invalidEmail";

  if (!data.phone) {
    if (phoneRequired) errors.phone = "required";
  } else if (!isValidPhone(data.phone)) {
    errors.phone = "invalidPhone";
  } else {
    data.phone = normalizePhone(data.phone);
  }

  if (!data.message) errors.message = "required";
  else if ((data.message.match(URL_RE)?.length ?? 0) > MAX_LINKS) errors.message = "tooManyLinks";

  return { data, errors, valid: Object.keys(errors).length === 0 };
}
