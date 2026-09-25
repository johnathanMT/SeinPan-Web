import { Award } from "lucide-react";
import { keepWords } from "../../../shared/lib/text";
import { WHY_ICONS } from "../content";
import { useOfficial } from "../hooks/useOfficial";
import { useTheme } from "../theme";
import type { WhyItem } from "../types";
import { Reveal, RevealGroup, RevealItem } from "../ui/Reveal";
import { SectionHeading, SectionLabel } from "../ui/Section";

export function WhyChooseUs() {
  const { t, list } = useOfficial();
  const { tokens: T } = useTheme();
  const items = list<WhyItem>("why.items");

  return (
    <section className={`cv-auto px-4 py-20 sm:py-28 ${T.sec}`}>
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-3xl">
          <SectionLabel>{t("why.title")}</SectionLabel>
          <SectionHeading>{t("why.subtitle")}</SectionHeading>
        </Reveal>
        <RevealGroup as="ul" className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map(({ heading, body }, i) => {
            const Icon = WHY_ICONS[i] ?? Award;
            return (
              <RevealItem as="li" key={heading} className="h-full">
                <article className={`flex h-full flex-col rounded-2xl border p-7 transition duration-300 hover:-translate-y-1 ${T.card} ${T.cardHov}`}>
                  <div aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-xl bg-theme-color-1 shadow-sm">
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
