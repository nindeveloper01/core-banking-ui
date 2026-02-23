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