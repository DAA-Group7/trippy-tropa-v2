'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getSkillsAction(classroomId: string) {
  const supabase = await createClient()
  
  const { data: skills, error } = await supabase
    .from('skills')
    .select('*')
    .eq('classroom_id', classroomId)
    .order('order_index', { ascending: true })

  if (error) return { error: error.message }
  return { skills }
}

export async function saveClassroomSettingsAction(classroomId: string, data: {
  name: string,
  description: string,
  skills: any[]
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // 1. Update classroom details
  const { error: updateError } = await supabase
    .from('classrooms')
    .update({ name: data.name, description: data.description })
    .eq('id', classroomId)

  if (updateError) return { error: updateError.message }

  // 2. Handle skills
  const { data: existingSkills } = await supabase
    .from('skills')
    .select('id')
    .eq('classroom_id', classroomId)
    
  const existingIds = new Set(existingSkills?.map(s => s.id))
  const newIds = new Set(data.skills.map(s => s.id).filter(Boolean))

  const toDelete = [...existingIds].filter(id => !newIds.has(id))
  if (toDelete.length > 0) {
    await supabase.from('skills').delete().in('id', toDelete)
  }

  for (let i = 0; i < data.skills.length; i++) {
    const skill = data.skills[i]
    if (skill.id && existingIds.has(skill.id)) {
      await supabase.from('skills').update({
        name: skill.name,
        multiplier: skill.multiplier,
        order_index: i
      }).eq('id', skill.id)
    } else {
      await supabase.from('skills').insert({
        classroom_id: classroomId,
        name: skill.name,
        multiplier: skill.multiplier,
        order_index: i
      })
    }
  }

  revalidatePath(`/classroom/${classroomId}/settings`)
  revalidatePath(`/classroom/${classroomId}`)
  
  return { success: true }
}

export async function submitSkillRatingsAction(classroomId: string, ratings: { skill_id: string, rating: number }[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const inserts = ratings.map(r => ({
    classroom_id: classroomId,
    user_id: user.id,
    skill_id: r.skill_id,
    rating: r.rating
  }))

  const { error: insertError } = await supabase
    .from('student_skills')
    .upsert(inserts, { onConflict: 'user_id,skill_id' })

  if (insertError) return { error: insertError.message }

  // Set onboarding complete
  await supabase
    .from('classroom_members')
    .update({ has_completed_onboarding: true })
    .eq('classroom_id', classroomId)
    .eq('user_id', user.id)

  revalidatePath(`/classroom/${classroomId}`)
  return { success: true }
}
