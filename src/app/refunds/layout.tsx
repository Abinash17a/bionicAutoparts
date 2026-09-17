import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns and Refunds Policy | USA Used Auto Parts',
  description:
    'Read USA Used Auto Parts 30-day return policy and refund guidelines. Clear terms on freight inspection, RMA requests, and refund processing timelines.',
  alternates: {
    canonical: '/refunds',
  },
  openGraph: {
    title: 'Returns and Refunds Policy | USA Used Auto Parts',
    description:
      '30-day return window, freight inspection instructions, and transparent refund timelines for recycled OEM auto parts.',
    url: '/refunds',
  },
};

export default function RefundsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
