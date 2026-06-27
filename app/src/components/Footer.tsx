import { Link } from 'react-router-dom'
import { ArrowUp, Twitter, Facebook, Youtube, Instagram } from 'lucide-react'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerLinks = {
    products: [
      { label: 'Current accounts', href: '#' },
      { label: 'Credit cards', href: '#' },
      { label: 'Loans', href: '#' },
      { label: 'Car finance', href: '#' },
      { label: 'Mortgages', href: '#' },
      { label: 'Savings', href: '#' },
      { label: 'ISAs', href: '#' },
      { label: 'Investing', href: '#' },
      { label: 'Pensions', href: '#' },
      { label: 'Wealth management', href: '#' },
      { label: 'Home insurance', href: '#' },
      { label: 'Life insurance', href: '#' },
      { label: 'Car insurance', href: '#' },
      { label: 'Pet insurance', href: '#' },
    ],
    help: [
      { label: 'Banking online', href: '#' },
      { label: 'Mobile banking app', href: '#' },
      { label: 'Service status', href: '#' },
      { label: 'Fraud and security', href: '#' },
      { label: 'Money management', href: '#' },
      { label: 'Life events', href: '#' },
      { label: 'Help and support', href: '#' },
      { label: 'Banking near you', href: '#' },
      { label: 'Virtual assistant', href: '#' },
      { label: 'Call us', href: '#' },
      { label: 'Find a branch', href: '#' },
      { label: 'SignVideo & Signly', href: '#' },
      { label: 'Accessibility & disability', href: '#' },
      { label: 'Feedback & complaints', href: '#' },
    ],
    legal: [
      { label: 'Legal information', href: '#' },
      { label: 'Terms and conditions', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Cookies', href: '#' },
      { label: 'Sitemap', href: '#' },
      { label: 'Modern Slavery Statement', href: '#' },
      { label: 'Financial Services Compensation Scheme', href: '#' },
    ],
    about: [
      { label: 'About Korvantis Imperial Bank', href: '#' },
      { label: 'Diversity, equity & inclusion', href: '#' },
      { label: 'Media centre', href: '#' },
      { label: 'Korvantis Imperial Bank Group', href: '#' },
      { label: 'Careers', href: '#' },
    ],
  }

  return (
    <footer className="bg-[#004D2A] text-white">
      {/* App Banner */}
      <div className="bg-[#006A4D]">
        <div className="container-korvantis py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-24 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <path d="M12 18h.01" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Banking is better in the app</h3>
              <p className="text-white/80 text-sm">It's simple, secure and convenient.</p>
            </div>
          </div>
          <Link to="#" className="btn-primary text-sm whitespace-nowrap">
            More about our app
          </Link>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-korvantis py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Products and services */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Products and services</h4>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/80 hover:text-white link-underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help and security */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Help and security</h4>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/80 hover:text-white link-underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/80 hover:text-white link-underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About us */}
          <div>
            <h4 className="font-semibold text-sm mb-4">About us</h4>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/80 hover:text-white link-underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect with us */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Connect with us</h4>
            <div className="flex gap-3 mb-6">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="YouTube">
                <Youtube size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Back to top */}
        <div className="flex justify-end mt-8 pt-8 border-t border-white/10">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
          >
            Back to top
            <ArrowUp size={16} />
          </button>
        </div>

        {/* FSCS Logo and Legal text */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-16 bg-white rounded flex items-center justify-center">
                <span className="text-[#004D2A] font-bold text-xs text-center leading-tight">FSCS<br/>Protecting<br/>Your Money</span>
              </div>
            </div>
            <div className="text-xs text-white/70 leading-relaxed">
              <p className="mb-4">
                Korvantis Imperial Bank is a trading name of Korvantis Imperial Bank plc. Registered office: 25 Gresham Street, London EC2V 7HN. Registered in England and Wales No. 2065. Korvantis Imperial Bank plc is authorised by the Prudential Regulation Authority and regulated by the Financial Conduct Authority and the Prudential Regulation Authority under registration number 119278.
              </p>
              <p className="mb-4">
                We're part of Korvantis Imperial Bank Group. Some of the products and services on our website are provided by different companies within the Group. You can find more details on our <Link to="#" className="underline hover:text-white">legal information page</Link>.
              </p>
              <p>
                Mobile Banking app: Our app is available to UK personal online banking customers and online banking customers with accounts held in Jersey, the Bailiwick of Guernsey or the Isle of Man. You need to have a valid registered phone number. Minimum operating systems apply, so check the App Store or Google Play for details. Device registration required. The app doesn't work on jailbroken or rooted devices. Terms and conditions apply.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
