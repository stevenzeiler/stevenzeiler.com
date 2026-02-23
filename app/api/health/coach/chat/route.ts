import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import Anthropic from '@anthropic-ai/sdk';
import type { CoachPlan, CoachConversation } from '@/types/database';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = new Date().toISOString().slice(0, 10);

  const [
    { data: convos },
    { data: todayPlan },
  ] = await Promise.all([
    supabase
      .from('coach_conversations')
      .select('id, created_at, raw_message, ai_response, plan_json')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(50),
    supabase
      .from('coach_plans')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle(),
  ]);

  return NextResponse.json({
    conversations: (convos ?? []) as CoachConversation[],
    plan: (todayPlan as CoachPlan | null) ?? null,
  });
}

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CLAUDE_MODEL = 'claude-sonnet-4-6';

function extractPlanFromResponse(text: string): Record<string, unknown> | null {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (!match) return null;
  try {
    return JSON.parse(match[1].trim()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function buildSystemPrompt(
  latestWeightKg: number | null,
  latestBodyFatPct: number | null,
  recentConvoSummary: string,
  todayLog: string | null
): string {
  const weightStr = latestWeightKg != null ? `${latestWeightKg} kg` : 'unknown';
  const bfStr = latestBodyFatPct != null ? `${latestBodyFatPct}%` : 'unknown';
  return `You are a no-nonsense fitness coach. Goal: 12% body fat (current ${bfStr}, weight ${weightStr}). Be direct, motivating, realistic—adjust if I'm tired/busy. Use history: ${recentConvoSummary || 'none yet'}. ${todayLog ? `Today's log so far: ${todayLog}` : ''} Log what I ate, vitamins, schedule when I mention them. Output: feedback + daily plan when relevant. If this is a voice message: keep replies short (under 90 sec when read aloud). End with: "Anything else today?" When you give a daily plan, include a JSON block (only the JSON, no extra text around it) in this exact format:
\`\`\`json
{"calories": number, "macros": {"protein": number, "carbs": number, "fat": number}, "meals": ["meal1", "meal2", "meal3"], "workout": {"type": "string", "duration_minutes": number, "exercises": ["ex1", "ex2"]}}
\`\`\`
Only include the JSON block when you are actually prescribing a plan for today.`;
}

export async function POST(request: Request) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY not configured' },
      { status: 500 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { message: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const { message } = body;
  if (typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: 'message required' }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);

  const [
    { data: weightRows },
    { data: bfRows },
    { data: convos },
    { data: todayLogRow },
    { data: todayPlanRow },
  ] = await Promise.all([
    supabase
      .from('health_weight_entries')
      .select('weight_kg')
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: false })
      .limit(1),
    supabase
      .from('health_body_fat_entries')
      .select('body_fat_pct')
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: false })
      .limit(1),
    supabase
      .from('coach_conversations')
      .select('raw_message, ai_response, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('coach_daily_logs')
      .select('food_text, vitamins, energy_level, notes')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle(),
    supabase
      .from('coach_plans')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle(),
  ]);

  const latestWeightKg = weightRows?.[0]?.weight_kg ?? null;
  const latestBodyFatPct = bfRows?.[0]?.body_fat_pct ?? null;
  const recentConvoSummary =
    convos
      ?.slice(0, 5)
      .reverse()
      .map(
        (c) =>
          `[${c.created_at}] User: ${(c.raw_message as string).slice(0, 200)}... Coach: ${(c.ai_response as string).slice(0, 300)}...`
      )
      .join(' ') ?? '';
  const todayLog =
    todayLogRow &&
    [todayLogRow.food_text, todayLogRow.notes]
      .filter(Boolean)
      .join('; ')
    ? `Food/notes: ${[todayLogRow.food_text, todayLogRow.notes].filter(Boolean).join('; ')}`
    : null;

  const systemPrompt = buildSystemPrompt(
    latestWeightKg,
    latestBodyFatPct,
    recentConvoSummary,
    todayLog
  );

  const messages: Anthropic.MessageParam[] = [
    ...(convos ?? [])
      .slice(0, 8)
      .reverse()
      .flatMap((c) => [
        { role: 'user' as const, content: (c.raw_message as string).slice(0, 4000) },
        { role: 'assistant' as const, content: (c.ai_response as string).slice(0, 4000) },
      ]),
    { role: 'user' as const, content: message.trim().slice(0, 4000) },
  ];

  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  let reply: string;
  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });
    const block = response.content.find((b) => b.type === 'text');
    reply = block && block.type === 'text' ? block.text : '';
  } catch (err) {
    console.error('Anthropic error:', err);
    return NextResponse.json(
      { error: 'AI request failed' },
      { status: 502 }
    );
  }

  const planJson = extractPlanFromResponse(reply);

  const { data: insertedConvo, error: insertError } = await supabase
    .from('coach_conversations')
    .insert({
      user_id: user.id,
      raw_message: message.trim(),
      ai_response: reply,
      plan_json: planJson,
    })
    .select('id')
    .single();

  if (insertError) {
    console.error('Insert conversation error:', insertError);
  }

  let plan: CoachPlan | null = null;
  if (planJson && typeof planJson === 'object') {
    const p = planJson as Record<string, unknown>;
    const macros = (p.macros as Record<string, number>) ?? {};
    const workout = (p.workout as Record<string, unknown>) ?? {};
    const { error: planError } = await supabase.from('coach_plans').upsert(
      {
        user_id: user.id,
        date: today,
        calories: typeof p.calories === 'number' ? p.calories : null,
        macros: {
          protein: macros.protein,
          carbs: macros.carbs,
          fat: macros.fat,
        },
        meals: Array.isArray(p.meals) ? p.meals : [],
        workout: {
          type: workout.type,
          duration_minutes: workout.duration_minutes,
          exercises: Array.isArray(workout.exercises) ? workout.exercises : [],
        },
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,date' }
    );
    if (!planError) {
      const { data: planRow } = await supabase
        .from('coach_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();
      plan = planRow as unknown as CoachPlan;
    }
  }

  return NextResponse.json({
    reply,
    plan: plan ?? (todayPlanRow as unknown as CoachPlan) ?? undefined,
    conversationId: insertedConvo?.id,
  });
}
