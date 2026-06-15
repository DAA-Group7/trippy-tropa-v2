'use client'

import { useState } from 'react'
import { Plus, Users, Terminal, Palette, BrainCircuit } from 'lucide-react'
import { CreateClassroomModal } from '@/components/classroom/CreateClassroomModal'
import Link from 'next/link'

export default function TeacherDashboard({ classrooms, profile }: { classrooms: any[], profile: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Use some alternating icons based on classroom index for visual flavor
  const icons = [Terminal, Palette, BrainCircuit, Users]
  const colors = ['text-primary', 'text-tertiary', 'text-secondary', 'text-error']
  const bgColors = ['bg-primary/10', 'bg-tertiary/10', 'bg-secondary/10', 'bg-error/10']

  return (
    <div className="min-h-full p-6 md:p-8 max-w-6xl mx-auto">
      {/* HEADER SECTION WITH ACTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h3 className="text-3xl sm:text-4xl font-bold mb-1 tracking-tight text-[#e5e0ed]">Welcome, {profile?.full_name?.split(' ')[0] || 'Teacher'}</h3>
          <p className="text-[14px] sm:text-[15px] text-[rgba(200,196,215,0.6)] max-w-xl opacity-80">
            Oversee your current sessions and active classrooms at a glance.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#c6bfff] hover:brightness-110 text-[#13121b] font-bold px-6 py-2.5 rounded-lg shadow-[0_0_20px_rgba(198,191,255,0.15)] flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span className="text-[12px] font-bold uppercase tracking-widest">New Classroom</span>
        </button>
      </div>

      {classrooms.length === 0 ? (
        <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center border-dashed border-2 border-white/10 mt-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No classrooms yet</h3>
          <p className="text-white/60 max-w-sm mb-6">Create your first classroom to invite students and start running smart grouping algorithms.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="relative group bg-surface-container hover:bg-surface-container-high border border-primary/30 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <div className="absolute inset-0 bg-primary/30 blur-xl opacity-50 group-hover:opacity-100 transition-opacity animate-pulse rounded-lg" />
            <span className="relative z-10 text-primary font-bold">Create Your First Classroom</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {classrooms.map((c, i) => {
            const Icon = icons[i % icons.length]
            const colorClass = colors[i % colors.length]
            const bgColorClass = bgColors[i % bgColors.length]
            
            return (
              <Link href={`/classroom/${c.id}`} key={c.id}>
                <div className="glass-card p-6 rounded-xl flex flex-col justify-between group h-full cursor-pointer hover:-translate-y-1 transition-transform">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-10 h-10 rounded-lg ${bgColorClass} ${colorClass} flex items-center justify-center`}>
                        <Icon size={22} />
                      </div>
                      <span className="bg-[#46eae5]/10 text-[#46eae5] border border-[#46eae5]/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide">
                        Active
                      </span>
                    </div>
                    <h4 className="text-[20px] font-semibold leading-7 mb-1 group-hover:text-primary transition-colors truncate">
                      {c.name}
                    </h4>
                    <p className="text-[13px] text-on-surface-variant mb-4 line-clamp-2 opacity-70">
                      {c.description || 'No description provided.'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <div className="flex -space-x-1.5">
                      <div className="w-7 h-7 rounded-full border-2 border-[rgba(18,18,42,0.7)] bg-[rgba(18,18,42,0.4)] flex items-center justify-center text-[9px] font-bold text-[#e5e0ed]">
                        +{c.studentCount}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[rgba(200,196,215,0.6)] font-semibold uppercase leading-none">Students</p>
                      <p className={`text-xl font-semibold ${colorClass}`}>{c.studentCount}</p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <CreateClassroomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
