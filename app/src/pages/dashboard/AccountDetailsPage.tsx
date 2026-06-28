import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Upload, CreditCard, DollarSign, Calendar, Copy, Check
} from 'lucide-react'
import { useAuth } from '../../hooks/AuthContext'
import {
  formatCurrency,
  formatDateTime,
  getDisplayName,
  getInitials,
  subscribeUserAccounts,
  type BankAccount,
} from '../../lib/banking'

export default function AccountDetailsPage() {
  const navigate = useNavigate()
  const { profile, user, updateAvatar } = useAuth()
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [copiedAccountId, setCopiedAccountId] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) return
    return subscribeUserAccounts(profile.uid, setAccounts)
  }, [profile])

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

  const copyToClipboard = (accountNumber: string, accountId: string) => {
    navigator.clipboard.writeText(accountNumber)
    setCopiedAccountId(accountId)
    setTimeout(() => setCopiedAccountId(null), 2000)
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F4FAF7] text-[#1A1A1A] flex items-center justify-center">
        <p className="text-sm text-[#006A4D]">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4FAF7] text-[#1A1A1A]">
      <header className="bg-[#006A4D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
              title="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Account Details</h1>
              <p className="text-white/70 text-sm">Manage your accounts and profile</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12">
        {/* Profile Section */}
        <div className="rounded-lg bg-white border border-[#D9E8E1] shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Profile Picture</h2>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-lg object-cover border-4 border-[#006A4D]"
                />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-[#006A4D] text-white flex items-center justify-center text-3xl font-bold">
                  {getInitials(profile)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#667A73] mb-2">Upload a new profile picture</p>
              <label className="inline-block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#006A4D] text-white rounded-lg hover:bg-[#004D2A] transition cursor-pointer disabled:opacity-50"
                  onClick={(e) => {
                    if (uploading) e.preventDefault()
                  }}>
                  <Upload size={18} />
                  {uploading ? 'Uploading...' : 'Upload Picture'}
                </span>
              </label>
              {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
            </div>
          </div>
        </div>

        {/* Accounts Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Your Accounts</h2>
          
          {accounts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#B7D4C9] p-6 text-center text-[#4E655D]">
              <p className="text-sm">No accounts found. Accounts are being created for your profile.</p>
            </div>
          ) : (
            accounts.map((account) => (
              <div
                key={account.id}
                className="rounded-lg bg-white border border-[#D9E8E1] shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <div className="bg-[#006A4D] text-white p-4 sm:p-6">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <p className="font-semibold">{account.label}</p>
                        <p className="text-white/70 text-sm">
                          {account.accountType === 'current' && 'Current Account'}
                          {account.accountType === 'savings' && 'Savings Account'}
                          {account.accountType === 'cash' && 'Cash Account'}
                        </p>
                      </div>
                    </div>
                    {account.isPrimary && (
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="text-3xl font-bold">
                    {formatCurrency(account.balance, account.currency)}
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Account Number */}
                    <div className="rounded-lg bg-[#F4FAF7] border border-[#D9E8E1] p-4">
                      <p className="text-xs text-[#667A73] uppercase tracking-wide mb-2">Account Number</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono font-semibold text-[#1A1A1A]">
                          {account.accountNumber}
                        </p>
                        <button
                          onClick={() => copyToClipboard(account.accountNumber, account.id)}
                          className="p-2 rounded-lg hover:bg-white transition"
                          title="Copy to clipboard"
                        >
                          {copiedAccountId === account.id ? (
                            <Check size={16} className="text-green-600" />
                          ) : (
                            <Copy size={16} className="text-[#667A73]" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Currency */}
                    <div className="rounded-lg bg-[#F4FAF7] border border-[#D9E8E1] p-4">
                      <p className="text-xs text-[#667A73] uppercase tracking-wide mb-2">Currency</p>
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-[#006A4D]" />
                        <p className="font-semibold text-[#1A1A1A]">{account.currency}</p>
                      </div>
                    </div>

                    {/* IBAN */}
                    <div className="rounded-lg bg-[#F4FAF7] border border-[#D9E8E1] p-4">
                      <p className="text-xs text-[#667A73] uppercase tracking-wide mb-2">IBAN</p>
                      <p className="font-mono text-sm text-[#1A1A1A]">{account.iban || 'N/A'}</p>
                    </div>

                    {/* Created Date */}
                    <div className="rounded-lg bg-[#F4FAF7] border border-[#D9E8E1] p-4">
                      <p className="text-xs text-[#667A73] uppercase tracking-wide mb-2">Created</p>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-[#006A4D]" />
                        <p className="text-sm text-[#1A1A1A]">
                          {account.createdAt ? formatDateTime(account.createdAt).split(',')[0] : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Account Status */}
                    <div className="rounded-lg bg-[#F4FAF7] border border-[#D9E8E1] p-4">
                      <p className="text-xs text-[#667A73] uppercase tracking-wide mb-2">Status</p>
                      <p className="font-semibold text-green-600">Active</p>
                    </div>

                    {/* Account Holder */}
                    <div className="rounded-lg bg-[#F4FAF7] border border-[#D9E8E1] p-4 sm:col-span-2">
                      <p className="text-xs text-[#667A73] uppercase tracking-wide mb-2">Account Holder</p>
                      <p className="font-semibold text-[#1A1A1A]">{getDisplayName(profile)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
