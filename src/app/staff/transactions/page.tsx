'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/services/api'
import { mockTransactions, getMockAccountById } from '@/data/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowDown, ArrowUp, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface TransactionWithAccount {
  id: string
  accountId: string
  amount: number
  type: 'DEBIT' | 'CREDIT'
  category: string
  description: string
  status: string
  timestamp: string
  accountNumber?: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionWithAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      console.log('[v0] Loading transactions...')
      setIsLoading(true)
      // Enrich transactions with account numbers
      const enrichedTransactions = mockTransactions.map((txn) => {
        const account = getMockAccountById(txn.accountId)
        console.log('[v0] Transaction:', txn.id, 'Account:', account?.accountNumber)
        return {
          ...txn,
          accountNumber: account?.accountNumber || 'Unknown',
        }
      })
      console.log('[v0] Transactions loaded:', enrichedTransactions.length)
      setTransactions(enrichedTransactions)
    } catch (err) {
      console.error('[v0] Failed to load transactions', err)
      setTransactions(mockTransactions as any)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch = 
      txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //   txn.accountNumber.includes(searchQuery) ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase())

    if (filterType === 'all') return matchesSearch
    return matchesSearch && txn.type === filterType
  })

  const totalCredits = transactions
    .filter((t) => t.type === 'CREDIT')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalDebits = transactions
    .filter((t) => t.type === 'DEBIT')
    .reduce((sum, t) => sum + t.amount, 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Transaction Management</h1>
        <p className="text-gray-600">Monitor all banking transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{transactions.length}</p>
            <p className="text-xs text-gray-500 mt-1">All time transactions</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <ArrowDown className="w-4 h-4" />
              Total Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              ${totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500 mt-1">{transactions.filter((t) => t.type === 'CREDIT').length} deposits</p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
              <ArrowUp className="w-4 h-4" />
              Total Debits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              ${totalDebits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500 mt-1">{transactions.filter((t) => t.type === 'DEBIT').length} withdrawals</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by description, account number, or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'CREDIT', 'DEBIT'].map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? 'default' : 'outline'}
                  onClick={() => setFilterType(type)}
                  size="sm"
                >
                  {type === 'all' ? 'All' : type}
                  <span className="ml-2 text-xs">
                    ({transactions.filter((t) => type === 'all' ? true : t.type === type).length})
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No transactions found</p>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((txn, idx) => (
                <div
                  key={txn.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    txn.type === 'CREDIT'
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  {/* Left Content */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      txn.type === 'CREDIT'
                        ? 'bg-green-100'
                        : 'bg-red-100'
                    }`}>
                      {txn.type === 'CREDIT' ? (
                        <ArrowDown className={`w-5 h-5 ${txn.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`} />
                      ) : (
                        <ArrowDown/>
                        // <ArrowUp className={`w-5 h-5 ${txn.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{txn.description}</p>
                      <div className="flex gap-4 text-xs text-gray-600 mt-1">
                        <span>Account: {txn.accountNumber}</span>
                        <span>Category: {txn.category}</span>
                        <span>{new Date(txn.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className={`text-lg font-bold ${txn.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                      {txn.type === 'CREDIT' ? '+' : '-'}${txn.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{txn.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
