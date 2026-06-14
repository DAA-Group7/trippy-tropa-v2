'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { greedyLPT, type Student, type DraftGroup } from '@/lib/algorithms/greedyLPT'

// ─── Create Activity ───────────────────────────────────────────────────────────

export async function createActivityAction(
  classroomId: string,
  data: {
    title: string
    description: string
    type: 'individual' | 'group'
    due_date: string
    num_groups?: number
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Verify role
  const { data: member } = await supabase
    .from('classroom_members')
    .select('role')
    .eq('classroom_id', classroomId)
    .eq('user_id', user.id)
    .single()

  if (!member || !['teacher', 'student_officer'].includes(member.role)) {
    return { error: 'Only teachers and officers can create activities.' }
  }

  const { data: activity, error } = await supabase
    .from('activities')
    .insert({
      classroom_id: classroomId,
      title: data.title,
      description: data.description,
      type: data.type,
      due_date: data.due_date || null,
      num_groups: data.type === 'group' ? data.num_groups : null,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath(`/classroom/${classroomId}`)
  return { success: true, activityId: activity.id }
}

// ─── Get Activities ────────────────────────────────────────────────────────────

export async function getActivitiesAction(classroomId: string) {
  const supabase = await createClient()

  const { data: activities, error } = await supabase
    .from('activities')
    .select('*')
    .eq('classroom_id', classroomId)
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }
  return { activities }
}

// ─── Get Activity Detail ───────────────────────────────────────────────────────

export async function getActivityDetailAction(activityId: string) {
  const supabase = await createClient()

  const { data: activity, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', activityId)
    .single()

  if (error) return { error: error.message }

  let groups = null
  if (activity.groups_created) {
    const { data: groupsData } = await supabase
      .from('groups')
      .select(`
        *,
        members:group_members(
          id,
          is_leader,
          profiles:user_id(id, full_name, email, avatar_url)
        )
      `)
      .eq('activity_id', activityId)

    groups = groupsData
  }

  return { activity, groups }
}

// ─── Generate Groups (returns draft, NOT saved) ────────────────────────────────

export async function generateGroupsAction(activityId: string) {
  const supabase = await createClient()

  // Get activity details
  const { data: activity, error: actErr } = await supabase
    .from('activities')
    .select('*')
    .eq('id', activityId)
    .single()

  if (actErr || !activity) return { error: 'Activity not found' }
  if (activity.type !== 'group') return { error: 'Not a group activity' }

  // Get all students in the classroom with their skill scores
  const { data: members } = await supabase
    .from('classroom_members')
    .select(`
      user_id,
      profiles:user_id(id, full_name, email)
    `)
    .eq('classroom_id', activity.classroom_id)
    .eq('role', 'student')

  if (!members || members.length === 0) return { error: 'No students in classroom' }

  // Get skills for weighting
  const { data: skills, error: skillsErr } = await supabase
    .from('skills')
    .select('*')
    .eq('classroom_id', activity.classroom_id)

  if (skillsErr) return { error: skillsErr.message }

  // Get student skill ratings
  const { data: studentSkills, error: studentSkillsErr } = await supabase
    .from('student_skills')
    .select('*')
    .eq('classroom_id', activity.classroom_id)

  if (studentSkillsErr) return { error: studentSkillsErr.message }

  // Compute skill scores for each student
  const students: Student[] = members.map((m: any) => {
    let score = 0
    if (skills && studentSkills) {
      const myRatings = studentSkills.filter((ss: any) => ss.user_id === m.user_id)
      myRatings.forEach((ss: any) => {
        const skill = skills.find((s: any) => s.id === ss.skill_id)
        if (skill) score += ss.rating * Number(skill.multiplier)
      })
    }
    return {
      id: m.user_id,
      name: (m.profiles as any)?.full_name || 'Unknown',
      email: (m.profiles as any)?.email || '',
      skillScore: score,
    }
  })

  const numGroups = activity.num_groups || 2
  const draft = greedyLPT(students, numGroups)

  return { draft, totalStudents: students.length }
}

// ─── Confirm Groups (saves to DB) ─────────────────────────────────────────────

export async function confirmGroupsAction(
  activityId: string,
  draftGroups: DraftGroup[]
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Get activity to get classroom_id
  const { data: activity } = await supabase
    .from('activities')
    .select('classroom_id')
    .eq('id', activityId)
    .single()

  if (!activity) return { error: 'Activity not found' }

  // Delete existing groups if re-generating
  const { error: delErr } = await supabase.from('groups').delete().eq('activity_id', activityId)
  if (delErr) return { error: delErr.message }

  // Insert groups and members
  for (const draftGroup of draftGroups) {
    const { data: group, error: groupErr } = await supabase
      .from('groups')
      .insert({
        activity_id: activityId,
        classroom_id: activity.classroom_id,
        name: draftGroup.name,
      })
      .select()
      .single()

    if (groupErr || !group) continue

    const memberInserts = draftGroup.members.map(m => ({
      group_id: group.id,
      user_id: m.id,
      is_leader: m.isLeader,
    }))

    if (memberInserts.length > 0) {
      const { error: memErr } = await supabase.from('group_members').insert(memberInserts)
      if (memErr) return { error: memErr.message }
    }
  }

  // Mark groups_created = true
  const { error: updErr } = await supabase
    .from('activities')
    .update({ groups_created: true })
    .eq('id', activityId)

  if (updErr) return { error: updErr.message }

  revalidatePath('/classroom/[id]', 'layout')
  return { success: true }
}

// ─── Ownership Transfer ────────────────────────────────────────────────────────

export async function requestOwnershipTransferAction(
  classroomId: string,
  toUserId: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Check if classroom owner
  const { data: classroom } = await supabase
    .from('classrooms')
    .select('owner_id')
    .eq('id', classroomId)
    .single()

  if (!classroom || classroom.owner_id !== user.id) {
    return { error: 'Only the classroom owner can transfer ownership.' }
  }

  // Cancel any existing pending transfer
  await supabase
    .from('ownership_transfers')
    .update({ status: 'rejected' })
    .eq('classroom_id', classroomId)
    .eq('status', 'pending')

  const { error } = await supabase.from('ownership_transfers').insert({
    classroom_id: classroomId,
    from_user_id: user.id,
    to_user_id: toUserId,
  })

  if (error) return { error: error.message }
  return { success: true }
}

export async function respondToTransferAction(
  transferId: string,
  response: 'accepted' | 'rejected'
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: transfer } = await supabase
    .from('ownership_transfers')
    .select('*')
    .eq('id', transferId)
    .eq('to_user_id', user.id)
    .eq('status', 'pending')
    .single()

  if (!transfer) return { error: 'Transfer not found or already resolved.' }

  await supabase
    .from('ownership_transfers')
    .update({ status: response })
    .eq('id', transferId)

  if (response === 'accepted') {
    const { error: ownerErr } = await supabase
      .from('classrooms')
      .update({ owner_id: user.id })
      .eq('id', transfer.classroom_id)
      
    if (ownerErr) return { error: ownerErr.message }

    // Ensure new owner is a teacher role in classroom
    const { error: roleErr } = await supabase
      .from('classroom_members')
      .update({ role: 'teacher' })
      .eq('classroom_id', transfer.classroom_id)
      .eq('user_id', user.id)

    if (roleErr) return { error: roleErr.message }

    revalidatePath('/classroom/[id]', 'layout')
  }

  return { success: true }
}
