import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submission Received | USA Used Auto Parts',
  description: 'Thank you for your part inquiry submission. Our team is reviewing your fitment request.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ConfirmationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
