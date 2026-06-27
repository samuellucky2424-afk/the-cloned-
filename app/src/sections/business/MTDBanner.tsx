import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Receipt } from 'lucide-react'

export default function MTDBanner() {
  const sectionRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="section-padding bg-white" ref={sectionRef} style={{ opacity: 0 }}>
      <div className="container-korvantis">
        <div className="flex flex-col md:flex-row items-center gap-8 bg-[#E6F2ED] rounded-lg p-8 md:p-12">
          <div className="flex-shrink-0 w-16 h-16 bg-[#006A4D] rounded-lg flex items-center justify-center">
            <Receipt size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-3">
              Free Making Tax Digital software for sole traders
            </h2>
            <p className="text-sm text-[#595959] leading-relaxed mb-4">
              If your business comes under the new HMRC rules, you could get the HMRC-recognised accounting software from Korvantis Imperial Bank. Designed for{' '}
              <Link to="#" className="text-[#006A4D] underline hover:no-underline">
                Making Tax Digital for Income Tax
              </Link>{' '}
              and free with Korvantis Imperial Business Accounts.
            </p>
            <Link
              to="#"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#006A4D] hover:underline"
            >
              Open a Business Account with free software
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
