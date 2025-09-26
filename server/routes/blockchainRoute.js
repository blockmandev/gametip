const express = require('express');
const router = express.Router();

const {
  getSolanaWalletInfo,
  getEVMGameTokenInfo,
  getNFTCollectionInfo,
  getGameStats,
  verifyTransaction
} = require('../controllers/blockchainController');

// Solana Routes
router.get('/blockchain/solana/wallet/:walletAddress', getSolanaWalletInfo);

// EVM Routes (Ethereum/Polygon)
router.get('/blockchain/evm/token/:walletAddress/:contractAddress', getEVMGameTokenInfo);
router.get('/blockchain/evm/nft/:walletAddress/:contractAddress', getNFTCollectionInfo);

// Game Statistics
router.get('/blockchain/game/stats', getGameStats);

// Transaction Verification
router.post('/blockchain/verify-transaction', verifyTransaction);

// Health check endpoint
router.get('/blockchain/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Blockchain API is running',
    endpoints: {
      solana: {
        wallet: '/api/v1/blockchain/solana/wallet/:walletAddress'
      },
      evm: {
        token: '/api/v1/blockchain/evm/token/:walletAddress/:contractAddress',
        nft: '/api/v1/blockchain/evm/nft/:walletAddress/:contractAddress'
      },
      game: {
        stats: '/api/v1/blockchain/game/stats'
      },
      verify: {
        transaction: '/api/v1/blockchain/verify-transaction'
      }
    }
  });
});

module.exports = router;