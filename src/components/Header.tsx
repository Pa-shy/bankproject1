import React from 'react';
import { Activity, Database, AlertCircle, User, LogOut } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  isConnected: boolean;
  currentUser: UserType | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isConnected, currentUser, onLogout }) => {
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

          {currentUser && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <User className="h-4 w-4 text-gray-600" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{currentUser.username}</p>
                  <p className="text-gray-500 text-xs">{currentUser.role}</p>
                </div>
              </div>
              
              <button
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};