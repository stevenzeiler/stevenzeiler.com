'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const schedule = [
  {
    time: '7:00 AM',
    title: 'Wake Up & Hydrate',
    activities: ['Light stretch', 'Drink 500ml water', 'Morning coffee (black/low-sugar)'],
    supplements: [],
    notes: 'Kickstart metabolism. Wait 1–2 hrs before most supps (caffeine interferes with Mg/Zn/Bs).',
  },
  {
    time: '8:00 AM',
    title: 'Breakfast',
    activities: ['Fats + protein: eggs, avocado, oats, nuts, fruit'],
    supplements: [
      { name: 'NaturalLife ONE Multivitamin', dose: '1 tablet' },
      { name: 'NaturalLife Triple Omega 3-6-9', dose: '1 softgel' },
      { name: 'ABIES Spirulina', dose: '1–2 capsules (start with 1)' },
      { name: 'NaturalLife Multi Antioxidant', dose: '1 capsule' },
    ],
    notes: 'Fat-soluble absorption best with fats. Covers basics + inflammation/recovery.',
  },
  {
    time: '10:00 AM',
    title: 'Mid-Morning',
    activities: ['Snack: yogurt/nuts', 'Optional workout'],
    supplements: [
      { name: 'Qualivits Folic Acid MethylFolate 800mcg', dose: '1 tablet (every other day)' },
      { name: 'NaturalLife Soy Lecithin 1200mg', dose: '1 softgel (optional)' },
    ],
    notes: 'Water-soluble timing post-coffee. Heart/energy (folate) + brain/liver boost (lecithin).',
  },
  {
    time: '1:00 PM',
    title: 'Lunch',
    activities: ['Balanced: protein, veggies, grains (e.g. chicken salad/quinoa)'],
    supplements: [
      { name: 'NaturalLife Vitamin C 1000mg', dose: '1 tablet' },
      { name: 'Qualivits GLOW Collagen & CoQ10', dose: '1 capsule (optional – skip if no skin/hair focus)' },
    ],
    notes: 'Immune/collagen boost. GLOW for beauty (pair with protein meal).',
  },
  {
    time: '4:00 PM',
    title: 'Afternoon Snack',
    activities: ['Fruit/smoothie'],
    supplements: [{ name: 'Psyllium Husk (raw)', dose: '1 tsp mixed in water/smoothie' }],
    notes: 'Gut health, regularity, cholesterol. Afternoon avoids bedtime bloat. Extra water!',
  },
  {
    time: '7:00 PM',
    title: 'Dinner',
    activities: ['Light: fish, salad, grains + some fats'],
    supplements: [
      { name: 'NaturalLife Magnesium + B6', dose: '1–2 capsules (start with 1)' },
    ],
    notes: 'Evening relaxation/muscle recovery. Aids sleep quality. Take with/after food.',
  },
  {
    time: '10:00 PM',
    title: 'Wind Down',
    activities: ['No screens', 'Herbal tea', 'Read/journal'],
    supplements: [],
    notes: 'Prep for rest. Magnesium helps unwind.',
  },
  {
    time: '11:00 PM',
    title: 'Sleep',
    activities: ['Aim 7–8 hours'],
    supplements: [],
    notes: 'Full recovery, hormone balance (testosterone support).',
  },
];

const checklist = [
  'Breakfast cluster (8 AM)',
  'Mid-morning (10 AM)',
  'Lunch (1 PM)',
  'Psyllium (4 PM)',
  'Magnesium (7 PM)',
  'Hydration 3L+',
  'Exercise/movement',
];

const proTips = [
  'If upset stomach: take with more food or start lower dose.',
  'Alternate folic every other day (multi has folate).',
  'Optional skips: Lecithin, GLOW, extra spirulina.',
  'Track weekly: Energy? Digestion? Sleep? Mood?',
  'Monthly: 1 week lighter doses if desired.',
  'Diet first – these enhance your healthy eating!',
  'Yearly bloodwork recommended (D, B12, Mg, etc.).',
];

const BUCKET = 'health-documents';
const PDF_PATH = 'daily-wellness-calendar.pdf';

