
#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Stop any existing server
echo "Checking for running server process..."
if [ -f server.pid ]; then
    PID=$(cat server.pid)
    if ps -p $PID > /dev/null; then
        echo "Stopping existing server (PID: $PID)..."
        kill $PID
        sleep 2  # Give the server some time to shut down gracefully
        
        # Check if it's still running and force kill if necessary
        if ps -p $PID > /dev/null; then
            echo "Server still running, force killing..."
            kill -9 $PID
        fi
        
        echo "Server stopped."
    else
        echo "No running server with PID: $PID"
    fi
    rm -f server.pid
    echo "Removed server.pid file."
else
    echo "No server.pid file found."
fi

# Build the React application
echo "Building React application..."
npm run build

# The build is already in the dist directory with Vite, no need to create or copy
echo "Build complete. Files are in the dist directory."

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
