import { ClipboardList, Phone } from "lucide-react";
import { keepWords, toLocalDigits } from "../../../shared/lib/text";
import { EXTERNAL, GUIDE_ICONS, LINKS } from "../content";
import { useOfficial } from "../hooks/useOfficial";
import { useTheme } from "../theme";
import { MessengerIcon, ViberIcon } from "../ui/BrandIcons";
import { Reveal } from "../ui/Reveal";
import { SectionHeading, SectionLabel } from "../ui/Section";
import { BRAND_BUTTON, CTA } from "../ui/styles";

/**
 * Inquiries go straight to the shop through Messenger, Viber or a call —
 * no form, so no personal data is collected or stored by this site.
 */
export default function InquiryPage() {
  const { t, list, lang } = useOfficial();
  const { tokens: T } = useTheme();
  const steps = list<string>("inquiry.steps");

  return (
    <section className={`min-h-screen px-4 py-20 sm:py-28 ${T.sec}`}>
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <article className={`overflow-hidden rounded-[1.75rem] border p-6 shadow-md sm:p-10 ${T.card}`}>
            <SectionLabel>{t("nav.inquiry")}</SectionLabel>
            <SectionHeading>{t("inquiry.title")}</SectionHeading>
            <p className={`mt-4 text-sm leading-loose sm:text-base ${T.body}`}>{keepWords(t("inquiry.subtitle"))}</p>

            <ol className="mt-10 space-y-4">
              {steps.map((step, i) => {
                const Icon = GUIDE_ICONS[i] ?? ClipboardList;
                return (
                  <li key={step} className={`flex items-start gap-4 rounded-2xl border px-4 py-4 sm:px-5 ${T.soft}`}>
                    <span aria-hidden="true" className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-theme-color-1 shadow-sm">
                      <Icon size={20} className="text-theme-color-2" />
                      <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-theme-color-3 text-[11px] font-bold text-white">
                        {toLocalDigits(i + 1, lang)}
                      </span>
                    </span>
                    <p className={`pt-2.5 text-sm font-semibold leading-snug sm:text-[15px] ${T.h}`}>{keepWords(step)}</p>
                  </li>
                );
              })}
            </ol>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <a href={LINKS.messenger} {...EXTERNAL} aria-label={t("inquiry.messengerAria")} className={`${BRAND_BUTTON} bg-brand-messenger`}>
                <MessengerIcon size={18} />
                <span>{keepWords(t("inquiry.messenger"))}</span>
              </a>
              <a href={LINKS.viber} {...EXTERNAL} aria-label={t("inquiry.viberAria")} className={`${BRAND_BUTTON} bg-brand-viber`}>
                <ViberIcon size={18} />
                <span>{keepWords(t("inquiry.viber"))}</span>
              </a>
              <a href={LINKS.tel} aria-label={t("inquiry.callAria")} className={`${CTA} px-4 shadow-md shadow-black/10`}>
                <Phone size={16} aria-hidden="true" />
                <span>{keepWords(t("inquiry.call"))}</span>
              </a>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
