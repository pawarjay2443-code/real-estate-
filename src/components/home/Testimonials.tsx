/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/data";

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((a) => (a + 1) % testimonials.length);

  return (
    <section className="py-24 bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div className="w-6 h-0.5 bg-emerald-400" />
            <span className="text-emerald-400 text-xs font-semibold tracking-widest uppercase">Client Stories</span>
            <div className="w-6 h-0.5 bg-emerald-400" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            What Our Clients Say
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Large Quote */}
          <div className="relative">
            <Quote size={80} className="text-emerald-900 absolute -top-4 -left-4 opacity-50" />
            <div className="relative z-10">
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[active].rating)].map((_, i) => (
                  <Star key={i} size={18} className="text-amber-400" fill="currentColor" />
                ))}
              </div>
              <blockquote
                key={active}
                className="font-display text-2xl sm:text-3xl text-white leading-relaxed mb-8"
                style={{ animation: "fadeIn 0.4s ease-out" }}
              >
                &quot;{testimonials[active].comment}&quot;
              </blockquote>
              <div className="flex items-center gap-4">
                <img
                  src={testimonials[active].photo}
                  alt={testimonials[active].name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500"
                />
                <div>
                  <div className="text-white font-semibold">{testimonials[active].name}</div>
                  <div className="text-slate-400 text-sm">{testimonials[active].role}</div>
                  <div className="text-emerald-400 text-xs mt-0.5">Re: {testimonials[active].property}</div>
                </div>
              </div>
            </div>

            {/* Nav */}
            <div className="flex gap-3 mt-10">
              <button
                onClick={prev}
                className="w-11 h-11 rounded-full border border-slate-700 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="w-11 h-11 rounded-full border border-slate-700 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition-all"
              >
                <ChevronRight size={18} />
              </button>
              <div className="flex items-center gap-2 ml-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-emerald-400" : "w-2 bg-slate-700"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Cards stack */}
          <div className="grid grid-cols-1 gap-4 hidden lg:grid">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActive(i)}
                className={`text-left p-5 rounded-2xl border transition-all duration-300 ${
                  i === active
                    ? "border-emerald-500 bg-emerald-950/50"
                    : "border-slate-800 bg-slate-800/50 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-white font-medium text-sm">{t.name}</div>
                    <div className="text-slate-500 text-xs">{t.role}</div>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={12} className="text-amber-400" fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-400 text-sm line-clamp-2">{t.comment}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

