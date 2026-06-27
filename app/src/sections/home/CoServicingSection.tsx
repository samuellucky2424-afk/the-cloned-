import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function CoServicingSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="section-padding bg-white" ref={sectionRef} style={{ opacity: 0 }}>
      <div className="container-korvantis space-y-6">
        {/* Green Banner */}
        <div className="bg-[#006A4D] rounded-lg p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Making banking easier
          </h2>
          <p className="text-white/80 mb-6 max-w-2xl leading-relaxed">
            We're introducing more ways you can manage your Korvantis Imperial Bank accounts and eligible partner accounts in one place, using co-servicing.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-white font-semibold hover:underline"
          >
            Co-servicing
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cash Machines */}
          <div className="bg-[#F7F7F5] rounded-lg p-8">
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">
              Banking, made easier - right where you are
            </h3>
            <p className="text-sm text-[#595959] mb-4 leading-relaxed">
              Our new Cash In & Out machines are landing in local communities, giving you 24/7 access to pay in or withdraw cash. No queues. No opening hours. Just quick, easy banking whenever it suits you.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#006A4D] hover:underline"
            >
              Find the nearest machines
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Support */}
          <div className="bg-[#F7F7F5] rounded-lg p-8">
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">
              How we can support you
            </h3>
            <p className="text-sm text-[#595959] mb-4 leading-relaxed">
              Learn how we are making it easier to bank with us. Find out about the different kinds of accessibility support we provide, and how to get in touch.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#006A4D] hover:underline"
            >
              How we can support you
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
