# House Price Prediction - Implementation Plan
**Updated: April 1, 2026**
**Status: Active Development**

---

## Executive Summary

The model is producing unrealistic predictions due to:
- **Small datasets** (Chennai 20 records, Hyderabad 20, Kolkata 55, Delhi 1.7K)
- **Data quality issues** (outliers skewing predictions)
- **No prediction validation** (no bounds checking)
- **Sklearn version mismatch** (compatibility warnings)

**Goal:** Improve prediction accuracy and reliability within 2 weeks.

---

## Phase 1: Immediate Fixes (Week 1) ⚡

### 1.1 Data Cleaning & Outlier Removal
**Status:** Not Started  
**Priority:** 🔴 CRITICAL  
**Effort:** 4-6 hours

**Tasks:**
- [ ] Analyze price distribution for each city
  - Calculate statistics: mean, median, std dev, quartiles
  - Identify outliers (prices > 2-3x median)
  
- [ ] Remove outliers from CSV files
  - Delhi: Remove West End property (₹110M - outlier)
  - Keep only realistic price ranges per location
  - Document removed records
  
- [ ] Validate cleaned data
  - Check for missing values
  - Verify consistency across columns
  - Ensure price range is realistic

**Files to modify:**
- `bengaluru_cleaned.csv`
- `delhi_cleaned.csv`
- `chennai_cleaned.csv`
- `hyderabad_cleaned.csv`
- `kolkata_cleaned.csv`

**Expected Outcome:**
```
Before: Delhi prices 2.5M - 110M (45x spread)
After:  Delhi prices 2.5M - 20M (8x spread)
```

---

### 1.2 Add Prediction Validation & Bounds
**Status:** Not Started  
**Priority:** 🔴 CRITICAL  
**Effort:** 2-3 hours

**Tasks:**
- [ ] Update `util_citywise.py` - Add validation function
  ```python
  def validate_prediction(city, predicted_price, input_features):
      """Validate prediction is within reasonable bounds"""
      - Calculate expected price range from training data
      - Check if prediction is within 0.5x to 3x the median
      - Return (price, confidence_score, is_valid)
  ```

- [ ] Update `app_citywise.py` - Add bounds checking
  ```python
  @app.post("/api/predict")
  - Make prediction
  - Validate prediction
  - If invalid, return warning message
  - Always return confidence score
  ```

- [ ] Modify response schema
  ```python
  {
      "predictedPrice": 3205449,
      "currency": "INR",
      "confidence": "LOW",
      "priceRange": {"min": 2000000, "max": 5000000},
      "warning": "Limited data for this location...",
      "dataPoints": 45
  }
  ```

**Files to modify:**
- `util_citywise.py` (add 50 lines)
- `app_citywise.py` (update 20 lines)

**Expected Outcome:**
- Predictions < 2x median = High confidence
- Predictions 2-3x = Medium confidence
- Predictions > 3x = Low confidence + Warning

---

### 1.3 Update Model Version Compatibility
**Status:** Not Started  
**Priority:** 🟡 HIGH  
**Effort:** 1-2 hours

**Tasks:**
- [ ] Update requirements.txt
  ```
  scikit-learn>=1.7.2  (upgrade from 1.6.1)
  ```

- [ ] Reinstall packages
  ```bash
  pip install --upgrade scikit-learn
  ```

- [ ] Retrain models (optional, if using updated sklearn)
  - Run `train_models.py` to regenerate pickle files
  - Or suppress warnings by setting environment variable

**Files to modify:**
- `requirements.txt`

**Expected Outcome:**
- No sklearn version mismatch warnings
- Models load cleanly

---

### 1.4 Update Frontend UI - Show Confidence
**Status:** Not Started  
**Priority:** 🟡 HIGH  
**Effort:** 3-4 hours

**Tasks:**
- [ ] Update `PriceResult.tsx`
  - Add confidence badge (High/Medium/Low)
  - Show price range instead of exact value
  - Display data points used in calculation
  - Add warning message for low confidence

- [ ] Update `PredictionForm.tsx`
  - Add help text for each city
  - Warn about data limitations: "Chennai model has only 20 properties"

- [ ] Create `ConfidenceIndicator` component
  - Show green/yellow/red indicator
  - Explain what confidence means

**Files to modify:**
- `src/components/PriceResult.tsx` (add 40 lines)
- `src/components/PredictionForm.tsx` (add 20 lines)
- `src/components/ConfidenceIndicator.tsx` (new file)

