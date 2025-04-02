
-- Add a JSON column to store bank details
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bank_details JSONB DEFAULT NULL;

-- Make sure our RLS policies apply to the new column
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Ensure users can only update their own bank details
CREATE POLICY IF NOT EXISTS "Users can update their own bank details"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
