import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useAuth } from '../../hooks/AuthContext'
import type { UserProfile } from '../../lib/banking'

function routeForAdminProfile(profile: UserProfile) {
  return profile.role === 'admin' ? '/admin' : '/login'
}

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { signIn, logout, profile, loading: authLoading, configured } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!authLoading && profile) {
      navigate(routeForAdminProfile(profile), { replace: true })
    }
  }, [authLoading, navigate, profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name] || errors.form) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        delete newErrors.form
        return newErrors
      })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const signedInProfile = await signIn(formData.email, formData.password, formData.rememberMe)
      if (signedInProfile.role !== 'admin') {
        await logout()
        setErrors({ form: 'This portal is for admin users only. Please sign in with an admin account.' })
        return
      }
      navigate(routeForAdminProfile(signedInProfile), { replace: true })
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'Unable to sign in.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] via-[#004D2A] to-[#006A4D] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-4">
            <span className="text-2xl font-bold text-white">KORVANTIS ADMIN PORTAL</span>
          </div>
          <p className="text-white/70">Administrator access only. Enter your admin credentials.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6 text-center">Admin Sign In</h2>

          {!configured && (
            <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Firebase is not configured yet. Add your VITE_FIREBASE_* values to an .env file.
            </div>
          )}

          {errors.form && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#595959] mb-2">
                Admin email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your admin email"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4D] focus:border-transparent transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#595959] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4D] focus:border-transparent transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#006A4D] rounded focus:ring-[#006A4D]"
                />
                <span className="text-sm text-[#595959]">Remember me</span>
              </label>
              <Link to="/login" className="text-sm text-[#006A4D] hover:underline font-medium">
                Back to user login
              </Link>
            </div>

            <button
              type="submit"
              disabled={submitting || authLoading || !configured}
              className="w-full py-3 bg-[#006A4D] text-white font-semibold rounded-lg hover:bg-[#004D2A] transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
