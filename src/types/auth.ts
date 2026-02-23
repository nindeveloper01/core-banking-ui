// Auth Types
export interface LoginRequest {
  phoneNumber: string
  password: string
}

export interface User {
  id: string        // from JWT: jti
  phone: string     // from JWT: iss
  name: string      // from JWT: studentId
  role: string      // from JWT: scope → "ADMIN" | "CUSTOMER" | "MANAGER"
}

export interface LoginResponse {
  token: string
  user: User
}
export interface RegisterPayload {
  phoneNumber: string
  email: string
  pin: string
  password: string
  confirmedPassword: string
  nationalCardId: string
  name: string
  gender: string
  acceptTerm: boolean
}

export interface Customer {
  id: string
  name: string
  email: string
  phoneNumber: string
  nationalCardId: string
  gender: string
  createdAt: string
}

export interface PaginatedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface GetCustomersParams {
  page?: number   // 0-based page index
  size?: number   // items per page (default 10)
  name?: string   // optional search/filter by name
}

export interface AccountType {
  alias: string
  name: string
  description: string
  isDeleted: boolean
}

export interface Account {
  alias: string
  actName: string
  actNo: string
  balance: number
  accountType: AccountType
}

export interface SpringPage<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number         // current page (0-based)
  size: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
} 

export interface GetAccountsParams {
  page?: number  // 0-based, default 0
  size?: number  // default 10
}
