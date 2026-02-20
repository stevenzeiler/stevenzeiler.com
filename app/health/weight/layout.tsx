import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Weight Tracker',
  description: 'Track your weight in kg or lbs and view your history.',
  manifest: '/manifest-weight.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Weight',
  },
  icons: {
    icon: '/icons/weight-icon.svg',
    apple: '/icons/weight-icon.svg',
  },
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
