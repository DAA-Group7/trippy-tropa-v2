'use client'

import { useState } from 'react'
import { Plus, Trash2, Save, Loader2, Sparkles, MessageSquare, ShieldAlert } from 'lucide-react'
import { upsertTimeEstimateAction, runHungarianAssignmentAction, confirmAssignmentsAction, deleteTaskAction, createTaskAction } from '@/app/actions/tasks'
import { useRouter } from 'next/navigation'

export default function EstimationMatrix({ members, tasks, estimates, currentUserId, isLeader, groupId, activityId }: any) {
  const router = useRouter()
  const [isAssigning, setIsAssigning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Create task state
  const [isCreating, setIsCreating] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')

  // Local state for estimates to allow rapid typing without waiting for server response
  const [localEstimates, setLocalEstimates] = useState<Record<string, number>>(
    estimates.reduce((acc: any, est: any) => {
      acc[`${est.task_id}_${est.user_id}`] = Number(est.estimated_hours)
      return acc
    }, {})
  )

  const handleEstimateChange = async (taskId: string, userId: string, value: string) => {
    if (userId !== currentUserId) return // Only edit own
    
    const numValue = value === '' ? 0 : parseFloat(value)
    if (isNaN(numValue) || numValue < 0) return

    const key = `${taskId}_${userId}`
    setLocalEstimates(prev => ({ ...prev, [key]: numValue }))

    // Trigger server action in background
    await upsertTimeEstimateAction(taskId, numValue, activityId, groupId)
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!isLeader) return
    if (!confirm('Are you sure you want to delete this task?')) return
    await deleteTaskAction(taskId, activityId, groupId)
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    setIsCreating(true)
    await createTaskAction(groupId, activityId, { title: newTaskTitle, description: newTaskDesc })
    setNewTaskTitle('')
    setNewTaskDesc('')
    setIsCreating(false)
  }

  const handleAutoAssign = async () => {
    if (!isLeader) return
    setIsAssigning(true)
    setError(null)
    const result = await runHungarianAssignmentAction(groupId)
    
    if (result.error) {
      setError(result.error)
      setIsAssigning(false)
      return
    }

    if (result.assignments) {
      const confirmResult = await confirmAssignmentsAction(groupId, activityId, result.assignments)
      if (confirmResult.error) {
        setError(confirmResult.error)
      } else {
        router.refresh()
      }
    }
    setIsAssigning(false)
  }

  // Calculate totals and progress
  const totalCells = members.length * tasks.length
  let filledCells = 0
  
  // Calculate member totals
  const memberTotals: Record<string, number> = {}
  // Calculate task totals
  const taskTotals: Record<string, number> = {}
  let grandTotal = 0

  members.forEach((m: any) => {
    let total = 0
    tasks.forEach((t: any) => {
      const val = localEstimates[`${t.id}_${m.user_id}`]
      if (val !== undefined && val > 0) {
        total += val
        filledCells++
        taskTotals[t.id] = (taskTotals[t.id] || 0) + val
      }
    })
    memberTotals[m.user_id] = total
    grandTotal += total
  })

  const progressPercent = totalCells === 0 ? 0 : Math.round((filledCells / totalCells) * 100)
  const is100Percent = progressPercent === 100 && totalCells > 0

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header and Add Task */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Time Estimation Matrix</h2>
          <p className="text-on-surface-variant mt-1">Define work distribution and estimated hours for your group project.</p>
        </div>
        <div className="flex gap-3">
          {isLeader && is100Percent && (
            <button 
              onClick={handleAutoAssign}
              disabled={isAssigning}
              className="px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 bg-gradient-to-r from-secondary-container to-primary-container text-on-primary-container shadow-[0_0_20px_rgba(70,234,229,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {isAssigning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Auto-Assign Tasks
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-error-container/20 border border-error/50 rounded-xl flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-error" />
          <p className="text-sm text-error font-semibold">{error}</p>
        </div>
      )}

      {/* Task Creation Form (Inline) */}
      <form onSubmit={handleCreateTask} className="bg-surface/50 border border-white/5 p-4 rounded-xl flex gap-3 items-center backdrop-blur-md">
        <input 
          type="text"
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
          placeholder="New Task Title..."
          className="bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-sm text-on-surface focus:border-secondary outline-none flex-1"
          required
        />
        <button 
          type="submit"
          disabled={isCreating}
          className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add Task
        </button>
      </form>

      {/* Progress Bar */}
      <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-white/5">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Global Progress</span>
        <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-sm font-bold text-secondary">{progressPercent}%</span>
      </div>

      {/* Matrix Table */}
      <div className="glass-card rounded-xl overflow-x-auto shadow-2xl border border-white/10">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-surface-container-high/50">
              <th className="p-4 border-b border-white/10 font-bold text-xs uppercase tracking-wider text-on-surface-variant sticky left-0 bg-surface-container-high z-10">
                Student Member
              </th>
              {tasks.map((t: any) => (
                <th key={t.id} className="p-4 border-b border-white/10 font-bold text-xs uppercase tracking-wider text-on-surface-variant group relative">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate max-w-[120px]" title={t.title}>{t.title}</span>
                    {isLeader && (
                      <button 
                        onClick={() => handleDeleteTask(t.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-error/20 text-error rounded transition-all"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="p-4 border-b border-white/10 font-bold text-xs uppercase tracking-wider text-on-surface-variant">
                Total Hours
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {members.map((m: any) => {
              const isMe = m.user_id === currentUserId
              
              return (
                <tr 
                  key={m.user_id} 
                  className={`border-b border-white/5 transition-colors ${isMe ? 'bg-secondary/5 border-l-4 border-l-secondary' : 'hover:bg-white/5'}`}
                >
                  <td className={`p-4 sticky left-0 z-10 ${isMe ? 'bg-[#182a36]' : 'bg-[#15141d]'}`}>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={m.profile?.avatar_url || `https://ui-avatars.com/api/?name=${m.profile?.full_name || 'U'}&background=random`} alt="Avatar" className={`w-8 h-8 rounded-lg border ${isMe ? 'border-secondary/50' : 'border-white/10'}`} />
                        {m.is_leader && (
                          <div className="absolute -top-1 -right-1 bg-tertiary text-on-tertiary rounded-full p-[2px]" title="Leader">
                            <Sparkles className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div>
                        <span className={`block font-bold ${isMe ? 'text-secondary' : 'text-on-surface'}`}>
                          {m.profile?.full_name || m.profile?.email} {isMe && '(You)'}
                        </span>
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                          {m.is_leader ? 'Leader' : 'Member'}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  {tasks.map((t: any) => {
                    const val = localEstimates[`${t.id}_${m.user_id}`] || ''
                    return (
                      <td key={t.id} className="p-4 border-r border-white/5 last:border-none">
                        {isMe ? (
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={val}
                            onChange={(e) => handleEstimateChange(t.id, m.user_id, e.target.value)}
                            placeholder="—"
                            className="w-16 bg-surface-container-lowest border border-white/10 rounded px-2 py-1 text-center text-secondary font-bold focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                          />
                        ) : (
                          <span className="w-16 inline-block text-center text-on-surface-variant font-medium opacity-60">
                            {val || '—'}
                          </span>
                        )}
                      </td>
                    )
                  })}
                  
                  <td className="p-4 font-bold text-secondary opacity-80">
                    {memberTotals[m.user_id] || 0}h
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="bg-surface-container-highest/30">
              <td className="p-4 font-bold text-on-surface sticky left-0 bg-[#23222b] z-10">Task Totals</td>
              {tasks.map((t: any) => (
                <td key={t.id} className="p-4 font-bold text-primary">
                  {taskTotals[t.id] || 0}h
                </td>
              ))}
              <td className="p-4 bg-primary-container text-on-primary-container font-black">
                {grandTotal}h
              </td>
            </tr>
          </tfoot>
        </table>
        
        {tasks.length === 0 && (
          <div className="p-12 text-center text-on-surface-variant">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No tasks added yet. Add a task to start estimating.</p>
          </div>
        )}
      </div>

    </div>
  )
}
