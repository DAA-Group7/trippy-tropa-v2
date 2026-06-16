'use client'

import { useState } from 'react'
import {
  ArrowLeft, UserPlus, Settings, MoreVertical, Activity, AlertTriangle,
  Users, Plus, User, Clock, CheckCircle, BookOpen, Eye, Trash2, Crown, X
} from 'lucide-react'
import Link from 'next/link'
import { InviteStudentsModal } from '@/components/classroom/InviteStudentsModal'
import { promoteMemberAction, removeMemberAction } from '@/app/actions/classroom'

function ActivityCard({ activity, classroomId }: { activity: any; classroomId: string }) {
  const isGroup = activity.type === 'group'
  const isOverdue = activity.due_date && new Date(activity.due_date) < new Date()

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <Link href={`/classroom/${classroomId}/activity/${activity.id}`} className="block h-full">
      <div className="glass-card h-full p-5 flex flex-col rounded-xl hover:-translate-y-1 transition-all group cursor-pointer border border-white/10 hover:border-[#c6bfff]/50">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
              isGroup
                ? 'bg-[#46eae5]/10 text-[#46eae5] border-[#46eae5]/30'
                : 'bg-[#c6bfff]/10 text-[#c6bfff] border-[#c6bfff]/30'
            }`}>
              {isGroup ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
              {isGroup ? 'Group' : 'Individual'}
            </span>
            {activity.groups_created && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                <CheckCircle className="w-3 h-3" /> Groups Set
              </span>
            )}
          </div>
          {activity.due_date && (
            <span className={`flex items-center gap-1 text-[10px] font-bold whitespace-nowrap ${
              isOverdue ? 'text-error' : 'text-[rgba(200,196,215,0.6)]'
            }`}>
              <Clock className="w-3 h-3" />
              {isOverdue ? 'Overdue · ' : ''}{formatDate(activity.due_date)}
            </span>
          )}
        </div>
        <h4 className="font-bold text-[#e5e0ed] text-base group-hover:text-[#c6bfff] transition-colors">{activity.title}</h4>
        {activity.description && (
          <p className="text-xs text-[rgba(200,196,215,0.6)] mt-1 line-clamp-2 opacity-70 flex-grow">{activity.description}</p>
        )}
        {(!activity.description) && <div className="flex-grow"></div>}
        {isGroup && activity.num_groups && (
          <p className="text-xs text-[rgba(200,196,215,0.6)] mt-3 flex items-center gap-1 pt-3 border-t border-white/5">
            <Users className="w-3 h-3" />
            {activity.num_groups} groups planned
          </p>
        )}
      </div>
    </Link>
  )
}

export default function ClassroomClient({ classroom, members, userRole, stats, activities, hasSkills }: any) {
  const [activeTab, setActiveTab] = useState('STUDENTS')
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [openSkillPopoverId, setOpenSkillPopoverId] = useState<string | null>(null)
  const [isPromoting, setIsPromoting] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [viewProfileId, setViewProfileId] = useState<string | null>(null)

  const handlePromote = async (userId: string) => {
    if (!confirm('Are you sure you want to promote this student to Student Officer?')) return
    setIsPromoting(true)
    const result = await promoteMemberAction(classroom.id, userId)
    if (result.error) {
      alert(result.error)
    } else {
      setOpenDropdownId(null)
    }
    setIsPromoting(false)
  }

  const handleRemove = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this student?')) return
    setIsRemoving(true)
    const result = await removeMemberAction(classroom.id, userId)
    if (result.error) {
      alert(result.error)
    }
    setIsRemoving(false)
  }

  const canManage = userRole === 'teacher' || userRole === 'student_officer'

  return (
    <div className="min-h-full p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <Link href="/dashboard" className="text-[#c6bfff] text-sm flex items-center hover:underline w-fit">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Classrooms
          </Link>
          <h2 className="text-3xl font-bold text-[#e5e0ed]">{classroom.name}</h2>
          <p className="text-[rgba(200,196,215,0.6)] max-w-2xl text-base">
            {classroom.description || 'No description provided.'}
          </p>
        </div>

        {canManage && (
          <div className="flex items-center gap-4">
            <div className="relative group">
              <button
                onClick={() => setIsInviteModalOpen(true)}
                disabled={!hasSkills}
                className={`px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
                  hasSkills 
                    ? 'bg-[#c6bfff] text-[#13121b] hover:shadow-[0_0_20px_rgba(70,234,229,0.2)] active:scale-95' 
                    : 'bg-surface-container-highest text-[rgba(200,196,215,0.6)] opacity-50 cursor-not-allowed'
                }`}
              >
                <UserPlus className="w-5 h-5" />
                <span className="hidden sm:inline">+ Invite Students</span>
              </button>
              {!hasSkills && (
                <div className="absolute top-full mt-2 right-0 w-48 p-2 bg-surface-container-highest border border-white/10 rounded-lg text-xs text-[rgba(200,196,215,0.6)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center shadow-xl">
                  Set up the skill assessment in Settings first!
                </div>
              )}
            </div>
            <Link href={`/classroom/${classroom.id}/settings`} className="glass-card p-2.5 rounded-lg text-[#e5e0ed] hover:bg-white/10 transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-white/10">
              {['STUDENTS', 'ACTIVITIES'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative py-4 font-bold text-xs tracking-wider transition-colors ${
              activeTab === tab ? 'text-[#c6bfff]' : 'text-[rgba(200,196,215,0.6)] hover:text-[#e5e0ed]'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#c6bfff] rounded-t-full shadow-[0_0_10px_rgba(198,191,255,0.5)]" />
            )}
          </button>
        ))}
      </div>

      {/* STUDENTS TAB */}
      {activeTab === 'STUDENTS' && (
        <>
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 px-6 py-4 border-b border-white/10 text-[rgba(200,196,215,0.6)] font-bold text-xs uppercase tracking-wider bg-white/5">
              <div className="col-span-5">Student</div>
              <div className="col-span-2 hidden sm:block">Role</div>
              <div className="col-span-4 hidden md:block">Skill Score</div>
              <div className="col-span-7 sm:col-span-5 md:col-span-1 text-right pr-2">Action</div>
            </div>
            <div className="divide-y divide-white/5">
              {members.filter((m: any) => m.role !== 'teacher').map((member: any) => (
                <div key={member.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-white/5 transition-colors group">
                  <div className="col-span-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#c6bfff] flex items-center justify-center text-[#13121b] font-bold overflow-hidden shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#e5e0ed] truncate">{member.name}</h4>
                      <p className="text-xs text-[rgba(200,196,215,0.6)] truncate">{member.email}</p>
                    </div>
                  </div>
                  <div className="col-span-2 hidden sm:block">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold border border-white/10 ${
                      member.role === 'teacher' ? 'bg-primary/20 text-primary border-primary/30' :
                      member.role === 'student_officer' ? 'bg-secondary/20 text-secondary border-secondary/30' :
                      'bg-white/5 text-[rgba(200,196,215,0.6)]'
                    }`}>
                      {member.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="col-span-4 hidden md:flex items-center gap-4">
                    {member.role === 'student' ? (
                      <div className="relative">
                        <button 
                          onClick={() => setOpenSkillPopoverId(openSkillPopoverId === member.id ? null : member.id)}
                          className="text-sm font-bold text-secondary hover:text-secondary-container transition-colors cursor-pointer border-b border-dashed border-secondary/50 pb-0.5"
                        >
                          {member.skillScore?.toFixed(1) || '0.0'} pts
                        </button>
                        {openSkillPopoverId === member.id && (
                          <div className="absolute top-8 left-0 z-50 w-64 bg-surface-container-highest border border-white/10 rounded-xl shadow-2xl p-4 cursor-default">
                            <h5 className="text-xs uppercase tracking-wider font-bold text-[rgba(200,196,215,0.6)] mb-3 border-b border-white/5 pb-2">Skill Breakdown</h5>
                            {member.rawSkills && member.rawSkills.length > 0 ? (
                              <ul className="space-y-2">
                                {member.rawSkills.map((rs: any, i: number) => (
                                  <li key={i} className="flex justify-between items-center text-sm">
                                    <span className="text-[#e5e0ed] truncate pr-2" title={rs.name}>{rs.name}</span>
                                    <span className="text-secondary font-bold shrink-0">{rs.rating} <span className="text-[rgba(200,196,215,0.6)] text-[10px] opacity-50">×{rs.multiplier}</span></span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-[rgba(200,196,215,0.6)] italic">No skills assessed yet.</p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-[rgba(200,196,215,0.6)]">-</span>
                    )}
                  </div>
                  <div className="col-span-7 sm:col-span-5 md:col-span-1 flex justify-end items-center gap-2 relative">
                    {userRole === 'teacher' && member.role === 'student' && (
                      <>
                        <button
                          onClick={() => setViewProfileId(member.user_id || member.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[#46eae5] hover:text-[#46eae5] bg-[#46eae5]/10 hover:bg-[#46eae5]/20 rounded-lg transition-colors text-xs font-bold whitespace-nowrap"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                          <span>{member.skillScore ? `${member.skillScore.toFixed(1)} pts` : 'No Skills'}</span>
                        </button>
                        <button
                          onClick={() => handlePromote(member.user_id || member.id)}
                          disabled={isPromoting}
                          className="p-2 text-[#c6bfff]/70 hover:text-[#c6bfff] bg-[#c6bfff]/10 hover:bg-[#c6bfff]/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Promote to Officer"
                        >
                          <Crown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemove(member.user_id || member.id)}
                          disabled={isRemoving}
                          className="p-2 text-error/70 hover:text-error bg-error/10 hover:bg-error/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Remove Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

                    {canManage && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-xl flex items-center gap-4 hover:-translate-y-1 transition-transform">
                <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-[rgba(200,196,215,0.6)] uppercase font-bold tracking-tight mb-1">Class Avg Score</p>
                  <h3 className="text-2xl font-bold text-[#e5e0ed]">{stats.avgScore}</h3>
                </div>
              </div>
              <div className="glass-card p-6 rounded-xl flex items-center gap-4 hover:-translate-y-1 transition-transform border border-error/20">
                <div className="p-3 bg-error/10 rounded-lg text-error">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-[rgba(200,196,215,0.6)] uppercase font-bold tracking-tight mb-1">At Risk Students</p>
                  <h3 className="text-2xl font-bold text-error">{stats.atRisk}</h3>
                </div>
              </div>
              <div className="glass-card p-6 rounded-xl flex items-center gap-4 hover:-translate-y-1 transition-transform">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-[rgba(200,196,215,0.6)] uppercase font-bold tracking-tight mb-1">Active Groups</p>
                  <h3 className="text-2xl font-bold text-[#e5e0ed]">{stats.activeGroups}</h3>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ACTIVITIES TAB */}
      {activeTab === 'ACTIVITIES' && (
        <div className="space-y-5">
          {canManage && (
            <div className="flex justify-end">
              <Link
                href={`/classroom/${classroom.id}/activity/create`}
                className="bg-[#c6bfff] text-white font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg text-sm"
              >
                <Plus className="w-4 h-4" />
                Create Activity
              </Link>
            </div>
          )}

          {activities && activities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activities.map((activity: any) => (
                <ActivityCard key={activity.id} activity={activity} classroomId={classroom.id} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-xl p-16 text-center border-dashed border-2 border-white/10 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#e5e0ed] mb-1">No activities yet</h3>
                <p className="text-sm text-[rgba(200,196,215,0.6)]">
                  {canManage ? 'Create your first activity to get started.' : 'No activities have been created yet.'}
                </p>
              </div>
              {canManage && (
                <Link
                  href={`/classroom/${classroom.id}/activity/create`}
                  className="bg-[#c6bfff] text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Create Activity
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'RESOURCES' && (
        <div className="glass-card rounded-xl p-12 text-center text-[rgba(200,196,215,0.6)]">
          No resources uploaded yet.
        </div>
      )}

      <InviteStudentsModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        inviteCode={classroom.invite_code}
      />
        {viewProfileId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-[#13121b] border border-white/10 rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <button onClick={() => setViewProfileId(null)} className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              {(() => {
                const profileMember = members.find((m: any) => (m.user_id || m.id) === viewProfileId)
                if (!profileMember) return null
                return (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-[#1c1b23] border-2 border-white/10 flex items-center justify-center mb-4 overflow-hidden shadow-lg shadow-[#c6bfff]/10">
                      {profileMember.avatarUrl ? (
                        <img src={profileMember.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-white/20" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-[#e5e0ed]">{profileMember.name}</h3>
                    <p className="text-sm text-[rgba(200,196,215,0.8)] mb-6">{profileMember.role === 'student_officer' ? 'Student Officer' : 'Student'}</p>
                    
                    <div className="w-full bg-[#1c1b23] p-4 rounded-xl border border-white/5 text-left">
                      <h4 className="text-[10px] font-black text-[#46eae5] uppercase tracking-widest mb-3">Skills Profile</h4>
                      {profileMember.rawSkills && profileMember.rawSkills.length > 0 ? (
                        <ul className="space-y-3">
                          {profileMember.rawSkills.map((rs: any, i: number) => (
                            <li key={i} className="flex justify-between items-center text-sm bg-white/5 px-3 py-2 rounded-lg">
                              <span className="text-[#e5e0ed] font-medium">{rs.name}</span>
                              <span className="text-secondary font-black">LVL {rs.rating}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-[rgba(200,196,215,0.6)] italic text-center py-4">No skills assessed yet.</p>
                      )}
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
