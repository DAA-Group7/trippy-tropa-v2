'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Layout, Table, Crown } from 'lucide-react'
import EstimationMatrix from '@/components/tasks/EstimationMatrix'
import KanbanBoard from '@/components/tasks/KanbanBoard'

export default function GroupWorkspaceClient({ 
  activity, 
  group, 
  members, 
  tasks, 
  estimates, 
  currentUserId, 
  userRole 
}: any) {
  const isTeacherOrOfficer = ['teacher', 'student_officer'].includes(userRole)
  const isLeader = members.some((m: any) => m.user_id === currentUserId && m.is_leader)
  const [activeTab, setActiveTab] = useState<'kanban' | 'matrix'>(activity.tasks_assigned ? 'kanban' : 'matrix')

  return (
    <div className="min-h-full p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8 pb-24">
        {/* Header */}
        <div className="flex flex-col gap-6">
          <Link 
            href={`/classroom/${activity.classroom_id}/activity/${activity.id}`} 
            className="text-muted-foreground text-sm hover:underline font-semibold flex items-center gap-2 w-fit transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Activity
          </Link>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-foreground">{group.name}</h1>
              <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Crown className="w-3 h-3" /> Group Workspace
              </span>
            </div>
            <p className="text-muted-foreground text-lg">Activity: <span className="font-semibold text-foreground">{activity.title}</span></p>
          </div>
        </div>

      {/* Tabs (Only if tasks are assigned) */}
      {activity.tasks_assigned && (
        <div className="flex border-b border-border mb-8">
          <button 
            onClick={() => setActiveTab('kanban')}
            className={`px-6 py-4 font-bold text-sm uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'kanban' 
                ? 'border-primary text-primary bg-primary/5' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
          >
            <Layout className="w-4 h-4" />
            Task Board
          </button>
          <button 
            onClick={() => setActiveTab('matrix')}
            className={`px-6 py-4 font-bold text-sm uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'matrix' 
                ? 'border-primary text-primary bg-primary/5' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
          >
            <Table className="w-4 h-4" />
            Estimation Matrix
          </button>
        </div>
      )}

      {/* Content */}
      {activeTab === 'kanban' && activity.tasks_assigned ? (
        <KanbanBoard 
          tasks={tasks}
          estimates={estimates}
          currentUserId={currentUserId}
          isTeacherOrOfficer={isTeacherOrOfficer}
          activityId={activity.id}
          groupId={group.id}
          members={members}
        />
      ) : (
        <EstimationMatrix 
          members={members}
          tasks={tasks}
          estimates={estimates}
          currentUserId={currentUserId}
          isLeader={isLeader}
          isTeacherOrOfficer={isTeacherOrOfficer}
          isAssigned={activity.tasks_assigned}
          groupId={group.id}
          activityId={activity.id}
        />
      )}
    </div>
    </div>
  )
}
