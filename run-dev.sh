# ./run-dev.sh

echo "Starting backend (Docker)..."
docker compose up --build -d

echo "Starting frontend (Vite)..."
cd frontend
npm run dev