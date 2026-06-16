'use client'

import { useState } from 'react'
import { School, CheckCircle, Terminal, Rocket, Palette, BrainCircuit, MessageSquare } from 'lucide-react'
import { submitSkillRatingsAction } from '@/app/actions/skills'

export default function OnboardingClient({ classroomId, classroomName, skills }: any) {
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    if (skills) {
      skills.forEach((s: any) => initial[s.id] = 3)
    }
    return initial
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const handleSliderChange = (skillId: string, value: number) => {
    setRatings(prev => ({ ...prev, [skillId]: value }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    const formattedRatings = skills.map((s: any) => ({
      skill_id: s.id,
      rating: ratings[s.id] || 3
    }))

    const result = await submitSkillRatingsAction(classroomId, formattedRatings)
    
    if (result.success) {
      setIsDone(true)
      setTimeout(() => {
        window.location.href = `/classroom/${classroomId}`
      }, 1000)
    } else {
      setIsSubmitting(false)
      alert(result.error)
    }
  }

  const allRated = skills.every((s: any) => ratings[s.id] !== undefined)
  const ratedCount = Object.keys(ratings).length

  // Icons map
  const getIcon = (name: string) => {
    const l = name.toLowerCase()
    if (l.includes('design') || l.includes('ui')) return <Palette className="w-6 h-6" />
    if (l.includes('code') || l.includes('python') || l.includes('algo') || l.includes('dev')) return <Terminal className="w-6 h-6" />
    if (l.includes('data') || l.includes('brain') || l.includes('math')) return <BrainCircuit className="w-6 h-6" />
    return <MessageSquare className="w-6 h-6" />
  }

  return (
    <main className="w-full max-w-4xl mx-auto z-10 p-6 md:p-12 min-h-screen flex flex-col justify-center animate-in fade-in duration-500">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <School className="text-primary w-8 h-8" />
          <h1 className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Trippy Tropa</h1>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2 tracking-tight">Welcome to {classroomName}</h2>
        <p className="text-base text-muted-foreground font-medium max-w-xl mx-auto">
          Let's assess your skills to help us match you with the perfect project group and tailor your learning experience.
        </p>
      </header>

      <section className="bg-surface/70 backdrop-blur-xl border border-white/10 rounded-xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Progress Indicator removed per user request */}

        <div className="space-y-6">
          {skills.map((skill: any) => (
            <div key={skill.id} className="border border-border bg-card/50 p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    {getIcon(skill.name)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{skill.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium">Weight Multiplier: ×{skill.multiplier}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-input px-4 py-2 rounded-full border border-border shadow-inner">
                  <span className="text-secondary font-black text-sm tracking-widest">LVL</span>
                  <span className="text-2xl font-black text-foreground">{ratings[skill.id] || 3}</span>
                </div>
              </div>

              <div className="px-2">
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={ratings[skill.id] || 3} 
                  onChange={(e) => handleSliderChange(skill.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                  style={{ accentColor: 'var(--primary)' }}
                />
                <div className="flex justify-between mt-3 text-xs text-foreground px-1 font-bold tracking-wide uppercase">
                  <span>Novice</span>
                  <span>Expert</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Action */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
          <p className="text-sm text-on-surface-variant font-semibold">
            {ratedCount} of {skills.length} skills rated
          </p>
          <button 
            onClick={handleSubmit}
            disabled={!allRated || isSubmitting || isDone}
            className={`px-8 py-3 rounded-lg text-xl font-semibold shadow-lg transition-all duration-300 flex items-center gap-3
              ${(!allRated) ? 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed' : 
                isDone ? 'bg-secondary-container text-on-secondary-container' :
                'bg-gradient-to-r from-primary-container to-secondary text-on-primary hover:scale-105 active:scale-95'}`}
          >
            {isDone ? (
               <>Done! <CheckCircle className="w-5 h-5" /></>
            ) : isSubmitting ? (
               'Processing...'
            ) : (
               <>Submit Assessment <Rocket className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </section>
    </main>
  )
}
