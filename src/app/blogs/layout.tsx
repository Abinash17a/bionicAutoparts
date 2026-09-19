import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auto Parts Blog | USA Used Auto Parts",
  description: "Read our blog for tips on finding quality used auto parts, OEM components, salvage yard guides, and vehicle maintenance advice.",
  alternates: {
    canonical: '/blogs',
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
