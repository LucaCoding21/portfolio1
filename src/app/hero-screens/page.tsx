import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Board from "./Board";
import { GROUPS } from "./screens";

// Dev board: every state of the homepage hero's free site review on one
// page, as live frames of the real hero. Development only.

export const metadata: Metadata = {
  title: "Hero screens",
  robots: { index: false, follow: false },
};

export default function HeroScreens() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <Board groups={GROUPS} />;
}
