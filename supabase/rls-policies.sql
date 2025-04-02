
-- Enable Row Level Security on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own profiles
CREATE POLICY "Users can view their own profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Create policy to allow users to update their own profiles
CREATE POLICY "Users can update their own profiles"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Create policy to allow users to read other profiles
CREATE POLICY "Users can view other profiles"
ON public.profiles
FOR SELECT
USING (true);

-- Create policy to allow users to update their own bank details
CREATE POLICY "Users can update their own bank details"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Enable Row Level Security on the messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own messages
CREATE POLICY "Users can view their own messages"
ON public.messages
FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Create policy to allow users to insert messages
CREATE POLICY "Users can insert messages"
ON public.messages
FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Create policy to allow users to update their own messages
CREATE POLICY "Users can update their own messages"
ON public.messages
FOR UPDATE
USING (auth.uid() = sender_id);

-- Create policy to allow users to delete their own messages
CREATE POLICY "Users can delete their own messages"
ON public.messages
FOR DELETE
USING (auth.uid() = sender_id);
