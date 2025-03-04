
#!/bin/bash

echo "Stopping server..."

if [ -f server.pid ]; then
    PID=$(cat server.pid)
    if ps -p $PID > /dev/null; then
        kill $PID
        echo "Server process (PID: $PID) terminated."
    else
        echo "Server process (PID: $PID) is not running."
    fi
    rm server.pid
    echo "Server PID file removed."
else
    echo "No server PID file found."
fi

echo "Server stopped."
