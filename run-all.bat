@echo off

REM Start backend
start cmd /c "cd bengaluru-house-backend && python start.py"

REM Start frontend
start cmd /c "cd Bengluru_house_price_prediction && npm run dev"

pause
