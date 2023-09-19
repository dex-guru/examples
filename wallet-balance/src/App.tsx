import React, { useState } from 'react';

// types.ts
type Network = 'eth' | 'bsc' | 'canto';

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
// App.tsx
const API_URL = `https://api.dev.dex.guru/wh/wallet_balance?api_key=${process.env.REACT_APP_API_KEY}`;

const App: React.FC = () => {
  const [address, setAddress] = useState<string>('');
  const [network, setNetwork] = useState<Network>('eth');
  const [tokens, setTokens] = useState<ApiResponse[] | null>(null);

  const handleGetBalance = async () => {
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
        <option value="eth">eth</option>
        <option value="bsc">bsc</option>
        <option value="canto">canto</option>
      </select>
      <button onClick={handleGetBalance}>get balance</button>

      {tokens && (
        <table>
          <thead>
            <tr>
              <th>Logo</th>
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
      )}
    </div>
  );
};

export default App;
