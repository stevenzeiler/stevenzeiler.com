-- Coach conversations: each user message + AI reply
CREATE TABLE coach_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
  raw_message TEXT NOT NULL,
  voice_url TEXT,
  ai_response TEXT NOT NULL,
  plan_json JSONB
);

ALTER TABLE coach_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own coach conversations"
  ON coach_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coach conversations"
  ON coach_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own coach conversations"
  ON coach_conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own coach conversations"
  ON coach_conversations FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX coach_conversations_user_created_idx
  ON coach_conversations(user_id, created_at DESC);

-- Daily logs: food, vitamins, energy, notes per day
CREATE TABLE coach_daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  food_text TEXT,
  vitamins TEXT[] DEFAULT '{}',
  energy_level SMALLINT CHECK (energy_level >= 1 AND energy_level <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
  UNIQUE(user_id, date)
);

ALTER TABLE coach_daily_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own daily logs"
  ON coach_daily_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX coach_daily_logs_user_date_idx ON coach_daily_logs(user_id, date DESC);

-- Plans: daily nutrition + workout from AI
CREATE TABLE coach_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  calories INTEGER,
  macros JSONB DEFAULT '{}',  -- { protein, carbs, fat }
  meals JSONB DEFAULT '[]',  -- array of meal descriptions
  workout JSONB DEFAULT '{}',  -- { type, duration_minutes, exercises }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
  UNIQUE(user_id, date)
);

ALTER TABLE coach_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own plans"
  ON coach_plans FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX coach_plans_user_date_idx ON coach_plans(user_id, date DESC);
