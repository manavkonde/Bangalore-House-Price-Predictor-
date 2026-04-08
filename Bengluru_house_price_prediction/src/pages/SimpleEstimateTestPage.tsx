import { useState } from "react";
import { SimplePredictionForm } from "@/components/SimplePredictionForm";
import { predictPrice } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export function SimpleEstimateTestPage() {
  const [result, setResult] = useState<{ price: number; city: string; location: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePredict = async (data: {
    city: string;
    location: string;
    sqft: number;
    bhk: number;
    bath: number;
  }) => {
    setIsLoading(true);
    try {
      const price = await predictPrice({
        city: data.city,
        location: data.location,
        total_sqft: data.sqft,
        bhk: data.bhk,
        bath: data.bath,
      });

      setResult({
        price,
        city: data.city,
        location: data.location,
      });

      toast({
        title: "Success",
        description: `Price predicted: Rs. ${price.toLocaleString('en-IN')}`,
      });
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        title: "Error",
        description: "Failed to predict price. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Simple Form Test</h1>
          <p className="text-muted-foreground">
            This is a test page using simple HTML select dropdowns to debug location display issues.
          </p>
        </div>

        <SimplePredictionForm onPredict={handlePredict} isLoading={isLoading} />

        {result && (
          <div className="mt-8 p-6 bg-green-50 border-2 border-green-300 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Predicted Price</h2>
            <p className="text-lg mb-2">
              <strong>Location:</strong> {result.location}, {result.city}
            </p>
            <p className="text-xl font-bold text-green-600">
              Rs. {result.price.toLocaleString('en-IN')}
            </p>
          </div>
        )}

        <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
          <h3 className="font-bold mb-2">How to use this page:</h3>
          <ol style={{ listStyleType: "decimal", paddingLeft: "20px" }}>
            <li>Select a city from the dropdown</li>
            <li>Wait for locations to load (should say "Loading locations..." initially)</li>
            <li>Once loaded, select a location from the location dropdown</li>
            <li>Fill in other details and click "Estimate Price"</li>
            <li>Open browser console (F12) to see debug logs with tag [SimplePredictionForm]</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default SimpleEstimateTestPage;
