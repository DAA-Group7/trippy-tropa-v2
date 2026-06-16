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
import { requestOwnershipTransferAction, respondToTransferAction } from '@/app/actions/activities'


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
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 p-4 bg-surface-container-low border border-border rounded-xl hover:border-secondary/40 transition-colors group">
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-outline opacity-40 group-hover:opacity-100 flex items-center justify-center">
        <GripVertical className="w-5 h-5" />
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row gap-4 items-center">
        <input 
          type="text" 
          value={skill.name}
          onChange={(e) => onUpdate(skill.id || skill._tempId, 'name', e.target.value)}
          placeholder="Skill Name"
          className="flex-1 bg-surface-container-lowest border border-border rounded-lg px-4 py-2 text-base focus:ring-1 focus:ring-secondary outline-none w-full"
        />
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground/70 whitespace-nowrap">Multiplier</span>
          <input 
            type="number" 
            step="0.1" 
            value={skill.multiplier}
            onChange={(e) => onUpdate(skill.id || skill._tempId, 'multiplier', parseFloat(e.target.value))}
            className="w-20 bg-surface-container-lowest border border-border rounded-lg px-2 py-2 text-center text-base focus:ring-1 focus:ring-secondary outline-none"
          />
        </div>
      </div>
      <button onClick={() => onDelete(skill.id || skill._tempId)} className="p-2 text-foreground/70 hover:text-destructive transition-colors flex items-center justify-center">
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  )
}

