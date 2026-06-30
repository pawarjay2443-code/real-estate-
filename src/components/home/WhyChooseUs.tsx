import { Shield, Users, TrendingUp, Clock, Award, Headphones } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Trusted & Verified",
    description: "Every property is independently verified and legally vetted before it reaches our platform. No surprises, no exceptions.",
    color: "emerald",
  },
  {
    icon: Users,
    title: "Expert Agents",
    description: "Our agents hold an average of 11 years experience in luxury residential markets — your transaction is in exceptional hands.",
    color: "blue",
  },
  {
    icon: TrendingUp,
    title: "Market Intelligence",
    description: "Proprietary data and 15 years of market cycles mean our pricing guidance is remarkably accurate — in any direction.",
    color: "violet",
  },
  {
    icon: Clock,
    title: "Speed & Discretion",
    description: "When discretion matters, we move fast. Our off-market network ensures access before listings go public.",
    color: "amber",
  },
  {
    icon: Award,
    title: "Award-Winning Service",
    description: "Ranked #1 luxury real estate firm in the Northeast for five consecutive years by Residential Excellence Awards.",
    color: "rose",
  },
  {
    icon: Headphones,
    title: "White-Glove Support",
    description: "A dedicated concierge team available seven days a week — from search to settlement and beyond.",
    color: "teal",
  },
];

const colorMap: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
  violet: "bg-violet-50 text-violet-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
  teal: "bg-teal-50 text-teal-600",
};

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-6 h-0.5 bg-emerald-500" />
              <span className="text-emerald-600 text-xs font-semibold tracking-widest uppercase">Why Verdant</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-6">
              The Verdant
              <span className="block text-emerald-gradient">Difference</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              In a market crowded with transactional firms, Verdant stands apart through an unwavering commitment to the client experience. We don&apos;t measure success in closed deals — we measure it in clients who return.
            </p>

            {/* Numbers */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { n: "15+", l: "Years in luxury" },
                { n: "$18B+", l: "Transacted value" },
                { n: "4.9★", l: "Average rating" },
              ].map((item) => (
                <div key={item.l} className="text-center p-4 bg-slate-50 rounded-2xl">
                  <div className="font-display text-2xl font-bold text-slate-900">{item.n}</div>
                  <div className="text-slate-500 text-xs mt-1">{item.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              const colors = colorMap[feature.color];
              return (
                <div
                  key={feature.title}
                  className="p-5 rounded-2xl border border-slate-100 bg-white hover:shadow-card-hover hover:border-transparent transition-all duration-300 group"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${colors} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2 text-sm">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
