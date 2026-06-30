/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import Link from "next/link";
import { Home, Building2, TrendingUp, MessageSquare, Plus, Bell, Settings, LogOut, Users, BarChart3, FileText, ChevronRight, Eye, Edit, Trash2, ArrowUpRight, ArrowDownRight, Menu } from "lucide-react";
import { properties, recentActivities, dashboardStats } from "@/data";

const navItems = [
  {icon:Home,label:"Dashboard",id:"dashboard"},
  {icon:Building2,label:"Properties",id:"properties"},
  {icon:Users,label:"Clients",id:"clients"},
  {icon:BarChart3,label:"Analytics",id:"analytics"},
  {icon:MessageSquare,label:"Messages",id:"messages"},
  {icon:FileText,label:"Reports",id:"reports"},
  {icon:Settings,label:"Settings",id:"settings"},
];

const iconMap: Record<string, React.ElementType> = { Building2, Home, TrendingUp, MessageSquare };

const Sidebar = ({ active, setActive, setSidebarOpen }: { active: string, setActive: (id: string) => void, setSidebarOpen: (v: boolean) => void }) => (
  <div className="flex flex-col h-full">
    <div className="p-6 border-b border-slate-800">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
          <Home size={16} className="text-white" />
        </div>
        <div>
          <span className="font-display text-lg font-semibold text-white">Verdant</span>
          <span className="text-xs text-slate-500 block leading-none tracking-widest">REALTY</span>
        </div>
      </Link>
    </div>
    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
      <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 mb-3">Main Menu</div>
      {navItems.map(({icon:Icon,label,id})=>(
        <button key={id} onClick={()=>{setActive(id);setSidebarOpen(false);}} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active===id?"bg-emerald-600 text-white shadow-lg shadow-emerald-600/20":"text-slate-400 hover:text-white hover:bg-slate-800"}`}>
          <Icon size={17}/>{label}
          {id==="messages" && <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">3</span>}
        </button>
      ))}
    </nav>
    <div className="p-4 border-t border-slate-800">
      <div className="flex items-center gap-3 mb-3 px-2">
        <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face" alt="Admin" className="w-9 h-9 rounded-full object-cover border-2 border-emerald-600" />
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-medium truncate">Alex Verdant</div>
          <div className="text-slate-500 text-xs truncate">Administrator</div>
        </div>
      </div>
      <Link href="/" className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 text-sm transition-colors rounded-xl hover:bg-slate-800">
        <LogOut size={15}/> Sign Out
      </Link>
    </div>
  </div>
);

export default function DashboardPage() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);


  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 flex-col flex-shrink-0">
        <Sidebar active={active} setActive={setActive} setSidebarOpen={setSidebarOpen} />
      </aside>
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-slate-900 flex flex-col"><Sidebar active={active} setActive={setActive} setSidebarOpen={setSidebarOpen} /></div>
          <div className="flex-1 bg-black/50" onClick={()=>setSidebarOpen(false)} />
        </div>
      )}
      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-600" onClick={()=>setSidebarOpen(true)}><Menu size={22}/></button>
            <div>
              <h1 className="font-display text-xl font-bold text-slate-900 capitalize">{active}</h1>
              <p className="text-slate-500 text-xs">Welcome back, Alex</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition-all">
              <Bell size={17}/>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">5</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors">
              <Plus size={16}/> Add Property
            </button>
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {dashboardStats.map((stat,i)=>{
              const Icon = iconMap[stat.icon] || Building2;
              return (
                <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-card transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Icon size={18} className="text-emerald-600"/>
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-semibold ${stat.positive?"text-emerald-600":"text-red-500"}`}>
                      {stat.positive?<ArrowUpRight size={13}/>:<ArrowDownRight size={13}/>}
                      {stat.change.split(" ")[0]}
                    </span>
                  </div>
                  <div className="font-display text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-slate-500 text-sm mt-0.5">{stat.label}</div>
                </div>
              );
            })}
          </div>
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Chart placeholder */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-slate-900">Revenue Overview</h3>
                  <p className="text-slate-500 text-sm">Monthly performance</p>
                </div>
                <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none text-slate-600">
                  {["Last 6 months","Last year","All time"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              {/* Bar chart simulation */}
              <div className="flex items-end gap-2 h-40">
                {[65,80,45,90,70,85,75,95,60,88,72,100].map((h,i)=>(
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-lg bg-emerald-100 hover:bg-emerald-500 transition-colors cursor-pointer" style={{height:`${h}%`}} title={`$${(h*24000).toLocaleString()}`}/>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m=>(
                  <span key={m} className="text-xs text-slate-400 flex-1 text-center">{m}</span>
                ))}
              </div>
            </div>
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivities.map(act=>(
                  <div key={act.id} className="flex gap-3 items-start">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm ${act.type==="sale"?"bg-emerald-100":act.type==="inquiry"?"bg-blue-100":"bg-amber-100"}`}>
                      {act.type==="sale"?"💰":act.type==="inquiry"?"💬":act.type==="listing"?"🏠":"📅"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 font-medium leading-tight">{act.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-400">{act.time}</span>
                        {act.amount && <span className="text-xs font-semibold text-emerald-600">{act.amount}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Property Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Property Listings</h3>
              <Link href="/properties" className="text-sm text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1">
                View all <ChevronRight size={14}/>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {["Property","Location","Price","Status","Type","Actions"].map(h=>(
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {properties.slice(0,6).map(p=>(
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt={p.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          <div>
                            <div className="font-medium text-slate-900 text-sm line-clamp-1">{p.title}</div>
                            <div className="text-slate-400 text-xs">{p.area.toLocaleString()} sqft</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 text-sm">{p.city}, {p.state}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-900 text-sm">{p.priceLabel}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.status==="For Sale"?"bg-emerald-50 text-emerald-700":p.status==="For Rent"?"bg-blue-50 text-blue-700":"bg-red-50 text-red-700"}`}>{p.status}</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 text-sm">{p.type}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <Link href={`/properties/${p.id}`} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"><Eye size={14}/></Link>
                          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><Edit size={14}/></button>
                          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"><Trash2 size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Add Property Form */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mt-6">
            <h3 className="font-semibold text-slate-900 mb-5">Add New Property</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[{l:"Property Title",p:"e.g. Emerald Ridge Villa"},{l:"Price",p:"e.g. $1,200,000"},{l:"Location",p:"City, State"},{l:"Area (sqft)",p:"e.g. 3500"},{l:"Bedrooms",p:"e.g. 4"},{l:"Bathrooms",p:"e.g. 3"}].map(({l,p})=>(
                <div key={l}>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">{l}</label>
                  <input placeholder={p} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-all" />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Property Type</label>
                <select className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-white">
                  {["Villa","Apartment","House","Penthouse","Studio","Townhouse"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Status</label>
                <select className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-white">
                  {["For Sale","For Rent","Under Contract"].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Description</label>
                <textarea rows={3} placeholder="Property description..." className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 resize-none transition-all" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-emerald-600/20">Save Property</button>
              <button className="px-6 py-2.5 border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

