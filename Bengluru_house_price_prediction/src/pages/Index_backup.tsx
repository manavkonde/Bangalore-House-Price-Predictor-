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
                    Get Started
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="xl"
                    variant="outline"
                    className="h-14 px-8 rounded-full"
                    onClick={() => navigate("/comparison")}
                  >
                    Explore Market
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="flex gap-8 pt-8">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-slate-600">Verified Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-slate-600">Real-time Updates</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right - Hero Image */}
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 via-blue-400/10 to-transparent flex items-center justify-center">
                  <Building2 className="w-32 h-32 text-primary/30" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-16 mt-20">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
                        <Icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-sm text-slate-600">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Search Section */}
          <motion.div
            className="mt-24 mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Start Predicting Now</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Choose a location and let our AI calculate the estimated market value of your property.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary bg-white cursor-pointer"
                    defaultValue=""
                    disabled={loading}
                  >
                    <option value="">
                      {loading ? "Loading locations..." : "Select a location..."}
                    </option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  size="lg"
                  className="px-8"
                  onClick={() => navigate("/estimate-price")}
                >
                  Predict Price
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
