import HomeFooter from "@/components/HomeFooter";
import Hero from "@/components/sight/Hero";
import QuestionsWall from "@/components/sight/QuestionsWall";
import ComesToYou from "@/components/sight/ComesToYou";
import Trust from "@/components/sight/Trust";
import HowItWorks from "@/components/sight/HowItWorks";
import Security from "@/components/sight/Security";
import Faq from "@/components/sight/Faq";
import FinalCta from "@/components/sight/FinalCta";

export default function SightPage() {
  return (
    <>
      {/* overflow-clip rounds FinalCta's edge-to-edge backdrop too, and unlike
          hidden it leaves sticky sections working */}
      <div className="relative z-10 overflow-clip rounded-b-[28px] bg-white md:rounded-b-[48px]">
        <main>
          <Hero />
          <QuestionsWall />
          <ComesToYou />
          <Trust />
          <HowItWorks />
          <Security />
          <Faq />
          <FinalCta />
        </main>
      </div>
      {/* The homepage's footer, pinned underneath; the page above lifts off it. */}
      <HomeFooter />
    </>
  );
}
