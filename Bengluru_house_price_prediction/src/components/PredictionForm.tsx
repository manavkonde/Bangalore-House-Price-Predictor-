import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Bath, BedDouble, Maximize, MapPin, Sparkles, Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

export function PredictionForm({ onPredict, isLoading }: PredictionFormProps) {
  const [city, setCity] = useState("delhi");
  const [location, setLocation] = useState("");
  const [sqft, setSqft] = useState("");
  const [bhk, setBhk] = useState("");
  const [bath, setBath] = useState("");
  const [openLocation, setOpenLocation] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const [locations, setLocations] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>(["delhi", "bengaluru", "chennai", "hyderabad", "kolkata", "combined"]);
  const [locationsLoading, setLocationsLoading] = useState(true);
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
      console.log(`[DEBUG] Fetching locations for city: ${city}`);
      try {
        const fetchedLocations = await getLocations(city);
        console.log(`[DEBUG] Fetched locations:`, fetchedLocations);
        console.log(`[DEBUG] Locations type:`, typeof fetchedLocations);
        console.log(`[DEBUG] Locations is array:`, Array.isArray(fetchedLocations));
        console.log(`[DEBUG] Locations count:`, fetchedLocations?.length || 0);
        setLocations(fetchedLocations);
        setLocation(""); // Reset location when city changes
      } catch (error) {
        console.error('Failed to fetch locations:', error);
        toast({
          title: "Error",
          description: "Failed to load locations. Please check if the backend is running.",
          variant: "destructive",
        });
        setLocations([]);
      } finally {
        setLocationsLoading(false);
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

  const inputClasses = "h-12 md:h-11 min-h-[44px] bg-muted/30 border-border/50 focus:border-primary focus:ring-primary/20 text-base pl-11 rounded-xl font-body transition-all duration-200 hover:border-primary/30";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* City Selector */}
      <div className="space-y-2">
        <Label htmlFor="city" className="text-sm font-semibold text-foreground flex items-center gap-2 font-body">
          <Globe className="h-4 w-4 text-primary" /> City
        </Label>
        <Popover open={openCity} onOpenChange={setOpenCity}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openCity}
              className="w-full h-12 justify-start text-left font-normal border-border/50 hover:border-primary/40 bg-muted/30 rounded-xl transition-all duration-200"
            >
              <Globe className="mr-2 h-4 w-4 text-primary" />
              {city ? cities.find((c) => c === city) || city : "Select city..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 rounded-xl border-border/50 shadow-lg" align="start">
            <Command>
              <CommandInput placeholder="Search city..." />
              <CommandList>
                <CommandEmpty>No city found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {cities.map((c) => (
                    <CommandItem
                      key={c}
                      value={c}
                      onSelect={(currentValue) => {
                        const selectedCity = cities.find(ct => ct.toLowerCase() === currentValue.toLowerCase()) || currentValue;
                        setCity(selectedCity);
                        setOpenCity(false);
                      }}
                      className="capitalize rounded-lg"
                    >
                      <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Location Selector */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-semibold text-foreground flex items-center gap-2 font-body">
          <MapPin className="h-4 w-4 text-primary" /> Location
        </Label>
        <Popover open={openLocation} onOpenChange={setOpenLocation}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openLocation}
              className={cn(
                "w-full h-12 justify-start text-left font-normal border-border/50 hover:border-primary/40 bg-muted/30 rounded-xl transition-all duration-200",
                !location && "text-muted-foreground"
              )}
              disabled={locationsLoading}
            >
              {locationsLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
              ) : (
                <MapPin className="mr-2 h-4 w-4 text-primary" />
              )}
              {location
                ? locations.find((l) => l === location) || location
                : locationsLoading ? "Loading locations..." : "Select location..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 rounded-xl border-border/50 shadow-lg" align="start">
            <Command>
              <CommandInput placeholder="Search location..." />
              <CommandList>
                <CommandEmpty>No location found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {locations.map((loc) => (
                    <CommandItem
                      key={loc}
                      value={loc}
                      onSelect={(currentValue) => {
                        const selectedLoc = locations.find(l => l.toLowerCase() === currentValue.toLowerCase()) || currentValue;
                        setLocation(selectedLoc);
                        setOpenLocation(false);
                      }}
                      className="capitalize rounded-lg"
                    >
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      {loc}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Square Feet */}
      <div className="space-y-2">
        <Label htmlFor="sqft" className="text-sm font-semibold text-foreground flex items-center gap-2 font-body">
          <Maximize className="h-4 w-4 text-primary" /> Total Square Feet
        </Label>
        <div className="relative">
          <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/60" />
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
          <Label htmlFor="bhk" className="text-sm font-semibold text-foreground flex items-center gap-2 font-body">
            <BedDouble className="h-4 w-4 text-primary" /> BHK
          </Label>
          <div className="relative">
            <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/60" />
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
          <Label htmlFor="bath" className="text-sm font-semibold text-foreground flex items-center gap-2 font-body">
            <Bath className="h-4 w-4 text-primary" /> Bathrooms
          </Label>
          <div className="relative">
            <Bath className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/60" />
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
        size="xl"
        className="w-full mt-6 min-h-[52px] text-base rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-navy-900 font-bold shadow-gold border-0 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
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
            <Home className="h-5 w-5 mr-2" />
            Predict Price
          </>
        )}
      </Button>
    </motion.form>
  );
}
