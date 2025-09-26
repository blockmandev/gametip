# Blockchain API Integration - GameTip Project

## Overview
This API provides comprehensive blockchain integration for the GameTip gaming platform, supporting both Solana and EVM-compatible chains (Ethereum, Polygon). It enables real-time interaction with smart contracts to manage gaming tokens, NFTs, and player rewards.

## Features

### 1. Multi-Chain Support
- **Solana**: SPL tokens, NFTs, and program interactions
- **EVM Chains**: ERC20 tokens, ERC721 NFTs, smart contract calls
- **Polygon**: Optimized for gaming with low transaction costs

### 2. Smart Contract Integration
- Custom GameToken (GTT) with reward system
- Player level tracking
- Daily rewards and game rewards
- NFT collection management

### 3. API Endpoints

#### Health Check
```bash
GET /api/v1/blockchain/health
```

#### Solana Endpoints
```bash
# Get wallet info, SOL balance, and SPL tokens
GET /api/v1/blockchain/solana/wallet/:walletAddress

Example:
GET /api/v1/blockchain/solana/wallet/DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK
```

#### EVM Endpoints
```bash
# Get gaming token balance and rewards
GET /api/v1/blockchain/evm/token/:walletAddress/:contractAddress

# Get NFT collection info
GET /api/v1/blockchain/evm/nft/:walletAddress/:contractAddress

Examples:
GET /api/v1/blockchain/evm/token/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0
```

#### Game Statistics
```bash
GET /api/v1/blockchain/game/stats
```

#### Transaction Verification
```bash
POST /api/v1/blockchain/verify-transaction

Body:
{
  "txHash": "0x...",
  "chain": "solana" | "polygon" | "ethereum"
}
```

## Smart Contract: GameToken (GTT)

### Contract Features
- **Token Name**: GameTip Token (GTT)
- **Daily Rewards**: 100 GTT tokens per day
- **Game Rewards**: 10 GTT for wins, 1 GTT for participation
- **Level System**: Earn points to level up
- **Bonus Rewards**: Level-up bonuses

### Key Functions
```solidity
claimDailyReward()     // Claim daily 100 GTT tokens
playGame(bool won)      // Play game and earn rewards
getPlayerStats(address) // Get comprehensive player data
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install ethers @solana/web3.js
```

### 2. Environment Variables
Add to `.env`:
```
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
POLYGON_RPC_URL=https://polygon-rpc.com
```

### 3. Deploy Smart Contract (Optional)
```bash
# Deploy GameToken.sol to Polygon/Ethereum
# Use Remix IDE or Hardhat
```

## Testing

### Run API Tests
```bash
cd server
node test/blockchain-api-test.js
```

### Expected Test Results
- ✅ Health check endpoint
- ✅ Solana wallet information
- ✅ EVM token balances
- ✅ NFT collection data
- ✅ Game statistics
- ✅ Transaction verification

## Integration Example

### Frontend Integration (React)
```javascript
// Fetch player game stats
const getPlayerStats = async (walletAddress, contractAddress) => {
  const response = await fetch(
    `/api/v1/blockchain/evm/token/${walletAddress}/${contractAddress}`
  );
  const data = await response.json();

  if (data.success) {
    console.log('Token Balance:', data.data.tokenBalance);
    console.log('Reward Points:', data.data.gameData.rewardPoints);
    console.log('Player Level:', data.data.gameData.playerLevel);
  }
};

// Verify transaction after game
const verifyGameTransaction = async (txHash) => {
  const response = await fetch('/api/v1/blockchain/verify-transaction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ txHash, chain: 'polygon' })
  });

  const data = await response.json();
  return data.data.confirmed && data.data.status === 'success';
};
```

## Architecture

```
┌─────────────────┐
│   Frontend      │
│   (React/Web3)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Blockchain API │
│   (Node.js)     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌─────────┐
│ Solana  │ │   EVM   │
│  Chain  │ │  Chains │
└─────────┘ └─────────┘
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "walletAddress": "0x...",
    "tokenBalance": "1000.5",
    "gameData": {
      "rewardPoints": "5000",
      "playerLevel": "5"
    },
    "network": "Polygon"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Security Considerations

1. **Rate Limiting**: Implement rate limiting for API endpoints
2. **Input Validation**: All addresses are validated before processing
3. **RPC Fallbacks**: Consider multiple RPC endpoints for reliability
4. **Error Handling**: Comprehensive error handling for blockchain failures

## Future Enhancements

1. **WebSocket Support**: Real-time transaction monitoring
2. **Multi-signature Wallets**: Support for game treasury
3. **Tournament System**: On-chain tournament management
4. **Leaderboard**: Decentralized leaderboard storage
5. **Cross-chain Bridge**: Token transfers between chains

## Video Demo Script

1. Show the API health endpoint working
2. Demonstrate Solana wallet balance fetching
3. Show EVM token balance and game stats
4. Display NFT collection retrieval
5. Verify a transaction on blockchain
6. Show the smart contract code and explain reward system

## Contact & Support

For questions or improvements to this blockchain integration:
- Review the code in `/server/controllers/blockchainController.js`
- Check smart contract at `/server/contracts/GameToken.sol`
- Run tests with `/server/test/blockchain-api-test.js`

---

**Note**: This implementation provides a complete blockchain integration suitable for a gaming platform, with real interaction capabilities with both Solana and EVM chains. The smart contract includes gaming-specific features like rewards, levels, and points system.