import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { PredictionForm } from "@/components/PredictionForm";
import { PriceResult } from "@/components/PriceResult";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { predictPrice } from "@/services/api";
import { Calculator, Sparkles, TrendingUp, BarChart3 } from "lucide-react";

interface PredictionData {
  city: string;
  location: string;
  sqft: number;
  bhk: number;
  bath: number;
}

interface PredictionResult extends PredictionData {
  price: number;
  confidence?: "HIGH" | "MEDIUM" | "LOW";
  warning?: string;
  priceRange?: {
    min: number;
    max: number;
    median: number;
    [key: string]: number;
  };
  dataPoints?: number;
}

export default function EstimatePricePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const { user } = useAuth();
  const hasAutoTriggered = useRef(false);

  // F3: Auto-fill from shared URL params
  useEffect(() => {
    if (hasAutoTriggered.current) return;
    const params = new URLSearchParams(window.location.search);
    const city = params.get("city");
    const location = params.get("location");
    const sqft = params.get("sqft");
    const bhk = params.get("bhk");
    const bath = params.get("bath");

    if (city && location && sqft && bhk && bath) {
      hasAutoTriggered.current = true;
      handlePredict({
        city,
        location,
        sqft: Number(sqft),
        bhk: Number(bhk),
        bath: Number(bath),
      });
    }
  }, []);
  const handlePredict = async (data: PredictionData) => {
    setIsLoading(true);

    try {
      // Call the new city-wise API
      const response = await predictPrice({
        city: data.city,
        location: data.location,
        total_sqft: data.sqft,
        bhk: data.bhk,
        bath: data.bath,
      });

      setResult({
        ...data,
        price: response.predicted_price || 0,
        confidence: response.confidence || "HIGH",
        warning: response.warning,
        priceRange: response.price_range,
        dataPoints: response.data_points_used || 0,
      });
      toast.success("AI prediction completed!");

      // Save to search history if user is logged in
      if (user) {
        const { error } = await supabase.from("search_history").insert({
          user_id: user.id,
          location: data.location,
          sqft: data.sqft,
          bhk: data.bhk,
          bath: data.bath,
          predicted_price: response.predicted_price || 0,
          city: data.city,
        });

        if (error) {
          console.error("Failed to save search:", error);
        } else {
          toast.info("Search saved to your dashboard.");
        }
      }
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error("Prediction Failed. Ensure backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      {/* Page Header with visual accent */}
      <div className="relative mb-8">
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-full blur-3xl" />
        <PageHeader
          title="Estimate Property Price"
          description="Enter property details to get an AI-powered price prediction from our trained model"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          {/* Subtle gradient border effect */}
          <div className="absolute -inset-[1px] bg-gradient-to-br from-amber-500/20 via-transparent to-blue-500/10 rounded-3xl" />
          <div className="relative bg-white rounded-3xl p-8 shadow-card border border-border/30">
            {/* Form header decoration */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center shadow-lg">
                <Calculator className="h-6 w-6 text-gold-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">Property Details</h3>
                <p className="text-xs text-muted-foreground">Fill in all fields for accurate prediction</p>
              </div>
            </div>
            <PredictionForm onPredict={handlePredict} isLoading={isLoading} />
          </div>
        </motion.div>

        {/* Result Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col h-full"
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading-skeleton"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full min-h-[500px] bg-card rounded-3xl border border-border/30 p-6 flex flex-col space-y-6 overflow-hidden shadow-card relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-6 w-32 rounded-lg" />
                  <Skeleton className="h-12 w-3/4 rounded-xl" />
                  <Skeleton className="h-4 w-48 rounded-lg" />
                </div>
                
                <div className="pt-4 border-t border-border/30 space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                     {[1, 2, 3, 4].map((i) => (
                       <div key={i} className="flex gap-3">
                         <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                         <div className="space-y-2 flex-1">
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-3 w-1/2" />
                         </div>
                       </div>
                     ))}
                   </div>
                </div>

                <div className="mt-8 flex gap-3">
                   <Skeleton className="h-12 flex-1 rounded-xl" />
                   <Skeleton className="h-12 flex-1 rounded-xl" />
                </div>
              </motion.div>
            ) : result ? (
              <PriceResult
                key="result"
                price={result.price}
                city={result.city}
                location={result.location}
                sqft={result.sqft}
                bhk={result.bhk}
                bath={result.bath}
                confidence={result.confidence}
                warning={result.warning}
                priceRange={result.priceRange}
                dataPoints={result.dataPoints}
              />
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[450px] bg-gradient-to-br from-navy-800 to-navy-900 rounded-3xl border border-white/5 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden"
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative z-10">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center mb-6 mx-auto border border-amber-500/20"
                  >
                    <Sparkles className="w-10 h-10 text-gold-400/60" />
                  </motion.div>
                  <h3 className="text-xl font-display font-bold text-white mb-3">Ready for Valuation</h3>
                  <p className="text-white/40 max-w-xs leading-relaxed text-sm">
                    Fill in the property details on the left to generate an instant AI market estimate.
                  </p>
                  
                  {/* Loading dots */}
                  <div className="mt-8 flex gap-2 justify-center">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="h-2 w-2 rounded-full bg-gold-500/30"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>

                  {/* Feature hints */}
                  <div className="mt-10 flex flex-wrap justify-center gap-3">
                    {[
                      { icon: TrendingUp, label: "5Y Forecast" },
                      { icon: BarChart3, label: "Price/Sqft" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                        <item.icon className="h-3.5 w-3.5 text-gold-400/50" />
                        <span className="text-[11px] text-white/30 font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AppLayout>
  );
}
