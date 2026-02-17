'use client'

import { useState } from 'react'
import Link from 'next/link' 
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
    //   await apiClient.forgotPassword(email)
    //   setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center   text-gray-700  to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-gray-700 rounded-t-lg">
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription className="text-gray-700">
            Enter your email to receive reset instructions
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {success ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
                <p className="font-medium">Check your email</p>
                <p className="text-sm">
                  We've sent password reset instructions to <strong>{email}</strong>
                </p>
              </div>
              <Link href="/login">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="border-gray-300"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <div className="text-center text-sm space-y-2">
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium block">
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
