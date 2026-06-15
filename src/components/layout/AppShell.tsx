'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOutAction } from '@/app/actions/auth'
import {
  LayoutDashboard,
  School,
  ClipboardList,
  Settings,
  LogOut,
  Bell,
  ChevronRight,
} from 'lucide-react'

interface AppShellProps {
  profile: { full_name?: string; role?: string; avatar_url?: string } | null
  classrooms: { id: string; name: string }[]
  userId: string
  children: React.ReactNode
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Classrooms', href: null, icon: School },
  { label: 'Activity', href: null, icon: ClipboardList },
  { label: 'Settings', href: null, icon: Settings },
]

function SidebarNavItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string | null
  icon: React.ElementType
  label: string
  active: boolean
}) {
  const className = `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
    active
      ? 'bg-gradient-to-r from-[#c6bfff]/20 to-transparent border-l-4 border-[#c6bfff] text-[#c6bfff]'
      : 'text-[#c8c4d7] hover:text-white hover:bg-white/5 border-l-4 border-transparent'
  }`

  if (!href) {
    return (
      <span className={className + ' opacity-50 cursor-not-allowed'}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        {label}
      </span>
    )
  }

  return (
    <Link href={href} className={className}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      {label}
    </Link>
  )
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
      {/* ── SIDEBAR ── */}
      <aside
        className="w-[260px] hidden md:flex flex-col flex-shrink-0 border-r"
        style={{
          backgroundColor: 'rgba(19,18,27,0.7)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(255,255,255,0.08)',
          boxShadow: '20px 0 50px -20px rgba(108,92,231,0.1)',
        }}
      >
        {/* Brand */}
        <div className="px-6 pt-7 pb-6">
          <h1
            className="text-xl font-bold"
            style={{
              background: 'linear-gradient(90deg, #c6bfff, #46eae5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Trippy Tropa
          </h1>
          <p className="text-[11px] mt-0.5" style={{ color: 'rgba(200,196,215,0.5)' }}>
            v2.0 Beta
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <SidebarNavItem
              key={item.label}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={item.href ? pathname === item.href || pathname.startsWith(item.href + '/') : false}
            />
          ))}

        </nav>

        {/* User footer */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 px-3 py-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #6c5ce7, #00cec9)',
                color: '#fff',
              }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-white">{profile?.full_name || 'User'}</p>
              <p
                className="text-[10px] uppercase tracking-wider truncate"
                style={{ color: 'rgba(200,196,215,0.5)' }}
              >
                {profile?.role}
              </p>
            </div>
            <form action={signOutAction}>
              <button
                title="Sign out"
                className="transition-colors"
                style={{ color: 'rgba(200,196,215,0.4)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ff6b6b')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,196,215,0.4)')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

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
          {/* Breadcrumb */}
          <div className="flex items-center gap-2" style={{ color: '#c8c4d7' }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(200,196,215,0.5)' }}>
              Dashboard
            </span>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: 'rgba(200,196,215,0.3)' }} />
            <span className="text-xs font-semibold text-white/80">Overview</span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-4">
            <button
              className="relative transition-colors"
              style={{ color: 'rgba(200,196,215,0.6)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#c6bfff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,196,215,0.6)')}
            >
              <Bell className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white leading-tight">{profile?.full_name || 'User'}</p>
                <p
                  className="text-[10px] uppercase tracking-widest leading-tight"
                  style={{ color: 'rgba(200,196,215,0.5)' }}
                >
                  {profile?.role}
                </p>
              </div>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  background: 'linear-gradient(135deg, #6c5ce7, #00cec9)',
                  color: '#fff',
                  border: '2px solid rgba(198,191,255,0.25)',
                }}
              >
                {initials}
              </div>
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
            background: 'rgba(108,92,231,0.08)',
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
