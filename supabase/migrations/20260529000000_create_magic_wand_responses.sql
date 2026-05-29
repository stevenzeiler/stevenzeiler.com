-- Magic Wand: one-year visualization exercise
-- Each row is one section's response, keyed by category slug

CREATE TABLE magic_wand_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,          -- e.g. 'wealth', 'career', 'music'
  field_key TEXT NOT NULL,         -- e.g. 'net_worth', 'revenue_streams'
  field_label TEXT NOT NULL,       -- human-readable label
  response TEXT DEFAULT '',
  target_date DATE DEFAULT (CURRENT_DATE + INTERVAL '1 year'),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, category, field_key)
);

ALTER TABLE magic_wand_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own magic wand responses"
  ON magic_wand_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own magic wand responses"
  ON magic_wand_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own magic wand responses"
  ON magic_wand_responses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own magic wand responses"
  ON magic_wand_responses FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX magic_wand_responses_user_cat_idx
  ON magic_wand_responses(user_id, category);
