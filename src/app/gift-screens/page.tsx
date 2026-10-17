import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Board from "./Board";
import { GROUPS, SAMPLE } from "./screens";

// Dev board: every screen of the referral gift flow on one page, as live
// frames of the real pages with sample data. Development only.

export const metadata: Metadata = {
  title: "Gift screens",
  robots: { index: false, follow: false },
};

export default function GiftScreens() {
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <Board
      groups={GROUPS}
      text={{
        from: SAMPLE.client.firstName,
        story: `${SAMPLE.client.firstName} from ${SAMPLE.client.business} sends ${SAMPLE.friend} a gift`,
        note: SAMPLE.note,
        title: `${SAMPLE.friend}, ${SAMPLE.client.firstName} sent you a gift`,
      }}
    />
  );
}
