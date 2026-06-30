"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Home, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [tab, setTab] = useState<"login"|"register">("login");
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-8 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
            <Home size={20} className="text-white" />
          </div>
          <div>
            <span className="font-display text-2xl font-semibold text-white">Verdant</span>
            <span className="text-xs font-medium tracking-widest block leading-none text-slate-500">REALTY</span>
          </div>
        </Link>
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex border-b border-slate-100">
            {(["login","register"] as const).map(t=>(
              <button key={t} onClick={()=>setTab(t)} className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors ${tab===t?"text-emerald-700 border-b-2 border-emerald-600":"text-slate-500 hover:text-slate-700"}`}>
                {t==="login"?"Sign In":"Create Account"}
              </button>
            ))}
          </div>
          <div className="p-8">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">{tab==="login"?"Welcome back":"Join Verdant"}</h2>
            <p className="text-slate-500 text-sm mb-7">{tab==="login"?"Sign in to your account to continue":"Create your account to get started"}</p>
            {/* Social */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[{label:"Google",emoji:"🔵"},{label:"Apple",emoji:"⚫"}].map(s=>(
                <button key={s.label} className="flex items-center justify-center gap-2 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all">
                  <span>{s.emoji}</span>{s.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-slate-200"/><span className="text-slate-400 text-xs">or continue with email</span><div className="flex-1 h-px bg-slate-200"/>
            </div>
            <div className="space-y-4">
              {tab==="register" && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Full Name</label>
                  <input placeholder="Your full name" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" />
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Password</label>
                  {tab==="login" && <Link href="#" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">Forgot password?</Link>}
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type={show?"text":"password"} placeholder="••••••••" className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" />
                  <button onClick={()=>setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {show?<EyeOff size={16}/>:<Eye size={16}/>}
                  </button>
                </div>
              </div>
              {tab==="login" && (
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 accent-emerald-600" />
                  <span className="text-sm text-slate-600">Remember me for 30 days</span>
                </label>
              )}
              {tab==="register" && (
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 accent-emerald-600 mt-0.5" />
                  <span className="text-sm text-slate-600">I agree to the <a href="#" className="text-emerald-600 hover:underline">Terms of Service</a> and <a href="#" className="text-emerald-600 hover:underline">Privacy Policy</a></span>
                </label>
              )}
              <Link href="/" className="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95 mt-2">
                {tab==="login"?"Sign In":"Create Account"} <ArrowRight size={16}/>
              </Link>
            </div>
            <p className="text-center text-sm text-slate-500 mt-6">
              {tab==="login"?"Don't have an account? ":"Already have an account? "}
              <button onClick={()=>setTab(tab==="login"?"register":"login")} className="text-emerald-600 font-semibold hover:text-emerald-700">
                {tab==="login"?"Sign up":"Sign in"}
              </button>
            </p>
          </div>
        </div>
        <p className="text-center text-slate-600 text-xs mt-6">Protected by 256-bit SSL encryption</p>
      </div>
    </div>
  );
}