export default function SupplementsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const run = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/sign-in');
        return;
      }
      const path = `${user.id}/${PDF_PATH}`;
      const { data: list } = await supabase.storage.from(BUCKET).list(user.id);
      const hasPdf = list?.some((f) => f.name === PDF_PATH);
      if (hasPdf) {
        const { data: signed } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(path, 3600);
        if (signed?.signedUrl) setPdfUrl(signed.signedUrl);
      }
      setLoading(false);
    };
    run();
  }, [router, supabase.auth]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      setUploadError('Please select a PDF file.');
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    setUploading(true);
    setUploadError(null);
    const path = `${user.id}/${PDF_PATH}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      upsert: true,
      contentType: 'application/pdf',
    });
    if (error) {
      setUploadError(error.message);
      setUploading(false);
      return;
    }
    const { data: signed } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 3600);
    if (signed?.signedUrl) setPdfUrl(signed.signedUrl);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-forest-950 to-earth-950 flex items-center justify-center">
        <motion.div
          className="w-12 h-12 border-2 border-forest-700 border-t-leaf-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-950 to-earth-950 text-earth-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <motion.div {...fadeInUp} className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <Link
              href="/health"
              className="inline-flex items-center text-earth-200 hover:text-leaf-400 transition-colors mb-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Health
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-earth-100">Supplement schedule</h1>
            <p className="text-earth-400 text-sm mt-1">
              Daily Wellness Calendar · Goal: energy, recovery, digestion, immunity
            </p>
          </div>
        </motion.div>

        <motion.div {...fadeInUp} className="bg-forest-900/80 rounded-xl border border-forest-800 p-4">
          <p className="text-earth-200 text-sm">
            <strong>Pill count:</strong> 6–9/day · <strong>Water:</strong> 3L+ · <strong>Exercise:</strong> 4–5×/week
          </p>
          <p className="text-earth-400 text-xs mt-1">For two healthy guys (age 36) · Starting Feb 12, 2026</p>
        </motion.div>

        <div className="space-y-6">
          {schedule.map((block, i) => (
            <motion.section
              key={block.time}
              {...fadeInUp}
              transition={{ delay: i * 0.05 }}
              className="bg-forest-900/80 backdrop-blur-sm rounded-xl border border-forest-800 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-forest-800 flex items-center gap-3">
                <span className="font-mono font-semibold text-leaf-400">{block.time}</span>
                <span className="font-medium text-earth-100">{block.title}</span>
              </div>
              <div className="p-4 space-y-3">
                {block.activities.length > 0 && (
                  <p className="text-earth-300 text-sm">{block.activities.join(' · ')}</p>
                )}
                {block.supplements.length > 0 && (
                  <ul className="space-y-1.5">
                    {block.supplements.map((s) => (
                      <li key={s.name} className="flex flex-wrap items-baseline gap-2 text-sm">
                        <span className="text-earth-100">{s.name}</span>
                        <span className="text-leaf-400 font-medium">{s.dose}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {block.notes && (
                  <p className="text-earth-500 text-xs italic">{block.notes}</p>
                )}
              </div>
            </motion.section>
          ))}
        </div>

        <motion.section {...fadeInUp} className="bg-forest-900/80 rounded-xl border border-forest-800 p-4">
          <h2 className="text-lg font-semibold text-earth-100 mb-3">Quick daily checklist</h2>
          <ul className="space-y-2">
            {checklist.map((item) => (
              <li key={item} className="flex items-center gap-2 text-earth-200 text-sm">
                <span className="text-earth-600">☐</span> {item}
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section {...fadeInUp} className="bg-forest-900/80 rounded-xl border border-forest-800 p-4">
          <h2 className="text-lg font-semibold text-earth-100 mb-3">Pro tips</h2>
          <ul className="space-y-1.5 text-earth-300 text-sm list-disc list-inside">
            {proTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </motion.section>

        <motion.section {...fadeInUp} className="bg-forest-900/80 rounded-xl border border-forest-800 p-4 space-y-3">
          <h2 className="text-lg font-semibold text-earth-100">Reference PDF</h2>
          <p className="text-earth-400 text-sm">
            Save the Daily Wellness Calendar PDF to Supabase for access from any device.
          </p>
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-leaf-400 hover:text-leaf-300 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              View / download PDF
            </a>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleUpload}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                uploading ? 'bg-forest-700 text-earth-400 cursor-not-allowed' : 'bg-leaf-600 hover:bg-leaf-700 text-earth-50'
              }`}
            >
              {uploading ? 'Uploading…' : pdfUrl ? 'Replace PDF' : 'Upload PDF'}
            </label>
          </div>
          {uploadError && <p className="text-red-400 text-sm">{uploadError}</p>}
        </motion.section>
      </div>
    </div>
  );
}
