'use client'

import { useState } from 'react'
import { createClassroomAction } from '@/app/actions/classroom'
import { saveClassroomSettingsAction } from '@/app/actions/skills'
import { X, CheckCircle, Copy, Link as LinkIcon, Download, Plus, Trash2, ArrowLeft } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function CreateClassroomModal({ isOpen, onClose }: Props) {
  const [phase, setPhase] = useState<1 | 2 | 3>(1)
  
  // Phase 1 State
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [permanentGroups, setPermanentGroups] = useState(false)
  
  // Phase 2 State
  const [skills, setSkills] = useState([
    { _tempId: 'temp_1', name: 'Programming', multiplier: 3.0 },
    { _tempId: 'temp_2', name: 'Communication', multiplier: 1.0 },
    { _tempId: 'temp_3', name: 'Version Control', multiplier: 2.0 },
  ])
  
  // Global State
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdClassroom, setCreatedClassroom] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const resetState = () => {
    setPhase(1)
    setName('')
    setDescription('')
    setPermanentGroups(false)
    setSkills([
      { _tempId: 'temp_1', name: 'Programming', multiplier: 3.0 },
      { _tempId: 'temp_2', name: 'Communication', multiplier: 1.0 },
      { _tempId: 'temp_3', name: 'Version Control', multiplier: 2.0 },
    ])
    setError(null)
    setCreatedClassroom(null)
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  const handleNextToPhase2 = () => {
    if (!name.trim()) {
      setError('Classroom name is required')
      return
    }
    setError(null)
    setPhase(2)
  }

  const handleCreateClassroom = async () => {
    setIsPending(true)
    setError(null)

    // 1. Create Classroom
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    if (permanentGroups) formData.append('permanentGroups', 'on')

    const createRes = await createClassroomAction(null, formData)
    
    if (createRes.error || !createRes.classroom) {
      setError(createRes.error || 'Failed to create classroom')
      setIsPending(false)
      return
    }

    const newClassroom = createRes.classroom

    // 2. Add Skills
    const cleanedSkills = skills.map((s, i) => ({
      name: s.name,
      multiplier: s.multiplier,
      order_index: i
    }))

    const skillsRes = await saveClassroomSettingsAction(newClassroom.id, {
      name,
      description,
      skills: cleanedSkills
    })

    if (skillsRes.error) {
      console.error(skillsRes.error)
    }

    setCreatedClassroom(newClassroom)
    setPhase(3)
    setIsPending(false)
  }

  // --- Skill Management Functions ---
  const addSkill = () => {
    setSkills([...skills, { _tempId: `temp_${Date.now()}`, name: '', multiplier: 1.0 }])
  }
  const updateSkill = (id: string, field: string, value: any) => {
    setSkills(skills.map(s => s._tempId === id ? { ...s, [field]: value } : s))
  }
  const deleteSkill = (id: string) => {
    setSkills(skills.filter(s => s._tempId !== id))
  }

  // --- Utilities ---
  const handleCopy = () => {
    if (createdClassroom) {
      const link = `${window.location.origin}/join/${createdClassroom.invite_code}`
      navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownloadQR = () => {
    const canvas = document.getElementById('create-qr-code') as HTMLCanvasElement
    if (!canvas || !createdClassroom) return
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
    const downloadLink = document.createElement('a')
    downloadLink.href = pngUrl
    downloadLink.download = `invite-qr-${createdClassroom.invite_code}.png`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  // ============================================================================
  // RENDER PHASE 3: Success Screen
  // ============================================================================
  if (phase === 3 && createdClassroom) {
    const inviteLink = `${window.location.origin}/join/${createdClassroom.invite_code}`
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <div className="w-full max-w-md bg-[#13121b] border border-white/10 rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
          <button onClick={handleClose} className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#46eae5]/20 text-[#46eae5] flex items-center justify-center mb-4">
              <CheckCircle size={24} />
            </div>
            <h2 className="text-2xl font-bold text-[#e5e0ed] mb-2">Classroom Created!</h2>
            <p className="text-sm text-white/60 mb-6">
              Your new learning space is ready. Invite your students to join the trip.
            </p>
            <div className="p-4 bg-white rounded-xl mb-4 shadow-lg shadow-[#46eae5]/10 relative group">
              <QRCodeCanvas id="create-qr-code" value={inviteLink} size={180} bgColor={"#ffffff"} fgColor={"#000000"} level={"H"} />
            </div>
            <button onClick={handleDownloadQR} className="flex items-center gap-2 bg-[#1c1b23] hover:bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm font-semibold transition-colors mb-6 text-white">
              <Download size={16} /> Download QR
            </button>
            <div className="w-full mb-6">
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Invite Code</p>
              <div className="bg-[#1c1b23] py-3 rounded-lg border border-white/5 font-mono text-3xl font-bold tracking-widest text-[#46eae5]">
                {createdClassroom.invite_code}
              </div>
            </div>
            <div className="w-full flex items-center gap-2 bg-[#1c1b23] p-2 rounded-lg border border-white/5 mb-6">
              <LinkIcon size={16} className="text-white/50 ml-2" />
              <input type="text" readOnly value={inviteLink} className="flex-1 bg-transparent border-none text-xs text-white focus:ring-0 truncate" />
              <button onClick={handleCopy} className="flex items-center gap-1 bg-[#46eae5]/10 hover:bg-[#46eae5]/20 text-[#46eae5] px-3 py-1.5 rounded-md text-xs font-bold transition-colors">
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <button 
              onClick={() => { handleClose(); window.location.href = `/classroom/${createdClassroom.id}` }}
              className="w-full bg-gradient-to-r from-[#c6bfff] to-[#46eae5] text-[#13121b] font-bold py-3 rounded-lg hover:shadow-lg transition-all active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ============================================================================
  // RENDER PHASE 1 & 2
  // ============================================================================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className={`w-full ${phase === 2 ? 'max-w-2xl' : 'max-w-md'} bg-[#13121b] border border-white/10 rounded-2xl p-6 shadow-2xl relative transition-all duration-300 animate-in fade-in zoom-in-95`}>
        <button onClick={handleClose} className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors">
          <X size={20} />
        </button>

        {phase === 1 && (
          <>
            <h2 className="text-2xl font-bold text-[#e5e0ed] mb-2">Create Classroom</h2>
            <p className="text-sm text-[rgba(200,196,215,0.8)] mb-8">Initialize a new smart learning environment for your students.</p>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black text-[#46eae5] uppercase tracking-widest mb-2">
                  Classroom Name
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Advanced Web Dev"
                  className="w-full bg-[#1c1b23] border border-white/5 rounded-lg px-4 py-3 text-sm text-[#e5e0ed] focus:ring-1 focus:ring-[#46eae5] focus:border-[#46eae5] outline-none transition-all placeholder:text-white/20"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#46eae5] uppercase tracking-widest mb-2">
                  Class Description
                </label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Outline the core objectives..."
                  className="w-full bg-[#1c1b23] border border-white/5 rounded-lg px-4 py-3 text-sm text-[#e5e0ed] focus:ring-1 focus:ring-[#46eae5] focus:border-[#46eae5] outline-none transition-all resize-none placeholder:text-white/20"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#1c1b23] rounded-lg border border-white/5">
                <div>
                  <p className="font-bold text-sm text-[#e5e0ed]">Enable Permanent Groups</p>
                  <p className="text-xs text-[rgba(200,196,215,0.6)]">Lock student assignments for the full semester duration.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={permanentGroups} onChange={e => setPermanentGroups(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c6bfff]"></div>
                </label>
              </div>

              {error && (
                <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-white/5">
                <button onClick={handleClose} className="px-4 py-2 text-sm font-bold text-white/50 hover:text-white transition-colors">
                  Cancel
                </button>
                <button onClick={handleNextToPhase2} className="px-6 py-2 bg-[#c6bfff] text-[#13121b] text-sm font-black rounded-lg hover:opacity-90 transition-all active:scale-95">
                  Next Step
                </button>
              </div>
            </div>
          </>
        )}

        {phase === 2 && (
          <>
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => setPhase(1)} className="text-white/40 hover:text-white transition-colors">
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-[#e5e0ed]">Configure Skills</h2>
                <p className="text-sm text-[rgba(200,196,215,0.8)]">Set up the initial onboarding skill assessment for your students.</p>
              </div>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {skills.map((skill) => (
                <div key={skill._tempId} className="flex flex-col md:flex-row gap-3 items-center bg-[#1c1b23] p-3 rounded-xl border border-white/5">
                  <input 
                    type="text" 
                    value={skill.name}
                    onChange={(e) => updateSkill(skill._tempId, 'name', e.target.value)}
                    placeholder="Skill Name (e.g. UX Design)"
                    className="flex-1 bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-[#e5e0ed] focus:ring-1 focus:ring-[#c6bfff] outline-none w-full"
                  />
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Weight</span>
                    <input 
                      type="number" 
                      step="0.1" 
                      value={skill.multiplier}
                      onChange={(e) => updateSkill(skill._tempId, 'multiplier', parseFloat(e.target.value))}
                      className="w-20 bg-transparent border border-white/10 rounded-lg px-2 py-2 text-center text-sm text-[#e5e0ed] focus:ring-1 focus:ring-[#c6bfff] outline-none"
                    />
                    <button onClick={() => deleteSkill(skill._tempId)} className="p-2 text-white/20 hover:text-error transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              
              <button onClick={addSkill} className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-white/20 rounded-xl text-white/50 hover:text-white hover:border-white/40 transition-all text-sm font-bold">
                <Plus size={16} /> Add Another Skill
              </button>
            </div>

            {error && (
              <div className="p-3 mt-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-white/5">
              <button 
                onClick={handleCreateClassroom}
                disabled={isPending || skills.length === 0}
                className="px-6 py-3 w-full md:w-auto bg-gradient-to-r from-[#c6bfff] to-[#46eae5] text-[#13121b] text-sm font-black rounded-lg shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {isPending ? 'Finalizing...' : 'Create Classroom'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
