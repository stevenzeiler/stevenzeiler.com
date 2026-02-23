'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function HealthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-950 to-earth-950 text-earth-50 py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={fadeInUp.initial}
          animate={fadeInUp.animate}
          transition={fadeInUp.transition}
          className="space-y-8"
        >
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-earth-200 hover:text-leaf-400 transition-colors mb-6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-earth-100">Health</h1>
            <p className="text-earth-300 mt-2">
              Track your health metrics and progress over time.
            </p>
          </div>

          <motion.div
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={{ ...fadeInUp.transition, delay: 0.1 }}
          >
            <Link
              href="/health/weight"
              className="block bg-forest-900/80 hover:bg-forest-800/80 backdrop-blur-sm rounded-xl p-6 border border-forest-800 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-forest-800 flex items-center justify-center text-leaf-400 group-hover:bg-forest-700 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-earth-100 group-hover:text-leaf-50">
                    Weight tracker
                  </h2>
                  <p className="text-earth-400 text-sm mt-0.5">
                    Log your weight in kg or lbs and view your history on a chart.
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-earth-400 group-hover:text-leaf-400 transition-colors"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={{ ...fadeInUp.transition, delay: 0.15 }}
          >
            <Link
              href="/health/body-fat"
              className="block bg-forest-900/80 hover:bg-forest-800/80 backdrop-blur-sm rounded-xl p-6 border border-forest-800 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-forest-800 flex items-center justify-center text-leaf-400 group-hover:bg-forest-700 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-earth-100 group-hover:text-leaf-50">
                    Body fat %
                  </h2>
                  <p className="text-earth-400 text-sm mt-0.5">
                    Log your body fat percentage and view your history on a chart.
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-earth-400 group-hover:text-leaf-400 transition-colors"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={{ ...fadeInUp.transition, delay: 0.2 }}
          >
            <Link
              href="/health/coach"
              className="block bg-forest-900/80 hover:bg-forest-800/80 backdrop-blur-sm rounded-xl p-6 border border-forest-800 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-forest-800 flex items-center justify-center text-leaf-400 group-hover:bg-forest-700 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-earth-100 group-hover:text-leaf-50">
                    AI Coach
                  </h2>
                  <p className="text-earth-400 text-sm mt-0.5">
                    Voice or text. Get daily plans, nutrition and workout—goal 12% body fat.
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-earth-400 group-hover:text-leaf-400 transition-colors"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={{ ...fadeInUp.transition, delay: 0.25 }}
          >
            <Link
              href="/health/supplements"
              className="block bg-forest-900/80 hover:bg-forest-800/80 backdrop-blur-sm rounded-xl p-6 border border-forest-800 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-forest-800 flex items-center justify-center text-leaf-400 group-hover:bg-forest-700 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10.5 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5" />
                    <path d="M19 8v2a2 2 0 0 1-2 2h-1" />
                    <path d="M14 4v6a2 2 0 0 0 2 2h2" />
                    <path d="M14 4h5a2 2 0 0 1 2 2v2" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-earth-100 group-hover:text-leaf-50">
                    Supplements
                  </h2>
                  <p className="text-earth-400 text-sm mt-0.5">
                    Daily Wellness Calendar: vitamins, timing, checklist. Upload PDF for reference.
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-earth-400 group-hover:text-leaf-400 transition-colors"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
