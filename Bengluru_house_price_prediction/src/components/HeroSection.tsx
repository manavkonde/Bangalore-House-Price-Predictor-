import { motion } from "framer-motion";
import { MapPin, TrendingUp, Shield, Sparkles, BarChart3, Globe, Award } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "240+ Locations",
    description: "Covering all major areas across 5 cities",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: TrendingUp,
    title: "ML Powered",
    description: "Accurate price predictions using AI",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Data Driven",
    description: "Based on 13,000+ real transactions",
    gradient: "from-emerald-500 to-teal-500",
  },
];

export function HeroSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/hero-houses.png" 
          alt="Beautiful cityscape" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/85 via-navy-900/60 to-navy-900/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/70 via-transparent to-navy-900/50" />
      </div>
      
      {/* Subtle animated orbs */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-gold-400 rounded-full px-4 py-2 mb-6 border border-white/10"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">AI-Powered Price Prediction</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold mb-6 leading-tight text-white"
          >
            Find Your Dream Home's
            <span className="text-shimmer block mt-2">True Value</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-white/50 max-w-2xl mx-auto"
          >
            Get accurate property price estimates for any location across India's top cities. 
            Our machine learning model analyzes real market data to give you reliable predictions.
          </motion.p>
        </div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shrink-0 shadow-lg`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">{feature.title}</h3>
                <p className="text-xs text-white/40">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
