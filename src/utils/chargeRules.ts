import { ChargeRule, Currency, TransactionType } from '../types';

export const TRANSACTION_TYPES: TransactionType[] = [
  {
    category: 'Deposits',
    subTypes: ['Savings', 'Current', 'Fixed']
  },
  {
    category: 'Withdrawal',
    subTypes: ['ATM', 'Over-the-counter', 'Electronic']
  },
  {
    category: 'Transfers',
    subTypes: ['Interbank', 'Intrabank', 'Online Fund', 'Wire']
  },
  {
    category: 'Payments',
    subTypes: ['Utility Bills', 'Loan Repayments', 'Credit Card', 'Merchant']
  }
];

// Default charge rules for different currencies and transaction types
export const DEFAULT_CHARGE_RULES: Omit<ChargeRule, 'id' | 'created_at'>[] = [
  // Deposits - ZiG
  { transaction_type: 'Deposits', sub_type: 'Savings', currency: 'ZiG', charge_amount: 0, charge_type: 'fixed' },
  { transaction_type: 'Deposits', sub_type: 'Current', currency: 'ZiG', charge_amount: 0, charge_type: 'fixed' },
  { transaction_type: 'Deposits', sub_type: 'Fixed', currency: 'ZiG', charge_amount: 0, charge_type: 'fixed' },
  
  // Withdrawals - ZiG
  { transaction_type: 'Withdrawal', sub_type: 'ATM', currency: 'ZiG', charge_amount: 5, charge_type: 'fixed' },
  { transaction_type: 'Withdrawal', sub_type: 'Over-the-counter', currency: 'ZiG', charge_amount: 10, charge_type: 'fixed' },
  { transaction_type: 'Withdrawal', sub_type: 'Electronic', currency: 'ZiG', charge_amount: 3, charge_type: 'fixed' },
  
  // Transfers - ZiG
  { transaction_type: 'Transfers', sub_type: 'Interbank', currency: 'ZiG', charge_amount: 15, charge_type: 'fixed' },
  { transaction_type: 'Transfers', sub_type: 'Intrabank', currency: 'ZiG', charge_amount: 5, charge_type: 'fixed' },
  { transaction_type: 'Transfers', sub_type: 'Online Fund', currency: 'ZiG', charge_amount: 8, charge_type: 'fixed' },
  { transaction_type: 'Transfers', sub_type: 'Wire', currency: 'ZiG', charge_amount: 25, charge_type: 'fixed' },
  
  // Payments - ZiG
  { transaction_type: 'Payments', sub_type: 'Utility Bills', currency: 'ZiG', charge_amount: 2, charge_type: 'fixed' },
  { transaction_type: 'Payments', sub_type: 'Loan Repayments', currency: 'ZiG', charge_amount: 0, charge_type: 'fixed' },
  { transaction_type: 'Payments', sub_type: 'Credit Card', currency: 'ZiG', charge_amount: 1.5, charge_type: 'percentage' },
  { transaction_type: 'Payments', sub_type: 'Merchant', currency: 'ZiG', charge_amount: 2.5, charge_type: 'percentage' },

  // Deposits - USD
  { transaction_type: 'Deposits', sub_type: 'Savings', currency: 'USD', charge_amount: 0, charge_type: 'fixed' },
  { transaction_type: 'Deposits', sub_type: 'Current', currency: 'USD', charge_amount: 0, charge_type: 'fixed' },
  { transaction_type: 'Deposits', sub_type: 'Fixed', currency: 'USD', charge_amount: 0, charge_type: 'fixed' },
  
  // Withdrawals - USD
  { transaction_type: 'Withdrawal', sub_type: 'ATM', currency: 'USD', charge_amount: 2, charge_type: 'fixed' },
  { transaction_type: 'Withdrawal', sub_type: 'Over-the-counter', currency: 'USD', charge_amount: 5, charge_type: 'fixed' },
  { transaction_type: 'Withdrawal', sub_type: 'Electronic', currency: 'USD', charge_amount: 1, charge_type: 'fixed' },
  
  // Transfers - USD
  { transaction_type: 'Transfers', sub_type: 'Interbank', currency: 'USD', charge_amount: 10, charge_type: 'fixed' },
  { transaction_type: 'Transfers', sub_type: 'Intrabank', currency: 'USD', charge_amount: 3, charge_type: 'fixed' },
  { transaction_type: 'Transfers', sub_type: 'Online Fund', currency: 'USD', charge_amount: 5, charge_type: 'fixed' },
  { transaction_type: 'Transfers', sub_type: 'Wire', currency: 'USD', charge_amount: 20, charge_type: 'fixed' },
  
  // Payments - USD
  { transaction_type: 'Payments', sub_type: 'Utility Bills', currency: 'USD', charge_amount: 1, charge_type: 'fixed' },
  { transaction_type: 'Payments', sub_type: 'Loan Repayments', currency: 'USD', charge_amount: 0, charge_type: 'fixed' },
  { transaction_type: 'Payments', sub_type: 'Credit Card', currency: 'USD', charge_amount: 2, charge_type: 'percentage' },
  { transaction_type: 'Payments', sub_type: 'Merchant', currency: 'USD', charge_amount: 3, charge_type: 'percentage' },

  // EUR - Similar structure with EUR appropriate charges
  { transaction_type: 'Withdrawal', sub_type: 'ATM', currency: 'EUR', charge_amount: 1.5, charge_type: 'fixed' },
  { transaction_type: 'Withdrawal', sub_type: 'Over-the-counter', currency: 'EUR', charge_amount: 4, charge_type: 'fixed' },
  { transaction_type: 'Transfers', sub_type: 'Interbank', currency: 'EUR', charge_amount: 8, charge_type: 'fixed' },
  { transaction_type: 'Transfers', sub_type: 'Wire', currency: 'EUR', charge_amount: 15, charge_type: 'fixed' },

  // ZAR - South African Rand
  { transaction_type: 'Withdrawal', sub_type: 'ATM', currency: 'ZAR', charge_amount: 8, charge_type: 'fixed' },
  { transaction_type: 'Withdrawal', sub_type: 'Over-the-counter', currency: 'ZAR', charge_amount: 15, charge_type: 'fixed' },
  { transaction_type: 'Transfers', sub_type: 'Interbank', currency: 'ZAR', charge_amount: 25, charge_type: 'fixed' },

  // GBP - British Pound
  { transaction_type: 'Withdrawal', sub_type: 'ATM', currency: 'GBP', charge_amount: 1.2, charge_type: 'fixed' },
  { transaction_type: 'Withdrawal', sub_type: 'Over-the-counter', currency: 'GBP', charge_amount: 3.5, charge_type: 'fixed' },
  { transaction_type: 'Transfers', sub_type: 'Wire', currency: 'GBP', charge_amount: 12, charge_type: 'fixed' },

  // ZMW - Zambian Kwacha
  { transaction_type: 'Withdrawal', sub_type: 'ATM', currency: 'ZMW', charge_amount: 15, charge_type: 'fixed' },
  { transaction_type: 'Withdrawal', sub_type: 'Over-the-counter', currency: 'ZMW', charge_amount: 25, charge_type: 'fixed' },
  { transaction_type: 'Transfers', sub_type: 'Interbank', currency: 'ZMW', charge_amount: 40, charge_type: 'fixed' },

  // MWK - Malawian Kwacha
  { transaction_type: 'Withdrawal', sub_type: 'ATM', currency: 'MWK', charge_amount: 500, charge_type: 'fixed' },
  { transaction_type: 'Withdrawal', sub_type: 'Over-the-counter', currency: 'MWK', charge_amount: 800, charge_type: 'fixed' },
  { transaction_type: 'Transfers', sub_type: 'Interbank', currency: 'MWK', charge_amount: 1200, charge_type: 'fixed' }
];

