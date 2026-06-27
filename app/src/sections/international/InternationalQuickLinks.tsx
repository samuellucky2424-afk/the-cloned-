import { Link } from 'react-router-dom'
import { Smartphone, Globe, ClipboardCheck, Lock, ChevronRight } from 'lucide-react'

const quickLinks = [
  { icon: Smartphone, label: 'Learn about our banking apps', href: '#' },
  { icon: Globe, label: 'International Private Banking', href: '#' },
  { icon: ClipboardCheck, label: 'International eligibility checker', href: '#' },
  { icon: Lock, label: 'Log in', href: '#' },
]

export default function InternationalQuickLinks() {
  return (
    <section className="bg-[#006A4D]">
      <div className="container-korvantis">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className="group flex items-center justify-between px-6 py-5 border-b sm:border-b-0 sm:border-r border-white/20 last:border-r-0 hover:bg-white/10 transition-colors duration-300"
            >
              <div className="flex items-center gap-4">
                <link.icon size={24} className="text-white" />
                <span className="font-medium text-white text-sm">{link.label}</span>
              </div>
              <ChevronRight size={18} className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
