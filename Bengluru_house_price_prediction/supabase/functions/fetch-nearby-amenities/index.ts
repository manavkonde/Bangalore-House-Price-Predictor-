const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Map OSM tags to our amenity types
const amenityTypeMapping: Record<string, string> = {
  // Schools & Colleges
  'school': 'school',
  'university': 'school',
  'college': 'school',
  'kindergarten': 'school',
  // Hospitals & Clinics
  'hospital': 'hospital',
  'clinic': 'hospital',
  'doctors': 'hospital',
  'pharmacy': 'hospital',
  // Metro Stations
  'subway_entrance': 'metro',
  'station': 'metro',
  // Supermarkets & Malls
  'supermarket': 'supermarket',
  'mall': 'supermarket',
  'marketplace': 'supermarket',
  'convenience': 'supermarket',
  // Parks & Playgrounds
  'park': 'park',
  'playground': 'park',
  'garden': 'park',
  // Restaurants
  'restaurant': 'restaurant',
  'cafe': 'restaurant',
  'fast_food': 'restaurant',
  'food_court': 'restaurant',
};

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: {
    name?: string;
    amenity?: string;
    shop?: string;
    leisure?: string;
    railway?: string;
    [key: string]: string | undefined;
  };
}

function getAmenityType(element: OverpassElement): string | null {
  const tags = element.tags || {};
  
  // Check amenity tag
  if (tags.amenity && amenityTypeMapping[tags.amenity]) {
    return amenityTypeMapping[tags.amenity];
  }
  
  // Check shop tag for supermarkets
  if (tags.shop === 'supermarket' || tags.shop === 'mall' || tags.shop === 'convenience') {
    return 'supermarket';
  }
  
  // Check leisure tag for parks
  if (tags.leisure === 'park' || tags.leisure === 'playground' || tags.leisure === 'garden') {
    return 'park';
  }
  
  // Check railway tag for metro
  if (tags.railway === 'station' || tags.railway === 'subway_entrance') {
    return 'metro';
  }
  
  return null;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lng, radius = 3000 } = await req.json();

    if (!lat || !lng) {
      return new Response(
        JSON.stringify({ success: false, error: 'Latitude and longitude are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching amenities near ${lat}, ${lng} within ${radius}m`);

    // Build Overpass QL query for multiple amenity types
    const overpassQuery = `
      [out:json][timeout:25];
      (
        // Schools & Education
        node["amenity"="school"](around:${radius},${lat},${lng});
        node["amenity"="university"](around:${radius},${lat},${lng});
        node["amenity"="college"](around:${radius},${lat},${lng});
        way["amenity"="school"](around:${radius},${lat},${lng});
        way["amenity"="university"](around:${radius},${lat},${lng});
        
        // Hospitals & Healthcare
        node["amenity"="hospital"](around:${radius},${lat},${lng});
        node["amenity"="clinic"](around:${radius},${lat},${lng});
        node["amenity"="pharmacy"](around:${radius},${lat},${lng});
        way["amenity"="hospital"](around:${radius},${lat},${lng});
        
        // Metro Stations
        node["railway"="station"](around:${radius},${lat},${lng});
        node["railway"="subway_entrance"](around:${radius},${lat},${lng});
        node["station"="subway"](around:${radius},${lat},${lng});
        
        // Supermarkets & Malls
        node["shop"="supermarket"](around:${radius},${lat},${lng});
        node["shop"="mall"](around:${radius},${lat},${lng});
        node["shop"="convenience"](around:${radius},${lat},${lng});
        way["shop"="supermarket"](around:${radius},${lat},${lng});
        way["shop"="mall"](around:${radius},${lat},${lng});
        
        // Parks & Playgrounds
        node["leisure"="park"](around:${radius},${lat},${lng});
        node["leisure"="playground"](around:${radius},${lat},${lng});
        way["leisure"="park"](around:${radius},${lat},${lng});
        
        // Restaurants & Cafes
        node["amenity"="restaurant"](around:${radius},${lat},${lng});
        node["amenity"="cafe"](around:${radius},${lat},${lng});
        node["amenity"="fast_food"](around:${radius},${lat},${lng});
      );
      out center;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    });

    if (!response.ok) {
      console.error('Overpass API error:', response.status, response.statusText);
      return new Response(
        JSON.stringify({ success: false, error: `Overpass API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const elements: OverpassElement[] = data.elements || [];

    console.log(`Received ${elements.length} elements from Overpass API`);

    // Process and format amenities
    const amenities = elements
      .map((element, index) => {
        const amenityType = getAmenityType(element);
        if (!amenityType) return null;

        // Get coordinates (nodes have lat/lon directly, ways have center)
        const elemLat = element.lat || element.center?.lat;
        const elemLon = element.lon || element.center?.lon;
        
        if (!elemLat || !elemLon) return null;

        const name = element.tags?.name || `${amenityType.charAt(0).toUpperCase() + amenityType.slice(1)} ${index + 1}`;
        const distance = calculateDistance(lat, lng, elemLat, elemLon);

        return {
          id: `${element.type}-${element.id}`,
          name,
          type: amenityType,
          distance,
          coords: [elemLon, elemLat] as [number, number],
          // OSM doesn't have ratings, so we'll generate a placeholder
          rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
          osmId: element.id,
        };
      })
      .filter(Boolean)
      .sort((a, b) => (a?.distance || 0) - (b?.distance || 0));

    // Limit results per category
    const groupedAmenities: Record<string, typeof amenities> = {};
    amenities.forEach(amenity => {
      if (!amenity) return;
      if (!groupedAmenities[amenity.type]) {
        groupedAmenities[amenity.type] = [];
      }
      if (groupedAmenities[amenity.type].length < 10) {
        groupedAmenities[amenity.type].push(amenity);
      }
    });

    const finalAmenities = Object.values(groupedAmenities).flat();

    console.log(`Returning ${finalAmenities.length} amenities`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: finalAmenities,
        total: finalAmenities.length,
        center: { lat, lng },
        radius,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching amenities:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch amenities';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
