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
  User
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
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "Comparison",
    description: "Compare prices across different locations",
    icon: GitCompare,
    href: "/comparison",
    color: "bg-green-500/10 text-green-600",
  },
  {
    title: "Map View",
    description: "Explore properties on an interactive map",
    icon: Map,
    href: "/map",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    title: "Nearby Amenities",
    description: "Discover schools, hospitals, and more nearby",
    icon: MapPin,
    href: "/nearby-amenities",
    color: "bg-amber-500/10 text-amber-600",
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

  return (
    <AppLayout>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">
              Welcome back, {profile?.full_name || user?.email?.split("@")[0]}!
            </h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <Card className="bg-gradient-card border-border/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Total Searches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-display font-bold">
              {loading ? "—" : searchHistory.length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4" />
              Avg. Predicted Price
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-display font-bold">
              {loading ? "—" : avgPrice > 0 ? `₹${avgPrice.toFixed(1)}L` : "—"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Locations Explored
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-display font-bold">
              {loading ? "—" : uniqueLocations}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-lg font-display font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureCards.map((card, index) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card 
                className="cursor-pointer hover:shadow-hover transition-all duration-300 border-border/50 group h-full"
                onClick={() => navigate(card.href)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                    <card.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {card.title}
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </CardTitle>
                  <CardDescription>{card.description}</CardDescription>
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
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest property price predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading...
              </div>
            ) : searchHistory.length === 0 ? (
              <div className="text-center py-8">
                <History className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground mb-4">No searches yet</p>
                <button
                  onClick={() => navigate("/estimate-price")}
                  className="text-primary font-medium hover:underline"
                >
                  Make your first prediction →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {searchHistory.slice(0, 5).map((search) => (
                  <div
                    key={search.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium capitalize">{search.location}</p>
                        <p className="text-sm text-muted-foreground">
                          {search.sqft} sqft • {search.bhk} BHK • {search.bath} Bath
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-primary">
                        ₹{Number(search.predicted_price).toFixed(1)}L
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(search.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
