'use client'

import Link from 'next/link'
import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns'
import { BookOpen, Users, User, Clock, CheckCircle, AlertTriangle, ChevronRight, Crown } from 'lucide-react'

interface Activity {
  id: string
  title: string
  description?: string
  type: 'individual' | 'group'
  due_date?: string
  groups_created: boolean
  tasks_assigned: boolean
  classroom_id: string
  classroom: { id: string; name: string } | null
  myGroup: { id: string; name: string } | null
  isSubmitted?: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusInfo(activity: Activity) {
  const { due_date } = activity

  if (!due_date) return { label: 'No Due Date', textColor: 'text-muted-foreground', bgClass: 'bg-muted/50', borderClass: 'border-border/50' }

  const due = new Date(due_date)
  if (isNaN(due.getTime())) return { label: 'No Due Date', textColor: 'text-muted-foreground', bgClass: 'bg-muted/50', borderClass: 'border-border/50' }

  const now = new Date()

  if (activity.isSubmitted) {
    return { label: 'Submitted', textColor: 'text-primary', bgClass: 'bg-primary/10', borderClass: 'border-primary/20' }
  }

  if (isPast(due)) {
    return { label: 'Overdue', textColor: 'text-destructive', bgClass: 'bg-destructive/10', borderClass: 'border-destructive/20' }
  }
  if (isToday(due)) {
    return { label: 'Due Today', textColor: 'text-orange-600 dark:text-orange-400', bgClass: 'bg-orange-500/10', borderClass: 'border-orange-500/20' }
  }
  if (isTomorrow(due)) {
    return { label: 'Due Tomorrow', textColor: 'text-amber-600 dark:text-amber-400', bgClass: 'bg-amber-500/10', borderClass: 'border-amber-500/20' }
  }
  const days = differenceInDays(due, now)
  if (days <= 7) {
    return { label: `${days}d left`, textColor: 'text-indigo-600 dark:text-indigo-400', bgClass: 'bg-indigo-500/10', borderClass: 'border-indigo-500/20' }
  }
  return { label: 'Upcoming', textColor: 'text-muted-foreground', bgClass: 'bg-muted/30', borderClass: 'border-border/30' }
}

function formatDueDate(dateStr?: string) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return null
  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  return format(d, 'MMM d, yyyy · h:mm a')
}

// ─── Activity Card ────────────────────────────────────────────────────────────

