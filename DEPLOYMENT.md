# Deployment Guide

This guide explains how to deploy the project to Render and push it to GitHub.

## 1. Push to GitHub

Initialize the repository and push your code:

```powershell
git init
git add .
git commit -m "chore: prepare for deployment and harden security"
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## 2. Deploy Backend (FastAPI) on Render

1.  Log in to [Render](https://render.com/).
2.  Click **New +** > **Web Service**.
3.  Connect your GitHub repository.
4.  **Service Name**: `house-price-backend` (or your choice).
5.  **Environment**: `Python 3`.
6.  **Build Command**: `pip install -r bengaluru-house-backend/requirements.txt`.
7.  **Start Command**: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker --chdir bengaluru-house-backend app:app`.
    > [!NOTE]
    > We use `--chdir bengaluru-house-backend` because the backend files are in a subdirectory.
8.  **Advanced**: Add Environment Variable `PORT=8888` (optional, Render usually handles this).

## 3. Deploy Frontend (Vite/React) on Render

1.  Click **New +** > **Static Site**.
2.  Connect your GitHub repository.
3.  **Service Name**: `house-price-frontend`.
4.  **Build Command**: `cd Bengluru_house_price_prediction && npm install && npm run build`.
5.  **Publish Directory**: `Bengluru_house_price_prediction/dist`.
6.  **Environment Variables**:
    *   `VITE_API_URL`: The URL of your deployed backend (e.g., `https://house-price-backend.onrender.com`).
    *   `VITE_SUPABASE_URL`: Your Supabase URL.
    *   `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase key.

## Security Features Implemented

*   **Rate Limiting**: Limits requests from the same IP to prevent brute-force and DDoS.
*   **Strict Validation**: Uses Pydantic with length and character constraints for all inputs.
*   **Sanitization**: Automatic stripping and lowercase conversion for locations.
*   **Security Headers**: CORS restricted (can be further restricted to frontend URL) and GZip compression.
*   **Environment Variables**: No sensitive keys are hardcoded in the codebase.
