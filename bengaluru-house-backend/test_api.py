"""Test API predictions with validation"""
import requests
import json

BASE_URL = "http://localhost:8888"

# Test cases
test_cases = [
    {
        "name": "Delhi - With clean data (HIGH confidence)",
        "data": {
            "city": "delhi",
            "location": "Sector 10 Dwarka",
            "area": 1200,
            "bedrooms": 2,
            "bathrooms": 2
        }
    },
    {
        "name": "Bengaluru - Good data (HIGH confidence)",
        "data": {
            "city": "bengaluru",
            "location": "Koramangala",
            "area": 1000,
            "bedrooms": 2,
            "bathrooms": 2
        }
    },
    {
        "name": "Chennai - Limited data (LOW confidence)",
        "data": {
            "city": "chennai",
            "location": "Anna Nagar",
            "area": 900,
            "bedrooms": 2,
            "bathrooms": 1
        }
    },
]

print("=" * 80)
print("TESTING PHASE 1 - PREDICTION VALIDATION")
print("=" * 80)

for test in test_cases:
    print(f"\n✓ Test: {test['name']}")
    print(f"  Input: {test['data']}")
    
    try:
        response = requests.post(f"{BASE_URL}/api/predict", json=test['data'])
        
        if response.status_code == 200:
            result = response.json()
            print(f"  Status: ✅ SUCCESS")
            print(f"  Predicted Price: ₹{result.get('predicted_price', 0):,.0f}")
            print(f"  Confidence: {result.get('confidence', 'N/A')}")
            print(f"  Warning: {result.get('warning', 'None')}")
            print(f"  Data Points: {result.get('data_points_used', 0)}")
            
            price_range = result.get('price_range', {})
            if price_range:
                print(f"  Price Range: ₹{price_range.get('min', 0):,.0f} - ₹{price_range.get('max', 0):,.0f}")
                print(f"  Median: ₹{price_range.get('median', 0):,.0f}")
        else:
            print(f"  Status: ❌ ERROR {response.status_code}")
            print(f"  Response: {response.text[:200]}")
            
    except Exception as e:
        print(f"  Status: ❌ EXCEPTION: {str(e)}")

print("\n" + "=" * 80)
print("TEST COMPLETE")
print("=" * 80)
