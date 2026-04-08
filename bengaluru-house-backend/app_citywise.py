from fastapi import FastAPI, Request, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel, Field, field_validator
from typing import Optional
import util_citywise as util
import os
import logging
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Rate limiting setup
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Multi-City House Price Prediction API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security Middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)


# ==================== Request Models ====================

class PredictionRequest(BaseModel):
    """Original Bengaluru prediction model"""
    location: str = Field(..., min_length=2, max_length=100)
    total_sqft: float = Field(..., gt=0, lt=100000)
    bhk: int = Field(..., gt=0, lt=20)
    bath: int = Field(..., gt=0, lt=20)


class CityPredictionRequest(BaseModel):
    """City-wise prediction model"""
    city: str = Field(..., description="City name: delhi, bengaluru, or combined")
    location: str = Field(..., min_length=2, max_length=100)
    area: float = Field(..., gt=0, lt=100000, description="Area in square meters")
    bedrooms: int = Field(..., gt=0, lt=20)
    bathrooms: Optional[int] = Field(default=None, ge=0, lt=20)

    @field_validator('city')
    @classmethod
    def validate_city(cls, v):
        valid_cities = ['delhi', 'bengaluru', 'chennai', 'hyderabad', 'kolkata', 'combined']
        if v.lower() not in valid_cities:
            raise ValueError(f'City must be one of: {valid_cities}')
        return v.lower()

    @field_validator('location')
    @classmethod
    def sanitize_location(cls, v):
        return v.strip()


class CityComparisonRequest(BaseModel):
    """Multi-city comparison model"""
    location: str = Field(..., min_length=2, max_length=100, description="Location name")
    area: float = Field(..., gt=0, lt=100000, description="Area in square meters")
    bedrooms: int = Field(..., gt=0, lt=20)
    bathrooms: Optional[int] = Field(default=None, ge=0, lt=20)

    @field_validator('location')
    @classmethod
    def sanitize_location(cls, v):
        return v.strip()


# ==================== Endpoints ====================

@app.get("/")
@limiter.limit("10/minute")
async def home(request: Request):
    return {
        "status": "healthy",
        "message": "Multi-City House Price Prediction API is running",
        "version": "2.0",
        "features": ["city-wise predictions", "multi-city analysis"]
    }


@app.get("/api/cities")
@limiter.limit("10/minute")
async def get_available_cities(request: Request):
    """Get list of available cities."""
    try:
        cities = util.get_available_cities()
        return {
            "cities": cities,
            "count": len(cities)
        }
    except Exception as e:
        logger.error(f"Error fetching cities: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/api/locations/{city}")
@limiter.limit("10/minute")
async def get_city_locations(city: str, request: Request):
    """Get all locations available in a specific city."""
    try:
        locations = util.get_city_locations(city)
        if not locations:
            raise HTTPException(status_code=404, detail=f"City '{city}' not found or has no locations")
        return {
            "city": city,
            "locations": locations,
            "count": len(locations)
        }
    except Exception as e:
        logger.error(f"Error fetching locations for {city}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/api/statistics/{city}")
@limiter.limit("10/minute")
async def get_city_statistics(city: str, request: Request):
    """Get statistics for a specific city."""
    try:
        stats = util.get_city_statistics(city)
        if not stats:
            raise HTTPException(status_code=404, detail=f"Statistics not found for city '{city}'")
        return stats
    except Exception as e:
        logger.error(f"Error fetching statistics for {city}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/api/predict")
