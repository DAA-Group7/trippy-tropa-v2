'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function generateInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function createClassroomAction(state: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const permanentGroups = formData.get('permanentGroups') === 'on'
  
  if (!name) return { error: 'Classroom name is required' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const inviteCode = generateInviteCode()
  const newClassroomId = crypto.randomUUID()

  const { error: classroomError } = await supabase
    .from('classrooms')
    .insert({
      id: newClassroomId,
      name,
      description,
      invite_code: inviteCode,
      owner_id: user.id,
      created_by_role: profile?.role || 'teacher',
      has_permanent_groups: permanentGroups,
    })

  if (classroomError) return { error: classroomError.message }

  const { error: memberError } = await supabase
    .from('classroom_members')
    .insert({
      classroom_id: newClassroomId,
      user_id: user.id,
      role: profile?.role === 'teacher' ? 'teacher' : 'student_officer',
    })

  if (memberError) return { error: memberError.message }

  revalidatePath('/dashboard')
  
  return { 
    success: true, 
    classroom: { 
      id: newClassroomId,
      name,
      invite_code: inviteCode,
      description,
      has_permanent_groups: permanentGroups,
      owner_id: user.id
    }
  }
}

export async function joinClassroomAction(state: any, formData: FormData) {
  const code = formData.get('code') as string
  if (!code) return { error: 'Invite code is required' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: classroom, error: findError } = await supabase
    .rpc('get_classroom_by_invite_code', { invite_code_arg: code.toUpperCase() })

  if (findError || !classroom) {
    return { error: 'Invalid invite code or classroom not found.' }
  }

  const { error: joinError } = await supabase
    .from('classroom_members')
    .insert({
      classroom_id: classroom.id,
      user_id: user.id,
      role: 'student',
    })

  if (joinError) {
    if (joinError.code === '23505') {
      return { error: 'You are already a member of this classroom.' }
    }
    return { error: joinError.message }
  }

  const { count } = await supabase
    .from('skills')
    .select('id', { count: 'exact', head: true })
    .eq('classroom_id', classroom.id)

  const hasSkills = count ? count > 0 : false

  revalidatePath('/dashboard')
  
  return { 
    success: true, 
    classroomId: classroom.id,
    hasSkills
  }
}

export async function promoteMemberAction(classroomId: string, targetUserId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Check if current user is teacher
  const { data: member } = await supabase
    .from('classroom_members')
    .select('role')
    .eq('classroom_id', classroomId)
    .eq('user_id', user.id)
    .single()

  if (!member || member.role !== 'teacher') {
    return { error: 'Only teachers can promote students to officers' }
  }

  // Update target user to student_officer
  const { error } = await supabase
    .from('classroom_members')
    .update({ role: 'student_officer' })
    .eq('classroom_id', classroomId)
    .eq('user_id', targetUserId)
    .eq('role', 'student')

  if (error) return { error: error.message }

  revalidatePath('/classroom/[id]', 'layout')
  return { success: true }
}
