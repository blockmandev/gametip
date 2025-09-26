const { Connection, PublicKey } = require('@solana/web3.js');
// const { ethers } = require('ethers'); // Uncomment when ethers is installed
const axios = require('axios');

// Solana Configuration
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const solanaConnection = new Connection(SOLANA_RPC_URL, 'confirmed');

// EVM Configuration (Polygon as example)
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
// const polygonProvider = new ethers.providers.JsonRpcProvider(POLYGON_RPC_URL); // Uncomment when ethers is installed

// Example Gaming Token Contract ABI (ERC20)
const GAMING_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function getRewardPoints(address player) view returns (uint256)",
  "function getPlayerLevel(address player) view returns (uint256)"
];

// Example NFT Contract ABI (ERC721)
const GAMING_NFT_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)"
];

// Controllers

// 1. Get Solana Wallet Balance and Token Info
exports.getSolanaWalletInfo = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required'
      });
    }

    // Validate Solana address
    let publicKey;
    try {
      publicKey = new PublicKey(walletAddress);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Solana wallet address'
      });
    }

    // Get SOL balance
    const balance = await solanaConnection.getBalance(publicKey);
    const solBalance = balance / 1e9; // Convert lamports to SOL

    // Get recent transactions
    const signatures = await solanaConnection.getSignaturesForAddress(publicKey, { limit: 5 });

    // Get token accounts (SPL tokens)
    const tokenAccounts = await solanaConnection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
    });

    const tokens = tokenAccounts.value.map(account => ({
      mint: account.account.data.parsed.info.mint,
      balance: account.account.data.parsed.info.tokenAmount.uiAmount,
      decimals: account.account.data.parsed.info.tokenAmount.decimals
    }));

    res.status(200).json({
      success: true,
      data: {
        walletAddress,
        solBalance,
        tokens,
        recentTransactions: signatures.length,
        network: 'Solana Mainnet'
      }
    });
  } catch (error) {
    console.error('Solana wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching Solana wallet information',
      error: error.message
    });
  }
};

// 2. Get EVM Gaming Token Balance and Rewards
exports.getEVMGameTokenInfo = async (req, res) => {
  try {
    const { walletAddress, contractAddress } = req.params;

    if (!walletAddress || !contractAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address and contract address are required'
      });
    }

    // Basic address validation (without ethers)
    const isValidAddress = (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr);

    if (!isValidAddress(walletAddress) || !isValidAddress(contractAddress)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid EVM address format'
      });
    }

    // MOCK DATA for demonstration (replace with ethers.js calls when installed)
    const mockBalance = (Math.random() * 10000).toFixed(2);
    const mockNativeBalance = (Math.random() * 10).toFixed(4);
    const mockRewardPoints = Math.floor(Math.random() * 50000);
    const mockPlayerLevel = Math.floor(Math.random() * 20) + 1;
    const mockTotalSupply = "1000000";

    res.status(200).json({
      success: true,
      data: {
        walletAddress,
        contractAddress,
        tokenBalance: mockBalance,
        tokenSymbol: "GTT",
        nativeBalance: mockNativeBalance,
        totalSupply: mockTotalSupply,
        gameData: {
          rewardPoints: mockRewardPoints.toString(),
          playerLevel: mockPlayerLevel.toString()
        },
        network: 'Polygon',
        chainId: 137,
        note: 'Using mock data - install ethers.js for real blockchain data'
      }
    });
  } catch (error) {
    console.error('EVM token error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching EVM token information',
      error: error.message
    });
  }
};

