import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'

interface CookieBannerProps {
  onAccept: () => void;
}

export default function CookieBanner({ onAccept }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const handleAction = (accept: boolean) => {
    if (accept) {
      onAccept()
    }
    setIsVisible(false)
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-[480px] bg-white rounded-lg shadow-2xl border border-gray-200 z-[1000] p-6">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        aria-label="Close"
      >
        <X size={18} />
      </button>

      <h3 className="font-bold text-lg mb-3">Cookies Consent</h3>

      <div className="space-y-3 text-sm text-[#595959]">
        <p>
          We have to collect some data when you use this website so it works and is secure.
        </p>
        <p>
          We'd also like your consent to collect data on how you use our site. This helps us decide which of our products, services and offers may be relevant for you. It also helps us tailor and measure how effective our ads are on other websites, social media, apps and devices, like Smart TVs.
        </p>
        <p>
          Select 'Accept all' to agree or 'Reject all' to opt out. You can change your mind, or find out more, by visiting our{' '}
          <Link to="#" className="text-[#006A4D] underline hover:no-underline">
            Cookies Policy
          </Link>.
        </p>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          onClick={() => handleAction(true)}
          className="flex-1 btn-secondary py-3"
        >
          Accept all
        </button>
        <button
          onClick={() => handleAction(false)}
          className="flex-1 px-6 py-3 bg-white text-[#1A1A1A] font-semibold text-sm rounded border-2 border-[#1A1A1A] hover:bg-gray-50 transition-colors"
        >
          Reject all
        </button>
      </div>
    </div>
  )
}
