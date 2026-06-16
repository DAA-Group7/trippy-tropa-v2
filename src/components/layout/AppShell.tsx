'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOutAction } from '@/app/actions/auth'
import {
  LayoutDashboard,
  ClipboardList,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react'
import { NotificationsPopup } from './NotificationsPopup'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface AppShellProps {
  profile: { full_name?: string; role?: string; avatar_url?: string } | null
  classrooms: { id: string; name: string }[]
  userId: string
  children: React.ReactNode
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-9 h-9" />

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg bg-card border border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      title="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}

export default function AppShell({ profile, classrooms, children }: AppShellProps) {
  const pathname = usePathname()

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '??'

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans">
      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header
          className="h-16 flex items-center justify-between px-6 md:px-8 flex-shrink-0 z-10 border-b border-border bg-card/60 backdrop-blur-xl"
        >
          {/* Brand & Navigation */}
          <div className="flex items-center gap-8">
            <h1
              className="text-xl font-black tracking-tight"
              style={{
                background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
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
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link 
                href="/activities" 
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  pathname === '/activities' || pathname.startsWith('/activities/') 
                    ? 'bg-secondary/10 text-secondary border border-secondary/20' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                Activity
              </Link>
            </nav>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <NotificationsPopup />

            <div className="flex items-center gap-4 border-l border-border pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-foreground leading-tight">{profile?.full_name || 'User'}</p>
                <p
                  className="text-[10px] font-black text-secondary uppercase tracking-widest leading-tight mt-0.5"
                >
                  {profile?.role?.replace('_', ' ')}
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shadow-lg bg-primary text-primary-foreground border-2 border-border"
              >
                {initials}
              </div>
              <form action={signOutAction}>
                <button
                  title="Sign out"
                  className="p-2 text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors ml-2"
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
          className="absolute rounded-full animate-pulse bg-primary/5 blur-[120px]"
          style={{ top: '20%', left: '30%', width: '384px', height: '384px' }}
        />
        <div
          className="absolute rounded-full bg-secondary/5 blur-[160px]"
          style={{ bottom: '10%', right: '10%', width: '480px', height: '480px' }}
        />
      </div>
    </div>
  )
}
