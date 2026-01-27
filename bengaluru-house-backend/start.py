import uvicorn
import util

if __name__ == "__main__":
    util.load_save_artifacts()
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
