import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ActivityDetailClient from './ActivityDetailClient'

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string; activityId: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { id: classroomId, activityId } = await params

  const { data: member } = await supabase
    .from('classroom_members')
    .select('role')
    .eq('classroom_id', classroomId)
    .eq('user_id', user.id)
    .single()

  if (!member) redirect('/dashboard')

  const { data: activity } = await supabase
    .from('activities')
    .select('*')
    .eq('id', activityId)
    .single()

  if (!activity) redirect(`/classroom/${classroomId}`)

  // Fetch groups if they exist
  let groups: any[] = []
  if (activity.groups_created) {
    const { data: groupsData } = await supabase
      .from('groups')
      .select(`
        id, name,
        members:group_members(
          id, is_leader,
          profile:user_id(id, full_name, email, avatar_url)
        )
      `)
      .eq('activity_id', activityId)
    groups = groupsData || []
  }

  // If student, find their group
  let myGroup: any = null
  if (member.role === 'student' && groups.length > 0) {
    myGroup = groups.find((g: any) =>
      g.members?.some((m: any) => m.profile?.id === user.id)
    )
  }

  // Count students for planning display
  const { count: studentCount } = await supabase
    .from('classroom_members')
    .select('id', { count: 'exact', head: true })
    .eq('classroom_id', classroomId)
    .eq('role', 'student')

  return (
    <ActivityDetailClient
      activity={activity}
      classroomId={classroomId}
      userRole={member.role}
      userId={user.id}
      groups={groups}
      myGroup={myGroup}
      studentCount={studentCount || 0}
    />
  )
}
