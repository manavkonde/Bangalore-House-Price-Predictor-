import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Layers,
  Search,
  Building2,
  GraduationCap,
  Hospital,
  Train,
  ShoppingCart,
  Trees,
  UtensilsCrossed,
  Star,
  IndianRupee,
  X
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BANGALORE_LOCATIONS, getLocationCoordinates, LOCATION_COORDINATES } from "@/data/locations";
import { cn } from "@/lib/utils";

// Price categories for marker colors
type PriceCategory = "affordable" | "midrange" | "premium";

const priceColors: Record<PriceCategory, string> = {
  affordable: "#22c55e", // Green
  midrange: "#f97316",   // Orange
  premium: "#ef4444",    // Red
};

const priceCategoryLabels: Record<PriceCategory, string> = {
  affordable: "Affordable (< ₹50L)",
  midrange: "Mid-range (₹50L - ₹1Cr)",
  premium: "Premium (> ₹1Cr)",
};

// Amenity configuration
const amenityConfig = {
  school: { icon: GraduationCap, color: "#3b82f6", label: "Schools & Colleges", emoji: "🏫" },
  hospital: { icon: Hospital, color: "#ef4444", label: "Hospitals & Clinics", emoji: "🏥" },
  metro: { icon: Train, color: "#8b5cf6", label: "Metro Stations", emoji: "🚇" },
  supermarket: { icon: ShoppingCart, color: "#ec4899", label: "Supermarkets & Malls", emoji: "🛒" },
  park: { icon: Trees, color: "#22c55e", label: "Parks & Playgrounds", emoji: "🌳" },
  restaurant: { icon: UtensilsCrossed, color: "#f59e0b", label: "Restaurants", emoji: "🍽" },
};

type AmenityType = keyof typeof amenityConfig;

interface PropertyData {
  id: string;
  location: string;
  coords: [number, number];
  price: number;
  sqft: number;
  bhk: number;
  priceCategory: PriceCategory;
}

interface NearbyAmenity {
  id: string;
  name: string;
  type: AmenityType;
  distance: number;
  coords: [number, number];
  rating: number;
}

// Create price-based property marker
const createPropertyIcon = (priceCategory: PriceCategory, isSelected: boolean) =>
  L.divIcon({
    className: "property-marker",
    html: `
      <div class="relative group">
        <div class="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-3 ${isSelected ? 'border-white scale-125' : 'border-white/80'} transition-transform" style="background-color: ${priceColors[priceCategory]}; border: 3px solid white;">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
        ${isSelected ? '<div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45" style="background-color: ' + priceColors[priceCategory] + '; border: 2px solid white;"></div>' : ''}
      </div>
    `,
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -48],
  });

