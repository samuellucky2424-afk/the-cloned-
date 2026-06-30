import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'

interface NavbarProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  scrolled: boolean;
}

export default function Navbar({ menuOpen, setMenuOpen, scrolled }: NavbarProps) {




  return (
    <>
      {/* Main Navigation */}
      <header
        className={`sticky top-0 z-[100] bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        <div className="container-seagate flex items-center justify-between h-16 md:h-20">
          {/* Left: Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <Logo className="h-6 sm:h-8 w-auto block" />
            </div>
          </Link>

          {/* Right: Menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-gray-100 rounded transition-colors"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
            <span className="hidden sm:inline">{menuOpen ? 'Close' : 'Menu'}</span>
          </button>
        </div>

      </header>
    </>
  )
}
