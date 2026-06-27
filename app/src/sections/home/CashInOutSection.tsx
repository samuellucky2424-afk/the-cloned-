import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { MapPin } from 'lucide-react'

export default function CashInOutSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="bg-white" ref={sectionRef} style={{ opacity: 0 }}>
      <div className="container-korvantis pb-16">
        <div className="flex flex-col md:flex-row items-center gap-8 bg-[#F7F7F5] rounded-lg overflow-hidden">
          <div className="flex-1 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <MapPin size={24} className="text-[#006A4D]" />
              <h3 className="text-xl font-bold text-[#1A1A1A]">Banking near you</h3>
            </div>
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
          <div className="flex-1 h-64 md:h-80">
            <img
              src="/images/cash-machine.jpg"
              alt="Cash In and Out machine"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
