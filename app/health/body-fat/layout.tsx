import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Body fat % | Health',
  description: 'Track your body fat percentage and view your history.',
  openGraph: {
    title: 'Body fat %',
    description: 'Track your body fat % and view history.',
    url: '/health/body-fat',
  },
};

export default function BodyFatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
