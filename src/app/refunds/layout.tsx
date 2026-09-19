import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns and Refunds Policy | USA Used Auto Parts",
  description: "Review the returns and refunds policy for USA Used Auto Parts. Learn about our 30-day return window and refund process.",
  alternates: {
    canonical: '/refunds',
  },
};

export default function RefundsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
