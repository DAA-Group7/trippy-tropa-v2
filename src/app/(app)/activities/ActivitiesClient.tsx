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
  const { due_date, type, groups_created, tasks_assigned, myGroup } = activity

  if (!due_date) return { label: 'No Due Date', color: 'rgba(200,196,215,0.6)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)' }

  const due = new Date(due_date)
  const now = new Date()

  if (activity.isSubmitted) {
    return { label: 'Submitted', color: '#46eae5', bg: 'rgba(70,234,229,0.08)', border: 'rgba(70,234,229,0.2)' }
  }

  if (isPast(due)) {
    return { label: 'Overdue', color: '#ffb4ab', bg: 'rgba(255,180,171,0.08)', border: 'rgba(255,180,171,0.2)' }
  }
  if (isToday(due)) {
    return { label: 'Due Today', color: '#ffb77d', bg: 'rgba(255,183,125,0.08)', border: 'rgba(255,183,125,0.2)' }
  }
  if (isTomorrow(due)) {
    return { label: 'Due Tomorrow', color: '#ffb77d', bg: 'rgba(255,183,125,0.06)', border: 'rgba(255,183,125,0.15)' }
  }
  const days = differenceInDays(due, now)
  if (days <= 7) {
    return { label: `${days}d left`, color: '#c6bfff', bg: 'rgba(198,191,255,0.06)', border: 'rgba(198,191,255,0.15)' }
  }
  return { label: 'Upcoming', color: 'rgba(200,196,215,0.6)', bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)' }
}

function formatDueDate(dateStr?: string) {
  if (!dateStr) return null
  const d = new Date(dateStr)
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
        className="p-5 rounded-2xl transition-all duration-200 cursor-pointer"
        style={{
          backgroundColor: status.bg,
          border: `1px solid ${status.border}`,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(198,191,255,0.1)'
          e.currentTarget.style.borderColor = 'rgba(198,191,255,0.25)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.borderColor = status.border
        }}
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
                <span className="text-muted-foreground/30 text-[10px]">·</span>
                <span className="text-[10px] text-muted-foreground">
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
                  className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg text-[11px] bg-muted/50 text-muted-foreground border border-border/50"
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
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1"
              style={{
                backgroundColor: status.bg,
                color: status.color,
                border: `1px solid ${status.border}`
              }}
            >
              {activity.isSubmitted ? <CheckCircle className="w-3 h-3" /> : (isPast(new Date(activity.due_date!)) ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />)}
              {status.label}
            </span>

            {/* Date */}
            {dateLabel && (
              <div
                className="flex items-center gap-1 text-[11px] text-muted-foreground/50"
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
      <p className="text-sm max-w-xs text-muted-foreground">
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

  // Split by status for summary
  const overdue = activities.filter(a => a.due_date && isPast(new Date(a.due_date)))
  const upcoming = activities.filter(a => !a.due_date || !isPast(new Date(a.due_date)))
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
          <p className="mt-1 text-sm text-muted-foreground">
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
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Activity list */}
        {activities.length === 0 ? (
          <EmptyState />
        ) : isGlobalTeacher ? (
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
                  <span className="text-xs font-semibold text-muted-foreground bg-background px-2 py-1 rounded-md border border-border">{acts.length} Activities</span>
                </div>
                <div className="p-6 space-y-3">
                  {acts.map(a => <ActivityCard key={a.id} activity={a} isTeacher={true} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {overdue.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-3.5 h-3.5" /> Overdue
                </p>
                <div className="space-y-3">
                  {overdue.map(a => <ActivityCard key={a.id} activity={a} isTeacher={false} />)}
                </div>
              </div>
            )}

            {upcoming.length > 0 && (
              <div className={overdue.length > 0 ? 'mt-6' : ''}>
                {overdue.length > 0 && (
                  <p className="text-xs font-bold uppercase tracking-wider mb-3 text-muted-foreground/50">
                    Upcoming
                  </p>
                )}
                <div className="space-y-3">
                  {upcoming.map(a => <ActivityCard key={a.id} activity={a} isTeacher={false} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
