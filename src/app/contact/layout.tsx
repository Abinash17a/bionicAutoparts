import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact USA Used Auto Parts | Fitment and Parts Help',
  description:
    'Contact USA Used Auto Parts for recycled OEM engine, transmission, and body parts fitment verification. Fast quotes, phone support, and nationwide freight assistance.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact USA Used Auto Parts | Fitment and Parts Help',
    description:
      'Contact our automotive specialists for part compatibility, Hollander interchange, and freight shipping quotes.',
    url: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
