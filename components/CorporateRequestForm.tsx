'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitInquiry } from '@/lib/inquiries';

const inputClass =
  'w-full rounded-lg border border-forest-700 bg-forest-950/60 px-4 py-3 text-earth-50 placeholder:text-earth-400 focus:border-leaf-500 focus:outline-none focus:ring-1 focus:ring-leaf-500';
const labelClass = 'block text-sm font-medium text-earth-200';

const formats = [
  '60–90 minute workshop',
  'Half-day offsite session',
  'Ongoing program',
  'Not sure yet',
];

export default function CorporateRequestForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    organization: '',
    format: formats[0],
    details: '',
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
      type: 'corporate',
      email: form.email,
      name: form.name,
      payload: {
        organization: form.organization,
        format: form.format,
        details: form.details,
      },
    });
    if (ok) {
      setStatus('done');
      setMessage("Request received. I'll reply personally within a couple of days to talk through the fit.");
    } else {
      setStatus('error');
      setMessage(error || 'Something went wrong. Please try again.');
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-xl border border-leaf-700 bg-leaf-900/40 p-6 text-earth-100">
        <p className="font-medium text-leaf-200">Thank you.</p>
        <p className="mt-1 text-earth-200">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelClass} htmlFor="cname">Name</label>
          <input id="cname" className={inputClass} required value={form.name}
            onChange={(e) => update('name', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className={labelClass} htmlFor="cemail">Work email</label>
          <input id="cemail" type="email" className={inputClass} required value={form.email}
            onChange={(e) => update('email', e.target.value)} />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className={labelClass} htmlFor="org">Organization</label>
        <input id="org" className={inputClass} required value={form.organization}
          onChange={(e) => update('organization', e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <label className={labelClass} htmlFor="format">What are you looking for?</label>
        <select id="format" className={inputClass} value={form.format}
          onChange={(e) => update('format', e.target.value)}>
          {formats.map((f) => (
            <option key={f} value={f} className="bg-forest-950">{f}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className={labelClass} htmlFor="details">Anything else</label>
        <textarea id="details" rows={4} className={inputClass}
          placeholder="Team size, timing, what's prompting this, and anything you want me to know."
          value={form.details} onChange={(e) => update('details', e.target.value)} />
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
        {status === 'loading' ? 'Sending…' : 'Request a session'}
      </motion.button>
    </form>
  );
}
