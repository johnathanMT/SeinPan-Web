import { About } from "./About";
import { BrandMarquee } from "./BrandMarquee";
import { ClosingBand } from "./ClosingBand";
import { Hero } from "./Hero";
import { HomeServices } from "./HomeServices";
import { ProcessStrip } from "./ProcessStrip";
import { TechnicianCard } from "./TechnicianCard";
import { WhyChooseUs } from "./WhyChooseUs";

export function HomePage() {
  return (
    <>
      <Hero />
      <TechnicianCard />
      <About featured />
      <BrandMarquee />
      <HomeServices />
      <ProcessStrip />
      <WhyChooseUs />
      <ClosingBand />
    </>
  );
}
