'use client';

import { motion } from 'framer-motion';
import CorporateRequestForm from '@/components/CorporateRequestForm';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
};

const formats = [
  {
    title: '60–90 minute workshop',
    detail: 'A focused session for a leadership team or offsite — the practice, why it matters for decision quality, and time actually sitting together.',
  },
  {
    title: 'Half-day offsite session',
    detail: 'A deeper block that pairs practice with the specific pressures your team is under: conflict, pace, and sustained focus.',
  },
  {
    title: 'Ongoing program',
    detail: 'A recurring cadence that builds a genuine team practice over weeks or months, not a one-off talk that fades by Friday.',
  },
];

export default function CorporatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-950 to-earth-950 text-earth-50">
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-28">
        <motion.header {...fadeInUp}>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-leaf-300">
            For teams
          </p>
          <h1 className="mt-4 text-4xl font-bold text-earth-50 md:text-5xl">
            Bring the practice to your leadership team.
          </h1>
          <p className="mt-6 text-lg text-earth-200">
            Sessions and programs that give a team a shared, practical way to stay
            clear under pressure — taught by a founder, framed for people who make
            decisions for a living. No wellness clichés; just what practice does
            for judgment, composure, and focus.
          </p>
        </motion.header>

        <motion.section {...fadeInUp} className="mt-14 space-y-5">
          {formats.map((f) => (
            <div key={f.title} className="rounded-xl border border-forest-800 bg-forest-900/40 p-6">
              <h3 className="text-lg font-semibold text-earth-100">{f.title}</h3>
              <p className="mt-2 text-earth-300">{f.detail}</p>
            </div>
          ))}
        </motion.section>

        <motion.section {...fadeInUp} className="mt-8 rounded-2xl border border-forest-800 bg-forest-900/30 p-8">
          <h2 className="text-xl font-bold text-earth-100">What teams get out of it</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              'Composure in high-stakes moments',
              'A shared language for regulating pressure',
              'Better focus in deep work',
              'A practical reset the team can actually use',
            ].map((o) => (
              <li key={o} className="flex items-start gap-3 text-earth-200">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-leaf-400" />
                {o}
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section {...fadeInUp} id="request" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold text-earth-100">Request a session</h2>
          <p className="mt-3 text-earth-300">
            Tell me a little about your team and what's prompting this. I'll reply
            personally.
          </p>
          <div className="mt-8">
            <CorporateRequestForm />
          </div>
        </motion.section>
      </div>
    </div>
  );
}
