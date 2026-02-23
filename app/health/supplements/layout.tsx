import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Supplements | Health',
  description: 'Daily vitamin and supplement schedule.',
  openGraph: {
    title: 'Supplements',
    description: 'Daily supplement schedule.',
    url: '/health/supplements',
  },
};

export default function SupplementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
