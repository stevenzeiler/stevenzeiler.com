'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { CoachConversation, CoachPlan } from '@/types/database';

type Message = { role: 'user' | 'assistant'; content: string; id?: string };

const staggerItem = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

export default function CoachPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [plan, setPlan] = useState<CoachPlan | null>(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planCollapsed, setPlanCollapsed] = useState(false);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/sign-in');
        return;
      }
      try {
        const res = await fetch('/api/health/coach/chat', { credentials: 'include' });
        if (!res.ok) {
          setIsLoading(false);
          return;
        }
        const data = await res.json();
        const convos = (data.conversations ?? []) as CoachConversation[];
        const msgs: Message[] = [];
        convos.forEach((c) => {
          msgs.push({ role: 'user', content: c.raw_message, id: c.id });
          msgs.push({ role: 'assistant', content: c.ai_response, id: `${c.id}-ai` });
        });
        setMessages(msgs);
        setPlan(data.plan ?? null);
      } catch {
        // no history yet
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, [router, supabase.auth]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;
      setSending(true);
      setError(null);
      setInput('');
      setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);

      try {
        const res = await fetch('/api/health/coach/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ message: trimmed }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Failed to get reply');
          setMessages((prev) => prev.slice(0, -1));
          return;
        }
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
        if (data.plan) setPlan(data.plan);
      } catch {
        setError('Network error');
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setSending(false);
      }
    },
    [sending]
  );

  const speak = useCallback((text: string) => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.onend = () => setSpeaking(false);
    u.onstart = () => setSpeaking(true);
    window.speechSynthesis.speak(u);
  }, [speaking]);

  const startVoiceInput = useCallback(() => {
    const Win = typeof window !== 'undefined' ? window : null;
    const SR = Win && (Win.SpeechRecognition ?? Win.webkitSpeechRecognition);
    const recognition = SR ? new SR() : null;
    if (!recognition) {
      setError('Voice input not supported in this browser. Type your message instead.');
      return;
    }
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = Array.from(e.results)
        .map((r: SpeechRecognitionResult) => r[0].transcript)
        .join(' ')
        .trim();
      if (transcript) sendMessage(transcript);
    };
    recognition.onerror = () => setRecording(false);
    recognition.onend = () => setRecording(false);
    recognition.start();
    setRecording(true);
    recognitionRef.current = recognition;
  }, [sendMessage]);

  const stopVoiceInput = useCallback(() => {
    recognitionRef.current?.stop();
    setRecording(false);
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-950 to-earth-950 text-earth-50 flex flex-col">
      <header className="flex-shrink-0 border-b border-forest-800 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/health"
              className="text-earth-200 hover:text-leaf-400 transition-colors"
              aria-label="Back to Health"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg font-bold text-earth-100">AI Coach</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col min-h-0 max-w-3xl mx-auto w-full">
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 && (
            <motion.p
              variants={staggerItem}
              initial="initial"
              animate="animate"
              className="text-earth-400 text-center py-8 text-sm"
            >
              Say or type what you ate, how you feel, your schedule. Goal: 12% body fat. I’ll give you a direct plan.
            </motion.p>
          )}
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={m.id ?? i}
                variants={staggerItem}
                initial="initial"
                animate="animate"
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    m.role === 'user'
                      ? 'bg-leaf-600 text-earth-50'
                      : 'bg-forest-800/90 text-earth-100 border border-forest-700'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                  {m.role === 'assistant' && (
                    <button
                      type="button"
                      onClick={() => speak(m.content)}
                      className="mt-2 text-xs text-leaf-400 hover:text-leaf-300"
                    >
                      {speaking ? 'Stop' : 'Read aloud'}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {sending && (
            <div className="flex justify-start">
              <div className="bg-forest-800/90 border border-forest-700 rounded-2xl px-4 py-2.5 text-earth-400 text-sm">
                Thinking…
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {plan && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-shrink-0 border-t border-forest-800 bg-forest-900/80"
          >
            <button
              type="button"
              onClick={() => setPlanCollapsed((c) => !c)}
              className="w-full px-4 py-3 flex items-center justify-between text-left text-earth-200 hover:bg-forest-800/50"
            >
              <span className="font-medium">Today’s plan</span>
              <span className="text-earth-500">{planCollapsed ? 'Show' : 'Hide'}</span>
            </button>
            {!planCollapsed && (
              <div className="px-4 pb-4 space-y-2 text-sm">
                {plan.calories != null && (
                  <p><span className="text-earth-500">Calories:</span> {plan.calories}</p>
                )}
                {plan.macros && (plan.macros as Record<string, number>).protein != null && (
                  <p>
                    <span className="text-earth-500">Macros:</span>{' '}
                    P: {(plan.macros as Record<string, number>).protein}g, C: {(plan.macros as Record<string, number>).carbs}g, F: {(plan.macros as Record<string, number>).fat}g
                  </p>
                )}
                {Array.isArray(plan.meals) && plan.meals.length > 0 && (
                  <div>
                    <span className="text-earth-500">Meals:</span>
                    <ul className="list-disc list-inside mt-1 text-earth-200">
                      {plan.meals.map((meal, i) => (
                        <li key={i}>{typeof meal === 'string' ? meal : String(meal)}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {plan.workout && typeof plan.workout === 'object' && (() => {
                  const w = plan.workout as Record<string, unknown>;
                  const type = (w.type as string) ?? '—';
                  const dur = w.duration_minutes != null ? ` (${w.duration_minutes} min)` : '';
                  const ex = Array.isArray(w.exercises) && w.exercises.length > 0 ? ` ${(w.exercises as string[]).join(', ')}` : '';
                  return (
                    <p>
                      <span className="text-earth-500">Workout:</span> {type}{dur}{ex}
                    </p>
                  );
                })()}
              </div>
            )}
          </motion.div>
        )}

        {error && (
          <p className="px-4 py-2 text-red-400 text-sm">{error}</p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex-shrink-0 p-4 border-t border-forest-800 bg-forest-950/80"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ate pizza last night, gym at 6pm..."
              className="flex-1 bg-forest-800 border border-forest-700 rounded-xl px-4 py-3 text-earth-100 placeholder-earth-500 focus:outline-none focus:ring-2 focus:ring-leaf-500"
              disabled={sending}
            />
            <button
              type="button"
              onClick={recording ? stopVoiceInput : startVoiceInput}
              title={recording ? 'Stop recording' : 'Voice input'}
              className={`flex-shrink-0 rounded-xl px-4 py-3 flex items-center justify-center transition-colors ${
                recording ? 'bg-red-600 text-white' : 'bg-forest-800 text-earth-300 hover:bg-forest-700 border border-forest-700'
              }`}
            >
              {recording ? (
                <span className="text-sm">Stop</span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                </svg>
              )}
            </button>
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="flex-shrink-0 bg-leaf-600 hover:bg-leaf-700 disabled:opacity-50 text-earth-50 font-medium rounded-xl px-4 py-3 transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
