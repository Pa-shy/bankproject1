import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  AlertTriangle, 
  Calendar,
  DollarSign,
  Eye
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: 'overcharge' | 'undercharge' | 'missing' | 'duplicate';
  generatedAt: string;
  period: string;
  totalAmount: number;
  transactionCount: number;
  status: 'active' | 'resolved';
}

const mockReports: Report[] = [
  {
    id: '1',
    name: 'Q4 2024 Overcharging Analysis',
    type: 'overcharge',
    generatedAt: '2024-01-15 09:30:00',
    period: 'Oct - Dec 2024',
    totalAmount: 45672.89,
    transactionCount: 234,
    status: 'active'
  },
  {
    id: '2',
    name: 'Premium Service Undercharging',
    type: 'undercharge',
    generatedAt: '2024-01-14 16:45:00',
    period: 'Jan 2024',
    totalAmount: 23456.78,
    transactionCount: 156,
    status: 'resolved'
  },
  {
    id: '3',
    name: 'Missing Processing Fees',
    type: 'missing',
    generatedAt: '2024-01-13 11:20:00',
    period: 'Dec 2024',
    totalAmount: 18934.56,
    transactionCount: 89,
    status: 'active'
  },
  {
    id: '4',
    name: 'Duplicate Charge Detection',
    type: 'duplicate',
    generatedAt: '2024-01-12 14:15:00',
    period: 'Nov 2024',
    totalAmount: 12345.67,
    transactionCount: 67,
    status: 'resolved'
  }
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'overcharge':
      return 'bg-red-100 text-red-800';
    case 'undercharge':
      return 'bg-orange-100 text-orange-800';
    case 'missing':
      return 'bg-yellow-100 text-yellow-800';
    case 'duplicate':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-red-100 text-red-800';
    case 'resolved':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const DiscrepancyReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Discrepancy Reports</h2>
            <p className="text-gray-600 mt-1">Detailed analysis and reports of transaction discrepancies</p>
          </div>
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export All</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
          >
            <option value="all">All Types</option>
            <option value="overcharge">Overcharge</option>
            <option value="undercharge">Undercharge</option>
            <option value="missing">Missing</option>
            <option value="duplicate">Duplicate</option>
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                      {report.type}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                  <DollarSign className="h-4 w-4" />
                  <span>Total Amount</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  ${report.totalAmount.toLocaleString()}
                </p>
              </div>
              
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Transactions</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {report.transactionCount.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{report.period}</span>
              </div>
              <div>
                Generated: {report.generatedAt}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200 flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>View Details</span>
              </button>
              
              <button className="text-gray-600 hover:text-gray-700 text-sm font-medium transition-colors duration-200 flex items-center space-x-1">
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredReports.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
          <p className="text-gray-600">
            No discrepancy reports match your current filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};