**Expected Outcome:**
```
Before: ₹32,05,49,549.58 Cr
After:  ₹32,05,49,549.58 Cr ⚠️ LOW CONFIDENCE
        Expected range: ₹20L - ₹50L
        Data points: 45
```

---

## Phase 2: Model Improvements (Week 2) 📊

### 2.1 Better Feature Engineering
**Status:** Not Started  
**Priority:** 🟡 HIGH  
**Effort:** 6-8 hours

**Tasks:**
- [ ] Create location-based features
  ```python
  1. Location rank by avg price
  2. Location density (properties per sq km)
  3. Price variance in location
  4. Distance to city center
  5. Amenity density score
  ```

- [ ] Add temporal features
  ```python
  1. Year of data collection
  2. Market trend indicator
  3. Seasonal factor
  ```

- [ ] Normalize amenity features
  ```python
  Current: Binary (0/1)
  New: Weighted by importance
  - Schools: High weight
  - Gym: Medium weight
  - Microwave: Low weight
  ```

**Files to create/modify:**
- `feature_engineering.py` (new)
- `train_models.py` (update)

**Expected Outcome:**
- Better feature correlation with prices
- Reduced overfitting

---

### 2.2 Implement Ensemble Model
**Status:** Not Started  
**Priority:** 🟡 HIGH  
**Effort:** 8-10 hours

**Tasks:**
- [ ] Train multiple models
  ```python
  1. GradientBoosting (current)
  2. RandomForest (for comparison)
  3. XGBoost (better for small datasets)
  4. LinearRegression (baseline)
  5. Ridge/Lasso (regularized)
  ```

- [ ] Create ensemble predictor
  ```python
  def ensemble_predict(features, city):
      predictions = []
      for model in models:
          pred = model.predict(features)
          predictions.append(pred)
      return {
          "median": np.median(predictions),
          "mean": np.mean(predictions),
          "std": np.std(predictions),
          "individual": predictions
      }
  ```

- [ ] Evaluate models
  ```python
  - Compare RMSE, MAE, R² score
  - Use cross-validation
  - Pick best performer per city
  ```

**Files to create/modify:**
- `train_ensemble_models.py` (new)
- `util_citywise.py` (update prediction logic)
- `app_citywise.py` (update /api/predict endpoint)

**Expected Outcome:**
- More robust predictions
- Better generalization to new data

---

### 2.3 Hyperparameter Tuning
**Status:** Not Started  
**Priority:** 🟠 MEDIUM  
**Effort:** 4-6 hours

**Tasks:**
- [ ] Analyze current model parameters
  ```python
  GradientBoosting:
  - n_estimators: 100 → Try 50-200
  - max_depth: 5 → Try 3-7 (smaller for less overfitting)
  - learning_rate: 0.1 → Try 0.01-0.1
  - min_samples_split: 10 → Try 5-20
  ```

- [ ] Implement GridSearchCV
  ```python
  param_grid = {
      'n_estimators': [50, 100, 150],
      'max_depth': [3, 5, 7],
      'learning_rate': [0.01, 0.05, 0.1]
  }
  GridSearchCV(model, param_grid, cv=5)
  ```

- [ ] Test on validation set
  - Use 80/20 train-test split
  - Report metrics for each parameter combo

**Files to create/modify:**
- `hyperparameter_tuning.py` (new)

**Expected Outcome:**
- Better model performance
- Reduced overfitting

---

## Phase 3: Data Expansion (Ongoing) 📈

### 3.1 Scrape Real Estate Data
**Status:** Not Started  
**Priority:** 🔴 CRITICAL  
**Effort:** 10-15 hours (per source)

**Data Sources:**
1. **99acres.com** (largest in India)
   - Target: 2000+ properties/city
   - Features: Price, Area, Location, Amenities

2. **MagicBricks.com**
   - Target: 1000+ properties/city
   - Features: Price, BHK, Amenities

3. **Kaggle Datasets**
   - Indian real estate datasets
   - Government housing data

4. **Zomato/Google Maps API**
   - Nearby amenities data
   - Location intelligence

**Tasks:**
- [ ] Create web scrapers
  ```python
  scrapers/
  ├── scraper_99acres.py
  ├── scraper_magicbricks.py
  └── scraper_kaggle.py
  ```

- [ ] Data validation pipeline
  ```python
  1. Check price is within range
  2. Validate location exists
  3. Remove duplicates
  4. Handle missing values
  5. Log data quality metrics
  ```

- [ ] Update CSV files
  ```
  Before: Delhi 1.7K records → After: 5K+ records
  Before: Chennai 20 records → After: 1K+ records
  ```

