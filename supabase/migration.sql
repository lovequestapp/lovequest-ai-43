
-- This SQL will be run to ensure the profiles table has the necessary columns
-- Add voice_intro column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'voice_intro'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN voice_intro TEXT;
    END IF;
    
    -- Add favorite_music column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'favorite_music'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN favorite_music TEXT[] DEFAULT '{}';
    END IF;
END
$$;

-- Create profile-photos bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'Profile Photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the profile-photos bucket
CREATE POLICY "Public Access to Profile Photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-photos')
ON CONFLICT DO NOTHING;

CREATE POLICY "User can upload their own profile photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = 'profiles' AND
  auth.uid()::text = (storage.foldername(name))[2]
)
ON CONFLICT DO NOTHING;

CREATE POLICY "User can update their own profile photos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = 'profiles' AND
  auth.uid()::text = (storage.foldername(name))[2]
)
ON CONFLICT DO NOTHING;

CREATE POLICY "User can delete their own profile photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = 'profiles' AND
  auth.uid()::text = (storage.foldername(name))[2]
)
ON CONFLICT DO NOTHING;
