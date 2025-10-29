-- Insert profile for manually created user
-- Run this in Supabase SQL Editor

-- First, check if the user exists in auth.users
SELECT id, email FROM auth.users WHERE id = '99e6475f-1194-461e-8697-ced9a2f90a85';

-- If the user exists, insert the profile
INSERT INTO public.profiles (
  id,
  username,
  display_name,
  age,
  interests
) VALUES (
  '99e6475f-1194-461e-8697-ced9a2f90a85',
  'testuser',
  'Test User',
  25,
  ARRAY['Photography', 'Travel', 'Music']
)
ON CONFLICT (id) DO NOTHING;
