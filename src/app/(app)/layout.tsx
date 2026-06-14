import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Bell, LayoutDashboard, LogOut, Menu } from 'lucide-react'
import { signOutAction } from '@/app/actions/auth'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a1a]">
      {/* Sidebar */}
      <aside className="w-[260px] hidden md:flex flex-col border-r border-white/10 bg-[#12122a]/50 backdrop-blur-xl">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <span className="font-sans text-xl font-bold bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
            Trippy Tropa
          </span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-6">
          <div>
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors">
              <LayoutDashboard className="w-5 h-5 text-[#c6bfff]" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
              My Classrooms
            </h3>
            <div className="flex flex-col gap-1">
              {/* Classroom links will go here later */}
              <div className="px-3 py-2 text-sm text-white/40 italic">
                No classrooms yet
              </div>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white font-bold text-sm">
              {profile?.full_name?.charAt(0) || user.email?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-white/50 capitalize truncate">{profile?.role}</p>
            </div>
            <form action={signOutAction}>
              <button title="Log out" className="text-white/50 hover:text-red-400 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-white/10 bg-[#0a0a1a]/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-white/70 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold text-white/90">Welcome</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative text-white/70 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              {/* <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#00cec9]"></span> */}
            </button>
            <div className="md:hidden w-8 h-8 rounded-full bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white font-bold text-sm">
              {profile?.full_name?.charAt(0) || user.email?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
