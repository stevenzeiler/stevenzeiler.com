'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import NewsletterSignup from '@/components/NewsletterSignup';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
};

export default function AboutPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchImage() {
      const { data: files } = await supabase.storage
        .from('public-images-yoga-meditation')
        .list();
      if (files && files.length > 0) {
        setImageUrl(
          supabase.storage
            .from('public-images-yoga-meditation')
            .getPublicUrl(files[0].name).data.publicUrl
        );
      }
    }
    fetchImage();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-950 to-earth-950 text-earth-50">
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-28">
        <motion.header {...fadeInUp}>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-leaf-300">
            About
          </p>
          <h1 className="mt-4 text-4xl font-bold text-earth-50 md:text-5xl">
            A founder who sits.
          </h1>
        </motion.header>

        {imageUrl && (
          <motion.img
            {...fadeInUp}
            src={imageUrl}
            alt="Steven Zeiler"
            className="mt-10 aspect-[16/9] w-full rounded-2xl border border-forest-800 object-cover"
          />
        )}

        <motion.div
          {...fadeInUp}
          className="prose-invert mt-10 space-y-6 text-lg leading-relaxed text-earth-200"
        >
          <p>
            I'm Steven Zeiler. I've spent my working life building companies —
            most recently Huge AI — and my inner life practicing Zen and yoga for
            the better part of two decades. For a long time those two things sat in
            separate rooms. This is what happened when I stopped keeping them apart.
          </p>
          <p>
            Running a company is a sustained exercise in pressure: decisions made
            with incomplete information, conflict you can't outsource, and a mind
            that won't switch off at 3am. Practice didn't make any of that go away.
            What it changed was my relationship to it — the gap between a hard
            moment and my reaction to it got wider, and in that gap is where better
            decisions live.
          </p>
          <p>
            The Zen tradition has spent centuries studying the mind under strain. I
            take it seriously and try to teach it accurately — but I always
            translate it into the consequences the people I work with actually
            care about: clarity in the board meeting, composure in the layoff,
            steadiness through the raise that's slipping. Not incense and mystique.
            Posture, breath, attention, and what they do for judgment.
          </p>
          <p>
            I trained in Bikram-method yoga and in seated Zen practice, and I've
            taught both for years — 90-minute classes, guided sits, and now
            programs built specifically for founders and executives. What I offer
            is practice and experience, not therapy and not clinical treatment. I
            won't overclaim what it does. I'll just show you how to do it, and let
            the work speak.
          </p>
          <p>
            If any of this lands, the best place to start is the free weekly sit
            and the newsletter below. Come sit. We'll go from there.
          </p>
        </motion.div>

        <motion.div {...fadeInUp} className="mt-14 border-t border-forest-800 pt-12">
          <NewsletterSignup />
        </motion.div>
      </div>
    </div>
  );
}
