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
  Star
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

  const features = [
    {
      title: "AI Predictions",
      desc: "Get institutional-grade price estimates using machine learning.",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      title: "Market Comparison",
      desc: "Compare neighborhood premiums and historical price data.",
      icon: GitCompare,
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    {
      title: "Smart Map View",
      desc: "Visualize price trends and nearby amenities geographically.",
      icon: MapPin,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    }
  ];

  return (
    <AppLayout>
      <div className="relative min-h-[calc(100vh-80px)] overflow-hidden">
        {/* Background Gradient Orbs */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 pt-12 lg:pt-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left Content */}
            <div className="lg:w-1/2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                  <Star className="h-3 w-3 fill-primary" />
                  Real Estate Intelligence for Bangalore
                </div>
                <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                  Predict Your Property's <span className="text-primary italic">Value</span> Instantly.
                </h1>
                <p className="text-xl text-slate-600 mt-6 leading-relaxed max-w-xl">
                  Leverage our advanced AI trained on 13,000+ data points to get accurate market valuations for homes across Bengaluru.
                </p>

                <div className="flex flex-wrap gap-4 mt-10">
                  <Button
                    size="xl"
                    className="group h-14 px-8 rounded-full shadow-lg shadow-primary/20"
                    onClick={() => navigate("/estimate-price")}
                  >
                    Start Prediction
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    variant="outline"
                    size="xl"
                    className="h-14 px-8 rounded-full border-slate-200"
                    onClick={() => navigate("/comparison")}
                  >
                    Compare Areas
                  </Button>
                </div>
              </motion.div>

              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-6 pt-4 border-t border-slate-100"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-bold text-slate-900">10,000+ Queries monthly</div>
                  <div className="text-slate-500">Trusted by Bangalore homeowners</div>
                </div>
              </motion.div>
            </div>

            {/* Right Graphic */}
            <div className="lg:w-1/2 relative w-full flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-primary/20 rounded-[40px] blur-2xl opacity-50" />
                <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-6 rounded-[32px] shadow-2xl relative">
                  <div className="bg-slate-900 rounded-2xl p-8 text-white w-full max-w-[400px] shadow-inner overflow-hidden relative">
                    {/* Abstract Shapes in Phone UI */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-bold text-lg">Predictor AI</span>
                      </div>
                      <div className="space-y-4">
                        <div className="h-3 w-2/3 bg-white/10 rounded-full" />
                        <div className="h-3 w-1/2 bg-white/10 rounded-full" />
                        <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
                          <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Estimated Value</p>
                          <div className="text-4xl font-black mt-2 text-primary tracking-tighter">₹84.42 <span className="text-sm font-normal text-white/60">Lakhs</span></div>
                          <div className="flex items-center gap-2 mt-4">
                            <TrendingUp className="h-4 w-4 text-green-400" />
                            <span className="text-xs text-green-400">+12.4% vs last year</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <motion.div
                  className="absolute -top-10 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden sm:block"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">98% Accuracy</div>
                      <div className="text-[10px] text-slate-500">Verified Model</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-6 -left-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden sm:block"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">240+ Localities</div>
                      <div className="text-[10px] text-slate-500">Across Bengaluru</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-32 mb-24">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * i }}
              >
                <Card className="h-full border-none shadow-soft hover:shadow-hover transition-all duration-300">
                  <CardContent className="pt-8 pb-6 px-8">
                    <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-6`}>
                      <f.icon className={`h-7 w-7 ${f.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
