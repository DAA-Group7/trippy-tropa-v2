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
          id, is_leader, user_id
        )
      `)
      .eq('activity_id', activityId)

    if (groupsData) {
      // Collect all user IDs from all groups
      const userIds = new Set<string>()
      groupsData.forEach(g => {
        g.members?.forEach((m: any) => userIds.add(m.user_id))
      })

      // Fetch profiles manually
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .in('id', Array.from(userIds))

      // Stitch profiles into the groups data
      groups = groupsData.map(g => ({
        ...g,
        members: g.members?.map((m: any) => ({
          ...m,
          profile: profiles?.find(p => p.id === m.user_id) || null
        }))
      }))
    }
  }

  // If student, find their group
  let myGroup: any = null
  if (member.role === 'student' && groups.length > 0) {
    myGroup = groups.find((g: any) =>
      g.members?.some((m: any) => m.user_id === user.id)
    )
    if (myGroup) {
      redirect(`/classroom/${classroomId}/activity/${activityId}/group/${myGroup.id}`)
    }
  }

  // Count students for planning display
  const { count: studentCount } = await supabase
    .from('classroom_members')
    .select('id', { count: 'exact', head: true })
    .eq('classroom_id', classroomId)
    .eq('role', 'student')

  // Submissions
  let submissions: any[] = []
  let mySubmission: any = null

  if (['teacher', 'student_officer'].includes(member.role)) {
    const { data: subs } = await supabase
      .from('submissions')
      .select(`
        *,
        profiles:user_id(id, full_name, avatar_url),
        groups:group_id(id, name)
      `)
      .eq('activity_id', activityId)
      .order('submitted_at', { ascending: false })
    submissions = subs || []
  } else {
    // Student individual submission
    if (activity.type === 'individual') {
      const { data: sub } = await supabase
        .from('submissions')
        .select('*')
        .eq('activity_id', activityId)
        .eq('user_id', user.id)
        .maybeSingle()
      mySubmission = sub
    }
  }

  return (
    <ActivityDetailClient
      activity={activity}
      classroomId={classroomId}
      userRole={member.role}
      userId={user.id}
      groups={groups}
      myGroup={myGroup}
      studentCount={studentCount || 0}
      submissions={submissions}
      mySubmission={mySubmission}
    />
  )
}
