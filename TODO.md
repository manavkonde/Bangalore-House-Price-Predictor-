# TODO: Connect Frontend to FastAPI Backend

- [x] Convert backend to FastAPI: Update app.py, install fastapi uvicorn fastapi-cors
- [x] Add CORS middleware to FastAPI with origins localhost:3000 and localhost:5173
- [x] Create .env in backend with PORT=8000
- [ ] Create .env in frontend with VITE_API_URL=http://localhost:8000
- [ ] Create src/services/api.js in frontend with axios instance
- [ ] Create start scripts in both folders
- [ ] Run npm install in frontend
- [ ] Git add all, commit with message "Connected frontend to FastAPI backend with CORS and API config"
- [ ] Create run-all.sh to start both services
- [ ] Execute run-all.sh
