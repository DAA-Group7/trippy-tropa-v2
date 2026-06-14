import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OnboardingClient from './OnboardingClient'

export default async function OnboardingPage({ params }: { params: Promise<{ classroomId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { classroomId } = await params

  // Verify membership
  const { data: member } = await supabase
    .from('classroom_members')
    .select('*')
    .eq('classroom_id', classroomId)
    .eq('user_id', user.id)
    .single()

  if (!member) redirect('/dashboard')
  
  // If already completed onboarding, redirect to classroom
  const { count: ratedCount } = await supabase
    .from('student_skills')
    .select('id', { count: 'exact', head: true })
    .eq('classroom_id', classroomId)
    .eq('user_id', user.id)

  if (ratedCount && ratedCount > 0) {
    redirect(`/classroom/${classroomId}`)
  }

  // Fetch classroom details
  const { data: classroom } = await supabase
    .from('classrooms')
    .select('name')
    .eq('id', classroomId)
    .single()

  if (!classroom) redirect('/dashboard')

  // Fetch skills
  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .eq('classroom_id', classroomId)
    .order('order_index', { ascending: true })

  if (!skills || skills.length === 0) {
    // If no skills to assess, auto-complete onboarding
    await supabase.rpc('complete_onboarding', { 
      class_id: classroomId,
      target_user_id: user.id
    })
      
    redirect(`/classroom/${classroomId}`)
  }

  return (
    <OnboardingClient 
      classroomId={classroomId}
      classroomName={classroom.name}
      skills={skills}
    />
  )
}
