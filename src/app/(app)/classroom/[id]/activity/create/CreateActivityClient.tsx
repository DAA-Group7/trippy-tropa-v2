'use client'

import { useState } from 'react'
import { createActivityAction } from '@/app/actions/activities'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Rocket, User, Users, Calendar } from 'lucide-react'
import Link from 'next/link'

interface Props {
  classroomId: string
  studentCount: number
}

export default function CreateActivityClient({ classroomId, studentCount }: Props) {
  const router = useRouter()

  const [activityType, setActivityType] = useState<'individual' | 'group'>('individual')
  const [numGroups, setNumGroups] = useState(2)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const studentsPerGroup = numGroups > 0 ? Math.ceil(studentCount / numGroups) : 0

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const title = (formData.get('title') as string).trim()
    const description = (formData.get('description') as string | null)?.trim() ?? ''
    const due_date = (formData.get('due_date') as string | null) ?? ''
    const num_groups = activityType === 'group' ? numGroups : undefined

    if (!title) {
      setError('Activity title is required.')
      setIsSubmitting(false)
      return
    }

    const result = await createActivityAction(classroomId, {
      title,
      description,
      type: activityType,
      due_date,
      num_groups,
    })

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
      return
    }

    router.push(`/classroom/${classroomId}/activity/${result.activityId}`)
  }

  const labelClass =
    'text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2 block'

  const inputClass =
    'bg-[rgba(14,13,21,0.5)] border border-white/10 rounded-lg px-4 py-3 focus:ring-1 focus:ring-[#46eae5] outline-none text-foreground w-full transition-all placeholder:text-foreground/20'

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-8">
      {/* Back link */}
      <div className="max-w-2xl mx-auto w-full mb-6">
        <Link
          href={`/classroom/${classroomId}`}
          className="inline-flex items-center gap-1.5 text-sm text-[#46eae5] hover:underline decoration-[#46eae5]/30 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Classroom
        </Link>
      </div>

      {/* Form card */}
      <div className="bg-[rgba(18,18,42,0.7)] backdrop-blur-xl border border-white/10 rounded-xl p-8 md:p-12 max-w-2xl mx-auto w-full shadow-2xl animate-in fade-in zoom-in duration-500">
        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-1">Create New Activity</h1>
          <p className="text-foreground/50 text-sm">Configure an activity for your classroom.</p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          {/* Activity Title */}
          <div>
            <label htmlFor="title" className={labelClass}>
              Activity Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="e.g. Chapter 5 Group Project"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Describe the activity objectives, instructions, or resources…"
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Due Date & Time */}
          <div>
            <label htmlFor="due_date" className={labelClass}>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Due Date &amp; Time
              </span>
            </label>
            <input
              id="due_date"
              name="due_date"
              type="datetime-local"
              className={`${inputClass} [color-scheme:dark]`}
            />
          </div>

          {/* Activity Type */}
          <div>
            <label className={labelClass}>Activity Type</label>
            <div className="grid grid-cols-2 gap-4">
              {/* Individual card */}
              <button
                type="button"
                onClick={() => setActivityType('individual')}
                className={`flex flex-col items-center gap-3 p-5 rounded-xl border transition-all duration-200 ${
                  activityType === 'individual'
                    ? 'border-primary bg-primary/10 shadow-[0_0_16px_rgba(198,191,255,0.15)]'
                    : 'border-border bg-input hover:bg-input/80 hover:border-border/80'
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    activityType === 'individual'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted/50 text-muted-foreground/40'
                  }`}
                >
                  <User className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p
                    className={`font-bold text-sm ${
                      activityType === 'individual' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    Individual
                  </p>
                  <p className="text-[11px] text-muted-foreground/40 mt-0.5">Each student works alone</p>
                </div>
              </button>

              {/* Group card */}
              <button
                type="button"
                onClick={() => setActivityType('group')}
                className={`flex flex-col items-center gap-3 p-5 rounded-xl border transition-all duration-200 ${
                  activityType === 'group'
                    ? 'border-secondary bg-secondary/10 shadow-[0_0_16px_rgba(70,234,229,0.15)]'
                    : 'border-border bg-input hover:bg-input/80 hover:border-border/80'
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    activityType === 'group'
                      ? 'bg-secondary/20 text-secondary'
                      : 'bg-muted/50 text-muted-foreground/40'
                  }`}
                >
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p
                    className={`font-bold text-sm ${
                      activityType === 'group' ? 'text-secondary' : 'text-muted-foreground'
                    }`}
                  >
                    Group
                  </p>
                  <p className="text-[11px] text-muted-foreground/40 mt-0.5">AI-balanced skill groups</p>
                </div>
              </button>
            </div>
          </div>

          {/* Conditional group config — animated */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              activityType === 'group' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-[rgba(70,234,229,0.05)] border border-[#46eae5]/20 rounded-xl p-5 flex flex-col gap-3">
              <label htmlFor="num_groups" className={labelClass}>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#46eae5]" />
                  Number of Groups
                </span>
              </label>
              <input
                id="num_groups"
                name="num_groups"
                type="number"
                min={2}
                max={studentCount > 0 ? studentCount : undefined}
                value={numGroups}
                onChange={(e) => {
                  const val = Math.max(2, parseInt(e.target.value, 10) || 2)
                  setNumGroups(val)
                }}
                className={`${inputClass} max-w-[120px]`}
              />
              {studentCount > 0 && (
                <p className="text-xs text-[#46eae5]/80">
                  ≈ {studentsPerGroup} student{studentsPerGroup !== 1 ? 's' : ''} per group
                  <span className="text-foreground/30 ml-1">({studentCount} students total)</span>
                </p>
              )}
              {studentCount === 0 && (
                <p className="text-xs text-yellow-400/70">
                  No students enrolled yet — groups will be empty until students join.
                </p>
              )}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#6c5ce7] to-[#46eae5] text-foreground font-bold py-4 px-8 rounded-xl w-full flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 mt-2"
          >
            <Rocket className="w-5 h-5" />
            {isSubmitting ? 'Creating Activity…' : 'Create Activity'}
          </button>
        </form>
      </div>
    </div>
  )
}
