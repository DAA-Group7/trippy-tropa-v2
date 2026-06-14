'use client'

import { useState } from 'react'
import { Settings, Star, KeyRound, AlertTriangle, Plus, GripVertical, Trash2, Crown, Loader2, CheckCircle } from 'lucide-react'
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { saveClassroomSettingsAction } from '@/app/actions/skills'
import { requestOwnershipTransferAction } from '@/app/actions/activities'


function SortableSkillItem({ skill, onUpdate, onDelete }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: skill.id || skill._tempId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 p-4 bg-surface-container-low border border-outline-variant rounded-xl hover:border-secondary/40 transition-colors group">
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-outline opacity-40 group-hover:opacity-100 flex items-center justify-center">
        <GripVertical className="w-5 h-5" />
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row gap-4 items-center">
        <input 
          type="text" 
          value={skill.name}
          onChange={(e) => onUpdate(skill.id || skill._tempId, 'name', e.target.value)}
          placeholder="Skill Name"
          className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 text-base focus:ring-1 focus:ring-secondary outline-none w-full"
        />
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">Multiplier</span>
          <input 
            type="number" 
            step="0.1" 
            value={skill.multiplier}
            onChange={(e) => onUpdate(skill.id || skill._tempId, 'multiplier', parseFloat(e.target.value))}
            className="w-20 bg-surface-container-lowest border border-outline-variant rounded-lg px-2 py-2 text-center text-base focus:ring-1 focus:ring-secondary outline-none"
          />
        </div>
      </div>
      <button onClick={() => onDelete(skill.id || skill._tempId)} className="p-2 text-on-surface-variant hover:text-error transition-colors flex items-center justify-center">
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  )
}

