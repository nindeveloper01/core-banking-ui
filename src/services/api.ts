import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import {
  mockCustomers,
  mockAccounts,
  mockTransactions,
  mockLoans,
  mockMetrics,
  getMockAccountsByCustomerId,
  getMockTransactionsByAccountId,
  getMockLoansByCustomerId,
  getMockCustomerById,
  getMockAccountById,
  mockCreateTransaction,
  mockUpdateAccountBalance,
  mockCreateLoan,
  mockApproveLoan,
  mockRejectLoan,
  mockFreezeAccount,
  mockUnfreezeAccount,
} from '@/data/mock-data'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
const USE_MOCK_DATA = true // Set to false to use real API

class ApiClient {
  private client: AxiosInstance
  private refreshTokenPromise: Promise<string> | null = null

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor - add JWT token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor - handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const newToken = await this.refreshAccessToken()
            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return this.client(originalRequest)
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.clearTokens()
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken')
    }
    return null
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken')
    }
    return null
  }

  private setToken(accessToken: string, refreshToken: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    }
  }

  private clearTokens() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise
    }

    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    this.refreshTokenPromise = this.client
      .post('/auth/refresh-token', { refreshToken })
      .then((response) => {
        const { token, refreshToken: newRefreshToken } = response.data.data
        this.setToken(token, newRefreshToken)
        return token
      })
      .finally(() => {
        this.refreshTokenPromise = null
      })

    return this.refreshTokenPromise
  }

  // Auth methods
  async login(email: string, password: string) {
    // Static admin credentials
    const ADMIN_EMAIL = 'admin@bank.com'
    const ADMIN_PASSWORD = 'admin123'

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create a mock admin user and token
      const mockUser = {
        id: 'admin-001',
        email: ADMIN_EMAIL,
        fullName: 'Admin User',
        phone: '+1-800-BANK-ADMIN',
        role: 'ADMIN' as const,
        createdAt: new Date().toISOString(),
      }
      
      const mockToken = 'mock-admin-token-' + Date.now()
      const mockRefreshToken = 'mock-admin-refresh-' + Date.now()
      
      this.setToken(mockToken, mockRefreshToken)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(mockUser))
      }
      
      return {
        token: mockToken,
        refreshToken: mockRefreshToken,
        user: mockUser
      }
    }

    // Fall back to API login for other users
    const response = await this.client.post('/auth/login', { email, password })
    const { token, refreshToken, user } = response.data.data
    this.setToken(token, refreshToken)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user))
    }
    return response.data.data
  }

  async register(data: {
    email: string
    password: string
    fullName: string
    phone?: string
  }) {
    const response = await this.client.post('/auth/register', data)
    return response.data.data
  }

  async forgotPassword(email: string) {
    const response = await this.client.post('/auth/forgot-password', { email })
    return response.data.data
  }

  async resetPassword(token: string, newPassword: string) {
    const response = await this.client.post('/auth/reset-password', {
      token,
      newPassword,
    })
    return response.data.data
  }

  async changePassword(oldPassword: string, newPassword: string) {
    const response = await this.client.post('/auth/change-password', {
      oldPassword,
      newPassword,
    })
    return response.data.data
  }

  async logout() {
    this.clearTokens()
  }

  // Account methods
  async getAccounts() {
    if (USE_MOCK_DATA) {
      return mockAccounts
    }
    const response = await this.client.get('/accounts')
    return response.data.data
  }

  async getAccountById(id: string) {
    if (USE_MOCK_DATA) {
      return getMockAccountById(id)
    }
    const response = await this.client.get(`/accounts/${id}`)
    return response.data.data
  }

  async getAccountTransactions(
    accountId: string,
    page: number = 1,
    pageSize: number = 20
  ) {
    if (USE_MOCK_DATA) {
      const transactions = getMockTransactionsByAccountId(accountId)
      const start = (page - 1) * pageSize
      return transactions.slice(start, start + pageSize)
    }
    const response = await this.client.get(
      `/accounts/${accountId}/transactions`,
      {
        params: { page, pageSize },
      }
    )
    return response.data.data
  }

  async downloadStatement(accountId: string, format: 'pdf' | 'excel') {
    const response = await this.client.get(
      `/accounts/${accountId}/statement`,
      {
        params: { format },
        responseType: 'blob',
      }
    )
    return response.data
  }

  // Transfer methods
  async initiateTransfer(data: {
    fromAccountId: string
    toAccountId: string
    amount: number
    description: string
  }) {
    const response = await this.client.post('/transfers/initiate', data)
    return response.data.data
  }

  async confirmTransfer(transferId: string, password: string) {
    const response = await this.client.post('/transfers/confirm', {
      transferId,
      password,
    })
    return response.data.data
  }

  // Staff methods
  async getStaffDashboard() {
    if (USE_MOCK_DATA) {
      return {
        metrics: mockMetrics,
        recentTransactions: mockTransactions.slice(0, 10),
        pendingLoans: mockLoans.filter((l) => l.status === 'PENDING'),
      }
    }
    const response = await this.client.get('/staff/dashboard')
    return response.data.data
  }

  async getCustomers(page: number = 1, pageSize: number = 20) {
    if (USE_MOCK_DATA) {
      const start = (page - 1) * pageSize
      return {
        data: mockCustomers.slice(start, start + pageSize),
        total: mockCustomers.length,
        page,
        pageSize,
      }
    }
    const response = await this.client.get('/customers', {
      params: { page, pageSize },
    })
    return response.data.data
  }

  async getCustomerById(id: string) {
    if (USE_MOCK_DATA) {
      const customer = getMockCustomerById(id)
      if (customer) {
        return {
          customer,
          accounts: getMockAccountsByCustomerId(id),
          loans: getMockLoansByCustomerId(id),
        }
      }
      throw new Error('Customer not found')
    }
    const response = await this.client.get(`/customers/${id}`)
    return response.data.data
  }

  async approveCustomer(customerId: string) {
    if (USE_MOCK_DATA) {
      const customer = getMockCustomerById(customerId)
      if (customer) {
        return { success: true, customer }
      }
      throw new Error('Customer not found')
    }
    const response = await this.client.post(`/customers/${customerId}/approve`)
    return response.data.data
  }

  async rejectCustomer(customerId: string, reason: string) {
    if (USE_MOCK_DATA) {
      const customer = getMockCustomerById(customerId)
      if (customer) {
        return { success: true, customer, reason }
      }
      throw new Error('Customer not found')
    }
    const response = await this.client.post(`/customers/${customerId}/reject`, {
      reason,
    })
    return response.data.data
  }

  // Mock action methods
  async createTransaction(accountId: string, amount: number, type: 'DEBIT' | 'CREDIT', description: string) {
    if (USE_MOCK_DATA) {
      mockCreateTransaction(accountId, amount, type, description)
      mockUpdateAccountBalance(accountId, type === 'CREDIT' ? amount : -amount)
      return { success: true, message: 'Transaction created successfully' }
    }
    const response = await this.client.post('/transactions', { accountId, amount, type, description })
    return response.data.data
  }

  async createLoan(customerId: string, amount: number, interestRate: number, term: number, type: 'PERSONAL' | 'MORTGAGE' | 'AUTO' | 'BUSINESS') {
    if (USE_MOCK_DATA) {
      const loan = mockCreateLoan(customerId, amount, interestRate, term, type)
      return loan
    }
    const response = await this.client.post('/loans', { customerId, amount, interestRate, term, type })
    return response.data.data
  }

  async approveLoan(loanId: string) {
    if (USE_MOCK_DATA) {
      const result = mockApproveLoan(loanId)
      if (result) {
        return { success: true, loan: result }
      }
      throw new Error('Loan not found')
    }
    const response = await this.client.post(`/loans/${loanId}/approve`)
    return response.data.data
  }

  async rejectLoan(loanId: string) {
    if (USE_MOCK_DATA) {
      const result = mockRejectLoan(loanId)
      if (result) {
        return { success: true, loan: result }
      }
      throw new Error('Loan not found')
    }
    const response = await this.client.post(`/loans/${loanId}/reject`)
    return response.data.data
  }

  async freezeAccount(accountId: string) {
    if (USE_MOCK_DATA) {
      const result = mockFreezeAccount(accountId)
      if (result) {
        return { success: true, account: result }
      }
      throw new Error('Account not found')
    }
    const response = await this.client.post(`/accounts/${accountId}/freeze`)
    return response.data.data
  }

  async unfreezeAccount(accountId: string) {
    if (USE_MOCK_DATA) {
      const result = mockUnfreezeAccount(accountId)
      if (result) {
        return { success: true, account: result }
      }
      throw new Error('Account not found')
    }
    const response = await this.client.post(`/accounts/${accountId}/unfreeze`)
    return response.data.data
  }

  getClient(): AxiosInstance {
    return this.client
  }
}

export const apiClient = new ApiClient()
