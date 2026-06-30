import Link from "next/link";
import { Home, Mail, Phone, MapPin, AtSign, Link2, Share2, Globe, ArrowRight } from "lucide-react";

const footerLinks = {
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/about#team" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Blog", href: "#" },
  ],
  Properties: [
    { label: "For Sale", href: "/properties?status=For+Sale" },
    { label: "For Rent", href: "/properties?status=For+Rent" },
    { label: "Luxury Villas", href: "/properties?type=Villa" },
    { label: "Penthouses", href: "/properties?type=Penthouse" },
    { label: "New Listings", href: "/properties?filter=new" },
  ],
  Services: [
    { label: "Buy Property", href: "#" },
    { label: "Sell Property", href: "#" },
    { label: "Property Management", href: "#" },
    { label: "Valuation", href: "#" },
    { label: "Investment Advice", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Newsletter strip */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-xl font-semibold text-white">
                Stay ahead of the market
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Curated property alerts and market insights — weekly.
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 md:w-72 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              <button className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap">
                Subscribe <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
                <Home size={18} className="text-white" />
              </div>
              <div>
                <span className="font-display text-xl font-semibold text-white">Verdant</span>
                <span className="text-xs font-medium tracking-widest block leading-none mt-0.5 text-slate-500">REALTY</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Verdant Realty connects discerning buyers, sellers, and renters with the world&apos;s most exceptional properties. Every transaction, a bespoke experience.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <MapPin size={15} className="text-emerald-500 flex-shrink-0" />
                <span>420 Park Avenue, Suite 900, New York, NY 10022</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone size={15} className="text-emerald-500 flex-shrink-0" />
                <span>+1 (800) 555-VERDANT</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail size={15} className="text-emerald-500 flex-shrink-0" />
                <span>hello@verdantrealty.com</span>
              </div>
            </div>
            {/* Socials */}
            <div className="flex gap-3 mt-6">
              {[AtSign, Link2, Share2, Globe].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-emerald-600 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-emerald-400 text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Verdant Realty, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a key={item} href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