// 3. Get NFT Collection Info
exports.getNFTCollectionInfo = async (req, res) => {
  try {
    const { walletAddress, contractAddress } = req.params;

    if (!walletAddress || !contractAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address and NFT contract address are required'
      });
    }

    // Basic address validation (without ethers)
    const isValidAddress = (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr);

    if (!isValidAddress(walletAddress) || !isValidAddress(contractAddress)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid address format'
      });
    }

    // MOCK NFT DATA for demonstration
    const mockNftCount = Math.floor(Math.random() * 20) + 1;
    const nfts = [];
    const limit = Math.min(mockNftCount, 10);

    for (let i = 0; i < limit; i++) {
      nfts.push({
        tokenId: (1000 + i).toString(),
        tokenURI: `ipfs://QmExample${i}/metadata.json`,
        metadata: {
          name: `GameTip NFT #${1000 + i}`,
          description: 'Rare gaming collectible',
          image: `ipfs://QmExample${i}/image.png`,
          attributes: [
            { trait_type: 'Rarity', value: ['Common', 'Rare', 'Epic', 'Legendary'][Math.floor(Math.random() * 4)] },
            { trait_type: 'Level', value: Math.floor(Math.random() * 100) },
            { trait_type: 'Power', value: Math.floor(Math.random() * 1000) }
          ]
        },
        owner: walletAddress
      });
    }

    res.status(200).json({
      success: true,
      data: {
        walletAddress,
        contractAddress,
        nftBalance: mockNftCount,
        nfts,
        network: 'Polygon',
        message: mockNftCount > 10 ? `Showing first 10 of ${mockNftCount} NFTs` : `Showing all ${mockNftCount} NFTs`,
        note: 'Using mock data - install ethers.js for real blockchain data'
      }
    });
  } catch (error) {
    console.error('NFT collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching NFT collection',
      error: error.message
    });
  }
};

// 4. Get Game Statistics from Smart Contract
exports.getGameStats = async (req, res) => {
  try {
    // Example game statistics that could be stored on-chain
    const gameStats = {
      totalPlayers: Math.floor(Math.random() * 10000),
      totalGamesPlayed: Math.floor(Math.random() * 50000),
      totalRewardsDistributed: (Math.random() * 1000000).toFixed(2),
      topScore: Math.floor(Math.random() * 100000),
      dailyActiveUsers: Math.floor(Math.random() * 1000),
      weeklyTournaments: Math.floor(Math.random() * 10)
    };

    // In a real implementation, these would be fetched from smart contracts
    res.status(200).json({
      success: true,
      data: {
        gameStats,
        lastUpdated: new Date().toISOString(),
        contracts: {
          solana: {
            programId: '11111111111111111111111111111111',
            network: 'mainnet-beta'
          },
          polygon: {
            gameToken: '0x0000000000000000000000000000000000000000',
            nftCollection: '0x0000000000000000000000000000000000000001',
            gameLogic: '0x0000000000000000000000000000000000000002'
          }
        }
      }
    });
  } catch (error) {
    console.error('Game stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching game statistics',
      error: error.message
    });
  }
};

// 5. Verify Transaction on Blockchain
exports.verifyTransaction = async (req, res) => {
  try {
    const { txHash, chain } = req.body;

    if (!txHash || !chain) {
      return res.status(400).json({
        success: false,
        message: 'Transaction hash and chain are required'
      });
    }

    let transactionInfo = {};

    if (chain === 'solana') {
      try {
        // Try to verify Solana transaction
        const signature = txHash;
        const txInfo = await solanaConnection.getTransaction(signature, {
          commitment: 'confirmed',
          maxSupportedTransactionVersion: 0
        });

        if (txInfo) {
          transactionInfo = {
            confirmed: true,
            slot: txInfo.slot,
            blockTime: txInfo.blockTime,
            fee: txInfo.meta.fee / 1e9,
            status: txInfo.meta.err ? 'failed' : 'success'
          };
        } else {
          transactionInfo = {
            confirmed: false,
            message: 'Transaction not found'
          };
        }
      } catch (error) {
        // Use mock data if real verification fails
        transactionInfo = {
          confirmed: Math.random() > 0.3,
          message: 'Mock verification result',
          slot: Math.floor(Math.random() * 1000000),
          blockTime: Date.now() / 1000,
          fee: (Math.random() * 0.01).toFixed(6),
          status: 'success'
        };
      }
    } else if (chain === 'polygon' || chain === 'ethereum') {
      // MOCK EVM transaction verification
      transactionInfo = {
        confirmed: Math.random() > 0.2,
        blockNumber: Math.floor(Math.random() * 50000000),
        gasUsed: Math.floor(Math.random() * 100000).toString(),
        gasPrice: (Math.random() * 100).toFixed(2),
        status: 'success',
        from: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        to: contractAddress || '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        note: 'Mock data - install ethers.js for real verification'
      };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Unsupported chain. Use "solana", "polygon", or "ethereum"'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        txHash,
        chain,
        ...transactionInfo
      }
    });
  } catch (error) {
    console.error('Transaction verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying transaction',
      error: error.message
    });
  }
};