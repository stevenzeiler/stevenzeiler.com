-- Public inquiry capture: newsletter signups, weekly-sit registrations,
-- cohort applications, and corporate session requests all land in one table.
-- Anonymous visitors may INSERT (that's the whole point of a signup form);
-- nobody can read via the anon/authenticated roles. Read submissions from the
-- Supabase dashboard or a service-role context.
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('newsletter', 'live_sit', 'cohort_application', 'corporate')),
  email TEXT NOT NULL,
  name TEXT,
  -- Form-specific fields: role/company/why/history for cohort,
  -- organization/format/details for corporate, etc.
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc') NOT NULL
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone (including logged-out visitors) may submit an inquiry.
CREATE POLICY "Anyone can submit an inquiry"
  ON inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No SELECT/UPDATE/DELETE policies: submissions are not readable by the
-- anon or authenticated roles. Access them via the dashboard or service role.

CREATE INDEX inquiries_type_created_idx ON inquiries(type, created_at DESC);
CREATE INDEX inquiries_email_idx ON inquiries(email);
