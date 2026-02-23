-- Storage bucket for health documents (e.g. Daily Wellness Calendar PDF)
INSERT INTO storage.buckets (id, name, public)
VALUES ('health-documents', 'health-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Users can read their own files (path: user_id/filename)
CREATE POLICY "Users can read own health documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'health-documents'
    AND (storage.foldername(name))[1] = (auth.uid())::text
  );

-- Users can upload to their own folder
CREATE POLICY "Users can upload own health documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'health-documents'
    AND (storage.foldername(name))[1] = (auth.uid())::text
  );

-- Users can update their own files
CREATE POLICY "Users can update own health documents"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'health-documents'
    AND (storage.foldername(name))[1] = (auth.uid())::text
  );

-- Users can delete their own files
CREATE POLICY "Users can delete own health documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'health-documents'
    AND (storage.foldername(name))[1] = (auth.uid())::text
  );