export default function SettingsClient({ classroom, initialSkills, isOwner, userRole, teachers, pendingTransfer }: any) {
  const [name, setName] = useState(classroom.name || '')
  const [description, setDescription] = useState(classroom.description || '')
  const [skills, setSkills] = useState<any[]>(
    initialSkills.map((s: any) => ({ ...s, _tempId: s.id }))
  )
  const [isSaving, setIsSaving] = useState(false)
  const [selectedTeacherId, setSelectedTeacherId] = useState('')
  const [isTransferring, setIsTransferring] = useState(false)
  const [transferSuccess, setTransferSuccess] = useState(false)
  const [transferError, setTransferError] = useState<string | null>(null)
  const [showTransferConfirm, setShowTransferConfirm] = useState(false)

  const handleTransferOwnership = async () => {
    if (!selectedTeacherId) return
    setIsTransferring(true)
    setTransferError(null)
    const result = await requestOwnershipTransferAction(classroom.id, selectedTeacherId)
    setIsTransferring(false)
    setShowTransferConfirm(false)
    if (result.error) { setTransferError(result.error) } else { setTransferSuccess(true) }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      setSkills((items) => {
        const oldIndex = items.findIndex(item => (item.id || item._tempId) === active.id)
        const newIndex = items.findIndex(item => (item.id || item._tempId) === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const addSkill = () => {
    setSkills([...skills, { _tempId: `temp_${Date.now()}`, name: '', multiplier: 1.0 }])
  }

  const updateSkill = (id: string, field: string, value: any) => {
    setSkills(skills.map(s => (s.id === id || s._tempId === id) ? { ...s, [field]: value } : s))
  }

  const deleteSkill = (id: string) => {
    setSkills(skills.filter(s => (s.id !== id && s._tempId !== id)))
  }

  const handleSave = async () => {
    setIsSaving(true)
    const result = await saveClassroomSettingsAction(classroom.id, {
      name,
      description,
      skills: skills.map((s, i) => ({ ...s, order_index: i })) // Ensure order index matches array
    })
    setIsSaving(false)
    if (result.error) {
      alert(result.error)
    } else {
      alert('Settings saved successfully!')
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24">
      {/* Hero Header Section */}
      <section className="flex flex-col gap-1 mb-8">
        <h1 className="text-3xl font-bold text-on-surface">Configuration</h1>
        <p className="text-base text-on-surface-variant">Define the architectural parameters and skill weights for your virtual environment.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* General Settings */}
          <section className="bg-surface/70 backdrop-blur-xl border border-white/10 p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-1.5 bg-primary-container/20 rounded-lg text-primary flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold">General Settings</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Classroom Name</label>
                <div className="focus-within:shadow-[0_0_15px_rgba(70,234,229,0.3)] focus-within:border-secondary transition-all border border-outline-variant rounded-lg bg-surface-container-lowest p-1">
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-base py-2 px-4 outline-none" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Description</label>
                <div className="focus-within:shadow-[0_0_15px_rgba(70,234,229,0.3)] focus-within:border-secondary transition-all border border-outline-variant rounded-lg bg-surface-container-lowest p-1">
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-base py-2 px-4 resize-none outline-none" 
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Skill Assessment Configuration */}
          <section className="bg-surface/70 backdrop-blur-xl border border-white/10 p-6 rounded-xl shadow-md overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-1.5 bg-secondary-container/20 rounded-lg text-secondary flex items-center justify-center">
                  <Star className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold">Skill Assessment</h2>
              </div>
              <button onClick={addSkill} className="flex items-center gap-1 text-secondary text-xs font-semibold hover:underline">
                <Plus className="w-4 h-4" />
                Add Skill
              </button>
            </div>
            
            <div className="space-y-4">
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={skills.map(s => s.id || s._tempId)}
                  strategy={verticalListSortingStrategy}
                >
                  {skills.map(skill => (
                    <SortableSkillItem 
                      key={skill.id || skill._tempId} 
                      skill={skill} 
                      onUpdate={updateSkill}
                      onDelete={deleteSkill}
                    />
                  ))}
                </SortableContext>
              </DndContext>
              {skills.length === 0 && (
                <div className="text-center py-8 text-on-surface-variant border border-dashed border-outline-variant rounded-xl">
                  No skills defined. Add some skills to assess students when they join.
                </div>
              )}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Ownership Transfer (Mock) */}
          <section className="bg-surface/70 backdrop-blur-xl border border-white/10 p-6 rounded-xl shadow-md border-l-4 border-l-tertiary">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-1.5 bg-tertiary-container/20 rounded-lg text-tertiary flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold">Ownership</h2>
            </div>
            <p className="text-sm text-on-surface-variant mb-6">Transfer management rights of this classroom to another authorized educator.</p>
            <div className="space-y-6">
              <button disabled className="w-full bg-surface-container text-on-surface-variant py-3 rounded-lg text-xs font-semibold cursor-not-allowed">
                Transfer Ownership (Coming Soon)
              </button>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="border-2 border-error/30 bg-error-container/10 p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-1.5 bg-error-container/20 rounded-lg text-error flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold text-error">Danger Zone</h2>
            </div>
            <p className="text-sm text-on-surface-variant mb-6">Once deleted, all classroom data, student progress logs, and collaborative assets will be permanently purged.</p>
            <button className="w-full border-2 border-error text-error py-3 rounded-lg text-xs font-semibold hover:bg-error hover:text-on-error active:scale-[0.98] transition-all">
              Delete Classroom
            </button>
          </section>

          {/* OWNERSHIP TRANSFER — only for student officers who own the classroom */}
          {isOwner && userRole === 'student_officer' && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Crown className="text-yellow-400 w-5 h-5" />
                <div>
                  <h2 className="text-base font-bold text-on-surface">Transfer Ownership</h2>
                  <p className="text-xs text-on-surface-variant">Transfer classroom ownership to a teacher.</p>
                </div>
              </div>

              {pendingTransfer ? (
                <div className="flex items-center gap-3 p-4 bg-secondary/10 border border-secondary/30 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Transfer Pending</p>
                    <p className="text-xs text-on-surface-variant">
                      Waiting for <span className="text-secondary font-bold">{pendingTransfer.to_profile?.full_name || pendingTransfer.to_profile?.email}</span> to accept.
                    </p>
                  </div>
                </div>
              ) : transferSuccess ? (
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <p className="text-sm text-green-300 font-semibold">Transfer request sent successfully.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transferError && (
                    <p className="text-xs text-error">{transferError}</p>
                  )}
                  {teachers.length === 0 ? (
                    <p className="text-xs text-on-surface-variant">No teachers in this classroom yet. Invite a teacher to transfer ownership.</p>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">Select Teacher</label>
                        <select
                          value={selectedTeacherId}
                          onChange={e => setSelectedTeacherId(e.target.value)}
                          className="w-full bg-[rgba(14,13,21,0.5)] border border-white/10 rounded-lg px-4 py-3 text-on-surface outline-none focus:ring-1 focus:ring-secondary text-sm"
                        >
                          <option value="">— Select a teacher —</option>
                          {teachers.map((t: any) => (
                            <option key={t.id} value={t.id}>{t.full_name} ({t.email})</option>
                          ))}
                        </select>
                      </div>
                      {!showTransferConfirm ? (
                        <button
                          disabled={!selectedTeacherId}
                          onClick={() => setShowTransferConfirm(true)}
                          className="px-5 py-2.5 border border-yellow-400/40 text-yellow-400 rounded-lg text-xs font-bold hover:bg-yellow-400/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Transfer Ownership
                        </button>
                      ) : (
                        <div className="p-4 bg-yellow-400/5 border border-yellow-400/20 rounded-xl space-y-3">
                          <p className="text-sm text-yellow-300 font-semibold">Are you sure? You will lose ownership of this classroom.</p>
                          <div className="flex gap-3">
                            <button onClick={() => setShowTransferConfirm(false)} className="px-5 py-2 border border-white/10 rounded-lg text-xs text-on-surface-variant hover:bg-white/5 transition-all">
                              Cancel
                            </button>
                            <button
                              onClick={handleTransferOwnership}
                              disabled={isTransferring}
                              className="px-5 py-2 bg-yellow-500/20 border border-yellow-400/40 text-yellow-300 rounded-lg text-xs font-bold hover:bg-yellow-400/30 transition-all flex items-center gap-2 disabled:opacity-60"
                            >
                              {isTransferring ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                              Yes, Transfer
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </section>
          )}

        </div>{/* end right column */}
      </div>{/* end grid */}

      {/* Global Actions Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-md border-t border-outline-variant py-4 px-8 flex justify-end gap-4 z-40 pl-[292px]">
        <button className="px-8 py-3 rounded-lg text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors">
          Discard Changes
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-primary-container to-secondary-container text-white text-xs font-semibold shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  )
}
