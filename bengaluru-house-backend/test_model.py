import util

try:
    util.load_save_artifacts()
    print("✅ Model loaded successfully")

    # Test prediction
    result = util.get_estimated_price("indira nagar", 1200, 2, 2)
    print(f"✅ Prediction test successful: ₹{result} Lakhs")

    locations = util.get_location_names()
    print(f"✅ Locations loaded: {len(locations)} locations")

except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
