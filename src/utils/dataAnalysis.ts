import { Transaction, Charge, Discrepancy, Currency } from '../types';
import { CURRENCIES } from './currency';

export interface UploadedData {
  transactions: Transaction[];
  charges: Charge[];
}

export class DataAnalysisService {
  private uploadedData: UploadedData = {
    transactions: [],
    charges: []
  };

  parseUploadedFile(data: any[], fileType: 'transactions' | 'charges'): any[] {
    if (!Array.isArray(data) || data.length === 0) return [];

    return data.map((row, index) => {
      const id = `${fileType}_${Date.now()}_${index}`;
      const timestamp = new Date().toISOString();

      if (fileType === 'transactions') {
        // Required: transaction_id, amount
        // Optional: customer_id, currency, service_type, region, status
        return {
          id,
          transaction_id: row.transaction_id || row.id || `TXN-${id}`,
          customer_id: row.customer_id || row.customer || '',
          amount: parseFloat(row.amount || row.charge_amount || 0),
          currency: this.detectCurrency(row.currency || 'USD'),
          service_type: row.service_type || row.type || '',
          region: row.region || '',
          timestamp: row.timestamp || row.date || timestamp,
          status: row.status || 'processed'
        };
      } else {
        // Required: transaction_id, charge_amount
        // Optional: charge_id, currency, charge_type, status
        return {
          id,
          charge_id: row.charge_id || row.id || `CHG-${id}`,
          transaction_id: row.transaction_id || row.transaction || '',
          charge_amount: parseFloat(row.charge_amount || row.amount || 0),
          currency: this.detectCurrency(row.currency || 'USD'),
          charge_type: row.charge_type || row.type || '',
          applied_timestamp: row.applied_timestamp || row.timestamp || row.date || timestamp,
          status: row.status || 'applied'
        };
      }
    }).filter(item => {
      // Filter out invalid records
      if (fileType === 'transactions') {
        return item.transaction_id && !isNaN(item.amount) && item.amount > 0;
      } else {
        return item.transaction_id && !isNaN(item.charge_amount) && item.charge_amount > 0;
      }
    });
  }

  private detectCurrency(currencyInput: string): Currency {
    const input = currencyInput.toUpperCase();
    
    // Direct match
    if (input in CURRENCIES) {
      return input as Currency;
    }

    // Symbol match
    for (const [code, info] of Object.entries(CURRENCIES)) {
      if (info.symbol === currencyInput || info.name.toUpperCase().includes(input)) {
        return code as Currency;
      }
    }

    // Default to USD if not recognized
    return 'USD';
  }

  addUploadedData(data: any[], type: 'transactions' | 'charges'): number {
    const parsedData = this.parseUploadedFile(data, type);
    
    if (type === 'transactions') {
      this.uploadedData.transactions.push(...parsedData);
    } else {
      this.uploadedData.charges.push(...parsedData);
    }

    return parsedData.length;
  }

  analyzeDiscrepancies(): Discrepancy[] {
    const discrepancies: Discrepancy[] = [];
    const { transactions, charges } = this.uploadedData;

    if (transactions.length === 0 && charges.length === 0) {
      return [];
    }

    // Group charges by transaction_id
    const chargesByTransaction = charges.reduce((acc, charge) => {
      if (!acc[charge.transaction_id]) {
        acc[charge.transaction_id] = [];
      }
      acc[charge.transaction_id].push(charge);
      return acc;
    }, {} as Record<string, Charge[]>);

    // Analyze each transaction
    transactions.forEach(transaction => {
      const relatedCharges = chargesByTransaction[transaction.transaction_id] || [];
      
      if (relatedCharges.length === 0) {
        // Missing charges
        discrepancies.push({
          id: `missing_${transaction.id}`,
          transaction_id: transaction.transaction_id,
          type: 'missing',
          amount: transaction.amount,
          currency: transaction.currency,
          description: 'No charges found for this transaction',
          timestamp: new Date().toISOString(),
          severity: 'high'
        });
      } else {
        // Check for amount discrepancies
        const totalCharges = relatedCharges
          .filter(charge => charge.currency === transaction.currency)
          .reduce((sum, charge) => sum + charge.charge_amount, 0);

        const difference = Math.abs(transaction.amount - totalCharges);
        const threshold = transaction.amount * 0.01; // 1% threshold

        if (difference > threshold) {
          const type = totalCharges > transaction.amount ? 'overcharge' : 'undercharge';
          discrepancies.push({
            id: `${type}_${transaction.id}`,
            transaction_id: transaction.transaction_id,
            type,
            amount: difference,
            currency: transaction.currency,
            description: `${type === 'overcharge' ? 'Over' : 'Under'}charged by ${difference.toFixed(2)}`,
            timestamp: new Date().toISOString(),
            severity: difference > transaction.amount * 0.1 ? 'high' : 'medium'
          });
        }

        // Check for duplicate charges
        const duplicateCharges = relatedCharges.filter((charge, index, arr) => 
          arr.findIndex(c => c.charge_amount === charge.charge_amount && c.charge_type === charge.charge_type) !== index
        );

        duplicateCharges.forEach(duplicate => {
          discrepancies.push({
            id: `duplicate_${duplicate.id}`,
            transaction_id: transaction.transaction_id,
            type: 'duplicate',
            amount: duplicate.charge_amount,
            currency: duplicate.currency,
            description: `Duplicate charge detected: ${duplicate.charge_type}`,
            timestamp: new Date().toISOString(),
            severity: 'medium'
          });
        });
      }
    });

    return discrepancies;
  }

  getAnalysisData(): any {
    const { transactions, charges } = this.uploadedData;
    const discrepancies = this.analyzeDiscrepancies();

    // Initialize currency counters
    const revenueAtRisk: Record<Currency, number> = {} as Record<Currency, number>;
    const transactionsByCurrency: Record<Currency, number> = {} as Record<Currency, number>;
    const discrepanciesByCurrency: Record<Currency, number> = {} as Record<Currency, number>;

    Object.keys(CURRENCIES).forEach(currency => {
      revenueAtRisk[currency as Currency] = 0;
      transactionsByCurrency[currency as Currency] = 0;
      discrepanciesByCurrency[currency as Currency] = 0;
    });

    // Count transactions by currency
    transactions.forEach(transaction => {
      transactionsByCurrency[transaction.currency]++;
    });

    // Calculate revenue at risk and discrepancies by currency
    discrepancies.forEach(discrepancy => {
      revenueAtRisk[discrepancy.currency] += discrepancy.amount;
      discrepanciesByCurrency[discrepancy.currency]++;
    });

    const totalTransactions = transactions.length;
    const totalDiscrepancies = discrepancies.length;
    const accuracy = totalTransactions > 0 ? ((totalTransactions - totalDiscrepancies) / totalTransactions) * 100 : 100;

    return {
      totalTransactions,
      totalDiscrepancies,
      revenueAtRisk,
      accuracy: Math.max(0, Math.min(100, accuracy)),
      transactionsByCurrency,
      discrepanciesByCurrency,
      discrepancies
    };
  }

  clearData(): void {
    this.uploadedData = {
      transactions: [],
      charges: []
    };
  }

  getUploadedData(): UploadedData {
    return this.uploadedData;
  }
}

export const dataAnalysisService = new DataAnalysisService();