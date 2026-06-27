import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/AuthContext'
import type { ReactNode } from 'react'
import type { UserRole } from '../lib/banking'

interface ProtectedRouteProps {
  children: ReactNode
  role?: UserRole
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const location = useLocation()
  const { user, profile, loading, configured } = useAuth()

  if (!configured) {
    return (
      <div className="min-h-screen bg-[#F4FAF7] text-[#1A1A1A] flex items-center justify-center p-6">
        <div className="max-w-md rounded-lg bg-white border border-[#D9E8E1] p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold mb-2 text-[#006A4D]">Firebase is not configured</h1>
          <p className="text-sm text-[#667A73]">
            Add your VITE_FIREBASE_* values to an .env file, then restart the dev server.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4FAF7] text-[#1A1A1A] flex items-center justify-center">
        <div className="rounded-lg bg-white border border-[#D9E8E1] px-5 py-4 text-sm text-[#006A4D] shadow-sm">
          Loading secure session...
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace state={{ from: location.pathname }} />
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F4FAF7] text-[#1A1A1A] flex items-center justify-center p-6">
        <div className="max-w-md rounded-lg bg-white border border-[#D9E8E1] p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold mb-2 text-[#006A4D]">Profile missing</h1>
          <p className="text-sm text-[#667A73]">
            Your authentication record exists, but your banking profile has not been created.
          </p>
        </div>
      </div>
    )
  }

  // Suspended users are allowed to access dashboard, settings, and fill transfer forms.
  // Transaction attempts will be blocked via popups.

  if (role && profile.role !== role) {
    return <Navigate to={profile.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }

  return children
}
