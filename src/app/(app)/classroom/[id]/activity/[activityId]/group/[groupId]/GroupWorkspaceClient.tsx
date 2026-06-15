'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Layout, Table } from 'lucide-react'
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
            className="text-[#c6bfff] text-sm hover:underline font-semibold flex items-center gap-2 w-fit transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Activity
          </Link>
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-black tracking-tight text-[#e5e0ed]">{group.name}</h1>
              <span className="px-3 py-1 rounded-full bg-surface-container-highest border border-white/10 text-xs font-bold text-[rgba(200,196,215,0.6)] uppercase tracking-wider">
                Group Workspace
              </span>
            </div>
            <p className="text-[rgba(200,196,215,0.6)] text-lg">Activity: <span className="font-semibold text-[#e5e0ed]">{activity.title}</span></p>
          </div>
        </div>

      {/* Tabs (Only if tasks are assigned) */}
      {activity.tasks_assigned && (
        <div className="flex border-b border-white/10 mb-8">
          <button 
            onClick={() => setActiveTab('kanban')}
            className={`px-6 py-4 font-bold text-sm uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'kanban' 
                ? 'border-[#c6bfff] text-[#c6bfff] bg-[#c6bfff]/5' 
                : 'border-transparent text-[rgba(200,196,215,0.6)] hover:text-[#e5e0ed] hover:bg-white/5'
            }`}
          >
            <Layout className="w-4 h-4" />
            Task Board
          </button>
          <button 
            onClick={() => setActiveTab('matrix')}
            className={`px-6 py-4 font-bold text-sm uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'matrix' 
                ? 'border-[#c6bfff] text-[#c6bfff] bg-[#c6bfff]/5' 
                : 'border-transparent text-[rgba(200,196,215,0.6)] hover:text-[#e5e0ed] hover:bg-white/5'
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
