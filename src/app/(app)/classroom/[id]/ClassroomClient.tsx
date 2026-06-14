'use client'

import { useState } from 'react'
import { ArrowLeft, UserPlus, Settings, MoreVertical, Activity, AlertTriangle, Users } from 'lucide-react'
import Link from 'next/link'
import { InviteStudentsModal } from '@/components/classroom/InviteStudentsModal'

export default function ClassroomClient({ classroom, members, userRole, stats }: any) {
  const [activeTab, setActiveTab] = useState('STUDENTS')
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

  const canManage = userRole === 'teacher' || userRole === 'student_officer'

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <Link href="/dashboard" className="text-secondary text-sm flex items-center hover:underline w-fit">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Classrooms
          </Link>
          <h2 className="text-3xl font-bold text-on-surface">{classroom.name}</h2>
          <p className="text-on-surface-variant max-w-2xl text-base">
            {classroom.description || 'No description provided.'}
          </p>
        </div>
        
        {canManage && (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsInviteModalOpen(true)}
              className="bg-gradient-to-r from-primary-container to-secondary px-6 py-2.5 rounded-lg text-on-primary font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(70,234,229,0.2)] transition-all active:scale-95"
            >
              <UserPlus className="w-5 h-5" />
              <span className="hidden sm:inline">+ Invite Students</span>
            </button>
            <Link href={`/classroom/${classroom.id}/settings`} className="glass-card p-2.5 rounded-lg text-on-surface hover:bg-white/10 transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>

      {/* Tabs Section */}
      <div className="flex gap-8 border-b border-white/10">
        {['STUDENTS', 'ACTIVITIES', 'RESOURCES'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative py-4 font-bold text-xs tracking-wider transition-colors ${
              activeTab === tab ? 'text-secondary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-secondary rounded-t-full shadow-[0_0_10px_rgba(70,234,229,0.5)]"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'STUDENTS' && (
        <>
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 px-6 py-4 border-b border-white/10 text-on-surface-variant font-bold text-xs uppercase tracking-wider bg-white/5">
              <div className="col-span-5">Student</div>
              <div className="col-span-2 hidden sm:block">Role</div>
              <div className="col-span-4 hidden md:block">Skill Score</div>
              <div className="col-span-7 sm:col-span-5 md:col-span-1 text-right pr-2">Action</div>
            </div>
            <div className="divide-y divide-white/5">
              {members.map((member: any) => (
                <div key={member.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-white/5 transition-colors group">
                  <div className="col-span-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary font-bold overflow-hidden shrink-0">
                       {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-on-surface truncate">{member.name}</h4>
                      <p className="text-xs text-on-surface-variant truncate">{member.email}</p>
                    </div>
                  </div>
                  <div className="col-span-2 hidden sm:block">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold border border-white/10 ${
                      member.role === 'teacher' ? 'bg-primary/20 text-primary border-primary/30' :
                      member.role === 'student_officer' ? 'bg-secondary/20 text-secondary border-secondary/30' :
                      'bg-white/5 text-on-surface-variant'
                    }`}>
                      {member.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="col-span-4 hidden md:flex items-center gap-4">
                    {member.role === 'student' ? (
                      <span className="text-sm font-bold text-secondary">{member.skillScore?.toFixed(1) || '0.0'} pts</span>
                    ) : (
                      <span className="text-xs text-on-surface-variant">-</span>
                    )}
                  </div>
                  <div className="col-span-7 sm:col-span-5 md:col-span-1 text-right">
                    {canManage && member.role === 'student' && (
                      <button className="p-2 text-on-surface-variant hover:text-on-surface transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-xl flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer">
              <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant uppercase font-bold tracking-tight mb-1">Class Avg Score</p>
                <h3 className="text-2xl font-bold text-on-surface">{stats.avgScore}</h3>
              </div>
            </div>
            <div className="glass-card p-6 rounded-xl flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer border border-error/20">
              <div className="p-3 bg-error/10 rounded-lg text-error">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant uppercase font-bold tracking-tight mb-1">At Risk Students</p>
                <h3 className="text-2xl font-bold text-error">{stats.atRisk}</h3>
              </div>
            </div>
            <div className="glass-card p-6 rounded-xl flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant uppercase font-bold tracking-tight mb-1">Active Groups</p>
                <h3 className="text-2xl font-bold text-on-surface">{stats.activeGroups}</h3>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'ACTIVITIES' && (
        <div className="glass-card rounded-xl p-12 text-center text-on-surface-variant">
          No activities yet. (Phase 4)
        </div>
      )}
      {activeTab === 'RESOURCES' && (
        <div className="glass-card rounded-xl p-12 text-center text-on-surface-variant">
          No resources uploaded yet.
        </div>
      )}

      <InviteStudentsModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        inviteCode={classroom.invite_code}
      />
    </div>
  )
}
