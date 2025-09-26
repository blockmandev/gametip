import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #fff;
  margin-bottom: 30px;
  text-align: center;
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  color: #9564ff;
  margin-bottom: 15px;
  font-size: 1.5rem;
`;

const Button = styled.button`
  background: #9564ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  transition: all 0.3s;

  &:hover {
    background: #7c4ce6;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px;
  border-radius: 5px;
  margin-right: 10px;
  width: 300px;
  margin-bottom: 10px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const DataDisplay = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 15px;
  margin-top: 15px;
  font-family: 'Courier New', monospace;
  color: #fff;
  max-height: 400px;
  overflow-y: auto;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  padding: 10px;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 5px;
  margin-top: 10px;
`;

const SuccessMessage = styled.div`
  color: #51cf66;
  padding: 10px;
  background: rgba(0, 255, 0, 0.1);
  border-radius: 5px;
  margin-top: 10px;
`;

const LoadingSpinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 3px solid #9564ff;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0;

  h3 {
    color: #9564ff;
    margin: 0 0 10px 0;
    font-size: 1.1rem;
  }

  p {
    color: #fff;
    margin: 5px 0;
    font-size: 0.9rem;
  }

  .label {
    color: rgba(255, 255, 255, 0.6);
    margin-right: 10px;
  }

  .value {
    color: #51cf66;
    font-weight: bold;
  }
`;

export function BlockchainTest() {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form inputs
  const [walletAddress, setWalletAddress] = useState('');
  const [contractAddress, setContractAddress] = useState('0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0');
  const [txHash, setTxHash] = useState('');

  const API_BASE = '/api/v1/blockchain';

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const fetchData = async (endpoint: string) => {
    clearMessages();
    setLoading(true);
    try {
      const response = await fetch(endpoint);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setSuccess('Data fetched successfully!');
      } else {
        setError(result.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test functions
  const testHealth = () => fetchData(`${API_BASE}/health`);

  const testGameStats = () => fetchData(`${API_BASE}/game/stats`);

  const testSolanaWallet = () => {
    const address = walletAddress || publicKey?.toBase58() || 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK';
    fetchData(`${API_BASE}/solana/wallet/${address}`);
  };

  const testEVMToken = () => {
    const wallet = walletAddress || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1';
    const contract = contractAddress || '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0';
    fetchData(`${API_BASE}/evm/token/${wallet}/${contract}`);
  };

  const testNFTCollection = () => {
    const wallet = walletAddress || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1';
    const contract = contractAddress || '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D';
    fetchData(`${API_BASE}/evm/nft/${wallet}/${contract}`);
  };

  const verifyTransaction = async () => {
    if (!txHash) {
      setError('Please enter a transaction hash');
      return;
    }

    clearMessages();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/verify-transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash,
          chain: 'polygon' // or 'solana', 'ethereum'
        })
      });

      const result = await response.json();
      if (result.success) {
        setData(result.data);
        setSuccess('Transaction verified!');
      } else {
        setError(result.message || 'Verification failed');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderGameStats = (stats: any) => {
    if (!stats?.gameStats) return null;

    return (
      <div>
        <StatCard>
          <h3>Game Statistics</h3>
          <p><span className="label">Total Players:</span> <span className="value">{stats.gameStats.totalPlayers.toLocaleString()}</span></p>
          <p><span className="label">Total Games Played:</span> <span className="value">{stats.gameStats.totalGamesPlayed.toLocaleString()}</span></p>
          <p><span className="label">Total Rewards Distributed:</span> <span className="value">{parseFloat(stats.gameStats.totalRewardsDistributed).toLocaleString()} GTT</span></p>
          <p><span className="label">Top Score:</span> <span className="value">{stats.gameStats.topScore.toLocaleString()}</span></p>
          <p><span className="label">Daily Active Users:</span> <span className="value">{stats.gameStats.dailyActiveUsers}</span></p>
          <p><span className="label">Weekly Tournaments:</span> <span className="value">{stats.gameStats.weeklyTournaments}</span></p>
        </StatCard>
      </div>
    );
  };

  const renderTokenData = (tokenData: any) => {
    if (!tokenData) return null;

    return (
      <StatCard>
        <h3>Token Information</h3>
        <p><span className="label">Token Symbol:</span> <span className="value">{tokenData.tokenSymbol}</span></p>
        <p><span className="label">Token Balance:</span> <span className="value">{tokenData.tokenBalance} {tokenData.tokenSymbol}</span></p>
        <p><span className="label">Native Balance:</span> <span className="value">{tokenData.nativeBalance} MATIC</span></p>
        <p><span className="label">Player Level:</span> <span className="value">Level {tokenData.gameData?.playerLevel}</span></p>
        <p><span className="label">Reward Points:</span> <span className="value">{tokenData.gameData?.rewardPoints} points</span></p>
        <p><span className="label">Network:</span> <span className="value">{tokenData.network}</span></p>
      </StatCard>
    );
  };

  return (
    <Container>
      <Title>🎮 Blockchain API Test Panel</Title>

      <Section>
        <SectionTitle>Quick Tests</SectionTitle>
        <Button onClick={testHealth}>Test API Health</Button>
        <Button onClick={testGameStats}>Get Game Stats</Button>
        <Button onClick={testSolanaWallet}>Test Solana Wallet</Button>
      </Section>

      <Section>
        <SectionTitle>Wallet & Contract Tests</SectionTitle>
        <div>
          <Input
            placeholder="Wallet Address (optional)"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
          <Input
            placeholder="Contract Address (optional)"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
          />
        </div>
        <Button onClick={testEVMToken}>Test EVM Token</Button>
        <Button onClick={testNFTCollection}>Test NFT Collection</Button>
      </Section>

      <Section>
        <SectionTitle>Transaction Verification</SectionTitle>
        <Input
          placeholder="Transaction Hash"
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
        />
        <Button onClick={verifyTransaction}>Verify Transaction</Button>
      </Section>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      {data && (
        <Section>
          <SectionTitle>Response Data</SectionTitle>
          {data.gameStats ? renderGameStats(data) :
           data.tokenSymbol ? renderTokenData(data) : (
            <DataDisplay>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </DataDisplay>
          )}
        </Section>
      )}

      <Section>
        <SectionTitle>API Information</SectionTitle>
        <p style={{ color: '#fff', fontSize: '0.9rem' }}>
          Backend API is running on port 7000<br/>
          Base URL: http://localhost:7000/api/v1/blockchain<br/>
          {publicKey && `Connected Wallet: ${publicKey.toBase58()}`}
        </p>
      </Section>
    </Container>
  );
}