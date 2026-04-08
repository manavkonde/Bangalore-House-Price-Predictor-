"""Clean data by removing outliers using IQR method"""
import pandas as pd
import numpy as np

def clean_city_data(city_name, output_suffix="_outliers_removed"):
    """Remove outliers from city data using IQR method"""
    
    input_file = f'{city_name}_cleaned.csv'
    output_file = f'{city_name}{output_suffix}.csv'
    
    # Read data
    df = pd.read_csv(input_file)
    original_count = len(df)
    
    # Calculate IQR
    prices = df['Price']
    q1 = prices.quantile(0.25)
    q3 = prices.quantile(0.75)
    iqr = q3 - q1
    
    # Define bounds (keep data within Q1-1.5*IQR to Q3+1.5*IQR)
    lower_bound = q1 - 1.5 * iqr
    upper_bound = q3 + 1.5 * iqr
    
    # For this project, we're mostly concerned about upper outliers
    # So let's use a more aggressive approach: remove anything > 2x Q3
    upper_bound = q3 * 2
    
    # Remove outliers
    df_clean = df[(df['Price'] >= lower_bound) & (df['Price'] <= upper_bound)]
    removed_count = original_count - len(df_clean)
    
    # Save cleaned data
    df_clean.to_csv(output_file, index=False)
    
    print(f"\n{city_name.upper()}:")
    print(f"  Original records: {original_count}")
    print(f"  Removed (outliers): {removed_count}")
    print(f"  Final records: {len(df_clean)}")
    print(f"  Removal rate: {(removed_count/original_count)*100:.1f}%")
    print(f"  Output: {output_file}")
    
    # Show new statistics
    new_prices = df_clean['Price']
    print(f"  New price range: ₹{new_prices.min():,} to ₹{new_prices.max():,}")
    print(f"  New median: ₹{new_prices.median():,.0f}")
    
    return df_clean

# Clean all cities
cities = ['delhi', 'bengaluru', 'chennai', 'hyderabad', 'kolkata']

print("=" * 60)
print("CLEANING DATA - REMOVING OUTLIERS")
print("=" * 60)

for city in cities:
    try:
        clean_city_data(city)
    except Exception as e:
        print(f"\n{city.upper()}: ERROR - {str(e)}")

print("\n" + "=" * 60)
print("CLEANUP COMPLETE")
print("=" * 60)
print("\nNext steps:")
print("1. Review *_outliers_removed.csv files")
print("2. If satisfied, rename to overwrite original *_cleaned.csv")
print("3. Run model training with new data")
