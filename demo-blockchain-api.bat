@echo off
echo ========================================
echo    GameTip Blockchain API Demo
echo ========================================
echo.

echo [1] Testing Health Endpoint...
curl -s http://localhost:7000/api/v1/blockchain/health
echo.
echo.

echo [2] Testing Game Statistics...
curl -s http://localhost:7000/api/v1/blockchain/game/stats
echo.
echo.

echo [3] Testing Solana Wallet (Example Address)...
curl -s http://localhost:7000/api/v1/blockchain/solana/wallet/DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK
echo.
echo.

echo ========================================
echo    Demo Complete!
echo ========================================
echo.
echo To test EVM endpoints, ensure ethers.js is installed:
echo   npm install ethers
echo.
echo Available endpoints:
echo   - /api/v1/blockchain/health
echo   - /api/v1/blockchain/solana/wallet/:address
echo   - /api/v1/blockchain/evm/token/:wallet/:contract
echo   - /api/v1/blockchain/evm/nft/:wallet/:contract
echo   - /api/v1/blockchain/game/stats
echo   - /api/v1/blockchain/verify-transaction
echo.
pause