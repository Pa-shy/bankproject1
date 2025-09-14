import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Pause,
  Play
} from 'lucide-react';

interface Transaction {
  id: string;
  timestamp: string;
  amount: number;
  status: 'processing' | 'verified' | 'discrepancy';
  type: string;
  customerId: string;
}

const generateMockTransaction = (): Transaction => {
  const statuses: ('processing' | 'verified' | 'discrepancy')[] = ['processing', 'verified', 'discrepancy'];
  const types = ['Premium Service', 'Standard Service', 'Processing Fee', 'Tax', 'Discount'];
  
  return {
    id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
    amount: Math.random() * 500 + 10,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    type: types[Math.floor(Math.random() * types.length)],
    customerId: `CUST-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
  };
};

export const RealTimeMonitor: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [stats, setStats] = useState({
    processing: 0,
    verified: 0,
    discrepancies: 0,
    totalVolume: 0
  });

  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      const newTransaction = generateMockTransaction();
      setTransactions(prev => [newTransaction, ...prev.slice(0, 49)]);
      
      setStats(prev => ({
        processing: prev.processing + (newTransaction.status === 'processing' ? 1 : 0),
        verified: prev.verified + (newTransaction.status === 'verified' ? 1 : 0),
        discrepancies: prev.discrepancies + (newTransaction.status === 'discrepancy' ? 1 : 0),
        totalVolume: prev.totalVolume + newTransaction.amount
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'discrepancy':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'discrepancy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isMonitoring ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Activity className={`h-6 w-6 ${isMonitoring ? 'text-green-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Real-time Transaction Monitor</h2>
              <p className="text-gray-600">
                {isMonitoring ? 'Monitoring active transactions' : 'Monitoring paused'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              isMonitoring
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isMonitoring ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isMonitoring ? 'Pause' : 'Start'}</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.processing.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Processing</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.verified.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Verified</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.discrepancies.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Discrepancies</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${stats.totalVolume.toFixed(0)}K</p>
              <p className="text-sm text-gray-500">Total Volume</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Feed */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Live Transaction Feed</h3>
          <p className="text-sm text-gray-500 mt-1">Real-time transaction processing and analysis</p>
        </div>
        
        <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
          {transactions.length === 0 ? (
            <div className="p-8 text-center">
              <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">
                {isMonitoring ? 'Waiting for transactions...' : 'Monitoring is paused'}
              </p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(transaction.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.id}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{transaction.type}</span>
                        <span>{transaction.customerId}</span>
                        <span>{formatTime(transaction.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};