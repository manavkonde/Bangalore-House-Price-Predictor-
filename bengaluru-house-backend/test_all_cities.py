import requests

# Test all cities
test_cases = [
    {"city": "delhi", "location": "Green Park", "area": 2500, "bedrooms": 2},
    {"city": "bengaluru", "location": "Indiranagar", "area": 2000, "bedrooms": 3},
    {"city": "combined", "location": "Sector 1", "area": 1500, "bedrooms": 2},
]

print("Testing predictions across cities:\n")
for test_data in test_cases:
    response = requests.post("http://localhost:8888/api/predict", json=test_data)
    if response.status_code == 200:
        result = response.json()
        print(f"✅ {test_data['city'].upper():10} | ₹{result['predicted_price']:>12,.0f} | Confidence: {result['confidence']}")
    else:
        print(f"❌ {test_data['city'].upper():10} | Status: {response.status_code}")
        print(f"   Error: {response.text[:100]}")
