import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Types
export interface PredictionRequest {
  city?: string;
  location: string;
  total_sqft?: number;
  area?: number;
  bhk?: number;
  bedrooms?: number;
  bath?: number;
  bathrooms?: number;
}

export interface PredictionResponse {
  estimated_price?: number;
  predicted_price?: number;
  confidence?: "HIGH" | "MEDIUM" | "LOW";
  warning?: string;
  price_range?: {
    min: number;
    max: number;
    median: number;
    [key: string]: number;
  };
  data_points_used?: number;
}

export interface LocationsResponse {
  locations: string[];
}

export interface City {
  name: string;
  id: string;
}

export interface CitiesResponse {
  cities: string[];
  count: number;
}

// API Methods
export const getCities = async (): Promise<string[]> => {
  try {
    const response = await api.get<CitiesResponse>('/api/cities');
    return response.data.cities || ['delhi', 'bengaluru', 'chennai', 'hyderabad', 'kolkata', 'combined'];
  } catch (error) {
    console.error('Error fetching cities:', error);
    return ['delhi', 'bengaluru', 'chennai', 'hyderabad', 'kolkata', 'combined'];
  }
};

export const getLocations = async (city?: string): Promise<string[]> => {
  try {
    if (city) {
      console.log(`[API] Fetching locations for city: ${city}`);

      const response = await api.get<any>(`/api/locations/${city}`);

      const locations = response.data.locations;

      if (!Array.isArray(locations)) {
        console.error('[API] locations is not an array:', locations);
        return [];
      }

      console.log(`[API] Received ${locations.length} locations for ${city}`);
      return locations;
    }

    // Legacy endpoint (no city specified)
    console.log('[API] Using legacy endpoint /get_location_names');
    const response = await api.get<LocationsResponse>('/get_location_names');
    return response.data.locations || [];

  } catch (error) {
    console.error('[API] Error fetching locations:', error);

    // Fallback: try legacy endpoint if city-wise failed
    if (city) {
      try {
        console.log('[API] City-wise endpoint failed, trying legacy /get_location_names...');
        const fallbackResponse = await api.get<LocationsResponse>('/get_location_names');
        const fallbackLocations = fallbackResponse.data.locations;
        if (Array.isArray(fallbackLocations) && fallbackLocations.length > 0) {
          console.log(`[API] Fallback returned ${fallbackLocations.length} locations`);
          return fallbackLocations;
        }
      } catch (fallbackError) {
        console.error('[API] Fallback also failed:', fallbackError);
      }
      
      // Final fallback: use hardcoded locations
      const citiesKey = city.toLowerCase();
      const hardcodedLocations = FALLBACK_LOCATIONS[citiesKey] || FALLBACK_LOCATIONS["bengaluru"];
      console.log(`[API] Using hardcoded fallback locations for ${city}:`, hardcodedLocations);
      return hardcodedLocations;
    }

    // If no city specified, try legacy endpoint
    try {
      const legacyResponse = await api.get<LocationsResponse>('/get_location_names');
      return legacyResponse.data.locations || [];
    } catch (legacyError) {
      console.error('[API] Legacy endpoint also failed:', legacyError);
      // Return bengaluru locations as final fallback
      return FALLBACK_LOCATIONS["bengaluru"];
    }
  }
};

// Fallback locations by city
const FALLBACK_LOCATIONS: Record<string, string[]> = {
  "delhi": ["new delhi", "dwarka", "gurgaon", "noida", "defense colony", "west delhi", "south delhi"],
  "bengaluru": ["indiranagar", "whitefield", "koramangala", "hsr layout", "marathahalli", "bellandur", "jayanagar"],
  "bangalore": ["indiranagar", "whitefield", "koramangala", "hsr layout", "marathahalli", "bellandur", "jayanagar"],
  "chennai": ["t. nagar", "velachery", "adyar", "anna nagar", "mylapore", "ashok nagar", "thiruvanmiyur"],
  "hyderabad": ["hitech city", "banjara hills", "jubilee hills", "filmnagar", "madhura nagar", "gachibowli", "kondapur"],
  "kolkata": ["salt lake", "bidhannagar", "alipore", "south kolkata", "north kolkata", "behala", "bhowanipore"],
  "combined": ["indiranagar", "whitefield", "koramangala", "hsr layout", "new delhi", "dwarka"]
};

export const predictPrice = async (data: PredictionRequest): Promise<PredictionResponse> => {
  try {
    // Try new city-wise API first
    if (data.city) {
      try {
        const response = await api.post<any>('/api/predict', {
          city: data.city,
          location: data.location,
          area: data.total_sqft || data.area,
          bedrooms: data.bhk || data.bedrooms,
          bathrooms: data.bath || data.bathrooms,
        });
        return {
          predicted_price: response.data.predicted_price,
          confidence: response.data.confidence,
          warning: response.data.warning,
          price_range: response.data.price_range,
          data_points_used: response.data.data_points_used,
        };
      } catch (cityError) {
        console.warn('[API] City-wise predict failed, trying legacy endpoint...', cityError);
        // Fall through to legacy endpoint
      }
    }

    // Fallback to legacy API
    const response = await api.post<PredictionResponse>('/predict_home_price', {
      location: data.location,
      total_sqft: data.total_sqft || data.area,
      bhk: data.bhk || data.bedrooms,
      bath: data.bath || data.bathrooms,
    });
    return {
      predicted_price: response.data.estimated_price || response.data.predicted_price || 0,
    };
  } catch (error) {
    console.error('Error predicting price:', error);
    throw error;
  }
};

export const compareCities = async (
  location: string,
  area: number,
  bedrooms: number,
  bathrooms?: number
): Promise<Record<string, number>> => {
  try {
    const response = await api.post<any>('/api/compare-cities', {
      location,
      area,
      bedrooms,
      bathrooms: bathrooms || bedrooms,
    });

    const predictions: Record<string, number> = {};
    for (const [city, data] of Object.entries(response.data.city_predictions || {})) {
      if ((data as any).status === 'success') {
        predictions[city] = (data as any).predicted_price;
      }
    }
    return predictions;
  } catch (error) {
    console.error('Error comparing cities:', error);
    return {};
  }
};

export default api;
