import React from 'react';
import { AlertTriangle, DollarSign, Clock, ArrowRight } from 'lucide-react';

interface Discrepancy {
  id: string;
  transactionId: string;
  type: 'overcharge' | 'undercharge' | 'missing' | 'duplicate';
  amount: number;
  description: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
}

const mockDiscrepancies: Discrepancy[] = [
  {
    id: '1',
    transactionId: 'TXN-2024-001245',
    type: 'overcharge',
    amount: 156.75,
    description: 'Premium service charged instead of standard',
    timestamp: '2024-01-15 14:30:22',
    severity: 'high'
  },
  {
    id: '2',
    transactionId: 'TXN-2024-001246',
    type: 'undercharge',
    amount: 42.30,
    description: 'Discount applied incorrectly',
    timestamp: '2024-01-15 14:25:18',
    severity: 'medium'
  },
  {
    id: '3',
    transactionId: 'TXN-2024-001247',
    type: 'missing',
    amount: 89.99,
    description: 'Processing fee not applied',
    timestamp: '2024-01-15 14:20:45',
    severity: 'high'
  },
  {
    id: '4',
    transactionId: 'TXN-2024-001248',
    type: 'duplicate',
    amount: 24.99,
    description: 'Service charge applied twice',
    timestamp: '2024-01-15 14:15:33',
    severity: 'low'
  },
  {
    id: '5',
    transactionId: 'TXN-2024-001249',
    type: 'overcharge',
    amount: 78.50,
    description: 'Tax rate incorrect for region',
    timestamp: '2024-01-15 14:10:12',
    severity: 'medium'
  }
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'overcharge':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'undercharge':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'missing':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'duplicate':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'text-red-600';
    case 'medium':
      return 'text-yellow-600';
    case 'low':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
};

export const RecentDiscrepancies: React.FC = () => {
  return (
    <div className="p-6">
      <div className="space-y-4">
        {mockDiscrepancies.map((discrepancy) => (
          <div
            key={discrepancy.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <AlertTriangle className={`h-5 w-5 ${getSeverityColor(discrepancy.severity)}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {discrepancy.transactionId}
                  </p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(discrepancy.type)}`}>
                    {discrepancy.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {discrepancy.description}
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{discrepancy.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center space-x-1 text-lg font-semibold text-gray-900">
                  <DollarSign className="h-4 w-4" />
                  <span>{discrepancy.amount.toFixed(2)}</span>
                </div>
                <p className={`text-xs font-medium ${getSeverityColor(discrepancy.severity)}`}>
                  {discrepancy.severity.toUpperCase()} PRIORITY
                </p>
              </div>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">
          View All Discrepancies
        </button>
      </div>
    </div>
  );
};