/* eslint-disable @next/next/no-img-element */
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { teamMembers } from "@/data";
import { AtSign, Link2, Target, Eye, Award, Users, TrendingUp, Home } from "lucide-react";

const timeline = [
  { year: "2009", title: "Founded in Manhattan", desc: "Alexander Verdant opens a boutique office on Park Avenue with a team of three, focused exclusively on luxury residential." },
  { year: "2013", title: "West Coast Expansion", desc: "The Malibu and Beverly Hills offices open, bringing Verdant's bespoke model to California's ultra-prime market." },
  { year: "2016", title: "$5B Milestone", desc: "Verdant surpasses $5 billion in cumulative transaction value. Ranked #3 luxury firm in the Northeast." },
  { year: "2019", title: "Award-Winning Year", desc: "Named #1 Luxury Real Estate Firm by Residential Excellence Awards. The team grows to 45 agents across 6 offices." },
  { year: "2022", title: "Digital Innovation", desc: "Launch of the Verdant platform, bringing curated listings and white-glove service to a digital-first generation." },
  { year: "2024", title: "National Presence", desc: "12 offices across 8 states. Over $18B in total transactions. Still the same personal touch as day one." },
];

const stats = [
  { icon: Home, value: "2,400+", label: "Properties Listed" },
  { icon: Users, value: "14,000+", label: "Satisfied Clients" },
  { icon: TrendingUp, value: "$18B+", label: "Transaction Volume" },
  { icon: Award, value: "5×", label: "Best Luxury Firm Award" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="relative pt-20 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1800&h=900&fit=crop"
            alt="About"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
            <span className="text-slate-400">Home</span>
            <span className="text-slate-600">/</span>
            <span className="text-white">About Us</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-white mb-5 max-w-2xl leading-tight">
            A Different Kind of Real Estate Firm
          </h1>
          <p className="text-slate-300 text-xl max-w-xl leading-relaxed">
            Built on the belief that every great property deserves an equally great story — and every client deserves to be heard.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-6 h-0.5 bg-emerald-500" />
                <span className="text-emerald-600 text-xs font-semibold tracking-widest uppercase">Our Story</span>
              </div>
              <h2 className="font-display text-4xl font-bold text-slate-900 mb-6">
                Fifteen Years of Getting It Right
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Verdant Realty was founded in 2009 with a simple frustration: that luxury property transactions were being handled like commodity sales. Alexander Verdant, then a senior partner at a global firm, believed clients at this level deserved something fundamentally different — not a bigger brochure, but a deeper conversation.
                </p>
                <p>
                  Starting with three agents and a single Park Avenue office, Verdant built a reputation for listening first, then finding. Not the opposite. That philosophy attracted a clientele who&apos;d been disappointed elsewhere and weren&apos;t willing to settle — in life or in their homes.
                </p>
                <p>
                  Fifteen years later, with $18B in transactions across 12 offices, the firm has never drifted from that founding conviction. Every agent at Verdant could tell you, off the top of their head, what their last client truly wanted. Because we still ask.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=700&fit=crop" alt="Office" className="rounded-2xl object-cover w-full h-56 sm:h-64" />
              <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=500&fit=crop" alt="Team" className="rounded-2xl object-cover w-full h-40 sm:h-48 mt-10" />
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=500&fit=crop" alt="Agent" className="rounded-2xl object-cover w-full h-40 sm:h-48 col-span-2" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision + Mission */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-card">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-5">
                <Eye size={24} className="text-emerald-600" />
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed">
                To be the most trusted name in luxury real estate — not the largest, not the loudest, but the one clients recommend without hesitation because we changed how they think about what&apos;s possible.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-card">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-5">
                <Target size={24} className="text-emerald-600" />
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed">
                To connect exceptional people with exceptional properties through a process that is personal, transparent, and worthy of the decision being made. Every client, every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center mx-auto mb-3">
                  <stat.icon size={22} className="text-white" />
                </div>
                <div className="font-display text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-emerald-200 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2.5 mb-3">
              <div className="w-6 h-0.5 bg-emerald-500" />
              <span className="text-emerald-600 text-xs font-semibold tracking-widest uppercase">Our People</span>
              <div className="w-6 h-0.5 bg-emerald-500" />
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-4">Meet the Team</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              The individuals behind every Verdant transaction — knowledgeable, principled, and genuinely invested in your outcome.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div key={member.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-card-hover transition-all duration-300">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 text-base">{member.name}</h3>
                  <div className="text-emerald-600 text-sm font-medium mb-3">{member.role}</div>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{member.bio}</p>
                  <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} className="text-slate-400 hover:text-blue-600 transition-colors">
                        <Link2 size={16} />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a href={member.social.twitter} className="text-slate-400 hover:text-sky-500 transition-colors">
                        <AtSign size={16} />
                      </a>
                    )}
                    {member.social.instagram && (
                      <a href={member.social.instagram} className="text-slate-400 hover:text-pink-600 transition-colors">
                        <AtSign size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2.5 mb-3">
              <div className="w-6 h-0.5 bg-emerald-500" />
              <span className="text-emerald-600 text-xs font-semibold tracking-widest uppercase">Our Journey</span>
              <div className="w-6 h-0.5 bg-emerald-500" />
            </div>
            <h2 className="font-display text-4xl font-bold text-slate-900">Fifteen Years, One Standard</h2>
          </div>

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-0.5 bg-slate-200 hidden md:block" />

            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={item.year} className={`md:flex items-center gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-card transition-all">
                      <div className="text-emerald-600 font-bold text-lg mb-1">{item.year}</div>
                      <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  {/* Dot */}
                  <div className="hidden md:flex w-4 h-4 rounded-full bg-emerald-600 border-4 border-emerald-100 flex-shrink-0 z-10" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
