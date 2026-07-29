'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import NewsletterSignup from '@/components/NewsletterSignup';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
};

const audiences = [
  { title: 'Founders', pain: 'Decision fatigue, reactivity, and the 3am wake-ups that never quite stop.' },
  { title: 'Executives', pain: 'Composure in the room when the stakes — and the scrutiny — are highest.' },
  { title: 'Coaches', pain: 'A practice of your own, plus something real to give the leaders you advise.' },
  { title: 'Athletes', pain: 'Focus before performance, and a way to actually switch off and recover.' },
];

const outcomes = [
  'Clearer decisions when the load is heaviest',
  'Emotional regulation in conflict and negotiation',
  'Sustained deep work without burning out',
  'Recovery from decision fatigue',
  'Sleep that returns when the mind quiets',
];

const offers = [
  {
    title: 'Zen for Founders',
    detail: 'A 6-week cohort, 8–10 people. Weekly live session, a daily practice protocol, and a small group of operators sitting alongside you.',
    meta: 'By application',
    href: '/meditation/zen-for-founders',
    cta: 'See the cohort',
    primary: true,
  },
  {
    title: '1:1 practice coaching',
    detail: 'Monthly, private. Your practice built around your calendar and the specific pressures you carry. Small number of seats.',
    meta: 'Limited',
    href: '/meditation/zen-for-founders#one-on-one',
    cta: 'Enquire',
    primary: false,
  },
  {
    title: 'Corporate & offsites',
    detail: 'Workshops and offsite sessions for leadership teams — 60–90 minute sessions through half-day intensives.',
    meta: 'For teams',
    href: '/corporate',
    cta: 'Request a session',
    primary: false,
  },
];

interface ImageData {
  name: string;
  url: string;
}