@limiter.limit("10/minute")
async def predict_price_citywise(request: Request, prediction_data: CityPredictionRequest):
    """Predict house price for any city using city-specific models."""
    try:
        logger.info(
            f"Prediction request - City: {prediction_data.city}, "
            f"Location: {prediction_data.location}, "
            f"Area: {prediction_data.area} sqm, "
            f"Bedrooms: {prediction_data.bedrooms}"
        )
        
        # Get raw prediction
        predicted_price = util.predict_price(
            city=prediction_data.city,
            location=prediction_data.location,
            area=prediction_data.area,
            bedrooms=prediction_data.bedrooms,
            bathrooms=prediction_data.bathrooms
        )
        
        # Validate prediction
        validation = util.validate_prediction(prediction_data.city, predicted_price)
        
        return {
            "city": prediction_data.city,
            "location": prediction_data.location,
            "area": prediction_data.area,
            "bedrooms": prediction_data.bedrooms,
            "bathrooms": prediction_data.bathrooms or prediction_data.bedrooms,
            "predicted_price": validation['price'],
            "confidence": validation['confidence'],
            "confidence_level": {
                "HIGH": "Good model accuracy - sufficient data",
                "MEDIUM": "Moderate accuracy - limited data",
                "LOW": "Low accuracy - very limited data"
            }.get(validation['confidence'], "Unknown"),
            "price_range": validation['price_range'],
            "data_points_used": validation['data_points'],
            "warning": validation['warning'],
            "currency": "INR",
            "status": "success"
        }
    except ValueError as e:
        logger.warning(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error in prediction: {e}")
        raise HTTPException(status_code=500, detail="Error occurred during prediction")


@app.post("/api/compare-cities")
@limiter.limit("5/minute")
async def compare_cities_prediction(request: Request, comparison_data: CityComparisonRequest):
    """Compare predicted prices across multiple cities for same property."""
    try:
        cities = util.get_available_cities()
        predictions = {}
        
        for city in cities:
            try:
                price = util.predict_price(city, comparison_data.location, comparison_data.area, comparison_data.bedrooms, comparison_data.bathrooms)
                predictions[city] = {
                    "predicted_price": price,
                    "status": "success"
                }
            except Exception as e:
                predictions[city] = {
                    "error": str(e),
                    "status": "failed"
                }
        
        return {
            "property_details": {
                "location": comparison_data.location,
                "area": comparison_data.area,
                "bedrooms": comparison_data.bedrooms,
                "bathrooms": comparison_data.bathrooms or comparison_data.bedrooms
            },
            "city_predictions": predictions,
            "status": "success"
        }
    except Exception as e:
        logger.error(f"Error in city comparison: {e}")
        raise HTTPException(status_code=500, detail="Error occurred during comparison")


@app.get("/api/data-quality/{city}")
@limiter.limit("10/minute")
async def get_data_quality(city: str, request: Request):
    """Get data quality information and warnings for a city."""
    try:
        stats = util.get_city_statistics(city)
        if not stats:
            raise HTTPException(status_code=404, detail=f"City '{city}' not found")
        
        # Determine data quality level
        total_records = stats.get('total_records', 0)
        
        if total_records < 100:
            data_quality = "LOW"
            quality_message = "Very limited data - predictions may be significantly inaccurate"
            recommendation = "Use only as reference. Consider using a different city."
        elif total_records < 500:
            data_quality = "MEDIUM"
            quality_message = "Limited data - predictions are less reliable"
            recommendation = "Results should be verified with market research"
        elif total_records < 1000:
            data_quality = "GOOD"
            quality_message = "Moderate data - reasonable predictions expected"
            recommendation = "Results are generally reliable for estimates"
        else:
            data_quality = "EXCELLENT"
            quality_message = "Abundant data - high prediction accuracy"
            recommendation = "Results are reliable for decision making"
        
        return {
            "city": city,
            "data_quality": data_quality,
            "quality_message": quality_message,
            "total_records": total_records,
            "total_locations": stats.get('total_locations', 0),
            "recommendation": recommendation,
            "warnings": [
                f"Based on {total_records} property records"
                if total_records < 100 else None,
                "Limited geographic coverage" 
                if stats.get('total_locations', 0) < 50 else None,
            ] | {None}
        }
    except Exception as e:
        logger.error(f"Error getting data quality: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "cities_available": len(util.get_available_cities()),
        "models_loaded": len(util.get_available_cities()) > 0
    }


# ==================== Legacy Endpoints (Original) ====================

@app.get("/get_location_names")
@limiter.limit("10/minute")
async def get_location_names_legacy(request: Request):
    """Legacy endpoint - returns Bengaluru locations."""
    try:
        locations = util.get_city_locations('bengaluru')
        return {"locations": locations}
    except Exception as e:
        logger.error(f"Error fetching locations: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


if __name__ == "__main__":
    logger.info("Loading models...")
    util.load_all_artifacts()
    logger.info("✅ Models loaded successfully")
    
    port = int(os.environ.get("PORT", 8888))
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
