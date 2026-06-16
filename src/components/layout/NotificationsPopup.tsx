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
        className={`relative transition-colors p-1 ${isOpen ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-secondary border border-background" />}
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-3 w-[380px] rounded-2xl border border-border/50 shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200 bg-card/95 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
            <h3 className="font-semibold text-foreground text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">
                {unreadCount} Unread
              </span>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground/50">No notifications yet.</div>
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
                  className={`flex items-start gap-4 px-5 py-4 border-b border-border/50 hover:bg-accent/50 transition-colors cursor-pointer relative ${notif.is_read ? 'opacity-70' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="text-sm font-semibold text-foreground mb-1">{notif.title}</h4>
                    <p className="text-xs text-muted-foreground leading-snug mb-1.5">{notif.message}</p>
                    <p className={`text-[10px] font-bold ${notif.is_read ? 'text-muted-foreground/40' : iconColor}`}>
                      {new Date(notif.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {!notif.is_read && (
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-secondary" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <button className="w-full py-3 text-xs font-semibold text-foreground hover:bg-accent/50 transition-colors bg-accent/20">
            View All Activity
          </button>
        </div>
      )}
    </div>
  )
}