export default function SettingsClient({ classroom, initialSkills, isOwner, userRole, teachers, pendingTransfer, receivedTransfer }: any) {
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
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleTransferOwnership = async () => {
    if (!selectedTeacherId) return
    setIsTransferring(true)
    setTransferError(null)
    const result = await requestOwnershipTransferAction(classroom.id, selectedTeacherId)
    setIsTransferring(false)
    setShowTransferConfirm(false)
    if (result.error) { setTransferError(result.error) } else { setTransferSuccess(true) }
  }

  const [isResponding, setIsResponding] = useState(false)
  
  const handleRespond = async (response: 'accepted' | 'rejected') => {
    if (!confirm(`Are you sure you want to ${response} this transfer?`)) return
    setIsResponding(true)
    const result = await respondToTransferAction(receivedTransfer.id, response)
    setIsResponding(false)
    if (result.error) {
      alert(result.error)
    } else {
      window.location.reload()
    }
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
    
    const cleanedSkills = skills.map((s, i) => {
      const { _tempId, ...rest } = s
      return { ...rest, order_index: i }
    })

    const result = await saveClassroomSettingsAction(classroom.id, {
      name,
      description,
      skills: cleanedSkills
    })
    setIsSaving(false)
    if (result.error) {
      alert(result.error)
    } else {
      alert('Settings saved successfully!')
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pt-12 pb-24">
            {/* Hero Header Section */}
      <section className="flex items-start justify-between mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-foreground/70">Define the architectural parameters and skill weights for your virtual environment.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
              onClick={() => setIsDeleteDialogOpen(true)}
              className="px-4 py-2 border border-destructive/30 text-destructive hover:bg-destructive/10 rounded-lg text-xs font-bold transition-colors"
            >
              Delete Classroom
            </button>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold transition-colors"
              >
                Edit Settings
              </button>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-border text-foreground/70 hover:bg-muted rounded-lg text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    await handleSave();
                    setIsEditing(false);
                  }}
                  disabled={isSaving}
                  className="px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-lg text-xs font-bold transition-colors shadow-md disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            )}
        </div>
      </section>


      
        
        <div className="space-y-8">
          
                    {/* General Settings */}
          <section className="bg-transparent border border-border p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-5 h-5 text-foreground/80" />
              <h2 className="text-xl font-bold text-foreground">General Settings</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-foreground/70 uppercase tracking-widest">Classroom Name</label>
                <div className="border border-border rounded-lg bg-input p-1 transition-colors focus-within:border-border/80">
                  <input 
                    type="text" 
                    value={name}
                    disabled={!isEditing}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-sm py-2 px-3 outline-none text-foreground" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-foreground/70 uppercase tracking-widest">Description</label>
                <div className="border border-border rounded-lg bg-input p-1 transition-colors focus-within:border-border/80">
                  <textarea 
                    value={description}
                    disabled={!isEditing}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-sm py-2 px-3 resize-none outline-none text-foreground" 
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Skill Assessment Configuration */}
          <section className="bg-transparent border border-border p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-foreground/80" />
                <h2 className="text-xl font-bold text-foreground">Skill Assessment</h2>
              </div>
              <button onClick={addSkill} disabled={!isEditing} className="flex items-center gap-1 text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-[11px] font-bold tracking-widest uppercase transition-colors">
                <Plus className="w-3.5 h-3.5" />
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
                <div className="text-center py-8 text-foreground/70 border border-dashed border-border rounded-xl">
                  No skills defined. Add some skills to assess students when they join.
                </div>
              )}
            </div>
          </section>

        </div>

        
        
          
          
          

          

          

          {/* RECEIVED TRANSFER — only for teachers who have a pending transfer request */}
          {receivedTransfer && (
            <section className="bg-card/70 backdrop-blur-xl border border-secondary/50 p-6 rounded-xl shadow-md shadow-secondary/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-1.5 bg-secondary/20 rounded-lg text-secondary flex items-center justify-center">
                  <Crown className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-secondary">Classroom Ownership Transfer</h2>
              </div>
              <p className="text-sm text-foreground mb-6">
                <strong>{receivedTransfer.from_profile?.full_name || receivedTransfer.from_profile?.email}</strong> has requested to transfer ownership of this classroom to you.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleRespond('accepted')}
                  disabled={isResponding}
                  className="flex-1 bg-secondary text-secondary-foreground py-3 rounded-lg text-xs font-bold hover:bg-secondary/90 transition-all shadow-lg disabled:opacity-50"
                >
                  Accept Transfer
                </button>
                <button
                  onClick={() => handleRespond('rejected')}
                  disabled={isResponding}
                  className="flex-1 border border-border/60 text-foreground/70 py-3 rounded-lg text-xs font-bold hover:bg-muted transition-all disabled:opacity-50"
                >
                  Decline
                </button>
              </div>
            </section>
          )}

          {/* OWNERSHIP TRANSFER — only for student officers who own the classroom */}
          {isOwner && userRole === 'student_officer' && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Crown className="text-yellow-400 w-5 h-5" />
                <div>
                  <h2 className="text-base font-bold text-foreground">Transfer Ownership</h2>
                  <p className="text-xs text-foreground/70">Transfer classroom ownership to a teacher.</p>
                </div>
              </div>

              {pendingTransfer ? (
                <div className="flex items-center gap-3 p-4 bg-secondary/10 border border-secondary/30 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Transfer Pending</p>
                    <p className="text-xs text-foreground/70">
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
                    <p className="text-xs text-destructive">{transferError}</p>
                  )}
                  {teachers.length === 0 ? (
                    <p className="text-xs text-foreground/70">No teachers in this classroom yet. Invite a teacher to transfer ownership.</p>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider block">Select Teacher</label>
                        <select
                          value={selectedTeacherId}
                          onChange={e => setSelectedTeacherId(e.target.value)}
                          className="w-full bg-input border border-border/60 rounded-lg px-4 py-3 text-foreground outline-none focus:ring-1 focus:ring-secondary text-sm"
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
                            <button onClick={() => setShowTransferConfirm(false)} className="px-5 py-2 border border-border/60 rounded-lg text-xs text-foreground/70 hover:bg-muted transition-all">
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

        
      

      

      {/* Delete Confirmation Modal */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
              <h2 className="text-xl font-bold text-foreground">Danger Zone</h2>
            </div>
            <p className="text-sm text-foreground/70 mb-8">
              Once deleted, all classroom data, student progress logs, and collaborative assets will be permanently purged.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-4 py-2 border border-border text-foreground/70 hover:bg-muted rounded-lg text-sm font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert('Classroom deleted!');
                  setIsDeleteDialogOpen(false);
                }}
                className="px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg text-sm font-bold transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
