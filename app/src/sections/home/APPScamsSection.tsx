import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { AlertTriangle } from 'lucide-react'

export default function APPScamsSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="section-padding bg-[#F7F7F5]" ref={sectionRef} style={{ opacity: 0 }}>
      <div className="container-seagate">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={24} className="text-amber-500" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
            Wire Transfer and Peer-to-Peer (P2P) Payment Scams
          </h2>
        </div>

        <p className="text-sm text-[#595959] mb-6 leading-relaxed">
          Wire transfer and Peer-to-Peer (P2P) payment scams happen when someone is tricked into transferring funds directly to a fraudster's account. Information about modern fraud patterns, warning signs, and consumer protections can be found in the{' '}
          <a href="https://www.ftc.gov" target="_blank" rel="noopener noreferrer" className="text-[#006A4D] underline hover:no-underline">
            FTC's latest Consumer Protection and Fraud Reports
          </a>{' '}
          published regularly by the Federal Trade Commission.
        </p>

        <p className="text-sm text-[#595959] mb-4 leading-relaxed">
          <strong>The data shown in the report reflects nationwide fraud statistics across US financial services.</strong>
        </p>

        <p className="text-sm text-[#595959] mb-6">
          We've put together some{' '}
          <Link to="/login" className="text-[#006A4D] underline hover:no-underline">
            further security guidance
          </Link>{' '}
          to help protect your accounts.
        </p>
        </div>
      </div>
    </section>
  )
}
