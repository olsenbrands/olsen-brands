CREATE TABLE IF NOT EXISTS wedgies_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  age_range text NOT NULL,
  why_work_here text,
  work_experience jsonb DEFAULT '[]'::jsonb,
  availability jsonb DEFAULT '{}'::jsonb,
  resume_url text,
  resume_filename text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
