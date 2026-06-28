import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AlertCircle, X } from 'lucide-react'
import { AuthProvider } from './hooks/AuthContext'
import { ThemeProvider } from './hooks/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import MobileMenu from './components/MobileMenu'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import BusinessPage from './pages/BusinessPage'
import PrivateBankingPage from './pages/PrivateBankingPage'
import InternationalPage from './pages/InternationalPage'
import LoginPage from './pages/auth/LoginPage'
import AdminLoginPage from './pages/auth/AdminLoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import UserDashboard from './pages/dashboard/UserDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import TransferPage from './pages/dashboard/TransferPage'
import SuspendedPage from './pages/dashboard/SuspendedPage'
import SettingsPage from './pages/dashboard/SettingsPage'
import AccountDetailsPage from './pages/dashboard/AccountDetailsPage'

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [cookieAccepted, setCookieAccepted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showSuspensionModal, setShowSuspensionModal] = useState(false)

  const noLayoutPaths = ['/login', '/admin/login', '/register', '/dashboard', '/admin', '/transfer', '/suspended', '/settings', '/account-details']
  const useLayout = !noLayoutPaths.includes(location.pathname)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Listen for account suspension events
  useEffect(() => {
    const handleSuspension = (event: Event) => {
      setShowSuspensionModal(true)
      // Redirect to login after a brief delay to allow modal to be seen
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 3000)
    }
    window.addEventListener('accountSuspended', handleSuspension)
    return () => window.removeEventListener('accountSuspended', handleSuspension)
  }, [navigate])

  useEffect(() => {
    const seoData: Record<string, { title: string; description: string }> = {
      '/': {
        title: 'Personal Banking | Korvantis Imperial Bank',
        description: 'Securely manage your personal banking online with Korvantis Imperial Bank. View balances, transfer funds, and pay bills.'
      },
      '/business': {
        title: 'Business Banking | Korvantis Imperial Bank',
        description: 'Explore tailored commercial accounts, business loans, and expert banking services for enterprise growth with Korvantis Imperial Bank.'
      },
      '/private-banking': {
        title: 'Private Banking | Korvantis Imperial Bank',
        description: 'Exclusive wealth management, dedicated private bankers, and custom financial solutions with Korvantis Imperial Bank Private Banking.'
      },
      '/international': {
        title: 'International Money Transfer | Korvantis Imperial Bank',
        description: 'Send and receive money globally with competitive exchange rates and secure transaction protocols via Korvantis Imperial Bank.'
      },
      '/login': {
        title: 'Log In | Korvantis Imperial Bank Online Banking',
        description: 'Log in securely to your Korvantis Imperial Bank online banking portal to manage your accounts, cards, and payments.'
      },
      '/admin/login': {
        title: 'Admin Portal Log In | Korvantis Imperial Bank',
        description: 'Secure administrator authentication for the Korvantis Imperial Bank admin management portal.'
      },
      '/register': {
        title: 'Register for Online Banking | Korvantis Imperial Bank',
        description: 'Register now for online banking access with Korvantis Imperial Bank. Quick, easy, and secure setup.'
      },
      '/dashboard': {
        title: 'Dashboard | Korvantis Imperial Bank Online Banking',
        description: 'Your Korvantis Imperial Bank customer dashboard. View available balances, link accounts, and access quick actions.'
      },
      '/admin': {
        title: 'Admin Dashboard | Korvantis Imperial Bank Portal',
        description: 'Administrative overview, user account status updates, deposit approvals, and transaction reports for Korvantis Imperial Bank.'
      },
      '/transfer': {
        title: 'Transfer Funds & Pay Bills | Korvantis Imperial Bank',
        description: 'Easily execute domestic and international money transfers, schedule payments, and settle utility bills securely.'
      },
      '/settings': {
        title: 'Account Settings | Korvantis Imperial Bank Profile',
        description: 'Manage your profile details, upload your avatar picture, and configure security preferences for your online banking account.'
      },
      '/suspended': {
        title: 'Account Suspended | Korvantis Imperial Bank Security',
        description: 'Security notification: This account has been suspended under active review. Please contact customer care immediately.'
      }
    }

    const currentSeo = seoData[location.pathname] || {
      title: 'Korvantis Imperial Bank | Secure Online Banking',
      description: 'Securely manage your personal and business banking online with Korvantis Imperial Bank.'
    }

    document.title = currentSeo.title

    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', currentSeo.description)
  }, [location.pathname])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-white">
          {useLayout && (
            <>
              <Navbar
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                scrolled={scrolled}
              />
              <MobileMenu
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
              />
            </>
          )}
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/business" element={<BusinessPage />} />
              <Route path="/private-banking" element={<PrivateBankingPage />} />
              <Route path="/international" element={<InternationalPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute role="customer">
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transfer"
                element={
                  <ProtectedRoute role="customer">
                    <TransferPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/suspended"
                element={
                  <ProtectedRoute>
                    <SuspendedPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute role="customer">
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account-details"
                element={
                  <ProtectedRoute role="customer">
                    <AccountDetailsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          {useLayout && <Footer />}
          {useLayout && !cookieAccepted && (
            <CookieBanner onAccept={() => setCookieAccepted(true)} />
          )}

          {/* Account Suspension Modal */}
          {showSuspensionModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-[#D9E8E1] p-6 text-center animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => setShowSuspensionModal(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition"
                  title="Close"
                >
                  <X size={18} className="text-gray-500" />
                </button>
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                  <AlertCircle className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-red-700 mb-2">Account Suspended</h3>
                <p className="text-sm text-[#4E655D] mb-4 leading-relaxed">
                  Your account has been suspended. You will be redirected to the login page.
                </p>
                <p className="text-xs text-[#667A73]">
                  Please contact customer care immediately to resolve this issue.
                </p>
                <div className="flex flex-col gap-3 mt-6">
                  <a
                    href="mailto:support@korvantisimperial.com?subject=Account Suspension Inquiry"
                    className="w-full py-3.5 bg-[#006A4D] hover:bg-[#004D2A] text-white font-semibold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    Contact Customer Care
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
