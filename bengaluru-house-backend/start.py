import uvicorn
import util

if __name__ == "__main__":
    util.load_save_artifacts()
    print("Starting FastAPI server on http://localhost:8888")
    print("Press Ctrl+C to stop the server")
    uvicorn.run("app:app", host="0.0.0.0", port=8888, reload=False)
