import { Account, Transaction, Loan, Customer, StaffMember, BankMetrics } from '@/lib/types'

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: 'cust-001',
    email: 'john.doe@example.com',
    fullName: 'John Doe',
    phone: '+1-555-0101',
    role: 'CUSTOMER',
    createdAt: '2023-01-15T10:30:00Z',
  },
  {
    id: 'cust-002',
    email: 'jane.smith@example.com',
    fullName: 'Jane Smith',
    phone: '+1-555-0102',
    role: 'CUSTOMER',
    createdAt: '2023-02-20T14:45:00Z',
  },
  {
    id: 'cust-003',
    email: 'bob.johnson@example.com',
    fullName: 'Bob Johnson',
    phone: '+1-555-0103',
    role: 'CUSTOMER',
    createdAt: '2023-03-10T09:15:00Z',
  },
  {
    id: 'cust-004',
    email: 'alice.williams@example.com',
    fullName: 'Alice Williams',
    phone: '+1-555-0104',
    role: 'CUSTOMER',
    createdAt: '2023-04-05T11:20:00Z',
  },
  {
    id: 'cust-005',
    email: 'michael.brown@example.com',
    fullName: 'Michael Brown',
    phone: '+1-555-0105',
    role: 'CUSTOMER',
    createdAt: '2023-05-12T15:30:00Z',
  },
]

// Mock Accounts
export const mockAccounts: Account[] = [
  {
    id: 'acc-001',
    customerId: 'cust-001',
    accountNumber: '1234567890',
    accountType: 'CHECKING',
    balance: 5250.75,
    currency: 'USD',
    status: 'ACTIVE',
    createdAt: '2023-01-15T10:30:00Z',
  },
  {
    id: 'acc-002',
    customerId: 'cust-001',
    accountNumber: '0987654321',
    accountType: 'SAVINGS',
    balance: 25000.00,
    currency: 'USD',
    status: 'ACTIVE',
    createdAt: '2023-01-20T10:30:00Z',
  },
  {
    id: 'acc-003',
    customerId: 'cust-002',
    accountNumber: '5555666677',
    accountType: 'CHECKING',
    balance: 8750.50,
    currency: 'USD',
    status: 'ACTIVE',
    createdAt: '2023-02-20T14:45:00Z',
  },
  {
    id: 'acc-004',
    customerId: 'cust-002',
    accountNumber: '4444333322',
    accountType: 'SAVINGS',
    balance: 45000.00,
    currency: 'USD',
    status: 'ACTIVE',
    createdAt: '2023-02-25T14:45:00Z',
  },
  {
    id: 'acc-005',
    customerId: 'cust-003',
    accountNumber: '1111222233',
    accountType: 'CHECKING',
    balance: 3200.25,
    currency: 'USD',
    status: 'ACTIVE',
    createdAt: '2023-03-10T09:15:00Z',
  },
  {
    id: 'acc-006',
    customerId: 'cust-004',
    accountNumber: '9999888877',
    accountType: 'CHECKING',
    balance: 12500.00,
    currency: 'USD',
    status: 'ACTIVE',
    createdAt: '2023-04-05T11:20:00Z',
  },
  {
    id: 'acc-007',
    customerId: 'cust-005',
    accountNumber: '7777666655',
    accountType: 'BUSINESS',
    balance: 125000.50,
    currency: 'USD',
    status: 'ACTIVE',
    createdAt: '2023-05-12T15:30:00Z',
  },
]

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    accountId: 'acc-001',
    amount: 250.00,
    type: 'DEBIT',
    category: 'GROCERIES',
    description: 'Walmart Purchase',
    status: 'COMPLETED',
    timestamp: '2024-02-13T10:15:00Z',
  },
  {
    id: 'txn-002',
    accountId: 'acc-001',
    amount: 1500.00,
    type: 'CREDIT',
    category: 'SALARY',
    description: 'Monthly Salary Deposit',
    status: 'COMPLETED',
    timestamp: '2024-02-10T09:00:00Z',
  },
  {
    id: 'txn-003',
    accountId: 'acc-001',
    amount: 85.50,
    type: 'DEBIT',
    category: 'UTILITIES',
    description: 'Electric Bill Payment',
    status: 'COMPLETED',
    timestamp: '2024-02-08T14:30:00Z',
  },
  {
    id: 'txn-004',
    accountId: 'acc-003',
    amount: 300.00,
    type: 'DEBIT',
    category: 'ENTERTAINMENT',
    description: 'Movie Tickets',
    status: 'COMPLETED',
    timestamp: '2024-02-12T19:45:00Z',
  },
  {
    id: 'txn-005',
    accountId: 'acc-003',
    amount: 2000.00,
    type: 'CREDIT',
    category: 'SALARY',
    description: 'Monthly Salary Deposit',
    status: 'COMPLETED',
    timestamp: '2024-02-09T08:30:00Z',
  },
  {
    id: 'txn-006',
    accountId: 'acc-001',
    amount: 50.00,
    type: 'DEBIT',
    category: 'DINING',
    description: 'Restaurant Purchase',
    status: 'COMPLETED',
    timestamp: '2024-02-07T19:20:00Z',
  },
  {
    id: 'txn-007',
    accountId: 'acc-006',
    amount: 5000.00,
    type: 'DEBIT',
    category: 'TRANSFER',
    description: 'Transfer to Savings',
    status: 'COMPLETED',
    timestamp: '2024-02-11T11:00:00Z',
  },
  {
    id: 'txn-008',
    accountId: 'acc-007',
    amount: 15000.00,
    type: 'CREDIT',
    category: 'BUSINESS_INCOME',
    description: 'Client Invoice Payment',
    status: 'COMPLETED',
    timestamp: '2024-02-12T13:15:00Z',
  },
]

