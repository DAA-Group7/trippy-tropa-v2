'use client'

import { useActionState, useEffect } from 'react'
import { joinClassroomAction } from '@/app/actions/classroom'
import { Search, ChevronRight, School, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default function StudentDashboard({ classrooms, profile, upcomingActivities }: { classrooms: any[], profile: any, upcomingActivities: any[] }) {
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

  return (
    <div className="flex flex-col gap-10">
      <div className="mb-2">
        <h3 className="text-3xl sm:text-4xl font-bold mb-1 tracking-tight">Welcome, {profile?.full_name?.split(' ')[0] || 'Student'}</h3>
        <p className="text-[14px] sm:text-[15px] text-on-surface-variant max-w-xl opacity-80">
          Here are your enrolled classes and upcoming assignments.
        </p>
      </div>

      {/* Upcoming Activities Section */}
      {upcomingActivities && upcomingActivities.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Calendar className="w-6 h-6 text-primary" /> Upcoming Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingActivities.map((activity: any) => (
              <Link key={activity.id} href={`/classroom/${activity.classroom_id}/activity/${activity.id}`}>
                <div className="glass-card p-4 rounded-xl border border-white/10 hover:border-primary/50 transition-colors group">
                  <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">{activity.title}</h4>
                  <p className="text-xs text-on-surface-variant mt-1 mb-3">{activity.classroom?.name}</p>
                  <div className="flex items-center gap-1 text-xs font-semibold text-secondary bg-secondary/10 w-fit px-2 py-1 rounded">
                    <Clock className="w-3 h-3" />
                    {format(new Date(activity.due_date), 'MMM d, h:mm a')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Join Classroom Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Join a Classroom</h2>
        <div className="glass-card p-6 rounded-xl border border-white/10 max-w-xl">
          <p className="text-sm text-on-surface-variant mb-4">Enter the 6-character invite code provided by your teacher.</p>
          <form action={formAction} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant opacity-50" />
              <input 
                type="text" 
                name="code"
                placeholder="e.g. XK7M2P" 
                className="w-full bg-surface-container-lowest border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 transition-all uppercase placeholder:normal-case font-mono"
                maxLength={6}
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isPending}
              className="bg-gradient-to-r from-primary-container to-secondary text-on-primary px-6 py-2 rounded-lg font-bold hover:shadow-[0_0_15px_rgba(108,92,231,0.4)] transition-all active:scale-95 disabled:opacity-50"
            >
              {isPending ? 'Joining...' : 'Join'}
            </button>
          </form>
          {state?.error && (
             <p className="mt-3 text-sm text-error font-medium">{state.error}</p>
          )}
        </div>
      </section>

      {/* My Classrooms */}
      <section>
        <h2 className="text-2xl font-bold mb-4">My Enrolled Classes</h2>
        {classrooms.length === 0 ? (
          <div className="glass-card rounded-xl p-10 flex flex-col items-center justify-center text-center border-dashed border-2 border-white/10">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
               <School className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">You haven't joined any classes</h3>
            <p className="text-sm text-on-surface-variant max-w-sm">Use an invite code above to join a classroom.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classrooms.map(c => (
              <Link href={`/classroom/${c.id}`} key={c.id}>
                 <div className="glass-card p-6 rounded-xl hover:-translate-y-1 transition-transform cursor-pointer group h-full flex flex-col justify-between">
                   <div>
                     <div className="flex items-start justify-between mb-4">
                       <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                         <School size={20} />
                       </div>
                       <ChevronRight size={20} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                     </div>
                     <h4 className="text-[18px] font-semibold mb-1 group-hover:text-primary transition-colors leading-6">{c.name}</h4>
                     <p className="text-[13px] text-on-surface-variant mb-4 line-clamp-2">{c.description || 'No description'}</p>
                   </div>
                   <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                     <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">Members:</span>
                     <span className="text-[12px] font-bold text-on-surface">{c.studentCount}</span>
                   </div>
                 </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
