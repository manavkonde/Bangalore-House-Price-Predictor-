import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, X, MapPin, Maximize, BedDouble, Bath, TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
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
import { getLocations, predictPrice } from "@/services/api";
import { toast } from "sonner";

interface ComparisonProperty {
  id: string;
  location: string;
  sqft: number;
  bhk: number;
  bath: number;
  price: number;
}

export function LocationComparison() {
  const [properties, setProperties] = useState<ComparisonProperty[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [locations, setLocations] = useState<string[]>([]);
  const [newProperty, setNewProperty] = useState({
    location: "",
    sqft: "",
    bhk: "",
    bath: "",
  });
  const [openLocation, setOpenLocation] = useState(false);

  useEffect(() => {
    const fetchLocs = async () => {
      try {
        const locs = await getLocations();
        setLocations(locs);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        toast.error("Connecting to backend failed. Using fallback locations.");
        setLocations(["indira nagar", "whitefield", "koramangala", "hsr layout"]);
      }
    };
    fetchLocs();
  }, []);

  const addProperty = async () => {
    if (!newProperty.location || !newProperty.sqft || !newProperty.bhk || !newProperty.bath) {
      toast.error("Please fill all fields");
      return;
    }

    setIsAdding(true);
    try {
      const sqft = parseFloat(newProperty.sqft);
      const bhk = parseInt(newProperty.bhk);
      const bath = parseInt(newProperty.bath);

      const price = await predictPrice({
        location: newProperty.location,
        total_sqft: sqft,
        bhk,
        bath
      });

      setProperties([
        ...properties,
        {
          id: Date.now().toString(),
          location: newProperty.location,
          sqft,
          bhk,
          bath,
          price,
        },
      ]);

      setNewProperty({ location: "", sqft: "", bhk: "", bath: "" });
      setShowAddForm(false);
      toast.success(`Property in ${newProperty.location} added!`);
    } catch (error) {
      console.error("Failed to predict price:", error);
      toast.error("Backend error. Make sure the server is running on port 8888.");
    } finally {
      setIsAdding(false);
    }
  };

  const removeProperty = (id: string) => {
    setProperties(properties.filter((p) => p.id !== id));
  };

  const getMinMaxPrice = () => {
    if (properties.length === 0) return { min: 0, max: 0 };
    const prices = properties.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  };

  const { min, max } = getMinMaxPrice();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold mb-2">Compare Locations</h2>
        <p className="text-muted-foreground">
          Add properties to compare AI-predicted prices across different areas
        </p>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {properties.map((property, index) => {
          const isMin = property.price === min && properties.length > 1;
          const isMax = property.price === max && properties.length > 1;

          return (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                "relative bg-card border rounded-xl p-5 shadow-card transition-all",
                isMin && "border-green-500/50 bg-green-500/5 ring-1 ring-green-500/20",
                isMax && "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
              )}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeProperty(property.id)}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-semibold capitalize truncate pr-6">{property.location}</h3>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground bg-secondary/50 p-1.5 rounded-lg justify-center">
                  <Maximize className="h-4 w-4" />
                  <span>{property.sqft}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground bg-secondary/50 p-1.5 rounded-lg justify-center">
                  <BedDouble className="h-4 w-4" />
                  <span>{property.bhk} BHK</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground bg-secondary/50 p-1.5 rounded-lg justify-center">
                  <Bath className="h-4 w-4" />
                  <span>{property.bath}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Estimate</p>
                  <p className="text-2xl font-display font-bold text-primary">
                    ₹{property.price.toFixed(1)}L
                  </p>
                </div>
                {properties.length > 1 && (
                  <div className="flex items-center gap-1">
                    {isMin && (
                      <span className="flex items-center gap-1 text-green-600 text-xs font-bold px-2 py-1 bg-green-500/10 rounded-full">
                        <TrendingDown className="h-3 w-3" />
                        BEST DEAL
                      </span>
                    )}
                    {isMax && (
                      <span className="flex items-center gap-1 text-primary text-xs font-bold px-2 py-1 bg-primary/10 rounded-full">
                        <TrendingUp className="h-3 w-3" />
                        PREMIUM
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Add Property Card */}
        {showAddForm ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border-2 border-primary/30 rounded-xl p-5 shadow-lg shadow-primary/5"
          >
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-bold text-muted-foreground uppercase">Location</Label>
                <Popover open={openLocation} onOpenChange={setOpenLocation}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1 border-gray-200 h-10",
                        !newProperty.location && "text-muted-foreground"
                      )}
                    >
                      <MapPin className="mr-2 h-4 w-4 text-primary" />
                      <span className="truncate">
                        {newProperty.location || "Select locality..."}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search areas..." />
                      <CommandList>
                        <CommandEmpty>No location found.</CommandEmpty>
                        <CommandGroup className="max-h-[250px] overflow-y-auto">
                          {locations.map((loc) => (
                            <CommandItem
                              key={loc}
                              value={loc}
                              onSelect={() => {
                                setNewProperty({ ...newProperty, location: loc });
                                setOpenLocation(false);
                              }}
                              className="capitalize"
                            >
                              {loc}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Sqft</Label>
                    <Input
                      type="number"
                      placeholder="1200"
                      value={newProperty.sqft}
                      onChange={(e) => setNewProperty({ ...newProperty, sqft: e.target.value })}
                      className="h-10 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">BHK</Label>
                    <Input
                      type="number"
                      placeholder="2"
                      value={newProperty.bhk}
                      onChange={(e) => setNewProperty({ ...newProperty, bhk: e.target.value })}
                      className="h-10 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Bath</Label>
                    <Input
                      type="number"
                      placeholder="2"
                      value={newProperty.bath}
                      onChange={(e) => setNewProperty({ ...newProperty, bath: e.target.value })}
                      className="h-10 mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={addProperty}
                  className="flex-1 h-10 font-bold"
                  disabled={isAdding}
                >
                  {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get Estimate"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewProperty({ location: "", sqft: "", bhk: "", bath: "" });
                  }}
                  className="h-10 font-bold"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(true)}
            className="flex flex-col items-center justify-center gap-3 min-h-[220px] border-2 border-dashed border-primary/20 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all group"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <Plus className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
            </div>
            <div className="text-center">
              <span className="block font-bold text-primary">Add Property</span>
              <span className="text-xs text-muted-foreground">To compare predictions</span>
            </div>
          </motion.button>
        )}
      </div>

      {/* Comparison Summary */}
      {properties.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 rounded-2xl p-6 border border-primary/10 shadow-inner"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-bold text-lg">Market Comparison Insights</h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Lowest Estimate</p>
              <p className="text-2xl font-black text-green-600">₹{min.toFixed(1)}L</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Highest Estimate</p>
              <p className="text-2xl font-black text-primary">₹{max.toFixed(1)}L</p>
            </div>
            <div className="space-y-1 border-l pl-6 border-primary/10">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Price Variance</p>
              <p className="text-2xl font-black text-blue-600">₹{(max - min).toFixed(1)}L</p>
            </div>
            <div className="space-y-1 border-l pl-6 border-primary/10">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Average / Unit</p>
              <p className="text-2xl font-black text-gray-800">
                ₹{(properties.reduce((sum, p) => sum + p.price, 0) / properties.length).toFixed(1)}L
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
