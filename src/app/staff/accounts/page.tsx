'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiClient } from '@/services/api'
import { Account } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight } from 'lucide-react'

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setIsLoading(true)
        const data = await apiClient.getAccounts()
        setAccounts(data)
      } catch (err) {
        setError('Failed to load accounts')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadAccounts()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'FROZEN':
        return 'bg-blue-100 text-blue-800'
      case 'CLOSED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Accounts</h1>
        <p className="text-gray-600">View and manage all your accounts</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : accounts.length === 0 ? (
        <Card>
          <CardContent className="pt-8">
            <p className="text-center text-gray-500 py-8">No accounts found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accounts.map((account) => (
            <Link key={account.id} href={`/customer/accounts/${account.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {/* {account.type === 'SAVINGS' ? 'Savings Account' : 'Current Account'} */}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Account No: {account.accountNumber}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
                        account.status
                      )}`}
                    >
                      {account.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Balance</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {account.currency === 'KHR' ? '៛' : '$'}
                      {account.balance.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-gray-600">{account.currency}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
