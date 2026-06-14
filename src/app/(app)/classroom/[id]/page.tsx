import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClassroomClient from './ClassroomClient'

export default async function ClassroomPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { id } = await params

  // Verify membership and get role
  const { data: member } = await supabase
    .from('classroom_members')
    .select('role')
    .eq('classroom_id', id)
    .eq('user_id', user.id)
    .single()

  if (!member) {
    redirect('/dashboard') // Not a member
  }

  const { data: classroom } = await supabase
    .from('classrooms')
    .select(`
      *,
      members:classroom_members(
        id,
        role,
        joined_at,
        profiles:user_id(
          id,
          full_name,
          email,
          avatar_url
        )
      )
    `)
    .eq('id', id)
    .single()

  if (!classroom) redirect('/dashboard')

  const formattedMembers = classroom.members.map((m: any) => ({
    id: m.id,
    userId: m.profiles?.id,
    role: m.role,
    joinedAt: m.joined_at,
    name: m.profiles?.full_name || 'Unknown User',
    email: m.profiles?.email || '',
    avatarUrl: m.profiles?.avatar_url
  }))

  // Mocked stats for Phase 2
  const stats = {
    avgScore: '84.2%',
    atRisk: 3,
    activeGroups: 8
  }

  return (
    <ClassroomClient 
      classroom={classroom} 
      members={formattedMembers} 
      userRole={member.role}
      stats={stats}
    />
  )
}
