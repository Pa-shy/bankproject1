import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { TransactionUpload } from './components/TransactionUpload';
import { DiscrepancyReports } from './components/DiscrepancyReports';
import { RealTimeMonitor } from './components/RealTimeMonitor';
import { DatabaseConnection } from './components/DatabaseConnection';
import { UserManagement } from './components/UserManagement';
import { ChargeRulesManagement } from './components/ChargeRulesManagement';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AnalysisProvider } from './contexts/AnalysisContext';
import { authService } from './utils/auth';
import { databaseService } from './utils/database';

type View = 'dashboard' | 'upload' | 'reports' | 'monitor' | 'database' | 'users' | 'charge-rules';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on app load
    const checkAuth = async () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      // Auto-connect to database if credentials are available
      if (authenticated) {
        try {
          const connected = await databaseService.connect();
          setIsConnected(connected);
        } catch (error) {
          console.error('Auto-connect failed:', error);
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    databaseService.disconnect();
    setIsAuthenticated(false);
    setIsConnected(false);
    setCurrentView('dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'upload':
        return <TransactionUpload />;
      case 'reports':
        return <DiscrepancyReports />;
      case 'monitor':
        return <RealTimeMonitor />;
      case 'database':
        return <DatabaseConnection onConnectionChange={setIsConnected} />;
      case 'charge-rules':
        return <ChargeRulesManagement />;
      case 'users':
        return authService.isAdmin() ? <UserManagement /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AnalysisProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView}
          isAdmin={authService.isAdmin()}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            isConnected={isConnected} 
            currentUser={authService.getCurrentUser()}
            onLogout={handleLogout}
          />
          <main className="flex-1 overflow-y-auto p-6">
            {renderView()}
          </main>
        </div>
      </div>
    </AnalysisProvider>
  );
}

export default App;