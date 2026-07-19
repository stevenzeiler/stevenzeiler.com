'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitInquiry } from '@/lib/inquiries';

const inputClass =
  'w-full rounded-lg border border-forest-700 bg-forest-950/60 px-4 py-3 text-earth-50 placeholder:text-earth-400 focus:border-leaf-500 focus:outline-none focus:ring-1 focus:ring-leaf-500';
const labelClass = 'block text-sm font-medium text-earth-200';

export default function CohortApplicationForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    why: '',
    history: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    const { ok, error } = await submitInquiry({
      type: 'cohort_application',
      email: form.email,
      name: form.name,
      payload: {
        role_company: form.role,
        why_now: form.why,
        meditation_history: form.history,
      },
    });
    if (ok) {
      setStatus('done');
      setMessage(
        "Application received. I read every one personally and will be in touch about the next cohort."
      );
    } else {
      setStatus('error');
      setMessage(error || 'Something went wrong. Please try again.');
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-xl border border-leaf-700 bg-leaf-900/40 p-6 text-earth-100">
        <p className="font-medium text-leaf-200">Thank you for applying.</p>
        <p className="mt-1 text-earth-200">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelClass} htmlFor="name">Name</label>
          <input id="name" className={inputClass} required value={form.name}
            onChange={(e) => update('name', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className={labelClass} htmlFor="email">Email</label>
          <input id="email" type="email" className={inputClass} required value={form.email}
            onChange={(e) => update('email', e.target.value)} />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className={labelClass} htmlFor="role">Role &amp; company</label>
        <input id="role" className={inputClass} required placeholder="Founder, Acme Inc."
          value={form.role} onChange={(e) => update('role', e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <label className={labelClass} htmlFor="why">Why now?</label>
        <textarea id="why" rows={4} className={inputClass} required
          placeholder="What's happening in your work and your practice that makes this the moment?"
          value={form.why} onChange={(e) => update('why', e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <label className={labelClass} htmlFor="history">Meditation history</label>
        <textarea id="history" rows={3} className={inputClass}
          placeholder="Anything you've practiced before — or nothing at all. Both are fine."
          value={form.history} onChange={(e) => update('history', e.target.value)} />
      </div>
      {status === 'error' && (
        <p className="text-sm text-earth-300" role="alert">{message}</p>
      )}
      <motion.button
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={status === 'loading'}
        className="rounded-lg bg-leaf-600 px-7 py-3 font-semibold text-earth-50 transition-colors hover:bg-leaf-500 disabled:opacity-60"
      >
        {status === 'loading' ? 'Sending…' : 'Submit application'}
      </motion.button>
    </form>
  );
}
