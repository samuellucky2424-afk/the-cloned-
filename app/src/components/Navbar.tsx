import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Lock, Menu, X, Mic } from 'lucide-react'
import Logo from './Logo'

interface NavbarProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  scrolled: boolean;
}

export default function Navbar({ menuOpen, setMenuOpen, scrolled }: NavbarProps) {
  const location = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const topNavItems = [
    { label: 'Personal', path: '/' },
    { label: 'Business', path: '/business' },
    { label: 'Private Banking', path: '/private-banking' },
    { label: 'International', path: '/international' },
  ]

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-[#1A1A1A] text-white relative z-[101]">
        <div className="container-korvantis flex items-center justify-end h-10">
          <nav className="flex items-center gap-0 h-full">
            {topNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2.5 text-sm font-medium transition-colors h-full flex items-center ${
                  location.pathname === item.path
                    ? 'bg-[#006A4D] text-white'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Separator line */}
            <span className="h-4 w-[1px] bg-white/20 mx-2" />

            <Link
              to="/login"
              className="px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors h-full flex items-center gap-1.5"
            >
              <Lock size={14} />
              Log in
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Navigation */}
      <header
        className={`sticky top-0 z-[100] bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        <div className="container-korvantis flex items-center justify-between h-16 md:h-20">
          {/* Left: Logo + Menu */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex-shrink-0">
              <div className="flex items-center gap-2">
                {/* Horse Logo SVG */}
                <svg width="40" height="40" viewBox="0 0 100 100" fill="none" className="flex-shrink-0">
                  <path d="M75 25c-5-8-15-12-25-10-8 2-14 7-18 14l-8 16c-2 4-2 8 0 12l4 8c2 4 6 6 10 6h16c4 0 8-2 10-6l12-20c3-5 3-11 0-16l-1-4z" fill="#1A1A1A"/>
                  <path d="M50 20c-2 0-4 1-5 3l-3 6c-1 2 0 4 2 5l8 4c2 1 4 0 5-2l3-6c1-2 0-4-2-5l-8-4z" fill="#1A1A1A"/>
                  <circle cx="35" cy="35" r="4" fill="#1A1A1A"/>
                  <path d="M25 55c0-5 5-10 10-10s10 5 10 10" stroke="#1A1A1A" strokeWidth="3" fill="none"/>
                </svg>
                <Logo className="h-8 w-auto hidden md:block" />
              </div>
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-gray-100 rounded transition-colors"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
              <span className="hidden sm:inline">{menuOpen ? 'Close' : 'Menu'}</span>
            </button>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex items-center gap-2 text-sm text-[#595959] hover:text-[#1A1A1A] transition-colors"
              >
                <Search size={18} />
                <span>Search</span>
              </button>
              {searchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Switch your current account to Korvantis Imperial Bank"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#006A4D] focus:ring-1 focus:ring-[#006A4D]"
                      autoFocus
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#006A4D]">
                      <Mic size={18} />
                    </button>
                  </div>
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="mt-3 w-full btn-secondary"
                  >
                    Search
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Auth Links (hidden on desktop, as they are moved to the top utility bar) */}
          <div className="flex items-center gap-3 md:hidden">
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#1A1A1A] bg-[#F2F2F2] hover:bg-[#E5E5E5] rounded transition-colors"
              title="Log in"
            >
              <Lock size={16} />
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden container-korvantis pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-[#006A4D] text-sm"
            />
            <Mic className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-[99]"
          onClick={() => setSearchOpen(false)}
        />
      )}
    </>
  )
}
