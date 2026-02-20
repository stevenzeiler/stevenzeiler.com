'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { HealthWeightEntry } from '@/types/database';
import AddToHomeScreenHint from './AddToHomeScreenHint';

const KG_TO_LBS = 2.20462;

function kgToLbs(kg: number): number {
  return Math.round(kg * KG_TO_LBS * 10) / 10;
}

function lbsToKg(lbs: number): number {
  return Math.round((lbs / KG_TO_LBS) * 100) / 100;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export default function WeightTrackerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState<HealthWeightEntry[]>([]);
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [recordedAt, setRecordedAt] = useState(() =>
    new Date().toISOString().slice(0, 16)
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartUnit, setChartUnit] = useState<'kg' | 'lbs'>('kg');
  const [justAdded, setJustAdded] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchEntries = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error: fetchError } = await supabase
      .from('health_weight_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      return;
    }
    setEntries((data as HealthWeightEntry[]) ?? []);
  }, [supabase]);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/sign-in');
        return;
      }
      await fetchEntries();
      setIsLoading(false);
    };

    checkUser();
  }, [router, supabase.auth, fetchEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const num = parseFloat(weight);
    if (Number.isNaN(num) || num <= 0) {
      setError('Please enter a valid weight.');
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth/sign-in');
      return;
    }

    const weightKg = unit === 'lbs' ? lbsToKg(num) : num;
    setSubmitting(true);

    const { error: insertError } = await supabase.from('health_weight_entries').insert({
      user_id: user.id,
      weight_kg: weightKg,
      recorded_at: new Date(recordedAt).toISOString(),
    });

    setSubmitting(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }

    setWeight('');
    setRecordedAt(new Date().toISOString().slice(0, 16));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
    await fetchEntries();
  };

  const handleDelete = async (id: string) => {
    const { error: deleteError } = await supabase
      .from('health_weight_entries')
      .delete()
      .eq('id', id);

    if (!deleteError) await fetchEntries();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-forest-950 to-earth-950 flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-2 border-forest-700 border-t-leaf-500 border-solid rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  const chartData = [...entries]
    .reverse()
    .map((e) => ({
      date: new Date(e.recorded_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: '2-digit',
      }),
      fullDate: e.recorded_at,
      kg: Number(e.weight_kg),
      lbs: kgToLbs(Number(e.weight_kg)),
    }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-950 to-earth-950 text-earth-50 py-20 px-4">
      <AddToHomeScreenHint />
      <motion.div
        className="max-w-4xl mx-auto space-y-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div
          variants={staggerItem}
          className="flex items-center justify-between flex-wrap gap-4"
        >
          <div>
            <Link
              href="/health"
              className="inline-flex items-center text-earth-200 hover:text-leaf-400 transition-colors mb-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mr-2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Health
            </Link>
            <h1 className="text-3xl font-bold text-earth-100">Weight tracker</h1>
            <p className="text-earth-300 mt-1">
              Log your weight and view your history.
            </p>
          </div>
        </motion.div>

        <motion.form
          variants={staggerItem}
          onSubmit={handleSubmit}
          className="relative bg-forest-900/80 backdrop-blur-sm rounded-xl p-6 border border-forest-800 space-y-4 overflow-hidden"
        >
          <AnimatePresence>
            {justAdded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-leaf-500/10 pointer-events-none rounded-xl"
              >
                <motion.div
                  className="absolute inset-0 border-2 border-leaf-500 rounded-xl"
                  initial={{ scale: 0.95, opacity: 0.8 }}
                  animate={{ scale: 1.02, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div className="origin-center">
              <label htmlFor="weight" className="block text-sm font-medium text-earth-300 mb-1">
                Weight
              </label>
              <input
                id="weight"
                type="number"
                step={unit === 'kg' ? 0.1 : 0.5}
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={unit === 'kg' ? 'e.g. 72.5' : 'e.g. 160'}
                className="w-full bg-forest-800 border border-forest-700 rounded-lg px-4 py-2.5 text-earth-100 placeholder-earth-500 focus:outline-none focus:ring-2 focus:ring-leaf-500"
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <label className="block text-sm font-medium text-earth-300 mb-1">
                Unit
              </label>
              <div className="flex rounded-lg overflow-hidden border border-forest-700">
                <motion.button
                  type="button"
                  onClick={() => setUnit('kg')}
                  whileTap={{ scale: 0.97 }}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium ${
                    unit === 'kg'
                      ? 'bg-leaf-600 text-earth-50'
                      : 'bg-forest-800 text-earth-300 hover:bg-forest-700'
                  }`}
                >
                  kg
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setUnit('lbs')}
                  whileTap={{ scale: 0.97 }}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium ${
                    unit === 'lbs'
                      ? 'bg-leaf-600 text-earth-50'
                      : 'bg-forest-800 text-earth-300 hover:bg-forest-700'
                  }`}
                >
                  lbs
                </motion.button>
              </div>
            </motion.div>
          </div>
          <motion.div variants={staggerItem}>
            <label htmlFor="recordedAt" className="block text-sm font-medium text-earth-300 mb-1">
              Date & time
            </label>
            <input
              id="recordedAt"
              type="datetime-local"
              value={recordedAt}
              onChange={(e) => setRecordedAt(e.target.value)}
              className="w-full bg-forest-800 border border-forest-700 rounded-lg px-4 py-2.5 text-earth-100 focus:outline-none focus:ring-2 focus:ring-leaf-500"
            />
          </motion.div>
          {error && (
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-400 text-sm"
            >
              {error}
            </motion.p>
          )}
          <motion.button
            type="submit"
            disabled={submitting}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
            className="w-full sm:w-auto bg-leaf-600 hover:bg-leaf-700 disabled:opacity-50 text-earth-50 font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            {submitting ? 'Saving…' : 'Add entry'}
          </motion.button>
        </motion.form>

        {entries.length > 0 && (
          <>
            <motion.div
              variants={staggerItem}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-forest-900/80 backdrop-blur-sm rounded-xl p-6 border border-forest-800"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-earth-100">Weight history</h2>
                <div className="flex rounded-lg overflow-hidden border border-forest-700">
                  <motion.button
                    type="button"
                    onClick={() => setChartUnit('kg')}
                    whileTap={{ scale: 0.96 }}
                    className={`px-3 py-1.5 text-sm font-medium ${
                      chartUnit === 'kg'
                        ? 'bg-leaf-600 text-earth-50'
                        : 'bg-forest-800 text-earth-300 hover:bg-forest-700'
                    }`}
                  >
                    kg
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setChartUnit('lbs')}
                    whileTap={{ scale: 0.96 }}
                    className={`px-3 py-1.5 text-sm font-medium ${
                      chartUnit === 'lbs'
                        ? 'bg-leaf-600 text-earth-50'
                        : 'bg-forest-800 text-earth-300 hover:bg-forest-700'
                    }`}
                  >
                    lbs
                  </motion.button>
                </div>
              </div>
              <motion.div
                className="h-64 sm:h-80"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.35 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334d3d" />
                    <XAxis
                      dataKey="date"
                      stroke="#9ca89e"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#9ca89e"
                      tick={{ fontSize: 12 }}
                      domain={['dataMin - 2', 'dataMax + 2']}
                      tickFormatter={(v) =>
                        chartUnit === 'kg' ? `${v} kg` : `${v} lbs`
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a2e1f',
                        border: '1px solid #334d3d',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#e5e7e0' }}
                      formatter={(value: number) =>
                        [chartUnit === 'kg' ? `${value} kg` : `${value} lbs`, chartUnit]
                      }
                      labelFormatter={(label) => label}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={chartUnit}
                      stroke="#65a30d"
                      strokeWidth={2}
                      dot={{ fill: '#65a30d', r: 4 }}
                      activeDot={{ r: 6 }}
                      name={chartUnit === 'kg' ? 'Weight (kg)' : 'Weight (lbs)'}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="bg-forest-900/80 backdrop-blur-sm rounded-xl border border-forest-800 overflow-hidden"
            >
              <h2 className="text-lg font-bold text-earth-100 px-6 py-4 border-b border-forest-800">
                Recent entries
              </h2>
              <ul className="divide-y divide-forest-800">
                <AnimatePresence mode="popLayout">
                  {entries.map((entry, i) => (
                    <motion.li
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center justify-between px-6 py-3 hover:bg-forest-800/50"
                    >
                      <div>
                        <span className="font-medium text-earth-100">
                          {Number(entry.weight_kg).toFixed(1)} kg
                        </span>
                        <span className="text-earth-400 ml-2">
                          ({kgToLbs(Number(entry.weight_kg))} lbs)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-earth-500 text-sm">
                          {new Date(entry.recorded_at).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                        <motion.button
                          type="button"
                          onClick={() => handleDelete(entry.id)}
                          whileTap={{ scale: 0.92 }}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </motion.div>
          </>
        )}

        {entries.length === 0 && !isLoading && (
          <motion.p
            variants={staggerItem}
            className="text-earth-400 text-center py-8"
          >
            No entries yet. Add your first weight above.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
