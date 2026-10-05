export interface Expense {
  id: string;
  date: string;
  category: string;
  person: string;
  qty?: number;
  amount: number;
  note?: string;
}

export interface Settings {
  milkUnitPrice: number;
  subscriptionFee: number;
  totalSalary: number;
  persons: string[];
  googleDriveSyncEnabled: boolean;
  spreadsheetId?: string;
  theme: 'dark' | 'light';
}

export interface Installment {
  id: string;
  itemName: string;
  totalInstallments: number;
  currentInstallment: number;
  amount: number;
  person: string;
}

export interface SchoolFee {
  id: string;
  monthTerm: string;
  dueDate: string;
  status: 'Paid' | 'Unpaid';
  amount: number;
  person: string;
}

export interface Policy {
  id: string;
  policyName: string;
  premiumType: string;
  status: 'Active' | 'Inactive';
  amount: number;
  person: string;
}
