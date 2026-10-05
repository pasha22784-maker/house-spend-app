import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense, Settings } from '../types';

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';

export interface SyncResult {
  success: boolean;
  message: string;
  timestamp: string;
}

export const GoogleDriveService = {
  getAccessToken: async (): Promise<string | null> => {
    return AsyncStorage.getItem('@access_token');
  },
  
  setAccessToken: async (token: string): Promise<void> => {
    await AsyncStorage.setItem('@access_token', token);
  },
  
  authenticate: async (): Promise<string | null> => {
    // This is a placeholder for the actual authentication logic.
    // In a real application, you would use AuthSession.useAuthRequest in a component.
    return 'mock_token';
  },

  readFromSheet: async (spreadsheetId: string, accessToken: string, month: string): Promise<Expense[]> => {
    try {
      const response = await fetch(`${SHEETS_API}/${spreadsheetId}/values/${month}!A:G`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      if (!data.values) return [];
      
      return data.values.slice(1).map((row: any) => ({
        id: row[0] || Math.random().toString(),
        date: row[1],
        category: row[2],
        person: row[3],
        qty: row[4] ? parseFloat(row[4]) : undefined,
        amount: parseFloat(row[5]),
        note: row[6],
      }));
    } catch (e) {
      console.error('Error reading from sheet:', e);
      return [];
    }
  },

  writeToSheet: async (spreadsheetId: string, accessToken: string, expenses: Expense[], month: string): Promise<boolean> => {
    try {
      const values = [
        ['ID', 'Date', 'Category', 'Person', 'Qty', 'Amount', 'Note'],
        ...expenses.map(e => [e.id, e.date, e.category, e.person, e.qty || '', e.amount, e.note || ''])
      ];
      
      const response = await fetch(`${SHEETS_API}/${spreadsheetId}/values/${month}!A:G?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values })
      });
      return response.ok;
    } catch (e) {
      console.error('Error writing to sheet:', e);
      return false;
    }
  },

  sync: async (expenses: Expense[], settings: Settings): Promise<SyncResult> => {
    try {
      let token = await GoogleDriveService.getAccessToken();
      if (!token) {
        token = await GoogleDriveService.authenticate();
        if (token) await GoogleDriveService.setAccessToken(token);
      }
      
      if (!settings.spreadsheetId) throw new Error('No spreadsheet ID configured');
      if (!token) throw new Error('Not authenticated');

      const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
      // const remote = await GoogleDriveService.readFromSheet(settings.spreadsheetId, token, currentMonth);
      
      const success = await GoogleDriveService.writeToSheet(settings.spreadsheetId, token, expenses, currentMonth);
      if (!success) throw new Error('Failed to write data to Google Sheet');
      
      const timestamp = new Date().toISOString();
      await AsyncStorage.setItem('@last_sync', timestamp);
      return { success: true, message: 'Synced successfully', timestamp };
    } catch (error: any) {
      return { success: false, message: error.message || 'Sync error', timestamp: new Date().toISOString() };
    }
  },

  getLastSyncTime: async (): Promise<string | null> => {
    return AsyncStorage.getItem('@last_sync');
  }
};
