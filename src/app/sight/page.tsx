import Footer from "@/components/Footer";
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
      <div className="relative z-10 bg-white">
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
      <Footer />
    </>
  );
}
