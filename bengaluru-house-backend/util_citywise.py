"""
Utility functions for multi-city house price prediction
Supports Delhi, Bengaluru, and combined model predictions
"""

import json
import pickle
import numpy as np
import pandas as pd
import os
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

# Global model storage
__models = {}
__scalers = {}
__encoders = {}
__locations_by_city = {}
__city_data = {}


def load_city_models():
    """Load all trained city-specific models."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    cities = ['delhi', 'bengaluru', 'chennai', 'hyderabad', 'kolkata', 'combined']
    model_type = 'gradientboosting'  # Use GradientBoosting as primary model
    
    for city in cities:
        try:
            model_file = os.path.join(base_dir, f"{city}_{model_type}_model.pickle")
            scaler_file = os.path.join(base_dir, f"{city}_{model_type}_scaler.pickle")
            encoder_file = os.path.join(base_dir, f"{city}_{model_type}_encoder.pickle")
            
            if os.path.exists(model_file):
                with open(model_file, 'rb') as f:
                    __models[city] = pickle.load(f)
                
                with open(scaler_file, 'rb') as f:
                    __scalers[city] = pickle.load(f)
                
                with open(encoder_file, 'rb') as f:
                    __encoders[city] = pickle.load(f)
                
                logger.info(f"✅ Loaded {city} model")
            else:
                logger.warning(f"⚠️ Model not found for {city}")
        except Exception as e:
            logger.error(f"Error loading {city} model: {e}")


def load_city_data():
    """Load cleaned city data to extract locations."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    datasets = {
        'delhi': 'delhi_cleaned.csv',
        'bengaluru': 'bengaluru_cleaned.csv',
        'chennai': 'chennai_cleaned.csv',
        'hyderabad': 'hyderabad_cleaned.csv',
        'kolkata': 'kolkata_cleaned.csv',
        'combined': 'city_data_cleaned.csv'
    }
    
    for city, filename in datasets.items():
        try:
            filepath = os.path.join(base_dir, filename)
            if os.path.exists(filepath):
                df = pd.read_csv(filepath)
                __city_data[city] = df
                
                # Extract unique locations
                locations = df['Location'].unique().tolist()
                __locations_by_city[city] = sorted([loc.strip() for loc in locations if pd.notna(loc)])
                
                logger.info(f"✅ Loaded {city} data: {len(df)} records, {len(__locations_by_city[city])} locations")
            else:
                logger.warning(f"⚠️ Data file not found for {city}")
        except Exception as e:
            logger.error(f"Error loading {city} data: {e}")


def get_available_cities():
    """Get list of available cities."""
    return list(__models.keys())


def get_city_locations(city):
    """Get all locations available in a specific city."""
    city_lower = city.lower()
    return __locations_by_city.get(city_lower, [])


def predict_price(city, location, area, bedrooms, bathrooms=None):
    """
    Predict house price for given parameters.
    
    Args:
        city: City name (delhi, bengaluru, combined)
        location: Location name
        area: Total area in square meters
        bedrooms: Number of bedrooms
        bathrooms: Number of bathrooms (optional)
    
    Returns:
        Predicted price in INR
    """
    city_lower = city.lower()
    
    if city_lower not in __models:
        raise ValueError(f"City '{city}' not found. Available cities: {list(__models.keys())}")
    
    try:
        model = __models[city_lower]
        scaler = __scalers[city_lower]
        encoder = __encoders[city_lower]
        
        # Get city data for feature structure
        df = __city_data.get(city_lower)
        
        if df is None:
            raise ValueError(f"Data not found for city: {city}")
        
        # Use ONLY the 39 scaler features (excluding City)
        scaler_features = list(scaler.feature_names_in_)  # 39 features
        
        # Create feature vector with scaler features initialized to 0
        feature_dict = {}
        for col in scaler_features:
            feature_dict[col] = 0
        
        # Set the actual input values
        if 'Area' in feature_dict:
            feature_dict['Area'] = area
        if 'Location' in feature_dict:
            feature_dict['Location'] = location
        if 'No. of Bedrooms' in feature_dict:
            feature_dict['No. of Bedrooms'] = bedrooms
        if 'Bathrooms' in feature_dict:
            feature_dict['Bathrooms'] = bathrooms if bathrooms else bedrooms
        if 'bath' in feature_dict:
            feature_dict['bath'] = bathrooms if bathrooms else bedrooms
        
        # Create DataFrame with the 39 scaler features
        X_df = pd.DataFrame([feature_dict])
        X_df = X_df[scaler_features]
        
        # Encode categorical Location column
        if 'Location' in X_df.columns:
            try:
                X_df['Location'] = encoder.transform(X_df['Location'].astype(str))
            except Exception as e:
                logger.warning(f"Location '{location}' not found, using default location")
                X_df['Location'] = 0
        
        # Scale the 39 features
        X_scaled = scaler.transform(X_df.values)
        
        # Add City as the 40th feature (unscaled, encoded as 0)
        # The model expects City as the last feature, but it should be encoded
        # Since each city model is city-specific, City value is constant (0)
        city_encoded = 0  # Each city model gets the same city code
        X_with_city = np.column_stack([X_scaled, city_encoded])
        
        # Predict
        predicted_price = model.predict(X_with_city)[0]
        
        return max(0, round(float(predicted_price), 2))  # Ensure positive price
    
    except Exception as e:
        logger.error(f"Error in prediction: {e}")
        raise


