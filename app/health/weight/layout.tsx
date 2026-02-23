import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Weight Tracker | Health',
  description: 'Track your weight in kg or lbs and view your history.',
  openGraph: {
    title: 'Weight Tracker',
    description: 'Track your weight and view history.',
    url: '/health/weight',
  },
};

export default function WeightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
