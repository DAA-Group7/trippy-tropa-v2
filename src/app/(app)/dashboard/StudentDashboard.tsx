'use client'

import { useActionState, useEffect, useRef } from 'react'
import { joinClassroomAction } from '@/app/actions/classroom'
import Link from 'next/link'
import { format } from 'date-fns'
import { School, ChevronRight, Users, BookOpen, ArrowUpRight, AlertTriangle, Clock } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Classroom {
  id: string
  name: string
  description?: string
  studentCount: number
}

interface Activity {
  id: string
  title: string
  due_date: string
  classroom_id: string
  classroom: { name: string } | null
}

interface Props {
  classrooms: Classroom[]
  profile: { full_name?: string; role?: string } | null
  upcomingActivities: Activity[]
}

// ─── Classroom Card ───────────────────────────────────────────────────────────

const CLASSROOM_ICON_COLORS = [
  { bg: 'bg-primary/15', text: 'text-primary' },
  { bg: 'bg-secondary/15', text: 'text-secondary' },
  { bg: 'bg-accent/15',  text: 'text-accent' },
]

function ClassroomCard({ classroom, index }: { classroom: Classroom; index: number }) {
  const color = CLASSROOM_ICON_COLORS[index % CLASSROOM_ICON_COLORS.length]

  return (
    <Link href={`/classroom/${classroom.id}`} className="block h-full">
      <div
        className="flex flex-col h-64 p-5 rounded-2xl transition-all duration-300 group cursor-pointer bg-card/60 backdrop-blur-xl border border-border hover:shadow-[0_0_24px_rgba(var(--primary),0.15)] hover:border-primary/30"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${color.bg}`}
          >
            <School className={`w-5 h-5 ${color.text}`} />
          </div>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border bg-secondary/10 border-secondary/30 text-secondary"
          >
            Active
          </span>
        </div>

        {/* Body */}
        <div className="flex-1">
          <h3
            className="text-[17px] font-semibold leading-snug mb-1.5 transition-colors duration-200 text-foreground"
          >
            {classroom.name}
          </h3>
          <p
            className="text-sm line-clamp-2 leading-relaxed text-muted-foreground"
          >
            {classroom.description || 'No description provided.'}
          </p>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-3 mt-auto border-t border-border"
        >
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-3.5 h-3.5 opacity-60" />
            <span className="text-[11px] opacity-70">
              {classroom.studentCount} student{classroom.studentCount !== 1 ? 's' : ''}
            </span>
          </div>
          <ArrowUpRight
            className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-primary"
          />
        </div>
      </div>
    </Link>
  )
}

// ─── Activity Feed Item ────────────────────────────────────────────────────────

function ActivityItem({ activity }: { activity: Activity }) {
  const dueDate = new Date(activity.due_date)
  const now = new Date()
  const isOverdue = dueDate < now
  const diffMs = dueDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  const isSoon = !isOverdue && diffDays <= 1

  let statusLabel = 'Upcoming'
  if (isOverdue) statusLabel = 'Overdue'
  else if (isSoon) statusLabel = 'Due Soon'

  const dateLabel = isOverdue
    ? `Due ${format(dueDate, 'MMM d')}`
    : diffDays === 0
    ? 'Today'
    : diffDays === 1
    ? 'Tomorrow'
    : format(dueDate, 'MMM d')

  return (
    <Link href={`/classroom/${activity.classroom_id}/activity/${activity.id}`}>
      <div
        className={`p-4 rounded-xl border-l-4 transition-all duration-200 cursor-pointer mb-3 hover:brightness-110 ${
          isOverdue ? 'bg-destructive/10 border-destructive' :
          isSoon ? 'bg-accent/10 border-accent' :
          'bg-primary/10 border-primary'
        }`}
      >
        <div className="flex justify-between items-start mb-1">
          <p className={`text-[10px] font-bold uppercase tracking-wider ${isOverdue ? 'text-destructive' : isSoon ? 'text-accent' : 'text-primary'}`}>
            {isOverdue && <AlertTriangle className="w-3 h-3 inline mr-1" />}
            {statusLabel}
          </p>
          <p className="text-[10px] text-muted-foreground">{dateLabel}</p>
        </div>
        <h4 className="text-sm font-semibold leading-snug mb-0.5 text-foreground">
          {activity.title}
        </h4>
        <p className="text-[11px] text-muted-foreground/80">
          {activity.classroom?.name}
        </p>
      </div>
    </Link>
  )
}

// ─── Join Classroom Form ───────────────────────────────────────────────────────

function JoinClassroomCard({
  formAction,
  isPending,
  error,
}: {
  formAction: (payload: FormData) => void
  isPending: boolean
  error?: string | null
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <section
      className="relative overflow-hidden rounded-2xl p-6 bg-card/60 backdrop-blur-xl border border-border"
    >
      {/* Ambient blob */}
      <div
        className="absolute -right-16 -top-16 w-56 h-56 rounded-full pointer-events-none bg-primary/10 blur-[80px]"
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2 text-foreground">
            <BookOpen className="w-5 h-5 text-primary" />
            Join a Classroom
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter the 6-character code provided by your instructor.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <form action={formAction} className="flex gap-3 w-full md:w-auto md:min-w-[400px]">
            <input
              ref={inputRef}
              type="text"
              name="code"
              maxLength={6}
              required
              placeholder="EX: TROP24"
              className="flex-1 text-center font-black tracking-[0.4em] text-xl uppercase outline-none transition-all duration-200 rounded-xl px-5 py-3 bg-input border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
              onInput={e => {
                const el = e.currentTarget
                el.value = el.value.toUpperCase()
              }}
            />
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 text-primary-foreground bg-primary shadow-lg hover:shadow-xl hover:shadow-primary/20"
            >
              {isPending ? 'Joining...' : 'Join'}
            </button>
          </form>
          {error && (
            <p className="text-sm font-medium text-destructive">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyClassrooms() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl border-2 border-dashed border-border bg-card/40"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-primary/10"
      >
        <School className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-base font-semibold mb-1 text-foreground">
        No classrooms yet
      </h3>
      <p className="text-sm text-muted-foreground">
        Use an invite code above to join your first class.
      </p>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StudentDashboard({ classrooms, profile, upcomingActivities }: Props) {
  const [state, formAction, isPending] = useActionState(joinClassroomAction, null)

  useEffect(() => {
    if (state?.success && state.classroomId) {
      if (state.hasSkills) {
        window.location.href = `/onboarding/${state.classroomId}`
      } else {
        window.location.href = `/classroom/${state.classroomId}`
      }
    }
  }, [state])

  const firstName = profile?.full_name?.split(' ')[0] || 'Student'

  return (
    <div className="min-h-full p-6 md:p-8">
      <div className="flex flex-col xl:flex-row gap-8 max-w-7xl mx-auto items-start">
        
        {/* ── Left Sidebar (Activity Feed) ── */}
        <aside className="w-72 flex-shrink-0 hidden xl:flex flex-col gap-5 sticky top-8" style={{ height: 'calc(100vh - 6rem)' }}>
          <div
            className="flex-1 flex flex-col rounded-2xl p-5 overflow-hidden bg-card/60 backdrop-blur-xl border border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-foreground">Activity Feed</h3>
              <Clock className="w-4 h-4 text-muted-foreground/60" />
            </div>

            {/* Feed */}
            <div
              className="flex-1 overflow-y-auto space-y-3 pr-1"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#474554 transparent' }}
            >
              {upcomingActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="w-7 h-7 mb-3 text-muted-foreground/40" />
                  <p className="text-xs text-muted-foreground/60">No upcoming activities</p>
                </div>
              ) : (
                upcomingActivities.map((a: any) => {
                  const due = new Date(a.due_date)
                  const now = new Date()
                  const isOverdue = due < now
                  const diffDays = Math.ceil((due.getTime() - now.getTime()) / 86400000)

                  let statusLabel = 'Upcoming'
                  if (a.isSubmitted) statusLabel = 'Submitted'
                  else if (isOverdue) statusLabel = 'Overdue'
                  else if (diffDays <= 1) statusLabel = 'Due Soon'

                  return (
                    <Link key={a.id} href={`/classroom/${a.classroom_id}/activity/${a.id}`} className="block mb-3">
                      <div
                        className={`p-3.5 rounded-xl border-l-4 transition-all duration-200 cursor-pointer hover:brightness-110 ${
                          a.isSubmitted ? 'bg-secondary/10 border-secondary' :
                          isOverdue ? 'bg-destructive/10 border-destructive' :
                          diffDays <= 1 ? 'bg-accent/10 border-accent' :
                          'bg-primary/10 border-primary'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-[10px] font-bold uppercase tracking-wider ${
                            a.isSubmitted ? 'text-secondary' :
                            isOverdue ? 'text-destructive' :
                            diffDays <= 1 ? 'text-accent' :
                            'text-primary'
                          }`}>
                            {isOverdue && <AlertTriangle className="w-3 h-3 inline mr-0.5" />}
                            {statusLabel}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {format(due, 'MMM d')}
                          </p>
                        </div>
                        <h4 className="text-sm font-semibold leading-snug text-foreground">
                          {a.title}
                        </h4>
                        <p className="text-[11px] mt-0.5 text-muted-foreground/80">
                          {a.classroom?.name}
                        </p>
                      </div>
                    </Link>
                  )
                })
              )}
            </div>

            {/* Footer */}
            <Link
              href="/activities"
              className="mt-4 w-full py-2.5 text-center text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 border border-border text-muted-foreground hover:bg-muted"
            >
              View All Activities <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Greeting */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome back, {firstName} 👋
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Here&apos;s what&apos;s happening across your enrolled classrooms.
            </p>
          </div>

          {/* Join Classroom */}
          <JoinClassroomCard formAction={formAction} isPending={isPending} error={state?.error} />

          {/* Classrooms Grid */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-foreground">
                Your Classrooms
              </h3>
            </div>

            {classrooms.length === 0 ? (
              <EmptyClassrooms />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {classrooms.map((c, i) => (
                  <ClassroomCard key={c.id} classroom={c} index={i} />
                ))}
              </div>
            )}
          </section>
        </div>

      </div>
    </div>
  )
}
