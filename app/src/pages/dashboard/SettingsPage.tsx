import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Sun, Monitor, User, Lock,
  Bell, Shield, LogOut, ChevronRight, Eye, EyeOff,
  Save, CheckCircle
} from 'lucide-react'
import { useAuth } from '../../hooks/AuthContext'
import {
  defaultNotifications,
  getDisplayName,
  getInitials,
  type NotificationPreferences,
} from '../../lib/banking'

type SettingsSection = 'profile' | 'security' | 'notifications' | 'appearance' | 'privacy'

export default function SettingsPage() {
  const navigate = useNavigate()
  const {
    profile: authProfile,
    user,
    updateCurrentProfile,
    updateAvatar,
    changePassword,
    logout,
  } = useAuth()
  const [theme, setTheme] = useState<'light' | 'system'>('light')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowPassword2] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState<SettingsSection | null>(null)

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    gender: '',
    occupation: '',
    monthlySalary: '',
    sourceOfIncome: '',
  })

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  const [notifications, setNotifications] = useState<NotificationPreferences>(defaultNotifications)

  useEffect(() => {
    if (!authProfile) return

    setProfileForm({
      firstName: authProfile.firstName ?? '',
      lastName: authProfile.lastName ?? '',
      email: authProfile.email ?? '',
      phone: authProfile.phone ?? '',
      address: authProfile.address ?? '',
      country: authProfile.country ?? '',
      gender: authProfile.gender ?? '',
      occupation: authProfile.occupation ?? '',
      monthlySalary: authProfile.monthlySalary ?? '',
      sourceOfIncome: authProfile.sourceOfIncome ?? '',
    })
    setNotifications(authProfile.notificationPreferences ?? defaultNotifications)
  }, [authProfile])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProfileForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setSaved(false)
    setError('')
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setSaved(false)
    setError('')
  }

  const handleNotificationToggle = (key: keyof NotificationPreferences) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    setSaved(false)
    setError('')
  }

  const showSaved = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      if (activeSection === 'profile') {
        await updateCurrentProfile(profileForm)
      } else if (activeSection === 'security') {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
          throw new Error('Enter your current password and a new password.')
        }
        if (passwords.new.length < 8) {
          throw new Error('New password must be at least 8 characters.')
        }
        if (passwords.new !== passwords.confirm) {
          throw new Error('New passwords do not match.')
        }
        await changePassword(passwords.current, passwords.new)
        setPasswords({ current: '', new: '', confirm: '' })
      } else if (activeSection === 'notifications') {
        await updateCurrentProfile({ notificationPreferences: notifications })
      }

      showSaved()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save changes.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await logout()
      navigate('/login', { replace: true })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit to 2MB
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size must be less than 2MB.')
      return
    }

    setUploading(true)
    setError('')
    setSaved(false)

    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const base64Image = event.target?.result as string
        if (!base64Image) {
          setError('Failed to read file.')
          setUploading(false)
          return
        }

        try {
          const response = await fetch('http://localhost:3002/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64Image }),
          })

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}))
            throw new Error(errData.error || 'Failed to upload image.')
          }

          const data = await response.json()
          await updateAvatar(data.url)
          setSaved(true)
        } catch (uploadErr) {
          setError(uploadErr instanceof Error ? uploadErr.message : 'Failed to upload image.')
        } finally {
          setUploading(false)
        }
      }
      reader.onerror = () => {
        setError('Failed to read file.')
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read file.')
      setUploading(false)
    }
  }

  const handleRemovePhoto = async () => {
    setError('')
    setSaved(false)
    setUploading(true)
    try {
      await updateAvatar('')
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove photo.')
    } finally {
      setUploading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 bg-white border border-[#CFE2DA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4D] focus:border-transparent text-[#1A1A1A] placeholder-[#8AA097] text-sm transition-all"
  const labelClass = "block text-xs font-medium text-[#4E655D] mb-1"
  const panelClass = "rounded-lg bg-white border border-[#D9E8E1] shadow-sm p-5"
  const primaryButtonClass = "w-full py-4 bg-[#006A4D] text-white font-semibold rounded-lg hover:bg-[#004D2A] transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"

  const menuItems: Array<{ id: SettingsSection; label: string; icon: typeof User; desc: string }> = [
    { id: 'profile', label: 'Edit Profile', icon: User, desc: 'Update your personal information' },
    { id: 'security', label: 'Security', icon: Lock, desc: 'Change password and identity settings' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Manage email and SMS alerts' },
    { id: 'appearance', label: 'Appearance', icon: Monitor, desc: 'Green and white display preference' },
    { id: 'privacy', label: 'Privacy', icon: Shield, desc: 'Privacy and data settings' },
  ]

  return (
    <div className="min-h-screen bg-[#F4FAF7] text-[#1A1A1A]">
      <header className="bg-[#006A4D] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => activeSection ? setActiveSection(null) : navigate('/dashboard')}
              className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-semibold">{activeSection ? menuItems.find(m => m.id === activeSection)?.label : 'Profile'}</h1>
              <p className="text-sm text-white/70">
                {activeSection ? 'Manage your account preferences' : 'Account and preferences'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-12">
        {saved && (
          <div className="mb-4 p-4 bg-[#E5F4EF] border border-[#B7D4C9] rounded-lg flex items-center gap-3">
            <CheckCircle size={20} className="text-[#006A4D]" />
            <p className="text-sm text-[#006A4D]">Changes saved successfully.</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {!activeSection && (
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div className={panelClass}>
              <div className="flex items-center gap-4">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-14 h-14 rounded-lg object-cover border border-[#D9E8E1]" />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-[#006A4D] text-white flex items-center justify-center text-lg font-bold">
                    {getInitials(authProfile)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold truncate">{getDisplayName(authProfile)}</p>
                  <p className="text-xs text-[#667A73] truncate">{authProfile?.email}</p>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3 border-b border-[#E6F0EC] pb-3">
                  <span className="text-[#667A73]">Phone</span>
                  <span className="font-medium">{authProfile?.phone || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-[#E6F0EC] pb-3">
                  <span className="text-[#667A73]">Country</span>
                  <span className="font-medium">{authProfile?.country || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#667A73]">Occupation</span>
                  <span className="font-medium text-right">{authProfile?.occupation || 'Not set'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="w-full flex items-center gap-4 p-4 bg-white border border-[#D9E8E1] rounded-lg hover:border-[#006A4D] hover:bg-[#F4FAF7] transition text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#E5F4EF] flex items-center justify-center flex-shrink-0">
                    <item.icon size={20} className="text-[#006A4D]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-[#667A73]">{item.desc}</p>
                  </div>
                  <ChevronRight size={18} className="text-[#8AA097]" />
                </button>
              ))}

              <button onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition text-left">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                  <LogOut size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-red-700">Log Out</p>
                  <p className="text-xs text-red-500">Sign out of your account</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {activeSection === 'profile' && (
          <div className={`${panelClass} space-y-4`}>
            {/* Profile Picture Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-[#E6F0EC] mb-4">
              <div className="relative group flex-shrink-0">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-[#006A4D] shadow-sm" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#006A4D] text-white flex items-center justify-center text-2xl font-bold border-2 border-[#006A4D] shadow-sm">
                    {getInitials(authProfile)}
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/45 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    Saving...
                  </div>
                )}
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-sm font-semibold text-[#1A1A1A]">Profile Picture</p>
                <p className="text-xs text-[#667A73]">JPG or PNG. Max size 2MB.</p>
                <div className="flex gap-2 justify-center sm:justify-start mt-2">
                  <label className="cursor-pointer px-3 py-1.5 bg-[#E5F4EF] hover:bg-[#D4EBE0] text-[#006A4D] text-xs font-semibold rounded-lg transition inline-flex items-center gap-1">
                    Upload Photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                  {user?.photoURL && (
                    <button type="button" onClick={handleRemovePhoto} disabled={uploading} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>First Name</label>
                <input type="text" name="firstName" value={profileForm.firstName} onChange={handleProfileChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input type="text" name="lastName" value={profileForm.lastName} onChange={handleProfileChange} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" name="email" value={profileForm.email} onChange={handleProfileChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="tel" name="phone" value={profileForm.phone} onChange={handleProfileChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <textarea name="address" value={profileForm.address} onChange={handleProfileChange} rows={2} className={`${inputClass} resize-none`} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Country</label>
                <select name="country" value={profileForm.country} onChange={handleProfileChange} className={inputClass}>
                  <option value="">Select country</option>
                  <option value="UK">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="IE">Ireland</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select name="gender" value={profileForm.gender} onChange={handleProfileChange} className={inputClass}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not">Prefer not to say</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Occupation</label>
              <input type="text" name="occupation" value={profileForm.occupation} onChange={handleProfileChange} className={inputClass} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Monthly Salary</label>
                <input type="number" name="monthlySalary" value={profileForm.monthlySalary} onChange={handleProfileChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Source of Income</label>
                <input type="text" name="sourceOfIncome" value={profileForm.sourceOfIncome} onChange={handleProfileChange} className={inputClass} />
              </div>
            </div>
            <button onClick={handleSave} disabled={saving} className={`${primaryButtonClass} mt-2`}>
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {activeSection === 'security' && (
          <div className="space-y-4">
            <div className={panelClass}>
              <h2 className="font-semibold mb-4">Change Password</h2>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Current Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} name="current" value={passwords.current} onChange={handlePasswordChange}
                      placeholder="Enter current password" className={`${inputClass} pr-10`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667A73]">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>New Password</label>
                  <input type="password" name="new" value={passwords.new} onChange={handlePasswordChange}
                    placeholder="Min 8 characters" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Confirm New Password</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirm" value={passwords.confirm} onChange={handlePasswordChange}
                      placeholder="Repeat new password" className={`${inputClass} pr-10`} />
                    <button type="button" onClick={() => setShowPassword2(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667A73]">
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={panelClass}>
              <h2 className="font-semibold mb-3">Two-Factor Authentication</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#4E655D]">2FA Status</p>
                  <p className="text-xs text-[#006A4D]">Enabled via email</p>
                </div>
                <span className="px-3 py-1 bg-[#E5F4EF] text-[#006A4D] text-xs rounded-full font-semibold">Active</span>
              </div>
            </div>

            <button onClick={handleSave} disabled={saving} className={primaryButtonClass}>
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="space-y-3">
            {(Object.entries(notifications) as [keyof NotificationPreferences, boolean][]).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between gap-4 p-4 bg-white border border-[#D9E8E1] rounded-lg">
                <div>
                  <p className="text-sm font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
                  <p className="text-xs text-[#667A73]">
                    {key === 'emailAlerts' && 'Receive important account notifications'}
                    {key === 'smsAlerts' && 'Get SMS alerts for transactions'}
                    {key === 'transactionEmails' && 'Monthly transaction summaries'}
                    {key === 'marketingEmails' && 'Product updates and offers'}
                    {key === 'loginAlerts' && 'Alert when someone logs into your account'}
                  </p>
                </div>
                <button type="button" onClick={() => handleNotificationToggle(key)}
                  className={`w-12 h-7 rounded-full transition-colors relative flex-shrink-0 ${value ? 'bg-[#006A4D]' : 'bg-[#CFE2DA]'}`}>
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
            <button onClick={handleSave} disabled={saving} className={`${primaryButtonClass} mt-4`}>
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        )}

        {activeSection === 'appearance' && (
          <div className="space-y-4">
            <div className={panelClass}>
              <h2 className="font-semibold mb-4">Theme</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'light' as const, label: 'Green White', icon: Sun },
                  { id: 'system' as const, label: 'System', icon: Monitor },
                ].map((t) => (
                  <button key={t.id} type="button" onClick={() => { setTheme(t.id); setSaved(false); }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition ${
                      theme === t.id ? 'border-[#006A4D] bg-[#E5F4EF]' : 'border-[#D9E8E1] bg-white hover:border-[#006A4D]'
                    }`}>
                    <t.icon size={24} className={theme === t.id ? 'text-[#006A4D]' : 'text-[#667A73]'} />
                    <span className={`text-xs font-medium ${theme === t.id ? 'text-[#006A4D]' : 'text-[#667A73]'}`}>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={panelClass}>
              <h2 className="font-semibold mb-3">Preview</h2>
              <div className="p-4 rounded-lg bg-[#F4FAF7] border border-[#D9E8E1]">
                <p className="text-sm font-medium">Dashboard Card</p>
                <p className="text-xs text-[#667A73]">Green header, white panels, and Seagate Metal-style action controls.</p>
                <div className="mt-3 h-2 rounded-full bg-[#006A4D]" />
              </div>
            </div>

            <button onClick={showSaved} className={primaryButtonClass}>
              <Save size={18} />
              Save Theme
            </button>
          </div>
        )}

        {activeSection === 'privacy' && (
          <div className="space-y-4">
            <div className={panelClass}>
              <h2 className="font-semibold mb-3">Account Privacy</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm">Account Visibility</p>
                    <p className="text-xs text-[#667A73]">Who can see your account info</p>
                  </div>
                  <span className="text-xs text-[#006A4D] bg-[#E5F4EF] px-2 py-1 rounded-full font-semibold">Private</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm">Data Sharing</p>
                    <p className="text-xs text-[#667A73]">Share data with Seagate Metal Group</p>
                  </div>
                  <button type="button" className="w-12 h-7 rounded-full bg-[#006A4D] relative flex-shrink-0">
                    <div className="absolute top-1 w-5 h-5 rounded-full bg-white translate-x-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h2 className="font-medium text-red-700 mb-2">Danger Zone</h2>
              <p className="text-xs text-red-500 mb-3">These actions are irreversible. Please proceed with caution.</p>
              <button type="button" onClick={() => alert('Account deletion request submitted. Our team will contact you within 24 hours.')}
                className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium">
                Request Account Deletion
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
