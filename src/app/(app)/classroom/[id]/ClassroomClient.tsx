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

  const formatDate = (d: string) => {
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? 'No Due Date' : dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <Link href={`/classroom/${classroomId}/activity/${activity.id}`} className="block h-full">
      <div className="bg-card/60 backdrop-blur-xl h-full p-5 flex flex-col rounded-xl hover:-translate-y-1 transition-all group cursor-pointer border border-border hover:border-primary/50">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
              isGroup
                ? 'bg-secondary/10 text-secondary border-secondary/30'
                : 'bg-primary/10 text-primary border-primary/30'
            }`}>
              {isGroup ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
              {isGroup ? 'Group' : 'Individual'}
            </span>
            {activity.groups_created && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                <CheckCircle className="w-3 h-3" /> Groups Set
              </span>
            )}
          </div>
          {activity.due_date && (
            <span className={`flex items-center gap-1 text-[10px] font-bold whitespace-nowrap ${
              isOverdue ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              <Clock className="w-3 h-3" />
              {isOverdue ? 'Overdue · ' : ''}{formatDate(activity.due_date)}
            </span>
          )}
        </div>
        <h4 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">{activity.title}</h4>
        {activity.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 opacity-70 flex-grow">{activity.description}</p>
        )}
        {(!activity.description) && <div className="flex-grow"></div>}
        {isGroup && activity.num_groups && (
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1 pt-3 border-t border-border">
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
          <Link href="/dashboard" className="text-primary text-sm flex items-center hover:underline w-fit">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Classrooms
          </Link>
          <h2 className="text-3xl font-bold text-foreground">{classroom.name}</h2>
          <p className="text-muted-foreground max-w-2xl text-base">
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
                    ? 'bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(var(--secondary),0.2)] active:scale-95' 
                    : 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed'
                }`}
              >
                <UserPlus className="w-5 h-5" />
                <span className="hidden sm:inline">+ Invite Students</span>
              </button>
              {!hasSkills && (
                <div className="absolute top-full mt-2 right-0 w-48 p-2 bg-card border border-border rounded-lg text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center shadow-xl">
                  Set up the skill assessment in Settings first!
                </div>
              )}
            </div>
            <Link href={`/classroom/${classroom.id}/settings`} className="bg-card border border-border p-2.5 rounded-lg text-foreground hover:bg-accent transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-border">
              {['STUDENTS', 'ACTIVITIES'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative py-4 font-bold text-xs tracking-wider transition-colors ${
              activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-t-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
            )}
          </button>
        ))}
      </div>

      {/* STUDENTS TAB */}
      {activeTab === 'STUDENTS' && (
        <>
          <div className="bg-card/60 backdrop-blur-xl border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 px-6 py-4 border-b border-border text-muted-foreground font-bold text-xs uppercase tracking-wider bg-accent/10">
              <div className="col-span-7 sm:col-span-6">Student</div>
              <div className="col-span-2 sm:col-span-3 hidden sm:block">Role</div>
              <div className="col-span-5 sm:col-span-3 text-right pr-2">Action</div>
            </div>
            <div className="divide-y divide-border">
              {members.filter((m: any) => m.role !== 'teacher').map((member: any) => (
                <div key={member.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-accent/20 transition-colors group">
                  <div className="col-span-7 sm:col-span-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold overflow-hidden shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-foreground truncate">{member.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-3 hidden sm:block">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${
                      member.role === 'teacher' ? 'bg-primary/20 text-primary border-primary/30' :
                      member.role === 'student_officer' ? 'bg-secondary/20 text-secondary border-secondary/30' :
                      'bg-accent/30 text-muted-foreground border-border'
                    }`}>
                      {member.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="col-span-5 sm:col-span-3 flex justify-end items-center gap-2 relative">
                    <button
                      onClick={() => setViewProfileId(member.userId || member.id)}
                      className="p-2 text-secondary hover:text-secondary-foreground bg-secondary/10 hover:bg-secondary/20 border border-secondary/20 rounded-lg transition-colors"
                      title="View Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {userRole === 'teacher' && member.role === 'student' && (
                      <>
                        <button
                          onClick={() => handleRemove(member.userId || member.id)}
                          disabled={isRemoving}
                          className="p-2 text-destructive hover:text-destructive-foreground bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Remove Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePromote(member.userId || member.id)}
                          disabled={isPromoting}
                          className="p-2 text-primary hover:text-primary-foreground bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Promote to Officer"
                        >
                          <Crown className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {canManage && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-card/60 backdrop-blur-xl border border-border p-6 rounded-xl flex items-center gap-4 hover:-translate-y-1 transition-transform shadow-sm">
                <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-tight mb-1">Class Avg Score</p>
                  <h3 className="text-2xl font-bold text-foreground">{stats.avgScore}</h3>
                </div>
              </div>
              <div className="bg-card/60 backdrop-blur-xl border border-destructive/20 p-6 rounded-xl flex items-center gap-4 hover:-translate-y-1 transition-transform shadow-sm">
                <div className="p-3 bg-destructive/10 rounded-lg text-destructive">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-tight mb-1">At Risk Students</p>
                  <h3 className="text-2xl font-bold text-destructive">{stats.atRisk}</h3>
                </div>
              </div>
              <div className="bg-card/60 backdrop-blur-xl border border-border p-6 rounded-xl flex items-center gap-4 hover:-translate-y-1 transition-transform shadow-sm">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-tight mb-1">Active Groups</p>
                  <h3 className="text-2xl font-bold text-foreground">{stats.activeGroups}</h3>
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
                className="bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg text-sm"
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
            <div className="bg-card/60 backdrop-blur-xl rounded-xl p-16 text-center border-dashed border-2 border-border flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">No activities yet</h3>
                <p className="text-sm text-muted-foreground">
                  {canManage ? 'Create your first activity to get started.' : 'No activities have been created yet.'}
                </p>
              </div>
              {canManage && (
                <Link
                  href={`/classroom/${classroom.id}/activity/create`}
                  className="bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg text-sm"
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
        <div className="bg-card/60 backdrop-blur-xl rounded-xl p-12 text-center text-muted-foreground">
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
            <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <button onClick={() => setViewProfileId(null)} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
              {(() => {
                const profileMember = members.find((m: any) => (m.userId || m.id) === viewProfileId)
                if (!profileMember) return null
                return (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-input border-2 border-border flex items-center justify-center mb-4 overflow-hidden shadow-lg shadow-primary/10">
                      {profileMember.avatarUrl ? (
                        <img src={profileMember.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-muted-foreground/30" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{profileMember.name}</h3>
                    <p className="text-sm text-muted-foreground mb-6">{profileMember.role === 'student_officer' ? 'Student Officer' : 'Student'}</p>
                    
                    <div className="w-full bg-input p-4 rounded-xl border border-border text-left">
                      <div className="flex justify-between items-center mb-4 pb-2 border-b border-border">
                        <h4 className="text-sm font-black text-foreground uppercase tracking-widest">Skills Profile</h4>
                        {profileMember.skillScore !== undefined && (
                          <div className="flex items-center gap-2 bg-primary/10 border border-primary text-primary px-3 py-1.5 rounded-lg shadow-sm">
                            <span className="text-xs font-bold uppercase tracking-wider">Total Score:</span>
                            <span className="text-lg font-black">{profileMember.skillScore.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      {profileMember.rawSkills && profileMember.rawSkills.length > 0 ? (
                        <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                          {profileMember.rawSkills.map((rs: any, i: number) => (
                            <li key={i} className="flex flex-col gap-2 bg-card p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                              <div className="flex justify-between items-center">
                                <span className="text-foreground font-bold">{rs.name}</span>
                                <span className="text-primary font-black text-sm bg-primary/10 px-2 py-0.5 rounded">{(rs.rating * (rs.multiplier || 1)).toFixed(1)} pts</span>
                              </div>
                              <div className="flex justify-between items-center text-[11px] text-muted-foreground uppercase tracking-wider font-bold">
                                <span>Level Input: <span className="text-foreground">{rs.rating}</span></span>
                                <span>Weight: <span className="text-foreground">x{rs.multiplier || 1}</span></span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground italic text-center py-6 bg-accent/10 rounded-lg border border-dashed border-border">No skills assessed yet.</p>
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
