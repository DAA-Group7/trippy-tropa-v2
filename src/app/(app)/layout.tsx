import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, avatar_url')
    .eq('id', user.id)
    .single()

  const { data: myMemberships } = await supabase
    .from('classroom_members')
    .select('classroom_id')
    .eq('user_id', user.id)

  const classroomIds = myMemberships?.map(m => m.classroom_id) || []

  const { data: classrooms } = await supabase
    .from('classrooms')
    .select('id, name')
    .in('id', classroomIds)
    .order('created_at', { ascending: false })

  return (
    <AppShell profile={profile} classrooms={classrooms || []} userId={user.id}>
      {children}
    </AppShell>
  )
}
