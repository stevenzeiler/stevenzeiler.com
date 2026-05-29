'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { categories, type MagicWandCategory } from './magic-wand-data';

export default function MagicWandPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string>(categories[0].slug);
  const [progress, setProgress] = useState(0);
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});

  // Auth check
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        await loadResponses(user.id);
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  // Calculate progress
  useEffect(() => {
    const totalFields = categories.reduce((sum, cat) => sum + cat.fields.length, 0);
    const filledFields = Object.values(responses).filter(v => v && v.trim().length > 0).length;
    setProgress(Math.round((filledFields / totalFields) * 100));
  }, [responses]);

  async function loadResponses(userId: string) {
    const { data, error } = await supabase
      .from('magic_wand_responses')
      .select('category, field_key, response')
      .eq('user_id', userId);

    if (data) {
      const map: Record<string, string> = {};
      data.forEach((row: any) => {
        map[`${row.category}__${row.field_key}`] = row.response || '';
      });
      setResponses(map);
    }
  }

  const saveField = useCallback(async (category: string, fieldKey: string, fieldLabel: string, value: string) => {
    if (!user) return;
    const compositeKey = `${category}__${fieldKey}`;
    setSaving(prev => ({ ...prev, [compositeKey]: true }));

    const { error } = await supabase
      .from('magic_wand_responses')
      .upsert({
        user_id: user.id,
        category,
        field_key: fieldKey,
        field_label: fieldLabel,
        response: value,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,category,field_key',
      });

    setSaving(prev => ({ ...prev, [compositeKey]: false }));
    if (!error) {
      setSaved(prev => ({ ...prev, [compositeKey]: true }));
      setTimeout(() => setSaved(prev => ({ ...prev, [compositeKey]: false })), 1500);
    }
  }, [user, supabase]);

  const handleChange = useCallback((category: string, fieldKey: string, fieldLabel: string, value: string) => {
    const compositeKey = `${category}__${fieldKey}`;
    setResponses(prev => ({ ...prev, [compositeKey]: value }));

    // Debounce save — 1.5s after last keystroke
    if (debounceTimers.current[compositeKey]) {
      clearTimeout(debounceTimers.current[compositeKey]);
    }
    debounceTimers.current[compositeKey] = setTimeout(() => {
      saveField(category, fieldKey, fieldLabel, value);
    }, 1500);
  }, [saveField]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-pulse text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🪄</div>
          <h1 className="text-3xl font-bold text-white mb-4">Magic Wand</h1>
          <p className="text-gray-400 mb-8">Sign in to visualize your ideal life one year from now.</p>
          <a
            href="/auth/sign-in"
            className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  const activeCat = categories.find(c => c.slug === activeCategory)!;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                🪄 Magic Wand
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Your ideal life — May 2027 · No constraints · No filters
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-400">{progress}%</div>
              <div className="text-xs text-gray-500">complete</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar nav */}
        <nav className="hidden md:block w-64 shrink-0">
          <div className="sticky top-28 space-y-1 max-h-[calc(100vh-8rem)] overflow-y-auto">
            {categories.map(cat => {
              const catFields = cat.fields;
              const filled = catFields.filter(f => {
                const v = responses[`${cat.slug}__${f.key}`];
                return v && v.trim().length > 0;
              }).length;
              const isActive = cat.slug === activeCategory;

              return (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <span>{cat.emoji}</span>
                    <span className="truncate">{cat.title}</span>
                  </span>
                  <span className={`text-xs tabular-nums ${filled === catFields.length ? 'text-emerald-400' : 'text-gray-600'}`}>
                    {filled}/{catFields.length}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Mobile category selector */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-20 overflow-x-auto">
          <div className="flex p-2 gap-1">
            {categories.map(cat => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`shrink-0 px-3 py-2 rounded-lg text-sm ${
                  cat.slug === activeCategory
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-500'
                }`}
              >
                {cat.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 pb-20 md:pb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span>{activeCat.emoji}</span>
              <span>{activeCat.title}</span>
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              If you had a magic wand, what does this look like in May 2027?
            </p>
          </div>

          <div className="space-y-6">
            {activeCat.fields.map(field => {
              const compositeKey = `${activeCat.slug}__${field.key}`;
              const value = responses[compositeKey] || '';
              const isSaving = saving[compositeKey];
              const isSaved = saved[compositeKey];

              return (
                <div key={field.key} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">
                      {field.label}
                    </label>
                    <span className="text-xs">
                      {isSaving && <span className="text-yellow-500">Saving...</span>}
                      {isSaved && <span className="text-emerald-400">✓ Saved</span>}
                    </span>
                  </div>
                  <textarea
                    value={value}
                    onChange={e => handleChange(activeCat.slug, field.key, field.label, e.target.value)}
                    placeholder="Dream big..."
                    rows={3}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent resize-y transition-colors text-sm leading-relaxed"
                  />
                </div>
              );
            })}
          </div>

          {/* Navigation between categories */}
          <div className="flex justify-between mt-10 pt-6 border-t border-gray-800">
            {(() => {
              const idx = categories.findIndex(c => c.slug === activeCategory);
              const prev = idx > 0 ? categories[idx - 1] : null;
              const next = idx < categories.length - 1 ? categories[idx + 1] : null;
              return (
                <>
                  {prev ? (
                    <button
                      onClick={() => { setActiveCategory(prev.slug); window.scrollTo(0, 0); }}
                      className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                      ← {prev.emoji} {prev.title}
                    </button>
                  ) : <div />}
                  {next ? (
                    <button
                      onClick={() => { setActiveCategory(next.slug); window.scrollTo(0, 0); }}
                      className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                      {next.emoji} {next.title} →
                    </button>
                  ) : (
                    <div className="text-sm text-emerald-400 font-medium">
                      ✨ You&apos;ve reached the end — go build it.
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
