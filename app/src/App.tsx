import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
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

function App() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [cookieAccepted, setCookieAccepted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const noLayoutPaths = ['/login', '/admin/login', '/register', '/dashboard', '/admin', '/transfer', '/suspended', '/settings']
  const useLayout = !noLayoutPaths.includes(location.pathname)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
            </Routes>
          </main>
          {useLayout && <Footer />}
          {useLayout && !cookieAccepted && (
            <CookieBanner onAccept={() => setCookieAccepted(true)} />
          )}
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
