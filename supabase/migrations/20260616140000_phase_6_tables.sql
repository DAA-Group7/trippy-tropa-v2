-- Migration for Phase 6: Submissions & Notifications

-- 1. SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    content_text TEXT,
    file_url TEXT,
    file_name TEXT,
    is_late BOOLEAN DEFAULT false,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    -- Ensure it's tied to either a user or a group, not both and not neither
    CONSTRAINT submissions_owner_check CHECK (
        (user_id IS NOT NULL AND group_id IS NULL) OR 
        (user_id IS NULL AND group_id IS NOT NULL)
    )
);

-- Enable RLS for submissions
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone in the classroom can read the submissions (useful for group members and teachers)
CREATE POLICY "Users can view submissions if they are in the classroom"
ON public.submissions
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.activities a
        JOIN public.classroom_members cm ON cm.classroom_id = a.classroom_id
        WHERE a.id = submissions.activity_id
        AND cm.user_id = auth.uid()
    )
);

-- Policy: Users can insert their own submissions
CREATE POLICY "Users can create their own submissions"
ON public.submissions
FOR INSERT
WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM public.group_members gm
        WHERE gm.group_id = submissions.group_id
        AND gm.user_id = auth.uid()
        AND gm.is_leader = true
    )
);

-- Policy: Users can update their own submissions
CREATE POLICY "Users can update their own submissions"
ON public.submissions
FOR UPDATE
USING (
    user_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM public.group_members gm
        WHERE gm.group_id = submissions.group_id
        AND gm.user_id = auth.uid()
        AND gm.is_leader = true
    )
);


-- 2. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- e.g., 'activity', 'group', 'request'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own notifications
CREATE POLICY "Users can view own notifications"
ON public.notifications
FOR SELECT
USING (user_id = auth.uid());

-- Policy: Users can update their own notifications (to mark as read)
CREATE POLICY "Users can update own notifications"
ON public.notifications
FOR UPDATE
USING (user_id = auth.uid());


-- 3. STORAGE BUCKET FOR SUBMISSIONS
INSERT INTO storage.buckets (id, name, public)
VALUES ('submissions', 'submissions', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
-- Allow anyone authenticated to upload a file (client handles max size, but we restrict it)
CREATE POLICY "Authenticated users can upload submissions" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'submissions' );

-- Allow users to update their own files
CREATE POLICY "Users can update their own submissions"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'submissions' AND owner = auth.uid() );

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own submissions"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'submissions' AND owner = auth.uid() );

-- Allow authenticated users to read files
CREATE POLICY "Authenticated users can view submissions"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'submissions' );
