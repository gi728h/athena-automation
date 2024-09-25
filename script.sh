#!/bin/bash

# Navigate to express-app directory and install dependencies
cd ./express-app
# Run the express app
echo "Starting express app..."
node app.js &

# Navigate back and then to react-app directory
cd ../react-app
# Start the react app
echo "Starting react app..."
npm run dev &

# Wait for a few seconds to ensure the React app has started
sleep 5

# Open http://localhost:5173/ in an incognito window in Chromium
echo "Opening http://localhost:5173/ in Chromium incognito mode..."
chromium-browser --incognito --start-fullscreen "http://localhost:5173/"
