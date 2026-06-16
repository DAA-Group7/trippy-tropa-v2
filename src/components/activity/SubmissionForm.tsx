'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, X, Download, Terminal, Link as LinkIcon, FileText, Image as ImageIcon, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { submitWorkAction } from '@/app/actions/submissions'

export function SubmissionForm({ activityId, groupId, existingSubmission, isLate, onSubmitted }: any) {
  const [text, setText] = useState(existingSubmission?.content_text || '')
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<{ name: string, size: string, type: string, url: string } | null>(
    existingSubmission?.file_url ? {
      name: existingSubmission.file_name,
      size: '', // Server doesn't send size
      type: existingSubmission.file_name?.split('.').pop() || '',
      url: existingSubmission.file_url
    } : null
  )
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  const handleFile = (newFile: File) => {
    if (newFile.size > 50 * 1024 * 1024) {
      setError('File must be less than 50MB')
      return
    }
    setFile(newFile)
    setFilePreview({
      name: newFile.name,
      size: (newFile.size / (1024 * 1024)).toFixed(1) + ' MB',
      type: newFile.name.split('.').pop() || '',
      url: URL.createObjectURL(newFile)
    })
    setError('')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    if (!existingSubmission?.file_url) {
      setFilePreview(null)
    } else {
      // Revert to existing
      setFilePreview({
        name: existingSubmission.file_name,
        size: '',
        type: existingSubmission.file_name?.split('.').pop() || '',
        url: existingSubmission.file_url
      })
    }
  }

  const getFileIcon = (ext: string) => {
    const e = ext.toLowerCase()
    if (['pdf', 'doc', 'docx'].includes(e)) return <FileText className="w-5 h-5 text-secondary" />
    if (['png', 'jpg', 'jpeg', 'gif'].includes(e)) return <ImageIcon className="w-5 h-5 text-secondary" />
    if (['ipynb', 'py', 'js', 'ts'].includes(e)) return <Terminal className="w-5 h-5 text-secondary" />
    return <FileText className="w-5 h-5 text-secondary" />
  }

  const handleSubmit = async () => {
    setIsUploading(true)
    setError('')

    try {
      let finalFileUrl = existingSubmission?.file_url
      let finalFileName = existingSubmission?.file_name

      if (file) {
        const fileExt = file.name.split('.').pop()
        const uniquePath = `${activityId}/${groupId || 'ind'}_${Date.now()}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('submissions')
          .upload(uniquePath, file, {
            upsert: true
          })

        if (uploadError) throw new Error(uploadError.message)

        const { data: { publicUrl } } = supabase.storage.from('submissions').getPublicUrl(uploadData.path)
        finalFileUrl = publicUrl
        finalFileName = file.name
      }

      const result = await submitWorkAction(activityId, {
        contentText: text,
        fileUrl: finalFileUrl,
        fileName: finalFileName,
        groupId: groupId
      })

      if (result.error) throw new Error(result.error)
      
      onSubmitted?.()
      
      // Optionally reset state or show success toast
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Text Editor Area */}
      <div>
        <label className="block text-xs font-semibold tracking-widest text-on-surface-variant mb-2 uppercase">
          Additional Notes or Links
        </label>
        <textarea 
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full bg-surface-container-lowest/80 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 min-h-[120px] transition-all resize-none"
          placeholder="Paste your GitHub link or add any comments for the instructor..."
        />
      </div>

      {/* Drag & Drop Zone */}
      {!filePreview || (filePreview && !file) && (
        <div className="relative">
          <div 
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={e => { e.preventDefault(); setIsDragging(false) }}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group ${
              isDragging ? 'bg-primary/10 border-primary' : 'border-border bg-surface-container-lowest/30 hover:bg-primary/5 hover:border-primary/40'
            }`}
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <p className="text-base font-semibold mb-1">Drag and drop files here</p>
            <p className="text-sm text-on-surface-variant opacity-60">or click to browse from computer (Max 50MB)</p>
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>
        </div>
      )}

      {/* File Preview */}
      {filePreview && (
        <div className="flex items-center justify-between p-4 bg-surface-container/70 backdrop-blur-md rounded-xl border-l-4 border-secondary shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-secondary/10 rounded flex items-center justify-center">
              {getFileIcon(filePreview.type)}
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface truncate max-w-[200px] sm:max-w-[300px]">
                {filePreview.name}
              </p>
              <p className="text-xs font-semibold text-on-surface-variant opacity-60 uppercase tracking-wider mt-0.5">
                {filePreview.size ? `${filePreview.size} • ` : ''}{filePreview.type.toUpperCase()} FILE
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {filePreview.url && !file && (
              <a 
                href={filePreview.url} 
                target="_blank" 
                rel="noreferrer"
                className="p-2 hover:bg-accent rounded-full text-on-surface-variant transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </a>
            )}
            <button 
              onClick={handleRemoveFile}
              className="p-2 hover:bg-error/10 rounded-full text-error transition-colors"
              title="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-error/10 border border-error/30 rounded-lg text-error text-sm font-semibold">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4 pt-4">
        <button 
          onClick={handleSubmit}
          disabled={isUploading}
          className="flex-1 py-3 px-8 bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-container font-bold rounded-lg shadow-[0_0_20px_rgba(108,92,231,0.3)] hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
        >
          {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {existingSubmission ? 'Update Submission' : 'Submit Work'}
        </button>
      </div>
    </div>
  )
}