**Target Data Points:**
- Delhi: 1,716 → 5,000+
- Bengaluru: 11,945 → 15,000+
- Chennai: 20 → 1,000+
- Hyderabad: 20 → 1,000+
- Kolkata: 55 → 1,000+

**Files to create:**
- `scrapers/` directory (new)
- `data_collection_report.md` (new)

**Expected Outcome:**
- Training sample sizes: 1000+ per city minimum
- Better model generalization

---

### 3.2 Add External Data Sources
**Status:** Not Started  
**Priority:** 🟡 HIGH  
**Effort:** 8-12 hours

**Data to integrate:**
1. **Location Intelligence**
   - Traffic density (Google Maps API)
   - Walkability score
   - Nightlife index

2. **Economic Indicators**
   - Employment centers nearby
   - Commercial areas
   - School rankings

3. **Infrastructure Data**
   - Metro/bus stops distance
   - Highway connectivity
   - Airport distance

4. **Market Trends**
   - Historical price trends
   - Growth rate per location
   - Demand-supply index

**Tasks:**
- [ ] Integrate Google Maps API
  - Get nearby amenities count
  - Calculate walking distance
  - Find transit options

- [ ] Create location enrichment service
  ```python
  def enrich_location_data(location, city):
      - Google Maps API call
      - Calculate proximity scores
      - Return enhanced features
  ```

- [ ] Update model features
  - Add enriched features
  - Retrain models
  - Evaluate improvement

**Files to create/modify:**
- `location_enrichment.py` (new)
- `api_integrations/` directory (new)

**Expected Outcome:**
- Richer feature set
- Better prediction accuracy

---

## Phase 4: UI/UX Improvements 🎨

### 4.1 Confidence Level Display
**Status:** Not Started  
**Priority:** 🟡 HIGH  
**Effort:** 2-3 hours

**Implementation:**
- [ ] Create confidence badge component
  ```
  High (✓):    Green   - 50+ data points
  Medium (~):  Yellow  - 20-50 data points
  Low (⚠️):     Orange  - <20 data points
  ```

- [ ] Update PriceResult.tsx
  - Show badge with prediction
  - Explain data limitations
  - Suggest using other models

**Expected UI:**
```
₹32,05,49,549.58 Cr
⚠️ LOW CONFIDENCE
Data quality: 45 properties analyzed

This location has limited data. 
Consider checking similar nearby areas.
```

---

### 4.2 Price Range Display
**Status:** Not Started  
**Priority:** 🟡 HIGH  
**Effort:** 2-3 hours

**Implementation:**
- [ ] Calculate confidence intervals
  ```python
  predicted = 3205449
  std_error = 500000
  lower = predicted - 1.96 * std_error (95% CI)
  upper = predicted + 1.96 * std_error
  ```

- [ ] Show visual range slider
  ```
  ₹25,00,000 ─────●───── ₹35,00,000
                  ↑
           Expected Price
  ```

- [ ] Display comparable properties
  - Show 3-5 similar properties
  - Show their actual prices

**Expected UI:**
```
ESTIMATED PRICE RANGE
₹25,00,000 to ₹35,00,000
Most likely: ₹32,05,449

Similar properties in this area:
- Property A: ₹28,00,000 (950 sqft)
- Property B: ₹34,50,000 (1100 sqft)
- Property C: ₹31,00,000 (1050 sqft)
```

---

### 4.3 Data Quality Warnings
**Status:** Not Started  
**Priority:** 🟡 HIGH  
**Effort:** 2-3 hours

**Implementation:**
- [ ] Add location warnings
  ```
  Chennai Model Status: ⚠️ LIMITED DATA
  Only 20 properties in dataset
  Consider using a different city
  ```

- [ ] Show data freshness
  ```
  Data collected: Jan 2024
  Market trend: +5% YoY
  ```

- [ ] Add model versioning
  ```
  Model version: 1.0.0
  Trained on: 1,716 properties
  Accuracy on test data: 73%
  Last updated: Jan 15, 2025
  ```

---

## Phase 5: Testing & Validation 🧪

### 5.1 Unit Tests
**Status:** Not Started  
**Priority:** 🟡 HIGH  
**Effort:** 4-5 hours

**Tests to create:**
```python
tests/
├── test_data_cleaning.py
├── test_prediction_validation.py
├── test_model_predictions.py
├── test_api_endpoints.py
└── test_feature_engineering.py
```

