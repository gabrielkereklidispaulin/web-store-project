@echo off
echo 🧪 Testing Order Backend API...
echo.

echo 1️⃣ Testing Health Check...
curl -s http://localhost:5001/api/health
echo.
echo.

echo 2️⃣ Getting Products for Testing...
curl -s http://localhost:5001/api/products | findstr /C:"_id" | findstr /C:"name" | head -5
echo.

echo 3️⃣ Testing Order Creation (Guest Order)...
curl -X POST http://localhost:5001/api/orders ^
  -H "Content-Type: application/json" ^
  -d "{\"items\":[{\"product\":\"507f1f77bcf86cd799439011\",\"quantity\":2}],\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john.doe@example.com\",\"phone\":\"+46 70 123 4567\",\"shippingAddress\":{\"street\":\"Test Street 123\",\"city\":\"Stockholm\",\"zipCode\":\"111 22\",\"country\":\"Sweden\"},\"payment\":{\"method\":\"card\"}}"
echo.
echo.

echo 4️⃣ Testing Order Validation (Invalid Data)...
curl -X POST http://localhost:5001/api/orders ^
  -H "Content-Type: application/json" ^
  -d "{\"items\":[],\"shippingAddress\":{\"street\":\"\",\"city\":\"Stockholm\"},\"payment\":{\"method\":\"invalid\"}}"
echo.
echo.

echo 5️⃣ Testing Non-existent Order...
curl -s http://localhost:5001/api/orders/507f1f77bcf86cd799439011
echo.
echo.

echo ✅ Basic Order Backend Tests Completed!
echo.
echo To run comprehensive tests, use: node test-order-backend.js

