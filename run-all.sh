#!/bin/bash

# Start backend
cd bengaluru-house-backend
python start.py &

# Start frontend
cd ../Bengluru_house_price_prediction
npm run dev &

wait
