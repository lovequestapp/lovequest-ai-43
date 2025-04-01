
-- Create the profile-photos bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'Profile Photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the profile-photos bucket
CREATE POLICY "Public Access to Profile Photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-photos');

CREATE POLICY "User can upload their own profile photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = 'profiles' AND
  auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "User can update their own profile photos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = 'profiles' AND
  auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "User can delete their own profile photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = 'profiles' AND
  auth.uid()::text = (storage.foldername(name))[2]
);
