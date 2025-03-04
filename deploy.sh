
#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Build the React application
echo "Building React application..."
npm run build

# Create a dist directory if it doesn't exist
mkdir -p dist

# Move build files to dist directory
echo "Moving build files to dist directory..."
cp -r build/* dist/

# Start the server.js in the background
echo "Starting Node.js server..."
nohup node src/server.js > server.log 2>&1 &
echo $! > server.pid

echo "Deployment completed successfully!"
echo "React app is built in the dist directory"
echo "Node.js server is running in the background (PID: $(cat server.pid))"
echo "Server logs are available in server.log"

# Instructions for stopping the server
echo ""
echo "To stop the server, run: kill $(cat server.pid)"
