from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import util
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    location: str
    total_sqft: float
    bhk: int
    bath: int

@app.get("/")
def home():
    return {"message": "FastAPI server is running"}

@app.get("/get_location_names")
def get_location_names():
    return {"locations": util.get_location_names()}

@app.post("/predict_home_price")
def predict_home_price(request: PredictionRequest):
    try:
        print(f"Received prediction request: {request.dict()}")
        estimated_price = util.get_estimated_price(
            request.location,
            request.total_sqft,
            request.bhk,
            request.bath
        )
        print(f"Prediction result: {estimated_price}")
        return {"estimated_price": estimated_price}
    except Exception as e:
        print(f"Error in prediction: {e}")
        import traceback
        traceback.print_exc()
        return {"error": str(e)}, 500

if __name__ == "__main__":
    util.load_save_artifacts()
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting server on port {port}")
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)
