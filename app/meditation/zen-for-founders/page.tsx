'use client';

import { motion } from 'framer-motion';
import CohortApplicationForm from '@/components/CohortApplicationForm';
import NewsletterSignup from '@/components/NewsletterSignup';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
};

const outcomes = [
  'A daily sitting practice you actually keep',
  'A wider gap between pressure and reaction',
  'Protocols for specific moments — pre-board, post-conflict, 3am',
  'Clearer thinking when decisions stack up',
];

const format = [
  { label: 'Six weeks', detail: 'A defined arc with a beginning and an end — not an open-ended subscription.' },
  { label: 'Weekly live session', detail: 'Sixty minutes together: teaching, sitting, and honest discussion of what came up.' },
  { label: 'Daily protocol', detail: 'A short, specific practice for each day — built for demanding calendars.' },
  { label: 'Small group', detail: '8–10 people, all operators. Enough to learn from each other, small enough to be seen.' },
];

export default function ZenForFoundersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-950 to-earth-950 text-earth-50">
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-28">
        {/* Problem */}
        <motion.header {...fadeInUp}>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-leaf-300">
            Zen for Founders · 6-week cohort
          </p>
          <h1 className="mt-4 text-4xl font-bold text-earth-50 md:text-5xl">
            You've read the books. You still can't switch off.
          </h1>
          <p className="mt-6 text-lg text-earth-200">
            Most founders know they should meditate. The apps don't stick, the
            retreats don't transfer to Monday, and the mind is still racing at 3am.
            This is a real practice — taught by someone who runs a company too —
            built to hold up under the actual conditions of leading one.
          </p>
        </motion.header>

        {/* Outcomes */}
        <motion.section {...fadeInUp} className="mt-14">
          <h2 className="text-2xl font-bold text-earth-100">What you'll leave with</h2>
          <ul className="mt-5 space-y-3">
            {outcomes.map((o) => (
              <li key={o} className="flex items-start gap-3 text-earth-200">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-leaf-400" />
                {o}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Format */}
        <motion.section {...fadeInUp} className="mt-14">
          <h2 className="text-2xl font-bold text-earth-100">The format</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {format.map((f) => (
              <div key={f.label} className="rounded-xl border border-forest-800 bg-forest-900/40 p-6">
                <h3 className="font-semibold text-earth-100">{f.label}</h3>
                <p className="mt-2 text-sm text-earth-300">{f.detail}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Who it's for / not for */}
        <motion.section {...fadeInUp} className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-leaf-800 bg-leaf-900/20 p-6">
            <h3 className="font-semibold text-leaf-200">This is for you if…</h3>
            <ul className="mt-3 space-y-2 text-sm text-earth-200">
              <li>You carry real decision-making weight.</li>
              <li>You've tried to build a practice and it hasn't stuck.</li>
              <li>You want the tradition taught seriously, not diluted.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-forest-800 bg-forest-900/40 p-6">
            <h3 className="font-semibold text-earth-100">It's not for you if…</h3>
            <ul className="mt-3 space-y-2 text-sm text-earth-300">
              <li>You're looking for a quick relaxation hack.</li>
              <li>You want therapy or clinical treatment.</li>
              <li>You can't commit to the daily practice for six weeks.</li>
            </ul>
          </div>
        </motion.section>

        {/* Price / scarcity */}
        <motion.section {...fadeInUp} className="mt-14 rounded-2xl border border-forest-800 bg-forest-900/30 p-8">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-3xl font-bold text-earth-100">$750–$1,500</span>
            <span className="text-earth-400">per seat · 8–10 seats per cohort</span>
          </div>
          <p className="mt-4 text-earth-300">
            Admission is by application, not checkout — I keep the group small on
            purpose and want it to be the right people. Apply below; I read every
            one myself and will be in touch about the next cohort and exact dates.
          </p>
        </motion.section>

        {/* Application */}
        <motion.section {...fadeInUp} id="apply" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold text-earth-100">Apply for the next cohort</h2>
          <p className="mt-3 text-earth-300">
            A few questions so I understand where you are. No payment now.
          </p>
          <div className="mt-8">
            <CohortApplicationForm />
          </div>
        </motion.section>

        {/* 1:1 */}
        <motion.section {...fadeInUp} id="one-on-one" className="mt-16 scroll-mt-24 border-t border-forest-800 pt-12">
          <h2 className="text-2xl font-bold text-earth-100">Prefer to work 1:1?</h2>
          <p className="mt-3 max-w-2xl text-earth-300">
            I take a small number of private clients each month — a practice built
            entirely around your calendar and the specific pressures you carry.
            Leave your email and a line about what you're after, and I'll tell you
            whether there's a fit and current availability.
          </p>
          <div className="mt-6 max-w-xl">
            <NewsletterSignup
              type="live_sit"
              compact
              cta="Enquire about 1:1"
              payload={{ source: 'one_on_one_coaching', interest: '1:1 coaching' }}
            />
          </div>
        </motion.section>
      </div>
    </div>
  );
}
