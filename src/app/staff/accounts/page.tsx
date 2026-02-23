'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/services/api' 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ArrowRight, Wallet } from 'lucide-react'
import { Account } from '@/types/auth'

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setIsLoading(true)
        const page = await apiClient.getAccounts()
        setAccounts(page.content) // ✅ extract from SpringPage
      } catch (err) {
        setError('Failed to load accounts')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    loadAccounts()
  }, [])

  return (
    <div className="space-y-6">
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
            <Card key={account.actNo} className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{account.accountType.name}</CardTitle>
                      <p className="text-sm text-gray-500 mt-0.5">{account.actName}</p>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-800 capitalize">
                    {account.alias}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Account No</p>
                  <p className="text-sm font-mono font-medium text-gray-800">{account.actNo}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Balance</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xs text-gray-500">{account.accountType.description}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}