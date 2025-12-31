'use client'

import { useActionState } from 'react' // Updated hook for Next.js 15 (was useFormState)
import { authenticate } from './actions'
import { ShieldCheck, AlertCircle, Loader2 } from "lucide-react"
import { useFormStatus } from 'react-dom'

export default function LoginPage() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined)

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-white overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-blue-50/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-50/50 rounded-full blur-[120px] pointer-events-none" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/60 backdrop-blur-xl border border-white/50 shadow-2xl shadow-gray-200/50 rounded-[2.5rem] p-10">
        
        <div className="text-center mb-10">
           <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/20">
              <ShieldCheck size={32} />
           </div>
           <h1 className="text-3xl font-extrabold text-black tracking-tight">Admin Access</h1>
           <p className="text-gray-500 font-medium mt-2">Trusted Wheels Management OS</p>
        </div>

        <form action={dispatch} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest ml-1">Email</label>
            <input 
              name="email" 
              type="email" 
              required 
              placeholder="admin@trustedwheels.com"
              className="w-full bg-white border-2 border-gray-200 rounded-xl p-4 text-black font-bold placeholder-gray-300 outline-none focus:border-black focus:ring-0 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest ml-1">Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••"
              className="w-full bg-white border-2 border-gray-200 rounded-xl p-4 text-black font-bold placeholder-gray-300 outline-none focus:border-black focus:ring-0 transition-all"
            />
          </div>

          {/* Error Message Display */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-bold border border-red-100">
              <AlertCircle size={16} />
              <p>{errorMessage}</p>
            </div>
          )}

          <LoginButton />
        </form>

      </div>
    </div>
  )
}

function LoginButton() {
  const { pending } = useFormStatus()
  
  return (
    <button 
      disabled={pending}
      className="w-full bg-black text-white font-bold rounded-xl py-4 hover:bg-gray-900 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? <Loader2 className="animate-spin" /> : "Secure Login"}
    </button>
  )
}