'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { apiClient } from '@/services/api'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff } from 'lucide-react'
import RequiredStar from '@/components/ui/RequiredStarComponent'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser } = useAuth()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    // if (phone.trim().length < 10) {
    //   setError('Please enter a valid phone number (minimum 10 digits)')
    //   return
    // }
    // if (password.length < 6) {
    //   setError('Password must be at least 6 characters')
    //   return
    // }

    setIsLoading(true)

    try {
      console.log('[v0] Login attempt with phone:', phone)
      const data = await apiClient.login(phone, password)
      console.log('[v0] Login successful, user:', data.user)
      setUser(data.user)

      // Redirect based on user role
      const redirectUrl = searchParams.get('redirect')
      console.log('[v0] User role:', data.user.role, 'Redirect URL:', redirectUrl)

      if (data.user.role === 'CUSTOMER') {
        router.push(redirectUrl || '/customer/dashboard')
      } else if (data.user.role === 'ADMIN' || data.user.role === 'MANAGER') {
        router.push(redirectUrl || '/staff/dashboard')
      } else {
        router.push(redirectUrl || '/staff/dashboard')
      }
    } catch (err: any) {
      console.error('[v0] Login error:', err)
      const message =
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl">Banking Platform</CardTitle>
          <CardDescription className="text-blue-100">
            Secure login for customers and staff
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number <RequiredStar />
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="0122343443"  
                value={phone}
                onChange={(e) => {
                  // Only allow digits
                  const val = e.target.value.replace(/[^0-9]/g, '')
                  setPhone(val)
                }}
                required
                disabled={isLoading}
                className="border-gray-300"
                maxLength={11}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password <RequiredStar />
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="border-gray-300 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="text-center text-sm space-y-2">
                <div>
                  <Link
                    href="/forgot-password"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  Don't have an account?{' '}
                  <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                    Register here
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}