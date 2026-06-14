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
    .select('role, has_completed_onboarding')
    .eq('classroom_id', id)
    .eq('user_id', user.id)
    .single()

  if (!member) {
    redirect('/dashboard') // Not a member
  }

  // Prevent onboarding bypass for students
  if (member.role === 'student' && !member.has_completed_onboarding) {
    const { count } = await supabase
      .from('skills')
      .select('id', { count: 'exact', head: true })
      .eq('classroom_id', id)

    if (count && count > 0) {
      redirect(`/onboarding/${id}`)
    }
  }

  const { data: classroom } = await supabase
    .from('classrooms')
    .select(`
      *,
      members:classroom_members(
        id,
        role,
        joined_at,
        user_id
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

  const userIds = classroom?.members?.map((m: any) => m.user_id) || []
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .in('id', userIds)

  const formattedMembers = classroom.members.map((m: any) => {
    let score = 0
    let rawSkills: any[] = []
    const profile = profiles?.find(p => p.id === m.user_id)

    if (m.role === 'student' && skills && studentSkills) {
      const mySkills = studentSkills.filter(ss => ss.user_id === m.user_id)
      mySkills.forEach(ss => {
        const skill = skills.find(s => s.id === ss.skill_id)
        if (skill) {
          score += ss.rating * Number(skill.multiplier)
          rawSkills.push({ name: skill.name, rating: ss.rating, multiplier: skill.multiplier })
        }
      })
    }

    return {
      id: m.id,
      userId: m.user_id,
      role: m.role,
      joinedAt: m.joined_at,
      name: profile?.full_name || 'Unknown User',
      email: '',
      avatarUrl: profile?.avatar_url,
      skillScore: score,
      rawSkills
    }
  })

  // Mocked stats — will be computed from real data in later phases
  const studentCount = formattedMembers.filter((m: any) => m.role === 'student').length
  const avgScore = studentCount > 0
    ? (formattedMembers.filter((m: any) => m.role === 'student').reduce((s: number, m: any) => s + (m.skillScore || 0), 0) / studentCount).toFixed(1)
    : '—'

  const stats = {
    avgScore: studentCount > 0 ? `${avgScore} pts` : '—',
    atRisk: 0,
    activeGroups: 0
  }

  // Fetch activities
  const { data: activities } = await supabase
    .from('activities')
    .select('*')
    .eq('classroom_id', id)
    .order('created_at', { ascending: false })

  return (
    <ClassroomClient 
      classroom={classroom} 
      members={formattedMembers} 
      userRole={member.role}
      stats={stats}
      activities={activities || []}
    />
  )
}
