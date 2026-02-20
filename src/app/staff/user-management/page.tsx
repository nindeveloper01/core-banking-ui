'use client'

import { useState, useMemo } from 'react'
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
  XCircle,
  AlertCircle,
  Loader2,
  Users as UserIcon
} from 'lucide-react'
import { mockStaff } from '@/data/mock-data'
import { StaffMember } from '@/lib/types'

const roleColors = {
  ADMIN: 'bg-red-100 text-red-800 border-red-300',
  TELLER: 'bg-blue-100 text-blue-800 border-blue-300',
  LOAN_OFFICER: 'bg-green-100 text-green-800 border-green-300',
}

const roleIcons = {
  ADMIN: Shield,
  TELLER: UserIcon,
  LOAN_OFFICER: CheckCircle,
}

export default function UsersPage() {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterDepartment, setFilterDepartment] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<StaffMember | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [lockedUsers, setLockedUsers] = useState<Set<string>>(new Set())

  // Get unique departments
  const departments = useMemo(() => {
    return Array.from(new Set(staff.map((s) => s.department)))
  }, [staff])

  // Filter staff
  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const matchesSearch =
        member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRole = filterRole === 'all' || member.role === filterRole
      const matchesDept = filterDepartment === 'all' || member.department === filterDepartment

      return matchesSearch && matchesRole && matchesDept
    })
  }, [staff, searchQuery, filterRole, filterDepartment])

  const handleLockUser = async (userId: string) => {
    setIsLoading(true)
    try {
      setLockedUsers((prev) => new Set(prev).add(userId))
      setSuccessMessage(`User ${userId} has been locked`)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setErrorMessage('Failed to lock user')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnlockUser = async (userId: string) => {
    setIsLoading(true)
    try {
      setLockedUsers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
      setSuccessMessage(`User ${userId} has been unlocked`)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setErrorMessage('Failed to unlock user')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setIsLoading(true)
      try {
        setStaff((prev) => prev.filter((s) => s.id !== userId))
        setSuccessMessage(`User deleted successfully`)
        setTimeout(() => setSuccessMessage(''), 3000)
      } catch (err) {
        setErrorMessage('Failed to delete user')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleEditUser = (user: StaffMember) => {
    setSelectedUser(user)
    setShowForm(true)
  }

  const handleAddUser = () => {
    setSelectedUser(null)
    setShowForm(true)
  }

  return (
    <div className="space-y-8">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex justify-between items-center">
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-green-600 hover:text-green-800"
          >
            ×
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage('')}
            className="text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage staff members and their access</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            onClick={() => setViewMode('table')}
            size="sm"
          >
            Table View
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
            size="sm"
          >
            Grid View
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleAddUser}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="TELLER">Teller</option>
              <option value="LOAN_OFFICER">Loan Officer</option>
            </select>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-900">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{staff.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-900">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{staff.length - lockedUsers.size}</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-red-900">Locked Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{lockedUsers.size}</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-orange-900">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">
              {staff.filter((s) => s.role === 'ADMIN').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <Card>
          <CardHeader>
            <CardTitle>Staff Members ({filteredStaff.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredStaff.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No users found matching your criteria
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.map((member) => (
                      <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{member.fullName}</td>
                        <td className="py-3 px-4 text-gray-600">{member.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${
                              roleColors[member.role as keyof typeof roleColors]
                            }`}
                          >
                            {member.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{member.department}</td>
                        <td className="py-3 px-4">
                          {lockedUsers.has(member.id) ? (
                            <div className="flex items-center gap-1 text-red-600">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-xs font-medium">Locked</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-xs font-medium">Active</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(member.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditUser(member)}
                              disabled={isLoading}
                            >
                              <Edit2 className="w-4 h-4 text-blue-600" />
                            </Button>
                            {lockedUsers.has(member.id) ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleUnlockUser(member.id)}
                                disabled={isLoading}
                              >
                                <Unlock className="w-4 h-4 text-green-600" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleLockUser(member.id)}
                                disabled={isLoading}
                              >
                                <Lock className="w-4 h-4 text-yellow-600" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteUser(member.id)}
                              disabled={isLoading}
                            >
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
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No users found matching your criteria
            </div>
          ) : (
            filteredStaff.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                        👤
                      </div>
                      <div>
                        <CardTitle className="text-base">{member.fullName}</CardTitle>
                        <p className="text-xs text-gray-500">{member.id}</p>
                      </div>
                    </div>
                    {lockedUsers.has(member.id) ? (
                      <Lock className="w-5 h-5 text-red-600" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Role Badge */}
                  <div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        roleColors[member.role as keyof typeof roleColors]
                      }`}
                    >
                      {member.role.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                        {member.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{member.department}</span>
                    </div>
                  </div>

                  {/* Joined Date */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 p-2 bg-gray-50 rounded">
                    <Calendar className="w-3 h-3" />
                    Joined {new Date(member.createdAt).toLocaleDateString()}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEditUser(member)}
                      disabled={isLoading}
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    {lockedUsers.has(member.id) ? (
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleUnlockUser(member.id)}
                        disabled={isLoading}
                      >
                        <Unlock className="w-3 h-3 mr-1" />
                        Unlock
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                        onClick={() => handleLockUser(member.id)}
                        disabled={isLoading}
                      >
                        <Lock className="w-3 h-3 mr-1" />
                        Lock
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
