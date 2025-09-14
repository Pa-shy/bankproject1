import React, { useState } from 'react';
import { Database, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface DatabaseConnectionProps {
  onConnectionChange: (connected: boolean) => void;
}

export const DatabaseConnection: React.FC<DatabaseConnectionProps> = ({ onConnectionChange }) => {
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [connectionDetails, setConnectionDetails] = useState({
    host: 'localhost',
    port: '5432',
    database: 'transactions_db',
    username: 'postgres',
    password: ''
  });

  const handleConnect = async () => {
    setConnectionStatus('connecting');
    
    // Simulate connection process
    setTimeout(() => {
      if (connectionDetails.password) {
        setConnectionStatus('connected');
        onConnectionChange(true);
      } else {
        setConnectionStatus('error');
        onConnectionChange(false);
      }
    }, 2000);
  };

  const handleDisconnect = () => {
    setConnectionStatus('disconnected');
    onConnectionChange(false);
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'connecting':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'connecting':
        return <Loader className="h-5 w-5 text-yellow-600 animate-spin" />;
      default:
        return <Database className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Database Connection</h2>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusIcon()}
                <span className={`text-sm font-medium ${getStatusColor()}`}>
                  {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          {connectionStatus === 'connected' ? (
            <button
              onClick={handleDisconnect}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={connectionStatus === 'connecting'}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Host
            </label>
            <input
              type="text"
              value={connectionDetails.host}
              onChange={(e) => setConnectionDetails({ ...connectionDetails, host: e.target.value })}
              disabled={connectionStatus === 'connected'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed outline-none transition-colors duration-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Port
            </label>
            <input
              type="text"
              value={connectionDetails.port}
              onChange={(e) => setConnectionDetails({ ...connectionDetails, port: e.target.value })}
              disabled={connectionStatus === 'connected'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed outline-none transition-colors duration-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Database Name
            </label>
            <input
              type="text"
              value={connectionDetails.database}
              onChange={(e) => setConnectionDetails({ ...connectionDetails, database: e.target.value })}
              disabled={connectionStatus === 'connected'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed outline-none transition-colors duration-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={connectionDetails.username}
              onChange={(e) => setConnectionDetails({ ...connectionDetails, username: e.target.value })}
              disabled={connectionStatus === 'connected'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed outline-none transition-colors duration-200"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={connectionDetails.password}
              onChange={(e) => setConnectionDetails({ ...connectionDetails, password: e.target.value })}
              disabled={connectionStatus === 'connected'}
              placeholder="Enter database password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed outline-none transition-colors duration-200"
            />
          </div>
        </div>

        {connectionStatus === 'error' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm font-medium text-red-800">Connection Failed</p>
            </div>
            <p className="text-sm text-red-600 mt-1">
              Please check your credentials and ensure the database is accessible.
            </p>
          </div>
        )}

        {connectionStatus === 'connected' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-green-800">Successfully Connected</p>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Connected to {connectionDetails.database} on {connectionDetails.host}:{connectionDetails.port}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expected Database Schema</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Transactions Table</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <code className="text-sm text-gray-800 whitespace-pre-line">
{`CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(50) UNIQUE,
  customer_id VARCHAR(50),
  amount DECIMAL(10,2),
  service_type VARCHAR(100),
  region VARCHAR(50),
  timestamp TIMESTAMP,
  status VARCHAR(20)
);`}
              </code>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Charges Table</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <code className="text-sm text-gray-800 whitespace-pre-line">
{`CREATE TABLE charges (
  id SERIAL PRIMARY KEY,
  charge_id VARCHAR(50) UNIQUE,
  transaction_id VARCHAR(50),
  charge_amount DECIMAL(10,2),
  charge_type VARCHAR(100),
  applied_timestamp TIMESTAMP,
  status VARCHAR(20)
);`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};