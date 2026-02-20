import axios from 'axios'
import { LoginResponse } from '@/types/auth'

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
}