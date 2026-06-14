import { createClient } from '@/lib/supabase/server'
import { PlusCircle, Search } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isTeacher = profile?.role === 'teacher'

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      
      {isTeacher ? (
        // TEACHER DASHBOARD
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Classrooms</h1>
              <p className="text-white/60 mt-1">Manage your classes and auto-generate project groups.</p>
            </div>
            {/* The actual creation functionality comes in Phase 2 */}
            <Link href="#" className="primary-gradient px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:shadow-[0_0_15px_rgba(108,92,231,0.4)] transition-all">
              <PlusCircle className="w-5 h-5" />
              <span>Create Classroom</span>
            </Link>
          </div>

          {/* Empty State */}
          <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center border-dashed border-2 border-white/10 mt-4">
            <div className="w-16 h-16 rounded-full bg-[#c6bfff]/10 flex items-center justify-center mb-4">
              <PlusCircle className="w-8 h-8 text-[#c6bfff]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No classrooms yet</h3>
            <p className="text-white/60 max-w-sm mb-6">Create your first classroom to invite students and start running smart grouping algorithms.</p>
            <Link href="#" className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-lg font-medium transition-colors">
              Create Your First Classroom
            </Link>
          </div>
        </div>
      ) : (
        // STUDENT DASHBOARD
        <div className="flex flex-col gap-10">
          {/* Join Classroom Section */}
          <section>
            <h2 className="text-xl font-bold mb-4">Join a Classroom</h2>
            <div className="glass-card p-6 rounded-xl border border-white/10 max-w-xl">
              <p className="text-sm text-white/60 mb-4">Enter the 6-character invite code provided by your teacher.</p>
              <form className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input 
                    type="text" 
                    placeholder="e.g. XK7M2P" 
                    className="w-full bg-[#050510] border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-[#46eae5] input-glow transition-all uppercase placeholder:normal-case font-mono"
                    maxLength={6}
                  />
                </div>
                <button type="button" className="primary-gradient px-6 py-2 rounded-lg font-medium hover:shadow-[0_0_15px_rgba(108,92,231,0.4)] transition-all">
                  Join
                </button>
              </form>
            </div>
          </section>

          {/* My Classrooms - Empty State */}
          <section>
            <h2 className="text-xl font-bold mb-4">My Classrooms</h2>
            <div className="glass-card rounded-xl p-10 flex flex-col items-center justify-center text-center border-dashed border-2 border-white/10">
              <h3 className="text-lg font-semibold mb-2">You haven't joined any classes</h3>
              <p className="text-sm text-white/60 max-w-sm">Use an invite code above or click an invite link to join a classroom.</p>
            </div>
          </section>

          {/* Upcoming Activities - Empty State */}
          <section>
            <h2 className="text-xl font-bold mb-4">Upcoming Tasks</h2>
            <div className="glass-card rounded-xl p-8 flex flex-col items-center justify-center text-center border border-white/10 bg-white/[0.02]">
              <p className="text-sm text-white/40">No upcoming tasks or activities.</p>
            </div>
          </section>
        </div>
      )}

    </div>
  )
}
