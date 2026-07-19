'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import NewsletterSignup from '@/components/NewsletterSignup';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
};

export default function MeditationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-950 to-earth-950 text-earth-50">
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-28">
        <motion.header {...fadeInUp}>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-leaf-300">
            Meditation
          </p>
          <h1 className="mt-4 text-4xl font-bold text-earth-50 md:text-5xl">
            Learn to sit — then learn to use it.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-earth-200">
            Zen practice, stripped of mysticism and aimed at the pressures of
            leading. Start free with the weekly sit and guided audio; go deeper
            when you're ready.
          </p>
        </motion.header>

        {/* Weekly live sit */}
        <motion.section
          {...fadeInUp}
          className="mt-14 rounded-2xl border border-leaf-800 bg-gradient-to-br from-leaf-950/60 to-forest-900/40 p-8"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-leaf-300">
            Free · every week
          </p>
          <h2 className="mt-3 text-2xl font-bold text-earth-100">The weekly sit</h2>
          <p className="mt-3 max-w-2xl text-earth-200">
            Twenty minutes, Tuesday mornings, over Zoom. Register once and I'll
            send the link and a short note before each sit.
          </p>
          <div className="mt-6 max-w-xl">
            <NewsletterSignup type="live_sit" compact cta="Save my spot"
              payload={{ source: 'meditation_page' }} />
          </div>
        </motion.section>

        {/* Guided sits — honest about what's available today */}
        <motion.section {...fadeInUp} className="mt-10 rounded-2xl border border-forest-800 bg-forest-900/40 p-8">
          <h2 className="text-2xl font-bold text-earth-100">Guided sits</h2>
          <p className="mt-3 max-w-2xl text-earth-300">
            Short guided audio you can use before a meeting or at the end of a
            hard day — the Pre-Meeting Reset, the Decision-Fatigue Sit, and more
            as I record them. They go out to subscribers first. Join the list and
            I'll send them straight to your inbox.
          </p>
          <div className="mt-6 max-w-xl">
            <NewsletterSignup compact cta="Send me the sits"
              heading="" subheading="" payload={{ source: 'meditation_guided_sits' }} />
          </div>
        </motion.section>

        {/* Zen for Founders */}
        <motion.section {...fadeInUp} className="mt-10 rounded-2xl border border-forest-800 bg-forest-900/40 p-8">
          <p className="text-xs font-medium uppercase tracking-widest text-leaf-300">
            By application
          </p>
          <h2 className="mt-2 text-2xl font-bold text-earth-100">Zen for Founders</h2>
          <p className="mt-3 max-w-2xl text-earth-300">
            A 6-week cohort for founders and executives who want a real practice,
            not another app. Weekly live sessions, a daily protocol, and a small
            group of operators alongside you.
          </p>
          <Link
            href="/meditation/zen-for-founders"
            className="mt-6 inline-block rounded-lg bg-leaf-600 px-6 py-3 font-semibold text-earth-50 transition-colors hover:bg-leaf-500"
          >
            See the cohort
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
