import requests
import json

# Test prediction
data = {
    "city": "delhi",
    "location": "Ashok Vihar",
    "area": 3000,
    "bedrooms": 3
}

response = requests.post("http://localhost:8888/api/predict", json=data)
print(f"Status: {response.status_code}")
print(f"Response:")
result = response.json()
print(f"  Predicted Price: ₹{result.get('predicted_price', 'N/A'):,.2f}")
print(f"  Confidence: {result.get('confidence', 'N/A')}")
print(f"  Warning: {result.get('warning')}")
print(f"\nFull Response:")
print(json.dumps(result, indent=2))
