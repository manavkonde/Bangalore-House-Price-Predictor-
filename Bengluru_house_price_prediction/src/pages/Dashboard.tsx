import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, History, TrendingUp, MapPin, Calendar, 
  Trash2, ArrowLeft, LogOut, IndianRupee
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PriceTrendsChart } from "@/components/PriceTrendsChart";

interface SearchHistoryItem {
  id: string;
  location: string;
  sqft: number;
  bhk: number;
  bath: number;
  predicted_price: number;
  created_at: string;
}

export default function Dashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    // Fetch profile and search history in parallel
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

  const deleteSearch = async (id: string) => {
    const { error } = await supabase
      .from("search_history")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete search",
        variant: "destructive",
      });
    } else {
      setSearchHistory(searchHistory.filter((s) => s.id !== id));
      toast({
        title: "Deleted",
        description: "Search removed from history",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const avgPrice = searchHistory.length > 0
    ? searchHistory.reduce((sum, s) => sum + Number(s.predicted_price), 0) / searchHistory.length
    : 0;

  const uniqueLocations = new Set(searchHistory.map((s) => s.location)).size;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
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
                Welcome, {profile?.full_name || user.email?.split("@")[0]}!
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
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
              <p className="text-3xl font-display font-bold">{searchHistory.length}</p>
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
                {avgPrice > 0 ? `₹${avgPrice.toFixed(1)}L` : "—"}
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
              <p className="text-3xl font-display font-bold">{uniqueLocations}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Price Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Price Trends by Location
              </CardTitle>
              <CardDescription>
                Average property prices across different Bangalore areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PriceTrendsChart />
            </CardContent>
          </Card>
        </motion.div>

        {/* Search History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Recent Searches
              </CardTitle>
              <CardDescription>
                Your property price prediction history
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
                  <p className="text-muted-foreground">No searches yet</p>
                  <Button
                    variant="link"
                    onClick={() => navigate("/")}
                    className="mt-2"
                  >
                    Make your first prediction
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchHistory.map((search, index) => (
                    <motion.div
                      key={search.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="font-medium capitalize">
                            {search.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{search.sqft} sqft</span>
                          <span>{search.bhk} BHK</span>
                          <span>{search.bath} Bath</span>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className="font-display font-bold text-lg text-primary">
                            ₹{Number(search.predicted_price).toFixed(1)}L
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(search.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteSearch(search.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
