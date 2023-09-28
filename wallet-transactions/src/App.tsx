import React, { useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

// types
type Network = string;

interface PostRequestBody {
  parameters: {
    wallet_address: string;
    network: Network;
    skip: number;
    first: number;
  };
}

interface ApiResponse {
  token_address: string;
  token_standard: string;
  from_address: string;
  to_address: string;
  value: string;
  transaction_hash: string;
  log_index: number;
  block_timestamp: number;
  block_number: number;
  block_hash: string;
  operator_address: null | string;
  token_id: null | string;
  is_reorged: boolean;
}

const API_URL = `https://api.dev.dex.guru/wh/transactions_by_wallet?api_key=${process.env.REACT_APP_API_KEY}`;

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
  const [transactions, setTransactions] = useState<ApiResponse[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetBalance = async () => {
    setLoading(true);

    const requestBody: PostRequestBody = {
      parameters: {
        wallet_address: address,
        network,
        skip: 0,
        first: 10,
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
      setTransactions(data);
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
        transactions &&
        transactions.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Token Address</th>
                  <th>Token Standard</th>
                  <th>From Address</th>
                  <th>To Address</th>
                  <th>Value</th>
                  <th>Transaction Hash</th>
                  <th>Log Index</th>
                  <th>Block Timestamp</th>
                  <th>Block Number</th>
                  <th>Block Hash</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.transaction_hash}>
                    <td>{transaction.token_address}</td>
                    <td>{transaction.token_standard}</td>
                    <td>{transaction.from_address}</td>
                    <td>{transaction.to_address}</td>
                    <td>{transaction.value}</td>
                    <td>{transaction.transaction_hash}</td>
                    <td>{transaction.log_index}</td>
                    <td>
                      {new Date(
                        transaction.block_timestamp * 1000
                      ).toLocaleString()}
                    </td>
                    <td>{transaction.block_number}</td>
                    <td>{transaction.block_hash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default App;
