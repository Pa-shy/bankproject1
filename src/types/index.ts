export interface Transaction {
  id: string;
  transaction_id: string;
  customer_id?: string;
  amount: number;
  currency: Currency;
  service_type?: string;
  region?: string;
  timestamp: string;
  status?: string;
}

export interface Charge {
  id: string;
  charge_id: string;
  transaction_id: string;
  charge_amount: number;
  currency: Currency;
  charge_type?: string;
  applied_timestamp: string;
  status?: string;
}

export interface Discrepancy {
  id: string;
  transaction_id: string;
  type: 'overcharge' | 'undercharge' | 'missing' | 'duplicate';
  amount: number;
  currency: Currency;
  description: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  last_login?: string;
}

export interface ChargeRule {
  id: string;
  transaction_type: string;
  sub_type: string;
  currency: Currency;
  charge_amount: number;
  charge_type: 'fixed' | 'percentage';
  min_amount?: number;
  max_amount?: number;
  created_at: string;
}

export interface TransactionType {
  category: string;
  subTypes: string[];
}

export type Currency = 'ZiG' | 'USD' | 'EUR' | 'ZAR' | 'GBP' | 'ZMW' | 'MWK';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
}

export interface AnalysisData {
  totalTransactions: number;
  totalDiscrepancies: number;
  revenueAtRisk: Record<Currency, number>;
  accuracy: number;
  transactionsByCurrency: Record<Currency, number>;
  discrepanciesByCurrency: Record<Currency, number>;
}