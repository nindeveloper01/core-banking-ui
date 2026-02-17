'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context' 
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Wallet,
  CreditCard,
  TrendingUp,
  BarChart3,
  Shield,
  LogOut,
  ArrowRightLeft,
} from 'lucide-react'
import { apiClient } from '@/services/api'

console.log('[v0] Sidebar component loaded with cn utility')

const menuItems = [
  { href: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/staff/customers', label: 'Customers', icon: Users },
  { href: '/staff/accounts', label: 'Accounts', icon: Wallet },
  { href: '/staff/loans', label: 'Loans', icon: TrendingUp },
  { href: '/staff/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { href: '/staff/cards', label: 'Cards', icon: CreditCard },
  { href: '/staff/reports', label: 'Reports', icon: BarChart3 },
  { href: '/staff/user-management', label: 'User Management', icon: Shield },
]

export function StaffSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, setUser } = useAuth()

  const handleLogout = async () => {
    console.log('[v0] Logout initiated')
    try {
      await apiClient.logout()
      console.log('[v0] API logout successful')
      setUser(null)
      console.log('[v0] User state cleared')
      router.push('/login')
      console.log('[v0] Redirected to login')
    } catch (err) {
      console.error('[v0] Logout error:', err)
    }
  }

  return (
    <aside className="w-64  bg-blue-600 hover:bg-blue-700 text-white h-screen flex flex-col fixed left-0 top-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-indigo-500">
        <h1 className="text-2xl font-bold">Banking</h1>
        <p className="text-xs text-indigo-100">Staff Portal</p>
      </div>

      {/* User Info */}
      <div className="p-4 bg-indigo-500 bg-opacity-50 mx-4 mt-4 rounded-lg">
        <p className="text-sm font-medium">{user?.fullName}</p>
        <p className="text-xs text-indigo-100">{user?.role}</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon
          console.log('[v0] Navigation item:', item.label, 'isActive:', isActive, 'pathname:', pathname)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                isActive
                  ? 'bg-white text-indigo-600 font-medium'
                  : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-indigo-500">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 transition-all font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
