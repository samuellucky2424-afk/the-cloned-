import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useAuth } from '../../hooks/AuthContext'
import type { UserProfile } from '../../lib/banking'

function routeForProfile(profile: UserProfile) {
  return profile.role === 'admin' ? '/admin' : '/dashboard'
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { signIn, profile, loading: authLoading, configured } = useAuth()
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
      navigate(routeForProfile(profile), { replace: true })
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
      navigate(routeForProfile(signedInProfile), { replace: true })
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'Unable to sign in.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#006A4D] via-[#004D2A] to-[#006A4D] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
              <path d="M75 25c-5-8-15-12-25-10-8 2-14 7-18 14l-8 16c-2 4-2 8 0 12l4 8c2 4 6 6 10 6h16c4 0 8-2 10-6l12-20c3-5 3-11 0-16l-1-4z" fill="white"/>
              <path d="M50 20c-2 0-4 1-5 3l-3 6c-1 2 0 4 2 5l8 4c2 1 4 0 5-2l3-6c1-2 0-4-2-5l-8-4z" fill="white"/>
              <circle cx="35" cy="35" r="4" fill="white"/>
              <path d="M25 55c0-5 5-10 10-10s10 5 10 10" stroke="white" strokeWidth="3" fill="none"/>
            </svg>
            <span className="text-2xl font-bold text-white">KORVANTIS IMPERIAL BANK</span>
          </div>
          <p className="text-white/70">Welcome back! Sign in to your account.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6 text-center">Sign In</h2>

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
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
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
              <Link to="#" className="text-sm text-[#006A4D] hover:underline font-medium">
                Forgot password?
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

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-[#595959]">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="text-center text-sm text-[#595959]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#006A4D] font-semibold hover:underline">
              Create an account
            </Link>
          </p>

          <p className="text-center text-sm text-[#595959] mt-4">
            <Link to="/" className="text-[#006A4D] hover:underline">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
