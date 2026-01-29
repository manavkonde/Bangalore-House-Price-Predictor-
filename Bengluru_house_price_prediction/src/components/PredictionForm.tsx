import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Bath, BedDouble, Maximize, MapPin, Sparkles, Loader2 } from "lucide-react";
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
import { getLocations } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface PredictionFormProps {
  onPredict: (data: {
    location: string;
    sqft: number;
    bhk: number;
    bath: number;
  }) => void;
  isLoading?: boolean;
}

export function PredictionForm({ onPredict, isLoading }: PredictionFormProps) {
  const [location, setLocation] = useState("");
  const [sqft, setSqft] = useState("");
  const [bhk, setBhk] = useState("");
  const [bath, setBath] = useState("");
  const [openLocation, setOpenLocation] = useState(false);
  const [locations, setLocations] = useState<string[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const fetchedLocations = await getLocations();
        setLocations(fetchedLocations);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
        toast({
          title: "Error",
          description: "Failed to load locations. Please check if the backend is running.",
          variant: "destructive",
        });
        // Fallback to empty array
        setLocations([]);
      } finally {
        setLocationsLoading(false);
      }
    };

    fetchLocations();
  }, [toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location && sqft && bhk && bath) {
      onPredict({
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
      className="space-y-5"
    >
      {/* Location Selector */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-medium text-foreground">
          Location
        </Label>
        <Popover open={openLocation} onOpenChange={setOpenLocation}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openLocation}
              className={cn(
                "w-full h-12 justify-start text-left font-normal border-border/50 hover:border-primary bg-card",
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
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search location..." />
              <CommandList>
                <CommandEmpty>No location found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {locations.map((loc) => (
                    <CommandItem
                      key={loc}
                      value={loc}
                      onSelect={() => {
                        setLocation(loc);
                        setOpenLocation(false);
                      }}
                      className="capitalize"
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
        disabled={!location || !sqft || !bhk || !bath || isLoading}
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
