'use client'

import { useState } from 'react'
import { X, CheckCircle, Copy, Link as LinkIcon, Download } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'

interface Props {
  isOpen: boolean
  onClose: () => void
  inviteCode: string
}

export function InviteStudentsModal({ isOpen, onClose, inviteCode }: Props) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const inviteLink = typeof window !== 'undefined' ? `${window.location.origin}/join/${inviteCode}` : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadQR = () => {
    const canvas = document.getElementById('invite-qr-code') as HTMLCanvasElement
    if (!canvas) return
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
    const downloadLink = document.createElement('a')
    downloadLink.href = pngUrl
    downloadLink.download = `invite-qr-${inviteCode}.png`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-surface border border-white/10 rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center pt-2">
          <h2 className="text-2xl font-bold text-on-surface mb-2">Invite Students</h2>
          <p className="text-sm text-on-surface-variant mb-6">
            Share this code or QR code with your students so they can join the classroom.
          </p>

          <div className="p-4 bg-white rounded-xl mb-4 shadow-lg shadow-secondary/10 relative group">
            <QRCodeCanvas 
              id="invite-qr-code"
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
              {inviteCode}
            </div>
          </div>

          <div className="w-full flex items-center gap-2 bg-surface-container-low p-2 rounded-lg border border-white/5">
            <LinkIcon size={16} className="text-on-surface-variant ml-2" />
            <input 
              type="text" 
              readOnly 
              value={inviteLink}
              className="flex-1 bg-transparent border-none text-xs text-on-surface focus:ring-0 truncate outline-none"
            />
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1 bg-secondary/10 hover:bg-secondary/20 text-secondary px-3 py-1.5 rounded-md text-xs font-bold transition-colors"
            >
              {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
