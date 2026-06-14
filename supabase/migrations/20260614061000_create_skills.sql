-- Create skills table
CREATE TABLE public.skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  multiplier NUMERIC DEFAULT 1.0,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create student_skills table
CREATE TABLE public.student_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- Enable RLS
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;

-- Skills Policies
-- Read: Anyone in the classroom
CREATE POLICY "Users can view skills of their classrooms"
ON public.skills FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.classroom_members cm 
    WHERE cm.classroom_id = skills.classroom_id AND cm.user_id = auth.uid()
  )
);

-- Insert/Update/Delete: Teacher/Officer of the classroom
CREATE POLICY "Teachers can manage skills"
ON public.skills FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.classroom_members cm 
    WHERE cm.classroom_id = skills.classroom_id AND cm.user_id = auth.uid() AND cm.role IN ('teacher', 'student_officer')
  )
);

-- Student Skills Policies
-- Read: Teachers can read all, students can read their own
CREATE POLICY "Users can view student skills"
ON public.student_skills FOR SELECT
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.classroom_members cm 
    WHERE cm.classroom_id = student_skills.classroom_id AND cm.user_id = auth.uid() AND cm.role IN ('teacher', 'student_officer')
  )
);

-- Insert/Update: Students can insert their own ratings
CREATE POLICY "Students can manage their own ratings"
ON public.student_skills FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
