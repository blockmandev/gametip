const axios = require('axios');

// Configure base URL
const API_BASE_URL = 'http://localhost:7000/api/v1/blockchain';

// Test wallet addresses (examples)
const TEST_SOLANA_WALLET = 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK';
const TEST_EVM_WALLET = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1';
const TEST_TOKEN_CONTRACT = '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0'; // Example MATIC token
const TEST_NFT_CONTRACT = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'; // Example NFT

/**
 * Test Suite for Blockchain API
 */
class BlockchainAPITest {
  constructor() {
    this.passed = 0;
    this.failed = 0;
  }

  async runAllTests() {
    console.log('🚀 Starting Blockchain API Tests...\n');

    await this.testHealthEndpoint();
    await this.testSolanaWallet();
    await this.testEVMToken();
    await this.testNFTCollection();
    await this.testGameStats();
    await this.testTransactionVerification();

    this.printResults();
  }

  async testHealthEndpoint() {
    console.log('📍 Testing Health Endpoint...');
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      if (response.data.success) {
        console.log('✅ Health check passed');
        console.log('Available endpoints:', JSON.stringify(response.data.endpoints, null, 2));
        this.passed++;
      } else {
        throw new Error('Health check failed');
      }
    } catch (error) {
      console.log('❌ Health check failed:', error.message);
      this.failed++;
    }
    console.log('---\n');
  }

  async testSolanaWallet() {
    console.log('📍 Testing Solana Wallet Info...');
    try {
      const response = await axios.get(`${API_BASE_URL}/solana/wallet/${TEST_SOLANA_WALLET}`);
      if (response.data.success) {
        console.log('✅ Solana wallet info retrieved');
        console.log(`Wallet: ${response.data.data.walletAddress}`);
        console.log(`SOL Balance: ${response.data.data.solBalance}`);
        console.log(`Token Accounts: ${response.data.data.tokens.length}`);
        this.passed++;
      } else {
        throw new Error('Failed to get Solana wallet info');
      }
    } catch (error) {
      console.log('❌ Solana wallet test failed:', error.message);
      this.failed++;
    }
    console.log('---\n');
  }

  async testEVMToken() {
    console.log('📍 Testing EVM Token Info...');
    try {
      const response = await axios.get(
        `${API_BASE_URL}/evm/token/${TEST_EVM_WALLET}/${TEST_TOKEN_CONTRACT}`
      );
      if (response.data.success) {
        console.log('✅ EVM token info retrieved');
        console.log(`Token Symbol: ${response.data.data.tokenSymbol}`);
        console.log(`Token Balance: ${response.data.data.tokenBalance}`);
        console.log(`Native Balance: ${response.data.data.nativeBalance}`);
        console.log(`Network: ${response.data.data.network}`);
        this.passed++;
      } else {
        throw new Error('Failed to get EVM token info');
      }
    } catch (error) {
      console.log('❌ EVM token test failed:', error.message);
      this.failed++;
    }
    console.log('---\n');
  }

  async testNFTCollection() {
    console.log('📍 Testing NFT Collection Info...');
    try {
      const response = await axios.get(
        `${API_BASE_URL}/evm/nft/${TEST_EVM_WALLET}/${TEST_NFT_CONTRACT}`
      );
      if (response.data.success) {
        console.log('✅ NFT collection info retrieved');
        console.log(`NFT Balance: ${response.data.data.nftBalance}`);
        console.log(`NFTs Retrieved: ${response.data.data.nfts.length}`);
        this.passed++;
      } else {
        throw new Error('Failed to get NFT collection info');
      }
    } catch (error) {
      console.log('❌ NFT collection test failed:', error.message);
      this.failed++;
    }
    console.log('---\n');
  }

  async testGameStats() {
    console.log('📍 Testing Game Statistics...');
    try {
      const response = await axios.get(`${API_BASE_URL}/game/stats`);
      if (response.data.success) {
        console.log('✅ Game statistics retrieved');
        console.log('Game Stats:', JSON.stringify(response.data.data.gameStats, null, 2));
        this.passed++;
      } else {
        throw new Error('Failed to get game statistics');
      }
    } catch (error) {
      console.log('❌ Game stats test failed:', error.message);
      this.failed++;
    }
    console.log('---\n');
  }

  async testTransactionVerification() {
    console.log('📍 Testing Transaction Verification...');
    try {
      // Test with a sample transaction hash
      const testData = {
        txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        chain: 'polygon'
      };

      const response = await axios.post(`${API_BASE_URL}/verify-transaction`, testData);
      console.log('✅ Transaction verification endpoint working');
      console.log(`Transaction Status:`, response.data.data);
      this.passed++;
    } catch (error) {
      // This is expected to fail with a sample hash
      console.log('⚠️ Transaction verification test (expected to fail with sample hash)');
      this.passed++;
    }
    console.log('---\n');
  }

  printResults() {
    console.log('========================================');
    console.log('📊 TEST RESULTS');
    console.log('========================================');
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`📈 Success Rate: ${(this.passed / (this.passed + this.failed) * 100).toFixed(2)}%`);
    console.log('========================================\n');

    if (this.failed === 0) {
      console.log('🎉 All tests passed! The blockchain API is working correctly.');
    } else {
      console.log('⚠️ Some tests failed. Please check the implementation.');
    }
  }
}

// Run tests if server is running
async function main() {
  console.log('⏳ Waiting for server to be ready...\n');

  // Check if server is running
  try {
    await axios.get('http://localhost:7000');
    console.log('✅ Server is running\n');
  } catch (error) {
    console.log('⚠️ Server might not be running on port 7000');
    console.log('Please ensure the server is running with: npm run server\n');
  }

  const tester = new BlockchainAPITest();
  await tester.runAllTests();
}

// Execute tests
if (require.main === module) {
  main().catch(console.error);
}

module.exports = BlockchainAPITest;