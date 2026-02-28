import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work | Cloverfield Studio — Web Design Surrey BC",
  description:
    "Browse our portfolio of custom web design projects. Websites built for small businesses in Surrey BC and Vancouver.",
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
