export interface Organization {
  id: string;
  name: string | null;
  description: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface Person {
  id: string;
  first_name: string | null;
  last_name: string | null;
  organization_id: string | null;
  title: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  social_media: Record<string, any>;
  created_at: string;
  updated_at: string;
  relationship_type: string[];
  // Joined data
  organization?: Organization;
}

export interface HealthWeightEntry {
  id: string;
  user_id: string;
  weight_kg: number;
  recorded_at: string;
  created_at: string;
}

export interface HealthBodyFatEntry {
  id: string;
  user_id: string;
  body_fat_pct: number;
  recorded_at: string;
  created_at: string;
}

export interface CoachConversation {
  id: string;
  user_id: string;
  created_at: string;
  raw_message: string;
  voice_url: string | null;
  ai_response: string;
  plan_json: Record<string, unknown> | null;
}

export interface CoachDailyLog {
  id: string;
  user_id: string;
  date: string;
  food_text: string | null;
  vitamins: string[];
  energy_level: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CoachPlan {
  id: string;
  user_id: string;
  date: string;
  calories: number | null;
  macros: { protein?: number; carbs?: number; fat?: number };
  meals: unknown[];
  workout: { type?: string; duration_minutes?: number; exercises?: string[] };
  created_at: string;
  updated_at: string;
} 