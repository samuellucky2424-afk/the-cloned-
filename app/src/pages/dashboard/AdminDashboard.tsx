import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Receipt, BarChart3,
  Bell, LogOut, Search, Eye, Ban, CheckCircle,
  UserCheck, UserX, Clock, CreditCard, Save, X, Menu
} from 'lucide-react'
import { useAuth } from '../../hooks/AuthContext'
import {
  approveTransaction,
  createAdminDeposit,
  declineTransaction,
  formatCurrency,
  formatDateTime,
  getDisplayName,
  getInitials,
  resetUserTransactions,
  subscribeAllAccounts,
  subscribeAllTransactions,
  subscribeAllUsers,
  updateTransaction,
  updateUserStatus,
  type BankAccount,
  type Transaction,
  type UserProfile,
  type UserStatus,
} from '../../lib/banking'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
  { icon: Users, label: 'Users', id: 'users' },
  { icon: CreditCard, label: 'Deposits', id: 'deposits' },
  { icon: Receipt, label: 'Transactions', id: 'transactions' },
  { icon: BarChart3, label: 'Reports', id: 'reports' },
]

function timestampToInput(value: unknown) {
  if (!value) return ''
  const date = typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function'
    ? value.toDate()
    : new Date(value as string)

  if (Number.isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16)
}

