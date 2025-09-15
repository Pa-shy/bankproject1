import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnalysisData, Currency } from '../types';
import { dataAnalysisService } from '../utils/dataAnalysis';
import { databaseService } from '../utils/database';


interface AnalysisContextType {
  analysisData: AnalysisData;
  updateAnalysisData: (data: Partial<AnalysisData>) => void;
  refreshData: () => void;
  isConnectedToDatabase: boolean;
  setDatabaseConnection: (connected: boolean) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

interface AnalysisProviderProps {
  children: ReactNode;
}

export const AnalysisProvider: React.FC<AnalysisProviderProps> = ({ children }) => {
  const [isConnectedToDatabase, setIsConnectedToDatabase] = useState(false);
  
  // Initialize with empty data
  const getInitialData = (): AnalysisData => ({
    totalTransactions: 0,
    totalDiscrepancies: 0,
    revenueAtRisk: {
      ZiG: 0,
      USD: 0,
      EUR: 0,
      ZAR: 0,
      GBP: 0,
      ZMW: 0,
      MWK: 0
    },
    accuracy: 100,
    transactionsByCurrency: {
      ZiG: 0,
      USD: 0,
      EUR: 0,
      ZAR: 0,
      GBP: 0,
      ZMW: 0,
      MWK: 0
    },
    discrepanciesByCurrency: {
      ZiG: 0,
      USD: 0,
      EUR: 0,
      ZAR: 0,
      GBP: 0,
      ZMW: 0,
      MWK: 0
    }
  });

  const [analysisData, setAnalysisData] = useState<AnalysisData>(getInitialData());

  const updateAnalysisData = (data: Partial<AnalysisData>) => {
    setAnalysisData(prev => ({ ...prev, ...data }));
  };

  const refreshData = async () => {
    try {
      if (isConnectedToDatabase && databaseService.isConnectionActive()) {
        // Get data from database
        const transactions = await databaseService.getTransactions();
        const charges = await databaseService.getCharges();
        const discrepancies = await databaseService.getDiscrepancies();
        
        // Process database data and update analysis
        // This would be implemented based on your database structure
        console.log('Refreshing data from database...');
      } else {
        // Get data from uploaded files
        const uploadedAnalysis = dataAnalysisService.getAnalysisData();
        setAnalysisData(uploadedAnalysis);
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  const setDatabaseConnection = (connected: boolean) => {
    setIsConnectedToDatabase(connected);
    if (!connected) {
      // Reset to uploaded data when database disconnects
      refreshData();
    }
  };
  return (
    <AnalysisContext.Provider value={{ 
      analysisData, 
      updateAnalysisData, 
      refreshData,
      isConnectedToDatabase,
      setDatabaseConnection
    }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};