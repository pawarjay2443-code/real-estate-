/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data";

export default function Categories() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div className="w-6 h-0.5 bg-emerald-500" />
            <span className="text-emerald-600 text-xs font-semibold tracking-widest uppercase">Browse By Category</span>
            <div className="w-6 h-0.5 bg-emerald-500" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Find What Fits Your Life
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            From intimate studios to sprawling estates — every lifestyle finds its home.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={`/properties?type=${cat.label.split(" ").pop()}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h3 className="font-display text-xl font-bold text-white mb-1">{cat.label}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">{cat.count} properties</span>
                  <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-emerald-500 flex items-center justify-center transition-colors duration-300">
                    <ArrowRight size={14} className="text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
