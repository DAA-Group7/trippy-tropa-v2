'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Crown, GripVertical, CheckCircle, RefreshCw, Loader2 } from 'lucide-react'
import { confirmGroupsAction } from '@/app/actions/activities'
import { useRouter } from 'next/navigation'

// ── Student Card (Draggable) ────────────────────────────────────────────────

function StudentCard({ member, isOverlay = false }: { member: any; isOverlay?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
        isOverlay
          ? 'bg-card border-secondary shadow-xl shadow-secondary/20 scale-105'
          : 'bg-input border-border hover:border-primary/50'
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-foreground/40 hover:text-foreground transition-colors">
        <GripVertical className="w-4 h-4" />
      </div>

      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
        {member.name?.charAt(0) || '?'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {member.isLeader && (
            <Crown className="w-3 h-3 text-yellow-400 flex-shrink-0" />
          )}
          <p className="text-sm font-semibold text-foreground truncate">{member.name}</p>
        </div>
        <p className="text-xs text-foreground/50 truncate">{member.email}</p>
      </div>

      <div className="text-right flex-shrink-0">
        <span className="text-xs font-bold text-secondary">{member.skillScore.toFixed(1)}</span>
        <p className="text-[10px] text-foreground/40">pts</p>
      </div>
    </div>
  )
}

// ── Group Column ─────────────────────────────────────────────────────────────

function GroupColumn({
  group,
  maxScore,
  onRename,
}: {
  group: any
  maxScore: number
  onRename: (groupId: string, newName: string) => void
}) {
  const { setNodeRef } = useSortable({ id: `group-${group.tempId}` })
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState(group.name)

  const heightPct = maxScore > 0 ? Math.max(10, (group.totalScore / maxScore) * 100) : 10

  return (
    <div ref={setNodeRef} className="flex-shrink-0 w-72 flex flex-col gap-3">
      {/* Group Header */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <input
              autoFocus
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              onBlur={() => { onRename(group.tempId, tempName); setIsEditing(false) }}
              onKeyDown={e => { if (e.key === 'Enter') { onRename(group.tempId, tempName); setIsEditing(false) } }}
              className="bg-input border border-border rounded px-2 py-1 text-sm font-bold text-foreground outline-none focus:border-secondary w-full"
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-base font-bold text-foreground hover:text-secondary transition-colors text-left"
            >
              {group.name}
            </button>
          )}
          <span className="text-xs bg-secondary/20 text-secondary border border-secondary/30 px-2 py-0.5 rounded-full font-bold whitespace-nowrap ml-2">
            {group.totalScore.toFixed(1)} pts
          </span>
        </div>
        {/* Mini bar */}
        <div className="h-1.5 bg-border/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
            style={{ width: `${heightPct}%` }}
          />
        </div>
        <p className="text-xs text-foreground/40">{group.members.length} members</p>
      </div>

      {/* Student list */}
      <div className="flex flex-col gap-2 min-h-[60px]">
        <SortableContext
          items={group.members.map((m: any) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          {group.members.map((member: any) => (
            <StudentCard key={member.id} member={member} />
          ))}
        </SortableContext>
        {group.members.length === 0 && (
          <div className="border-2 border-dashed border-border text-foreground/40 rounded-lg p-6 text-center text-foreground/30 text-xs">
            Drop students here
          </div>
        )}
      </div>
    </div>
  )
}

// ── Balance Chart ────────────────────────────────────────────────────────────

function BalanceChart({ groups }: { groups: any[] }) {
  const maxScore = Math.max(...groups.map(g => g.totalScore), 1)
  const minScore = Math.min(...groups.map(g => g.totalScore))
  const balance = maxScore > 0 ? (1 - (maxScore - minScore) / maxScore) * 100 : 100

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider">Group Skill Distribution</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-xs text-secondary font-bold">Balance: {balance.toFixed(1)}%</span>
        </div>
      </div>
      <div className="flex items-end gap-2 h-20">
        {groups.map((group, i) => {
          const pct = maxScore > 0 ? (group.totalScore / maxScore) * 100 : 10
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] text-foreground/40">{group.totalScore.toFixed(0)}</span>
              <div
                className="w-full rounded-t bg-gradient-to-t from-primary/60 to-secondary/60 border-t border-secondary transition-all duration-500"
                style={{ height: `${Math.max(4, pct)}%`, minHeight: '4px' }}
              />
              <span className="text-[8px] text-foreground/40 truncate w-full text-center">{group.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main GroupDraftBoard ─────────────────────────────────────────────────────

interface Props {
  activityId: string
  classroomId: string
  initialGroups: any[]
  onConfirmed: () => void
}

export default function GroupDraftBoard({ activityId, classroomId, initialGroups, onConfirmed }: Props) {
  const router = useRouter()
  const [groups, setGroups] = useState(
    initialGroups.map((g, i) => ({ ...g, tempId: `g-${i}` }))
  )
  const [activeStudent, setActiveStudent] = useState<any>(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const maxScore = Math.max(...groups.map(g => g.totalScore), 1)

  const findGroupByMemberId = (memberId: string) =>
    groups.find(g => g.members.some((m: any) => m.id === memberId))

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    for (const group of groups) {
      const found = group.members.find((m: any) => m.id === active.id)
      if (found) { setActiveStudent(found); break }
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeGroup = findGroupByMemberId(active.id as string)
    let overGroup = findGroupByMemberId(over.id as string)
    
    // If dragging over the group container itself (no member under)
    if (!overGroup) {
      const overId = over.id as string
      if (overId.startsWith('group-')) {
        const tempId = overId.replace('group-', '')
        overGroup = groups.find(g => g.tempId === tempId)
      }
    }

    if (!activeGroup || !overGroup || activeGroup.tempId === overGroup.tempId) return

    setGroups(prev => {
      const newGroups = prev.map(g => ({ ...g, members: [...g.members] }))
      const fromGroup = newGroups.find(g => g.tempId === activeGroup.tempId)!
      const toGroup = newGroups.find(g => g.tempId === overGroup.tempId)!
      const memberIdx = fromGroup.members.findIndex((m: any) => m.id === active.id)
      const [member] = fromGroup.members.splice(memberIdx, 1)

      // Recalculate leader for source group
      fromGroup.totalScore = fromGroup.members.reduce((s: number, m: any) => s + m.skillScore, 0)
      const maxInFrom = Math.max(...fromGroup.members.map((m: any) => m.skillScore), 0)
      fromGroup.members = fromGroup.members.map((m: any) => ({ ...m, isLeader: m.skillScore === maxInFrom && fromGroup.members.length > 0 }))

      const overMemberIdx = over.id ? toGroup.members.findIndex((m: any) => m.id === over.id) : -1
      if (overMemberIdx >= 0) {
        toGroup.members.splice(overMemberIdx, 0, member)
      } else {
        toGroup.members.push(member)
      }

      // Recalculate leader for target group
      toGroup.totalScore = toGroup.members.reduce((s: number, m: any) => s + m.skillScore, 0)
      const maxInTo = Math.max(...toGroup.members.map((m: any) => m.skillScore), 0)
      toGroup.members = toGroup.members.map((m: any) => ({ ...m, isLeader: m.skillScore === maxInTo }))

      return newGroups
    })
  }

  const handleDragEnd = () => setActiveStudent(null)

  const handleRename = (groupTempId: string, newName: string) => {
    setGroups(prev => prev.map(g => g.tempId === groupTempId ? { ...g, name: newName } : g))
  }

  const handleConfirm = async () => {
    setIsConfirming(true)
    setError(null)
    const result = await confirmGroupsAction(activityId, groups)
    if (result.error) {
      setError(result.error)
      setIsConfirming(false)
    } else {
      onConfirmed()
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      <BalanceChart groups={groups} />

      {/* Scrollable columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin' }}>
          {groups.map(group => (
            <GroupColumn
              key={group.tempId}
              group={group}
              maxScore={maxScore}
              onRename={handleRename}
            />
          ))}
        </div>
        <DragOverlay>
          {activeStudent && (
            <StudentCard member={activeStudent} isOverlay />
          )}
        </DragOverlay>
      </DndContext>

      {error && (
        <p className="text-error text-sm font-medium text-center">{error}</p>
      )}

      {/* Sticky confirm bar */}
      <div className="sticky bottom-0 -mx-4 md:-mx-8 px-4 md:px-8 py-4 bg-background/90 backdrop-blur-xl border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex justify-between items-center gap-4">
        <p className="text-sm text-foreground/50">{groups.reduce((s, g) => s + g.members.length, 0)} students across {groups.length} groups</p>
        <div className="flex gap-3">
          <button
            onClick={() => router.refresh()}
            className="px-6 py-2.5 rounded-lg border border-white/10 text-foreground/60 hover:text-white hover:border-white/30 transition-all flex items-center gap-2 text-sm font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </button>
          <button
            onClick={handleConfirm}
            disabled={isConfirming}
            className="px-8 py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-60 disabled:scale-100 text-sm"
          >
            {isConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Confirm Groups
          </button>
        </div>
      </div>
    </div>
  )
}
