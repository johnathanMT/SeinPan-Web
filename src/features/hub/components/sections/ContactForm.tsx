import { useEffect, useId, useRef, useState, type ChangeEvent, type SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { resolveApiEndpoint } from "../../../../shared/lib/security/endpoint";
import { INQUIRY_LIMITS, validateInquiry, type FieldError, type InquiryField } from "../../../../shared/lib/security/sanitize";

/**
 * Inquiry form for the legacy /hub layout.
 *
 * Security posture (client side — the API must enforce the same rules):
 *  - every field is normalised, stripped of control / bidi characters,
 *    length-capped and validated before it leaves the browser
 *  - the endpoint must be https in production (resolveApiEndpoint)
 *  - no cookies are sent (credentials: "omit"), no referrer leak
 *  - bot friction: hidden honeypot + minimum time-on-form
 *  - requests time out instead of hanging forever
 *
 * POSTs JSON { name, email, phone, message } to `${VITE_API_URL}/api/inquiries`.
 */
type Status = "idle" | "submitting" | "success" | "error" | "unavailable";
type Values = Record<InquiryField, string> & { company: string };

const EMPTY: Values = { name: "", email: "", phone: "", message: "", company: "" };
const MIN_FILL_MS = 2500;
const TIMEOUT_MS = 15000;

const glass =
  "rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_20px_50px_-20px_rgba(0,0,0,0.7)]";

const field =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-white placeholder:text-slate-400 outline-none transition focus:border-copper-500/50 focus:ring-2 focus:ring-copper-500/30 sm:text-sm";

const ERROR_KEY: Record<FieldError, string> = {
  required: "contact.required",
  invalidName: "contact.invalidName",
  invalidEmail: "contact.invalidEmail",
  invalidPhone: "contact.invalidPhone",
  tooManyLinks: "contact.tooManyLinks",
};

export function ContactForm() {
  const { t } = useTranslation("home");
  const ids = useId();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<InquiryField, FieldError>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const openedAt = useRef(Date.now());
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const set = (key: keyof Values) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: event.target.value }));

  const submit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    // Bots fill the invisible field or submit instantly: pretend success, send nothing.
    if (values.company || Date.now() - openedAt.current < MIN_FILL_MS) {
      setStatus("success");
      return;
    }

    const { data, errors: found, valid } = validateInquiry(values);
    setErrors(found);
    if (!valid) return;

    const endpoint = resolveApiEndpoint(import.meta.env.VITE_API_URL, "/api/inquiries", {
      production: import.meta.env.PROD,
      origin: window.location.origin,
    });
    if (!endpoint) {
      setStatus("unavailable");
      return;
    }

    setStatus("submitting");
    const controller = new AbortController();
    abortRef.current = controller;
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
        credentials: "omit",
        referrerPolicy: "no-referrer",
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      setValues(EMPTY);
    } catch {
      setStatus("error");
    } finally {
      window.clearTimeout(timer);
    }
  };

  if (status === "success") {
    return (
      <div role="status" className={`${glass} flex min-h-[320px] flex-col items-center justify-center p-8 text-center`}>
        <span aria-hidden="true" className="grid h-14 w-14 place-items-center rounded-full border border-copper-500/40 bg-copper-500/10 text-2xl text-copper-300">
          ✓
        </span>
        <p className="mt-4 max-w-xs text-sm text-slate-200">{t("contact.success")}</p>
      </div>
    );
  }

  const errorId = (k: InquiryField) => `${ids}-${k}-error`;
  const describe = (k: InquiryField) => (errors[k] ? errorId(k) : undefined);
  const errorText = (k: InquiryField) => {
    const code = errors[k];
    return code ? (
      <p id={errorId(k)} className="mt-1 text-xs text-red-300">
        {t(ERROR_KEY[code])}
      </p>
    ) : null;
  };

  return (
    <form onSubmit={(event) => void submit(event)} noValidate className={`${glass} relative p-6 sm:p-7`}>
      <p className="text-xs uppercase tracking-[0.12em] text-copper-400">{t("contact.label")}</p>
      <h3 className="mt-1 text-xl font-semibold text-white">{t("contact.title")}</h3>
      <p className="mt-1 text-sm text-slate-300">{t("contact.subtitle")}</p>

      {/* Honeypot: off-screen, unreachable by keyboard, ignored by assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={set("company")} />
        </label>
      </div>

      <div className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${ids}-name`} className="mb-1.5 block text-sm text-slate-300">
              {t("contact.name")}
            </label>
            <input
              id={`${ids}-name`}
              name="name"
              type="text"
              autoComplete="name"
              maxLength={INQUIRY_LIMITS.name}
              required
              className={field}
              placeholder={t("contact.placeholder.name")}
              value={values.name}
              onChange={set("name")}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describe("name")}
            />
            {errorText("name")}
          </div>
          <div>
            <label htmlFor={`${ids}-email`} className="mb-1.5 block text-sm text-slate-300">
              {t("contact.email")}
            </label>
            <input
              id={`${ids}-email`}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
              maxLength={INQUIRY_LIMITS.email}
              required
              className={field}
              placeholder={t("contact.placeholder.email")}
              value={values.email}
              onChange={set("email")}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describe("email")}
            />
            {errorText("email")}
          </div>
        </div>

        <div>
          <label htmlFor={`${ids}-phone`} className="mb-1.5 block text-sm text-slate-300">
            {t("contact.phone")}
          </label>
          <input
            id={`${ids}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={INQUIRY_LIMITS.phone}
            className={field}
            placeholder={t("contact.placeholder.phone")}
            value={values.phone}
            onChange={set("phone")}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describe("phone")}
          />
          {errorText("phone")}
        </div>

        <div>
          <label htmlFor={`${ids}-message`} className="mb-1.5 block text-sm text-slate-300">
            {t("contact.message")}
          </label>
          <textarea
            id={`${ids}-message`}
            name="message"
            rows={4}
            maxLength={INQUIRY_LIMITS.message}
            required
            className={`${field} resize-y`}
            placeholder={t("contact.placeholder.message")}
            value={values.message}
            onChange={set("message")}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describe("message")}
          />
          {errorText("message")}
        </div>

        <div aria-live="polite">
          {(status === "error" || status === "unavailable") && (
            <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {t(status === "error" ? "contact.error" : "contact.unavailable")}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-copper-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-copper-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {status === "submitting" ? t("contact.sending") : t("contact.send")}
          {status !== "submitting" && <span aria-hidden="true">→</span>}
        </button>
      </div>
    </form>
  );
}

export default ContactForm;
