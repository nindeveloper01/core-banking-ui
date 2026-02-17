'use client'

import { useEffect, useState } from 'react' 
import { apiClient } from '@/services/api'
import { MetricCard } from '@/components/staff/MetricCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Users, DollarSign, Plus, Clock, CheckCircle, XCircle, Lock, Unlock } from 'lucide-react' 

interface DashboardData {
  metrics: any
  recentTransactions: any[]
  pendingLoans: any[]
}

export default function StaffDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  
  console.log('Dashboard page mounted, isLoading:', isLoading, 'dashboardData:', dashboardData)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        console.log('[v0] Starting dashboard data load')
        setIsLoading(true)
        const data = await apiClient.getStaffDashboard()
        console.log('[v0] Dashboard data loaded:', data)
        setDashboardData(data)
        console.log('[v0] Dashboard state updated')
      } catch (err) {
        console.error('[v0] Error loading dashboard:', err)
        setError('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
        console.log('[v0] Dashboard loading complete')
      }
    }

    loadDashboardData()
  }, [])

  const handleApproveLoan = async (loanId: string) => {
    try {
      console.log('[v0] Approving loan:', loanId)
      setActionLoading(loanId)
      await apiClient.approveLoan(loanId)
      console.log('[v0] Loan approved, reloading dashboard')
      setSuccessMessage('Loan approved successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      // Reload dashboard
      const data = await apiClient.getStaffDashboard()
      setDashboardData(data)
      console.log('[v0] Dashboard reloaded after approval')
    } catch (err) {
      console.error('[v0] Error approving loan:', err)
      setError('Failed to approve loan')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectLoan = async (loanId: string) => {
    try {
      setActionLoading(loanId)
      await apiClient.rejectLoan(loanId)
      setSuccessMessage('Loan rejected successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      // Reload dashboard
      const data = await apiClient.getStaffDashboard()
      setDashboardData(data)
    } catch (err) {
      setError('Failed to reject loan')
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleFreezeAccount = async (accountId: string) => {
    try {
      setActionLoading(accountId)
      await apiClient.freezeAccount(accountId)
      setSuccessMessage('Account frozen successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setError('Failed to freeze account')
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleUnfreezeAccount = async (accountId: string) => {
    try {
      setActionLoading(accountId)
      await apiClient.unfreezeAccount(accountId)
      setSuccessMessage('Account unfrozen successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setError('Failed to unfreeze account')
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        {error || 'Failed to load dashboard data'}
      </div>
    )
  }

  const metrics = dashboardData.metrics

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
        <p className="text-gray-600">Overview of banking operations and customer management</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Deposits"
          value={`$${(metrics.totalDeposits / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          color="blue"
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          title="Total Loans"
          value={`$${(metrics.totalLoans / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          color="green"
          trend={{ value: 5, isPositive: true }}
        />
        <MetricCard
          title="Total Customers"
          value={metrics.totalCustomers}
          icon={Users}
          color="orange"
        />
        <MetricCard
          title="Active Loans"
          value={metrics.activeLoans}
          icon={Clock}
          color="red"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          title="Total Accounts"
          value={metrics.totalAccounts}
          icon={Users}
          color="blue"
          trend={{ value: 3, isPositive: true }}
        />
        <MetricCard
          title="Daily Transaction Volume"
          value={`$${(metrics.dailyTransactionVolume / 1000).toFixed(1)}K`}
          icon={DollarSign}
          color="green"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-blue-200 bg-blue-50 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-blue-900">Pending Loan Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {dashboardData.pendingLoans.length}
            </p>
            <p className="text-sm text-blue-700 mt-2">
              Loans awaiting approval
            </p>
            <Button
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                // Navigate to loans page
                window.location.href = '/staff/loans'
              }}
            >
              Review Loans
            </Button>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-green-900">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {metrics.totalCustomers}
            </p>
            <p className="text-sm text-green-700 mt-2">Active customers</p>
            <Button
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                window.location.href = '/staff/customers'
              }}
            >
              Manage Customers
            </Button>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-orange-900">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">
              {dashboardData.recentTransactions.length}
            </p>
            <p className="text-sm text-orange-700 mt-2">Latest transactions</p>
            <Button
              className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => {
                window.location.href = '/staff/transactions'
              }}
            >
              View All
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pending Loans Section */}
      {dashboardData.pendingLoans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Loan Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.pendingLoans.map((loan) => (
                <div key={loan.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border-l-4 border-yellow-500">
                  <div>
                    <p className="font-semibold text-gray-900">Loan ID: {loan.id}</p>
                    <p className="text-sm text-gray-600">Amount: ${loan.amount.toLocaleString()} | Type: {loan.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
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
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Total Customers</span>
              <span className="text-2xl font-bold text-gray-900">
                {metrics.totalCustomers}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Total Accounts</span>
              <span className="text-2xl font-bold text-gray-900">
                {metrics.totalAccounts}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Active Loans</span>
              <span className="text-2xl font-bold text-gray-900">
                {metrics.activeLoans}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
