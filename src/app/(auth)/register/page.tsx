'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import RequiredStar from '@/components/ui/RequiredStarComponent'
import { apiClient } from '@/services/api'
import { Eye, EyeOff } from 'lucide-react'

// ── Helper: parse the server's error shape into a readable string ─────────────
// Server returns: { error: { code: 400, reason: [{ field, detail }] } }
function parseServerError(err: any): string {
  const reason = err.response?.data?.error?.reason
  if (Array.isArray(reason) && reason.length > 0) {
    return reason.map((r: any) => `${r.field}: ${r.detail}`).join('\n')
  }
  return (
    err.response?.data?.message ||
    err.response?.data?.error?.message ||
    'Something went wrong. Please try again.'
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<'register' | 'verify'>('register')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    nationalCardId: '',
    gender: 'MALE',
    password: '',
    confirmedPassword: '',
    pin: '',
    acceptTerm: false,
  })
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.acceptTerm) {
      setError('You must accept the terms and conditions')
      return
    }

    if (formData.password !== formData.confirmedPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (formData.pin.length !== 4) {
      setError('PIN must be exactly 4 digits')
      return
    }

    // ✅ FIX 1: strip spaces/symbols, validate 9–10 digits to match server rule
    const phoneDigits = formData.phoneNumber.replace(/\D/g, '')
    if (phoneDigits.length < 9 || phoneDigits.length > 10) {
      setError('Phone number must be between 9 and 10 digits (e.g. 012345678)')
      return
    }

    setIsLoading(true)

    try {
      await apiClient.register({
        phoneNumber: phoneDigits, // ✅ FIX 2: send digits only, no spaces or country code
        email: formData.email,
        pin: formData.pin,
        password: formData.password,
        confirmedPassword: formData.confirmedPassword,
        nationalCardId: formData.nationalCardId,
        name: formData.name,
        gender: formData.gender,
        acceptTerm: formData.acceptTerm,
      })

      await apiClient.sendVerification(formData.email)
      setStep('verify')
    } catch (err: any) {
      console.error('[v0] Register error:', err)
      setError(parseServerError(err)) // ✅ FIX 3: reads reason[] array from server
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await apiClient.verify(formData.email, verificationCode)
      router.push('/login?verified=true')
    } catch (err: any) {
      console.error('[v0] Verify error:', err)
      setError(parseServerError(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setError('')
    setIsLoading(true)

    try {
      await apiClient.resendVerification(formData.email)
    } catch (err: any) {
      console.error('[v0] Resend error:', err)
      setError(parseServerError(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl">
            {step === 'register' ? 'Create Account' : 'Verify Email'}
          </CardTitle>
          <CardDescription className="text-blue-100">
            {step === 'register'
              ? 'Join our banking platform'
              : 'Enter the code sent to your email'}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {step === 'register' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* whitespace-pre-line lets \n from multi-field errors render as line breaks */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm whitespace-pre-line">
                  {error}
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name <RequiredStar />
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="border-gray-300"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address <RequiredStar />
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="border-gray-300"
                />
              </div>

              {/* Phone Number ✅ FIXED */}
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                  Phone Number <RequiredStar />
                </label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="012345678"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      // only allow digits while typing, max 10
                      phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10),
                    }))
                  }
                  required
                  disabled={isLoading}
                  className="border-gray-300"
                />
                <p className="text-xs text-gray-500">
                  9–10 digit local number, no country code (e.g. 012345678)
                </p>
              </div>

              {/* National ID */}
              <div className="space-y-2">
                <label htmlFor="nationalCardId" className="text-sm font-medium text-gray-700">
                  National ID Card <RequiredStar />
                </label>
                <Input
                  id="nationalCardId"
                  name="nationalCardId"
                  placeholder="12345678901"
                  value={formData.nationalCardId}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="border-gray-300"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-medium text-gray-700">
                  Gender <RequiredStar />
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, gender: e.target.value }))
                  }
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password <RequiredStar />
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="border-gray-300 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Minimum 8 characters</p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmedPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password <RequiredStar />
                </label>
                <div className="relative">
                  <Input
                    id="confirmedPassword"
                    name="confirmedPassword"
                    type={showConfirmedPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmedPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="border-gray-300 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmedPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {showConfirmedPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.confirmedPassword && formData.password !== formData.confirmedPassword && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
              </div>

              {/* PIN */}
              <div className="space-y-2">
                <label htmlFor="pin" className="text-sm font-medium text-gray-700">
                  PIN (4 digits) <RequiredStar />
                </label>
                <Input
                  id="pin"
                  name="pin"
                  type="password"
                  placeholder="••••"
                  value={formData.pin}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pin: e.target.value.replace(/\D/g, '').slice(0, 4),
                    }))
                  }
                  maxLength={4}
                  required
                  disabled={isLoading}
                  className="border-gray-300"
                />
                <p className="text-xs text-gray-500">4-digit personal identification number</p>
              </div>

              {/* Accept Terms */}
              <div className="flex items-center space-x-2">
                <input
                  id="acceptTerm"
                  name="acceptTerm"
                  type="checkbox"
                  checked={formData.acceptTerm}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, acceptTerm: e.target.checked }))
                  }
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="acceptTerm" className="text-sm text-gray-700">
                  I accept the{' '}
                  <span className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                    terms and conditions
                  </span>{' '}
                  <RequiredStar />
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Login here
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm whitespace-pre-line">
                  {error}
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <p className="text-sm text-gray-700">
                  A verification code has been sent to <strong>{formData.email}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="verificationCode" className="text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <Input
                  id="verificationCode"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  maxLength={6}
                  disabled={isLoading}
                  className="border-gray-300 text-center text-lg tracking-widest"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleResendCode}
                disabled={isLoading}
                className="w-full"
              >
                Didn't receive code? Resend
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep('register')}
                disabled={isLoading}
                className="w-full text-blue-600 hover:text-blue-700"
              >
                Back to Registration
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}