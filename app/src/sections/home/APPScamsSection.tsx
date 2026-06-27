import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { AlertTriangle } from 'lucide-react'

export default function APPScamsSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="section-padding bg-[#F7F7F5]" ref={sectionRef} style={{ opacity: 0 }}>
      <div className="container-korvantis">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={24} className="text-amber-500" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
              Authorised push payment (APP) scams rankings in 2024
            </h2>
          </div>

          <p className="text-sm text-[#595959] mb-6 leading-relaxed">
            Authorised push payment (APP) scams happen when someone is tricked into transferring money to a fraudster's bank account. Information about Korvantis Imperial Bank's performance prior to the introduction of the reimbursement requirement in October 2024 can be found in{' '}
            <a href="https://www.psr.org.uk" target="_blank" rel="noopener noreferrer" className="text-[#006A4D] underline hover:no-underline">
              PSR's latest APP Scams Performance Report (PDF, 1.13MB)
            </a>{' '}
            published in February 2026.
          </p>

          <p className="text-sm text-[#595959] mb-4 leading-relaxed">
            <strong>The data shown in the report reflects Korvantis Imperial Bank Group performance.</strong>
          </p>

          <p className="text-sm text-[#595959] mb-6">
            We've put together some{' '}
            <Link to="/login" className="text-[#006A4D] underline hover:no-underline">
              further guidance
            </Link>{' '}
            to help with any questions you may have.
          </p>
        </div>
      </div>
    </section>
  )
}
