'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { apiClient } from '@/services/api'

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showEmailInput, setShowEmailInput] = useState(true)
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
      setShowEmailInput(false)
    }
  }, [searchParams])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendCooldown])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email')
      return
    }
    setShowEmailInput(false)
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      await apiClient.verify(email, verificationCode)
      setSuccess('Email verified successfully! Redirecting to login...')
      
      setTimeout(() => {
        router.push('/login?verified=true')
      }, 2000)
    } catch (err: any) {
      console.error('[v0] Verify error:', err)
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Verification failed. Please check your code and try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setError('')
    setSuccess('')
    setIsResending(true)

    try {
      await apiClient.resendVerification(email)
      setSuccess('Verification code has been resent to your email')
      setResendCooldown(60)
    } catch (err: any) {
      console.error('[v0] Resend error:', err)
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to resend code. Please try again.'
      )
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription className="text-purple-100">
            Enter the code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {showEmailInput ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <p className="text-sm text-gray-700">
                  Enter the email address you want to verify
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
                  className="border-gray-300"
                />
              </div>

              <Button
                type="submit"
                disabled={!email}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Continue
              </Button>

              <div className="text-center text-sm">
                <Link href="/send-verification" className="text-blue-600 hover:text-blue-700 font-medium">
                  Send verification code
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
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
                  Verification code has been sent to <strong>{email}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium text-gray-700">
                  Verification Code *
                </label>
                <Input
                  id="code"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  maxLength={6}
                  disabled={isLoading}
                  className="border-gray-300 text-center text-lg tracking-widest font-mono"
                />
                <p className="text-xs text-gray-500">6-digit code sent to your email</p>
              </div>

              <Button
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleResendCode}
                disabled={isResending || resendCooldown > 0}
                className="w-full"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Didn't receive code? Resend"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowEmailInput(true)}
                disabled={isLoading}
                className="w-full text-blue-600 hover:text-blue-700"
              >
                Change Email
              </Button>

              <div className="text-center text-sm">
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
