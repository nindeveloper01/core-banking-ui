'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  CreditCard,
  Lock,
  Unlock,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
} from 'lucide-react'
import { mockAccounts, mockCustomers } from '@/data/mock-data'

interface CardRecord {
  id: string
  cardNumber: string
  cardHolder: string
  accountId: string
  accountNumber: string
  cardType: 'DEBIT' | 'CREDIT'
  status: 'ACTIVE' | 'BLOCKED' | 'EXPIRED'
  expiryDate: string
  issuedDate: string
  dailyLimit: number
  spentToday: number
}

// Generate mock card data from accounts
const generateMockCards = (): CardRecord[] => {
  const cards: CardRecord[] = []
  mockAccounts.slice(0, 8).forEach((account) => {
    const customer = mockCustomers.find(c => c.id === account.customerId)
    if (customer) {
      cards.push({
        id: `card-${account.id}`,
        cardNumber: `****${Math.random().toString().slice(-4).padStart(4, '0')}`,
        cardHolder: customer.fullName,
        accountId: account.id,
        accountNumber: account.accountNumber,
        cardType: account.accountType === 'CHECKING' ? 'DEBIT' : 'CREDIT',
        status: Math.random() > 0.15 ? 'ACTIVE' : Math.random() > 0.5 ? 'BLOCKED' : 'EXPIRED',
        expiryDate: new Date(Date.now() + Math.random() * 31536000000).toISOString().split('T')[0],
        issuedDate: new Date(Date.now() - Math.random() * 31536000000).toISOString().split('T')[0],
        dailyLimit: 5000,
        spentToday: Math.floor(Math.random() * 2000),
      })
    }
  })
  return cards
}

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800 border-green-300',
  BLOCKED: 'bg-red-100 text-red-800 border-red-300',
  EXPIRED: 'bg-gray-100 text-gray-800 border-gray-300',
}

const statusIcons = {
  ACTIVE: CheckCircle,
  BLOCKED: Lock,
  EXPIRED: Clock,
}

export default function CardsPage() {
  const mockCards = useMemo(() => generateMockCards(), [])
  const [cards, setCards] = useState<CardRecord[]>(mockCards)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesSearch =
        card.cardHolder.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.cardNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.accountNumber.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || card.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [cards, searchQuery, filterStatus])

  const stats = useMemo(() => {
    return {
      total: cards.length,
      active: cards.filter(c => c.status === 'ACTIVE').length,
      blocked: cards.filter(c => c.status === 'BLOCKED').length,
      expired: cards.filter(c => c.status === 'EXPIRED').length,
    }
  }, [cards])

  const toggleCardStatus = async (cardId: string) => {
    setIsLoading(true)
    try {
      setCards(
        cards.map((card) =>
          card.id === cardId
            ? { ...card, status: card.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' }
            : card
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Card Management</h1>
        <p className="text-gray-600">Manage and monitor customer debit and credit cards</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Cards</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Blocked</p>
                  <p className="text-2xl font-bold text-red-600">{stats.blocked}</p>
                </div>
                <Lock className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expired</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.expired}</p>
                </div>
                <Clock className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by cardholder, card number, or account..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="BLOCKED">Blocked</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
          </CardContent>
      </Card>

      {/* Cards Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cards ({filteredCards.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Card Holder</th>
                  <th className="text-left py-3 px-4 font-medium">Card Number</th>
                  <th className="text-left py-3 px-4 font-medium">Account</th>
                  <th className="text-left py-3 px-4 font-medium">Type</th>
                  <th className="text-left py-3 px-4 font-medium">Expiry</th>
                  <th className="text-left py-3 px-4 font-medium">Daily Limit</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCards.length > 0 ? (
                  filteredCards.map((card) => {
                    const StatusIcon = statusIcons[card.status]
                    return (
                      <tr key={card.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{card.cardHolder}</td>
                        <td className="py-3 px-4 font-mono text-sm">{card.cardNumber}</td>
                        <td className="py-3 px-4 font-mono text-sm">{card.accountNumber}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              card.cardType === 'DEBIT'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {card.cardType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">{card.expiryDate}</td>
                        <td className="py-3 px-4 text-sm font-medium">
                          ${card.dailyLimit.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium border ${statusColors[card.status]}`}>
                            <StatusIcon className="w-3 h-3" />
                            {card.status}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={card.status === 'ACTIVE' ? 'destructive' : 'default'}
                              onClick={() => toggleCardStatus(card.id)}
                              disabled={isLoading || card.status === 'EXPIRED'}
                            >
                              {card.status === 'ACTIVE' ? (
                                <>
                                  <Lock className="w-3 h-3 mr-1" />
                                  Block
                                </>
                              ) : card.status === 'BLOCKED' ? (
                                <>
                                  <Unlock className="w-3 h-3 mr-1" />
                                  Unblock
                                </>
                              ) : (
                                'Expired'
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No cards found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
