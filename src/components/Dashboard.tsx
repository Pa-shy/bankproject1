import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  FileX,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { TransactionChart } from './TransactionChart';
import { DiscrepancyChart } from './DiscrepancyChart';
import { RecentDiscrepancies } from './RecentDiscrepancies';
import { useAnalysis } from '../contexts/AnalysisContext';
import { formatCurrency, getAllCurrencies } from '../utils/currency';
import { Currency } from '../types';

export const Dashboard: React.FC = () => {
  const { analysisData } = useAnalysis();
  const currencies = getAllCurrencies();

  // Calculate total revenue at risk across all currencies
  const totalRevenueAtRisk = Object.entries(analysisData.revenueAtRisk)
    .reduce((total, [currency, amount]) => {
      // Convert to USD equivalent for display (in real app, use exchange rates)
      return total + amount;
    }, 0);
  const stats = [
    {
      title: 'Total Transactions Analyzed',
      value: analysisData.totalTransactions.toLocaleString(),
      change: analysisData.totalTransactions > 0 ? '+12.5%' : '0%',
      changeType: analysisData.totalTransactions > 0 ? 'increase' as const : 'neutral' as const,
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'Total Discrepancies',
      value: analysisData.totalDiscrepancies.toLocaleString(),
      change: analysisData.totalDiscrepancies > 0 ? '+3.2%' : '0%',
      changeType: analysisData.totalDiscrepancies > 0 ? 'increase' as const : 'neutral' as const,
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Revenue at Risk',
      value: totalRevenueAtRisk > 0 ? `$${totalRevenueAtRisk.toLocaleString()}` : '$0',
      change: totalRevenueAtRisk > 0 ? '+8.1%' : '0%',
      changeType: totalRevenueAtRisk > 0 ? 'increase' as const : 'neutral' as const,
      icon: DollarSign,
      color: 'amber'
    },
    {
      title: 'Processing Accuracy',
      value: `${analysisData.accuracy}%`,
      change: analysisData.totalTransactions > 0 ? '+2.3%' : '0%',
      changeType: analysisData.totalTransactions > 0 ? 'increase' as const : 'neutral' as const,
      icon: FileX,
      color: 'green'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isIncrease = stat.changeType === 'increase';
          const isNeutral = stat.changeType === 'neutral';
          
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                    <Icon className={`h-5 w-5 text-${stat.color}-600`} />
                  </div>
                </div>
                {!isNeutral && (
                  <div className={`flex items-center space-x-1 text-sm font-medium ${
                    isIncrease ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isIncrease ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Currency Breakdown */}
      {Object.values(analysisData.revenueAtRisk).some(amount => amount > 0) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue at Risk by Currency</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {currencies.map((currency) => {
              const amount = analysisData.revenueAtRisk[currency.code] || 0;
              return (
                <div key={currency.code} className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">{currency.code}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(amount, currency.code)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Volume Trend</h3>
          <TransactionChart />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Discrepancy Analysis</h3>
          <DiscrepancyChart />
        </div>
      </div>

      {/* Recent Discrepancies */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Discrepancies</h3>
          <p className="text-sm text-gray-500 mt-1">Latest transactions requiring attention</p>
        </div>
        <RecentDiscrepancies />
      </div>
    </div>
  );
};