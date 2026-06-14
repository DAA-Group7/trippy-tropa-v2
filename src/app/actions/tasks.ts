'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { runHungarianAssignment } from '@/lib/algorithms/hungarian'

// ─── Tasks ─────────────────────────────────────────────────────────────

export async function createTaskAction(groupId: string, activityId: string, payload: { title: string, description: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // AuthZ check
  const { data: member } = await supabase.from('group_members').select('id').eq('group_id', groupId).eq('user_id', user.id).single()
  if (!member) return { error: 'Unauthorized: must be a member of the group' }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      group_id: groupId,
      title: payload.title,
      description: payload.description,
      status: 'todo',
      created_by: user.id
    })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath('/classroom/[id]/activity/[activityId]/group/[groupId]', 'page')
  return { task: data }
}

export async function deleteTaskAction(taskId: string, activityId: string, groupId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // AuthZ check: must be leader or teacher
  const { data: groupMember } = await supabase.from('group_members').select('is_leader').eq('group_id', groupId).eq('user_id', user.id).single()
  if (!groupMember?.is_leader) {
    const { data: activity } = await supabase.from('activities').select('classroom_id').eq('id', activityId).single()
    if (activity) {
      const { data: classMember } = await supabase.from('classroom_members').select('role').eq('classroom_id', activity.classroom_id).eq('user_id', user.id).single()
      if (!classMember || classMember.role === 'student') return { error: 'Unauthorized: must be group leader or teacher' }
    } else {
      return { error: 'Activity not found' }
    }
  }

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)

  if (error) return { error: error.message }
  revalidatePath('/classroom/[id]/activity/[activityId]/group/[groupId]', 'page')
  return { success: true }
}

export async function updateTaskStatusAction(taskId: string, status: string, activityId: string, groupId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // AuthZ check
  const { data: member } = await supabase.from('group_members').select('id').eq('group_id', groupId).eq('user_id', user.id).single()
  if (!member) return { error: 'Unauthorized: must be a member of the group' }

  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId)

  if (error) return { error: error.message }
  revalidatePath('/classroom/[id]/activity/[activityId]/group/[groupId]', 'page')
  return { success: true }
}

// ─── Time Estimates & Matrix ───────────────────────────────────────────

export async function upsertTimeEstimateAction(taskId: string, estimatedHours: number, activityId: string, groupId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // AuthZ check
  const { data: member } = await supabase.from('group_members').select('id').eq('group_id', groupId).eq('user_id', user.id).single()
  if (!member) return { error: 'Unauthorized: must be a member of the group' }

  // Use upsert matching task_id and user_id (the unique constraint)
  const { error } = await supabase
    .from('time_estimates')
    .upsert({
      task_id: taskId,
      user_id: user.id,
      estimated_hours: estimatedHours,
      updated_at: new Date().toISOString()
    }, { onConflict: 'task_id,user_id' })

  if (error) return { error: error.message }
  revalidatePath('/classroom/[id]/activity/[activityId]/group/[groupId]', 'page')
  return { success: true }
}

export async function getTimeMatrixAction(groupId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // AuthZ check: user must be in classroom
  const { data: group } = await supabase.from('groups').select('activity:activity_id(classroom_id)').eq('id', groupId).single()
  const classroomId = (group?.activity as any)?.classroom_id
  if (classroomId) {
    const { data: classMember } = await supabase.from('classroom_members').select('id').eq('classroom_id', classroomId).eq('user_id', user.id).single()
    if (!classMember) return { error: 'Unauthorized: not a member of this classroom' }
  }

  // Fetch group members
  const { data: members, error: mError } = await supabase
    .from('group_members')
    .select(`
      user_id,
      is_leader,
      profile:user_id(id, full_name, email, avatar_url)
    `)
    .eq('group_id', groupId)

  if (mError) return { error: mError.message }

  // Fetch tasks
  const { data: tasks, error: tError } = await supabase
    .from('tasks')
    .select('*')
    .eq('group_id', groupId)
    .order('created_at', { ascending: true })

  if (tError) return { error: tError.message }

  // Fetch all estimates for these tasks
  const taskIds = tasks.map(t => t.id)
  let estimates: any[] = []
  if (taskIds.length > 0) {
    const { data: eData } = await supabase
      .from('time_estimates')
      .select('*')
      .in('task_id', taskIds)
    if (eData) estimates = eData
  }

  return { members, tasks, estimates }
}

// ─── Hungarian Assignment ──────────────────────────────────────────────

export async function runHungarianAssignmentAction(groupId: string) {
  const matrixData = await getTimeMatrixAction(groupId)
  if (matrixData.error) return { error: matrixData.error }
  
  const { members, tasks, estimates } = matrixData
  if (!members || !tasks || !estimates) return { error: 'Missing data' }
  if (members.length === 0 || tasks.length === 0) return { error: 'Members and tasks are required' }

  // Build members array and tasks array (using IDs)
  const memberIds = members.map(m => m.user_id)
  const taskIds = tasks.map(t => t.id)

  // Build matrix: [memberIndex][taskIndex]
  const matrix: number[][] = []
  for (let i = 0; i < memberIds.length; i++) {
    matrix[i] = []
    for (let j = 0; j < taskIds.length; j++) {
      const est = estimates.find(e => e.user_id === memberIds[i] && e.task_id === taskIds[j])
      // If missing estimate, treat as high cost so it's avoided (though PRD says require 100% full)
      matrix[i][j] = est ? Number(est.estimated_hours) : 9999
    }
  }

  const assignments = runHungarianAssignment(memberIds, taskIds, matrix)
  return { assignments }
}

export async function confirmAssignmentsAction(groupId: string, activityId: string, assignments: any[]): Promise<{ error?: string, success?: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // AuthZ check: must be teacher or officer
  const { data: activity } = await supabase.from('activities').select('classroom_id').eq('id', activityId).single()
  if (!activity) return { error: 'Activity not found' }
  const { data: classMember } = await supabase.from('classroom_members').select('role').eq('classroom_id', activity.classroom_id).eq('user_id', user.id).single()
  if (!classMember || classMember.role === 'student') return { error: 'Unauthorized: must be teacher or officer' }
  
  // Exclude dummy tasks/members
  const realAssignments = assignments.filter(a => !a.isDummyMember && !a.isDummyTask)

  // Fetch current tasks to satisfy any NOT NULL constraints on upsert
  const { data: currentTasks, error: fetchErr } = await supabase
    .from('tasks')
    .select('*')
    .in('id', realAssignments.map(a => a.taskId))

  if (fetchErr) return { error: fetchErr.message }
  if (!currentTasks) return { error: 'Failed to fetch tasks for bulk update' }

  const upsertPayload = currentTasks.map(task => {
    const assignment = realAssignments.find(a => a.taskId === task.id)
    return {
      ...task,
      assigned_to: assignment?.memberId
    }
  })

  const { error: upsertErr } = await supabase
    .from('tasks')
    .upsert(upsertPayload, { onConflict: 'id' })

  if (upsertErr) return { error: upsertErr.message }

  // Set tasks_assigned = true on the activity
  const { error: actErr } = await supabase
    .from('activities')
    .update({ tasks_assigned: true })
    .eq('id', activityId)

  if (actErr) return { error: actErr.message }

  revalidatePath('/classroom/[id]/activity/[activityId]/group/[groupId]', 'page')
  return { success: true }
}
