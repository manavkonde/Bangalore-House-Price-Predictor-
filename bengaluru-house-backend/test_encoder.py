import pickle
import pandas as pd

# Load Delhi encoder and scaler
with open('delhi_gradientboosting_encoder.pickle', 'rb') as f:
    enc = pickle.load(f)

with open('delhi_gradientboosting_scaler.pickle', 'rb') as f:
    scaler = pickle.load(f)

# Load data to see what features it was trained on
df = pd.read_csv('delhi_cleaned.csv')
print(f"CSV columns: {len(df.columns)}")
print(f"Columns: {list(df.columns)}\n")

# Check what the scaler was fitted on
print(f"Scaler n_features: {scaler.n_features_in_}")
print(f"Scaler feature names: {list(scaler.feature_names_in_)}\n")

# Check encoder
print(f"Encoder classes (what it knows): {enc.classes_}")
