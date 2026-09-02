import Footer from "@/components/Footer";
import Hero from "@/components/sight/Hero";
import DayWithSight from "@/components/sight/DayWithSight";
import QuestionsWall from "@/components/sight/QuestionsWall";
import ThreeAltitudes from "@/components/sight/ThreeAltitudes";
import CostOfLate from "@/components/sight/CostOfLate";
import Founder from "@/components/sight/Founder";
import Offer from "@/components/sight/Offer";
import Faq from "@/components/sight/Faq";
import FinalCta from "@/components/sight/FinalCta";

export default function SightPage() {
  return (
    <>
      <div className="relative z-10 bg-white">
        <main>
          <Hero />
          <DayWithSight />
          <QuestionsWall />
          <ThreeAltitudes />
          <CostOfLate />
          <Founder />
          <Offer />
          <Faq />
          <FinalCta />
        </main>
      </div>
      <Footer />
    </>
  );
}
