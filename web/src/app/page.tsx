import { Nav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { SchedulePreview } from "@/components/marketing/schedule-preview";
import { Corridors } from "@/components/marketing/corridors";
import { WhyUs } from "@/components/marketing/why-us";
import { Operators } from "@/components/marketing/operators";
import { BecomeHero } from "@/components/marketing/become-hero";
import { Faq } from "@/components/marketing/faq";
import { Footer } from "@/components/marketing/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <SchedulePreview />
        <Corridors />
        <Operators />
        <WhyUs />
        <BecomeHero />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