**Test cases:**
- Input validation (wrong data types)
- Boundary conditions (min/max values)
- Prediction bounds (not exceeding limits)
- Model consistency (same input = same output)
- API response format validation

---

### 5.2 Integration Tests
**Status:** Not Started  
**Priority:** 🟠 MEDIUM  
**Effort:** 2-3 hours

**Test scenarios:**
- End-to-end prediction flow
- Multiple city predictions
- Comparison predictions
- Error handling

---

### 5.3 Performance Benchmarking
**Status:** Not Started  
**Priority:** 🟠 MEDIUM  
**Effort:** 2-3 hours

**Metrics to track:**
- Prediction latency (target: < 200ms)
- Model accuracy (RMSE, MAE)
- API response time (target: < 500ms)
- Memory usage

---

## Phase 6: Deployment & Monitoring 🚀

### 6.1 Version Control
**Status:** Not Started  
**Priority:** 🟡 HIGH  
**Effort:** 1-2 hours

**Tasks:**
- [ ] Create develop branch
- [ ] Commit Phase 1 changes
- [ ] Create Pull Request
- [ ] Code review
- [ ] Merge to main

**Git strategy:**
```
main ← develop ← feature branches
```

---

### 6.2 Model Versioning
**Status:** Not Started  
**Priority:** 🟡 HIGH  
**Effort:** 1-2 hours

**Implementation:**
```
models/
├── v1.0/ (current)
│   ├── delhi_model.pickle
│   └── metadata.json
├── v1.1/ (after data cleaning)
│   ├── delhi_model.pickle
│   └── metadata.json
└── v2.0/ (ensemble models)
    ├── ensemble_delhi.pickle
    └── metadata.json
```

**Metadata to track:**
```json
{
  "version": "1.0.0",
  "date": "2026-04-01",
  "model_type": "GradientBoosting",
  "training_samples": 1716,
  "test_accuracy": 0.73,
  "features_count": 38,
  "cities_supported": 6
}
```

---

## Timeline & Dependencies 📅

```
Week 1 (Phase 1): Immediate Fixes
├─ Day 1-2: Data cleaning & outlier removal
├─ Day 3: Prediction validation
├─ Day 4: Update packages & retrain
└─ Day 5: Frontend UI updates

Week 2 (Phase 2): Model Improvements
├─ Day 6-7: Feature engineering
├─ Day 8-9: Ensemble models
└─ Day 10: Hyperparameter tuning

Ongoing (Phase 3+): Data & Enhancement
├─ Web scraping
├─ API integrations
├─ Testing suite
└─ Deployment
```

---

## Success Metrics 📊

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| Delhi prediction accuracy (RMSE) | High | < 10% error | Week 2 |
| Chennai model data points | 20 | 1000+ | Week 3 |
| Prediction response time | < 500ms | < 200ms | Week 2 |
| Model confidence score | N/A | Show always | Week 1 |
| Frontend warning messages | None | Per city | Week 1 |
| Test coverage | 0% | > 80% | Week 2 |

---

## Risk Mitigation 🛡️

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Data scraping blocked | High | Use public APIs, backup sources |
| Model accuracy poor | High | Ensemble approach, feature engineering |
| API rate limits | Medium | Implement caching, batch processing |
| User confusion | Medium | Better UI, clear explanations |
| Data outdated | Low | Periodic refresh, trend indicators |

---

## Resource Requirements 💻

### Development
- 1-2 developers
- Time: 40-60 hours total
- Environment: Python 3.12, Node.js

### Infrastructure
- Cloud storage for datasets (AWS S3, GCP)
- API quotas for external services
- Dashboard monitoring tools

### Data
- Multiple scrapers running
- Data storage: 2-5GB minimum
- Processing: 50+ hours of compute

---

## Rollback Plan 🔄

If issues arise:
1. Revert to previous model version
2. Use git branch strategy
3. Keep backward-compatible API responses
4. Gradual rollout with feature flags

---

## Next Steps 🎯

**Immediate Action (This Week):**
1. ✅ Start Phase 1 implementation
2. ✅ Fix data outliers
3. ✅ Add prediction validation
4. ✅ Update frontend UI
5. ✅ Create git branch & commit

**Review Points:**
- Day 5: Phase 1 review
- Day 10: Phase 2 review
- Weekly: Monitoring metrics

---

## Contact & Updates

**Last Updated:** April 1, 2026  
**Next Review:** April 8, 2026  
**Owner:** Manav Konde  
**Status:** ACTIVE DEVELOPMENT

---

**Document Version:** 1.0  
**Approval:** Ready for implementation
