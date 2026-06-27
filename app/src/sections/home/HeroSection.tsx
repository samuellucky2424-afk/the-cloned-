import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function HeroSection() {
  const contentRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] bg-[#1A1A1A] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-mortgage.jpg"
          alt="Happy couple at their new home"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-korvantis flex items-center min-h-[600px] md:min-h-[700px]">
        <div 
          ref={contentRef}
          className="max-w-xl py-16 md:py-24"
          style={{ opacity: 0 }}
        >
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            $5k Deposit Mortgage
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-4 font-medium">
            Last seen in 1996.
          </p>
          <p className="text-base md:text-lg text-white/80 mb-4 leading-relaxed">
            If you have a deposit of $5,000, you could get on the ladder sooner than you think. Conditions apply.
          </p>
          <p className="text-sm text-white/60 mb-8 leading-relaxed">
            Average first-time buyer deposits were between $4,851 and $4,950 in 1996 based on Office for National Statistics House Price Index data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="#"
              className="btn-primary text-center"
            >
              Start your mortgage journey
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
