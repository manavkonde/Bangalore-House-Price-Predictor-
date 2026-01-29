import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  GraduationCap,
  Hospital,
  Trees,
  UtensilsCrossed,
  Train,
  ShoppingBag,
  Star,
  Filter,
  Search
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BANGALORE_LOCATIONS, getLocationCoordinates, AMENITY_TYPES } from "@/data/locations";
import { useAmenities } from "@/lib/osm";
import { cn } from "@/lib/utils";

// Fix for default marker icons
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  school: GraduationCap,
  hospital: Hospital,
  park: Trees,
  restaurant: UtensilsCrossed,
  transport: Train,
  shopping: ShoppingBag,
};

const colorMap: Record<string, string> = {
  school: "bg-blue-500/10 text-blue-600 border-blue-200",
  hospital: "bg-red-500/10 text-red-500 border-red-200",
  park: "bg-green-500/10 text-green-600 border-green-200",
  restaurant: "bg-amber-500/10 text-amber-600 border-amber-200",
  transport: "bg-purple-500/10 text-purple-600 border-purple-200",
  shopping: "bg-pink-500/10 text-pink-500 border-pink-200",
};

const markerColors: Record<string, string> = {
  school: "#3b82f6",
  hospital: "#ef4444",
  park: "#22c55e",
  restaurant: "#f59e0b",
  transport: "#a855f7",
  shopping: "#ec4899",
};

// Map controller component
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);

  return null;
}

// Create colored marker icon
const createAmenityIcon = (type: string) =>
  L.divIcon({
    className: "amenity-marker",
    html: `
      <div class="w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white" style="background-color: ${markerColors[type] || '#6b7280'}">
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });

export default function NearbyAmenitiesPage() {
  const [selectedLocation, setSelectedLocation] = useState<string>("koramangala");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const locationCoords = getLocationCoordinates(selectedLocation);
  const { data: osmAmenities, isLoading } = useAmenities(locationCoords[1], locationCoords[0]);

  const amenities = useMemo(() => {
    if (!osmAmenities) return [];
    return osmAmenities.map(a => ({
      ...a,
      coords: [a.lon, a.lat] as [number, number], // Map for Leaflet [lon, lat] adjustment if needed or generic usage
    }));
  }, [osmAmenities]);

  const filteredAmenities = amenities.filter((amenity) => {
    const matchesCategory = selectedCategory === "all" || amenity.type === selectedCategory;
    const matchesSearch = amenity.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedAmenities = AMENITY_TYPES.reduce((acc, type) => {
    acc[type.id] = filteredAmenities.filter((a) => a.type === type.id);
    return acc;
  }, {} as Record<string, typeof filteredAmenities>);

  // Removed duplicate locationCoords definition since it is defined above

  return (
    <AppLayout>
      <PageHeader
        title="Nearby Amenities"
        description="Discover schools, hospitals, parks and more near any location"
      />

      <div className="grid lg:grid-cols-[1fr,400px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-4"
          >
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {BANGALORE_LOCATIONS.slice(0, 50).map((loc) => (
                  <SelectItem key={loc} value={loc} className="capitalize">
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search amenities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2"
          >
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              <Filter className="h-4 w-4 mr-2" />
              All
            </Button>
            {AMENITY_TYPES.map((type) => {
              const Icon = iconMap[type.id];
              return (
                <Button
                  key={type.id}
                  variant={selectedCategory === type.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(type.id)}
                  className={cn(
                    selectedCategory !== type.id && colorMap[type.id]
                  )}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {type.label}
                </Button>
              );
            })}
          </motion.div>

          {/* Mini Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-[300px] rounded-2xl overflow-hidden shadow-card border border-border/50 relative"
          >
            {isLoading && (
              <div className="absolute inset-0 z-[1000] bg-background/50 backdrop-blur-sm flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
            <MapContainer
              center={[locationCoords[1], locationCoords[0]]}
              zoom={14}
              className="h-full w-full"
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapController
                center={[locationCoords[1], locationCoords[0]]}
                zoom={14}
              />

              {/* Location Marker */}
              <Marker position={[locationCoords[1], locationCoords[0]]}>
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold capitalize">{selectedLocation}</h3>
                    <p className="text-sm text-muted-foreground">Selected Location</p>
                  </div>
                </Popup>
              </Marker>

              {/* Amenity Markers */}
              {filteredAmenities.map((amenity, index) => (
                <Marker
                  key={`${amenity.name}-${index}`}
                  position={[amenity.coords[1], amenity.coords[0]]}
                  icon={createAmenityIcon(amenity.type)}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">{amenity.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          {/* OSM doesn't give ratings, but we kept them in the interface */}
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          <span className="text-sm">{amenity.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{amenity.distance}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </motion.div>

          {/* Amenity Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {AMENITY_TYPES.map((type) => {
              const Icon = iconMap[type.id];
              const typeAmenities = groupedAmenities[type.id] || [];

              if (selectedCategory !== "all" && selectedCategory !== type.id) {
                return null;
              }

              return (
                <Card key={type.id} className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", colorMap[type.id])}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {type.label}
                      <Badge variant="secondary" className="ml-auto">
                        {typeAmenities.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {typeAmenities.slice(0, 3).map((amenity, idx) => (
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
                    {typeAmenities.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        No {type.label.toLowerCase()} found
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        </div>

        {/* Sidebar - All Amenities List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block"
        >
          <Card className="sticky top-4 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                All Nearby
                <Badge variant="secondary">{filteredAmenities.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[calc(100vh-300px)] overflow-y-auto space-y-2">
              {filteredAmenities.map((amenity, index) => {
                const Icon = iconMap[amenity.type];
                return (
                  <div
                    key={`${amenity.name}-${index}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", colorMap[amenity.type])}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{amenity.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{amenity.type}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        <span className="text-xs">{amenity.rating}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{amenity.distance}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
