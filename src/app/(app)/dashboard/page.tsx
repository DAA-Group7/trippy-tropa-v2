import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TeacherDashboard from './TeacherDashboard'
import StudentDashboard from './StudentDashboard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  const { data: myMemberships } = await supabase
    .from('classroom_members')
    .select('classroom_id')
    .eq('user_id', user.id)

  const classroomIds = myMemberships?.map(m => m.classroom_id) || []

  // Fetch classrooms with member count
  const { data: classrooms } = await supabase
    .from('classrooms')
    .select(`
      *,
      members:classroom_members(role)
    `)
    .in('id', classroomIds)
    .order('created_at', { ascending: false })

  const formattedClassrooms = classrooms?.map(c => ({
    ...c,
    studentCount: c.members?.filter((m: any) => m.role === 'student').length || 0
  })) || []

  const isTeacher = profile?.role === 'teacher'

  let upcomingActivities: any[] = []
  if (!isTeacher && classroomIds.length > 0) {
    const { data } = await supabase
      .from('activities')
      .select('id, title, due_date, classroom_id, classroom:classrooms(name)')
      .in('classroom_id', classroomIds)
      .gt('due_date', new Date().toISOString())
      .order('due_date', { ascending: true })
      .limit(5)
    upcomingActivities = data || []
  }

  return (
    <div className="animate-in fade-in duration-500">
      {isTeacher ? (
        <TeacherDashboard classrooms={formattedClassrooms} profile={profile} />
      ) : (
        <StudentDashboard classrooms={formattedClassrooms} profile={profile} upcomingActivities={upcomingActivities} />
      )}
    </div>
  )
}
