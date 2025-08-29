
-- Add columns to handle school visits in the CHECKIN_visitors table
ALTER TABLE public.CHECKIN_visitors 
ADD COLUMN is_school_visit boolean DEFAULT false,
ADD COLUMN student_count integer,
ADD COLUMN teacher_name text;
