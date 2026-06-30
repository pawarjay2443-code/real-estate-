"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Grid3x3, List, ChevronDown, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/property/PropertyCard";
import { properties } from "@/data";

const propertyTypes = ["All Types", "Villa", "Apartment", "House", "Penthouse", "Studio", "Townhouse"];
const statusOptions = ["All Status", "For Sale", "For Rent", "Sold", "Under Contract"];
const sortOptions = ["Newest First", "Price: Low to High", "Price: High to Low", "Area: Large to Small"];
const bedroomOptions = ["Any", "1+", "2+", "3+", "4+", "5+"];
const cities = ["All Cities", "Beverly Hills", "Manhattan", "Greenwich", "Boston", "Chicago", "Atlanta", "Malibu", "New York", "Austin"];

export default function PropertiesPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All Types");
  const [status, setStatus] = useState("All Status");
  const [city, setCity] = useState("All Cities");
  const [bedrooms, setBedrooms] = useState("Any");
  const [sort, setSort] = useState("Newest First");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = useMemo(() => {
    let result = [...properties];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)
      );
    }
    if (type !== "All Types") result = result.filter((p) => p.type === type);
    if (status !== "All Status") result = result.filter((p) => p.status === status);
    if (city !== "All Cities") result = result.filter((p) => p.city === city);
    if (bedrooms !== "Any") {
      const min = parseInt(bedrooms);
      result = result.filter((p) => p.bedrooms >= min);
    }

    result.sort((a, b) => {
      if (sort === "Price: Low to High") return a.price - b.price;
      if (sort === "Price: High to Low") return b.price - a.price;
      if (sort === "Area: Large to Small") return b.area - a.area;
      return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    });

    return result;
  }, [search, type, status, city, bedrooms, sort]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const clearFilters = () => {
    setSearch("");
    setType("All Types");
    setStatus("All Status");
    setCity("All Cities");
    setBedrooms("Any");
    setPage(1);
  };

  const activeFilters = [type, status, city, bedrooms].filter(
    (f) => f !== "All Types" && f !== "All Status" && f !== "All Cities" && f !== "Any"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Page Header */}
      <div className="pt-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
            <span>Home</span>
            <span>/</span>
            <span className="text-white">Properties</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">
            All Properties
          </h1>
          <p className="text-slate-400 text-lg">
            {filtered.length} properties found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search + Controls Bar */}
        <div className="bg-white rounded-2xl shadow-card p-4 mb-6 flex flex-col sm:flex-row gap-3 items-center">
          {/* Search */}
          <div className="flex items-center gap-2.5 flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <Search size={16} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by city, name, or address..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="flex-1 text-sm text-slate-700 placeholder:text-slate-400 outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-emerald-500 bg-white cursor-pointer"
            >
              {sortOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
              showFilters || activeFilters > 0
                ? "bg-emerald-600 text-white border-emerald-600"
                : "border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-600"
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilters > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-emerald-700 text-xs font-bold flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </button>

          {/* View Toggle */}
          <div className="flex rounded-xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={`p-2.5 transition-colors ${view === "grid" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-600"}`}
            >
              <Grid3x3 size={16} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2.5 transition-colors ${view === "list" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-600"}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-900">Refine Results</h3>
              <button onClick={clearFilters} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                Clear all
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Property Type</label>
                <select
                  value={type}
                  onChange={(e) => { setType(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-white"
                >
                  {propertyTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Status</label>
                <select
                  value={status}
                  onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-white"
                >
                  {statusOptions.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">City</label>
                <select
                  value={city}
                  onChange={(e) => { setCity(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-white"
                >
                  {cities.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Bedrooms</label>
                <select
                  value={bedrooms}
                  onChange={(e) => { setBedrooms(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-white"
                >
                  {bedroomOptions.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full py-2 px-4 border-2 border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:border-red-300 hover:text-red-600 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {paginated.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">No properties found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your search filters.</p>
            <button onClick={clearFilters} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {paginated.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:border-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                      page === i + 1
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                        : "border border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-600"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:border-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
