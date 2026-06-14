'use client'

import { useActionState, useState, Suspense } from 'react'
import { signUpAction } from '@/app/actions/auth'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { School, UserSquare2, User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUpAction, null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const searchParams = useSearchParams()
  const nextParam = searchParams.get('next')

  return (
    <div className="glass-card p-8 rounded-xl shadow-2xl flex flex-col gap-6 animate-in fade-in zoom-in duration-700">
      {/* Header Section */}
      <header className="text-center flex flex-col gap-2">
        <div className="inline-flex items-center justify-center self-center mb-2">
          <span className="font-sans text-2xl font-bold bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
            Trippy Tropa
          </span>
          <span className="ml-2 text-xs text-white/60">v2.0 Beta</span>
        </div>
        <h1 className="text-3xl font-semibold text-white">Create an account</h1>
        <p className="text-white/70">Join the next generation of smart classrooms.</p>
      </header>

      {state?.error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
          {state.error}
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-6">
        {nextParam && <input type="hidden" name="next" value={nextParam} />}
        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-4">
          <label className="cursor-pointer relative group">
            <input className="sr-only peer" name="role" type="radio" value="student" defaultChecked />
            <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-white/10 bg-white/5 peer-checked:border-[#c6bfff] peer-checked:bg-[#6c5ce7]/20 transition-all duration-300">
              <School className="w-8 h-8 mb-2 peer-checked:text-[#c6bfff]" />
              <span className="text-xs uppercase tracking-widest font-semibold peer-checked:text-[#c6bfff]">I'm a Student</span>
            </div>
          </label>
          <label className="cursor-pointer relative group">
            <input className="sr-only peer" name="role" type="radio" value="teacher" />
            <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-white/10 bg-white/5 peer-checked:border-[#c6bfff] peer-checked:bg-[#6c5ce7]/20 transition-all duration-300">
              <UserSquare2 className="w-8 h-8 mb-2 peer-checked:text-[#c6bfff]" />
              <span className="text-xs uppercase tracking-widest font-semibold peer-checked:text-[#c6bfff]">I'm a Teacher</span>
            </div>
          </label>
        </div>

        {/* Input Fields */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-white/60 ml-1" htmlFor="fullname">FULL NAME</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5 group-focus-within:text-[#46eae5] transition-colors" />
              <input 
                className="w-full bg-[#050510] border border-white/10 rounded-lg py-2 pl-12 pr-4 text-white focus:outline-none focus:ring-0 focus:border-[#46eae5] input-glow transition-all" 
                id="fullname" 
                name="fullname"
                placeholder="Enter your full name" 
                type="text" 
                required 
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-white/60 ml-1" htmlFor="email">EMAIL ADDRESS</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5 group-focus-within:text-[#46eae5] transition-colors" />
              <input 
                className="w-full bg-[#050510] border border-white/10 rounded-lg py-2 pl-12 pr-4 text-white focus:outline-none focus:ring-0 focus:border-[#46eae5] input-glow transition-all" 
                id="email" 
                name="email"
                placeholder="name@example.com" 
                type="email" 
                required 
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 relative">
            <label className="text-xs font-semibold text-white/60 ml-1" htmlFor="password">PASSWORD</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5 group-focus-within:text-[#46eae5] transition-colors" />
              <input 
                className="w-full bg-[#050510] border border-white/10 rounded-lg py-2 pl-12 pr-12 text-white focus:outline-none focus:ring-0 focus:border-[#46eae5] input-glow transition-all" 
                id="password" 
                name="password"
                placeholder="••••••••" 
                type={showPassword ? 'text' : 'password'} 
                required 
                minLength={6}
              />
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors" 
                onClick={() => setShowPassword(!showPassword)} 
                type="button"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1 relative">
            <label className="text-xs font-semibold text-white/60 ml-1" htmlFor="confirm_password">CONFIRM PASSWORD</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5 group-focus-within:text-[#46eae5] transition-colors" />
              <input 
                className="w-full bg-[#050510] border border-white/10 rounded-lg py-2 pl-12 pr-12 text-white focus:outline-none focus:ring-0 focus:border-[#46eae5] input-glow transition-all" 
                id="confirm_password" 
                name="confirm_password"
                placeholder="••••••••" 
                type={showConfirmPassword ? 'text' : 'password'} 
                required 
                minLength={6}
              />
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                type="button"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col gap-4 mt-2">
          <button 
            disabled={isPending}
            className="primary-gradient w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70" 
            type="submit"
          >
            <span>{isPending ? 'Signing Up...' : 'Sign Up'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-center text-sm text-white/60">
            Already have an account?{' '}
            <Link className="text-[#46eae5] font-bold hover:underline decoration-[#46eae5]/30" href="/login">
              Log In
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>}>
      <SignUpForm />
    </Suspense>
  )
}