function ActivityCard({ activity, isTeacher }: { activity: Activity, isTeacher?: boolean }) {
  const status = getStatusInfo(activity)
  const isGroup = activity.type === 'group'
  const dateLabel = formatDueDate(activity.due_date)

  const href = activity.myGroup
    ? `/classroom/${activity.classroom_id}/activity/${activity.id}/group/${activity.myGroup.id}`
    : `/classroom/${activity.classroom_id}/activity/${activity.id}`

  return (
    <Link href={href} className="block group">
      <div
        className={`p-5 rounded-2xl transition-all duration-200 cursor-pointer ${status.bgClass} border ${status.borderClass} hover:shadow-md hover:border-primary/30`}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Left */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${isGroup ? 'bg-secondary/10' : 'bg-primary/10'}`}
            >
              {isGroup
                ? <Users className="w-5 h-5 text-secondary" />
                : <User className="w-5 h-5 text-primary" />}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${isGroup ? 'text-secondary' : 'text-primary'}`}
                >
                  {isGroup ? 'Group' : 'Individual'}
                </span>
                <span className="text-muted-foreground/60 text-[10px]">·</span>
                <span className="text-[10px] font-semibold text-foreground/70">
                  {activity.classroom?.name}
                </span>
              </div>

              <h3
                className="text-base font-semibold leading-snug truncate transition-colors duration-200 group-hover:text-primary text-foreground"
              >
                {activity.title}
              </h3>

              {activity.description && (
                <p className="text-sm mt-1 line-clamp-1 text-muted-foreground">
                  {activity.description}
                </p>
              )}

              {/* Group info */}
              {isGroup && activity.myGroup && (
                <div
                  className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-secondary/10 text-secondary border border-secondary/20"
                >
                  <Crown className="w-3 h-3" />
                  {activity.myGroup.name}
                </div>
              )}

              {isGroup && activity.groups_created && !activity.myGroup && !isTeacher && (
                <div
                  className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg text-[11px] bg-muted/50 text-foreground/70 font-semibold border border-border/50"
                >
                  Not yet assigned to a group
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {/* Status badge */}
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 border ${status.bgClass} ${status.textColor} ${status.borderClass}`}
            >
              {activity.isSubmitted ? <CheckCircle className="w-3 h-3" /> : (isPast(new Date(activity.due_date!)) ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />)}
              {status.label}
            </span>

            {/* Date */}
            {dateLabel && (
              <div
                className="flex items-center gap-1 text-[11px] font-medium text-foreground/60"
              >
                <Clock className="w-3 h-3" />
                {dateLabel}
              </div>
            )}

            {/* Tasks done indicator */}
            {activity.tasks_assigned && (
              <div className="flex items-center gap-1 text-[11px] text-secondary">
                <CheckCircle className="w-3 h-3" />
                Tasks assigned
              </div>
            )}

            <ChevronRight
              className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary"
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center py-24 rounded-2xl border-2 border-dashed border-border/50 bg-card/40"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-primary/10"
      >
        <BookOpen className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-foreground">No activities yet</h3>
      <p className="text-sm max-w-xs text-foreground/70">
        Join a classroom and your activities will appear here.
      </p>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

type FilterType = 'all' | 'individual' | 'group'
type FilterStatus = 'all' | 'overdue' | 'upcoming'

export default function ActivitiesClient({ activities, userId, userRoleMap, isGlobalTeacher }: { activities: Activity[]; userId: string; userRoleMap?: Record<string, string>; isGlobalTeacher?: boolean }) {
  const now = new Date()

  const isValidDate = (d?: string | null) => d ? !isNaN(new Date(d).getTime()) : false
  const overdue = activities.filter(a => isValidDate(a.due_date) && isPast(new Date(a.due_date!)))
  const upcoming = activities.filter(a => !isValidDate(a.due_date) || !isPast(new Date(a.due_date!)))
  const groupActs = activities.filter(a => a.type === 'group')
  const individualActs = activities.filter(a => a.type === 'individual')

  return (
    <div className="min-h-full p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            All Activities
          </h1>
          <p className="mt-1 text-sm text-foreground/70">
            Your individual and group activities across all enrolled classrooms.
          </p>
        </div>

        {/* Stats row */}
        {activities.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total', value: activities.length, colorClass: 'text-primary' },
              { label: 'Overdue', value: overdue.length, colorClass: 'text-destructive' },
              { label: 'Group', value: groupActs.length, colorClass: 'text-secondary' },
              { label: 'Individual', value: individualActs.length, colorClass: 'text-primary' },
            ].map(s => (
              <div
                key={s.label}
                className="rounded-xl p-4 text-center bg-card border border-border"
              >
                <div className={`text-2xl font-bold mb-0.5 ${s.colorClass}`}>{s.value}</div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground/70">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Activity list */}
        {activities.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-8">
            {Object.entries(
              activities.reduce((acc, act) => {
                const cId = act.classroom?.name || 'Unknown Classroom';
                if (!acc[cId]) acc[cId] = [];
                acc[cId].push(act);
                return acc;
              }, {} as Record<string, Activity[]>)
            ).map(([classroomName, acts]) => (
              <div key={classroomName} className="bg-card/40 rounded-2xl border border-border overflow-hidden">
                <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-bold text-foreground text-lg">{classroomName}</h3>
                  <span className="text-xs font-semibold text-foreground/80 bg-background px-2 py-1 rounded-md border border-border">{acts.length} Activities</span>
                </div>
                <div className="p-6 space-y-3">
                  {acts.map(a => <ActivityCard key={a.id} activity={a} isTeacher={isGlobalTeacher} />)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
