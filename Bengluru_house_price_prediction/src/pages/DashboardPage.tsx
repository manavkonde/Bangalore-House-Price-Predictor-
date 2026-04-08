import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Calculator, 
  GitCompare, 
  Map, 
  MapPin, 
  TrendingUp, 
  History, 
  IndianRupee,
  ArrowRight,
  User,
  Sparkles,
  Award,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface SearchHistoryItem {
  id: string;
  location: string;
  sqft: number;
  bhk: number;
  bath: number;
  predicted_price: number;
  created_at: string;
}

const featureCards = [
  {
    title: "Estimate Price",
    description: "Get AI-powered price predictions for any property",
    icon: Calculator,
    href: "/estimate-price",
    gradient: "from-amber-500 to-orange-500",
    bgGlow: "bg-amber-500/10",
  },
  {
    title: "Comparison",
    description: "Compare prices across different locations",
    icon: GitCompare,
    href: "/comparison",
    gradient: "from-emerald-500 to-teal-500",
    bgGlow: "bg-emerald-500/10",
  },
  {
    title: "Map View",
    description: "Explore properties on an interactive map",
    icon: Map,
    href: "/map",
    gradient: "from-blue-500 to-indigo-500",
    bgGlow: "bg-blue-500/10",
  },
  {
    title: "Nearby Amenities",
    description: "Discover schools, hospitals, and more nearby",
    icon: MapPin,
    href: "/nearby-amenities",
    gradient: "from-violet-500 to-purple-500",
    bgGlow: "bg-violet-500/10",
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    const [profileRes, historyRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("search_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data);
    }

    if (historyRes.data) {
      setSearchHistory(historyRes.data);
    }

    setLoading(false);
  };

  const avgPrice = searchHistory.length > 0
    ? searchHistory.reduce((sum, s) => sum + Number(s.predicted_price), 0) / searchHistory.length
    : 0;

  const uniqueLocations = new Set(searchHistory.map((s) => s.location)).size;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <AppLayout>
      {/* Welcome Section with gradient background */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 -m-4 md:-m-6 lg:-m-8 p-6 md:p-8 lg:p-10 overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-800 via-navy-900 to-navy-800" />
        <div className="absolute inset-0">
          <img src="/hero-houses.png" alt="" className="w-full h-full object-cover opacity-10" />
        </div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-amber-500/15 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex items-center gap-4 mb-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-gold">
            <User className="h-8 w-8 text-navy-900" />
          </div>
          <div>
            <p className="text-sm text-gold-400/80 font-medium">{greeting()} 👋</p>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
              {profile?.full_name || user?.email?.split("@")[0]}
            </h1>
            <p className="text-sm text-white/40">{user?.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-8"
      >
        {[
          { 
            icon: History, 
            label: "Total Searches", 
            value: loading ? "—" : searchHistory.length.toString(),
            gradient: "from-blue-500 to-indigo-500",
            bgGlow: "bg-blue-500/5"
          },
          { 
            icon: IndianRupee, 
            label: "Avg. Predicted Price", 
            value: loading ? "—" : avgPrice > 0 ? `₹${avgPrice.toFixed(1)}L` : "—",
            gradient: "from-amber-500 to-orange-500",
            bgGlow: "bg-amber-500/5"
          },
          { 
            icon: MapPin, 
            label: "Locations Explored", 
            value: loading ? "—" : uniqueLocations.toString(),
            gradient: "from-emerald-500 to-teal-500",
            bgGlow: "bg-emerald-500/5"
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * i }}
          >
            <Card className={`relative overflow-hidden border-none shadow-card hover:shadow-hover transition-all duration-300 ${stat.bgGlow}`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <CardContent className="pt-6 pb-6 px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-2 mb-2">
                      <stat.icon className="h-4 w-4" />
                      {stat.label}
                    </p>
                    <p className="text-3xl font-display font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl font-display font-bold mb-5 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-gold-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureCards.map((card, index) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card 
                className="cursor-pointer hover:shadow-hover transition-all duration-300 border-border/40 group h-full overflow-hidden relative"
                onClick={() => navigate(card.href)}
              >
                {/* Hover glow */}
                <div className={`absolute -top-16 -right-16 w-32 h-32 ${card.bgGlow} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <CardHeader className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg flex items-center justify-between font-display">
                    {card.title}
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </CardTitle>
                  <CardDescription className="text-sm">{card.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-border/40 shadow-card overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/20">
            <CardTitle className="flex items-center gap-2 font-display">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-navy-900" />
              </div>
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest property price predictions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full mx-auto mb-4"
                />
                Loading...
              </div>
            ) : searchHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/5 flex items-center justify-center mx-auto mb-4 border border-amber-500/10">
                  <History className="h-8 w-8 text-gold-500/40" />
                </div>
                <p className="text-muted-foreground mb-4 font-medium">No predictions yet</p>
                <button
                  onClick={() => navigate("/estimate-price")}
                  className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Make your first prediction <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {searchHistory.slice(0, 5).map((search, i) => (
                  <motion.div
                    key={search.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/60 transition-all duration-200 group cursor-pointer border border-transparent hover:border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold capitalize text-foreground">{search.location}</p>
                        <p className="text-sm text-muted-foreground">
                          {search.sqft} sqft • {search.bhk} BHK • {search.bath} Bath
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-lg text-primary">
                        ₹{Number(search.predicted_price).toFixed(1)}L
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(search.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
