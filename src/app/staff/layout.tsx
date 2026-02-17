'use client'

import { StaffSidebar } from '@/components/staff/Sidebar' 
import { ProtectedRoute } from '@/lib/protected-route'

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'TELLER', 'LOAN_OFFICER']}>
      <div className="flex h-screen bg-gray-50">
        <StaffSidebar />
        <main className="flex-1 ml-64 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
