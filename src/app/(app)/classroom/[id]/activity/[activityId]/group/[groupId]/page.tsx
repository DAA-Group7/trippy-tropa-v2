import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GroupWorkspaceClient from './GroupWorkspaceClient'
import { getTimeMatrixAction } from '@/app/actions/tasks'

export default async function GroupWorkspacePage({ params }: { params: Promise<{ id: string; activityId: string; groupId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { id: classroomId, activityId, groupId } = await params

  // 1. Validate member access
  const { data: member } = await supabase
    .from('classroom_members')
    .select('role')
    .eq('classroom_id', classroomId)
    .eq('user_id', user.id)
    .single()

  if (!member) redirect('/dashboard')

  // 2. Fetch Activity
  const { data: activity } = await supabase
    .from('activities')
    .select('*')
    .eq('id', activityId)
    .single()

  if (!activity) redirect(`/classroom/${classroomId}`)

  // 3. Fetch Group
  const { data: group } = await supabase
    .from('groups')
    .select('*')
    .eq('id', groupId)
    .single()

  if (!group) redirect(`/classroom/${classroomId}/activity/${activityId}`)

  // 4. Fetch Matrix Data (Tasks, Estimates, Group Members)
  const matrixData = await getTimeMatrixAction(groupId)
  if (matrixData.error) {
    throw new Error(matrixData.error)
  }

  // Ensure user is in the group OR is a teacher
  const isTeacherOrOfficer = ['teacher', 'student_officer'].includes(member.role)
  const isGroupMember = matrixData.members?.some((m: any) => m.user_id === user.id)

  if (!isTeacherOrOfficer && !isGroupMember) {
    redirect(`/classroom/${classroomId}/activity/${activityId}`)
  }

  return (
    <GroupWorkspaceClient
      activity={activity}
      group={group}
      members={matrixData.members || []}
      tasks={matrixData.tasks || []}
      estimates={matrixData.estimates || []}
      currentUserId={user.id}
      userRole={member.role}
    />
  )
}
