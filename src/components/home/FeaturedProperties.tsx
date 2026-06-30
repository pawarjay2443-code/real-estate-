"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import { properties } from "@/data";

const featured = properties.filter((p) => p.isFeatured);

export default function FeaturedProperties() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -380 : 380, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-6 h-0.5 bg-emerald-500" />
              <span className="text-emerald-600 text-xs font-semibold tracking-widest uppercase">Handpicked</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-900">
              Featured Properties
            </h2>
            <p className="text-slate-500 mt-3 max-w-md">
              Our editors&apos; selection of the finest homes on the market — each one extraordinary in its own way.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Cards */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {featured.map((property) => (
            <div key={property.id} className="flex-shrink-0 w-80 sm:w-96 snap-start">
              <PropertyCard property={property} featured />
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-10">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-emerald-600 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-600 hover:text-white transition-all group"
          >
            View All Properties
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
