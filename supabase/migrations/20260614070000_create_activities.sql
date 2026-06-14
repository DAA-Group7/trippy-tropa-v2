-- Phase 4: Activities & Smart Grouping
-- Migration: activities, groups, group_members, ownership_transfers

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('individual', 'group')),
  due_date TIMESTAMPTZ,
  num_groups INTEGER,
  groups_created BOOLEAN NOT NULL DEFAULT FALSE,
  tasks_assigned BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Read: classroom members
CREATE POLICY "activities_select" ON activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM classroom_members
      WHERE classroom_members.classroom_id = activities.classroom_id
        AND classroom_members.user_id = auth.uid()
    )
  );

-- Insert: teachers and officers
CREATE POLICY "activities_insert" ON activities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM classroom_members
      WHERE classroom_members.classroom_id = activities.classroom_id
        AND classroom_members.user_id = auth.uid()
        AND classroom_members.role IN ('teacher', 'student_officer')
    )
  );

-- Update: teachers and officers
CREATE POLICY "activities_update" ON activities
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM classroom_members
      WHERE classroom_members.classroom_id = activities.classroom_id
        AND classroom_members.user_id = auth.uid()
        AND classroom_members.role IN ('teacher', 'student_officer')
    )
  );

-- Delete: classroom owner
CREATE POLICY "activities_delete" ON activities
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM classrooms
      WHERE classrooms.id = activities.classroom_id
        AND classrooms.owner_id = auth.uid()
    )
  );

-- Groups table
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_permanent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "groups_select" ON groups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM classroom_members
      WHERE classroom_members.classroom_id = groups.classroom_id
        AND classroom_members.user_id = auth.uid()
    )
  );

CREATE POLICY "groups_insert" ON groups
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM classroom_members
      WHERE classroom_members.classroom_id = groups.classroom_id
        AND classroom_members.user_id = auth.uid()
        AND classroom_members.role IN ('teacher', 'student_officer')
    )
  );

CREATE POLICY "groups_update" ON groups
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM classroom_members
      WHERE classroom_members.classroom_id = groups.classroom_id
        AND classroom_members.user_id = auth.uid()
        AND classroom_members.role IN ('teacher', 'student_officer')
    )
  );

CREATE POLICY "groups_delete" ON groups
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM classroom_members
      WHERE classroom_members.classroom_id = groups.classroom_id
        AND classroom_members.user_id = auth.uid()
        AND classroom_members.role IN ('teacher', 'student_officer')
    )
  );

-- Group Members table
CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_leader BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(group_id, user_id)
);

ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "group_members_select" ON group_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM groups g
      JOIN classroom_members cm ON cm.classroom_id = g.classroom_id
      WHERE g.id = group_members.group_id
        AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "group_members_insert" ON group_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM groups g
      JOIN classroom_members cm ON cm.classroom_id = g.classroom_id
      WHERE g.id = group_members.group_id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('teacher', 'student_officer')
    )
  );

CREATE POLICY "group_members_delete" ON group_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM groups g
      JOIN classroom_members cm ON cm.classroom_id = g.classroom_id
      WHERE g.id = group_members.group_id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('teacher', 'student_officer')
    )
  );

-- Ownership Transfers table
CREATE TABLE IF NOT EXISTS ownership_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES auth.users(id),
  to_user_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE ownership_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ownership_transfers_select" ON ownership_transfers
  FOR SELECT USING (
    auth.uid() = from_user_id OR auth.uid() = to_user_id
  );

CREATE POLICY "ownership_transfers_insert" ON ownership_transfers
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "ownership_transfers_update" ON ownership_transfers
  FOR UPDATE USING (
    auth.uid() = to_user_id AND status = 'pending'
  );
