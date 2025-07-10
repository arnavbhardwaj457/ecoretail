#!/bin/bash

echo "🌱 EcoRetail Application Starter"
echo "================================"
echo

echo "Starting Backend Server..."
cd backend
npm install && npm start &
BACKEND_PID=$!

echo
echo "Starting Frontend Server..."
cd ../frontend
npm install && npm start &
FRONTEND_PID=$!

echo
echo "🚀 Both servers are starting..."
echo
echo "Backend will be available at: http://localhost:5000"
echo "Frontend will be available at: http://localhost:3000"
echo
echo "Press Ctrl+C to stop both servers..."

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID 