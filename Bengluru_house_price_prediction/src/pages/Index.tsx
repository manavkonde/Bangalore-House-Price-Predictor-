import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Calculator,
  Search,
  GitCompare,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Globe,
  Star,
  ChevronRight,
  BarChart3,
  Home,
  Users,
  Award,
  Sparkles
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLocations } from "@/services/api";
import { toast } from "sonner";

export default function Index() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatIndex, setActiveStatIndex] = useState(0);

  useEffect(() => {
    const fetchLocs = async () => {
      try {
        const locs = await getLocations();
        setLocations(locs);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocs();
  }, []);

  // Auto-rotate stats
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStatIndex((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: "13K+", label: "Data Points", icon: BarChart3 },
    { value: "98%", label: "Accuracy", icon: Award },
    { value: "5", label: "Cities Covered", icon: Globe },
  ];

  const features = [
    {
      title: "AI-Powered Predictions",
      desc: "Get institutional-grade property valuations powered by advanced machine learning models trained on real market data.",
      icon: Zap,
      gradient: "from-amber-500 to-orange-500",
      bgGlow: "bg-amber-500/20"
    },
    {
      title: "Market Comparison",
      desc: "Compare neighborhood premiums, historical trends, and investment potential across locations side by side.",
      icon: GitCompare,
      gradient: "from-emerald-500 to-teal-500",
      bgGlow: "bg-emerald-500/20"
    },
    {
      title: "Smart Map View",
      desc: "Visualize price heatmaps, nearby amenities, and property hotspots on an interactive geographic map.",
      icon: MapPin,
      gradient: "from-blue-500 to-indigo-500",
      bgGlow: "bg-blue-500/20"
    }
  ];

  return (
    <AppLayout>
      {/* ============= HERO SECTION ============= */}
      <div className="relative -m-4 md:-m-6 lg:-m-8 mb-0">
        {/* Hero Background with Image */}
        <div className="relative min-h-[85vh] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="/hero-houses.png" 
              alt="Beautiful homes at golden hour" 
              className="w-full h-full object-cover"
            />
            {/* Multi-layer gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-navy-900/90 via-navy-900/60 to-navy-900/90" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-900/80 via-transparent to-navy-900/60" />
            {/* Warm golden glow from bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-amber-500/15 to-transparent" />
          </div>

          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute top-20 left-[15%] w-2 h-2 bg-gold-400/30 rounded-full"
              animate={{ y: [-20, 20, -20], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div 
              className="absolute top-40 right-[25%] w-1.5 h-1.5 bg-blue-400/30 rounded-full"
              animate={{ y: [20, -20, 20], opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />
            <motion.div 
              className="absolute bottom-40 left-[35%] w-1 h-1 bg-gold-300/40 rounded-full"
              animate={{ y: [-15, 15, -15], opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
            />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-32 flex flex-col items-center text-center">
            
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-widest mb-8"
            >
              <Sparkles className="h-3.5 w-3.5 text-gold-400" />
              House Price Prediction System
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] tracking-tight max-w-5xl"
            >
              Predict Your{" "}
              <span className="text-shimmer">Home's Value</span>
              {" "}Instantly
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 text-base sm:text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed font-body"
            >
              Enter the details to estimate the price of a house. Our AI model analyzes real market data from 13,000+ transactions across India's top cities.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center justify-center gap-4 mt-10"
            >
              <Button
                size="xl"
                className="group h-14 px-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-navy-900 font-bold shadow-gold border-0 text-base"
                onClick={() => navigate("/estimate-price")}
              >
                <Calculator className="mr-2 h-5 w-5" />
                Predict Price
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="h-14 px-8 rounded-full border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm text-base"
                onClick={() => navigate("/map")}
              >
                <MapPin className="mr-2 h-5 w-5" />
                Explore Map
              </Button>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-16 grid grid-cols-3 gap-6 sm:gap-8 md:gap-12 max-w-lg mx-auto"
            >
              {stats.map((stat, i) => (
                <motion.div 
                  key={i}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-white/50 font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Bottom wave/curve decoration */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0,80 C360,120 720,40 1080,80 C1260,100 1380,90 1440,80 L1440,120 L0,120 Z" fill="hsl(220, 25%, 97%)" />
            </svg>
          </div>
        </div>
      </div>

      {/* ============= FEATURES SECTION ============= */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 font-semibold text-xs uppercase tracking-wider px-4 py-1">
            Why Choose Us
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-4 tracking-tight">
            Powerful Features for <span className="text-gradient-warm">Smart Decisions</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Everything you need to make informed real estate decisions, powered by cutting-edge technology.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 * i, duration: 0.5 }}
            >
              <Card className="group h-full border-none shadow-card hover:shadow-hover transition-all duration-500 bg-white overflow-hidden relative">
                {/* Hover glow effect */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 ${f.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <CardContent className="pt-8 pb-8 px-8 relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed font-body text-sm">
                    {f.desc}
                  </p>
                  <div className="mt-6 flex items-center text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ============= HOW IT WORKS SECTION ============= */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-800" />
        <div className="absolute inset-0">
          <img 
            src="/city-skyline.png" 
            alt="" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-gold-500/20 text-gold-400 border-gold-500/30 font-semibold text-xs uppercase tracking-wider px-4 py-1">
              Simple Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-base md:text-lg">
              Get your property valuation in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Select Location", desc: "Choose your city and specific locality from our comprehensive database.", icon: MapPin },
              { step: "02", title: "Enter Details", desc: "Provide property specifics like area, bedrooms, and bathrooms.", icon: Home },
              { step: "03", title: "Get Prediction", desc: "Receive an AI-powered price estimate with market insights and trends.", icon: TrendingUp },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * i }}
                className="text-center group"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full glass-dark mx-auto flex items-center justify-center group-hover:border-gold-500/50 transition-all duration-300">
                    <item.icon className="h-8 w-8 text-gold-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xs font-bold text-navy-900 left-1/2 ml-6">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA in dark section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Button
              size="xl"
              className="h-14 px-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-navy-900 font-bold shadow-gold border-0 text-base group"
              onClick={() => navigate("/estimate-price")}
            >
              Start Predicting Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* ============= TRUST SECTION ============= */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-semibold text-xs uppercase tracking-wider px-4 py-1">
              Trusted Platform
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-6 tracking-tight leading-tight">
              Real Data.<br />
              <span className="text-gradient-warm">Real Predictions.</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
              Our machine learning models are trained on verified transaction data from multiple cities. We combine gradient boosting algorithms with comprehensive feature engineering to deliver predictions that real estate professionals trust.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: ShieldCheck, label: "Verified Data Sources", color: "text-emerald-500" },
                { icon: Zap, label: "Real-time Predictions", color: "text-amber-500" },
                { icon: Users, label: "10K+ Monthly Users", color: "text-blue-500" },
                { icon: Globe, label: "Multi-City Coverage", color: "text-violet-500" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <item.icon className={`h-5 w-5 ${item.color} shrink-0`} />
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Visual Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/20 via-blue-500/10 to-violet-500/20 rounded-[32px] blur-2xl opacity-60" />
            <div className="relative bg-gradient-to-br from-navy-800 to-navy-900 rounded-3xl p-8 shadow-2xl border border-white/10 overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-gold">
                    <Building2 className="h-6 w-6 text-navy-900" />
                  </div>
                  <div>
                    <span className="font-display font-bold text-lg text-white">BangaloreHomes</span>
                    <p className="text-xs text-white/40">AI Price Predictor</p>
                  </div>
                </div>

                {/* Skeleton preview content */}
                <div className="space-y-4 mb-8">
                  <div className="h-3 w-3/4 bg-white/10 rounded-full" />
                  <div className="h-3 w-1/2 bg-white/10 rounded-full" />
                </div>

                {/* Price card */}
                <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className="text-xs text-white/40 uppercase font-bold tracking-widest mb-2">Estimated Value</p>
                  <div className="text-4xl sm:text-5xl font-display font-bold text-shimmer tracking-tighter">
                    ₹84.42 <span className="text-base font-body font-normal text-white/50">Lakhs</span>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="px-2 py-1 rounded-full bg-emerald-500/20 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-emerald-400" />
                      <span className="text-xs text-emerald-400 font-semibold">+12.4%</span>
                    </div>
                    <span className="text-xs text-white/30">vs last year</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              className="absolute -top-6 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden sm:block"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">98% Accurate</div>
                  <div className="text-[10px] text-slate-500">Verified Model</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden sm:block"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">5 Cities</div>
                  <div className="text-[10px] text-slate-500">Pan India Coverage</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ============= BOTTOM CTA SECTION ============= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20"
      >
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900" />
          <div className="absolute inset-0">
            <img src="/hero-houses.png" alt="" className="w-full h-full object-cover opacity-15" />
          </div>
          <div className="relative z-10 py-16 px-8 md:px-16 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">
              Ready to Know Your Home's Worth?
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8 text-base md:text-lg">
              Join thousands of homeowners who trust our AI to make smarter property decisions.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                size="xl"
                className="h-14 px-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-navy-900 font-bold shadow-gold border-0 text-base group"
                onClick={() => navigate("/estimate-price")}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="h-14 px-8 rounded-full border-white/30 text-white hover:bg-white/10 hover:text-white text-base"
                onClick={() => navigate("/comparison")}
              >
                Compare Areas
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
