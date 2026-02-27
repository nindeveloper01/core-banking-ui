'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  Users as UserIcon
} from 'lucide-react'
import { apiClient } from '@/services/api' 
import { User } from '@/types/auth'
const roleColors = {
  ADMIN: 'bg-red-100 text-red-800 border-red-300',
  TELLER: 'bg-blue-100 text-blue-800 border-blue-300',
  LOAN_OFFICER: 'bg-green-100 text-green-800 border-green-300',
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterDepartment, setFilterDepartment] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [lockedUsers, setLockedUsers] = useState<Set<string>>(new Set())
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // ── Fetch users from API ───────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        const page = await apiClient.getUsers()
        setUsers(page.content)
      } catch (err) {
        setErrorMessage('Failed to load users')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  // ── Derived data ───────────────────────────────────────────────────────────
  const departments = useMemo(() => {
    return Array.from(new Set(users.map((u) => u.employeeType)))
  }, [users])
  console.log('Departments:', departments)
     
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = filterRole === 'all' || u.role === filterRole
      const matchesDept = filterDepartment === 'all' || u.department === filterDepartment
      return matchesSearch && matchesRole && matchesDept
    })
  }, [users, searchQuery, filterRole, filterDepartment])

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleLockUser = async (userId: string) => {
    try {
      setLockedUsers((prev) => new Set(prev).add(userId))
      showSuccess(`User ${userId} has been locked`)
    } catch {
      setErrorMessage('Failed to lock user')
    }
  }

  const handleUnlockUser = async (userId: string) => {
    try {
      setLockedUsers((prev) => { const s = new Set(prev); s.delete(userId); return s })
      showSuccess(`User ${userId} has been unlocked`)
    } catch {
      setErrorMessage('Failed to unlock user')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      showSuccess('User deleted successfully')
    } catch {
      setErrorMessage('Failed to delete user')
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex justify-between items-center">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage('')}>×</button>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage('')}>×</button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage staff members and their access</p>
        </div>
        <div className="flex gap-2">
          <Button variant={viewMode === 'table' ? 'default' : 'outline'} onClick={() => setViewMode('table')} size="sm">Table</Button>
          <Button variant={viewMode === 'grid' ? 'default' : 'outline'} onClick={() => setViewMode('grid')} size="sm">Grid</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input placeholder="Search by name, email, or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="TELLER">Teller</option>
              <option value="LOAN_OFFICER">Loan Officer</option>
            </select>
            <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Departments</option>
              {departments.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
              
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : viewMode === 'table' ? (
        // ── Table View ───────────────────────────────────────────────────────
        <Card>
          <CardHeader>
            <CardTitle>Staff Members ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No users found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {['Name', 'Email', 'Role', 'Department', 'Status', 'Joined', 'Actions'].map((h) => (
                        <th key={h} className="text-left py-3 px-4 font-semibold text-gray-700">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{user.name}</td>
                        <td className="py-3 px-4 text-gray-600">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${roleColors[user.role]}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{user.employeeType}</td>
                        <td className="py-3 px-4">
                          {lockedUsers.has(user.id) ? (
                            <div className="flex items-center gap-1 text-red-600">
                              <AlertCircle className="w-4 h-4" /><span className="text-xs font-medium">Locked</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" /><span className="text-xs font-medium">Active</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit2 className="w-4 h-4 text-blue-600" />
                            </Button>
                            {lockedUsers.has(user.id) ? (
                              <Button size="sm" variant="ghost" onClick={() => handleUnlockUser(user.id)}>
                                <Unlock className="w-4 h-4 text-green-600" />
                              </Button>
                            ) : (
                              <Button size="sm" variant="ghost" onClick={() => handleLockUser(user.id)}>
                                <Lock className="w-4 h-4 text-yellow-600" />
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteUser(user.id)}>
                              <Trash2 className="w-4 h-4 text-red-600" />
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
      ) : (
        // ── Grid View ────────────────────────────────────────────────────────
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">No users found</div>
          ) : filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">👤</div>
                    <div>
                      <CardTitle className="text-base">{user.name}</CardTitle>
                      <p className="text-xs text-gray-500">{user.id}</p>
                    </div>
                  </div>
                  {lockedUsers.has(user.id)
                    ? <Lock className="w-5 h-5 text-red-600" />
                    : <CheckCircle className="w-5 h-5 text-green-600" />}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${roleColors[user.role]}`}>
                  {user.role }
                </span>
                <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">{user.email}</a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{user.department}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 p-2 bg-gray-50 rounded">
                  <Calendar className="w-3 h-3" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit2 className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  {lockedUsers.has(user.id) ? (
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => handleUnlockUser(user.id)}>
                      <Unlock className="w-3 h-3 mr-1" /> Unlock
                    </Button>
                  ) : (
                    <Button size="sm" className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white" onClick={() => handleLockUser(user.id)}>
                      <Lock className="w-3 h-3 mr-1" /> Lock
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}