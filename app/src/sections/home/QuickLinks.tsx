import { Link } from 'react-router-dom'
import { Calculator, Heart, Shield, ChevronRight } from 'lucide-react'

const quickLinks = [
  {
    icon: Calculator,
    label: 'Business Loan Calculator',
    href: '#',
  },
  {
    icon: Heart,
    label: 'Help with money worries',
    href: '#',
  },
  {
    icon: Shield,
    label: 'Protecting yourself from fraud',
    href: '#',
  },
]

export default function QuickLinks() {
  return (
    <section className="bg-[#F2F2F2]">
      <div className="container-korvantis">
        <div className="grid grid-cols-1 sm:grid-cols-3">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className="group flex items-center justify-between px-6 py-5 border-b sm:border-b-0 sm:border-r border-gray-300 last:border-r-0 hover:bg-white transition-colors duration-300"
            >
              <div className="flex items-center gap-4">
                <link.icon size={24} className="text-[#006A4D]" />
                <span className="font-medium text-[#1A1A1A] text-sm">{link.label}</span>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:text-[#006A4D] group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
