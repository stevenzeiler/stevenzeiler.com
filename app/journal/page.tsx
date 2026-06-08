'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4 }
};

interface JournalEntry {
  id: string;
  entry_number: number;
  title: string | null;
  content: string;
  source: string;
  mood: string | null;
  location: string | null;
  tags: string[];
  ai_summary: string | null;
  word_count: number;
  recorded_at: string;
  created_at: string;
}

type View = 'list' | 'read' | 'write';

const SOURCE_ICONS: Record<string, string> = {
  web: '🌐',
  nebo: '✍️',
  telegram: '💬',
  voice: '🎙️',
  import: '📥',
};

const MOOD_OPTIONS = ['reflective', 'energized', 'contemplative', 'inspired', 'restless', 'grateful', 'focused', 'vulnerable'];

export default function JournalPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<View>('list');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [saving, setSaving] = useState(false);

  // New entry form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newMood, setNewMood] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newSource, setNewSource] = useState('web');
  const [newRecordedAt, setNewRecordedAt] = useState('');

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchEntries = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.set('search', search);
    const res = await fetch(`/api/journal?${params}`);
    if (res.ok) {
      const data = await res.json();
      setEntries(data.entries || []);
      setTotal(data.total || 0);
    }
  }, [page, search]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== 'me@stevenzeiler.com') {
        router.push('/');
      } else {
        setIsLoading(false);
      }
    };
    checkUser();
  }, [router, supabase.auth]);

  useEffect(() => {
    if (!isLoading) fetchEntries();
  }, [isLoading, fetchEntries]);

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const handleCreate = async () => {
    if (!newContent.trim()) return;
    setSaving(true);
    const res = await fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle || null,
        content: newContent,
        source: newSource,
        mood: newMood || null,
        location: newLocation || null,
        tags: newTags ? newTags.split(',').map(t => t.trim()).filter(Boolean) : [],
        recorded_at: newRecordedAt || undefined,
      }),
    });
    if (res.ok) {
      setNewTitle(''); setNewContent(''); setNewLocation(''); setNewMood('');
      setNewTags(''); setNewSource('web'); setNewRecordedAt('');
      setView('list');
      fetchEntries();
    }
    setSaving(false);
  };

  const handleUpdate = async () => {
    if (!selectedEntry) return;
    setSaving(true);
    const res = await fetch(`/api/journal/${selectedEntry.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: editTitle || null,
        content: editContent,
        tags: editTags ? editTags.split(',').map(t => t.trim()).filter(Boolean) : [],
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setSelectedEntry(updated);
      setEditing(false);
      fetchEntries();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this journal entry?')) return;
    await fetch(`/api/journal/${id}`, { method: 'DELETE' });
    setView('list');
    setSelectedEntry(null);
    fetchEntries();
  };

  const openEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setEditing(false);
    setView('read');
  };

  const startEdit = () => {
    if (!selectedEntry) return;
    setEditTitle(selectedEntry.title || '');
    setEditContent(selectedEntry.content);
    setEditTags(selectedEntry.tags?.join(', ') || '');
    setEditing(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="text-xl animate-pulse">Loading journal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => { setView('list'); setSelectedEntry(null); setEditing(false); }} className="text-2xl font-bold tracking-tight hover:text-blue-400 transition-colors">
              Journal
            </button>
            <span className="text-xs text-gray-600 font-mono">{total} entries</span>
          </div>
          <div className="flex items-center gap-3">
            {view === 'list' && (
              <button
                onClick={() => setView('write')}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                + New Entry
              </button>
            )}
            {view !== 'list' && (
              <button
                onClick={() => { setView('list'); setSelectedEntry(null); setEditing(false); }}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                ← Back
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">

          {/* ───── LIST VIEW ───── */}
          {view === 'list' && (
            <motion.div key="list" {...fadeInUp} className="space-y-6">
              {/* Search */}
              <div className="flex gap-2">
                <input
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Search your journal..."
                  className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
                />
                <button onClick={handleSearch} className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors">
                  Search
                </button>
              </div>

              {/* Entries */}
              {entries.length === 0 ? (
                <div className="text-center py-20 text-gray-600">
                  <p className="text-lg mb-2">No journal entries yet</p>
                  <p className="text-sm">Start writing to begin building your archive</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {entries.map(entry => (
                    <motion.article
                      key={entry.id}
                      variants={fadeInUp}
                      onClick={() => openEntry(entry)}
                      className="bg-gray-900/50 hover:bg-gray-900 border border-gray-800/50 hover:border-gray-700/50 rounded-xl p-5 cursor-pointer transition-all group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-600 font-mono">#{entry.entry_number}</span>
                            <span className="text-xs">{SOURCE_ICONS[entry.source] || '📝'}</span>
                            {entry.mood && (
                              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{entry.mood}</span>
                            )}
                          </div>
                          <h2 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">
                            {entry.title || 'Untitled'}
                          </h2>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <div className="text-xs text-gray-500">
                            {new Date(entry.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="text-xs text-gray-600 font-mono">{entry.word_count} words</div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                        {entry.content.substring(0, 200)}...
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        {entry.location && (
                          <span className="text-xs text-gray-500">📍 {entry.location}</span>
                        )}
                        {entry.tags?.map(tag => (
                          <span key={tag} className="text-xs bg-gray-800/80 text-gray-400 px-2 py-0.5 rounded">#{tag}</span>
                        ))}
                      </div>

                      {entry.ai_summary && (
                        <div className="mt-3 p-3 bg-blue-950/20 border border-blue-900/20 rounded-lg">
                          <span className="text-xs text-blue-400 font-mono">AI Summary:</span>
                          <p className="text-xs text-gray-400 mt-1">{entry.ai_summary}</p>
                        </div>
                      )}
                    </motion.article>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {total > 20 && (
                <div className="flex justify-center gap-2 pt-4">
                  <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 bg-gray-800 rounded text-sm disabled:opacity-30">← Prev</button>
                  <span className="px-3 py-1.5 text-sm text-gray-500">Page {page}</span>
                  <button disabled={entries.length < 20} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 bg-gray-800 rounded text-sm disabled:opacity-30">Next →</button>
                </div>
              )}
            </motion.div>
          )}

          {/* ───── READ VIEW ───── */}
          {view === 'read' && selectedEntry && (
            <motion.div key="read" {...fadeInUp} className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 font-mono">#{selectedEntry.entry_number}</span>
                  <span>{SOURCE_ICONS[selectedEntry.source] || '📝'}</span>
                  {selectedEntry.mood && (
                    <span className="text-sm text-gray-400 bg-gray-800 px-2.5 py-1 rounded-full">{selectedEntry.mood}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={startEdit} className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(selectedEntry.id)} className="text-sm text-red-500/50 hover:text-red-400 transition-colors">Delete</button>
                </div>
              </div>

              {editing ? (
                <div className="space-y-4">
                  <input
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-xl font-semibold focus:outline-none focus:border-blue-500/50"
                  />
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm leading-relaxed focus:outline-none focus:border-blue-500/50 min-h-[400px] resize-y"
                  />
                  <input
                    value={editTags}
                    onChange={e => setEditTags(e.target.value)}
                    placeholder="Tags (comma-separated)"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleUpdate} disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-white px-4 py-2 text-sm transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold">{selectedEntry.title || 'Untitled'}</h1>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{new Date(selectedEntry.recorded_at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    {selectedEntry.location && <span>📍 {selectedEntry.location}</span>}
                    <span className="font-mono">{selectedEntry.word_count} words</span>
                  </div>

                  <div className="prose prose-invert prose-gray max-w-none">
                    {selectedEntry.content.split('\n').map((p, i) => (
                      <p key={i} className="text-gray-300 leading-relaxed mb-4">{p}</p>
                    ))}
                  </div>

                  {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap pt-4 border-t border-gray-800/50">
                      {selectedEntry.tags.map(tag => (
                        <span key={tag} className="text-sm bg-gray-800 text-gray-400 px-3 py-1 rounded-full">#{tag}</span>
                      ))}
                    </div>
                  )}

                  {selectedEntry.ai_summary && (
                    <div className="p-4 bg-blue-950/20 border border-blue-900/30 rounded-xl">
                      <h3 className="text-sm font-medium text-blue-400 mb-2">🧠 AI Analysis</h3>
                      <p className="text-sm text-gray-400">{selectedEntry.ai_summary}</p>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* ───── WRITE VIEW ───── */}
          {view === 'write' && (
            <motion.div key="write" {...fadeInUp} className="space-y-6">
              <h2 className="text-xl font-semibold">New Journal Entry</h2>

              <div className="space-y-4">
                <input
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Title (optional)"
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-lg font-medium focus:outline-none focus:border-blue-500/50 placeholder-gray-700"
                />

                <textarea
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Write your thoughts..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-4 text-sm leading-relaxed focus:outline-none focus:border-blue-500/50 min-h-[350px] resize-y placeholder-gray-700"
                  autoFocus
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Location</label>
                    <input
                      value={newLocation}
                      onChange={e => setNewLocation(e.target.value)}
                      placeholder="Where are you?"
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Mood</label>
                    <select
                      value={newMood}
                      onChange={e => setNewMood(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 text-gray-300"
                    >
                      <option value="">Select mood...</option>
                      {MOOD_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Tags</label>
                    <input
                      value={newTags}
                      onChange={e => setNewTags(e.target.value)}
                      placeholder="comma, separated, tags"
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Source</label>
                    <select
                      value={newSource}
                      onChange={e => setNewSource(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 text-gray-300"
                    >
                      <option value="web">🌐 Web</option>
                      <option value="nebo">✍️ Nebo</option>
                      <option value="telegram">💬 Telegram</option>
                      <option value="voice">🎙️ Voice</option>
                      <option value="import">📥 Import</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Date Written (if not today)</label>
                  <input
                    type="datetime-local"
                    value={newRecordedAt}
                    onChange={e => setNewRecordedAt(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 text-gray-300 sm:w-auto"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                  <span className="text-xs text-gray-600 font-mono">
                    {newContent ? newContent.split(/\s+/).filter(Boolean).length : 0} words
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setView('list')}
                      className="text-gray-400 hover:text-white px-4 py-2 text-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreate}
                      disabled={!newContent.trim() || saving}
                      className="bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      {saving ? 'Saving...' : 'Save Entry'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-700 font-mono">
        stevenzeiler.com/journal · {total} entries · {entries.reduce((sum, e) => sum + (e.word_count || 0), 0).toLocaleString()} total words
      </footer>
    </div>
  );
}
