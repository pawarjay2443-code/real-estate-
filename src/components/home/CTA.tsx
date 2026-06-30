import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 bg-emerald-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-700 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Ready to Find Your
          <span className="block italic">Dream Property?</span>
        </h2>
        <p className="text-emerald-100 text-lg sm:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Speak with a Verdant agent today. We&apos;ll listen first, then help you find something truly extraordinary.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/properties"
            className="flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 font-bold text-base rounded-2xl hover:bg-emerald-50 active:scale-95 transition-all shadow-xl group"
          >
            Browse Properties
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 px-8 py-4 bg-emerald-700 text-white font-bold text-base rounded-2xl hover:bg-emerald-800 active:scale-95 transition-all border-2 border-emerald-500"
          >
            <Phone size={18} />
            Talk to an Agent
          </Link>
        </div>

        {/* Trust note */}
        <p className="text-emerald-200/70 text-sm mt-10">
          No pressure. No spam. A conversation, when you&apos;re ready.
        </p>
      </div>
    </section>
  );
}
