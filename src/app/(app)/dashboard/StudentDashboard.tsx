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
  { bg: 'rgba(108,92,231,0.15)', text: '#c6bfff' },
  { bg: 'rgba(0,206,201,0.15)', text: '#46eae5' },
  { bg: 'rgba(172,93,0,0.15)',  text: '#ffb77d' },
]

function ClassroomCard({ classroom, index }: { classroom: Classroom; index: number }) {
  const color = CLASSROOM_ICON_COLORS[index % CLASSROOM_ICON_COLORS.length]

  return (
    <Link href={`/classroom/${classroom.id}`} className="block h-full">
      <div
        className="flex flex-col h-64 p-5 rounded-2xl transition-all duration-300 group cursor-pointer"
        style={{
          background: 'rgba(18,18,42,0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.boxShadow = '0 0 24px rgba(198,191,255,0.15)'
          el.style.borderColor = 'rgba(198,191,255,0.25)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.boxShadow = 'none'
          el.style.borderColor = 'rgba(255,255,255,0.08)'
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: color.bg }}
          >
            <School className="w-5 h-5" style={{ color: color.text }} />
          </div>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border"
            style={{
              backgroundColor: 'rgba(70,234,229,0.1)',
              borderColor: 'rgba(70,234,229,0.25)',
              color: '#46eae5',
            }}
          >
            Active
          </span>
        </div>

        {/* Body */}
        <div className="flex-1">
          <h3
            className="text-[17px] font-semibold leading-snug mb-1.5 transition-colors duration-200"
            style={{ color: '#e5e0ed' }}
          >
            {classroom.name}
          </h3>
          <p
            className="text-sm line-clamp-2 leading-relaxed"
            style={{ color: '#c8c4d7', opacity: 0.75 }}
          >
            {classroom.description || 'No description provided.'}
          </p>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-3 mt-auto"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-1.5" style={{ color: '#c8c4d7' }}>
            <Users className="w-3.5 h-3.5" style={{ opacity: 0.6 }} />
            <span className="text-[11px]" style={{ opacity: 0.7 }}>
              {classroom.studentCount} student{classroom.studentCount !== 1 ? 's' : ''}
            </span>
          </div>
          <ArrowUpRight
            className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ color: '#c6bfff' }}
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
  let statusColor = '#c6bfff'
  let borderColor = '#c6bfff'
  let bgColor = 'rgba(108,92,231,0.08)'

  if (isOverdue) {
    statusLabel = 'Overdue'
    statusColor = '#ffb4ab'
    borderColor = '#ffb4ab'
    bgColor = 'rgba(255,180,171,0.08)'
  } else if (isSoon) {
    statusLabel = 'Due Soon'
    statusColor = '#ffb77d'
    borderColor = '#ffb77d'
    bgColor = 'rgba(255,183,125,0.08)'
  }

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
        className="p-4 rounded-xl border-l-4 transition-all duration-200 cursor-pointer mb-3"
        style={{
          backgroundColor: bgColor,
          borderLeftColor: borderColor,
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = bgColor.replace('0.08', '0.13'))}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = bgColor)}
      >
        <div className="flex justify-between items-start mb-1">
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: statusColor }}>
            {isOverdue && <AlertTriangle className="w-3 h-3 inline mr-1" />}
            {statusLabel}
          </p>
          <p className="text-[10px]" style={{ color: 'rgba(200,196,215,0.6)' }}>{dateLabel}</p>
        </div>
        <h4 className="text-sm font-semibold leading-snug mb-0.5" style={{ color: '#e5e0ed' }}>
          {activity.title}
        </h4>
        <p className="text-[11px]" style={{ color: 'rgba(200,196,215,0.65)' }}>
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
      className="relative overflow-hidden rounded-2xl p-6"
      style={{
        background: 'rgba(18,18,42,0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Ambient blob */}
      <div
        className="absolute -right-16 -top-16 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: 'rgba(108,92,231,0.08)', filter: 'blur(80px)' }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2" style={{ color: '#e5e0ed' }}>
            <BookOpen className="w-5 h-5" style={{ color: '#c6bfff' }} />
            Join a Classroom
          </h2>
          <p className="text-sm" style={{ color: 'rgba(200,196,215,0.65)' }}>
            Enter the 6-character code provided by your instructor.
          </p>
        </div>

        <form action={formAction} className="flex gap-3 w-full md:w-auto md:min-w-[400px]">
          <input
            ref={inputRef}
            type="text"
            name="code"
            maxLength={6}
            required
            placeholder="EX: TROP24"
            className="flex-1 text-center font-black tracking-[0.4em] text-xl uppercase outline-none transition-all duration-200 rounded-xl px-5 py-3"
            style={{
              backgroundColor: 'rgba(14,13,21,0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e5e0ed',
            }}
            onInput={e => {
              const el = e.currentTarget
              el.value = el.value.toUpperCase()
              if (el.value.length === 6) {
                el.style.borderColor = '#c6bfff'
                el.style.color = '#c6bfff'
              } else {
                el.style.borderColor = 'rgba(255,255,255,0.1)'
                el.style.color = '#e5e0ed'
              }
            }}
            onFocus={e => (e.currentTarget.style.boxShadow = '0 0 0 2px rgba(198,191,255,0.3)')}
            onBlur={e => (e.currentTarget.style.boxShadow = 'none')}
          />
          <button
            type="submit"
            disabled={isPending}
            className="px-6 rounded-xl font-bold transition-all disabled:opacity-50 text-on-primary"
            style={{
              backgroundColor: '#c6bfff',
              boxShadow: '0 4px 20px rgba(198,191,255,0.2)',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 28px rgba(198,191,255,0.4)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(198,191,255,0.2)')}
          >
            {isPending ? 'Joining...' : 'Join'}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm font-medium" style={{ color: '#ffb4ab' }}>
            {error}
          </p>
        )}
      </div>
    </section>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyClassrooms() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl border-2 border-dashed"
      style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(18,18,42,0.4)' }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: 'rgba(108,92,231,0.12)' }}
      >
        <School className="w-7 h-7" style={{ color: '#c6bfff' }} />
      </div>
      <h3 className="text-base font-semibold mb-1" style={{ color: '#e5e0ed' }}>
        No classrooms yet
      </h3>
      <p className="text-sm" style={{ color: 'rgba(200,196,215,0.55)' }}>
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
      <div className="flex gap-7 max-w-6xl mx-auto">

        {/* ── Main Content ── */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Greeting */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: '#e5e0ed' }}>
              Welcome back, {firstName} 👋
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'rgba(200,196,215,0.6)' }}>
              Here&apos;s what&apos;s happening across your enrolled classrooms.
            </p>
          </div>

          {/* Join Classroom */}
          <JoinClassroomCard formAction={formAction} isPending={isPending} error={state?.error} />

          {/* Classrooms Grid */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold" style={{ color: '#e5e0ed' }}>
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

        {/* ── Right Sidebar ── */}
        <aside className="w-72 flex-shrink-0 hidden xl:flex flex-col gap-5">
          <div
            className="flex-1 flex flex-col rounded-2xl p-5 overflow-hidden"
            style={{
              background: 'rgba(18,18,42,0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              maxHeight: 'calc(100vh - 160px)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold" style={{ color: '#e5e0ed' }}>Activity Feed</h3>
              <Clock className="w-4 h-4" style={{ color: 'rgba(200,196,215,0.4)' }} />
            </div>

            {/* Feed */}
            <div
              className="flex-1 overflow-y-auto space-y-3 pr-1"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#474554 transparent' }}
            >
              {upcomingActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="w-7 h-7 mb-3" style={{ color: 'rgba(200,196,215,0.2)' }} />
                  <p className="text-xs" style={{ color: 'rgba(200,196,215,0.4)' }}>No upcoming activities</p>
                </div>
              ) : (
                upcomingActivities.map((a: any) => {
                  const due = new Date(a.due_date)
                  const now = new Date()
                  const isOverdue = due < now
                  const diffDays = Math.ceil((due.getTime() - now.getTime()) / 86400000)

                  let statusLabel = 'Upcoming'
                  let statusColor = '#c6bfff'
                  let borderColor = 'rgba(198,191,255,0.4)'
                  let bgColor = 'rgba(198,191,255,0.06)'

                  if (a.isSubmitted) {
                    statusLabel = 'Submitted'
                    statusColor = '#46eae5'
                    borderColor = 'rgba(70,234,229,0.4)'
                    bgColor = 'rgba(70,234,229,0.06)'
                  } else if (isOverdue) {
                    statusLabel = 'Overdue'
                    statusColor = '#ffb4ab'
                    borderColor = 'rgba(255,180,171,0.4)'
                    bgColor = 'rgba(255,180,171,0.06)'
                  } else if (diffDays <= 1) {
                    statusLabel = 'Due Soon'
                    statusColor = '#ffb77d'
                    borderColor = 'rgba(255,183,125,0.4)'
                    bgColor = 'rgba(255,183,125,0.06)'
                  }

                  return (
                    <Link key={a.id} href={`/classroom/${a.classroom_id}/activity/${a.id}`} className="block mb-3">
                      <div
                        className="p-3.5 rounded-xl border-l-4 transition-all duration-200 cursor-pointer"
                        style={{ backgroundColor: bgColor, borderLeftColor: borderColor }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: statusColor }}>
                            {isOverdue && <AlertTriangle className="w-3 h-3 inline mr-0.5" />}
                            {statusLabel}
                          </p>
                          <p className="text-[10px]" style={{ color: 'rgba(200,196,215,0.5)' }}>
                            {format(due, 'MMM d')}
                          </p>
                        </div>
                        <h4 className="text-sm font-semibold leading-snug" style={{ color: '#e5e0ed' }}>
                          {a.title}
                        </h4>
                        <p className="text-[11px] mt-0.5" style={{ color: 'rgba(200,196,215,0.55)' }}>
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
              className="mt-4 w-full py-2.5 text-center text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(200,196,215,0.8)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              View All Activities <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
