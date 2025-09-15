import { Currency, CurrencyInfo } from '../types';

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  ZiG: { code: 'ZiG', symbol: 'ZiG', name: 'Zimbabwe Gold' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  ZMW: { code: 'ZMW', symbol: 'ZK', name: 'Zambian Kwacha' },
  MWK: { code: 'MWK', symbol: 'MK', name: 'Malawian Kwacha' }
};

export const formatCurrency = (amount: number, currency: Currency): string => {
  const currencyInfo = CURRENCIES[currency];
  return `${currencyInfo.symbol}${amount.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

export const getCurrencySymbol = (currency: Currency): string => {
  return CURRENCIES[currency]?.symbol || currency;
};

export const getAllCurrencies = (): CurrencyInfo[] => {
  return Object.values(CURRENCIES);
};