// Mock Loans
export const mockLoans: Loan[] = [
  {
    id: 'loan-001',
    customerId: 'cust-001',
    amount: 50000.00,
    interestRate: 4.5,
    term: 60,
    status: 'ACTIVE',
    monthlyPayment: 920.00,
    remainingBalance: 35000.00,
    type: 'PERSONAL',
    createdAt: '2022-06-15T10:00:00Z',
  },
  {
    id: 'loan-002',
    customerId: 'cust-002',
    amount: 250000.00,
    interestRate: 3.8,
    term: 360,
    status: 'ACTIVE',
    monthlyPayment: 1190.00,
    remainingBalance: 240000.00,
    type: 'MORTGAGE',
    createdAt: '2020-03-10T14:30:00Z',
  },
  {
    id: 'loan-003',
    customerId: 'cust-003',
    amount: 15000.00,
    interestRate: 7.2,
    term: 36,
    status: 'ACTIVE',
    monthlyPayment: 453.00,
    remainingBalance: 8500.00,
    type: 'AUTO',
    createdAt: '2022-11-20T09:45:00Z',
  },
  {
    id: 'loan-004',
    customerId: 'cust-005',
    amount: 500000.00,
    interestRate: 5.2,
    term: 120,
    status: 'ACTIVE',
    monthlyPayment: 5280.00,
    remainingBalance: 400000.00,
    type: 'BUSINESS',
    createdAt: '2021-08-01T11:00:00Z',
  },
]

// Mock Staff Members
export const mockStaff: StaffMember[] = [
  {
    id: 'staff-001',
    email: 'admin@bank.com',
    fullName: 'Admin User',
    phone: '+1-800-BANK-ADMIN',
    role: 'ADMIN',
    department: 'Management',
    createdAt: '2022-01-01T00:00:00Z',
  },
  {
    id: 'staff-002',
    email: 'teller1@bank.com',
    fullName: 'Sarah Wilson',
    phone: '+1-555-0201',
    role: 'TELLER',
    department: 'Teller Services',
    createdAt: '2022-06-15T10:00:00Z',
  },
  {
    id: 'staff-003',
    email: 'teller2@bank.com',
    fullName: 'David Martinez',
    phone: '+1-555-0202',
    role: 'TELLER',
    department: 'Teller Services',
    createdAt: '2022-08-20T14:30:00Z',
  },
  {
    id: 'staff-004',
    email: 'loan.officer@bank.com',
    fullName: 'Emily Chen',
    phone: '+1-555-0203',
    role: 'LOAN_OFFICER',
    department: 'Lending',
    createdAt: '2021-12-10T09:00:00Z',
  },
  {
    id: 'staff-005',
    email: 'loan.officer2@bank.com',
    fullName: 'James Thompson',
    phone: '+1-555-0204',
    role: 'LOAN_OFFICER',
    department: 'Lending',
    createdAt: '2022-02-28T11:15:00Z',
  },
]