function statusBadge(status: string) {
  switch (status) {
    case 'Active':
    case 'Completed':
      return 'bg-emerald-100 text-emerald-700'
    case 'Pending':
      return 'bg-amber-100 text-amber-700'
    case 'Suspended':
    case 'Blocked':
    case 'Declined':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<UserProfile[]>([])
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [busy, setBusy] = useState('')
  const [message, setMessage] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [depositForm, setDepositForm] = useState({
    accountId: '',
    accountNumber: '',
    senderName: '',
    amount: '',
    currency: 'GBP',
    reference: '',
    dateTime: new Date().toISOString().slice(0, 16),
  })

  const [transactionForm, setTransactionForm] = useState({
    title: '',
    amount: '',
    fee: '',
    total: '',
    currency: 'GBP',
    status: 'Pending',
    senderName: '',
    recipientName: '',
    recipientAccount: '',
    reference: '',
    dateTime: '',
  })

  useEffect(() => {
    const unsubscribeUsers = subscribeAllUsers(setUsers)
    const unsubscribeAccounts = subscribeAllAccounts(setAccounts)
    const unsubscribeTransactions = subscribeAllTransactions(setTransactions)

    return () => {
      unsubscribeUsers()
      unsubscribeAccounts()
      unsubscribeTransactions()
    }
  }, [])

  const activeUsers = users.filter((user) => user.status === 'Active').length
  const suspendedUsers = users.filter((user) => user.status === 'Suspended').length
  const pendingTransactions = transactions.filter((transaction) => transaction.status === 'Pending')
  const completedDeposits = transactions.filter((transaction) => transaction.type === 'Deposit' && transaction.status === 'Completed')
  const totalDeposited = completedDeposits.reduce((sum, transaction) => sum + Math.max(0, Number(transaction.amount) || 0), 0)

  const accountsByUser = useMemo(() => {
    return accounts.reduce<Record<string, BankAccount[]>>((grouped, account) => {
      grouped[account.userId] = grouped[account.userId] ? [...grouped[account.userId], account] : [account]
      return grouped
    }, {})
  }, [accounts])

  const usersById = useMemo(() => {
    return users.reduce<Record<string, UserProfile>>((grouped, user) => {
      grouped[user.uid] = user
      return grouped
    }, {})
  }, [users])

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return true
    return [
      getDisplayName(user),
      user.email,
      user.phone,
      user.country,
      user.occupation,
    ].some((value) => value?.toLowerCase().includes(query))
  })

  const filteredTransactions = transactions.filter((transaction) => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return true
    return [
      transaction.title,
      transaction.userName,
      transaction.senderName,
      transaction.recipientName,
      transaction.recipientAccount,
      transaction.reference,
      transaction.status,
      transaction.type,
    ].some((value) => value?.toLowerCase().includes(query))
  })

  const selectedDepositAccount = accounts.find((account) => account.id === depositForm.accountId)
    ?? accounts.find((account) => account.accountNumber === depositForm.accountNumber)
  const selectedDepositUser = selectedDepositAccount ? usersById[selectedDepositAccount.userId] : null

  const runAction = async (label: string, action: () => Promise<void>) => {
    setBusy(label)
    setMessage('')
    try {
      await action()
      setMessage('Saved successfully.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to complete action.')
    } finally {
      setBusy('')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const handleStatusChange = async (uid: string, status: UserStatus) => {
    await runAction(`status-${uid}`, () => updateUserStatus(uid, status))
  }

  const handleDepositSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!selectedDepositAccount || !selectedDepositUser) {
      setMessage('Select a valid user account before depositing.')
      return
    }

    await runAction('deposit', async () => {
      await createAdminDeposit({
        user: selectedDepositUser,
        account: selectedDepositAccount,
        senderName: depositForm.senderName,
        amount: Number(depositForm.amount),
        currency: depositForm.currency,
        reference: depositForm.reference,
        dateTime: depositForm.dateTime,
      })
      setDepositForm({
        accountId: '',
        accountNumber: '',
        senderName: '',
        amount: '',
        currency: 'GBP',
        reference: '',
        dateTime: new Date().toISOString().slice(0, 16),
      })
    })
  }

  const openTransactionEditor = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setTransactionForm({
      title: transaction.title ?? '',
      amount: String(transaction.amount ?? ''),
      fee: String(transaction.fee ?? 0),
      total: String(transaction.total ?? transaction.amount ?? ''),
      currency: transaction.currency ?? 'GBP',
      status: transaction.status ?? 'Pending',
      senderName: transaction.senderName ?? '',
      recipientName: transaction.recipientName ?? '',
      recipientAccount: transaction.recipientAccount ?? '',
      reference: transaction.reference ?? '',
      dateTime: timestampToInput(transaction.createdAt),
    })
  }

  const handleTransactionSave = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!editingTransaction) return

    await runAction('edit-transaction', async () => {
      await updateTransaction(editingTransaction.id, {
        title: transactionForm.title,
        amount: Number(transactionForm.amount),
        fee: Number(transactionForm.fee),
        total: Number(transactionForm.total),
        currency: transactionForm.currency,
        status: transactionForm.status as Transaction['status'],
        senderName: transactionForm.senderName,
        recipientName: transactionForm.recipientName,
        recipientAccount: transactionForm.recipientAccount,
        reference: transactionForm.reference,
        createdAtInput: transactionForm.dateTime,
      })
      setEditingTransaction(null)
    })
  }

  const statCards = [
    { icon: Users, label: 'Registered Users', value: String(users.length), tone: 'bg-[#E5F4EF] text-[#006A4D]' },
    { icon: UserCheck, label: 'Active Users', value: String(activeUsers), tone: 'bg-emerald-100 text-emerald-700' },
    { icon: UserX, label: 'Suspended Users', value: String(suspendedUsers), tone: 'bg-red-100 text-red-700' },
    { icon: Clock, label: 'Pending Transfers', value: String(pendingTransactions.length), tone: 'bg-amber-100 text-amber-700' },
  ]

  return (
    <div className="min-h-screen bg-[#F4FAF7] text-[#1A1A1A]">
      <header className="sticky top-0 z-50 bg-white border-b border-[#D9E8E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between min-h-16 py-3 gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-[#F4FAF7] text-[#667A73] transition-colors"
                title="Toggle Menu"
              >
                <Menu size={24} />
              </button>
              <div>
                <p className="text-xs uppercase tracking-wide text-[#667A73]">Admin Dashboard</p>
                <h1 className="text-lg font-bold text-[#006A4D]">Seagate Metal</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative w-10 h-10 rounded-lg hover:bg-[#F4FAF7] flex items-center justify-center transition" title="Notifications">
                <Bell size={20} className="text-[#667A73]" />
                {pendingTransactions.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full" />}
              </button>
              <button
                onClick={handleLogout}
                className="w-10 h-10 rounded-lg hover:bg-[#F4FAF7] flex items-center justify-center transition"
                title="Logout"
              >
                <LogOut size={18} className="text-[#667A73]" />
              </button>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2 overflow-x-auto pb-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  activeTab === item.id
                    ? 'bg-[#006A4D] text-white'
                    : 'text-[#4E655D] hover:bg-[#E5F4EF]'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Menu (Mobile and Tablet only) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer Content */}
          <div className="relative flex flex-col w-4/5 max-w-xs bg-white h-full shadow-2xl p-6 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#667A73]">Admin Portal</p>
                <h2 className="text-base font-bold text-[#006A4D]">Menu</h2>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-[#F4FAF7] text-[#667A73]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav items */}
            <div className="flex-1 py-6 space-y-2">
              {navItems.map((item) => {
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setMobileMenuOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-semibold transition ${
                      isActive
                        ? 'bg-[#006A4D] text-white'
                        : 'text-[#4E655D] hover:bg-[#E5F4EF]'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                )
              })}
            </div>

            {/* Logout button */}
            <div className="pt-6 border-t border-gray-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleLogout()
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {message && (
          <div className="mb-5 rounded-lg border border-[#B7D4C9] bg-white px-4 py-3 text-sm text-[#006A4D]">
            {message}
          </div>
        )}

        {(activeTab === 'users' || activeTab === 'transactions') && (
          <div className="mb-5 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8AA097]" size={18} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={activeTab === 'users' ? 'Search users by name, email, phone, country...' : 'Search transactions...'}
              className="w-full rounded-lg border border-[#CFE2DA] bg-white py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#006A4D]"
            />
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat) => (
                <div key={stat.label} className="bg-white rounded-lg p-5 border border-[#D9E8E1] shadow-sm">
                  <div className={`w-10 h-10 rounded-lg ${stat.tone} flex items-center justify-center mb-4`}>
                    <stat.icon size={20} />
                  </div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-[#667A73] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-white rounded-lg border border-[#D9E8E1] shadow-sm p-5">
                <h2 className="font-bold mb-4">Pending Transfers</h2>
                <TransactionList
                  transactions={pendingTransactions.slice(0, 5)}
                  onApprove={(transaction) => runAction(`approve-${transaction.id}`, () => approveTransaction(transaction))}
                  onDecline={(transaction) => runAction(`decline-${transaction.id}`, () => declineTransaction(transaction.id))}
                  onEdit={openTransactionEditor}
                  busy={busy}
                />
              </div>

              <div className="bg-white rounded-lg border border-[#D9E8E1] shadow-sm p-5">
                <h2 className="font-bold mb-4">Deposit Summary</h2>
                <div className="rounded-lg bg-[#E5F4EF] p-5">
                  <p className="text-sm text-[#4E655D]">Total completed deposits</p>
                  <p className="text-3xl font-bold text-[#006A4D] mt-2">{formatCurrency(totalDeposited)}</p>
                  <p className="text-xs text-[#667A73] mt-2">{completedDeposits.length} deposit transactions</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.8fr] gap-5">
            <div className="bg-white rounded-lg border border-[#D9E8E1] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px]">
                  <thead className="bg-[#F4FAF7]">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#667A73] uppercase">User</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#667A73] uppercase">Phone</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#667A73] uppercase">Country</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#667A73] uppercase">Balance</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#667A73] uppercase">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#667A73] uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.uid} className="border-t border-[#E6F0EC]">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#006A4D] flex items-center justify-center text-white text-sm font-bold">
                              {getInitials(user)}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{getDisplayName(user)}</p>
                              <p className="text-xs text-[#667A73]">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm">{user.phone || 'Not set'}</td>
                        <td className="px-4 py-4 text-sm">{user.country || 'Not set'}</td>
                        <td className="px-4 py-4 text-sm font-semibold text-[#006A4D]">{formatCurrency(user.balance ?? 0)}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => setSelectedUser(user)} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#E5F4EF] text-[#006A4D] text-xs font-semibold">
                              <Eye size={14} /> View
                            </button>
                            <button
                              onClick={() => handleStatusChange(user.uid, user.status === 'Suspended' ? 'Active' : 'Suspended')}
                              disabled={busy === `status-${user.uid}`}
                              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold disabled:opacity-60"
                            >
                              <Ban size={14} /> {user.status === 'Suspended' ? 'Activate' : 'Suspend'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <UserDetailPanel
              user={selectedUser}
              accounts={selectedUser ? accountsByUser[selectedUser.uid] ?? [] : []}
              transactions={selectedUser ? transactions.filter((transaction) => transaction.userId === selectedUser.uid) : []}
              onClose={() => setSelectedUser(null)}
              onReset={(user) => runAction(`reset-${user.uid}`, () => resetUserTransactions(user.uid))}
              busy={busy}
            />
          </div>
        )}

        {activeTab === 'deposits' && (
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-5">
            <form onSubmit={handleDepositSubmit} className="bg-white rounded-lg border border-[#D9E8E1] shadow-sm p-5 space-y-4">
              <div>
                <h2 className="text-xl font-bold">Deposit to User Account</h2>
                <p className="text-sm text-[#667A73] mt-1">Set sender name, date, time, amount, and reference.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4E655D] mb-2">Account Number</label>
                <input
                  value={depositForm.accountNumber}
                  onChange={(event) => {
                    const accountNumber = event.target.value
                    const matched = accounts.find((account) => account.accountNumber === accountNumber || account.id === accountNumber)
                    setDepositForm((current) => ({
                      ...current,
                      accountNumber,
                      accountId: matched?.id ?? current.accountId,
                    }))
                  }}
                  placeholder="Enter account number"
                  className="w-full rounded-lg border border-[#CFE2DA] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#006A4D]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4E655D] mb-2">Or Select Account</label>
                <select
                  value={depositForm.accountId}
                  onChange={(event) => {
                    const account = accounts.find((item) => item.id === event.target.value)
                    setDepositForm((current) => ({
                      ...current,
                      accountId: event.target.value,
                      accountNumber: account?.accountNumber ?? '',
                    }))
                  }}
                  className="w-full rounded-lg border border-[#CFE2DA] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#006A4D]"
                >
                  <option value="">Select account</option>
                  {accounts.map((account) => {
                    const owner = usersById[account.userId]
                    return (
                      <option key={account.id} value={account.id}>
                        {owner ? getDisplayName(owner) : 'Unknown user'} - {account.label} - {account.accountNumber ?? account.id}
                      </option>
                    )
                  })}
                </select>
              </div>

              {selectedDepositAccount && selectedDepositUser && (
                <div className="rounded-lg bg-[#F4FAF7] border border-[#D9E8E1] p-3 text-sm">
                  <p className="font-semibold">{getDisplayName(selectedDepositUser)}</p>
                  <p className="text-[#667A73]">{selectedDepositAccount.label} - {selectedDepositAccount.accountNumber ?? selectedDepositAccount.id}</p>
                  <p className="text-[#006A4D] font-semibold mt-1">{formatCurrency(selectedDepositAccount.balance, selectedDepositAccount.currency)}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Sender Name" value={depositForm.senderName} onChange={(value) => setDepositForm((current) => ({ ...current, senderName: value }))} required />
                <Field label="Amount" type="number" value={depositForm.amount} onChange={(value) => setDepositForm((current) => ({ ...current, amount: value }))} required />
                <Field label="Currency" value={depositForm.currency} onChange={(value) => setDepositForm((current) => ({ ...current, currency: value }))} required />
                <Field label="Date & Time" type="datetime-local" value={depositForm.dateTime} onChange={(value) => setDepositForm((current) => ({ ...current, dateTime: value }))} required />
              </div>
              <Field label="Reference" value={depositForm.reference} onChange={(value) => setDepositForm((current) => ({ ...current, reference: value }))} />

              <button disabled={busy === 'deposit'} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#006A4D] px-4 py-3 font-semibold text-white hover:bg-[#004D2A] disabled:opacity-60">
                <Save size={18} /> {busy === 'deposit' ? 'Depositing...' : 'Create Deposit'}
              </button>
            </form>

            <div className="bg-white rounded-lg border border-[#D9E8E1] shadow-sm p-5">
              <h2 className="font-bold mb-4">Recent Deposits</h2>
              <TransactionList transactions={completedDeposits.slice(0, 8)} onEdit={openTransactionEditor} busy={busy} />
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white rounded-lg border border-[#D9E8E1] shadow-sm p-5">
            <TransactionList
              transactions={filteredTransactions}
              onApprove={(transaction) => runAction(`approve-${transaction.id}`, () => approveTransaction(transaction))}
              onDecline={(transaction) => runAction(`decline-${transaction.id}`, () => declineTransaction(transaction.id))}
              onEdit={openTransactionEditor}
              busy={busy}
              expanded
            />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReportCard label="Total Users" value={String(users.length)} />
            <ReportCard label="All Transactions" value={String(transactions.length)} />
            <ReportCard label="Total Deposited" value={formatCurrency(totalDeposited)} />
          </div>
        )}
      </main>

      {editingTransaction && (
        <div className="fixed inset-0 z-[100] bg-black/40 p-4 overflow-y-auto">
          <form onSubmit={handleTransactionSave} className="mx-auto max-w-2xl bg-white rounded-lg shadow-2xl border border-[#D9E8E1] p-5 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Edit Transaction</h2>
                <p className="text-sm text-[#667A73]">Edit amount, names, status, and backdate the transaction.</p>
              </div>
              <button type="button" onClick={() => setEditingTransaction(null)} className="w-9 h-9 rounded-lg hover:bg-[#F4FAF7] flex items-center justify-center">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Title" value={transactionForm.title} onChange={(value) => setTransactionForm((current) => ({ ...current, title: value }))} />
              <Field label="Status" value={transactionForm.status} onChange={(value) => setTransactionForm((current) => ({ ...current, status: value }))} />
              <Field label="Amount" type="number" value={transactionForm.amount} onChange={(value) => setTransactionForm((current) => ({ ...current, amount: value }))} />
              <Field label="Fee" type="number" value={transactionForm.fee} onChange={(value) => setTransactionForm((current) => ({ ...current, fee: value }))} />
              <Field label="Total" type="number" value={transactionForm.total} onChange={(value) => setTransactionForm((current) => ({ ...current, total: value }))} />
              <Field label="Currency" value={transactionForm.currency} onChange={(value) => setTransactionForm((current) => ({ ...current, currency: value }))} />
              <Field label="Sender Name" value={transactionForm.senderName} onChange={(value) => setTransactionForm((current) => ({ ...current, senderName: value }))} />
              <Field label="Recipient Name" value={transactionForm.recipientName} onChange={(value) => setTransactionForm((current) => ({ ...current, recipientName: value }))} />
              <Field label="Recipient Account" value={transactionForm.recipientAccount} onChange={(value) => setTransactionForm((current) => ({ ...current, recipientAccount: value }))} />
              <Field label="Backdate / Date & Time" type="datetime-local" value={transactionForm.dateTime} onChange={(value) => setTransactionForm((current) => ({ ...current, dateTime: value }))} />
            </div>
            <Field label="Reference" value={transactionForm.reference} onChange={(value) => setTransactionForm((current) => ({ ...current, reference: value }))} />

            <button disabled={busy === 'edit-transaction'} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#006A4D] px-4 py-3 font-semibold text-white hover:bg-[#004D2A] disabled:opacity-60">
              <Save size={18} /> {busy === 'edit-transaction' ? 'Saving...' : 'Save Transaction'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-[#4E655D] mb-2">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="w-full rounded-lg border border-[#CFE2DA] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#006A4D]"
      />
    </label>
  )
}

function ReportCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg border border-[#D9E8E1] p-5 shadow-sm">
      <p className="text-sm text-[#667A73]">{label}</p>
      <p className="text-3xl font-bold text-[#006A4D] mt-2">{value}</p>
    </div>
  )
}

function TransactionList({
  transactions,
  onApprove,
  onDecline,
  onEdit,
  busy,
  expanded = false,
}: {
  transactions: Transaction[]
  onApprove?: (transaction: Transaction) => void
  onDecline?: (transaction: Transaction) => void
  onEdit: (transaction: Transaction) => void
  busy: string
  expanded?: boolean
}) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[#B7D4C9] p-5 text-sm text-[#667A73]">
        No transactions found.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="rounded-lg border border-[#D9E8E1] p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold truncate">{transaction.title}</p>
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>
              <p className="text-xs text-[#667A73] mt-1">
                {transaction.userName} - {transaction.type} - {formatDateTime(transaction.createdAt)}
              </p>
              {expanded && (
                <p className="text-xs text-[#667A73] mt-1">
                  Recipient: {transaction.recipientName || 'N/A'} {transaction.recipientAccount ? `(${transaction.recipientAccount})` : ''}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <p className={`font-bold ${transaction.amount >= 0 ? 'text-[#006A4D]' : 'text-red-700'}`}>
                {formatCurrency(transaction.amount, transaction.currency)}
              </p>
              {transaction.status === 'Pending' && onApprove && (
                <button
                  onClick={() => onApprove(transaction)}
                  disabled={busy === `approve-${transaction.id}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#E5F4EF] px-3 py-2 text-xs font-semibold text-[#006A4D] disabled:opacity-60"
                >
                  <CheckCircle size={14} /> Approve
                </button>
              )}
              {transaction.status === 'Pending' && onDecline && (
                <button
                  onClick={() => onDecline(transaction)}
                  disabled={busy === `decline-${transaction.id}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-60"
                >
                  <Ban size={14} /> Decline
                </button>
              )}
              <button
                onClick={() => onEdit(transaction)}
                className="inline-flex items-center gap-1 rounded-lg bg-[#F4FAF7] px-3 py-2 text-xs font-semibold text-[#4E655D]"
              >
                <Eye size={14} /> Edit
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function UserDetailPanel({
  user,
  accounts,
  transactions,
  onClose,
  onReset,
  busy,
}: {
  user: UserProfile | null
  accounts: BankAccount[]
  transactions: Transaction[]
  onClose: () => void
  onReset: (user: UserProfile) => void
  busy: string
}) {
  if (!user) {
    return (
      <div className="bg-white rounded-lg border border-[#D9E8E1] shadow-sm p-5 text-sm text-[#667A73]">
        Select a user to view signup information, accounts, and transaction tools.
      </div>
    )
  }

  const fields = [
    ['Full Name', getDisplayName(user)],
    ['Email', user.email],
    ['Phone', user.phone],
    ['SSN / National Insurance', user.ssn],
    ['Address', user.address],
    ['Country', user.country],
    ['Gender', user.gender],
    ['Occupation', user.occupation],
    ['Monthly Salary', user.monthlySalary],
    ['Source of Income', user.sourceOfIncome],
    ['Created', formatDateTime(user.createdAt)],
    ['Last Login', user.lastLoginAt ? formatDateTime(user.lastLoginAt) : 'Never'],
  ]

  return (
    <div className="bg-white rounded-lg border border-[#D9E8E1] shadow-sm p-5 h-fit">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-[#006A4D] text-white flex items-center justify-center font-bold">
            {getInitials(user)}
          </div>
          <div>
            <h2 className="font-bold">{getDisplayName(user)}</h2>
            <p className="text-xs text-[#667A73]">{user.email}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-lg hover:bg-[#F4FAF7] flex items-center justify-center">
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {fields.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-[#F4FAF7] border border-[#D9E8E1] p-3">
            <p className="text-xs text-[#667A73]">{label}</p>
            <p className="font-medium break-words">{value || 'Not set'}</p>
          </div>
        ))}
      </div>

      <h3 className="font-bold mt-5 mb-3">Accounts</h3>
      <div className="space-y-2">
        {accounts.map((account) => (
          <div key={account.id} className="rounded-lg border border-[#D9E8E1] p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-sm">{account.label}</p>
                <p className="text-xs text-[#667A73]">{account.accountNumber ?? account.id}</p>
              </div>
              <p className="font-bold text-[#006A4D]">{formatCurrency(account.balance, account.currency)}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onReset(user)}
        disabled={busy === `reset-${user.uid}`}
        className="mt-5 w-full rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
      >
        {busy === `reset-${user.uid}` ? 'Resetting...' : `Reset ${transactions.length} Transactions`}
      </button>
    </div>
  )
}
