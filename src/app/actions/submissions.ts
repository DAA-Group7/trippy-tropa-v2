'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ─── Save Submission ────────────────────────────────────────────────────────
export async function submitWorkAction(
  activityId: string,
  data: {
    contentText?: string
    fileUrl?: string
    fileName?: string
    groupId?: string
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Check activity due date to determine is_late
  const { data: activity, error: actErr } = await supabase
    .from('activities')
    .select('due_date, classroom_id')
    .eq('id', activityId)
    .single()

  if (actErr || !activity) return { error: 'Activity not found' }

  const isLate = activity.due_date ? new Date() > new Date(activity.due_date) : false

  // Upsert submission (we don't have a strict unique constraint yet, so we just delete existing if re-submitting)
  // First delete any existing submission for this user/group for this activity
  if (data.groupId) {
    await supabase.from('submissions').delete().eq('activity_id', activityId).eq('group_id', data.groupId)
  } else {
    await supabase.from('submissions').delete().eq('activity_id', activityId).eq('user_id', user.id)
  }

  const { data: submission, error } = await supabase
    .from('submissions')
    .insert({
      activity_id: activityId,
      user_id: data.groupId ? null : user.id,
      group_id: data.groupId || null,
      content_text: data.contentText || null,
      file_url: data.fileUrl || null,
      file_name: data.fileName || null,
      is_late: isLate
    })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath(`/classroom/${activity.classroom_id}/activity/${activityId}`)
  
  // also create notification for teacher? 
  // skipping teacher notification for now unless requested

  return { success: true, submission }
}

// ─── Get Submissions ────────────────────────────────────────────────────────
export async function getSubmissionsAction(activityId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Check role
  const { data: activity } = await supabase.from('activities').select('classroom_id').eq('id', activityId).single()
  if (!activity) return { error: 'Activity not found' }

  const { data: member } = await supabase.from('classroom_members').select('role').eq('classroom_id', activity.classroom_id).eq('user_id', user.id).single()
  if (!member || !['teacher', 'student_officer'].includes(member.role)) {
    return { error: 'Unauthorized: teachers only' }
  }

  const { data: submissions, error } = await supabase
    .from('submissions')
    .select(`
      *,
      profiles:user_id(id, full_name, avatar_url),
      groups:group_id(id, name)
    `)
    .eq('activity_id', activityId)
    .order('submitted_at', { ascending: false })

  if (error) return { error: error.message }
  return { submissions }
}

// ─── Delete Submission ──────────────────────────────────────────────────────
export async function deleteSubmissionAction(submissionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: submission } = await supabase.from('submissions').select('*').eq('id', submissionId).single()
  if (!submission) return { error: 'Not found' }

  // allow delete if user is owner, or leader of group
  let canDelete = false
  if (submission.user_id === user.id) canDelete = true
  if (submission.group_id) {
    const { data: gm } = await supabase.from('group_members').select('*').eq('group_id', submission.group_id).eq('user_id', user.id).eq('is_leader', true).single()
    if (gm) canDelete = true
  }

  if (!canDelete) return { error: 'Unauthorized to delete this submission' }

  const { error } = await supabase.from('submissions').delete().eq('id', submissionId)
  if (error) return { error: error.message }

  // File deletion is handled here or by client. Usually good to delete from storage too.
  // Note: we'd need admin role to reliably delete from storage, or rely on client.
  
  return { success: true }
}
