'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Users, User, Calendar, Crown, Loader2,
  Zap, CheckCircle, Clock, AlertTriangle, ChevronRight, BookOpen
} from 'lucide-react'
import GroupDraftBoard from '@/components/activities/GroupDraftBoard'
import { generateGroupsAction, confirmGroupsAction } from '@/app/actions/activities'

interface Props {
  activity: any
  classroomId: string
  userRole: string
  userId: string
  groups: any[]
  myGroup: any
  studentCount: number
}

function StatusBadge({ dueDate }: { dueDate: string | null }) {
  if (!dueDate) return null
  const due = new Date(dueDate)
  const now = new Date()
  const isOverdue = due < now

  return (
    <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border ${
      isOverdue
        ? 'bg-error/10 text-error border-error/30'
        : 'bg-secondary/10 text-secondary border-secondary/30'
    }`}>
      {isOverdue ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
      {isOverdue ? 'Overdue' : 'Upcoming'}
    </span>
  )
}

function PlaceholderCard({ message }: { message: string }) {
  return (
    <div className="bg-[rgba(18,18,42,0.7)] backdrop-blur-xl border border-dashed border-white/10 rounded-xl p-16 text-center">
      <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
      <p className="text-white/40 text-sm">{message}</p>
    </div>
  )
}

export default function ActivityDetailClient({
  activity, classroomId, userRole, userId, groups: initialGroups, myGroup, studentCount
}: Props) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDrafting, setIsDrafting] = useState(false)
  const [draftGroups, setDraftGroups] = useState<any[]>([])
  const [groups, setGroups] = useState(initialGroups)
  const [groupsCreated, setGroupsCreated] = useState(activity.groups_created)
  const [error, setError] = useState<string | null>(null)

  const canManage = userRole === 'teacher' || userRole === 'student_officer'
  const isGroup = activity.type === 'group'

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    try {
      const result = await generateGroupsAction(activity.id)
      if ('error' in result && result.error) {
        setError(result.error as string)
        return
      }
      if (result.draft) {
        setDraftGroups(result.draft)
        setIsDrafting(true)
      }
    } catch (e: any) {
      setError(e.message || 'Failed to generate groups')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleConfirmed = () => {
    setGroupsCreated(true)
    setIsDrafting(false)
    router.refresh()
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'No due date'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-32">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href={`/classroom/${classroomId}`}
          className="inline-flex items-center gap-1.5 text-secondary text-sm hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Classroom
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold text-white">{activity.title}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                isGroup
                  ? 'bg-secondary/10 text-secondary border-secondary/30'
                  : 'bg-primary/10 text-primary border-primary/30'
              }`}>
                {isGroup ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
                {isGroup ? 'Group Activity' : 'Individual'}
              </span>
              <StatusBadge dueDate={activity.due_date} />
            </div>

            {activity.description && (
              <p className="text-white/60 max-w-2xl text-base">{activity.description}</p>
            )}

            {activity.due_date && (
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Calendar className="w-4 h-4" />
                <span>Due: {formatDate(activity.due_date)}</span>
              </div>
            )}
          </div>

          {isGroup && (
            <div className="flex items-center gap-4">
              <div className="bg-[rgba(18,18,42,0.7)] border border-white/10 rounded-xl px-5 py-3 text-center">
                <p className="text-2xl font-bold text-white">{studentCount}</p>
                <p className="text-xs text-white/40 uppercase tracking-wide">Students</p>
              </div>
              {activity.num_groups && (
                <div className="bg-[rgba(18,18,42,0.7)] border border-white/10 rounded-xl px-5 py-3 text-center">
                  <p className="text-2xl font-bold text-secondary">{activity.num_groups}</p>
                  <p className="text-xs text-white/40 uppercase tracking-wide">Groups</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── INDIVIDUAL ACTIVITY ─────────────────────────────── */}
      {!isGroup && (
        <>
          {canManage ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Submissions</h2>
              <PlaceholderCard message="Submission tracking will be available in Phase 6." />
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Your Submission</h2>
              <PlaceholderCard message="Submission portal will be available in Phase 6." />
            </div>
          )}
        </>
      )}

      {/* ── GROUP ACTIVITY – NOT YET CREATED ────────────────── */}
      {isGroup && !groupsCreated && (
        <>
          {canManage ? (
            <div className="space-y-6">
              {/* Info card */}
              <div className="bg-[rgba(18,18,42,0.7)] border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center flex-shrink-0">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Ready to form groups</h2>
                  <p className="text-white/60">
                    <span className="text-white font-semibold">{studentCount}</span> students enrolled,
                    creating <span className="text-secondary font-semibold">{activity.num_groups}</span> groups
                    (~<span className="text-white font-semibold">{Math.ceil(studentCount / (activity.num_groups || 1))}</span> per group)
                  </p>
                  <p className="text-white/40 text-sm mt-1">
                    Uses Greedy LPT algorithm to balance skill scores across all groups.
                  </p>
                </div>
              </div>

              {/* Generate button */}
              {!isDrafting && (
                <div className="flex justify-center py-8">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-primary-container to-secondary text-white font-bold py-5 px-12 rounded-2xl text-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(70,234,229,0.25)] disabled:animate-none disabled:opacity-60 disabled:scale-100"
                    style={{ animation: isGenerating ? 'none' : undefined }}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Running Algorithm...
                      </>
                    ) : (
                      <>
                        <Zap className="w-6 h-6" />
                        Generate Balanced Groups
                      </>
                    )}
                  </button>
                </div>
              )}

              {error && (
                <div className="bg-error/10 border border-error/30 rounded-xl p-4 text-error text-sm text-center">
                  {error}
                </div>
              )}

              {/* Draft board */}
              {isDrafting && draftGroups.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Draft Preview</h2>
                    <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 px-3 py-1 rounded-full font-bold">
                      Draft Mode — Not Saved
                    </span>
                  </div>
                  <GroupDraftBoard
                    activityId={activity.id}
                    classroomId={classroomId}
                    initialGroups={draftGroups}
                    onConfirmed={handleConfirmed}
                  />
                </div>
              )}
            </div>
          ) : (
            <PlaceholderCard message="Groups have not been created yet. Please wait for your teacher to generate groups." />
          )}
        </>
      )}

      {/* ── GROUP ACTIVITY – CONFIRMED ──────────────────────── */}
      {isGroup && groupsCreated && (
        <>
          {canManage ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Groups</h2>
                <span className="text-xs bg-secondary/10 text-secondary border border-secondary/30 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3" />
                  Confirmed
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {initialGroups.map(group => {
                  const leader = group.members?.find((m: any) => m.is_leader)
                  const others = group.members?.filter((m: any) => !m.is_leader) || []
                  return (
                    <Link href={`/classroom/${classroomId}/activity/${activity.id}/group/${group.id}`} key={group.id} className="bg-[rgba(18,18,42,0.7)] backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:-translate-y-1 transition-all group cursor-pointer block">
                      <div className="h-1 bg-gradient-to-r from-primary-container to-secondary" />
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-bold text-white group-hover:text-secondary transition-colors">{group.name}</h3>
                          <span className="text-xs bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full font-bold">
                            {group.members?.length} members
                          </span>
                        </div>
                        {leader && (
                          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                            <Crown className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                              {leader.profile?.full_name?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">{leader.profile?.full_name}</p>
                              <p className="text-xs text-white/40">Group Leader</p>
                            </div>
                          </div>
                        )}
                        <div className="space-y-1.5">
                          {others.slice(0, 4).map((m: any) => (
                            <div key={m.id} className="flex items-center gap-2 text-sm text-white/60">
                              <div className="w-5 h-5 rounded-full bg-primary-container/30 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                                {m.profile?.full_name?.charAt(0)}
                              </div>
                              <span className="truncate">{m.profile?.full_name}</span>
                            </div>
                          ))}
                          {others.length > 4 && (
                            <p className="text-xs text-white/30 pl-7">+{others.length - 4} more</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ) : (
            /* Student view */
            <div className="space-y-4">
              {myGroup ? (
                <>
                  <h2 className="text-xl font-bold text-white">Your Group</h2>
                  <div className="bg-[rgba(18,18,42,0.7)] backdrop-blur-xl border border-secondary/30 rounded-xl p-6 space-y-4 shadow-[0_0_30px_rgba(70,234,229,0.1)]">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-secondary">{myGroup.name}</h3>
                        <p className="text-white/40 text-sm">{myGroup.members?.length} members</p>
                      </div>
                    </div>
                    <div className="divide-y divide-white/5">
                      {myGroup.members?.map((m: any) => (
                        <div key={m.id} className="flex items-center gap-3 py-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {m.profile?.full_name?.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-white text-sm">{m.profile?.full_name}</p>
                            <p className="text-xs text-white/40">{m.profile?.email}</p>
                          </div>
                          {m.is_leader && (
                            <span className="flex items-center gap-1 text-xs text-yellow-400 font-bold">
                              <Crown className="w-3 h-3" />
                              Leader
                            </span>
                          )}
                          {m.profile?.id === userId && (
                            <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold">You</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link 
                    href={`/classroom/${classroomId}/activity/${activity.id}/group/${myGroup.id}`}
                    className="block bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 hover:border-secondary/50 rounded-xl p-6 text-center transition-all group"
                  >
                    <p className="text-secondary font-bold text-lg group-hover:scale-105 transition-transform flex items-center justify-center gap-2">
                      Enter Group Workspace
                      <ChevronRight className="w-5 h-5" />
                    </p>
                  </Link>
                </>
              ) : (
                <PlaceholderCard message="You have not been assigned to a group yet." />
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
