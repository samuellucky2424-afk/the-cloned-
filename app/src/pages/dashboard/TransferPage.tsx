import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Send, Globe, Receipt, ChevronRight,
  Check, AlertCircle, User, Building2, Landmark,
  CreditCard, DollarSign, ArrowRight
} from 'lucide-react'
import { useAuth } from '../../hooks/AuthContext'
import {
  createTransfer,
  formatCurrency,
  subscribeUserAccounts,
  type BankAccount,
  type TransferType,
} from '../../lib/banking'
import { requestTransactionOtp, verifyTransactionOtp } from '../../lib/otp'

type TransferStep = 'form' | 'confirm' | 'otp' | 'receipt'

interface TransferData {
  fromAccount: string
  recipientName: string
  recipientAccount: string
  recipientAddress: string
  recipientCountry: string
  recipientPhone: string
  sortCode: string
  bankName: string
  amount: string
  currency: string
  reference: string
  billType?: string
  billAccount?: string
}

const transferTypes = [
  {
    id: 'domestic' as TransferType,
    label: 'Domestic',
    title: 'Domestic transfer',
    description: 'Send money to a US account',
    icon: Send,
  },
  {
    id: 'international' as TransferType,
    label: 'International',
    title: 'International transfer',
    description: 'Send money with IBAN or SWIFT details',
    icon: Globe,
  },
  {
    id: 'bills' as TransferType,
    label: 'Pay Bills',
    title: 'Pay bills',
    description: 'Pay utilities, phone, tax, and cards',
    icon: Receipt,
  },
]

const billTypes = [
  { id: 'electric', label: 'Electricity' },
  { id: 'gas', label: 'Gas' },
  { id: 'water', label: 'Water' },
  { id: 'internet', label: 'Internet/Broadband' },
  { id: 'council', label: 'Council Tax' },
  { id: 'phone', label: 'Phone/Mobile' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'credit', label: 'Credit Card' },
]

function createEmptyTransferData(fromAccount = ''): TransferData {
  return {
    fromAccount,
    recipientName: '',
    recipientAccount: '',
    recipientAddress: '',
    recipientCountry: '',
    recipientPhone: '',
    sortCode: '',
    bankName: '',
    amount: '',
    currency: 'USD',
    reference: '',
    billType: '',
    billAccount: '',
  }
}

