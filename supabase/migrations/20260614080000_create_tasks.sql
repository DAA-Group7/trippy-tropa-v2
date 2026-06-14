-- Phase 5: Task Management & Hungarian Algorithm
-- Migration: tasks, time_estimates

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Read: group members can read tasks for their group
CREATE POLICY "tasks_select" ON tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = tasks.group_id
        AND group_members.user_id = auth.uid()
    ) OR EXISTS (
      -- Teacher/Officer can read all tasks in their classroom
      SELECT 1 FROM groups g
      JOIN classroom_members cm ON cm.classroom_id = g.classroom_id
      WHERE g.id = tasks.group_id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('teacher', 'student_officer')
    )
  );

-- Insert: any group member can insert tasks
CREATE POLICY "tasks_insert" ON tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = tasks.group_id
        AND group_members.user_id = auth.uid()
    )
  );

-- Update: assigned user can update status, leader can update anything
CREATE POLICY "tasks_update" ON tasks
  FOR UPDATE USING (
    tasks.assigned_to = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = tasks.group_id
        AND group_members.user_id = auth.uid()
        AND group_members.is_leader = TRUE
    )
  );

-- Delete: only group leader can delete
CREATE POLICY "tasks_delete" ON tasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = tasks.group_id
        AND group_members.user_id = auth.uid()
        AND group_members.is_leader = TRUE
    )
  );


-- Time Estimates table
CREATE TABLE IF NOT EXISTS time_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  estimated_hours NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(task_id, user_id)
);

ALTER TABLE time_estimates ENABLE ROW LEVEL SECURITY;

-- Read: group members and teachers
CREATE POLICY "time_estimates_select" ON time_estimates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tasks t
      JOIN group_members gm ON gm.group_id = t.group_id
      WHERE t.id = time_estimates.task_id
        AND gm.user_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM tasks t
      JOIN groups g ON g.id = t.group_id
      JOIN classroom_members cm ON cm.classroom_id = g.classroom_id
      WHERE t.id = time_estimates.task_id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('teacher', 'student_officer')
    )
  );

-- Insert: users can only insert their own estimates
CREATE POLICY "time_estimates_insert" ON time_estimates
  FOR INSERT WITH CHECK (
    time_estimates.user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM tasks t
      JOIN group_members gm ON gm.group_id = t.group_id
      WHERE t.id = time_estimates.task_id
        AND gm.user_id = auth.uid()
    )
  );

-- Update: users can only update their own estimates
CREATE POLICY "time_estimates_update" ON time_estimates
  FOR UPDATE USING (
    time_estimates.user_id = auth.uid()
  );

-- Delete: leader cascades delete (implicit via ON DELETE CASCADE on tasks), but explicit delete allowed if needed
CREATE POLICY "time_estimates_delete" ON time_estimates
  FOR DELETE USING (
    time_estimates.user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM tasks t
      JOIN group_members gm ON gm.group_id = t.group_id
      WHERE t.id = time_estimates.task_id
        AND gm.user_id = auth.uid()
        AND gm.is_leader = TRUE
    )
  );
