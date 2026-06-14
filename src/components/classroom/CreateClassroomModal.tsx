'use client'

import { useState, useActionState, useEffect } from 'react'
import { createClassroomAction } from '@/app/actions/classroom'
import { X, CheckCircle, Copy, Link as LinkIcon, Download } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function CreateClassroomModal({ isOpen, onClose }: Props) {
  const [state, formAction, isPending] = useActionState(createClassroomAction, null)
  const [success, setSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (state?.success && state.classroom) {
      setSuccess(true)
    }
  }, [state])

  if (!isOpen) return null

  const handleClose = () => {
    setSuccess(false)
    onClose()
  }

  const handleCopy = () => {
    if (state?.classroom) {
      const link = `${window.location.origin}/join/${state.classroom.invite_code}`
      navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownloadQR = () => {
    const canvas = document.getElementById('create-qr-code') as HTMLCanvasElement
    if (!canvas || !state?.classroom) return
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
    const downloadLink = document.createElement('a')
    downloadLink.href = pngUrl
    downloadLink.download = `invite-qr-${state.classroom.invite_code}.png`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  if (success && state?.classroom) {
    const inviteLink = `${window.location.origin}/join/${state.classroom.invite_code}`
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <div className="w-full max-w-md bg-surface border border-white/10 rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
          <button 
            onClick={handleClose}
            className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-secondary/20 text-secondary flex items-center justify-center mb-4">
              <CheckCircle size={24} />
            </div>
            <h2 className="text-2xl font-bold text-on-surface mb-2">Classroom Created!</h2>
            <p className="text-sm text-on-surface-variant mb-6">
              Your new learning space is ready. Invite your students to join the trip.
            </p>

            <div className="p-4 bg-white rounded-xl mb-4 shadow-lg shadow-secondary/10 relative group">
              <QRCodeCanvas 
                id="create-qr-code"
                value={inviteLink} 
                size={180} 
                bgColor={"#ffffff"} 
                fgColor={"#000000"} 
                level={"H"} 
              />
            </div>

            <button 
              onClick={handleDownloadQR}
              className="flex items-center gap-2 bg-surface-container hover:bg-surface-container-high border border-white/10 px-4 py-2 rounded-lg text-sm font-semibold transition-colors mb-6 text-on-surface"
            >
              <Download size={16} />
              Download QR
            </button>

            <div className="w-full mb-6">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Invite Code</p>
              <div className="bg-surface-container py-3 rounded-lg border border-white/5 font-mono text-3xl font-bold tracking-widest text-on-surface">
                {state.classroom.invite_code}
              </div>
            </div>

            <div className="w-full flex items-center gap-2 bg-surface-container-low p-2 rounded-lg border border-white/5 mb-6">
              <LinkIcon size={16} className="text-on-surface-variant ml-2" />
              <input 
                type="text" 
                readOnly 
                value={inviteLink}
                className="flex-1 bg-transparent border-none text-xs text-on-surface focus:ring-0 truncate"
              />
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1 bg-secondary/10 hover:bg-secondary/20 text-secondary px-3 py-1.5 rounded-md text-xs font-bold transition-colors"
              >
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <button 
              onClick={() => {
                handleClose()
                window.location.href = `/classroom/${state.classroom.id}`
              }}
              className="w-full bg-gradient-to-r from-primary-container to-secondary text-on-primary font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-secondary/20 transition-all active:scale-95"
            >
              Done
            </button>
            
            <a href={`/classroom/${state.classroom.id}/settings`} className="mt-4 text-xs text-on-surface-variant hover:text-on-surface font-semibold">
              Manage Classroom Settings
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-surface border border-white/10 rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={handleClose}
          className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-on-surface mb-2">Create Classroom</h2>
        <p className="text-sm text-on-surface-variant mb-6">Initialize a new smart learning environment for your students.</p>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
              Classroom Name
            </label>
            <input 
              type="text" 
              id="name"
              name="name"
              placeholder="e.g. Advanced Web Dev"
              className="w-full bg-surface-container border border-white/10 rounded-lg px-4 py-2 text-sm text-on-surface focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
              Class Description
            </label>
            <textarea 
              id="description"
              name="description"
              rows={3}
              placeholder="Outline the core objectives..."
              className="w-full bg-surface-container border border-white/10 rounded-lg px-4 py-2 text-sm text-on-surface focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-surface-container rounded-lg border border-white/5">
            <div>
              <p className="font-semibold text-sm text-on-surface">Enable Permanent Groups</p>
              <p className="text-xs text-on-surface-variant">Lock student assignments for the full semester duration.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="permanentGroups" className="sr-only peer" />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
            </label>
          </div>

          {state?.error && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
              {state.error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5 mt-6">
            <button 
              type="button" 
              onClick={handleClose}
              className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="px-6 py-2 bg-gradient-to-r from-primary-container to-secondary text-on-primary text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-secondary/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {isPending ? 'Creating...' : 'Create Classroom'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
