"use client";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { faqs } from "@/data";
import { MapPin, Phone, Mail, Clock, ChevronDown, ChevronUp, Send } from "lucide-react";

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number|null>(null);
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-sm text-slate-500 mb-4">Home / <span className="text-white">Contact</span></div>
          <h1 className="font-display text-5xl font-bold text-white mb-3">Get In Touch</h1>
          <p className="text-slate-400 text-lg">A real person will respond within one business day.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-card border border-slate-100">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">Send Us a Message</h2>
            {sent ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-500">We will get back to you within one business day.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {["First Name","Last Name"].map(p=>(
                    <div key={p}>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">{p}</label>
                      <input placeholder={p} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Email</label>
                  <input type="email" placeholder="you@example.com" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Phone</label>
                  <input placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Interested In</label>
                  <select className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-white">
                    {["Buying a property","Renting a property","Selling my property","General inquiry"].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Message</label>
                  <textarea rows={5} placeholder="Tell us about your needs..." className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none transition-all" />
                </div>
                <button onClick={()=>setSent(true)} className="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-600/20">
                  <Send size={16} /> Send Message
                </button>
              </div>
            )}
          </div>
          <div className="space-y-5">
            {[{icon:MapPin,title:"Visit Us",lines:["420 Park Avenue, Suite 900","New York, NY 10022"]},{icon:Phone,title:"Call Us",lines:["+1 (800) 555-8376","Mon–Fri 9am–7pm EST"]},{icon:Mail,title:"Email Us",lines:["hello@verdantrealty.com","Response within 24 hours"]},{icon:Clock,title:"Office Hours",lines:["Mon–Fri: 9:00am – 7:00pm","Sat–Sun: 10:00am – 4:00pm"]}].map(({icon:Icon,title,lines})=>(
              <div key={title} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm mb-1">{title}</div>
                  {lines.map(l=><div key={l} className="text-slate-500 text-sm">{l}</div>)}
                </div>
              </div>
            ))}
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl h-48 flex items-center justify-center border border-slate-200">
              <div className="text-center">
                <MapPin size={28} className="text-emerald-500 mx-auto mb-2" />
                <div className="text-slate-600 font-medium text-sm">420 Park Avenue</div>
                <div className="text-slate-400 text-xs">New York, NY 10022</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq,i)=>(
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <button onClick={()=>setOpenFaq(openFaq===i?null:i)} className="w-full flex items-center justify-between px-6 py-4 text-left text-slate-900 font-medium hover:bg-slate-50 transition-colors">
                  {faq.question}
                  {openFaq===i ? <ChevronUp size={18} className="text-emerald-500 flex-shrink-0"/>:<ChevronDown size={18} className="text-slate-400 flex-shrink-0"/>}
                </button>
                {openFaq===i && <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">{faq.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
