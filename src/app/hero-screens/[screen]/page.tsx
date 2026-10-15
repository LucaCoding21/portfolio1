import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomeHero from "@/components/HomeHero";
import { SCREENS } from "../screens";

// One state of the homepage hero, for the frames on the dev board
// (/hero-screens): the real hero and nav, started at that step. Development
// only.

export const metadata: Metadata = {
  title: "Hero screen",
  robots: { index: false, follow: false },
};

export default async function HeroScreen({ params }: { params: Promise<{ screen: string }> }) {
  if (process.env.NODE_ENV !== "development") notFound();
  const { screen: key } = await params;
  const screen = SCREENS.find((s) => s.key === key);
  if (!screen) notFound();

  return (
    <>
      {/* No Next dev badge in every frame. Errors still show when a screen
          is opened on its own. */}
      <style>{`nextjs-portal { display: none !important; }`}</style>
      <HomeHero ready preview={screen.preview} />
    </>
  );
}
