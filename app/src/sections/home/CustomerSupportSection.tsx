import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'

const helpLinks = [
  'Lost or stolen card',
 'Report fraud',
  'Make a complaint',
  'Request a refund',
  'Change my address',
  'Reset my password',
  'Order a new PIN',
  'Request a PAC code',
  'Close my account',
  'See all help and guidance',
]

export default function CustomerSupportSection() {
  const [isExpanded, setIsExpanded] = useState(false)
  const sectionRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="section-padding bg-[#E6F2ED]" ref={sectionRef} style={{ opacity: 0 }}>
      <div className="container-korvantis">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] text-center mb-8">
          Customer support
        </h2>

        {/* Accordion Panel */}
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <HelpCircle size={24} className="text-[#006A4D]" />
              <div className="text-left">
                <h3 className="font-semibold text-lg text-[#1A1A1A]">Help and guidance</h3>
                <p className="text-sm text-[#595959]">Looking for help? Use the information and guides from our help and guidance hub to find what you need.</p>
              </div>
            </div>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {/* Expanded Content */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isExpanded ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {helpLinks.map((link) => (
                  <Link
                    key={link}
                    to="#"
                    className="text-sm text-[#1A1A1A] hover:text-[#006A4D] py-2 transition-colors"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
