-- Journal entries: the core of Helen's brain
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_number SERIAL,
  title TEXT,
  content TEXT NOT NULL,
  raw_content TEXT,                    -- original handwriting OCR / Nebo export
  source TEXT NOT NULL DEFAULT 'web',  -- 'web', 'nebo', 'telegram', 'voice', 'import'
  mood TEXT,
  location TEXT,
  tags TEXT[] DEFAULT '{}',
  ai_summary TEXT,
  ai_themes JSONB DEFAULT '[]',
  ai_connections JSONB DEFAULT '[]',
  media_urls TEXT[] DEFAULT '{}',
  word_count INTEGER,
  recorded_at TIMESTAMPTZ DEFAULT now(),  -- when actually written
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX idx_journal_entries_recorded_at ON journal_entries(recorded_at DESC);
CREATE INDEX idx_journal_entries_tags ON journal_entries USING GIN(tags);
CREATE INDEX idx_journal_entries_ai_themes ON journal_entries USING GIN(ai_themes);

-- Full-text search
ALTER TABLE journal_entries ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B')
  ) STORED;
CREATE INDEX idx_journal_entries_fts ON journal_entries USING GIN(fts);

-- RLS
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own journal entries"
  ON journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries"
  ON journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries"
  ON journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries"
  ON journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
