"""
Train ensemble models for better predictions
Combines multiple algorithms for robust predictions
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor, VotingRegressor
from sklearn.linear_model import Ridge
import pickle
import logging
import os

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Try to import XGBoost, fallback if not available
HAS_XGBOOST = False
try:
    import xgboost as xgb
    HAS_XGBOOST = True
except Exception as e:
    logger.warning(f"XGBoost not available: {e}. Using GradientBoosting, RandomForest, Ridge instead.")

class EnsembleModelTrainer:
    """Train and evaluate ensemble of models."""
    
    def __init__(self, city: str):
        self.city = city.lower()
        self.model_path = os.path.dirname(os.path.abspath(__file__))
        self.models = {}
        self.scaler = None
        self.encoder = None
        
    def load_data(self, filename: str) -> pd.DataFrame:
        """Load cleaned dataset."""
        filepath = os.path.join(self.model_path, filename)
        df = pd.read_csv(filepath)
        logger.info(f"Loaded {len(df)} records from {filename}")
        return df
    
    def prepare_data(self, df: pd.DataFrame):
        """Prepare features and target."""
        # Separate features and target
        X = df.drop('Price', axis=1)
        y = df['Price']
        
        # Encode categorical variables
        categorical_cols = X.select_dtypes(include='object').columns
        if len(categorical_cols) > 0:
            self.encoder = LabelEncoder()
            for col in categorical_cols:
                if col in X.columns:
                    X[col] = self.encoder.fit_transform(X[col].astype(str))
        
        # Scale features
        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)
        X_scaled = pd.DataFrame(X_scaled, columns=X.columns)
        
        return X_scaled, y, X.columns
    
    def train_ensemble(self, X: pd.DataFrame, y: pd.Series):
        """Train multiple models and create ensemble."""
        
        logger.info(f"Training ensemble models for {self.city}...")
        
        models = {
            'GradientBoosting': GradientBoostingRegressor(
                n_estimators=100,
                max_depth=5,
                learning_rate=0.1,
                random_state=42,
                verbose=0
            ),
            'RandomForest': RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                n_jobs=-1
            ),
            'Ridge': Ridge(alpha=1.0)
        }
        
        # Add XGBoost if available
        if HAS_XGBOOST:
            models['XGBoost'] = xgb.XGBRegressor(
                n_estimators=100,
                max_depth=5,
                learning_rate=0.1,
                random_state=42,
                verbosity=0
            )
            logger.info("✅ XGBoost available")
        else:
            logger.info("⚠️ XGBoost not available, using GradientBoosting, RandomForest, Ridge")
        
        # Evaluate each model
        scores = {}
        for name, model in models.items():
            cv_scores = cross_val_score(model, X, y, cv=5, scoring='r2')
            scores[name] = {
                'mean': cv_scores.mean(),
                'std': cv_scores.std()
            }
            logger.info(f"  {name}: R² = {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
        
        # Train individual models
        for name, model in models.items():
            model.fit(X, y)
            self.models[name] = model
        
        # Create voting ensemble
        self.ensemble = VotingRegressor(
            estimators=[(name, model) for name, model in models.items()],
            n_jobs=-1
        )
        self.ensemble.fit(X, y)
        
        # Evaluate ensemble
        ensemble_scores = cross_val_score(self.ensemble, X, y, cv=5, scoring='r2')
        logger.info(f"  Ensemble: R² = {ensemble_scores.mean():.4f} (+/- {ensemble_scores.std():.4f})")
        
        return scores
    
    def save_models(self):
        """Save trained models to disk."""
        for name, model in self.models.items():
            filepath = os.path.join(self.model_path, f"{self.city}_{name.lower()}_model.pickle")
            with open(filepath, 'wb') as f:
                pickle.dump(model, f)
            logger.info(f"✅ Saved {name} model")
        
        # Save ensemble
        ensemble_path = os.path.join(self.model_path, f"{self.city}_ensemble_voting.pickle")
        with open(ensemble_path, 'wb') as f:
            pickle.dump(self.ensemble, f)
        logger.info(f"✅ Saved ensemble model")
        
        # Save scaler
        scaler_path = os.path.join(self.model_path, f"{self.city}_ensemble_scaler.pickle")
        with open(scaler_path, 'wb') as f:
            pickle.dump(self.scaler, f)
        logger.info(f"✅ Saved scaler")
    
    def train_and_save(self, filename: str):
        """Complete training pipeline."""
        logger.info(f"\n{'='*60}")
        logger.info(f"Training ensemble for {self.city.upper()}")
        logger.info(f"{'='*60}")
        
        # Load data
        df = self.load_data(filename)
        
        # Prepare data
        X, y, feature_names = self.prepare_data(df)
        logger.info(f"Features: {X.shape[1]}, Target: {y.shape[0]}")
        
        # Train ensemble
        scores = self.train_ensemble(X, y)
        
        # Save models
        self.save_models()
        
        logger.info(f"\n{'='*60}\n")
        
        return scores


# Training configuration
TRAINING_CONFIG = {
    'delhi': 'delhi_cleaned.csv',
    'bengaluru': 'bengaluru_cleaned.csv',
    'chennai': 'chennai_cleaned.csv',
    'hyderabad': 'hyderabad_cleaned.csv',
    'kolkata': 'kolkata_cleaned.csv',
    'combined': 'city_data_cleaned.csv'
}


if __name__ == "__main__":
    print("\n" + "="*80)
    print("ENSEMBLE MODEL TRAINING")
    print("="*80 + "\n")
    
    all_scores = {}
    
    for city, filename in TRAINING_CONFIG.items():
        try:
            trainer = EnsembleModelTrainer(city)
            scores = trainer.train_and_save(filename)
            all_scores[city] = scores
        except Exception as e:
            logger.error(f"❌ Error training {city}: {e}")
    
    # Summary
    print("\n" + "="*80)
    print("TRAINING SUMMARY")
    print("="*80)
    for city, scores in all_scores.items():
        print(f"\n{city.upper()}:")
        for model, score_dict in scores.items():
            print(f"  {model}: {score_dict['mean']:.4f}")
