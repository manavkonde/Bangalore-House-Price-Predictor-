import pickle
import numpy as np

# Load Delhi model and check its expectations
with open('delhi_gradientboosting_model.pickle', 'rb') as f:
    model = pickle.load(f)

print(f"Model type: {type(model)}")
print(f"Model n_features_in_: {model.n_features_in_}")

# Try a simple prediction with right number of features
test_X = np.random.rand(1, 40)  # 40 features
try:
    pred = model.predict(test_X)
    print(f"✓ Prediction with 40 features works: {pred}")
except Exception as e:
    print(f"✗ Error with 40 features: {e}")

test_X_39 = np.random.rand(1, 39)  # 39 features
try:
    pred = model.predict(test_X_39)
    print(f"✓ Prediction with 39 features works: {pred}")
except Exception as e:
    print(f"✗ Error with 39 features: {e}")
