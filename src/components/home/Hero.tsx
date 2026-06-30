/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, ChevronDown } from "lucide-react";

const heroImages = [
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1800&h=1000&fit=crop",
];

const stats = [
  { value: "2,400+", label: "Properties Listed" },
  { value: "$18B+", label: "Transaction Value" },
  { value: "14K+", label: "Happy Clients" },
  { value: "98%", label: "Client Satisfaction" },
];

const propertyTypes = ["All Types", "Villa", "Apartment", "House", "Penthouse", "Studio", "Townhouse"];

export default function Hero() {
  const [activeImage, setActiveImage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("All Types");
  const [status, setStatus] = useState("For Sale");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Background Images */}
      {heroImages.map((img, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1500"
          style={{ opacity: i === activeImage ? 1 : 0 }}
        >
          <img
            src={img}
            alt="Luxury property"
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="max-w-7xl mx-auto w-full">
          {/* Eyebrow */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-0.5 bg-emerald-400" />
            <span className="text-emerald-400 text-sm font-semibold tracking-widest uppercase">
              Trusted Luxury Realty
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] mb-6 max-w-4xl">
            Find Your
            <span className="block italic text-emerald-300">Perfect Home</span>
          </h1>

          <p className="text-white/70 text-lg sm:text-xl max-w-xl mb-12 leading-relaxed">
            Discover extraordinary properties in the country&apos;s most sought-after markets — curated by people who believe your home should be the finest chapter of your story.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-2 max-w-4xl">
            {/* Tab Bar */}
            <div className="flex mb-3 px-1 pt-1">
              {["For Sale", "For Rent"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    status === s
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              {/* Location input */}
              <div className="flex items-center gap-3 flex-1 px-4 py-3 border border-slate-200 rounded-xl hover:border-emerald-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <MapPin size={18} className="text-emerald-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="City, neighborhood, address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-sm text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
                />
              </div>

              {/* Property Type */}
              <div className="relative">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="appearance-none px-4 py-3 pr-9 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none hover:border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white cursor-pointer min-w-[140px]"
                >
                  {propertyTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Search Button */}
              <Link
                href={`/properties?q=${searchQuery}&type=${propertyType}&status=${status}`}
                className="flex items-center justify-center gap-2 px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-emerald-600/30 whitespace-nowrap"
              >
                <Search size={16} />
                Search
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mt-14 max-w-2xl">
            {stats.map((stat, i) => (
              <div key={i} className="text-center sm:text-left">
                <div className="text-3xl sm:text-4xl font-display font-bold text-white">{stat.value}</div>
                <div className="text-white/55 text-xs sm:text-sm mt-0.5 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveImage(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeImage ? "w-8 bg-emerald-400" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 z-10">
        <span className="text-white/40 text-xs tracking-widest uppercase rotate-90 origin-center">Scroll</span>
      </div>
    </section>
  );
}

