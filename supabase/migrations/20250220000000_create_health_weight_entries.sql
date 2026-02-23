  -- Weight tracker: store all values in kg; UI can convert to/from lbs
  CREATE TABLE health_weight_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    weight_kg NUMERIC NOT NULL CHECK (weight_kg > 0 AND weight_kg < 1000),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc') NOT NULL
  );

  ALTER TABLE health_weight_entries ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Users can view own weight entries"
    ON health_weight_entries FOR SELECT
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert own weight entries"
    ON health_weight_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update own weight entries"
    ON health_weight_entries FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can delete own weight entries"
    ON health_weight_entries FOR DELETE
    USING (auth.uid() = user_id);

  CREATE INDEX health_weight_entries_user_recorded_idx
    ON health_weight_entries(user_id, recorded_at DESC);
