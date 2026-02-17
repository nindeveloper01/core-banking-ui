'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'
import { 
  Download, 
  TrendingUp, 
  Calendar,
  Filter,
  FileText,
  Users,
  DollarSign,
  Activity
} from 'lucide-react'
import { mockTransactions, mockLoans, mockAccounts, mockCustomers } from '@/data/mock-data'

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month')
  const [reportType, setReportType] = useState<'overview' | 'transactions' | 'loans' | 'customers'>('overview')

  // Calculate transaction data by date
  const transactionsByDate = useMemo(() => {
    const data: { [key: string]: number } = {}
    mockTransactions.forEach((txn) => {
      const date = new Date(txn.timestamp).toLocaleDateString()
      data[date] = (data[date] || 0) + txn.amount
    })
    return Object.entries(data)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [])

  // Calculate transaction by category
  const transactionsByCategory = useMemo(() => {
    const data: { [key: string]: number } = {}
    mockTransactions.forEach((txn) => {
      data[txn.category] = (data[txn.category] || 0) + txn.amount
    })
    return Object.entries(data).map(([name, value]) => ({ name, value }))
  }, [])

  // Calculate loan statistics
  const loanStats = useMemo(() => {
    const stats = {
      active: mockLoans.filter((l) => l.status === 'ACTIVE').length,
      pending: mockLoans.filter((l) => l.status === 'PENDING').length,
      approved: mockLoans.filter((l) => l.status === 'APPROVED').length,
      rejected: mockLoans.filter((l) => l.status === 'REJECTED').length,
    }
    return [
      { name: 'Active', value: stats.active },
      { name: 'Pending', value: stats.pending },
      { name: 'Approved', value: stats.approved },
      { name: 'Rejected', value: stats.rejected },
    ]
  }, [])

  // Account type distribution
  const accountDistribution = useMemo(() => {
    const data: { [key: string]: number } = {}
    mockAccounts.forEach((acc) => {
      data[acc.accountType] = (data[acc.accountType] || 0) + 1
    })
    return Object.entries(data).map(([name, value]) => ({ name, value }))
  }, [])

  // Summary metrics
  const metrics = useMemo(() => {
    const totalTransactionVolume = mockTransactions.reduce((sum, txn) => sum + txn.amount, 0)
    const totalDeposits = mockAccounts.reduce((sum, acc) => sum + acc.balance, 0)
    const activeAccounts = mockAccounts.filter((acc) => acc.status === 'ACTIVE').length
    const totalLoans = mockLoans.reduce((sum, loan) => sum + loan.amount, 0)

    return {
      totalTransactionVolume,
      totalDeposits,
      activeAccounts,
      totalLoans,
      averageTransactionAmount: totalTransactionVolume / mockTransactions.length,
      totalCustomers: mockCustomers.length,
    }
  }, [])

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  const handleExportReport = (format: 'pdf' | 'excel') => {
    // This would be connected to a real export service
    alert(`Exporting ${reportType} report as ${format.toUpperCase()}`)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600">Comprehensive business intelligence and financial reports</p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="inline w-4 h-4 mr-2" />
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="overview">Overview</option>
              <option value="transactions">Transactions</option>
              <option value="loans">Loans</option>
              <option value="customers">Customers</option>
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-2" />
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Download className="inline w-4 h-4 mr-2" />
              Export
            </label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => handleExportReport('pdf')}
              >
                PDF
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleExportReport('excel')}
              >
                Excel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overview Report */}
      {reportType === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-blue-900">Total Deposits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  ${(metrics.totalDeposits / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-blue-700 mt-1">Across all accounts</p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-900">Total Loans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${(metrics.totalLoans / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-green-700 mt-1">Outstanding loans</p>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-orange-900">Total Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {metrics.totalCustomers}
                </div>
                <p className="text-xs text-orange-700 mt-1">Active customers</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-900">Active Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {metrics.activeAccounts}
                </div>
                <p className="text-xs text-purple-700 mt-1">Online accounts</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transaction Volume Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={transactionsByDate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#3b82f6" 
                      name="Daily Volume"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Transaction by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Transactions by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={transactionsByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {transactionsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Account and Loan Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Account Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={accountDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#3b82f6" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Loan Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Loan Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={loanStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {loanStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Transactions Report */}
      {reportType === 'transactions' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                  <p className="text-3xl font-bold text-blue-600">{mockTransactions.length}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Total Volume</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${(metrics.totalTransactionVolume / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-gray-600 mb-1">Average Transaction</p>
                  <p className="text-3xl font-bold text-orange-600">
                    ${metrics.averageTransactionAmount.toFixed(0)}
                  </p>
                </div>
              </div>

              {/* Detailed Transaction List */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Account</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTransactions.slice(0, 20).map((txn) => (
                      <tr key={txn.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{new Date(txn.timestamp).toLocaleDateString()}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">{txn.accountId}</td>
                        <td className="py-3 px-4 text-gray-600">{txn.category}</td>
                        <td className={`py-3 px-4 font-medium ${txn.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                          {txn.type === 'CREDIT' ? '+' : '-'}${txn.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loans Report */}
      {reportType === 'loans' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loan Portfolio Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Active Loans</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {loanStats[0].value}
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {loanStats[1].value}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Approved</p>
                  <p className="text-3xl font-bold text-green-600">
                    {loanStats[2].value}
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-gray-600 mb-1">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">
                    {loanStats[3].value}
                  </p>
                </div>
              </div>

              {/* Loan Details */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Loan ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Interest Rate</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockLoans.map((loan) => (
                      <tr key={loan.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{loan.id}</td>
                        <td className="py-3 px-4 text-gray-600">{loan.customerId}</td>
                        <td className="py-3 px-4 text-gray-600">{loan.type}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">${loan.amount.toLocaleString()}</td>
                        <td className="py-3 px-4 text-gray-600">{loan.interestRate}%</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            loan.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            loan.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            loan.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {loan.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Customers Report */}
      {reportType === 'customers' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Demographics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Total Customers</p>
                  <p className="text-3xl font-bold text-blue-600">{metrics.totalCustomers}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Active Accounts</p>
                  <p className="text-3xl font-bold text-green-600">{metrics.activeAccounts}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-gray-600 mb-1">Total Assets</p>
                  <p className="text-3xl font-bold text-orange-600">
                    ${(metrics.totalDeposits / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>

              {/* Customer List */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Accounts</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Member Since</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCustomers.map((customer) => {
                      const customerAccounts = mockAccounts.filter((acc) => acc.customerId === customer.id)
                      return (
                        <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{customer.id}</td>
                          <td className="py-3 px-4 text-gray-900">{customer.fullName || customer.name}</td>
                          <td className="py-3 px-4 text-gray-600">{customer.email}</td>
                          <td className="py-3 px-4 text-gray-600">{customerAccounts.length}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