// Mock Bank Metrics
export const mockMetrics: BankMetrics = {
  totalCustomers: mockCustomers.length,
  totalAccounts: mockAccounts.length,
  totalDeposits: mockAccounts.reduce((sum, acc) => sum + acc.balance, 0),
  totalLoans: mockLoans.reduce((sum, loan) => sum + loan.amount, 0),
  activeLoans: mockLoans.filter((loan) => loan.status === 'ACTIVE').length,
  totalTransactions: mockTransactions.length,
  dailyTransactionVolume: mockTransactions
    .filter((txn) => {
      const today = new Date()
      const txnDate = new Date(txn.timestamp)
      return (
        txnDate.getDate() === today.getDate() &&
        txnDate.getMonth() === today.getMonth() &&
        txnDate.getFullYear() === today.getFullYear()
      )
    })
    .reduce((sum, txn) => sum + txn.amount, 0),
  averageLoanAmount: mockLoans.reduce((sum, loan) => sum + loan.amount, 0) / mockLoans.length,
}

// Helper functions for mock data operations
export function getMockAccountsByCustomerId(customerId: string): Account[] {
  return mockAccounts.filter((acc) => acc.customerId === customerId)
}

export function getMockTransactionsByAccountId(accountId: string): Transaction[] {
  return mockTransactions.filter((txn) => txn.accountId === accountId)
}

export function getMockLoansByCustomerId(customerId: string): Loan[] {
  return mockLoans.filter((loan) => loan.customerId === customerId)
}

export function getMockCustomerById(customerId: string): Customer | undefined {
  return mockCustomers.find((cust) => cust.id === customerId)
}

export function getMockAccountById(accountId: string): Account | undefined {
  return mockAccounts.find((acc) => acc.id === accountId)
}

export function getMockLoanById(loanId: string): Loan | undefined {
  return mockLoans.find((loan) => loan.id === loanId)
}

// Mock action handlers
export function mockCreateTransaction(
  accountId: string,
  amount: number,
  type: 'DEBIT' | 'CREDIT',
  description: string
): Transaction {
  const newTxn: Transaction = {
    id: `txn-${Date.now()}`,
    accountId,
    amount,
    type,
    category: 'TRANSFER',
    description,
    status: 'COMPLETED',
    timestamp: new Date().toISOString(),
  }
  mockTransactions.push(newTxn)
  return newTxn
}

export function mockUpdateAccountBalance(accountId: string, amount: number): Account | null {
  const account = mockAccounts.find((acc) => acc.id === accountId)
  if (account) {
    account.balance += amount
    return account
  }
  return null
}

export function mockCreateLoan(
  customerId: string,
  amount: number,
  interestRate: number,
  term: number,
  type: Loan['type']
): Loan {
  const monthlyRate = interestRate / 100 / 12
  const monthlyPayment =
    (amount * (monthlyRate * Math.pow(1 + monthlyRate, term))) /
    (Math.pow(1 + monthlyRate, term) - 1)

  const newLoan: Loan = {
    id: `loan-${Date.now()}`,
    customerId,
    amount,
    interestRate,
    term,
    status: 'ACTIVE',
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    remainingBalance: amount,
    type,
    createdAt: new Date().toISOString(),
  }
  mockLoans.push(newLoan)
  return newLoan
}

export function mockApproveLoan(loanId: string): Loan | null {
  const loan = mockLoans.find((l) => l.id === loanId)
  if (loan) {
    loan.status = 'APPROVED'
    return loan
  }
  return null
}

export function mockRejectLoan(loanId: string): Loan | null {
  const loan = mockLoans.find((l) => l.id === loanId)
  if (loan) {
    loan.status = 'REJECTED'
    return loan
  }
  return null
}

export function mockRegisterCustomer(email: string, fullName: string, phone: string): Customer {
  const newCustomer: Customer = {
    id: `cust-${Date.now()}`,
    email,
    fullName,
    phone,
    role: 'CUSTOMER',
    createdAt: new Date().toISOString(),
  }
  mockCustomers.push(newCustomer)
  return newCustomer
}

export function mockFreezeAccount(accountId: string): Account | null {
  const account = mockAccounts.find((acc) => acc.id === accountId)
  if (account) {
    account.status = 'FROZEN'
    return account
  }
  return null
}

export function mockUnfreezeAccount(accountId: string): Account | null {
  const account = mockAccounts.find((acc) => acc.id === accountId)
  if (account) {
    account.status = 'ACTIVE'
    return account
  }
  return null
}
