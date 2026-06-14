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
    .select('role')
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
      members:classroom_members(count)
    `)
    .in('id', classroomIds)
    .order('created_at', { ascending: false })

  const formattedClassrooms = classrooms?.map(c => ({
    ...c,
    studentCount: c.members[0].count
  })) || []

  const isTeacher = profile?.role === 'teacher'

  return (
    <div className="animate-in fade-in duration-500">
      {isTeacher ? (
        <TeacherDashboard classrooms={formattedClassrooms} />
      ) : (
        <StudentDashboard classrooms={formattedClassrooms} />
      )}
    </div>
  )
}
