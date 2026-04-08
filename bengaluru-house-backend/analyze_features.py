import pickle

# Load scaler and check what it expects
with open('delhi_gradientboosting_scaler.pickle', 'rb') as f:
    scaler = pickle.load(f)

print(f"Scaler expects {scaler.n_features_in_} features")
print(f"Feature names: {list(scaler.feature_names_in_)}")

# Now check model
with open('delhi_gradientboosting_model.pickle', 'rb') as f:
    model = pickle.load(f)
    
print(f"\nModel expects {model.n_features_in_} features")
if hasattr(model, 'feature_names_in_'):
    print(f"Model feature names: {list(model.feature_names_in_)}")
else:
    print("Model doesn't store feature names")

# Now let's figure out what the extra feature is
print("\nScaler features:")
for i, name in enumerate(scaler.feature_names_in_):
    print(f"  {i+1}. {name}")
