import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SettingsClient from './SettingsClient'

export default async function ClassroomSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { id } = await params

  const { data: member } = await supabase
    .from('classroom_members')
    .select('role')
    .eq('classroom_id', id)
    .eq('user_id', user.id)
    .single()

  if (!member || (member.role !== 'teacher' && member.role !== 'student_officer')) {
    redirect(`/classroom/${id}`)
  }

  const { data: classroom } = await supabase
    .from('classrooms')
    .select('*')
    .eq('id', id)
    .single()

  if (!classroom) redirect('/dashboard')

  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .eq('classroom_id', id)
    .order('order_index', { ascending: true })

  // For ownership transfer: fetch teachers in the classroom (not the current owner)
  const isOwner = classroom.owner_id === user.id
  let teachers: any[] = []
  let pendingTransfer: any = null

  if (isOwner && member.role === 'student_officer') {
    // Get all teachers in the classroom
    const { data: teacherMembers } = await supabase
      .from('classroom_members')
      .select('user_id, profiles:user_id(id, full_name, email)')
      .eq('classroom_id', id)
      .eq('role', 'teacher')
    teachers = (teacherMembers || []).map((m: any) => m.profiles).filter(Boolean)

    // Check for pending transfer
    const { data: transfer } = await supabase
      .from('ownership_transfers')
      .select('*, to_profile:to_user_id(full_name, email)')
      .eq('classroom_id', id)
      .eq('from_user_id', user.id)
      .eq('status', 'pending')
      .single()
    pendingTransfer = transfer
  }

  return (
    <SettingsClient 
      classroom={classroom}
      initialSkills={skills || []}
      isOwner={isOwner}
      userRole={member.role}
      teachers={teachers}
      pendingTransfer={pendingTransfer}
    />
  )
}

