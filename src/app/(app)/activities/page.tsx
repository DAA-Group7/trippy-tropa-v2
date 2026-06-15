import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ActivitiesClient from './ActivitiesClient'

export default async function ActivitiesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get all classrooms the student is in
  const { data: myMemberships } = await supabase
    .from('classroom_members')
    .select('classroom_id, role')
    .eq('user_id', user.id)

  const classroomIds = myMemberships?.map(m => m.classroom_id) || []

  if (classroomIds.length === 0) {
    return <ActivitiesClient activities={[]} userId={user.id} />
  }

  // Fetch all activities across all enrolled classrooms
  const { data: activities } = await supabase
    .from('activities')
    .select(`
      id,
      title,
      description,
      type,
      due_date,
      groups_created,
      tasks_assigned,
      classroom_id,
      classroom:classrooms(id, name)
    `)
    .in('classroom_id', classroomIds)
    .order('due_date', { ascending: true, nullsFirst: false })

  // For group activities, check if the student is assigned to a group
  const groupActivityIds = activities
    ?.filter(a => a.type === 'group' && a.groups_created)
    .map(a => a.id) || []

  let myGroupMap: Record<string, { id: string; name: string }> = {}

  if (groupActivityIds.length > 0) {
    const { data: myGroups } = await supabase
      .from('group_members')
      .select(`
        group:group_id(id, name, activity_id)
      `)
      .eq('user_id', user.id)

    if (myGroups) {
      myGroups.forEach((gm: any) => {
        if (gm.group?.activity_id) {
          myGroupMap[gm.group.activity_id] = { id: gm.group.id, name: gm.group.name }
        }
      })
    }
  }

  let submittedActIds = new Set<string>()

  if (activities && activities.length > 0) {
    const actIds = activities.map(a => a.id)
    const { data: subs } = await supabase
      .from('submissions')
      .select('activity_id')
      .eq('user_id', user.id)
      .in('activity_id', actIds)

    submittedActIds = new Set(subs?.map((s: any) => s.activity_id) || [])
  }

  const formattedActivities = (activities || []).map(a => ({
    ...a,
    classroom: Array.isArray(a.classroom) ? a.classroom[0] ?? null : a.classroom,
    myGroup: myGroupMap[a.id] || null,
    isSubmitted: submittedActIds.has(a.id)
  }))

  return <ActivitiesClient activities={formattedActivities} userId={user.id} />
}
