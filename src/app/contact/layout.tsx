import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | USA Used Auto Parts",
  description: "Get in touch with USA Used Auto Parts. Call, email, or visit us for help finding the right used auto parts for your vehicle.",
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
