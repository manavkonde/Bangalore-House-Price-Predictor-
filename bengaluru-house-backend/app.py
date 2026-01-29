from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel, Field, validator
import util
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
app = FastAPI(title="Bengaluru House Price Prediction API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security Middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual frontend URL
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Input Validation Model
class PredictionRequest(BaseModel):
    location: str = Field(..., min_length=2, max_length=100, pattern="^[a-zA-Z0-9\s\-,.]+$")
    total_sqft: float = Field(..., gt=0, lt=100000)
    bhk: int = Field(..., gt=0, lt=20)
    bath: int = Field(..., gt=0, lt=20)

    @validator('location')
    def sanitize_location(cls, v):
        return v.strip().lower()

@app.get("/")
@limiter.limit("5/minute")
async def home(request: Request):
    return {"status": "healthy", "message": "Bengaluru House Price Prediction API is running"}

@app.get("/get_location_names")
@limiter.limit("10/minute")
async def get_location_names(request: Request):
    try:
        locations = util.get_location_names()
        if locations is None:
            # If locations are not yet loaded, load them
            util.load_save_artifacts()
            locations = util.get_location_names()
        return {"locations": locations}
    except Exception as e:
        logger.error(f"Error fetching locations: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/predict_home_price")
@limiter.limit("5/minute")
async def predict_home_price(request: Request, prediction_data: PredictionRequest):
    try:
        logger.info(f"Prediction request for location: {prediction_data.location}")
        estimated_price = util.get_estimated_price(
            prediction_data.location,
            prediction_data.total_sqft,
            prediction_data.bhk,
            prediction_data.bath
        )
        return {"estimated_price": estimated_price}
    except Exception as e:
        logger.error(f"Error in prediction: {e}")
        raise HTTPException(status_code=500, detail="Error occurred during prediction")

if __name__ == "__main__":
    util.load_save_artifacts()
    port = int(os.environ.get("PORT", 8888))
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)
