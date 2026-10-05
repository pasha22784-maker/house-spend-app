import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Expense, Settings, Installment, SchoolFee, Policy } from '../types';
import { StorageService } from '../services/storage';

interface AppState {
  expenses: Expense[];
  settings: Settings;
  installments: Installment[];
  schoolFees: SchoolFee[];
  policies: Policy[];
  loading: boolean;
}

type Action =
  | { type: 'SET_DATA'; payload: Partial<AppState> }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  expenses: [],
  settings: {
    milkUnitPrice: 44,
    subscriptionFee: 399,
    totalSalary: 60000,
    persons: ['Ghosia', 'Guddo'],
    googleDriveSyncEnabled: false,
    theme: 'dark',
  },
  installments: [],
  schoolFees: [],
  policies: [],
  loading: true,
};

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, ...action.payload, loading: false };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'DELETE_EXPENSE':
      return { ...state, expenses: state.expenses.filter(e => e.id !== action.payload) };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [expenses, settings, installments, schoolFees, policies] = await Promise.all([
        StorageService.getExpenses(),
        StorageService.getSettings(),
        StorageService.getInstallments(),
        StorageService.getSchoolFees(),
        StorageService.getPolicies(),
      ]);
      dispatch({
        type: 'SET_DATA',
        payload: { expenses, settings, installments, schoolFees, policies },
      });
    } catch (error) {
      console.error('Error loading data:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    const expense = await StorageService.saveExpense(expenseData);
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
  };

  const deleteExpense = async (id: string) => {
    await StorageService.deleteExpense(id);
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  const updateSettings = async (settings: Partial<Settings>) => {
    const newSettings = await StorageService.updateSettings(settings);
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, addExpense, deleteExpense, updateSettings }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
