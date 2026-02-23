'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { apiClient } from '@/services/api'

export default function SendVerificationPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      await apiClient.sendVerification(email)
      setSuccess('Verification code has been sent to your email')
      
      // Redirect to verify page after 2 seconds
      setTimeout(() => {
        router.push(`/verify?email=${encodeURIComponent(email)}`)
      }, 2000)
    } catch (err: any) {
      console.error('[v0] Send verification error:', err)
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to send verification code. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription className="text-orange-100">
            Send verification code to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
                {success}
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
              <p className="text-sm text-gray-700">
                Enter the email address associated with your account. We'll send you a verification code.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || !!success}
                className="border-gray-300"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email || !!success}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </Button>

            <div className="text-center text-sm space-y-2">
              <p>
                Already have the code?{' '}
                <Link href="/verify" className="text-blue-600 hover:text-blue-700 font-medium">
                  Go to verification
                </Link>
              </p>
              <p>
                Need to create an account?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Register here
                </Link>
              </p>
              <p>
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Back to login
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
