"""
Feature Engineering for House Price Prediction
Adds advanced features to improve model performance
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import logging

logger = logging.getLogger(__name__)

def create_location_features(df: pd.DataFrame, city: str) -> pd.DataFrame:
    """
    Create advanced features based on location data.
    
    Features:
    - Location rank by avg price
    - Location density (properties per location)
    - Price variance in location
    - Amenity density score
    """
    df = df.copy()
    
    # Location-based features
    location_stats = df.groupby('Location').agg({
        'Price': ['count', 'mean', 'std', 'median']
    }).reset_index()
    
    location_stats.columns = ['Location', 'location_count', 'location_avg_price', 'location_std_price', 'location_median_price']
    
    # Rank locations by average price (premium locations = high price)
    location_stats['location_rank'] = pd.qcut(location_stats['location_avg_price'], q=5, labels=[1, 2, 3, 4, 5], duplicates='drop')
    
    # Merge back to main dataframe
    df = df.merge(location_stats[['Location', 'location_count', 'location_rank', 'location_avg_price', 'location_std_price']], on='Location', how='left')
    
    # Handle missing values
    df['location_count'] = df['location_count'].fillna(1)
    df['location_rank'] = df['location_rank'].fillna(3)  # Middle rank
    df['location_avg_price'] = df['location_avg_price'].fillna(df['Price'].median())
    df['location_std_price'] = df['location_std_price'].fillna(df['Price'].std())
    
    return df


def create_amenity_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create amenity importance weighted features.
    Instead of binary, weight amenities by their importance.
    """
    df = df.copy()
    
    # Amenity importance weights
    amenity_weights = {
        'Gymnasium': 0.3,
        'SwimmingPool': 0.4,
        'ShoppingMall': 0.5,
        'School': 0.8,
        'Hospital': 0.7,
        'ATM': 0.5,
        'ClubHouse': 0.3,
        '24X7Security': 0.6,
        'PowerBackup': 0.5,
        'CarParking': 0.7,
        'Cafeteria': 0.2,
        'Wifi': 0.4,
        'Intercom': 0.3,
        'SportsFacility': 0.3,
        'LiftAvailable': 0.6,
        'RainWaterHarvesting': 0.2,
        'Gasconnection': 0.3,
        'AC': 0.4,
        'Children\'splayarea': 0.3,
    }
    
    # Calculate weighted amenity score
    amenity_score = 0
    for amenity, weight in amenity_weights.items():
        if amenity in df.columns:
            amenity_score += df[amenity] * weight
    
    df['amenity_score'] = amenity_score
    
    return df


def create_property_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create property-related features."""
    df = df.copy()
    
    # Price per square foot (normalized)
    if 'Area' in df.columns:
        df['price_per_sqft'] = df['Price'] / df['Area']
        df['price_per_sqft'] = df['price_per_sqft'].fillna(df['price_per_sqft'].median())
    
    # BHK to area ratio (efficiency metric)
    if 'No. of Bedrooms' in df.columns and 'Area' in df.columns:
        df['bhk_area_ratio'] = df['Area'] / (df['No. of Bedrooms'] + 1)
        df['bhk_area_ratio'] = df['bhk_area_ratio'].fillna(df['bhk_area_ratio'].median())
    
    # Total amenities count
    amenity_cols = [col for col in df.columns if col in [
        'Gymnasium', 'SwimmingPool', 'ShoppingMall', 'School', 'Hospital', 
        'ATM', 'ClubHouse', '24X7Security', 'PowerBackup', 'CarParking',
        'Cafeteria', 'Wifi', 'Intercom', 'SportsFacility', 'LiftAvailable'
    ]]
    df['amenity_count'] = df[amenity_cols].sum(axis=1)
    
    return df


def engineer_features(df: pd.DataFrame, city: str = '') -> pd.DataFrame:
    """
    Apply all feature engineering transformations.
    
    Args:
        df: Input dataframe
        city: City name for context
    
    Returns:
        Dataframe with engineered features
    """
    logger.info(f"Applying feature engineering for {city}...")
    
    df = df.copy()
    
    # Apply transformations
    df = create_location_features(df, city)
    df = create_amenity_features(df)
    df = create_property_features(df)
    
    logger.info(f"✅ Feature engineering complete. Created {len(df.columns)} features")
    
    return df


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    # Test on Delhi data
    df = pd.read_csv('delhi_cleaned.csv')
    df_engineered = engineer_features(df, 'delhi')
    
    print("\n" + "=" * 60)
    print("ORIGINAL FEATURES:", df.shape[1])
    print("ENGINEERED FEATURES:", df_engineered.shape[1])
    print("=" * 60)
    print("\nNew features created:")
    new_features = set(df_engineered.columns) - set(df.columns)
    for feat in sorted(new_features):
        print(f"  - {feat}")
