import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | USA Used Auto Parts",
  description: "Learn about USA Used Auto Parts. Quality used auto parts supplier serving all 50 states with reliable OEM components and nationwide shipping.",
  alternates: {
    canonical: '/about-us',
  },
};

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
