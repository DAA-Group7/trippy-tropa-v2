'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { 
  DndContext, 
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  useDroppable
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Clock, CheckCircle2, CircleDashed, Loader2 } from 'lucide-react'
import { updateTaskStatusAction } from '@/app/actions/tasks'

const SortableTaskCard = React.memo(function SortableTaskCard({ task, isDraggingOverlay = false }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id,
    data: {
      type: 'Task',
      task
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const member = task.assigned_profile
  // Find estimate
  const est = task.estimate

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`glass-card p-4 rounded-xl border ${isDraggingOverlay ? 'shadow-2xl border-secondary/50 scale-105 rotate-2 cursor-grabbing' : 'border-white/10 hover:border-white/20 cursor-grab'} transition-colors bg-surface-container/50 relative overflow-hidden group`}
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${
        task.status === 'todo' ? 'bg-primary' : 
        task.status === 'in_progress' ? 'bg-secondary' : 'bg-tertiary'
      }`} />
      
      <div className="pl-3">
        <h4 className="font-bold text-on-surface mb-3 line-clamp-2">{task.title}</h4>
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <img 
              src={member?.avatar_url || `https://ui-avatars.com/api/?name=${member?.full_name || 'U'}&background=random`} 
              alt="Avatar" 
              className="w-6 h-6 rounded-full border border-white/10"
            />
            <span className="text-xs font-semibold text-on-surface-variant truncate max-w-[80px]">
              {member?.full_name || 'Unassigned'}
            </span>
          </div>
          
          <div className="flex items-center gap-1 bg-surface-container-highest px-2 py-1 rounded text-[10px] font-bold text-on-surface-variant">
            <Clock className="w-3 h-3" />
            {est ? Number(est.estimated_hours) : 0}h
          </div>
        </div>
      </div>
    </div>
  )
})

