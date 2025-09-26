const express = require('express');
const app = express();
const PORT = 3001;

// Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(express.json());

// Import blockchain routes
const blockchainRoutes = require('./server/routes/blockchainRoute');

// Use blockchain routes
app.use('/api/v1', blockchainRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Test Server Running',
    port: PORT,
    endpoints: {
      health: `http://localhost:${PORT}/api/v1/blockchain/health`,
      gameStats: `http://localhost:${PORT}/api/v1/blockchain/game/stats`,
      solanaWallet: `http://localhost:${PORT}/api/v1/blockchain/solana/wallet/:address`,
      evmToken: `http://localhost:${PORT}/api/v1/blockchain/evm/token/:wallet/:contract`,
      evmNft: `http://localhost:${PORT}/api/v1/blockchain/evm/nft/:wallet/:contract`
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Blockchain API Test Server running on port ${PORT}`);
  console.log(`📍 Test endpoints at: http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/v1/blockchain/health`);
});