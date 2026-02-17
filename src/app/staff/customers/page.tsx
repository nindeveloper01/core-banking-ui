'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader2, Search, Plus, Eye, CheckCircle, XCircle, Mail, Phone, User } from 'lucide-react'
import { Customer } from '@/types'
import { mockAccounts } from '@/data/mock-data'
import Link from 'next/link'

interface CustomerWithDetails extends Customer {
  accountCount?: number
  totalBalance?: number
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      console.log('[v0] Loading customers...')
      setIsLoading(true)
      const data = await apiClient.getCustomers()
      console.log('[v0] Raw customer data:', data)
      const customersWithDetails = (data.data || data).map((customer: any) => {
        const accounts = mockAccounts.filter((acc) => acc.customerId === customer.id)
        console.log('[v0] Customer:', customer.id, 'Accounts found:', accounts.length)
        return {
          ...customer,
          accountCount: accounts.length,
          totalBalance: accounts.reduce((sum: number, acc: any) => sum + acc.balance, 0),
        }
      })
      console.log('[v0] Customers loaded:', customersWithDetails.length)
      setCustomers(customersWithDetails)
    } catch (err) {
      console.error('[v0] Error loading customers:', err)
      setError('Failed to load customers')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveCustomer = async (customerId: string) => {
    try {
      console.log('[v0] Approving customer:', customerId)
      setActionLoading(customerId)
      await apiClient.approveCustomer(customerId)
      console.log('[v0] Customer approved successfully')
      setSuccessMessage('Customer approved successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      loadCustomers()
    } catch (err) {
      console.error('[v0] Failed to approve customer', err)
      setError('Failed to approve customer')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectCustomer = async (customerId: string) => {
    try {
      console.log('[v0] Rejecting customer:', customerId)
      setActionLoading(customerId)
      await apiClient.rejectCustomer(customerId, 'Admin decision')
      console.log('[v0] Customer rejected successfully')
      setSuccessMessage('Customer rejected successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      loadCustomers()
    } catch (err) {
      console.error('[v0] Failed to reject customer', err)
      setError('Failed to reject customer')
    } finally {
      setActionLoading(null)
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const fullName = (customer as any).fullName || (customer as any).name || ''
    const matchesSearch = 
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSearch
  })

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage and approve customer accounts</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
            size="sm"
          >
            Grid View
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            onClick={() => setViewMode('table')}
            size="sm"
          >
            Table View
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or customer ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCustomers.length === 0 ? (
            <div className="col-span-2 text-center text-gray-500 py-12">
              No customers found
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{(customer as any).fullName || (customer as any).name}</CardTitle>
                        <p className="text-sm text-gray-500">{customer.id}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline">
                        {customer.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{(customer as any).phone || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Account Summary */}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Accounts</p>
                    <p className="text-2xl font-bold text-blue-600">{(customer as any).accountCount || 0}</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Total Balance: ${((customer as any).totalBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  {/* Member Since */}
                  <p className="text-xs text-gray-500">
                    Member since {new Date((customer as any).createdAt || new Date()).toLocaleDateString()}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      disabled={actionLoading === customer.id}
                      onClick={() => handleApproveCustomer(customer.id)}
                      size="sm"
                    >
                      {actionLoading === customer.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          Processing...
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
                      disabled={actionLoading === customer.id}
                      onClick={() => handleRejectCustomer(customer.id)}
                      size="sm"
                    >
                      {actionLoading === customer.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <Card>
          <CardHeader>
            <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCustomers.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No customers found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Accounts</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Balance</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{customer.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{(customer as any).fullName || (customer as any).name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{customer.email}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">{(customer as any).accountCount || 0}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">${((customer as any).totalBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              disabled={actionLoading === customer.id}
                              onClick={() => handleApproveCustomer(customer.id)}
                            >
                              {actionLoading === customer.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle className="w-3 h-3" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white"
                              disabled={actionLoading === customer.id}
                              onClick={() => handleRejectCustomer(customer.id)}
                            >
                              {actionLoading === customer.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
