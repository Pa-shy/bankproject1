import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AnalysisData {
  totalTransactions: number;
  totalDiscrepancies: number;
  revenueAtRisk: number;
  accuracy: number;
}

interface AnalysisContextType {
  analysisData: AnalysisData;
  updateAnalysisData: (data: Partial<AnalysisData>) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

interface AnalysisProviderProps {
  children: ReactNode;
}

export const AnalysisProvider: React.FC<AnalysisProviderProps> = ({ children }) => {
  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    totalTransactions: 245678,
    totalDiscrepancies: 1247,
    revenueAtRisk: 45672,
    accuracy: 94.8
  });

  const updateAnalysisData = (data: Partial<AnalysisData>) => {
    setAnalysisData(prev => ({ ...prev, ...data }));
  };

  return (
    <AnalysisContext.Provider value={{ analysisData, updateAnalysisData }}>
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