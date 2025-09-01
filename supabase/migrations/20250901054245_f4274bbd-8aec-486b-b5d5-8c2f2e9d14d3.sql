-- Update the users table with proper RLS policies
-- This will trigger a types regeneration

-- Add a comment to the users table to ensure it's included in the schema
COMMENT ON TABLE public.users IS 'User authentication table with roles and permissions';

-- Ensure RLS is enabled (it should already be, but this ensures consistency)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Allow user creation during signup" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;

-- Create basic RLS policies for the users table
CREATE POLICY "Users can view their own data" 
ON public.users 
FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "Allow user creation during signup" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own data" 
ON public.users 
FOR UPDATE 
USING (auth.uid()::text = id::text);