import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { essays, getEssay } from '@/data/essays';
import NewsletterSignup from '@/components/NewsletterSignup';

export function generateStaticParams() {
  return essays.map((e) => ({ slug: e.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const essay = getEssay(params.slug);
  if (!essay) return { title: 'Not found — Steven Zeiler' };
  return {
    title: `${essay.title} — Steven Zeiler`,
    description: essay.dek,
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function EssayPage({
  params,
}: {
  params: { slug: string };
}) {
  const essay = getEssay(params.slug);
  if (!essay) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-950 to-earth-950 text-earth-50">
      <div className="mx-auto max-w-2xl px-6 pb-24 pt-28">
        <Link href="/writing" className="text-sm font-medium text-leaf-300 hover:text-leaf-200">
          ← All writing
        </Link>

        <header className="mt-8">
          <p className="text-sm text-earth-400">
            {formatDate(essay.date)} · {essay.readingMinutes} min read
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-earth-50">
            {essay.title}
          </h1>
          <p className="mt-4 text-xl text-earth-300">{essay.dek}</p>
        </header>

        <article className="mt-10 space-y-6 text-lg leading-relaxed text-earth-200">
          {essay.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </article>

        <div className="mt-16 border-t border-forest-800 pt-12">
          <NewsletterSignup />
        </div>
      </div>
    </div>
  );
}
