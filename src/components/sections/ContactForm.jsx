// src/components/sections/ContactForm.jsx
// Functional, i18n contact form in the PCB / glassmorphism theme.
//
// Backend wiring: posts JSON to the inquiry endpoint from your blueprint.
// Configure the API base in a .env file:  VITE_API_URL=https://your-api
// The form POSTs to `${VITE_API_URL}/api/inquiries` with:
//   { name, email, phone, message }
// (matches the Supabase `inquiries` table / route handler in the blueprint).
import { useState } from "react";
import { useTranslation } from "react-i18next";

const glass =
  "rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl " +
  "shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_20px_50px_-20px_rgba(0,0,0,0.7)]";

const field =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white " +
  "placeholder:text-slate-500 outline-none transition focus:border-copper-500/50 " +
  "focus:ring-2 focus:ring-copper-500/30";

const API_BASE = import.meta.env.VITE_API_URL || "";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const { t } = useTranslation("home");
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "", company: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!values.name.trim()) e.name = t("contact.required");
    if (!values.email.trim()) e.email = t("contact.required");
    else if (!EMAIL_RE.test(values.email)) e.email = t("contact.invalidEmail");
    if (!values.message.trim()) e.message = t("contact.required");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    // Honeypot: real users never fill the hidden "company" field. Bots do.
    if (values.company) {
      setStatus("success");
      return;
    }
    if (!validate()) return;
    setStatus("submitting");
    try {
      const res = await fetch(`${API_BASE}/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          message: values.message.trim(),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      setValues({ name: "", email: "", phone: "", message: "", company: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={`${glass} flex min-h-[320px] flex-col items-center justify-center p-8 text-center`}>
        <span className="grid h-14 w-14 place-items-center rounded-full border border-copper-500/40 bg-copper-500/10 text-2xl text-copper-300">
          ✓
        </span>
        <p className="mt-4 max-w-xs text-sm text-slate-200">{t("contact.success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={`${glass} p-6 sm:p-7`}>
      <p className="text-xs uppercase tracking-[0.12em] text-copper-400">{t("contact.label")}</p>
      <h3 className="mt-1 text-xl font-semibold text-white">{t("contact.title")}</h3>
      <p className="mt-1 text-sm text-slate-400">{t("contact.subtitle")}</p>

      {/* Honeypot (hidden from humans, off-screen, not focusable) */}
      <div aria-hidden className="absolute left-[-9999px] top-[-9999px]" tabIndex={-1}>
        <label>
          Company
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.company}
            onChange={set("company")}
          />
        </label>
      </div>

      <div className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-name" className="mb-1.5 block text-sm text-slate-300">
              {t("contact.name")}
            </label>
            <input
              id="cf-name"
              type="text"
              className={field}
              placeholder={t("contact.placeholder.name")}
              value={values.name}
              onChange={set("name")}
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="cf-email" className="mb-1.5 block text-sm text-slate-300">
              {t("contact.email")}
            </label>
            <input
              id="cf-email"
              type="email"
              className={field}
              placeholder={t("contact.placeholder.email")}
              value={values.email}
              onChange={set("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="cf-phone" className="mb-1.5 block text-sm text-slate-300">
            {t("contact.phone")}
          </label>
          <input
            id="cf-phone"
            type="tel"
            className={field}
            placeholder={t("contact.placeholder.phone")}
            value={values.phone}
            onChange={set("phone")}
          />
        </div>

        <div>
          <label htmlFor="cf-message" className="mb-1.5 block text-sm text-slate-300">
            {t("contact.message")}
          </label>
          <textarea
            id="cf-message"
            rows={4}
            className={`${field} resize-y`}
            placeholder={t("contact.placeholder.message")}
            value={values.message}
            onChange={set("message")}
            aria-invalid={!!errors.message}
          />
          {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
        </div>

        {status === "error" && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {t("contact.error")}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-copper-500 px-6 py-3 text-sm font-semibold text-forest-950 transition hover:bg-copper-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {status === "submitting" ? t("contact.sending") : t("contact.send")}
          {status !== "submitting" && <span aria-hidden>→</span>}
        </button>
      </div>
    </form>
  );
}

export default ContactForm;
