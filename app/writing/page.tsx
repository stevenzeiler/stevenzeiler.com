import Link from 'next/link';
import type { Metadata } from 'next';
import { essays } from '@/data/essays';

export const metadata: Metadata = {
  title: 'Writing — Steven Zeiler',
  description:
    'Essays on Zen practice and operating a company: clarity under pressure, decision fatigue, and the mechanics of sitting.',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function WritingPage() {
  const sorted = [...essays].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-950 to-earth-950 text-earth-50">
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-28">
        <header>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-leaf-300">
            Writing
          </p>
          <h1 className="mt-4 text-4xl font-bold text-earth-50 md:text-5xl">
            Practice, and the pressure of running things.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-earth-200">
            Short essays on the intersection of Zen practice and operating a
            company. The same pieces go out first to the newsletter.
          </p>
        </header>

        <div className="mt-14 divide-y divide-forest-800 border-y border-forest-800">
          {sorted.map((essay) => (
            <article key={essay.slug} className="py-8">
              <Link href={`/writing/${essay.slug}`} className="group block">
                <p className="text-sm text-earth-400">
                  {formatDate(essay.date)} · {essay.readingMinutes} min read
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-earth-100 transition-colors group-hover:text-leaf-300">
                  {essay.title}
                </h2>
                <p className="mt-2 text-earth-300">{essay.dek}</p>
                <span className="mt-4 inline-block font-semibold text-leaf-300 group-hover:text-leaf-200">
                  Read →
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
