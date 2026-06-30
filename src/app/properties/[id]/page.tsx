/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MapPin, BedDouble, Bath, Maximize2, Phone, Mail, Heart, Share2,
  ChevronLeft, ChevronRight, X, Check, Car, Star
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/property/PropertyCard";
import { properties } from "@/data";

const amenityIcons: Record<string, React.ReactNode> = {
  "Swimming Pool": "🏊",
  "Home Theater": "🎬",
  "Wine Cellar": "🍷",
  "Smart Home": "📱",
  "Security System": "🔒",
  "Gym": "💪",
  "Sauna": "🧖",
  "Guest House": "🏠",
  "Concierge": "🛎️",
  "Rooftop Lounge": "🌆",
  "Private Gym": "🏋️",
  "Doorman": "👨‍💼",
  "Valet Parking": "🚗",
  "Spa": "💆",
  "Business Center": "💼",
  "Private Garden": "🌿",
  "Library": "📚",
  "Fireplace": "🔥",
  "Guest Barn": "🏚️",
  "Tennis Court": "🎾",
  "Workshop": "🔧",
  "Roof Deck": "🏙️",
  "Private Beach Access": "🏖️",
  "Pool": "🏊",
};

export default function PropertyDetailPage() {
  const params = useParams();
  const property = properties.find((p) => p.id === params.id);
  const [activeImage, setActiveImage] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [liked, setLiked] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Property Not Found</h2>
          <Link href="/properties" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const similar = properties.filter((p) => p.id !== property.id && p.type === property.type).slice(0, 3);
  const nextImg = () => setActiveImage((i) => (i + 1) % property.images.length);
  const prevImg = () => setActiveImage((i) => (i - 1 + property.images.length) % property.images.length);

  const statusStyle = {
    "For Sale": "bg-emerald-50 text-emerald-700 border border-emerald-200",
    "For Rent": "bg-blue-50 text-blue-700 border border-blue-200",
    "Sold": "bg-red-50 text-red-700 border border-red-200",
    "Under Contract": "bg-amber-50 text-amber-700 border border-amber-200",
  }[property.status];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button onClick={() => setLightbox(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">
            <X size={28} />
          </button>
          <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <img src={property.images[activeImage]} alt="" className="max-h-[85vh] max-w-full rounded-xl object-contain" />
          <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-6 flex gap-2">
            {property.images.map((_, i) => (
              <button key={i} onClick={() => setActiveImage(i)} className={`h-1.5 rounded-full transition-all ${i === activeImage ? "w-8 bg-white" : "w-2 bg-white/30"}`} />
            ))}
          </div>
        </div>
      )}

      <div className="pt-20">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-emerald-600 transition-colors">Properties</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">{property.title}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Title + Actions */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle}`}>{property.status}</span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{property.type}</span>
                {property.isNew && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">New</span>}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{property.title}</h1>
              <div className="flex items-center gap-1.5 text-slate-500">
                <MapPin size={15} className="text-emerald-500" />
                <span>{property.address}, {property.city}, {property.state} {property.zip}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-2 px-4 py-2.5 border-2 rounded-xl text-sm font-medium transition-all ${
                  liked ? "border-red-400 bg-red-50 text-red-600" : "border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-500"
                }`}
              >
                <Heart size={16} fill={liked ? "currentColor" : "none"} />
                Save
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:border-emerald-400 hover:text-emerald-600 transition-all">
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Gallery + Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="space-y-3">
                {/* Main Image */}
                <div className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group" onClick={() => setLightbox(true)}>
                  <img
                    src={property.images[activeImage]}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <button onClick={(e) => { e.stopPropagation(); prevImg(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100">
                    <ChevronLeft size={18} className="text-slate-700" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); nextImg(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100">
                    <ChevronRight size={18} className="text-slate-700" />
                  </button>
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 text-white text-xs rounded-lg">
                    {activeImage + 1} / {property.images.length}
                  </div>
                </div>
                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-2">
                  {property.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`aspect-video rounded-xl overflow-hidden transition-all ${i === activeImage ? "ring-2 ring-emerald-500 ring-offset-2" : "opacity-70 hover:opacity-100"}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: BedDouble, label: "Bedrooms", value: property.bedrooms > 0 ? property.bedrooms : "Studio" },
                  { icon: Bath, label: "Bathrooms", value: property.bathrooms },
                  { icon: Maximize2, label: "Area", value: `${property.area.toLocaleString()} sqft` },
                  { icon: Car, label: "Garages", value: property.garages },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl p-4 text-center border border-slate-100">
                    <stat.icon size={20} className="text-emerald-500 mx-auto mb-2" />
                    <div className="font-bold text-slate-900 text-lg">{stat.value}</div>
                    <div className="text-slate-500 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">About This Property</h2>
                <p className="text-slate-600 leading-relaxed">{property.description}</p>
                <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-slate-100">
                  {[
                    { l: "Property Type", v: property.type },
                    { l: "Status", v: property.status },
                    { l: "Year Built", v: property.yearBuilt },
                    { l: "Property ID", v: property.id.toUpperCase() },
                    { l: "City", v: property.city },
                    { l: "State", v: property.state },
                  ].map((item) => (
                    <div key={item.l}>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{item.l}</span>
                      <div className="text-slate-800 font-medium text-sm mt-0.5">{item.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Features & Details</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {property.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-emerald-600" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl text-center hover:bg-emerald-50 transition-colors group">
                      <span className="text-2xl mb-1">{amenityIcons[amenity] || "✓"}</span>
                      <span className="text-xs font-medium text-slate-600 group-hover:text-emerald-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Location</h2>
                <div className="relative h-64 rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={`https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${property.lng},${property.lat},13,0/800x400?access_token=pk.placeholder`}
                    alt="Map"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                        <MapPin size={24} className="text-emerald-600" />
                      </div>
                      <div className="font-semibold text-slate-700">{property.address}</div>
                      <div className="text-slate-500 text-sm">{property.city}, {property.state}</div>
                      <div className="text-xs text-slate-400 mt-1">Map view — {property.lat.toFixed(4)}°N, {Math.abs(property.lng).toFixed(4)}°W</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Price + Agent */}
            <div className="space-y-5">
              {/* Price Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card sticky top-24">
                <div className="text-3xl font-display font-bold text-slate-900 mb-1">{property.priceLabel}</div>
                {property.status === "For Rent" && <div className="text-slate-500 text-sm mb-5">per month</div>}
                <div className="text-slate-500 text-sm mb-5">{property.area.toLocaleString()} sqft · {property.type}</div>

                <div className="space-y-2.5 mb-5">
                  <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-600/20 active:scale-95">
                    Schedule a Viewing
                  </button>
                  <button className="w-full py-3 border-2 border-emerald-600 text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-colors active:scale-95">
                    Make an Offer
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="text-xs text-slate-400 text-center">No commitment required. Free consultation.</div>
                </div>
              </div>

              {/* Agent Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card">
                <h3 className="font-semibold text-slate-900 mb-4 text-sm">Listed By</h3>
                <div className="flex items-center gap-3 mb-4">
                  <img src={property.agent.photo} alt={property.agent.name} className="w-14 h-14 rounded-full object-cover border-2 border-emerald-100" />
                  <div>
                    <div className="font-semibold text-slate-900">{property.agent.name}</div>
                    <div className="text-slate-500 text-sm">{property.agent.agency}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={12} className="text-amber-400" fill="currentColor" />
                      <span className="text-xs text-slate-500">{property.agent.listings} listings · {property.agent.experience} yrs</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors group"
                  >
                    <Phone size={15} className="text-slate-400 group-hover:text-emerald-500" />
                    {property.agent.phone}
                  </a>
                  <a
                    href={`mailto:${property.agent.email}`}
                    className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors group"
                  >
                    <Mail size={15} className="text-slate-400 group-hover:text-emerald-500" />
                    {property.agent.email}
                  </a>
                </div>

                {/* Quick message */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <textarea
                    placeholder="I'm interested in this property..."
                    rows={3}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none transition-all"
                  />
                  <button className="mt-2 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors">
                    Send Message
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {property.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          {similar.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-3xl font-bold text-slate-900 mb-8">Similar Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {similar.map((p) => <PropertyCard key={p.id} property={p} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
