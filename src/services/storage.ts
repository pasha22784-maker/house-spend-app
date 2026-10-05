import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense, Settings, Installment, SchoolFee, Policy } from '../types';

const generateId = () => Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);

const KEYS = {
  EXPENSES: 'expenses',
  SETTINGS: 'settings',
  INSTALLMENTS: 'installments',
  SCHOOL_FEES: 'schoolFees',
  POLICIES: 'policies',
};

const DEFAULT_SETTINGS: Settings = {
  milkUnitPrice: 44,
  subscriptionFee: 399,
  totalSalary: 60000,
  persons: ['Ghosia', 'Guddo'],
  googleDriveSyncEnabled: false,
  theme: 'dark',
};

export const StorageService = {
  // Expenses
  getExpenses: async (): Promise<Expense[]> => {
    try {
      const data = await AsyncStorage.getItem(KEYS.EXPENSES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting expenses:', error);
      return [];
    }
  },
  
  saveExpense: async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
    try {
      const expenses = await StorageService.getExpenses();
      const newExpense = { ...expense, id: generateId() };
      await AsyncStorage.setItem(KEYS.EXPENSES, JSON.stringify([...expenses, newExpense]));
      return newExpense;
    } catch (error) {
      console.error('Error saving expense:', error);
      throw error;
    }
  },

  deleteExpense: async (id: string): Promise<void> => {
    try {
      const expenses = await StorageService.getExpenses();
      await AsyncStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses.filter(e => e.id !== id)));
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },

  // Settings
  getSettings: async (): Promise<Settings> => {
    try {
      const data = await AsyncStorage.getItem(KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error getting settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  updateSettings: async (settings: Partial<Settings>): Promise<Settings> => {
    try {
      const current = await StorageService.getSettings();
      const updated = { ...current, ...settings };
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  // Installments
  getInstallments: async (): Promise<Installment[]> => {
    try {
      const data = await AsyncStorage.getItem(KEYS.INSTALLMENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting installments:', error);
      return [];
    }
  },

  saveInstallment: async (installment: Omit<Installment, 'id'>): Promise<Installment> => {
    try {
      const installments = await StorageService.getInstallments();
      const newInstallment = { ...installment, id: generateId() };
      await AsyncStorage.setItem(KEYS.INSTALLMENTS, JSON.stringify([...installments, newInstallment]));
      return newInstallment;
    } catch (error) {
      console.error('Error saving installment:', error);
      throw error;
    }
  },

  // School Fees
  getSchoolFees: async (): Promise<SchoolFee[]> => {
    try {
      const data = await AsyncStorage.getItem(KEYS.SCHOOL_FEES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting school fees:', error);
      return [];
    }
  },

  // Policies
  getPolicies: async (): Promise<Policy[]> => {
    try {
      const data = await AsyncStorage.getItem(KEYS.POLICIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting policies:', error);
      return [];
    }
  }
};