def validate_prediction(city, predicted_price):
    """
    Validate prediction is within reasonable bounds.
    
    Returns:
        {
            'is_valid': bool,
            'confidence': 'HIGH' | 'MEDIUM' | 'LOW',
            'price': float,
            'warning': str or None,
            'price_range': {'min': float, 'max': float},
            'data_points': int
        }
    """
    city_lower = city.lower()
    price_stats = get_price_range(city_lower)
    
    if not price_stats:
        return {
            'is_valid': False,
            'confidence': 'LOW',
            'price': predicted_price,
            'warning': f'No data available for city: {city}',
            'price_range': None,
            'data_points': 0
        }
    
    median = price_stats['median']
    min_price = price_stats['min']
    max_price = price_stats['max']
    count = price_stats['count']
    
    # Define confidence bounds
    lower_bound = median * 0.3  # 30% of median
    upper_bound = median * 3.0  # 300% of median
    
    warning = None
    confidence = 'HIGH'
    is_valid = True
    
    # Check if prediction is reasonable
    if predicted_price < lower_bound or predicted_price > upper_bound:
        is_valid = False
        confidence = 'LOW'
        warning = f'Prediction outside typical range for {city}'
    elif predicted_price > median * 2:
        confidence = 'MEDIUM'
        warning = f'High prediction - only {count} properties in dataset'
    
    # Adjust confidence based on data availability
    if count < 100:
        confidence = 'LOW'
        warning = f'Limited data: only {count} properties in {city}'
    elif count < 500:
        if confidence != 'LOW':
            confidence = 'MEDIUM'
    
    return {
        'is_valid': is_valid,
        'confidence': confidence,
        'price': predicted_price,
        'warning': warning,
        'price_range': {
            'min': float(min_price),
            'recommended_min': float(median * 0.5),
            'median': float(median),
            'recommended_max': float(median * 2.0),
            'max': float(max_price)
        },
        'data_points': count
    }


def get_price_range(city):
    """Get min, max, and average price for a city."""
    city_lower = city.lower()
    
    if city_lower not in __city_data:
        return None
    
    df = __city_data[city_lower]
    
    if 'Price' not in df.columns:
        return None
    
    prices = df['Price'].dropna()
    
    return {
        'min': float(prices.min()),
        'max': float(prices.max()),
        'mean': float(prices.mean()),
        'median': float(prices.median()),
        'count': int(len(prices))
    }


def get_city_statistics(city):
    """Get statistics for a city."""
    city_lower = city.lower()
    
    if city_lower not in __city_data:
        return None
    
    df = __city_data[city_lower]
    
    stats = {
        'city': city,
        'total_records': len(df),
        'total_locations': len(get_city_locations(city)),
        'price': get_price_range(city),
        'bedrooms': df['No. of Bedrooms'].value_counts().to_dict() if 'No. of Bedrooms' in df.columns else {},
        'average_area': float(df['Area'].mean()) if 'Area' in df.columns else 0,
    }
    
    return stats


def load_all_artifacts():
    """Load all models and data."""
    logger.info("Loading all city models and data...")
    load_city_models()
    load_city_data()
    logger.info(f"✅ Loaded {len(__models)} city models")
    logger.info(f"✅ Available cities: {list(__models.keys())}")


# Load models on module import
load_all_artifacts()

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    # Test prediction
    try:
        price = predict_price('delhi', 'sector 10 dwarka', 1200, 2)
        print(f"Predicted price for Delhi: ₹{price:,.0f}")
    except Exception as e:
        print(f"Error: {e}")
