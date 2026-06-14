import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, Home } from 'lucide-react'

export default async function JoinClassroomPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  
  if (!code) {
    redirect('/dashboard')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/signup?next=/join/${code}`)
  }

  // 1. Find classroom by code
  const { data: classroom, error: findError } = await supabase
    .from('classrooms')
    .select('id, name')
    .eq('invite_code', code.toUpperCase())
    .single()

  if (findError || !classroom) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 text-center">
        <div className="glass-card max-w-md p-8 rounded-2xl border border-white/10 space-y-6">
          <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-error" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface">Invalid Invite Code</h1>
          <p className="text-on-surface-variant">
            The invite code <strong>{code}</strong> is invalid or the classroom does not exist.
          </p>
          <Link href="/dashboard" className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold w-full flex justify-center mt-4 hover:opacity-90">
            <Home className="w-5 h-5 mr-2" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // 2. Check if already a member
  const { data: existingMember, error: memErr } = await supabase
    .from('classroom_members')
    .select('id')
    .eq('classroom_id', classroom.id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (memErr) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 text-center">
        <div className="glass-card max-w-md p-8 rounded-2xl border border-white/10 space-y-4">
          <h1 className="text-xl font-bold text-error">Database Error</h1>
          <p className="text-on-surface-variant">Could not verify membership. Please try again later.</p>
          <Link href="/dashboard" className="text-secondary font-bold hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (existingMember) {
    redirect(`/classroom/${classroom.id}`)
  }

  // 3. Add as student
  const { error: joinError } = await supabase
    .from('classroom_members')
    .insert({
      classroom_id: classroom.id,
      user_id: user.id,
      role: 'student',
    })

  if (joinError) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 text-center">
        <div className="glass-card max-w-md p-8 rounded-2xl border border-white/10 space-y-4">
          <h1 className="text-xl font-bold text-error">Failed to Join</h1>
          <p className="text-on-surface-variant">{joinError.message}</p>
          <Link href="/dashboard" className="text-secondary font-bold hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // 4. Check for skills (onboarding)
  const { count } = await supabase
    .from('skills')
    .select('id', { count: 'exact', head: true })
    .eq('classroom_id', classroom.id)

  const hasSkills = count ? count > 0 : false

  if (hasSkills) {
    redirect(`/onboarding/${classroom.id}`)
  } else {
    redirect(`/classroom/${classroom.id}`)
  }
}
