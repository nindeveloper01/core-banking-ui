'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.push('/login')
    } else if (user?.role === 'ADMIN') {
      router.push('staff/dashboard')
    } else {
      router.push('/staff/dashboard')
    }
  }, [isAuthenticated, isLoading, user, router])

  return <div />
}
