import React from 'react';
import { Activity, Database, AlertCircle } from 'lucide-react';

interface HeaderProps {
  isConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isConnected }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Transaction Analysis System</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Database className={`h-5 w-5 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-sm font-medium ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          {!isConnected && (
            <div className="flex items-center space-x-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Database connection required</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};