export class ChargeRulesService {
  private chargeRules: ChargeRule[] = [];

  constructor() {
    this.initializeDefaultRules();
  }

  private initializeDefaultRules() {
    this.chargeRules = DEFAULT_CHARGE_RULES.map((rule, index) => ({
      ...rule,
      id: `rule_${index + 1}`,
      created_at: new Date().toISOString()
    }));
  }

  getChargeRules(): ChargeRule[] {
    return this.chargeRules;
  }

  getExpectedCharge(transactionType: string, subType: string, currency: Currency, amount: number): number {
    const rule = this.chargeRules.find(r => 
      r.transaction_type === transactionType && 
      r.sub_type === subType && 
      r.currency === currency
    );

    if (!rule) return 0;

    if (rule.charge_type === 'percentage') {
      let charge = (amount * rule.charge_amount) / 100;
      if (rule.min_amount) charge = Math.max(charge, rule.min_amount);
      if (rule.max_amount) charge = Math.min(charge, rule.max_amount);
      return charge;
    }

    return rule.charge_amount;
  }

  addChargeRule(rule: Omit<ChargeRule, 'id' | 'created_at'>): ChargeRule {
    const newRule: ChargeRule = {
      ...rule,
      id: `rule_${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.chargeRules.push(newRule);
    return newRule;
  }

  updateChargeRule(id: string, updates: Partial<ChargeRule>): boolean {
    const index = this.chargeRules.findIndex(r => r.id === id);
    if (index === -1) return false;
    
    this.chargeRules[index] = { ...this.chargeRules[index], ...updates };
    return true;
  }

  deleteChargeRule(id: string): boolean {
    const index = this.chargeRules.findIndex(r => r.id === id);
    if (index === -1) return false;
    
    this.chargeRules.splice(index, 1);
    return true;
  }
}

export const chargeRulesService = new ChargeRulesService();