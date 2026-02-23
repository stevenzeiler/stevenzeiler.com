import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Coach | Health',
  description: 'Voice or text fitness coach. Daily plans, nutrition, workout—goal 12% body fat.',
  openGraph: {
    title: 'AI Coach',
    description: 'Voice or text coach for nutrition and workout plans.',
    url: '/health/coach',
  },
};

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
