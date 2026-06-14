import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CreateActivityClient from './CreateActivityClient'

export default async function CreateActivityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
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

  if (!member || !['teacher', 'student_officer'].includes(member.role)) {
    redirect(`/classroom/${id}`)
  }

  const { count } = await supabase
    .from('classroom_members')
    .select('id', { count: 'exact', head: true })
    .eq('classroom_id', id)
    .eq('role', 'student')

  const { data: classroom } = await supabase
    .from('classrooms')
    .select('name')
    .eq('id', id)
    .single()

  return (
    <CreateActivityClient
      classroomId={id}
      studentCount={count ?? 0}
    />
  )
}
