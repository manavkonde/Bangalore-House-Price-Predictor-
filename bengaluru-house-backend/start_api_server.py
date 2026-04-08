#!/usr/bin/env python
"""
Start the FastAPI server for multi-city house price predictions.
Access API at http://localhost:8888/docs for interactive documentation
"""

import logging
import os
import sys

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def main():
    try:
        logger.info("Initializing Multi-City Price Prediction API...")
        
        # Import after logger setup
        import util_citywise as util
        from fastapi import FastAPI
        import uvicorn
        
        # Import app
        from app_citywise import app
        
        # Pre-load models
        logger.info("Loading ML models and data...")
        util.load_all_artifacts()
        logger.info("✅ All models and data loaded successfully!")
        
        port = int(os.environ.get("PORT", 8888))
        logger.info(f"🚀 Starting server on http://0.0.0.0:{port}")
        logger.info(f"📖 API Documentation: http://localhost:{port}/docs")
        logger.info(f"Available endpoints:")
        logger.info(f"  GET  /              - Health check")
        logger.info(f"  GET  /api/cities    - List cities")
        logger.info(f"  POST /api/predict   - Single prediction")
        logger.info(f"  POST /api/compare-cities - Compare across cities")
        logger.info(f"  GET  /api/statistics/{{city}} - City statistics")
        logger.info("\nStarting Uvicorn server...")
        
        # Run server
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=port,
            log_level="info"
        )
        
    except Exception as e:
        logger.error(f"❌ Error: {e}", exc_info=True)
        sys.exit(1)

if __name__ == "__main__":
    main()
