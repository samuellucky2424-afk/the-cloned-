import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, Lock, LogOut, Mail,
  ChevronDown, ChevronUp, Clock, ShieldAlert,
  FileText, Activity
} from 'lucide-react'

const reviewSteps = [
  'Our security team is reviewing the account activity.',
  'Payments and transfers are paused until the review is complete.',
  'You may be asked to verify your identity before access is restored.',
]

export default function SuspendedPage() {
  const navigate = useNavigate()
  const [showReview, setShowReview] = useState(true)
  const [showContact, setShowContact] = useState(true)

  return (
    <div className="min-h-screen bg-[#F4FAF7] text-[#1A1A1A]">
      <header className="bg-[#006A4D] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-white flex items-center justify-center">
              <Lock size={22} className="text-[#006A4D]" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Account Suspended</h1>
              <p className="text-sm text-white/70">Security review in progress</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-12">
        <section className="rounded-lg bg-white border border-red-200 p-6 text-center shadow-sm">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={36} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Access is temporarily limited</h2>
          <p className="text-sm text-[#667A73] mb-4">
            This account has been placed under review by the security system. Transfers, bill payments, and profile changes are paused until the review is complete.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full text-red-700 text-sm font-medium">
            <Clock size={14} />
            Under Security Review
          </div>
        </section>

        <section className="mt-5 rounded-lg bg-white border border-[#D9E8E1] shadow-sm">
          <button
            type="button"
            onClick={() => setShowReview(!showReview)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert size={20} className="text-[#006A4D]" />
              <span className="font-semibold">What happens now?</span>
            </div>
            {showReview ? <ChevronUp size={18} className="text-[#667A73]" /> : <ChevronDown size={18} className="text-[#667A73]" />}
          </button>

          {showReview && (
            <div className="px-4 pb-4 space-y-3">
              {reviewSteps.map((step, index) => (
                <div key={step} className="flex items-start gap-3 rounded-lg bg-[#F4FAF7] border border-[#D9E8E1] p-3">
                  <div className="w-6 h-6 rounded-full bg-[#006A4D] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {index + 1}
                  </div>
                  <p className="text-sm text-[#4E655D]">{step}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-5 rounded-lg bg-white border border-[#D9E8E1] shadow-sm">
          <button
            type="button"
            onClick={() => setShowContact(!showContact)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-[#006A4D]" />
              <span className="font-semibold">Contact support</span>
            </div>
            {showContact ? <ChevronUp size={18} className="text-[#667A73]" /> : <ChevronDown size={18} className="text-[#667A73]" />}
          </button>

          {showContact && (
            <div className="px-4 pb-4 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[#F4FAF7] border border-[#D9E8E1] rounded-lg">
                <Mail size={18} className="text-[#006A4D] flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Email Customer Care</p>
                  <p className="text-xs text-[#667A73]">support@korvantisimperial.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#F4FAF7] border border-[#D9E8E1] rounded-lg">
                <Activity size={18} className="text-[#006A4D] flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Identity Verification</p>
                  <p className="text-xs text-[#667A73]">Use photo ID when requested by support.</p>
                </div>
              </div>
            </div>
          )}
        </section>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href="mailto:support@korvantisimperial.com?subject=Account Suspension Inquiry"
            className="flex-1 py-4 bg-[#006A4D] text-white font-semibold rounded-lg hover:bg-[#004D2A] transition flex items-center justify-center gap-2"
          >
            <Mail size={18} />
            Contact Customer Care
          </a>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex-1 py-4 bg-white border border-[#D9E8E1] text-[#006A4D] font-semibold rounded-lg hover:bg-[#F4FAF7] transition flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Back to Login
          </button>
        </div>
      </main>
    </div>
  )
}
