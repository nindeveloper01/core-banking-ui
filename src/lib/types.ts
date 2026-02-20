// Auth Types
export interface LoginRequest {
  phone: string
  password: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
  user: User
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
  phone?: string
  dateOfBirth?: string
}

export interface User {
  id: string
  email: string
  fullName: string
  phone?: string
  role: 'CUSTOMER' | 'ADMIN' | 'TELLER' | 'LOAN_OFFICER'
  createdAt: string
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

// Account Types
export interface Account {
  id: string
  customerId: string
  accountNumber: string
  accountType: 'CHECKING' | 'SAVINGS' | 'BUSINESS'
  balance: number
  currency: 'USD' | 'KHR'
  status: 'ACTIVE' | 'FROZEN' | 'CLOSED'
  createdAt: string
}

export interface Transaction {
  id: string
  accountId: string
  amount: number
  type: 'DEBIT' | 'CREDIT'
  category: string
  description: string
  status: 'COMPLETED' | 'PENDING' | 'FAILED'
  timestamp: string
}

export interface TransferRequest {
  fromAccountId: string
  toAccountId: string
  amount: number
  description: string
  password: string
}

export interface TransferResponse {
  transactionId: string
  status: string
  message: string
}

// Loan Types
export interface Loan {
  id: string
  customerId: string
  amount: number
  interestRate: number
  term: number
  status: 'ACTIVE' | 'PENDING' | 'APPROVED' | 'REJECTED'
  monthlyPayment: number
  remainingBalance: number
  type: 'PERSONAL' | 'MORTGAGE' | 'AUTO' | 'BUSINESS'
  createdAt: string
}

// Customer Types
export interface Customer {
  id: string
  email: string
  fullName?: string
  name?: string
  phone?: string
  role: 'CUSTOMER' | 'ADMIN' | 'TELLER' | 'LOAN_OFFICER'
  createdAt: string
}

// Staff Types
export interface StaffMember {
  id: string
  email: string
  fullName: string
  phone: string
  role: 'ADMIN' | 'TELLER' | 'LOAN_OFFICER'
  department: string
  createdAt: string
}

// Bank Metrics
export interface BankMetrics {
  totalCustomers: number
  totalAccounts: number
  totalDeposits: number
  totalLoans: number
  activeLoans: number
  totalTransactions: number
  dailyTransactionVolume: number
  averageLoanAmount: number
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
