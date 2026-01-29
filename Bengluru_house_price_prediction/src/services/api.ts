import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Types
export interface PredictionRequest {
  location: string;
  total_sqft: number;
  bhk: number;
  bath: number;
}

export interface PredictionResponse {
  estimated_price: number;
}

export interface LocationsResponse {
  locations: string[];
}

// API Methods
export const getLocations = async (): Promise<string[]> => {
  try {
    const response = await api.get<LocationsResponse>('/get_location_names');
    return response.data.locations;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

export const predictPrice = async (data: PredictionRequest): Promise<number> => {
  try {
    const response = await api.post<PredictionResponse>('/predict_home_price', data);
    return response.data.estimated_price;
  } catch (error) {
    console.error('Error predicting price:', error);
    throw error;
  }
};

export default api;
