import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Apple, Play } from 'lucide-react'

export default function AppSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="section-padding bg-white overflow-hidden" ref={sectionRef} style={{ opacity: 0 }}>
      <div className="container-korvantis">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left: Text Content */}
          <div className="flex-1 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              Your bank in your pocket
            </h2>
            <p className="text-base text-[#595959] mb-8 leading-relaxed">
              Join the 10 million customers who already use our highly rated app.
            </p>
            <Link
              to="#"
              className="inline-flex items-center gap-2 text-[#006A4D] font-semibold hover:underline"
            >
              More about our app
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            {/* App Store Badges */}
            <div className="flex gap-4 mt-8">
              <a href="#" className="flex items-center gap-2 bg-[#1A1A1A] text-white px-4 py-2.5 rounded-lg hover:bg-[#333] transition-colors">
                <Apple size={24} />
                <div className="text-left">
                  <div className="text-[10px] leading-none">Download on the</div>
                  <div className="text-sm font-semibold leading-tight">App Store</div>
                </div>
              </a>
              <a href="#" className="flex items-center gap-2 bg-[#1A1A1A] text-white px-4 py-2.5 rounded-lg hover:bg-[#333] transition-colors">
                <Play size={24} className="fill-current" />
                <div className="text-left">
                  <div className="text-[10px] leading-none">GET IT ON</div>
                  <div className="text-sm font-semibold leading-tight">Google Play</div>
                </div>
              </a>
            </div>
          </div>

          {/* Right: Phone Image */}
          <div className="flex-1 flex justify-center">
            <div className="relative max-w-xs md:max-w-sm">
              <img
                src="/images/phone-app.png"
                alt="Korvantis Imperial Bank Mobile Banking App"
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
