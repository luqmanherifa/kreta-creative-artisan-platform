# ./stop-dev.sh

echo "Stopping frontend (Vite)..."

VITE_PID=$(ps | grep "vite" | grep -v grep | awk '{print $1}')

if [ -n "$VITE_PID" ]; then
  kill -9 $VITE_PID
  echo "Frontend stopped"
else
  echo "Frontend not running"
fi

echo "Stopping backend (Docker)..."
docker compose down

echo "All services stopped"