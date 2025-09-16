import React, { useState } from 'react';
import { Settings, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { chargeRulesService, TRANSACTION_TYPES } from '../utils/chargeRules';
import { ChargeRule, Currency } from '../types';
import { getAllCurrencies, formatCurrency } from '../utils/currency';

export const ChargeRulesManagement: React.FC = () => {
  const [chargeRules, setChargeRules] = useState<ChargeRule[]>(chargeRulesService.getChargeRules());
  const [showAddRule, setShowAddRule] = useState(false);
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [newRule, setNewRule] = useState({
    transaction_type: '',
    sub_type: '',
    currency: 'USD' as Currency,
    charge_amount: 0,
    charge_type: 'fixed' as 'fixed' | 'percentage',
    min_amount: undefined as number | undefined,
    max_amount: undefined as number | undefined
  });

  const currencies = getAllCurrencies();

  const handleAddRule = () => {
    if (!newRule.transaction_type || !newRule.sub_type) return;

    const rule = chargeRulesService.addChargeRule(newRule);
    setChargeRules(chargeRulesService.getChargeRules());
    setNewRule({
      transaction_type: '',
      sub_type: '',
      currency: 'USD',
      charge_amount: 0,
      charge_type: 'fixed',
      min_amount: undefined,
      max_amount: undefined
    });
    setShowAddRule(false);
  };

  const handleDeleteRule = (id: string) => {
    chargeRulesService.deleteChargeRule(id);
    setChargeRules(chargeRulesService.getChargeRules());
  };

  const getSubTypes = (transactionType: string) => {
    const type = TRANSACTION_TYPES.find(t => t.category === transactionType);
    return type ? type.subTypes : [];
  };

  const formatChargeDisplay = (rule: ChargeRule) => {
    if (rule.charge_type === 'percentage') {
      return `${rule.charge_amount}%`;
    }
    return formatCurrency(rule.charge_amount, rule.currency);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Charge Rules Management</h2>
              <p className="text-gray-600 mt-1">Configure expected charges for different transaction types</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddRule(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Rule</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Transaction Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Sub Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Currency</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Charge</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {chargeRules.map((rule) => (
                <tr key={rule.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{rule.transaction_type}</td>
                  <td className="py-4 px-4 text-gray-600">{rule.sub_type}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {rule.currency}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-900">
                    {formatChargeDisplay(rule)}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rule.charge_type === 'fixed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {rule.charge_type}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setEditingRule(rule.id)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteRule(rule.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Rule Modal */}
      {showAddRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Charge Rule</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Type
                </label>
                <select
                  value={newRule.transaction_type}
                  onChange={(e) => setNewRule({ ...newRule, transaction_type: e.target.value, sub_type: '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select Type</option>
                  {TRANSACTION_TYPES.map(type => (
                    <option key={type.category} value={type.category}>{type.category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Type
                </label>
                <select
                  value={newRule.sub_type}
                  onChange={(e) => setNewRule({ ...newRule, sub_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  disabled={!newRule.transaction_type}
                >
                  <option value="">Select Sub Type</option>
                  {getSubTypes(newRule.transaction_type).map(subType => (
                    <option key={subType} value={subType}>{subType}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={newRule.currency}
                  onChange={(e) => setNewRule({ ...newRule, currency: e.target.value as Currency })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Charge Type
                </label>
                <select
                  value={newRule.charge_type}
                  onChange={(e) => setNewRule({ ...newRule, charge_type: e.target.value as 'fixed' | 'percentage' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Charge Amount {newRule.charge_type === 'percentage' ? '(%)' : `(${newRule.currency})`}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newRule.charge_amount}
                  onChange={(e) => setNewRule({ ...newRule, charge_amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={() => setShowAddRule(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center space-x-1"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleAddRule}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-1"
              >
                <Save className="h-4 w-4" />
                <span>Save Rule</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};