const KanbanColumn = React.memo(function KanbanColumn({ id, title, tasks, icon: Icon }: any) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div ref={setNodeRef} className="flex flex-col gap-4 bg-surface-container-lowest/30 rounded-2xl p-4 border border-white/5 min-h-[500px]">
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${
            id === 'todo' ? 'text-primary' : 
            id === 'in_progress' ? 'text-secondary' : 'text-tertiary'
          }`} />
          <h3 className="font-bold text-on-surface uppercase tracking-wider text-sm">{title}</h3>
          <span className="text-xs bg-surface-container-highest px-2 py-0.5 rounded-full text-on-surface-variant font-bold">
            {tasks.length}
          </span>
        </div>
      </div>

      <SortableContext items={tasks.map((t: any) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3 min-h-[200px] h-full rounded-xl">
          {tasks.map((task: any) => (
            <SortableTaskCard key={task.id} task={task} />
          ))}
          {tasks.length === 0 && (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl p-6">
              <span className="text-sm font-semibold text-on-surface-variant opacity-50">Drop here</span>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
})

export default function KanbanBoard({ tasks, estimates, currentUserId, isTeacherOrOfficer, activityId, groupId, members }: any) {
  // Optimization: useMemo to map profiles and estimates to avoid O(N^2) during re-renders
  const serverTasksWithProfiles = useMemo(() => {
    const memberMap = new Map()
    members.forEach((m: any) => memberMap.set(m.user_id, m.profile))
    
    const estimatesMap = new Map()
    estimates.forEach((e: any) => estimatesMap.set(`${e.task_id}_${e.user_id}`, e))

    return tasks.map((t: any) => ({
      ...t,
      assigned_profile: memberMap.get(t.assigned_to),
      estimate: estimatesMap.get(`${t.id}_${t.assigned_to}`)
    }))
  }, [tasks, members, estimates])

  // Local state for optimistic UI updates
  const [optimisticIds, setOptimisticIds] = useState<Set<string>>(new Set())
  const [boardTasks, setBoardTasks] = useState(serverTasksWithProfiles)
  const [activeTask, setActiveTask] = useState<any | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setBoardTasks((prev: any[]) => {
      if (optimisticIds.size > 0) {
         return serverTasksWithProfiles.map((serverTask: any) => {
           if (optimisticIds.has(serverTask.id)) {
             const localMatch = prev.find((pt: any) => pt.id === serverTask.id)
             return localMatch || serverTask
           }
           return serverTask
         })
      }
      return serverTasksWithProfiles
    })
  }, [serverTasksWithProfiles, optimisticIds])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = (event: any) => {
    const { active } = event
    if (active.data.current?.type === 'Task') {
      setActiveTask(active.data.current.task)
    }
  }

  const handleDragEnd = async (event: any) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id // This is either another task ID or a column ID
    
    // Find active task
    const activeTaskIndex = boardTasks.findIndex((t: any) => t.id === activeId)
    if (activeTaskIndex === -1) return
    const task = boardTasks[activeTaskIndex]

    // Check permissions - students can only drag their own tasks, teachers cannot drag
    if (isTeacherOrOfficer) {
      alert('Teachers and officers are in view-only mode.')
      return
    }
    if (task.assigned_to !== currentUserId) {
      alert('You can only move tasks assigned to you.')
      return
    }

    let targetStatus = task.status
    let overIndex = -1
    
    if (['todo', 'in_progress', 'done'].includes(overId)) {
      targetStatus = overId
    } else {
      const overTask = boardTasks.find((t: any) => t.id === overId)
      if (overTask) {
        targetStatus = overTask.status
        overIndex = boardTasks.findIndex((t: any) => t.id === overTask.id)
      }
    }

    setOptimisticIds(prev => new Set(prev).add(task.id))

    if (task.status !== targetStatus) {
      // Moving to different column
      setBoardTasks((prev: any) => {
        const newTasks = prev.map((t: any) => t.id === task.id ? { ...t, status: targetStatus } : t)
        if (overIndex !== -1) {
          const activeIndex = newTasks.findIndex((t: any) => t.id === task.id)
          return arrayMove(newTasks, activeIndex, overIndex)
        }
        return newTasks
      })

      try {
        const res = await updateTaskStatusAction(task.id, targetStatus, activityId, groupId)
        if (res?.error) throw new Error(res.error)
      } catch (err: any) {
        alert(`Failed to update task: ${err.message}`)
        // Functional state update for rollback prevents stale closure issues
        setBoardTasks((prev: any) => prev.map((t: any) => t.id === task.id ? { ...t, status: task.status } : t))
      } finally {
        setTimeout(() => {
          setOptimisticIds(prev => {
            const next = new Set(prev)
            next.delete(task.id)
            return next
          })
        }, 2000)
      }
    } else if (overIndex !== -1 && activeTaskIndex !== overIndex) {
      // Moving within the same column (optimistic only, since we don't save order to db)
      setBoardTasks((prev: any) => arrayMove(prev, activeTaskIndex, overIndex))
      setTimeout(() => {
        setOptimisticIds(prev => {
          const next = new Set(prev)
          next.delete(task.id)
          return next
        })
      }, 500)
    } else {
      // Didn't move
      setOptimisticIds(prev => {
        const next = new Set(prev)
        next.delete(task.id)
        return next
      })
    }
  }

  const columns = [
    { id: 'todo', title: 'To Do', icon: CircleDashed },
    { id: 'in_progress', title: 'In Progress', icon: Loader2 },
    { id: 'done', title: 'Done', icon: CheckCircle2 },
  ]

  if (!isMounted) {
    return null
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-on-surface">Task Board</h2>
        <p className="text-on-surface-variant mt-1">Track the progress of assigned tasks. Only assigned members can move their cards.</p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(col => (
            <KanbanColumn 
              key={col.id}
              id={col.id}
              title={col.title}
              icon={col.icon}
              tasks={boardTasks.filter((t: any) => t.status === col.id)}
              estimates={estimates}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
          {activeTask ? (
            <SortableTaskCard task={activeTask} isDraggingOverlay estimates={estimates} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
