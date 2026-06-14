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

  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .eq('classroom_id', id)

  const { data: studentSkills } = await supabase
    .from('student_skills')
    .select('*')
    .eq('classroom_id', id)

  const formattedMembers = classroom.members.map((m: any) => {
    let score = 0
    if (m.role === 'student' && skills && studentSkills) {
      const mySkills = studentSkills.filter(ss => ss.user_id === m.profiles?.id)
      mySkills.forEach(ss => {
        const skill = skills.find(s => s.id === ss.skill_id)
        if (skill) {
          score += ss.rating * Number(skill.multiplier)
        }
      })
    }

    return {
      id: m.id,
      userId: m.profiles?.id,
      role: m.role,
      joinedAt: m.joined_at,
      name: m.profiles?.full_name || 'Unknown User',
      email: m.profiles?.email || '',
      avatarUrl: m.profiles?.avatar_url,
      skillScore: score
    }
  })

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
