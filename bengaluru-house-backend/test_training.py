import pandas as pd
from sklearn.preprocessing import LabelEncoder

df = pd.read_csv('delhi_cleaned.csv')
print(f"CSV has {len(df.columns)} columns")

# Replicate training preprocessing
X = df.drop('Price', axis=1)
print(f"After dropping Price: {len(X.columns)} columns")
print(f"Columns: {list(X.columns)}\n")

# Find categorical columns
categorical_cols = X.select_dtypes(include='object').columns.tolist()
print(f"Categorical columns: {categorical_cols}")

# The training code encodes categorical columns
# But it has a bug - it refits the single encoder for each column
# This means only the LAST column's encoding is used
encoder = LabelEncoder()
for col in categorical_cols:
    print(f"Processing {col}")
    X[col] = encoder.fit_transform(X[col].astype(str))
    print(f"  Encoder fitted on {col}, classes: {len(encoder.classes_)}")

print(f"\nFinal X shape: {X.shape}")
print(f"Final X columns: {list(X.columns)}")
