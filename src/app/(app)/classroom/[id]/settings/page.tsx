import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SettingsClient from './SettingsClient'

export default async function ClassroomSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { id } = await params

  // Verify membership and role
  const { data: member } = await supabase
    .from('classroom_members')
    .select('role')
    .eq('classroom_id', id)
    .eq('user_id', user.id)
    .single()

  if (!member || (member.role !== 'teacher' && member.role !== 'student_officer')) {
    redirect(`/classroom/${id}`)
  }

  // Fetch classroom details
  const { data: classroom } = await supabase
    .from('classrooms')
    .select('*')
    .eq('id', id)
    .single()

  if (!classroom) redirect('/dashboard')

  // Fetch skills
  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .eq('classroom_id', id)
    .order('order_index', { ascending: true })

  return (
    <SettingsClient 
      classroom={classroom}
      initialSkills={skills || []}
    />
  )
}
