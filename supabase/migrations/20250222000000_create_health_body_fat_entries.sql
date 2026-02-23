-- Body fat % tracker
CREATE TABLE health_body_fat_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body_fat_pct NUMERIC NOT NULL CHECK (body_fat_pct >= 0 AND body_fat_pct <= 100),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc') NOT NULL
);

ALTER TABLE health_body_fat_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own body fat entries"
  ON health_body_fat_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own body fat entries"
  ON health_body_fat_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own body fat entries"
  ON health_body_fat_entries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own body fat entries"
  ON health_body_fat_entries FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX health_body_fat_entries_user_recorded_idx
  ON health_body_fat_entries(user_id, recorded_at DESC);
