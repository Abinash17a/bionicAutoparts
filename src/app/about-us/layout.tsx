import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About USA Used Auto Parts | Recycled OEM Parts',
  description:
    'Learn about USA Used Auto Parts, our quality testing standards, nationwide salvage partner network, and commitment to affordable recycled OEM auto parts.',
  alternates: {
    canonical: '/about-us',
  },
  openGraph: {
    title: 'About USA Used Auto Parts | Recycled OEM Parts',
    description:
      'Learn about our quality testing standards, nationwide salvage yard network, and 6-month warranty on recycled OEM auto parts.',
    url: '/about-us',
  },
};

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
