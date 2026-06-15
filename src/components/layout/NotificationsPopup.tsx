import { useState, useRef, useEffect } from 'react'
import { Bell, Megaphone, UserPlus, ArrowLeftRight } from 'lucide-react'

import { getNotificationsAction, markNotificationReadAction } from '@/app/actions/notifications'

export function NotificationsPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      const res = await getNotificationsAction()
      if (res.notifications) setNotifications(res.notifications)
    }
    load()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const unreadCount = notifications.filter(n => !n.is_read).length

  const handleNotificationClick = async (notif: any) => {
    if (!notif.is_read) {
      await markNotificationReadAction(notif.id)
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n))
    }
    if (notif.link) {
      window.location.href = notif.link
    }
  }

  return (
    <div className="relative" ref={popupRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative transition-colors p-1"
        style={{ color: isOpen ? '#c6bfff' : 'rgba(200,196,215,0.6)' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#c6bfff')}
        onMouseLeave={e => {
          if (!isOpen) e.currentTarget.style.color = 'rgba(200,196,215,0.6)'
        }}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#46eae5] border border-[#13121b]" />}
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-3 w-[380px] rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200"
          style={{
            backgroundColor: 'rgba(19,18,27,0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h3 className="font-semibold text-[#e5e0ed] text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#c6bfff]/10 text-[#c6bfff]">
                {unreadCount} Unread
              </span>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-white/50">No notifications yet.</div>
            ) : notifications.map((notif) => {
              let Icon = Megaphone
              let iconColor = 'text-[#46eae5]'
              let iconBg = 'bg-[#46eae5]/10'
              
              if (notif.type === 'group') {
                Icon = UserPlus
                iconColor = 'text-[#c6bfff]'
                iconBg = 'bg-[#c6bfff]/10'
              } else if (notif.type === 'request') {
                Icon = ArrowLeftRight
                iconColor = 'text-[#ffb77d]'
                iconBg = 'bg-[#ffb77d]/10'
              }

              return (
                <div 
                  key={notif.id} 
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex items-start gap-4 px-5 py-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer relative ${notif.is_read ? 'opacity-70' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="text-sm font-semibold text-[#e5e0ed] mb-1">{notif.title}</h4>
                    <p className="text-xs text-[rgba(200,196,215,0.6)] leading-snug mb-1.5">{notif.message}</p>
                    <p className={`text-[10px] font-bold ${notif.is_read ? 'text-white/40' : iconColor}`}>
                      {new Date(notif.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {!notif.is_read && (
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#46eae5]" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <button className="w-full py-3 text-xs font-semibold text-[#e5e0ed] hover:bg-white/5 transition-colors bg-white/[0.02]">
            View All Activity
          </button>
        </div>
      )}
    </div>
  )
}
