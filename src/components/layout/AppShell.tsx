'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOutAction } from '@/app/actions/auth'
import {
  LayoutDashboard,
  ClipboardList,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { NotificationsPopup } from './NotificationsPopup'

interface AppShellProps {
  profile: { full_name?: string; role?: string; avatar_url?: string } | null
  classrooms: { id: string; name: string }[]
  userId: string
  children: React.ReactNode
}

export default function AppShell({ profile, classrooms, children }: AppShellProps) {
  const pathname = usePathname()

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '??'

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: '#13121b', color: '#e5e0ed', fontFamily: 'Inter, sans-serif' }}
    >
      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header
          className="h-16 flex items-center justify-between px-6 md:px-8 flex-shrink-0 z-10"
          style={{
            backgroundColor: 'rgba(19,18,27,0.6)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Brand & Navigation */}
          <div className="flex items-center gap-8">
            <h1
              className="text-xl font-black tracking-tight"
              style={{
                background: 'linear-gradient(90deg, #c6bfff, #46eae5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Trippy Tropa
            </h1>
            
            <nav className="hidden md:flex items-center gap-2">
              <Link 
                href="/dashboard" 
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  pathname === '/dashboard' || pathname.startsWith('/dashboard/') 
                    ? 'bg-[#c6bfff]/10 text-[#c6bfff] border border-[#c6bfff]/20' 
                    : 'text-[#e5e0ed]/60 hover:text-[#e5e0ed] hover:bg-white/5 border border-transparent'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link 
                href="/activities" 
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  pathname === '/activities' || pathname.startsWith('/activities/') 
                    ? 'bg-[#46eae5]/10 text-[#46eae5] border border-[#46eae5]/20' 
                    : 'text-[#e5e0ed]/60 hover:text-[#e5e0ed] hover:bg-white/5 border border-transparent'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                Activity
              </Link>
            </nav>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-6">
            <NotificationsPopup />

            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#e5e0ed] leading-tight">{profile?.full_name || 'User'}</p>
                <p
                  className="text-[10px] font-black text-[#46eae5] uppercase tracking-widest leading-tight mt-0.5"
                >
                  {profile?.role?.replace('_', ' ')}
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #c6bfff, #46eae5)',
                  color: '#13121b',
                  border: '2px solid rgba(255,255,255,0.1)',
                }}
              >
                {initials}
              </div>
              <form action={signOutAction}>
                <button
                  title="Sign out"
                  className="p-2 text-error/60 hover:text-error hover:bg-error/10 rounded-lg transition-colors ml-2"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            top: '20%', left: '30%',
            width: '384px', height: '384px',
            background: 'rgba(198,191,255,0.06)',
            filter: 'blur(120px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: '10%', right: '10%',
            width: '480px', height: '480px',
            background: 'rgba(70,234,229,0.04)',
            filter: 'blur(160px)',
          }}
        />
      </div>
    </div>
  )
}
