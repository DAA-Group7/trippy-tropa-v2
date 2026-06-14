'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { runHungarianAssignment } from '@/lib/algorithms/hungarian'

// ─── Tasks ─────────────────────────────────────────────────────────────

export async function createTaskAction(groupId: string, activityId: string, payload: { title: string, description: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

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
  
  // Exclude dummy tasks/members
  const realAssignments = assignments.filter(a => !a.isDummyMember && !a.isDummyTask)

  // Update each task with assigned_to
  for (const a of realAssignments) {
    const { error: updErr } = await supabase
      .from('tasks')
      .update({ assigned_to: a.memberId })
      .eq('id', a.taskId)
    
    if (updErr) return { error: updErr.message }
  }

  // Set tasks_assigned = true on the activity
  const { error: actErr } = await supabase
    .from('activities')
    .update({ tasks_assigned: true })
    .eq('id', activityId)

  if (actErr) return { error: actErr.message }

  revalidatePath('/classroom/[id]/activity/[activityId]/group/[groupId]', 'page')
  return { success: true }
}
