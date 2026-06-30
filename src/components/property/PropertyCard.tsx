/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MapPin, BedDouble, Bath, Maximize2, ArrowRight, Star } from "lucide-react";
import { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
  featured?: boolean;
}

export default function PropertyCard({ property, featured = false }: PropertyCardProps) {
  const [liked, setLiked] = useState(false);

  const statusStyle = {
    "For Sale": "badge-sale",
    "For Rent": "badge-rent",
    "Sold": "badge-sold",
    "Under Contract": "badge-contract",
  }[property.status] || "badge-sale";

  return (
    <div
      className={`group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-400 ${
        featured ? "border-2 border-emerald-100" : "border border-slate-100"
      }`}
      style={{ transition: "box-shadow 0.3s ease, transform 0.3s ease" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] property-img-wrap">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status Badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${statusStyle}`}>
          {property.status}
        </div>

        {/* New Badge */}
        {property.isNew && (
          <div className="absolute top-3 left-24 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white">
            New
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => setLiked(!liked)}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 ${
            liked
              ? "bg-red-500 text-white shadow-lg"
              : "bg-white/80 text-slate-400 hover:bg-red-50 hover:text-red-500"
          }`}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
        </button>

        {/* Type tag */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="px-2.5 py-1 bg-white/90 text-slate-700 text-xs font-medium rounded-lg">
            {property.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Price */}
        <div className="flex items-start justify-between mb-2">
          <span className="text-2xl font-display font-bold text-slate-900">
            {property.priceLabel}
          </span>
          {featured && (
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={13} fill="currentColor" />
              <span className="text-xs font-medium text-slate-500">Featured</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-900 text-base mb-1.5 line-clamp-1 group-hover:text-emerald-700 transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-slate-500 mb-4">
          <MapPin size={13} className="flex-shrink-0 text-emerald-500" />
          <span className="text-sm truncate">{property.address}, {property.city}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 py-3.5 border-t border-b border-slate-100 mb-4">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1.5 text-slate-600">
              <BedDouble size={15} className="text-slate-400" />
              <span className="text-sm font-medium">{property.bedrooms}</span>
              <span className="text-xs text-slate-400">Beds</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-slate-600">
            <Bath size={15} className="text-slate-400" />
            <span className="text-sm font-medium">{property.bathrooms}</span>
            <span className="text-xs text-slate-400">Baths</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Maximize2 size={14} className="text-slate-400" />
            <span className="text-sm font-medium">{property.area.toLocaleString()}</span>
            <span className="text-xs text-slate-400">sqft</span>
          </div>
        </div>

        {/* View Button */}
        <Link
          href={`/properties/${property.id}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border-2 border-emerald-600 text-emerald-700 font-semibold text-sm rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-200 group/btn"
        >
          View Details
          <ArrowRight size={15} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

