import React, { useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

// types
type Network = string;

interface PostRequestBody {
  parameters: {
    address: string;
    network: Network;
  };
}

interface ApiResponse {
  token_address: string;
  chain_id: number;
  token_standard: string;
  timestamp: number;
  balance: number;
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
  price: number;
}

const API_URL = `https://api.dev.dex.guru/wh/wallet_balance?api_key=${process.env.REACT_APP_API_KEY}`;

const SUPPORTED_NETWORKS: Network[] = [
  'canto',
  'gnosis',
  'fantom',
  'arbitrum',
  'nova',
  'base',
];

const App: React.FC = () => {
  const [address, setAddress] = useState<string>('');
  const [network, setNetwork] = useState<Network>('canto');
  const [tokens, setTokens] = useState<ApiResponse[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetBalance = async () => {
    setLoading(true);

    const requestBody: PostRequestBody = {
      parameters: {
        address,
        network,
      },
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data: ApiResponse[] = await response.json();
      setTokens(data);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <select
        value={network}
        onChange={(e) => setNetwork(e.target.value as Network)}
      >
        {SUPPORTED_NETWORKS.map((net) => (
          <option key={net} value={net}>
            {net}
          </option>
        ))}
      </select>
      <button onClick={handleGetBalance}>
        <FontAwesomeIcon icon={faSearch} size="lg" color="#ffffff" />
      </button>

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        tokens &&
        tokens.length > 0 && (
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Symbol</th>
                <th>Token Price</th>
                <th>Balance in USD</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token) => (
                <tr key={token.token_address}>
                  <td>
                    <img src={token.logo} alt={token.symbol} width="32" />
                  </td>
                  <td>{token.symbol}</td>
                  <td>{token.price.toFixed(4)}</td>
                  <td>{(token.balance * token.price).toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default App;
