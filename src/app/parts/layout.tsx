import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Used Auto Parts Catalog | USA Used Auto Parts",
  description: "Browse our full catalog of used auto parts. Search engines, transmissions, body parts and more for all makes and models.",
  alternates: {
    canonical: '/parts',
  },
};

export default function PartsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
