import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { PredictionForm } from "@/components/PredictionForm";
import { PriceResult } from "@/components/PriceResult";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { predictPrice } from "@/services/api";
import { Calculator } from "lucide-react";

interface PredictionData {
  location: string;
  sqft: number;
  bhk: number;
  bath: number;
}

interface PredictionResult extends PredictionData {
  price: number;
}

export default function EstimatePricePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const { user } = useAuth();

  const handlePredict = async (data: PredictionData) => {
    setIsLoading(true);

    try {
      // Call the real backend API (connected to port 8888)
      const price = await predictPrice({
        location: data.location,
        total_sqft: data.sqft,
        bhk: data.bhk,
        bath: data.bath,
      });

      setResult({ ...data, price });
      toast.success("AI prediction completed!");

      // Save to search history if user is logged in
      if (user) {
        const { error } = await supabase.from("search_history").insert({
          user_id: user.id,
          location: data.location,
          sqft: data.sqft,
          bhk: data.bhk,
          bath: data.bath,
          predicted_price: price,
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
      <PageHeader
        title="Estimate Property Price"
        description="Enter property details to get an AI-powered price prediction from our trained model"
      />

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto py-8">
        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-8 shadow-card border border-border/40"
        >
          <PredictionForm onPredict={handlePredict} isLoading={isLoading} />
        </motion.div>

        {/* Result Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <AnimatePresence mode="wait">
            {result ? (
              <PriceResult
                key="result"
                price={result.price}
                location={result.location}
                sqft={result.sqft}
                bhk={result.bhk}
                bath={result.bath}
              />
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[400px] bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                  <Calculator className="w-10 h-10 text-primary/40" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Ready for Valuation</h3>
                <p className="text-slate-500 max-w-xs leading-relaxed">
                  Fill in the property details on the left to generate an instant AI market estimate.
                </p>
                <div className="mt-8 flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-slate-200" />
                  <div className="h-2 w-2 rounded-full bg-slate-200" />
                  <div className="h-2 w-2 rounded-full bg-slate-200" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AppLayout>
  );
}

