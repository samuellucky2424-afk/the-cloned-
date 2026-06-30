import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, User, Mail, Phone, Lock, MapPin, CreditCard, Briefcase, DollarSign } from 'lucide-react'
import { useAuth } from '../../hooks/AuthContext'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerAccount, configured } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    ssn: '',
    address: '',
    country: '',
    gender: '',
    occupation: '',
    monthlySalary: '',
    sourceOfIncome: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (submitStatus) setSubmitStatus('')
    if (errors[name] || errors.form) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        delete newErrors.form
        return newErrors
      })
    }
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) newErrors.phone = 'Enter a valid phone number'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Min 8 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.ssn.trim()) newErrors.ssn = 'SSN is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.country) newErrors.country = 'Select a country'
    if (!formData.gender) newErrors.gender = 'Select gender'
    if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required'
    if (!formData.monthlySalary) newErrors.monthlySalary = 'Monthly salary is required'
    if (!formData.sourceOfIncome.trim()) newErrors.sourceOfIncome = 'Source of income is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep1()) setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep2()) return

    setSubmitting(true)
    setSubmitStatus('Starting secure account setup...')
    try {
      await registerAccount({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        ssn: formData.ssn,
        address: formData.address,
        country: formData.country,
        gender: formData.gender,
        occupation: formData.occupation,
        monthlySalary: formData.monthlySalary,
        sourceOfIncome: formData.sourceOfIncome,
      }, setSubmitStatus)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setSubmitStatus('')
      setErrors({ form: error instanceof Error ? error.message : 'Unable to create account.' })
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4D] focus:border-transparent transition-all text-sm ${
      errors[field] ? 'border-red-500' : 'border-gray-300'
    }`

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#006A4D] via-[#004D2A] to-[#006A4D] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="mb-3">
            <span className="text-xl font-bold text-white">SEAGATE METAL</span>
          </div>
          <p className="text-white/70 text-sm">Create your account in 2 easy steps</p>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white/30'}`} />
          <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/30'}`} />
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-1 text-center">
            {step === 1 ? 'Personal Information' : 'Additional Details'}
          </h2>
          <p className="text-sm text-[#595959] text-center mb-6">
            {step === 1 ? 'Step 1 of 2 - Basic Info' : 'Step 2 of 2 - Additional Info'}
          </p>

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

          {submitting && submitStatus && (
            <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-[#006A4D]">
              {submitStatus}
            </div>
          )}

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext() } : handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#595959] mb-1">First Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" className={`${inputClass('firstName')} pl-10`} />
                    </div>
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#595959] mb-1">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" className={inputClass('lastName')} />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#595959] mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+44 7700 900000" className={`${inputClass('phone')} pl-10`} />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#595959] mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john.doe@email.com" className={`${inputClass('email')} pl-10`} />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#595959] mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Min 8 characters" className={`${inputClass('password')} pl-10 pr-10`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#595959] mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" className={`${inputClass('confirmPassword')} pl-10 pr-10`} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                <button type="submit" className="w-full py-3 bg-[#006A4D] text-white font-semibold rounded-lg hover:bg-[#004D2A] transition-colors shadow-lg mt-2">
                  Continue
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-medium text-[#595959] mb-1">SSN / National Insurance</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" name="ssn" value={formData.ssn} onChange={handleChange} placeholder="AB123456C" className={`${inputClass('ssn')} pl-10`} />
                  </div>
                  {errors.ssn && <p className="text-red-500 text-xs mt-1">{errors.ssn}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#595959] mb-1">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                    <textarea name="address" value={formData.address} onChange={handleChange} placeholder="123 Main Street, London" rows={2} className={`${inputClass('address')} pl-10 pt-2 resize-none`} />
                  </div>
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#595959] mb-1">Country</label>
                    <select name="country" value={formData.country} onChange={handleChange} className={inputClass('country')}>
                      <option value="">Select</option>
                      <option value="UK">United Kingdom</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="IE">Ireland</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#595959] mb-1">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass('gender')}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not">Prefer not to say</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#595959] mb-1">Occupation</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="Software Engineer" className={`${inputClass('occupation')} pl-10`} />
                  </div>
                  {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#595959] mb-1">Monthly Salary</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="number" name="monthlySalary" value={formData.monthlySalary} onChange={handleChange} placeholder="5000" className={`${inputClass('monthlySalary')} pl-10`} />
                  </div>
                  {errors.monthlySalary && <p className="text-red-500 text-xs mt-1">{errors.monthlySalary}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#595959] mb-1">Source of Income</label>
                  <input type="text" name="sourceOfIncome" value={formData.sourceOfIncome} onChange={handleChange} placeholder="Employment / Business / Investments" className={inputClass('sourceOfIncome')} />
                  {errors.sourceOfIncome && <p className="text-red-500 text-xs mt-1">{errors.sourceOfIncome}</p>}
                </div>

                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(1)} disabled={submitting} className="flex-1 py-3 border-2 border-gray-300 text-[#595959] font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                    Back
                  </button>
                  <button type="submit" disabled={submitting || !configured} className="flex-1 py-3 bg-[#006A4D] text-white font-semibold rounded-lg hover:bg-[#004D2A] transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
                    {submitting ? 'Please wait...' : 'Create Account'}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="text-center text-sm text-[#595959] mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-[#006A4D] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
          <p className="text-center text-sm text-[#595959] mt-2">
            <Link to="/" className="text-[#006A4D] hover:underline">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
