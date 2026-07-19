import { createBrowserClient } from '@supabase/ssr';

export type InquiryType =
  | 'newsletter'
  | 'live_sit'
  | 'cohort_application'
  | 'corporate';

export interface InquiryInput {
  type: InquiryType;
  email: string;
  name?: string;
  payload?: Record<string, unknown>;
}

/**
 * Submit a public inquiry (newsletter signup, weekly-sit registration, cohort
 * application, or corporate request) into the shared `inquiries` table.
 * Uses the browser Supabase client with the anon key — inserts are permitted
 * for everyone by the table's RLS policy.
 */
export async function submitInquiry({
  type,
  email,
  name,
  payload = {},
}: InquiryInput): Promise<{ ok: boolean; error?: string }> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase.from('inquiries').insert({
    type,
    email: email.trim(),
    name: name?.trim() || null,
    payload,
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
