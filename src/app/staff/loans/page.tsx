'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/services/api'
import { mockLoans, getMockCustomerById } from '@/data/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, XCircle, DollarSign, Percent, Calendar } from 'lucide-react'

interface LoanWithCustomer {
  id: string
  customerId: string
  amount: number
  interestRate: number
  term: number
  status: 'ACTIVE' | 'PENDING' | 'APPROVED' | 'REJECTED'
  monthlyPayment: number
  remainingBalance: number
  type: string
  createdAt: string
  customerName?: string
}

export default function LoansPage() {
  const [loans, setLoans] = useState<LoanWithCustomer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadLoans()
  }, [])

  const loadLoans = async () => {
    try {
      console.log('[v0] Loading loans...')
      setIsLoading(true)
      // Enrich loans with customer names
      const enrichedLoans = mockLoans.map((loan) => {
        const customer = getMockCustomerById(loan.customerId)
        console.log('[v0] Loan:', loan.id, 'Customer:', customer?.fullName)
        return {
          ...loan,
          customerName: customer?.fullName || 'Unknown Customer',
        }
      })
      console.log('[v0] Loans loaded:', enrichedLoans.length)
      setLoans(enrichedLoans)
    } catch (err) {
      console.error('[v0] Failed to load loans', err)
      setLoans(mockLoans as any)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveLoan = async (loanId: string) => {
    try {
      console.log('[v0] Approving loan:', loanId)
      setActionLoading(loanId)
      const result = await apiClient.approveLoan(loanId)
      console.log('[v0] Loan approved:', result)
      setSuccessMessage(`Loan ${loanId} approved successfully!`)
      setTimeout(() => setSuccessMessage(''), 3000)
      // Update local state
      setLoans(
        loans.map((loan) =>
          loan.id === loanId ? { ...loan, status: 'APPROVED' } : loan
        )
      )
    } catch (err) {
      console.error('[v0] Failed to approve loan', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectLoan = async (loanId: string) => {
    try {
      console.log('[v0] Rejecting loan:', loanId)
      setActionLoading(loanId)
      const result = await apiClient.rejectLoan(loanId)
      console.log('[v0] Loan rejected:', result)
      setSuccessMessage(`Loan ${loanId} rejected successfully!`)
      setTimeout(() => setSuccessMessage(''), 3000)
      // Update local state
      setLoans(
        loans.map((loan) =>
          loan.id === loanId ? { ...loan, status: 'REJECTED' } : loan
        )
      )
    } catch (err) {
      console.error('Failed to reject loan', err)
    } finally {
      setActionLoading(null)
    }
  }

  const filteredLoans = loans.filter((loan) => {
    if (filterStatus === 'all') return true
    return loan.status === filterStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex justify-between items-center">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage('')} className="text-green-600 hover:text-green-800">×</button>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loan Management</h1>
          <p className="text-gray-600">Review and approve loan applications</p>
        </div>
        <div className="flex gap-2">
          {['all', 'PENDING', 'APPROVED', 'REJECTED', 'ACTIVE'].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              onClick={() => setFilterStatus(status)}
              size="sm"
            >
              {status === 'all' ? 'All' : status}
              {status !== 'all' && (
                <span className="ml-2 text-xs">
                  ({loans.filter((l) => l.status === status).length})
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Loan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLoans.length === 0 ? (
          <div className="col-span-2 text-center text-gray-500 py-12">
            No loans found
          </div>
        ) : (
          filteredLoans.map((loan) => (
            <Card key={loan.id} className="hover:shadow-lg transition-shadow border-l-4 border-blue-500">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{loan.customerName}</CardTitle>
                    <p className="text-sm text-gray-500">{loan.type} Loan • ID: {loan.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(loan.status)}`}>
                    {loan.status}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Loan Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <p className="text-xs text-gray-600 font-medium">Loan Amount</p>
                    </div>
                    <p className="text-xl font-bold text-blue-600">
                      ${loan.amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                    </p>
                  </div>

                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Percent className="w-4 h-4 text-orange-600" />
                      <p className="text-xs text-gray-600 font-medium">Interest Rate</p>
                    </div>
                    <p className="text-xl font-bold text-orange-600">{loan.interestRate}%</p>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <p className="text-xs text-gray-600 font-medium">Term</p>
                    </div>
                    <p className="text-xl font-bold text-purple-600">{loan.term} months</p>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium mb-1">Monthly Payment</p>
                    <p className="text-xl font-bold text-green-600">
                      ${loan.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Remaining Balance */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 font-medium mb-1">Remaining Balance</p>
                  <p className="text-lg font-bold text-gray-900">
                    ${loan.remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${((loan.remainingBalance / loan.amount) * 100).toFixed(0)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                {loan.status === 'PENDING' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      disabled={actionLoading === loan.id}
                      onClick={() => handleApproveLoan(loan.id)}
                    >
                      {actionLoading === loan.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </>
                      )}
                    </Button>
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      disabled={actionLoading === loan.id}
                      onClick={() => handleRejectLoan(loan.id)}
                    >
                      {actionLoading === loan.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {loan.status !== 'PENDING' && (
                  <div className="p-3 bg-gray-50 rounded-lg text-center text-sm text-gray-600">
                    Loan already {loan.status.toLowerCase()}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
