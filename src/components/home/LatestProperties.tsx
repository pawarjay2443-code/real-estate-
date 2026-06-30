import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import { properties } from "@/data";

const latest = properties.filter((p) => p.isNew || !p.isFeatured).slice(0, 3);

export default function LatestProperties() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-6 h-0.5 bg-emerald-500" />
              <span className="text-emerald-600 text-xs font-semibold tracking-widest uppercase">Just Listed</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-900">
              Latest Properties
            </h2>
            <p className="text-slate-500 mt-2 max-w-md">
              Fresh to the market and ready to be discovered.
            </p>
          </div>
          <Link
            href="/properties"
            className="flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors group"
          >
            View all listings
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
