#!/bin/bash
# Helper script to run multiple OpenEVSE GUI instances for development
# 
# Usage:
#   ./run-multi-instance.sh [number_of_instances]
#
# Example:
#   ./run-multi-instance.sh 3
#
# This will start 3 GUI instances on ports 5173, 5174, 5175
# Each instance connects to openevse1.local, openevse2.local, openevse3.local respectively

set -e

NUM_INSTANCES=${1:-3}
BASE_PORT=5173

echo "Starting $NUM_INSTANCES OpenEVSE GUI instances..."
echo "Press Ctrl+C to stop all instances"
echo ""

# Array to store background process IDs
pids=()

# Cleanup function to kill all background processes
cleanup() {
    echo ""
    echo "Stopping all instances..."
    for pid in "${pids[@]}"; do
        kill "$pid" 2>/dev/null || true
    done
    exit 0
}

# Set up trap to call cleanup on script exit
trap cleanup INT TERM EXIT

# Start each instance
for i in $(seq 1 $NUM_INSTANCES); do
    PORT=$((BASE_PORT + i - 1))
    HOST="openevse${i}.local"
    
    echo "Starting instance $i:"
    echo "  Port: $PORT"
    echo "  Connecting to: $HOST"
    echo ""
    
    # Create temporary .env file for this instance
    TEMP_ENV=$(mktemp)
    cat > "$TEMP_ENV" << EOF
VITE_OPENEVSEHOST = "$HOST"
NODE_ICU_DATA = "\$(pwd)/node_modules/full-icu" node
EOF
    
    # Start the dev server in background
    VITE_PORT=$PORT VITE_OPENEVSEHOST=$HOST npm run dev > "/tmp/openevse-gui-${i}.log" 2>&1 &
    pids+=($!)
    
    # Clean up temp env file
    rm "$TEMP_ENV"
    
    # Give it a moment to start
    sleep 2
done

echo ""
echo "All instances started!"
echo ""
echo "Access the GUIs at:"
for i in $(seq 1 $NUM_INSTANCES); do
    PORT=$((BASE_PORT + i - 1))
    HOST="openevse${i}.local"
    echo "  Instance $i: http://localhost:$PORT (→ $HOST)"
done
echo ""
echo "Logs are available at: /tmp/openevse-gui-*.log"
echo ""
echo "Press Ctrl+C to stop all instances..."

# Wait for all background processes
wait
