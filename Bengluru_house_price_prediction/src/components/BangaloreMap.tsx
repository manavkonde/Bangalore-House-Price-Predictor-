import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { motion } from "framer-motion";
import { MapPin, AlertCircle, Globe } from "lucide-react";
import { getLocationCoordinates, CITY_DEFAULT_COORDINATES } from "@/data/locations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCities } from "@/services/api";

interface BangaloreMapProps {
  selectedCity?: string;
  onCityChange?: (city: string) => void;
  selectedLocation?: string;
  onLocationChange?: (location: string) => void;
}

export function BangaloreMap({ selectedCity = "delhi", onCityChange, selectedLocation, onLocationChange }: BangaloreMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [cities, setCities] = useState<string[]>(["delhi", "bengaluru", "chennai", "hyderabad", "kolkata", "combined"]);
  const [currentCity, setCurrentCity] = useState(selectedCity);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const fetchedCities = await getCities();
        setCities(fetchedCities);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };
    fetchCities();
  }, []);

  const handleCityChange = (city: string) => {
    setCurrentCity(city);
    if (onCityChange) {
      onCityChange(city);
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;

      // Get coordinates - prioritize selected location, then use city default
      const coords = selectedLocation
        ? getLocationCoordinates(selectedLocation, currentCity)
        : (CITY_DEFAULT_COORDINATES[currentCity] || CITY_DEFAULT_COORDINATES["bengaluru"]);

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: coords,
        zoom: 12,
        pitch: 40,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        "top-right"
      );

      map.current.on("load", () => {
        setIsMapLoaded(true);
        setShowTokenInput(false);
      });

      // Add marker
      marker.current = new mapboxgl.Marker({
        color: "#1a5f5f",
      })
        .setLngLat(coords)
        .addTo(map.current);

      map.current.on("error", () => {
        setShowTokenInput(true);
        setIsMapLoaded(false);
      });

    } catch (error) {
      console.error("Map initialization error:", error);
      setShowTokenInput(true);
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, currentCity, selectedLocation]);

  // Update marker when location changes
  useEffect(() => {
    if (!map.current || !marker.current || !selectedLocation || !isMapLoaded) return;

    const coords = getLocationCoordinates(selectedLocation, currentCity);
    marker.current.setLngLat(coords);
    map.current.flyTo({
      center: coords,
      zoom: 14,
      duration: 2000,
    });
  }, [selectedLocation, currentCity, isMapLoaded]);

  if (showTokenInput) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full min-h-[250px] sm:min-h-[300px] md:min-h-[400px] rounded-2xl bg-gradient-card border border-border/50 flex flex-col items-center justify-center p-8"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-center">Interactive Map</h3>
        <p className="text-sm text-muted-foreground text-center mb-6 max-w-sm">
          Enter your Mapbox public token to enable the interactive map. Get one free at{" "}
          <a
            href="https://mapbox.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            mapbox.com
          </a>
        </p>
        <div className="w-full max-w-sm space-y-3">
          <Input
            type="text"
            placeholder="pk.eyJ1Ijo..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="h-12 md:h-10 min-h-[44px] px-3 py-2"
          />
          <Button
            variant="hero"
            size="lg"
            className="w-full min-h-[44px] text-base"
            onClick={() => {
              if (mapboxToken.startsWith("pk.")) {
                setShowTokenInput(false);
              }
            }}
            disabled={!mapboxToken.startsWith("pk.")}
          >
            Load Map
          </Button>
        </div>

        {/* Fallback static map preview */}
        <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border/50 w-full max-w-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs">Map preview will appear here</span>
          </div>
          {selectedLocation && (
            <p className="text-sm mt-2 capitalize">
              <strong>Selected:</strong> {selectedLocation}
            </p>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative h-full min-h-[250px] sm:min-h-[300px] md:min-h-[400px] rounded-2xl overflow-hidden shadow-card"
    >
      <div ref={mapContainer} className="absolute inset-0" />

      {/* City & Location Badges */}
      <div className="absolute top-4 left-4 right-4 space-y-2 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-soft border border-border/50 w-fit pointer-events-auto"
        >
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase text-muted-foreground">City</span>
          </div>
          <Select value={currentCity} onValueChange={handleCityChange}>
            <SelectTrigger className="w-[150px] h-8 text-sm bg-background/80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city} className="capitalize">
                  {city.charAt(0).toUpperCase() + city.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-soft border border-border/50 w-fit flex items-center gap-2"
          >
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium capitalize">{selectedLocation}</span>
          </motion.div>
        )}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card/50 to-transparent pointer-events-none" />
    </motion.div>
  );
}
