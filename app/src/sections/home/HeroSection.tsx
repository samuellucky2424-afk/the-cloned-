import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function HeroSection() {
  const contentRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] bg-[#1A1A1A] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/business-hero.jpg"
          alt="Modern business building with clean glass architecture"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-seagate flex items-center min-h-[600px] md:min-h-[700px]">
        <div 
          ref={contentRef}
          className="max-w-xl py-16 md:py-24"
          style={{ opacity: 0 }}
        >
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Empowering Your Business
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-4 font-medium">
            Smart commercial and corporate banking solutions.
          </p>
          <p className="text-base md:text-lg text-white/80 mb-4 leading-relaxed">
            Manage cash flow, optimize liquidity, and scale your operations with Seagate Metal's premium commercial suites.
          </p>
          <p className="text-sm text-white/60 mb-8 leading-relaxed">
            All commercial credit facilities and loans are subject to credit approval and underwriting guidelines. Member FDIC.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/login"
              className="btn-primary text-center"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
