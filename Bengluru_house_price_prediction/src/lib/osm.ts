import { useQuery } from "@tanstack/react-query";

export interface Amenity {
  id: string;
  type: string;
  name: string;
  lat: number;
  lon: number;
  distance?: string;
  rating?: number; // OSM doesn't have ratings, we'll keep this optional or mock it if needed for UI consistency
}

const OVERPASS_API_URL = "https://overpass-api.de/api/interpreter";

// Map our app's amenity types to OSM tags
const AMENITY_TAGS: Record<string, string> = {
  school: '["amenity"="school"]',
  hospital: '["amenity"~"hospital|clinic"]',
  park: '["leisure"="park"]',
  restaurant: '["amenity"="restaurant"]',
  transport: '["public_transport"]', // Broader tag, can be refined
  shopping: '["shop"]',
};

async function fetchAmenitiesFromOSM(lat: number, lon: number, radius: number = 2000): Promise<Amenity[]> {
  // Construct Overpass QL query
  // searching for nodes, ways, and relations around the center
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"~"school|hospital|clinic|restaurant"](around:${radius},${lat},${lon});
      node["leisure"="park"](around:${radius},${lat},${lon});
      node["public_transport"](around:${radius},${lat},${lon});
      node["shop"](around:${radius},${lat},${lon});
    );
    out body 50;
    >;
    out skel qt;
  `;

  // Note: We limit to 50 items to avoid overwhelming the UI/browser
  // The query above fetches mixed types. For more precision, we could fetch by category if the UI demands strictly separate calls,
  // but fetching all in one go is efficient for the "All" view.

  try {
    const response = await fetch(OVERPASS_API_URL, {
      method: "POST",
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.statusText}`);
    }

    const data = await response.json();
    return parseOverpassResponse(data, lat, lon);
  } catch (error) {
    console.error("Failed to fetch amenities:", error);
    return [];
  }
}

function parseOverpassResponse(data: any, centerLat: number, centerLon: number): Amenity[] {
  if (!data || !data.elements) return [];

  return data.elements
    .filter((el: any) => el.tags && (el.tags.name || el.tags.amenity || el.tags.leisure || el.tags.shop))
    .map((el: any) => {
      const type = determineType(el.tags);
      const name = el.tags.name || `${type.charAt(0).toUpperCase() + type.slice(1)}`;
      const distanceVal = getDistanceFromLatLonInKm(centerLat, centerLon, el.lat, el.lon);

      return {
        id: String(el.id),
        type,
        name,
        lat: el.lat,
        lon: el.lon,
        distance: `${distanceVal.toFixed(1)} km`,
        rating: (4 + Math.random()).toFixed(1), // Mock rating as OSM doesn't provide it
      };
    });
}

function determineType(tags: any): string {
  if (tags.amenity === "school") return "school";
  if (tags.amenity === "hospital" || tags.amenity === "clinic") return "hospital";
  if (tags.amenity === "restaurant") return "restaurant";
  if (tags.leisure === "park") return "park";
  if (tags.public_transport || tags.amenity === "bus_station") return "transport";
  if (tags.shop) return "shopping";
  return "other";
}

// Distance calculation using Haversine formula
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// React Query hook
export function useAmenities(lat: number, lon: number) {
  return useQuery({
    queryKey: ["amenities", lat, lon],
    queryFn: () => fetchAmenitiesFromOSM(lat, lon),
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!lat && !!lon,
  });
}
