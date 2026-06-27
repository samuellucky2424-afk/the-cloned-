import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Lock, Menu, X, Mic } from 'lucide-react'
import Logo from './Logo'

interface NavbarProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  scrolled: boolean;
}

export default function Navbar({ menuOpen, setMenuOpen, scrolled }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')



  return (
    <>
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
                <Logo className="h-6 sm:h-8 w-auto block" />
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

          {/* Right: Log in button — visible on all screen sizes */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#1A1A1A] bg-[#F2F2F2] hover:bg-[#E5E5E5] rounded transition-colors"
            >
              <Lock size={16} />
              <span className="hidden sm:inline">Log in</span>
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
