import type { Metadata } from 'next';
import AddToHomeScreenHint from './AddToHomeScreenHint';

export const metadata: Metadata = {
  title: 'Health',
  description: 'Track weight and body fat %.',
  manifest: '/manifest-health.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Health',
  },
  icons: {
    icon: '/icons/weight-icon.svg',
    apple: '/icons/weight-icon.svg',
  },
  openGraph: {
    title: 'Health',
    description: 'Track weight and body fat %.',
    url: '/health',
  },
};

export default function HealthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AddToHomeScreenHint />
      {children}
    </>
  );
}
