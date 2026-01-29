import { motion } from "framer-motion";
import {
  GraduationCap,
  Hospital,
  Trees,
  UtensilsCrossed,
  Train,
  ShoppingBag,
  Star,
  MapPin
} from "lucide-react";
import { generateNearbyAmenities, AMENITY_TYPES } from "@/data/locations";
import { cn } from "@/lib/utils";

interface NearbyAmenitiesProps {
  location: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  school: GraduationCap,
  hospital: Hospital,
  park: Trees,
  restaurant: UtensilsCrossed,
  transport: Train,
  shopping: ShoppingBag,
};

const colorMap: Record<string, string> = {
  school: "bg-blue-500/10 text-blue-600",
  hospital: "bg-red-500/10 text-red-500",
  park: "bg-green-500/10 text-green-600",
  restaurant: "bg-amber-500/10 text-amber-600",
  transport: "bg-purple-500/10 text-purple-600",
  shopping: "bg-pink-500/10 text-pink-500",
};

import { useAmenities } from "@/lib/osm";
import { getLocationCoordinates } from "@/data/locations";

// ... imports remain ...

export function NearbyAmenities({ location }: NearbyAmenitiesProps) {
  const locationCoords = getLocationCoordinates(location);
  const { data: osmAmenities, isLoading } = useAmenities(locationCoords[1], locationCoords[0]);

  const amenities = osmAmenities || [];

  const groupedAmenities = AMENITY_TYPES.reduce((acc, type) => {
    acc[type.id] = amenities.filter((a) => a.type === type.id);
    return acc;
  }, {} as Record<string, typeof amenities>);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading nearby amenities...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-display font-semibold">Nearby Amenities</h3>
        <span className="text-sm text-muted-foreground capitalize">in {location}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AMENITY_TYPES.map((type, typeIndex) => {
          const Icon = iconMap[type.id];
          const typeAmenities = groupedAmenities[type.id] || [];

          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: typeIndex * 0.1 }}
              className="bg-card rounded-xl p-4 shadow-card border border-border/50 hover:shadow-hover transition-shadow duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colorMap[type.id])}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{type.label}</h4>
                  <p className="text-xs text-muted-foreground">{typeAmenities.length} nearby</p>
                </div>
              </div>

              <div className="space-y-2">
                {typeAmenities.slice(0, 2).map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm bg-muted/30 rounded-lg p-2"
                  >
                    <span className="truncate flex-1">{amenity.name}</span>
                    <div className="flex items-center gap-2 ml-2 shrink-0">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        <span className="text-xs text-muted-foreground">{amenity.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{amenity.distance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
