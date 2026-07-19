'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitInquiry, type InquiryType } from '@/lib/inquiries';

interface NewsletterSignupProps {
  /** 'newsletter' (default) or 'live_sit' for the weekly sit registration. */
  type?: Extract<InquiryType, 'newsletter' | 'live_sit'>;
  heading?: string;
  subheading?: string;
  cta?: string;
  /** Extra context stored on the submission (e.g. which page it came from). */
  payload?: Record<string, unknown>;
  compact?: boolean;
}

export default function NewsletterSignup({
  type = 'newsletter',
  heading = 'Get the weekly note',
  subheading = 'A short essay on practice and pressure, plus a guided sit — one email a week. No spam, unsubscribe anytime.',
  cta = 'Subscribe',
  payload,
  compact = false,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    const { ok, error } = await submitInquiry({ type, email, payload });
    if (ok) {
      setStatus('done');
      setMessage(
        type === 'live_sit'
          ? "You're on the list. I'll email you the Zoom link and time before the next sit."
          : "You're in. Check your inbox for a first guided sit."
      );
      setEmail('');
    } else {
      setStatus('error');
      setMessage(error || 'Something went wrong. Please try again.');
    }
  }

  if (status === 'done') {
    return (
      <div
        className={`rounded-xl border border-leaf-700 bg-leaf-900/40 ${
          compact ? 'p-4' : 'p-6'
        } text-earth-100`}
      >
        <p className="font-medium text-leaf-200">Thank you.</p>
        <p className="mt-1 text-earth-200">{message}</p>
      </div>
    );
  }

  return (
    <div className={compact ? '' : 'space-y-3'}>
      {!compact && (
        <>
          <h3 className="text-2xl font-semibold text-earth-100">{heading}</h3>
          <p className="max-w-xl text-earth-300">{subheading}</p>
        </>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          aria-label="Email address"
          className="w-full flex-1 rounded-lg border border-forest-700 bg-forest-950/60 px-4 py-3 text-earth-50 placeholder:text-earth-400 focus:border-leaf-500 focus:outline-none focus:ring-1 focus:ring-leaf-500"
        />
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={status === 'loading'}
          className="rounded-lg bg-leaf-600 px-6 py-3 font-semibold text-earth-50 transition-colors hover:bg-leaf-500 disabled:opacity-60"
        >
          {status === 'loading' ? 'Sending…' : cta}
        </motion.button>
      </form>
      {status === 'error' && (
        <p className="text-sm text-earth-300" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}