// Create amenity marker
const createAmenityIcon = (type: AmenityType) =>
  L.divIcon({
    className: "amenity-marker",
    html: `
      <div class="w-7 h-7 rounded-full flex items-center justify-center shadow-md text-xs" style="background-color: ${amenityConfig[type].color}; border: 2px solid white;">
        <span>${amenityConfig[type].emoji}</span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });

// Map controller component
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);

  return null;
}

// Get price category based on price
function getPriceCategory(price: number): PriceCategory {
  if (price < 50) return "affordable";
  if (price < 100) return "midrange";
  return "premium";
}

// Generate sample property data
function generatePropertyData(location: string, index: number): PropertyData {
  const coords = getLocationCoordinates(location);
  // Add some variation to coordinates so properties don't overlap
  const offsetCoords: [number, number] = [
    coords[0] + (Math.random() - 0.5) * 0.02,
    coords[1] + (Math.random() - 0.5) * 0.015
  ];

  const price = Math.floor(Math.random() * 150 + 20); // 20L to 170L

  return {
    id: `${location}-${index}`,
    location,
    coords: offsetCoords,
    price,
    sqft: Math.floor(Math.random() * 1500 + 600),
    bhk: Math.floor(Math.random() * 3 + 1),
    priceCategory: getPriceCategory(price),
  };
}

export default function MapPage() {
  const { toast } = useToast();
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapStyle, setMapStyle] = useState<"streets" | "satellite">("streets");
  const [selectedAmenityType, setSelectedAmenityType] = useState<AmenityType | "all">("all");
  const [showAmenities, setShowAmenities] = useState(true);
  const [nearbyAmenities, setNearbyAmenities] = useState<NearbyAmenity[]>([]);
  const [isLoadingAmenities, setIsLoadingAmenities] = useState(false);

  // Generate properties for sample locations
  const properties = useMemo(() => {
    return Object.keys(LOCATION_COORDINATES)
      .filter(k => k !== 'default')
      .map((loc, index) => generatePropertyData(loc, index));
  }, []);

  const sampleLocations = useMemo(() => Object.keys(LOCATION_COORDINATES).filter(k => k !== 'default'), []);


  // Fetch real amenities from Overpass API via edge function
  useEffect(() => {
    async function fetchAmenities() {
      if (!selectedProperty) {
        setNearbyAmenities([]);
        return;
      }

      setIsLoadingAmenities(true);

      try {
        const { data, error } = await supabase.functions.invoke('fetch-nearby-amenities', {
          body: {
            lat: selectedProperty.coords[1], // coords are [lng, lat]
            lng: selectedProperty.coords[0],
            radius: 3000, // 3km radius
          },
        });

        if (error) {
          console.error('Error fetching amenities:', error);
          toast({
            title: "Could not fetch amenities",
            description: "Using simulated data instead",
            variant: "destructive",
          });
          // Fallback to simulated data
          setNearbyAmenities(generateFallbackAmenities(selectedProperty.coords));
          return;
        }

        if (data?.success && data?.data) {
          // Map the response to our NearbyAmenity type
          const mappedAmenities: NearbyAmenity[] = data.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            type: item.type as AmenityType,
            distance: item.distance,
            coords: item.coords as [number, number],
            rating: item.rating,
          }));
          setNearbyAmenities(mappedAmenities);

          if (mappedAmenities.length > 0) {
            toast({
              title: "Amenities loaded",
              description: `Found ${mappedAmenities.length} nearby amenities from OpenStreetMap`,
            });
          }
        } else {
          setNearbyAmenities(generateFallbackAmenities(selectedProperty.coords));
        }
      } catch (err) {
        console.error('Error:', err);
        setNearbyAmenities(generateFallbackAmenities(selectedProperty.coords));
      } finally {
        setIsLoadingAmenities(false);
      }
    }

    fetchAmenities();
  }, [selectedProperty, toast]);

  // Fallback function for simulated amenities
  function generateFallbackAmenities(locationCoords: [number, number]): NearbyAmenity[] {
    const amenityTypes: AmenityType[] = ["school", "hospital", "metro", "supermarket", "park", "restaurant"];
    const amenities: NearbyAmenity[] = [];

    const amenityNames: Record<AmenityType, string[]> = {
      school: ["DPS School", "Ryan International", "Bishop Cotton", "National Public School"],
      hospital: ["Apollo Hospital", "Manipal Hospital", "Fortis Healthcare", "Columbia Asia"],
      metro: ["Metro Station", "Namma Metro", "Purple Line Station"],
      supermarket: ["Big Bazaar", "More Supermarket", "Reliance Fresh", "D-Mart"],
      park: ["Cubbon Park", "Lalbagh Gardens", "Freedom Park"],
      restaurant: ["MTR Restaurant", "Vidyarthi Bhavan", "Truffles", "Corner House"],
    };

    amenityTypes.forEach((type) => {
      const count = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < count; i++) {
        const distance = Math.random() * 2.5 + 0.3;
        const angle = Math.random() * Math.PI * 2;
        const offsetLng = Math.cos(angle) * distance * 0.009;
        const offsetLat = Math.sin(angle) * distance * 0.009;

        const names = amenityNames[type];
        amenities.push({
          id: `${type}-${i}`,
          name: names[Math.floor(Math.random() * names.length)],
          type,
          distance: Math.round(distance * 10) / 10,
          coords: [locationCoords[0] + offsetLng, locationCoords[1] + offsetLat],
          rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        });
      }
    });

    return amenities.sort((a, b) => a.distance - b.distance);
  }

  // Filter amenities by type
  const filteredAmenities = useMemo(() => {
    if (selectedAmenityType === "all") return nearbyAmenities;
    return nearbyAmenities.filter(a => a.type === selectedAmenityType);
  }, [nearbyAmenities, selectedAmenityType]);

  // Filter properties by search
  const filteredProperties = properties.filter(prop =>
    prop.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Map center
  const mapCenter = selectedProperty
    ? selectedProperty.coords
    : [77.5946, 12.9716] as [number, number];

  const tileUrl = mapStyle === "satellite"
    ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const handlePropertyClick = useCallback((property: PropertyData) => {
    setSelectedProperty(property);
  }, []);

  return (
    <AppLayout>
      <PageHeader
        title="Property Price & Nearby Amenities – Bengaluru"
        description="Explore property locations and discover nearby amenities across Bangalore"
      />

      <div className="grid lg:grid-cols-[1fr,380px] gap-6 h-[calc(100vh-120px)] min-h-[750px]">
        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-2xl overflow-hidden shadow-card border border-border/50"
        >
          <MapContainer
            center={[mapCenter[1], mapCenter[0]]}
            zoom={12}
            className="h-full w-full"
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url={tileUrl}
            />
            <MapController
              center={[mapCenter[1], mapCenter[0]]}
              zoom={selectedProperty ? 14 : 12}
            />

            {/* Property Markers */}
            {filteredProperties.map((property) => (
              <Marker
                key={property.id}
                position={[property.coords[1], property.coords[0]]}
                icon={createPropertyIcon(property.priceCategory, selectedProperty?.id === property.id)}
                eventHandlers={{
                  click: () => handlePropertyClick(property),
                }}
              >
                <Popup>
                  <div className="p-3 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge
                        className="text-white"
                        style={{ backgroundColor: priceColors[property.priceCategory] }}
                      >
                        {property.priceCategory === "affordable" ? "Affordable" :
                          property.priceCategory === "midrange" ? "Mid-range" : "Premium"}
                      </Badge>
                    </div>
                    <h3 className="font-semibold capitalize text-base mb-2">{property.location}</h3>
                    <div className="space-y-1.5 text-sm">
                      <p className="flex justify-between">
                        <span className="text-muted-foreground">Predicted Price:</span>
                        <span className="font-bold text-primary">₹{property.price}L</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-muted-foreground">BHK Type:</span>
                        <span className="font-medium">{property.bhk} BHK</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-muted-foreground">Square Feet:</span>
                        <span className="font-medium">{property.sqft} sqft</span>
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Amenity Markers (when property selected) */}
            {selectedProperty && showAmenities && filteredAmenities.map((amenity) => (
              <Marker
                key={amenity.id}
                position={[amenity.coords[1], amenity.coords[0]]}
                icon={createAmenityIcon(amenity.type)}
              >
                <Popup>
                  <div className="p-2 min-w-[160px]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{amenityConfig[amenity.type].emoji}</span>
                      <span className="text-xs text-muted-foreground capitalize">{amenity.type}</span>
                    </div>
                    <h4 className="font-semibold text-sm">{amenity.name}</h4>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        <span>{amenity.rating}</span>
                      </div>
                      <span className="text-muted-foreground">{amenity.distance} km</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Radius indicator when property selected */}
            {selectedProperty && showAmenities && (
              <CircleMarker
                center={[selectedProperty.coords[1], selectedProperty.coords[0]]}
                radius={80}
                pathOptions={{
                  color: '#1a5f5f',
                  fillColor: '#1a5f5f',
                  fillOpacity: 0.08,
                  weight: 2,
                  dashArray: '5, 5',
                }}
              />
            )}
          </MapContainer>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
            <Button
              variant={mapStyle === "streets" ? "default" : "outline"}
              size="sm"
              onClick={() => setMapStyle("streets")}
              className="gap-2"
            >
              <MapPin className="h-4 w-4" />
              Streets
            </Button>
            <Button
              variant={mapStyle === "satellite" ? "default" : "outline"}
              size="sm"
              onClick={() => setMapStyle("satellite")}
              className="gap-2"
            >
              <Layers className="h-4 w-4" />
              Satellite
            </Button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-soft border border-border/50">
            <p className="text-xs font-medium mb-2">Price Legend</p>
            <div className="space-y-1.5">
              {(Object.entries(priceCategoryLabels) as [PriceCategory, string][]).map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: priceColors[key] }}
                  />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Property Badge */}
          {selectedProperty && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-soft border border-border/50 flex items-center gap-3"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: priceColors[selectedProperty.priceCategory] }}
              />
              <div>
                <span className="text-sm font-medium capitalize">{selectedProperty.location}</span>
                <span className="text-xs text-muted-foreground ml-2">₹{selectedProperty.price}L</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setSelectedProperty(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4 overflow-hidden"
        >
          <Tabs defaultValue="properties" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="amenities" disabled={!selectedProperty}>
                Amenities {selectedProperty && `(${nearbyAmenities.length})`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="flex-1 overflow-hidden flex flex-col gap-4 mt-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Jump to location */}
              <Select
                value={selectedProperty?.location || ""}
                onValueChange={(loc) => {
                  const property = properties.find(p => p.location === loc);
                  if (property) setSelectedProperty(property);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Jump to location" />
                </SelectTrigger>
                <SelectContent>
                  {sampleLocations.map((loc) => (
                    <SelectItem key={loc} value={loc} className="capitalize">
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Property List */}
              <div className="space-y-2 flex-1 overflow-y-auto pr-2">
                <p className="text-sm text-muted-foreground mb-2">
                  {filteredProperties.length} Properties Found
                </p>
                {filteredProperties.map((property) => (
                  <Card
                    key={property.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-hover",
                      selectedProperty?.id === property.id && "border-primary bg-primary/5"
                    )}
                    onClick={() => handlePropertyClick(property)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${priceColors[property.priceCategory]}20` }}
                        >
                          <Building2
                            className="h-5 w-5"
                            style={{ color: priceColors[property.priceCategory] }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium capitalize truncate">{property.location}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-semibold" style={{ color: priceColors[property.priceCategory] }}>
                              ₹{property.price}L
                            </span>
                            <span>•</span>
                            <span>{property.bhk} BHK</span>
                            <span>•</span>
                            <span>{property.sqft} sqft</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="amenities" className="flex-1 overflow-hidden flex flex-col gap-4 mt-4">
              {selectedProperty ? (
                <>
                  {/* Selected Property Info */}
                  <Card className="border-primary/50 bg-primary/5">
                    <CardContent className="p-3">
                      <p className="text-sm text-muted-foreground">Selected Property</p>
                      <p className="font-semibold capitalize">{selectedProperty.location}</p>
                      <p className="text-sm">
                        <span className="font-bold" style={{ color: priceColors[selectedProperty.priceCategory] }}>
                          ₹{selectedProperty.price}L
                        </span>
                        <span className="text-muted-foreground"> • {selectedProperty.bhk} BHK • {selectedProperty.sqft} sqft</span>
                      </p>
                    </CardContent>
                  </Card>

                  {/* Amenity Type Filter */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedAmenityType === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedAmenityType("all")}
                    >
                      All
                    </Button>
                    {(Object.entries(amenityConfig) as [AmenityType, typeof amenityConfig[AmenityType]][]).map(([type, config]) => (
                      <Button
                        key={type}
                        variant={selectedAmenityType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedAmenityType(type)}
                        className="gap-1"
                      >
                        <span>{config.emoji}</span>
                      </Button>
                    ))}
                  </div>

                  {/* Toggle amenities visibility */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAmenities(!showAmenities)}
                    className="w-full"
                  >
                    {showAmenities ? "Hide Amenities on Map" : "Show Amenities on Map"}
                  </Button>

                  {/* Amenities List */}
                  <div className="space-y-2 flex-1 overflow-y-auto pr-2">
                    {isLoadingAmenities ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                        <p className="text-sm text-muted-foreground">Fetching amenities from OpenStreetMap...</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground mb-2">
                          {filteredAmenities.length} Amenities within 3km
                          <span className="text-xs ml-1">(via OpenStreetMap)</span>
                        </p>
                        {filteredAmenities.length === 0 ? (
                          <div className="text-center py-4 text-muted-foreground">
                            <p className="text-sm">No amenities found in this category</p>
                          </div>
                        ) : (
                          filteredAmenities.map((amenity) => {
                            const config = amenityConfig[amenity.type];
                            const Icon = config.icon;
                            return (
                              <div
                                key={amenity.id}
                                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                              >
                                <div
                                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                                  style={{ backgroundColor: config.color }}
                                >
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{amenity.name}</p>
                                  <p className="text-xs text-muted-foreground capitalize">{config.label}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                    <span className="text-sm font-medium">{amenity.rating}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{amenity.distance} km</p>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Select a property to view nearby amenities</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AppLayout>
  );
}
