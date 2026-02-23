import axios from 'axios'
import { AccountType,Account, Customer, GetAccountsParams, LoginResponse, RegisterPayload, SpringPage } from '@/types/auth'
 

const BASE_URL = process.env.NEXT_PUBLIC_API_URL // http://localhost:8080/api/v1

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach token to every request automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Decode JWT payload and extract user info
function parseJwt(token: string) {
  try {
    const base64 = token.split('.')[1]
    const decoded = JSON.parse(atob(base64))
    console.log('[api] Decoded JWT payload:', decoded)
    return {
      id: decoded.jti,           // "0122343443"
      phone: decoded.iss,        // "0122343443"
      name: decoded.studentId,   // "ISTAD0022"
      role: decoded.scope,       // "ADMIN"
    }
  } catch (e) {
    console.error('[api] Failed to parse JWT:', e)
    throw new Error('Invalid token received')
  }
}

export const apiClient = {
  login: async (phone: string, password: string): Promise<LoginResponse> => {
    try {
      const { data } = await axiosInstance.post<any>('/auth/login', {
        phoneNumber: phone,
        password,
      })

      console.log('[api] Raw login response:', data)

      const accessToken = data.accessToken
      const refreshToken = data.refreshToken

      if (!accessToken) {
        throw new Error('No accessToken returned from server')
      }

      // Decode user info from JWT
      const user = parseJwt(accessToken)
      console.log('[api] Parsed user:', user)

      // Store both tokens
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      return { token: accessToken, user }
    } catch (err: any) {
      console.error('[api] Login failed:', err.response?.status, err.response?.data)
      throw err
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },

  // ── Register ───────────────────────────────────────────────────────────────

  
  /**
   * Step 1 – Submit registration form.
   * The server creates the account (unverified) and returns a success response.
   */
  register: async (payload: RegisterPayload): Promise<void> => {
    // Log exactly what we're sending so you can compare with what the server expects
    console.log('[api] Register payload:', JSON.stringify(payload, null, 2))

    try {
      const { data } = await axiosInstance.post('/auth/register', payload)
      console.log('[api] Register response:', data)
    } catch (err: any) {
      // Log the full error so we can see every validation message from the server
      console.error('[api] Register failed — status:', err.response?.status)
      console.error('[api] Register failed — full body:', JSON.stringify(err.response?.data, null, 2))
      throw err
    }
  },

  /**
   * Step 2 – Trigger the server to send a verification email.
   * Called right after successful registration.
   */
  sendVerification: async (email: string): Promise<void> => {
    try {
      const { data } = await axiosInstance.post('/auth/send-verification', { email })
      console.log('[api] Send verification response:', data)
    } catch (err: any) {
      console.error('[api] Send verification failed:', err.response?.status, err.response?.data)
      throw err
    }
  },

   verify: async (email: string, code: string): Promise<void> => {
    // ✅ Changed field name from `verificationCode` → `token`
    // Common alternatives if still 400: `otp`, `code`, `verificationCode`
    const payload = { email, verifiedCode: code }
    console.log('[api] Verify payload:', JSON.stringify(payload, null, 2))

    try {
      const { data } = await axiosInstance.post('/auth/verify', payload)
      console.log('[api] Verify response:', data)
    } catch (err: any) {
      console.error('[api] Verify failed — status:', err.response?.status)
      // ✅ Now logs the full body so you can see exactly what field name the server expects
      console.error('[api] Verify failed — full body:', JSON.stringify(err.response?.data, null, 2))
      throw err
    }
  },



  /**
   * Optional – Resend the verification email if the user didn't receive it.
   */
  resendVerification: async (email: string): Promise<void> => {
    try {
      const { data } = await axiosInstance.post('/auth/resend-verification', { email })
      console.log('[api] Resend verification response:', data)
    } catch (err: any) {
      console.error('[api] Resend verification failed:', err.response?.status, err.response?.data)
      throw err
    }
  },

  getCustomers: async (): Promise<Customer[]> => { 
    try {
      const { data } = await axiosInstance.get<Customer[]>('/customers')
      console.log( "[api] getCustomers response:", data)
      return data
    } catch (err: any) {
      console.error('[api] getCustomers failed — status:', err.response?.status)
      console.error('[api] getCustomers failed — full body:', JSON.stringify(err.response?.data, null, 2))
      throw err
    }
  },
  // getAccounts: async (): Promise<Account[]> => {
  //     console.log('[api] getAccounts → /accounts')
  //     try {
  //       const { data } = await axiosInstance.get<Account[]>('/accounts')
  //       console.log('[api] getAccounts — received', data.length, 'accounts')
  //       return data
  //     } catch (err: any) {
  //       console.error('[api] getAccounts failed — status:', err.response?.status)
  //       console.error('[api] getAccounts failed — full body:', JSON.stringify(err.response?.data, null, 2))
  //       throw err // ✅ always rethrow so the caller can handle the error
  //     }
  //   },

  
  getAccounts: async (page = 0, size = 10): Promise<SpringPage<Account>> => {
    const query = new URLSearchParams({ page: String(page), size: String(size) })
    try {
      const { data } = await axiosInstance.get<SpringPage<Account>>(`/accounts?${query}`)
      return data
    } catch (err: any) { 
      throw err
    }
  },
}