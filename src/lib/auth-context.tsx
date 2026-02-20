'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types/auth'

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  isLoading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Restore user from token on page refresh
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        const base64 = token.split('.')[1]
        const decoded = JSON.parse(atob(base64))
        setUser({
          id: decoded.jti,
          phone: decoded.iss,
          name: decoded.studentId,
          role: decoded.scope,
        })
      } catch (e) {
        localStorage.removeItem('accessToken')
      }
    }
    setIsLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      isAuthenticated: !!user,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)