export default function TransferPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState<TransferType>('domestic')
  const [step, setStep] = useState<TransferStep>('form')
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [transactionId, setTransactionId] = useState('')
  const [processing, setProcessing] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [challengeId, setChallengeId] = useState<string | undefined>()
  const [resendMessage, setResendMessage] = useState('')
  const [transferData, setTransferData] = useState<TransferData>(createEmptyTransferData())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [otpError, setOtpError] = useState('')
  const [otpSuccess, setOtpSuccess] = useState(false)
  const [showSuspendedModal, setShowSuspendedModal] = useState(false)

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab')
    if (tab === 'international' || tab === 'bills' || tab === 'domestic') {
      setActiveTab(tab)
    }
  }, [location.search])

  useEffect(() => {
    if (!profile) return
    return subscribeUserAccounts(profile.uid, setAccounts)
  }, [profile])

  useEffect(() => {
    if (!transferData.fromAccount && accounts[0]) {
      setTransferData((current) => ({ ...current, fromAccount: accounts[0].id }))
    }
  }, [accounts, transferData.fromAccount])

  const selectedAccount = accounts.find((account) => account.id === transferData.fromAccount)
  const selectedTab = new URLSearchParams(location.search).get('tab')
  const hasSelectedTransferType = selectedTab === 'international' || selectedTab === 'bills' || selectedTab === 'domestic'
  const selectedType = transferTypes.find((type) => type.id === activeTab) ?? transferTypes[0]
  const selectedBillType = billTypes.find((bill) => bill.id === transferData.billType)
  const amountNumber = Number(transferData.amount || 0)
  const feeNumber = activeTab === 'international' ? Number((amountNumber * 0.015).toFixed(2)) : 0
  const totalNumber = Number((amountNumber + feeNumber).toFixed(2))
  const recipientAccountValue = activeTab === 'bills'
    ? transferData.billAccount ?? ''
    : transferData.recipientAccount

  const handleTransferTypeChange = (type: TransferType) => {
    setActiveTab(type)
    setStep('form')
    setErrors({})
    setOtpError('')
    setTransferData((current) => ({
      ...createEmptyTransferData(current.fromAccount),
      currency: type === 'international' ? current.currency : 'USD',
    }))
    navigate(`/transfer?tab=${type}`, { replace: true })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTransferData(prev => ({ ...prev, [name]: value }))
    if (errors[name] || errors.form) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[name]
        delete next.form
        return next
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!selectedAccount) newErrors.fromAccount = 'Select an account'
    if (!transferData.recipientName.trim()) {
      newErrors.recipientName = activeTab === 'bills' ? 'Payee or company name is required' : 'Recipient name is required'
    }

    if (activeTab === 'domestic') {
      if (!transferData.recipientAccount.trim()) newErrors.recipientAccount = 'Account number is required'
      if (!transferData.sortCode.trim()) newErrors.sortCode = 'Routing number is required'
    }

    if (activeTab === 'international') {
      if (!transferData.recipientAccount.trim()) newErrors.recipientAccount = 'IBAN or account number is required'
      if (!transferData.recipientAddress.trim()) newErrors.recipientAddress = 'Recipient address is required'
      if (!transferData.recipientCountry.trim()) newErrors.recipientCountry = 'Destination country is required'
      if (!transferData.recipientPhone.trim()) newErrors.recipientPhone = 'Destination phone number is required'
      if (!transferData.bankName.trim()) newErrors.bankName = 'Bank name and SWIFT/BIC are required'
    }

    if (activeTab === 'bills') {
      if (!transferData.billType) newErrors.billType = 'Select a bill type'
      if (!transferData.billAccount?.trim()) newErrors.billAccount = 'Account, policy, or customer number is required'
    }

    if (!transferData.amount || amountNumber <= 0) newErrors.amount = 'Enter a valid amount'
    if (selectedAccount && amountNumber > 0 && selectedAccount.balance < totalNumber) newErrors.amount = 'Insufficient funds'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (validateForm()) setStep('confirm')
  }

  const handleConfirm = async () => {
    if (!profile || !selectedAccount) {
      setOtpError('Unable to find your account. Please go back and try again.')
      return
    }

    if (profile.status === 'Suspended') {
      setShowSuspendedModal(true)
      return
    }

    setSendingOtp(true)
    setOtpError('')
    setResendMessage('')

    try {
      const payload = {
        email: profile.email,
        fullName: `${profile.firstName} ${profile.lastName}`,
        transaction: {
          transferType: activeTab,
          amount: amountNumber,
          currency: transferData.currency,
          recipientName: transferData.recipientName,
          recipientAccount: recipientAccountValue,
        },
        forceResend: true,
      }

      const result = await requestTransactionOtp(payload)
      setChallengeId(result.challengeId)
      setStep('otp')
      setResendMessage(result.message ?? 'OTP sent to your email.')
    } catch (error) {
      setOtpError(error instanceof Error ? error.message : 'Unable to send OTP. Please try again.')
    } finally {
      setSendingOtp(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setOtpError('')
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleOtpSubmit = async () => {
    const code = otp.join('')
    if (code.length !== 6) {
      setOtpError('Please enter the 6-digit OTP')
      return
    }
    if (!profile || !selectedAccount) {
      setOtpError('Unable to find your account. Please go back and try again.')
      return
    }

    setProcessing(true)
    setOtpSuccess(true)
    setOtpError('')

    try {
      await verifyTransactionOtp(code, challengeId)
      const id = await createTransfer(profile, selectedAccount, {
        transferType: activeTab,
        fromAccountId: selectedAccount.id,
        recipientName: transferData.recipientName,
        recipientAccount: recipientAccountValue,
        recipientAddress: activeTab === 'international' ? transferData.recipientAddress : '',
        recipientCountry: activeTab === 'international' ? transferData.recipientCountry : '',
        recipientPhone: activeTab === 'international' ? transferData.recipientPhone : '',
        sortCode: activeTab === 'domestic' ? transferData.sortCode : '',
        bankName: activeTab === 'bills' ? selectedBillType?.label ?? transferData.recipientName : transferData.bankName,
        amount: amountNumber,
        currency: transferData.currency,
        reference: transferData.reference,
        billType: transferData.billType,
        billAccount: transferData.billAccount,
      })
      setTransactionId(id)
      setStep('receipt')
    } catch (error) {
      setOtpSuccess(false)
      setOtpError(error instanceof Error ? error.message : 'Unable to complete transfer.')
    } finally {
      setProcessing(false)
    }
  }

  const startNewTransfer = () => {
    setStep('form')
    setOtp(['', '', '', '', '', ''])
    setOtpError('')
    setOtpSuccess(false)
    setTransactionId('')
    setTransferData(createEmptyTransferData(accounts[0]?.id ?? ''))
    navigate('/transfer')
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4D] focus:border-transparent text-[#1A1A1A] placeholder-[#8AA097] transition-all ${
      errors[field] ? 'border-red-500' : 'border-[#CFE2DA]'
    }`

  const renderAccountSelect = () => (
    <div>
      <label className="block text-sm font-medium text-[#4E655D] mb-2">From Account</label>
      <select name="fromAccount" value={transferData.fromAccount} onChange={handleChange}
        className={inputClass('fromAccount')}>
        <option value="">Select account</option>
        {accounts.map(a => (
          <option key={a.id} value={a.id}>{a.label} - {formatCurrency(a.balance, a.currency)}</option>
        ))}
      </select>
      {errors.fromAccount && <p className="text-red-600 text-xs mt-1">{errors.fromAccount}</p>}
    </div>
  )

  const renderAmountFields = () => (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-[#4E655D] mb-2">Amount</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8AA097]" size={18} />
          <input type="number" name="amount" value={transferData.amount} onChange={handleChange}
            placeholder="0.00" className={`${inputClass('amount')} pl-10`} />
        </div>
        {errors.amount && <p className="text-red-600 text-xs mt-1">{errors.amount}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-[#4E655D] mb-2">Currency</label>
        <select name="currency" value={transferData.currency} onChange={handleChange}
          className={inputClass('currency')}>
          <option value="USD">USD ($)</option>
        </select>
      </div>
    </div>
  )

  const renderReferenceField = () => (
    <div>
      <label className="block text-sm font-medium text-[#4E655D] mb-2">Reference</label>
      <input type="text" name="reference" value={transferData.reference} onChange={handleChange}
        placeholder="Optional payment reference"
        className={inputClass('reference')} />
    </div>
  )

  const renderSubmitButton = () => (
    <button type="submit"
      className="w-full py-4 bg-[#006A4D] text-white font-semibold rounded-lg hover:bg-[#004D2A] transition flex items-center justify-center gap-2 mt-2">
      Continue
      <ChevronRight size={18} />
    </button>
  )

  const renderDomesticForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-[#1A1A1A]">Domestic transfer form</h2>
        <p className="text-sm text-[#667A73] mt-1">Use US account number and routing number details.</p>
      </div>
      {renderAccountSelect()}
      <div>
        <label className="block text-sm font-medium text-[#4E655D] mb-2">Recipient Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8AA097]" size={18} />
          <input type="text" name="recipientName" value={transferData.recipientName} onChange={handleChange}
            placeholder="e.g. John Smith" className={`${inputClass('recipientName')} pl-10`} />
        </div>
        {errors.recipientName && <p className="text-red-600 text-xs mt-1">{errors.recipientName}</p>}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-[#4E655D] mb-2">Account Number</label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8AA097]" size={18} />
            <input type="text" name="recipientAccount" value={transferData.recipientAccount} onChange={handleChange}
              placeholder="12345678" className={`${inputClass('recipientAccount')} pl-10`} />
          </div>
          {errors.recipientAccount && <p className="text-red-600 text-xs mt-1">{errors.recipientAccount}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#4E655D] mb-2">Routing Number</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8AA097]" size={18} />
            <input type="text" name="sortCode" value={transferData.sortCode} onChange={handleChange}
              placeholder="021000021" className={`${inputClass('sortCode')} pl-10`} />
          </div>
          {errors.sortCode && <p className="text-red-600 text-xs mt-1">{errors.sortCode}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#4E655D] mb-2">Bank Name</label>
        <div className="relative">
          <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8AA097]" size={18} />
          <input type="text" name="bankName" value={transferData.bankName} onChange={handleChange}
            placeholder="Optional" className={`${inputClass('bankName')} pl-10`} />
        </div>
      </div>
      {renderAmountFields()}
      {renderReferenceField()}
      {renderSubmitButton()}
    </form>
  )

  const renderInternationalForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-[#1A1A1A]">International transfer form</h2>
        <p className="text-sm text-[#667A73] mt-1">Use IBAN or overseas account details plus SWIFT/BIC.</p>
      </div>
      {renderAccountSelect()}
      <div>
        <label className="block text-sm font-medium text-[#4E655D] mb-2">Recipient Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8AA097]" size={18} />
          <input type="text" name="recipientName" value={transferData.recipientName} onChange={handleChange}
            placeholder="e.g. Maria Garcia" className={`${inputClass('recipientName')} pl-10`} />
        </div>
        {errors.recipientName && <p className="text-red-600 text-xs mt-1">{errors.recipientName}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-[#4E655D] mb-2">IBAN / Account Number</label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8AA097]" size={18} />
          <input type="text" name="recipientAccount" value={transferData.recipientAccount} onChange={handleChange}
            placeholder="GB29 NWBK 6016 1331 9268 19" className={`${inputClass('recipientAccount')} pl-10`} />
        </div>
        {errors.recipientAccount && <p className="text-red-600 text-xs mt-1">{errors.recipientAccount}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-[#4E655D] mb-2">Recipient Address</label>
        <input type="text" name="recipientAddress" value={transferData.recipientAddress} onChange={handleChange}
          placeholder="Street address, city, postal code"
          className={inputClass('recipientAddress')} />
        {errors.recipientAddress && <p className="text-red-600 text-xs mt-1">{errors.recipientAddress}</p>}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-[#4E655D] mb-2">Destination Country</label>
          <input type="text" name="recipientCountry" value={transferData.recipientCountry} onChange={handleChange}
            placeholder="e.g. United States"
            className={inputClass('recipientCountry')} />
          {errors.recipientCountry && <p className="text-red-600 text-xs mt-1">{errors.recipientCountry}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#4E655D] mb-2">Destination Phone Number</label>
          <input type="tel" name="recipientPhone" value={transferData.recipientPhone} onChange={handleChange}
            placeholder="+1 555 0100"
            className={inputClass('recipientPhone')} />
          {errors.recipientPhone && <p className="text-red-600 text-xs mt-1">{errors.recipientPhone}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#4E655D] mb-2">Bank Name & SWIFT/BIC</label>
        <div className="relative">
          <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8AA097]" size={18} />
          <input type="text" name="bankName" value={transferData.bankName} onChange={handleChange}
            placeholder="Bank of America - BOFAUS3N" className={`${inputClass('bankName')} pl-10`} />
        </div>
        {errors.bankName && <p className="text-red-600 text-xs mt-1">{errors.bankName}</p>}
      </div>
      {renderAmountFields()}
      {renderReferenceField()}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <AlertCircle size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">International transfers include a 1.5% fee. Recipient banks may apply their own charges.</p>
      </div>
      {renderSubmitButton()}
    </form>
  )

  const renderBillsForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-[#1A1A1A]">Pay bills form</h2>
        <p className="text-sm text-[#667A73] mt-1">Pay utilities, council tax, phone, insurance, and credit cards.</p>
      </div>
      {renderAccountSelect()}
      <div>
        <label className="block text-sm font-medium text-[#4E655D] mb-2">Bill Type</label>
        <select name="billType" value={transferData.billType} onChange={handleChange}
          className={inputClass('billType')}>
          <option value="">Select bill type</option>
          {billTypes.map(b => (
            <option key={b.id} value={b.id}>{b.label}</option>
          ))}
        </select>
        {errors.billType && <p className="text-red-600 text-xs mt-1">{errors.billType}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-[#4E655D] mb-2">Payee / Company Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8AA097]" size={18} />
          <input type="text" name="recipientName" value={transferData.recipientName} onChange={handleChange}
            placeholder="e.g. British Gas" className={`${inputClass('recipientName')} pl-10`} />
        </div>
        {errors.recipientName && <p className="text-red-600 text-xs mt-1">{errors.recipientName}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-[#4E655D] mb-2">Account / Policy / Customer Number</label>
        <input type="text" name="billAccount" value={transferData.billAccount} onChange={handleChange}
          placeholder="Enter your provider reference number"
          className={inputClass('billAccount')} />
        {errors.billAccount && <p className="text-red-600 text-xs mt-1">{errors.billAccount}</p>}
      </div>
      {renderAmountFields()}
      {renderReferenceField()}
      {renderSubmitButton()}
    </form>
  )

  const renderActiveForm = () => {
    if (activeTab === 'international') return renderInternationalForm()
    if (activeTab === 'bills') return renderBillsForm()
    return renderDomesticForm()
  }

  return (
    <div className="min-h-screen bg-[#F4FAF7] text-[#1A1A1A]">
      <header className="bg-[#006A4D] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (step === 'form' && hasSelectedTransferType) navigate('/transfer')
                else if (step === 'form') navigate('/dashboard')
                else if (step === 'confirm') setStep('form')
                else if (step === 'otp') setStep('confirm')
                else if (step === 'receipt') navigate('/dashboard')
              }}
              className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold">
                {step === 'form' && (hasSelectedTransferType ? selectedType.title : 'Choose payment type')}
                {step === 'confirm' && 'Confirm payment'}
                {step === 'otp' && 'Verify payment'}
                {step === 'receipt' && 'Payment receipt'}
              </h1>
              <p className="text-sm text-white/70">
                {step === 'form' && (hasSelectedTransferType ? selectedType.description : 'Select domestic, international, or pay bills')}
                {step === 'confirm' && 'Review the details before confirming'}
                {step === 'otp' && 'Enter the 6-digit code sent to your email'}
                {step === 'receipt' && 'Transaction submitted for review'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-12">
        {step !== 'receipt' && hasSelectedTransferType && (
          <div className="rounded-lg bg-white border border-[#D9E8E1] p-4 mb-5">
            <div className="grid grid-cols-3 gap-2">
              {['form', 'confirm', 'otp'].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    step === s ? 'bg-[#006A4D] text-white' :
                    (s === 'form' && (step === 'confirm' || step === 'otp')) ||
                    (s === 'confirm' && step === 'otp') ? 'bg-[#E5F4EF] text-[#006A4D]' :
                    'bg-[#EEF5F2] text-[#8AA097]'
                  }`}>
                    {(s === 'form' && (step === 'confirm' || step === 'otp')) ||
                     (s === 'confirm' && step === 'otp') ? <Check size={16} /> : i + 1}
                  </div>
                  <div className={`hidden sm:block flex-1 h-0.5 rounded ${
                    (s === 'form' && (step === 'confirm' || step === 'otp')) ||
                    (s === 'confirm' && step === 'otp') ? 'bg-[#006A4D]' : 'bg-[#D9E8E1]'
                  }`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'form' && !hasSelectedTransferType && (
          <div className="max-w-3xl mx-auto">
            <div className="grid gap-4 md:grid-cols-3">
              {transferTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTransferTypeChange(type.id)}
                  className="rounded-lg border border-[#D9E8E1] bg-white p-5 text-left hover:border-[#006A4D] hover:bg-[#F4FAF7] transition shadow-sm"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#006A4D] text-white flex items-center justify-center mb-4">
                    <type.icon size={22} />
                  </div>
                  <p className="font-semibold">{type.label}</p>
                  <p className="text-sm text-[#667A73] mt-2">{type.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'form' && hasSelectedTransferType && (
          <div className="max-w-3xl mx-auto">
            <button
              type="button"
              onClick={() => navigate('/transfer')}
              className="mb-4 text-sm font-semibold text-[#006A4D] hover:underline"
            >
              Change payment type
            </button>
            <div className="rounded-lg bg-white border border-[#D9E8E1] shadow-sm p-5">
              {renderActiveForm()}
            </div>
          </div>
        )}

        {step === 'confirm' && selectedAccount && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-white border border-[#D9E8E1] rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#E6F0EC]">
                <span className="text-sm text-[#667A73]">Payment Type</span>
                <span className="text-sm font-medium flex items-center gap-2 text-[#006A4D]">
                  {activeTab === 'domestic' && <Send size={14} />}
                  {activeTab === 'international' && <Globe size={14} />}
                  {activeTab === 'bills' && <Receipt size={14} />}
                  {selectedType.label}
                </span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E6F0EC]">
                <span className="text-sm text-[#667A73]">From</span>
                <span className="text-sm font-medium">{selectedAccount.label}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E6F0EC] gap-4">
                <span className="text-sm text-[#667A73]">To</span>
                <div className="text-right">
                  <p className="text-sm font-medium">{transferData.recipientName}</p>
                  <p className="text-xs text-[#667A73]">{recipientAccountValue}</p>
                  {activeTab === 'bills' && selectedBillType && <p className="text-xs text-[#667A73]">{selectedBillType.label}</p>}
                  {transferData.sortCode && <p className="text-xs text-[#667A73]">Sort: {transferData.sortCode}</p>}
                  {activeTab === 'international' && transferData.recipientCountry && (
                    <p className="text-xs text-[#667A73]">{transferData.recipientCountry}</p>
                  )}
                  {activeTab === 'international' && transferData.recipientPhone && (
                    <p className="text-xs text-[#667A73]">{transferData.recipientPhone}</p>
                  )}
                </div>
              </div>
              {activeTab === 'international' && transferData.recipientAddress && (
                <div className="flex items-center justify-between pb-4 border-b border-[#E6F0EC] gap-4">
                  <span className="text-sm text-[#667A73]">Recipient Address</span>
                  <span className="text-sm font-medium text-right">{transferData.recipientAddress}</span>
                </div>
              )}
              <div className="flex items-center justify-between pb-4 border-b border-[#E6F0EC]">
                <span className="text-sm text-[#667A73]">Amount</span>
                <span className="text-lg font-bold text-[#006A4D]">{formatCurrency(amountNumber, transferData.currency)}</span>
              </div>
              {activeTab === 'international' && (
                <>
                  <div className="flex items-center justify-between pb-4 border-b border-[#E6F0EC]">
                    <span className="text-sm text-[#667A73]">Transfer Fee (1.5%)</span>
                    <span className="text-sm text-amber-700">{formatCurrency(feeNumber, transferData.currency)}</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#E6F0EC]">
                    <span className="text-sm text-[#667A73] font-medium">Total</span>
                    <span className="text-lg font-bold">{formatCurrency(totalNumber, transferData.currency)}</span>
                  </div>
                </>
              )}
              {transferData.reference && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#667A73]">Reference</span>
                  <span className="text-sm font-medium">{transferData.reference}</span>
                </div>
              )}
            </div>

            <div className="flex items-start gap-3 p-4 bg-[#E5F4EF] border border-[#B7D4C9] rounded-lg">
              <Check size={18} className="text-[#006A4D] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#4E655D]">Review all details carefully. Payments cannot be reversed once confirmed.</p>
            </div>

            {otpError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 text-center font-medium">
                {otpError}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep('form')} disabled={sendingOtp}
                className="flex-1 py-4 bg-white border border-[#D9E8E1] text-[#4E655D] font-semibold rounded-lg hover:bg-[#F4FAF7] transition disabled:opacity-60 disabled:cursor-not-allowed">
                Edit
              </button>
              <button onClick={handleConfirm} disabled={sendingOtp}
                className="flex-1 py-4 bg-[#006A4D] text-white font-semibold rounded-lg hover:bg-[#004D2A] transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {sendingOtp ? 'Sending...' : 'Confirm & Send'}
                <Send size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 'otp' && (
          <div className="max-w-xl mx-auto bg-white border border-[#D9E8E1] rounded-lg p-5">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#E5F4EF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-[#006A4D]" />
              </div>
              <h2 className="text-xl font-bold mb-2">Verify Your Identity</h2>
              <p className="text-sm text-[#667A73]">
                We've sent a 6-digit verification code to the email address on file.
              </p>
            </div>

            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className={`w-11 h-14 bg-white border-2 rounded-lg text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#006A4D] transition-all ${
                    otpError ? 'border-red-500' : digit ? 'border-[#006A4D]' : 'border-[#CFE2DA]'
                  }`}
                />
              ))}
            </div>

            {otpError && <p className="text-red-600 text-sm text-center mb-4">{otpError}</p>}
            {otpSuccess && <p className="text-[#006A4D] text-sm text-center mb-4">OTP verified. Submitting payment for approval...</p>}

            <button onClick={handleOtpSubmit} disabled={processing}
              className="w-full py-4 bg-[#006A4D] text-white font-semibold rounded-lg hover:bg-[#004D2A] transition mb-4 disabled:opacity-60 disabled:cursor-not-allowed">
              {processing ? 'Submitting...' : 'Verify & Submit'}
            </button>

            <p className="text-center text-sm text-[#667A73]">
              Didn't receive code?{' '}
              <button
                type="button"
                onClick={async () => {
                  if (sendingOtp) return
                  setOtpError('')
                  setResendMessage('')
                  try {
                    setSendingOtp(true)
                    const payload = {
                      email: profile?.email ?? '',
                      fullName: profile ? `${profile.firstName} ${profile.lastName}` : '',
                      transaction: {
                        transferType: activeTab,
                        amount: amountNumber,
                        currency: transferData.currency,
                        recipientName: transferData.recipientName,
                        recipientAccount: recipientAccountValue,
                      },
                      forceResend: true,
                    }
                    const result = await requestTransactionOtp(payload)
                    setChallengeId(result.challengeId)
                    setResendMessage(result.message ?? 'OTP resent to your email.')
                  } catch (error) {
                    setOtpError(error instanceof Error ? error.message : 'Unable to resend OTP. Please try again.')
                  } finally {
                    setSendingOtp(false)
                  }
                }}
                className="text-[#006A4D] hover:underline"
                disabled={sendingOtp}
              >
                {sendingOtp ? 'Resending...' : 'Resend'}
              </button>
            </p>
            {resendMessage && <p className="text-[#006A4D] text-sm text-center mt-2">{resendMessage}</p>}
          </div>
        )}

        {step === 'receipt' && selectedAccount && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-[#E5F4EF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={36} className="text-[#006A4D]" />
              </div>
              <h2 className="text-2xl font-bold text-[#006A4D] mb-1">Payment Submitted</h2>
              <p className="text-sm text-[#667A73]">Your transaction is pending admin approval.</p>
            </div>

            <div className="bg-white border border-[#D9E8E1] rounded-lg p-6 space-y-4 mb-6">
              <div className="text-center pb-4 border-b border-[#E6F0EC]">
                <p className="text-3xl font-bold">{formatCurrency(amountNumber, transferData.currency)}</p>
                {activeTab === 'international' && (
                  <p className="text-xs text-[#667A73] mt-1">Total with fee: {formatCurrency(totalNumber, transferData.currency)}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#667A73]">Transaction ID</span>
                <span className="text-sm font-mono">{transactionId || 'Pending'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#667A73]">Date & Time</span>
                <span className="text-sm">{new Date().toLocaleString('en-GB')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#667A73]">From</span>
                <span className="text-sm">{selectedAccount.label}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-[#667A73]">To</span>
                <span className="text-sm text-right">
                  {transferData.recipientName}<br/>
                  <span className="text-xs text-[#667A73]">{recipientAccountValue}</span>
                  {activeTab === 'international' && transferData.recipientCountry && (
                    <><br/><span className="text-xs text-[#667A73]">{transferData.recipientCountry}</span></>
                  )}
                  {activeTab === 'international' && transferData.recipientPhone && (
                    <><br/><span className="text-xs text-[#667A73]">{transferData.recipientPhone}</span></>
                  )}
                </span>
              </div>
              {activeTab === 'international' && transferData.recipientAddress && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[#667A73]">Recipient Address</span>
                  <span className="text-sm text-right">{transferData.recipientAddress}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#667A73]">Status</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#E5F4EF] text-[#006A4D] text-xs font-medium rounded-full">
                  <Check size={12} /> Pending
                </span>
              </div>
              {transferData.reference && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#667A73]">Reference</span>
                  <span className="text-sm">{transferData.reference}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={startNewTransfer}
                className="flex-1 py-4 bg-white border border-[#D9E8E1] text-[#006A4D] font-semibold rounded-lg hover:bg-[#F4FAF7] transition flex items-center justify-center gap-2">
                <Send size={16} />
                New Payment
              </button>
              <button onClick={() => navigate('/dashboard')}
                className="flex-1 py-4 bg-[#006A4D] text-white font-semibold rounded-lg hover:bg-[#004D2A] transition flex items-center justify-center gap-2">
                <ArrowRight size={16} />
                Dashboard
              </button>
            </div>
          </div>
        )}
      </main>

      {showSuspendedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-[#D9E8E1] p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <AlertCircle className="text-red-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-red-700 mb-2">Account Suspended</h3>
            <p className="text-sm text-[#4E655D] mb-6 leading-relaxed">
              Your account has been suspended. Please contact the bank immediately to resolve this issue.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:consultant@seagatemetals.com?subject=Account Suspension Inquiry"
                className="w-full py-3.5 bg-[#006A4D] hover:bg-[#004D2A] text-white font-semibold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
              >
                Contact Customer Care
              </a>
              <button
                type="button"
                onClick={() => setShowSuspendedModal(false)}
                className="w-full py-3 bg-white border border-[#D9E8E1] text-[#006A4D] hover:bg-[#F4FAF7] font-semibold rounded-lg transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