export default function Home() {
  const [images, setImages] = useState<ImageData[]>([]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchImages() {
      try {
        const { data: files, error } = await supabase.storage
          .from('public-images-yoga-meditation')
          .list();
        if (!error && files && files.length > 0) {
          const urls = files.map((file) => ({
            name: file.name,
            url: supabase.storage
              .from('public-images-yoga-meditation')
              .getPublicUrl(file.name).data.publicUrl,
          }));
          setImages(urls);
        }
      } catch (err) {
        console.error('Error fetching images:', err);
      }
    }
    fetchImages();
  }, [supabase]);

  const heroImage = images[0]?.url;
  const aboutImage = images[1]?.url ?? images[0]?.url;

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-950 to-earth-950 text-earth-50">
      {/* 1. Hero */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden">
        {heroImage && (
          <div className="absolute inset-0">
            <img src={heroImage} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-forest-950/85 via-forest-950/80 to-earth-950/95" />
          </div>
        )}
        <div className="relative mx-auto max-w-5xl px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-leaf-300">
              Zen practice for decision-makers
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-earth-50 md:text-6xl">
              Clarity under pressure — trained, not hoped for.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-earth-200 md:text-xl">
              Meditation for founders and executives, taught by a working founder
              who has sat for twenty years. Learn to think clearly in the moments
              that decide everything — and to put the work down when it's done.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="#weekly-sit"
                className="rounded-lg bg-leaf-600 px-7 py-3 text-center font-semibold text-earth-50 transition-colors hover:bg-leaf-500"
              >
                Join the free weekly sit
              </a>
              <a
                href="#newsletter"
                className="rounded-lg border border-forest-600 px-7 py-3 text-center font-semibold text-earth-100 transition-colors hover:bg-forest-900/60"
              >
                Read the weekly note
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-28 px-6 py-24">
        {/* 2. Who this is for / outcomes */}
        <motion.section {...fadeInUp} className="space-y-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-earth-100">For people who run things</h2>
            <p className="mt-4 text-earth-300">
              This isn't a relaxation app or spiritual escape. It's contemplative
              practice translated into the language of performance — clarity,
              judgment, and regulation when the outcome matters.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((a) => (
              <div
                key={a.title}
                className="rounded-xl border border-forest-800 bg-forest-900/40 p-6"
              >
                <h3 className="text-lg font-semibold text-earth-100">{a.title}</h3>
                <p className="mt-2 text-sm text-earth-300">{a.pain}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-forest-800 bg-forest-900/30 p-8">
            <p className="text-sm font-medium uppercase tracking-widest text-leaf-300">
              What practice builds
            </p>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {outcomes.map((o) => (
                <li key={o} className="flex items-start gap-3 text-earth-200">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-leaf-400" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* 3. Free flagship: the weekly live sit */}
        <motion.section
          {...fadeInUp}
          id="weekly-sit"
          className="scroll-mt-24 rounded-2xl border border-leaf-800 bg-gradient-to-br from-leaf-950/60 to-forest-900/40 p-8 md:p-12"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-leaf-300">
            Free · every week
          </p>
          <h2 className="mt-3 text-3xl font-bold text-earth-100">The weekly sit</h2>
          <p className="mt-4 max-w-2xl text-earth-200">
            Twenty minutes, Tuesday mornings, over Zoom. Two minutes of framing,
            fifteen minutes sitting together, three minutes to close. No
            experience needed — just a chair and a door you can shut. Register
            once and I'll send the link each week.
          </p>
          <div className="mt-8 max-w-xl">
            <NewsletterSignup
              type="live_sit"
              compact
              cta="Save my spot"
              payload={{ source: 'home_weekly_sit' }}
            />
            <p className="mt-3 text-sm text-earth-400">
              Email only. I send the link and a short note before each sit — nothing else.
            </p>
          </div>
        </motion.section>

        {/* 4. About in brief */}
        <motion.section {...fadeInUp} id="about" className="scroll-mt-24">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-5">
            <div className="md:col-span-2">
              {aboutImage ? (
                <img
                  src={aboutImage}
                  alt="Steven Zeiler"
                  className="aspect-[4/5] w-full rounded-2xl border border-forest-800 object-cover"
                />
              ) : (
                <div className="aspect-[4/5] w-full rounded-2xl border border-forest-800 bg-forest-900/50" />
              )}
            </div>
            <div className="md:col-span-3">
              <h2 className="text-3xl font-bold text-earth-100">
                A founder who sits
              </h2>
              <p className="mt-4 text-earth-300">
                I'm Steven Zeiler. I build companies — currently Huge AI — and I've
                practiced Zen and yoga for two decades. I teach from both sides:
                the pressure of running something real, and a tradition that has
                spent centuries on the mind under strain.
              </p>
              <p className="mt-4 text-earth-300">
                What I teach isn't therapy and it isn't a promise. It's practice —
                the concrete mechanics of attention, breath, and posture — aimed at
                the situations you actually face: the board meeting, the layoff,
                the raise that's slipping, the conversation you've been avoiding.
              </p>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-2 font-semibold text-leaf-300 hover:text-leaf-200"
              >
                Read the full story →
              </Link>
            </div>
          </div>
        </motion.section>

        {/* 5. Offers */}
        <motion.section {...fadeInUp} className="space-y-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-earth-100">Work with me</h2>
            <p className="mt-4 text-earth-300">
              Start free with the weekly sit and the newsletter. When you're ready
              to go deeper, there are three ways in.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {offers.map((o) => (
              <div
                key={o.title}
                className={`flex flex-col rounded-xl border p-6 ${
                  o.primary
                    ? 'border-leaf-700 bg-leaf-900/30'
                    : 'border-forest-800 bg-forest-900/40'
                }`}
              >
                <span className="text-xs font-medium uppercase tracking-widest text-leaf-300">
                  {o.meta}
                </span>
                <h3 className="mt-2 text-xl font-semibold text-earth-100">{o.title}</h3>
                <p className="mt-3 flex-1 text-sm text-earth-300">{o.detail}</p>
                <Link
                  href={o.href}
                  className={`mt-6 inline-block rounded-lg px-4 py-2 text-center font-semibold transition-colors ${
                    o.primary
                      ? 'bg-leaf-600 text-earth-50 hover:bg-leaf-500'
                      : 'border border-forest-600 text-earth-100 hover:bg-forest-800'
                  }`}
                >
                  {o.cta}
                </Link>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 6. Credibility (real, not testimonial placeholders) */}
        <motion.section
          {...fadeInUp}
          className="grid grid-cols-1 gap-6 rounded-2xl border border-forest-800 bg-forest-900/30 p-8 sm:grid-cols-3"
        >
          <div>
            <p className="text-3xl font-bold text-leaf-300">20 yrs</p>
            <p className="mt-1 text-sm text-earth-300">Zen and yoga practice</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-leaf-300">Founder</p>
            <p className="mt-1 text-sm text-earth-300">Currently building Huge AI</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-leaf-300">Operator-led</p>
            <p className="mt-1 text-sm text-earth-300">Practice framed for real decisions</p>
          </div>
        </motion.section>

        {/* 7. Newsletter capture */}
        <motion.section
          {...fadeInUp}
          id="newsletter"
          className="scroll-mt-24 rounded-2xl border border-forest-800 bg-forest-900/40 p-8 text-center md:p-12"
        >
          <div className="mx-auto max-w-2xl">
            <NewsletterSignup />
          </div>
        </motion.section>
      </div>
    </div>
  );
}
