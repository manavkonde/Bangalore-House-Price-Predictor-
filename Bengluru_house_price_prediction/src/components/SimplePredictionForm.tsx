import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Bath, BedDouble, Maximize, MapPin, Sparkles, Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getLocations, getCities } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface PredictionFormProps {
  onPredict: (data: {
    city: string;
    location: string;
    sqft: number;
    bhk: number;
    bath: number;
  }) => void;
  isLoading?: boolean;
}

export function SimplePredictionForm({ onPredict, isLoading }: PredictionFormProps) {
  const [city, setCity] = useState("delhi");
  const [location, setLocation] = useState("");
  const [sqft, setSqft] = useState("");
  const [bhk, setBhk] = useState("");
  const [bath, setBath] = useState("");
  const [locations, setLocations] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>(["delhi", "bengaluru", "chennai", "hyderabad", "kolkata", "combined"]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  // Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const fetchedCities = await getCities();
        setCities(fetchedCities);
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      }
    };
    fetchCities();
  }, []);

  // Fetch locations when city changes
  useEffect(() => {
    const fetchLocations = async () => {
      setLocationsLoading(true);
      setError("");
      console.log(`[SimplePredictionForm] ===== START FETCH =====`);
      console.log(`[SimplePredictionForm] City: ${city}`);
      try {
        console.log(`[SimplePredictionForm] Calling getLocations(${city})`);
        const fetchedLocations = await getLocations(city);
        console.log(`[SimplePredictionForm] getLocations returned:`, fetchedLocations);
        console.log(`[SimplePredictionForm] Type:`, typeof fetchedLocations);
        console.log(`[SimplePredictionForm] Is array:`, Array.isArray(fetchedLocations));
        console.log(`[SimplePredictionForm] Length:`, fetchedLocations?.length || 0);

        if (!fetchedLocations || fetchedLocations.length === 0) {
          console.warn(`[SimplePredictionForm] No locations returned!`);
          setError("No locations found. Check console for API errors.");
        }

        setLocations(fetchedLocations);
        setLocation(""); // Reset location when city changes
        console.log(`[SimplePredictionForm] State updated, locations count:`, fetchedLocations?.length || 0);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error('[SimplePredictionForm] ERROR:', errorMsg);
        console.error('[SimplePredictionForm] Full error:', error);
        setError(`Failed to fetch locations: ${errorMsg}`);
        toast({
          title: "Error",
          description: "Failed to load locations. Check console for details.",
          variant: "destructive",
        });
        setLocations([]);
      } finally {
        setLocationsLoading(false);
        console.log(`[SimplePredictionForm] ===== END FETCH =====`);
      }
    };

    fetchLocations();
  }, [city, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city && location && sqft && bhk && bath) {
      onPredict({
        city,
        location,
        sqft: parseInt(sqft),
        bhk: parseInt(bhk),
        bath: parseInt(bath),
      });
    }
  };

  const inputClasses = "h-12 bg-card border-border/50 focus:border-primary focus:ring-primary/20 text-base pl-11";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onSubmit={handleSubmit}
      className="space-y-5 p-6 bg-blue-50 border-2 border-blue-300 rounded-lg"
    >
      <div style={{ padding: "10px", backgroundColor: "#fff3cd", borderRadius: "4px", marginBottom: "20px" }}>
        <strong>TEST MODE (Simple Select Dropdowns)</strong>
        <p style={{ fontSize: "12px", color: "#666" }}>
          This is a simplified test version using basic HTML select elements instead of the Command component.
        </p>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>

      {/* City Selector - Simple Select */}
      <div className="space-y-2">
        <Label htmlFor="city" className="text-sm font-medium text-foreground flex items-center gap-2">
          <Globe className="h-4 w-4" /> City
        </Label>
        <select
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={inputClasses}
        >
          {cities.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Location Selector - Simple Select */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-medium text-foreground">
          Location
        </Label>
        {locationsLoading ? (
          <div className={cn(inputClasses, "flex items-center")}>
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
            Loading locations...
          </div>
        ) : locations.length === 0 ? (
          <div className={cn(inputClasses, "flex items-center text-red-500")}>
            No locations found! Check console for errors.
          </div>
        ) : (
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={inputClasses}
          >
            <option value="">Select location...</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Debug Info */}
      <div style={{
        padding: "10px",
        backgroundColor: "#e3f2fd",
        borderRadius: "4px",
        fontSize: "12px",
        fontFamily: "monospace"
      }}>
        <p>City: {city}</p>
        <p>Locations fetched: {locations.length}</p>
        <p>Current location selected: {location || "None"}</p>
      </div>

      {/* Square Feet */}
      <div className="space-y-2">
        <Label htmlFor="sqft" className="text-sm font-medium text-foreground">
          Total Square Feet
        </Label>
        <div className="relative">
          <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
          <Input
            id="sqft"
            type="number"
            placeholder="e.g., 1200"
            value={sqft}
            onChange={(e) => setSqft(e.target.value)}
            className={inputClasses}
            min="100"
            max="50000"
          />
        </div>
      </div>

      {/* BHK & Bathrooms Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bhk" className="text-sm font-medium text-foreground">
            BHK
          </Label>
          <div className="relative">
            <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            <Input
              id="bhk"
              type="number"
              placeholder="2"
              value={bhk}
              onChange={(e) => setBhk(e.target.value)}
              className={inputClasses}
              min="1"
              max="10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bath" className="text-sm font-medium text-foreground">
            Bathrooms
          </Label>
          <div className="relative">
            <Bath className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            <Input
              id="bath"
              type="number"
              placeholder="2"
              value={bath}
              onChange={(e) => setBath(e.target.value)}
              className={inputClasses}
              min="1"
              max="10"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="hero"
        size="xl"
        className="w-full mt-6"
        disabled={!city || !location || !sqft || !bhk || !bath || isLoading}
      >
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
            Predicting...
          </>
        ) : (
          <>
            <Home className="h-5 w-5" />
            Estimate Price
          </>
        )}
      </Button>
    </motion.form>
  );
}
