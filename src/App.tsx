import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { TransactionUpload } from './components/TransactionUpload';
import { DiscrepancyReports } from './components/DiscrepancyReports';
import { RealTimeMonitor } from './components/RealTimeMonitor';
import { DatabaseConnection } from './components/DatabaseConnection';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AnalysisProvider } from './contexts/AnalysisContext';

type View = 'dashboard' | 'upload' | 'reports' | 'monitor' | 'database';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isConnected, setIsConnected] = useState(false);

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
      default:
        return <Dashboard />;
    }
  };

  return (
    <AnalysisProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header isConnected={isConnected} />
          <main className="flex-1 overflow-y-auto p-6">
            {renderView()}
          </main>
        </div>
      </div>
    </AnalysisProvider>
  );
}

export default App;