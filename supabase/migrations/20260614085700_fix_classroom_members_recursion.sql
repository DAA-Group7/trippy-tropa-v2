-- Drop the recursive policies
DROP POLICY IF EXISTS "Users can view members of their classrooms" ON public.classroom_members;
DROP POLICY IF EXISTS "Users can join classrooms" ON public.classroom_members;
DROP POLICY IF EXISTS "Users can update members if officer/teacher" ON public.classroom_members;
DROP POLICY IF EXISTS "Users can leave or be removed" ON public.classroom_members;

-- Create a helper function to check membership without triggering RLS
CREATE OR REPLACE FUNCTION public.is_classroom_member(class_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.classroom_members
    WHERE classroom_id = class_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_classroom_officer_or_teacher(class_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.classroom_members
    WHERE classroom_id = class_id AND user_id = auth.uid() AND role IN ('teacher', 'student_officer')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate policies using the SECURITY DEFINER functions to prevent infinite recursion
CREATE POLICY "Users can view members of their classrooms"
ON public.classroom_members FOR SELECT
USING (
  user_id = auth.uid() OR public.is_classroom_member(classroom_id)
);

CREATE POLICY "Users can join classrooms"
ON public.classroom_members FOR INSERT
WITH CHECK (
  auth.uid() = user_id OR public.is_classroom_officer_or_teacher(classroom_id)
);

CREATE POLICY "Users can update members if officer/teacher"
ON public.classroom_members FOR UPDATE
USING (
  public.is_classroom_officer_or_teacher(classroom_id)
);

CREATE POLICY "Users can leave or be removed"
ON public.classroom_members FOR DELETE
USING (
  auth.uid() = user_id OR public.is_classroom_officer_or_teacher(classroom_id)
);
