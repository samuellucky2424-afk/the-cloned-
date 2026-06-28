import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Send, Globe, ArrowDownLeft, Clock,
  Home, CreditCard, Wallet, User, MessageCircle,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '../../hooks/AuthContext'
import {
  formatCurrency,
  formatDateTime,
  getDisplayName,
  getInitials,
  subscribeUserAccounts,
  subscribeUserTransactions,
  type BankAccount,
  type Transaction,
} from '../../lib/banking'

const quickActions = [
  { icon: Send, label: 'Domestic Transfer', path: '/transfer?tab=domestic' },
  { icon: Globe, label: 'International', path: '/transfer?tab=international' },
  { icon: Wallet, label: 'Pay Bills', path: '/transfer?tab=bills' },
  { icon: Clock, label: 'History', section: 'transactions' },
]

const bottomNav = [
  { icon: Home, label: 'Home' },
  { icon: Send, label: 'Transfer' },
  { icon: Wallet, label: 'Payments' },
  { icon: User, label: 'Profile' },
]

export default function UserDashboard() {
  const navigate = useNavigate()
  const { profile, user } = useAuth()
  const [activeTab, setActiveTab] = useState('Home')
  const [showChat, setShowChat] = useState(false)
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (!profile) return

    const unsubscribeAccounts = subscribeUserAccounts(profile.uid, setAccounts)
    const unsubscribeTransactions = subscribeUserTransactions(profile.uid, setTransactions)

    return () => {
      unsubscribeAccounts()
      unsubscribeTransactions()
    }
  }, [profile])

  const handleNavClick = (label: string) => {
    setActiveTab(label)
    if (label === 'Profile') navigate('/settings')
    if (label === 'Transfer') navigate('/transfer?tab=domestic')
    if (label === 'Payments') navigate('/transfer?tab=bills')
  }

  const primaryAccount = accounts.find((account) => account.isPrimary) ?? accounts[0]
  const recentTransactions = transactions.slice(0, 5)
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

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
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <button 
              onClick={() => navigate('/account-details')}
              className="flex items-center gap-3 hover:opacity-80 transition text-left"
              title="View account details"
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-12 h-12 rounded-lg object-cover border border-white/20" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-white text-[#006A4D] flex items-center justify-center text-lg font-bold">
                  {getInitials(profile)}
                </div>
              )}
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wide">Welcome back</p>
                <h1 className="text-2xl font-bold">Hi, {profile.firstName || getDisplayName(profile)}</h1>
              </div>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8">
        <section>
          <div className="rounded-lg bg-white border border-[#D9E8E1] shadow-sm overflow-hidden">
            <div className="bg-[#006A4D] text-white p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <p className="text-white/75 text-sm">Available Balance</p>
                    {profile.status === 'Suspended' && (
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        Account Suspended
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-baseline gap-2 mt-2">
                    <span className="text-4xl font-bold">
                      {formatCurrency(primaryAccount?.balance ?? profile.balance ?? 0, primaryAccount?.currency ?? 'USD')}
                    </span>
                    <span className="text-white/70 text-lg">{primaryAccount?.currency ?? 'USD'}</span>
                  </div>
                  <p className="text-white/70 text-sm mt-2">{primaryAccount?.label ?? 'Primary account'}</p>
                </div>
                <div className="rounded-lg bg-white/10 px-4 py-3 text-sm">
                  <p className="text-white/70">Total across accounts</p>
                  <p className="font-semibold mt-1">{formatCurrency(accounts.length ? totalBalance : 0)}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 p-4 sm:grid-cols-3">
              {accounts.length === 0 && (
                <div className="sm:col-span-3 rounded-lg border border-dashed border-[#B7D4C9] p-4 text-sm text-[#4E655D]">
                  Accounts are being created for this profile.
                </div>
              )}

              {accounts.map((account) => (
                <div key={account.id} className="rounded-lg border border-[#D9E8E1] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#1A1A1A]">{account.label}</p>
                    <CreditCard size={18} className="text-[#006A4D]" />
                  </div>
                  <p className="text-2xl font-bold text-[#006A4D] mt-3">{formatCurrency(account.balance, account.currency)}</p>
                  <p className="text-xs text-[#667A73] mt-1">{account.isPrimary ? 'Primary account' : 'Linked account'}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-lg bg-white border border-[#D9E8E1] shadow-sm p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-bold text-[#1A1A1A]">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="rounded-lg border border-[#D9E8E1] bg-white p-4 text-left hover:border-[#006A4D] hover:bg-[#F4FAF7] transition"
                onClick={() => {
                  if (action.path) navigate(action.path)
                  if (action.section) document.getElementById(action.section)?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <div className="w-10 h-10 rounded-lg bg-[#006A4D] text-white flex items-center justify-center mb-3">
                  <action.icon size={20} />
                </div>
                <span className="text-sm font-semibold text-[#1A1A1A]">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section id="transactions" className="mt-6 rounded-lg bg-white border border-[#D9E8E1] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Transactions</h2>
            <span className="text-sm text-[#006A4D]">{transactions.length} total</span>
          </div>

          <div className="space-y-3">
            {recentTransactions.length === 0 && (
              <div className="rounded-lg border border-dashed border-[#B7D4C9] p-5 text-sm text-[#4E655D]">
                No transactions yet.
              </div>
            )}

            {recentTransactions.map((tx) => {
              const isCredit = tx.amount >= 0
              return (
                <div
                  key={tx.id}
                  className="flex flex-col gap-3 rounded-lg border border-[#D9E8E1] p-4 sm:flex-row sm:items-center"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isCredit ? 'bg-[#E5F4EF] text-[#006A4D]' : 'bg-red-50 text-red-600'
                  }`}>
                    {isCredit ? (
                      <ArrowDownLeft size={18} />
                    ) : (
                      <Send size={16} className="rotate-45" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{tx.title}</p>
                    <p className="text-xs text-[#667A73]">{formatDateTime(tx.createdAt)} - {tx.type}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className={`text-sm font-semibold ${isCredit ? 'text-[#006A4D]' : 'text-red-600'}`}>
                      {isCredit ? '+' : ''}{formatCurrency(tx.amount, tx.currency)}
                    </p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      tx.status === 'Completed' ? 'bg-[#E5F4EF] text-[#006A4D]' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#D9E8E1] z-50 lg:hidden">
        <div className="max-w-md mx-auto flex items-center justify-around py-2">
          {bottomNav.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.label)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition ${
                activeTab === item.label ? 'text-[#006A4D]' : 'text-[#667A73] hover:text-[#006A4D]'
              }`}
            >
              <item.icon size={22} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
          {/* Support button removed */}
        </div>
      </div>

      {showChat && (
        <div className="fixed bottom-20 right-4 bg-white text-[#1A1A1A] rounded-lg shadow-2xl p-4 w-72 z-50 border border-[#D9E8E1]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#006A4D] rounded-lg flex items-center justify-center">
                <MessageCircle size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">Support Agent</p>
                <p className="text-xs text-[#006A4D] flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#006A4D] rounded-full inline-block" />
                  Online
                </p>
              </div>
            </div>
            <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-gray-600">
              <ChevronRight size={18} className="rotate-90" />
            </button>
          </div>
          <div className="bg-[#F4FAF7] rounded-lg p-3 mb-3">
            <p className="text-sm">We're online.</p>
            <p className="text-xs text-[#667A73] mt-1">How may I help you today?</p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 text-sm border border-[#D9E8E1] rounded-lg px-3 py-2 focus:outline-none focus:border-[#006A4D]"
            />
            <button className="bg-[#006A4D] text-white p-2 rounded-lg hover:bg-[#004D2A] transition">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
