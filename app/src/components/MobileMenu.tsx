import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, X, HelpCircle, MapPin, Accessibility } from 'lucide-react'

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuCategory {
  title: string;
  subtitle: string;
  links: { label: string; href: string }[];
}

const menuCategories: MenuCategory[] = [
  {
    title: 'Everyday banking',
    subtitle: 'Online services & more',
    links: [
      { label: 'Mobile banking app', href: '#' },
      { label: 'Setting up our app', href: '#' },
      { label: 'Biometrics', href: '#' },
      { label: 'App notifications', href: '#' },
      { label: 'How to get online', href: '#' },
      { label: 'Log in to online banking', href: '#' },
      { label: 'Register for online banking', href: '#' },
      { label: 'Everyday banking', href: '#' },
      { label: 'Profile & settings', href: '#' },
      { label: 'Card & PIN services', href: '#' },
      { label: 'Payments & transfers', href: '#' },
      { label: 'Statements & transactions', href: '#' },
      { label: 'Banking near you', href: '#' },
    ],
  },
  {
    title: 'Help & security',
    subtitle: 'Planning ahead, fraud & more',
    links: [
      { label: 'Protecting yourself from fraud', href: '#' },
      { label: 'Money management', href: '#' },
      { label: 'Life events', href: '#' },
      { label: 'Help and support', href: '#' },
      { label: 'Service status', href: '#' },
    ],
  },
  {
    title: 'Current accounts',
    subtitle: 'Accounts & services',
    links: [
      { label: 'Compare current accounts', href: '#' },
      { label: 'Club Korvantis', href: '#' },
      { label: 'Switch to Korvantis Imperial Bank', href: '#' },
      { label: 'Student account', href: '#' },
    ],
  },
  {
    title: 'Borrowing',
    subtitle: 'Cards, loans & car finance',
    links: [
      { label: 'Credit cards', href: '#' },
      { label: 'Personal loans', href: '#' },
      { label: 'Car finance', href: '#' },
      { label: 'Overdrafts', href: '#' },
    ],
  },
  {
    title: 'Commercial Lending',
    subtitle: 'Accounts & lending',
    links: [
      { label: 'Term Loans', href: '#' },
      { label: 'Business credit line', href: '#' },
      { label: 'Equipment financing', href: '#' },
      { label: 'Commercial real estate', href: '#' },
    ],
  },
  {
    title: 'Savings',
    subtitle: 'Accounts & ISAs',
    links: [
      { label: 'Savings accounts', href: '#' },
      { label: 'Cash ISAs', href: '#' },
      { label: 'Fixed rate bonds', href: '#' },
    ],
  },
  {
    title: 'Investing',
    subtitle: 'Pensions & investments',
    links: [
      { label: 'Investment accounts', href: '#' },
      { label: 'Pensions', href: '#' },
      { label: 'Wealth management', href: '#' },
      { label: 'Share dealing', href: '#' },
    ],
  },
  {
    title: 'Insurance',
    subtitle: 'Home, pet, life, car & health',
    links: [
      { label: 'Home insurance', href: '#' },
      { label: 'Life insurance', href: '#' },
      { label: 'Car insurance', href: '#' },
      { label: 'Pet insurance', href: '#' },
      { label: 'Travel insurance', href: '#' },
    ],
  },
]

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  const currentCategory = menuCategories.find(
    (c) => c.title === (activeCategory || hoveredCategory)
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[110] bg-white overflow-hidden">
      {/* Close button */}
      <div className="container-korvantis flex justify-end pt-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-gray-100 rounded transition-colors"
        >
          <X size={18} />
          Close
        </button>
      </div>

      <div className="container-korvantis flex h-[calc(100vh-80px)]">
        {/* Left Sidebar */}
        <div className="w-full md:w-80 border-r border-gray-200 overflow-y-auto pr-4">
          <nav className="space-y-1">
            {menuCategories.map((category) => (
              <button
                key={category.title}
                onClick={() => setActiveCategory(
                  activeCategory === category.title ? null : category.title
                )}
                onMouseEnter={() => setHoveredCategory(category.title)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left rounded transition-colors ${
                  (activeCategory || hoveredCategory) === category.title
                    ? 'bg-gray-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="font-semibold text-[#1A1A1A]">{category.title}</div>
                  <div className="text-sm text-[#595959]">{category.subtitle}</div>
                </div>
                <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
              </button>
            ))}
          </nav>

          {/* Bottom links */}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
            <Link to="#" className="flex items-center gap-3 px-4 py-2 text-[#1A1A1A] hover:text-[#006A4D] transition-colors">
              <HelpCircle size={18} />
              <span className="font-medium">Help & Support</span>
            </Link>
            <Link to="#" className="flex items-center gap-3 px-4 py-2 text-[#1A1A1A] hover:text-[#006A4D] transition-colors">
              <MapPin size={18} />
              <span className="font-medium">Branch Finder</span>
            </Link>
            <Link to="#" className="flex items-center gap-3 px-4 py-2 text-[#1A1A1A] hover:text-[#006A4D] transition-colors">
              <Accessibility size={18} />
              <span className="font-medium">Accessibility and disability</span>
            </Link>
          </div>
        </div>

        {/* Right Content Panel (Desktop) */}
        <div className="hidden md:block flex-1 pl-8 overflow-y-auto">
          {currentCategory ? (
            <div>
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">
                {currentCategory.title}
              </h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                {currentCategory.links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="py-2 text-sm text-[#1A1A1A] hover:text-[#006A4D] transition-colors"
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Mobile app promo */}
              <div className="mt-8 p-6 bg-gradient-to-br from-[#006A4D] to-[#004D2A] rounded-lg text-white">
                <div className="w-16 h-20 bg-white/20 rounded-lg mb-4 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                    <path d="M12 18h.01" />
                  </svg>
                </div>
                <h4 className="font-semibold text-lg mb-1">Mobile banking app</h4>
                <p className="text-white/80 text-sm mb-4">Join our 10 million app users.</p>
                <button className="btn-primary text-sm">
                  Continue to app
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-4 opacity-40">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                </svg>
                <p className="text-lg font-medium">Select a category</p>
                <p className="text-sm mt-1">Hover over a menu item to see details</p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile: Expandable submenus */}
        <div className="md:hidden fixed inset-0 z-[111] bg-white transform transition-transform"
          style={{
            transform: activeCategory ? 'translateX(0)' : 'translateX(100%)',
          }}
        >
          {activeCategory && (
            <div className="h-full flex flex-col">
              <div className="flex items-center gap-4 p-4 border-b border-gray-200">
                <button
                  onClick={() => setActiveCategory(null)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <ChevronRight size={20} className="rotate-180" />
                </button>
                <h3 className="font-semibold text-lg">{activeCategory}</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {currentCategory?.links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="block py-3 text-[#1A1A1A] border-b border-gray-100"
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
