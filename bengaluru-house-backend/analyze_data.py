"""Analyze data quality and identify outliers"""
import pandas as pd
import numpy as np

cities = ['delhi', 'bengaluru', 'chennai', 'hyderabad', 'kolkata']

print("=" * 80)
print("DATA QUALITY ANALYSIS - PRICE DISTRIBUTION")
print("=" * 80)

for city in cities:
    try:
        df = pd.read_csv(f'{city}_cleaned.csv')
        prices = df['Price']
        
        print(f'\n{city.upper()}:')
        print(f'  Total records: {len(df)}')
        print(f'  Price statistics:')
        print(f'    Min:    ₹{prices.min():,}')
        print(f'    Max:    ₹{prices.max():,}')
        print(f'    Mean:   ₹{prices.mean():,.0f}')
        print(f'    Median: ₹{prices.median():,.0f}')
        print(f'    Std:    ₹{prices.std():,.0f}')
        print(f'    Q1:     ₹{prices.quantile(0.25):,.0f}')
        print(f'    Q3:     ₹{prices.quantile(0.75):,.0f}')
        
        # Find outliers
        median_price = prices.median()
        q3 = prices.quantile(0.75)
        iqr = q3 - prices.quantile(0.25)
        upper_bound = q3 + 1.5 * iqr
        
        outliers = df[df['Price'] > upper_bound]
        
        if len(outliers) > 0:
            print(f'\n  ⚠️ OUTLIERS DETECTED ({len(outliers)} records):')
            for idx, row in outliers.iterrows():
                ratio = row['Price'] / median_price
                print(f'    • {row.get("Location", "Unknown")}: ₹{row["Price"]:,} ({ratio:.1f}x median)')
        else:
            print(f'\n  ✓ No outliers detected')
            
    except Exception as e:
        print(f'\n{city.upper()}: Error reading file - {str(e)}')

print("\n" + "=" * 80)
print("RECOMMENDATIONS:")
print("=" * 80)
print("Remove records where: Price > Q3 + 1.5*IQR")
print("This removes extreme outliers while keeping valid data")
