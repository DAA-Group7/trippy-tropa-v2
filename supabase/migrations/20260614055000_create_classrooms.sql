-- Create classrooms table
CREATE TABLE public.classrooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  invite_code VARCHAR(6) UNIQUE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_by_role TEXT CHECK (created_by_role IN ('student', 'teacher')),
  has_permanent_groups BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create classroom_members table
CREATE TABLE public.classroom_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('student', 'student_officer', 'teacher')),
  has_completed_onboarding BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(classroom_id, user_id)
);

-- Enable RLS
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_members ENABLE ROW LEVEL SECURITY;

-- Classrooms Policies
-- Read: User is a member of the classroom
CREATE POLICY "Users can view classrooms they are a member of"
ON public.classrooms FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.classroom_members 
    WHERE classroom_id = classrooms.id AND user_id = auth.uid()
  )
);

-- Insert: Any authenticated user
CREATE POLICY "Users can create classrooms"
ON public.classrooms FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- Update/Delete: Owner
CREATE POLICY "Owners can update classrooms"
ON public.classrooms FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete classrooms"
ON public.classrooms FOR DELETE
USING (auth.uid() = owner_id);

-- Classroom Members Policies
-- Read: User is a member of the same classroom
CREATE POLICY "Users can view members of their classrooms"
ON public.classroom_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.classroom_members cm 
    WHERE cm.classroom_id = classroom_members.classroom_id AND cm.user_id = auth.uid()
  )
);

-- Insert: Owner/officer of the classroom OR inserting self
CREATE POLICY "Users can join classrooms"
ON public.classroom_members FOR INSERT
WITH CHECK (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.classroom_members cm 
    WHERE cm.classroom_id = classroom_members.classroom_id AND cm.user_id = auth.uid() AND cm.role IN ('teacher', 'student_officer')
  )
);

-- Update/Delete: Owner/officer or self (leaving)
CREATE POLICY "Users can update members if officer/teacher"
ON public.classroom_members FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.classroom_members cm 
    WHERE cm.classroom_id = classroom_members.classroom_id AND cm.user_id = auth.uid() AND cm.role IN ('teacher', 'student_officer')
  )
);

CREATE POLICY "Users can leave or be removed"
ON public.classroom_members FOR DELETE
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.classroom_members cm 
    WHERE cm.classroom_id = classroom_members.classroom_id AND cm.user_id = auth.uid() AND cm.role IN ('teacher', 'student_officer')
  )
);
